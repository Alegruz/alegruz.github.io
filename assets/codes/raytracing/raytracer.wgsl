struct Ray
{
    origin: vec3<f32>,
    direction: vec3<f32>,
};

struct Triangle
{
    vertices: array<vec4<f32>, 3>,
    normal: vec4<f32>,  // 4th component is emissive factor. If 0, then not emissive, if > 0, then emissive
    color: vec4<f32>, // Color of the triangle for shading
};

struct Camera
{
    position: vec3<f32>,
    forward: vec3<f32>,
    right: vec3<f32>,
    up: vec3<f32>,
    focalLength: f32,
    width: f32,
    height: f32,
};

struct FrameInput
{
    randomSeed: u32, // Seed for random number generation
}

@group(0) @binding(0)
var<uniform> gCamera: Camera;
@group(0) @binding(1)
var<uniform> gFrameInput: FrameInput; // Frame input for random seed
@group(0) @binding(2)
var<storage, read> gScene: array<Triangle>;
@group(0) @binding(3)
var<storage, read> gEmissives: array<Triangle>;
@group(0) @binding(4)
var gOutput: texture_storage_2d<rgba8unorm, write>;

const FLT_EPSILON: f32 = 1.19209290e-07f;
const FLT_MAX: f32 = 1e20;

struct IntersectionResult
{
    distance: f32,
    position: vec3<f32>,
    result: u32,
}

struct HitResult
{
    color: vec3<f32>,
    triangleIndex: i32,
    bIsEmissive: bool,
    position: vec3<f32>,
    normal: vec3<f32>,
    distance: f32
}

struct RenderContext
{
    traceDepth: u32,
    maxTraceDepth: u32,
    seed: u32,
}

fn intersect(ray: Ray, triangle: Triangle) -> IntersectionResult
{
    var result: IntersectionResult = IntersectionResult(-1.0, vec3<f32>(0.0, 0.0, 0.0), 0u);

    let edge0 = triangle.vertices[1].xyz - triangle.vertices[0].xyz;
    let edge1 = triangle.vertices[2].xyz - triangle.vertices[0].xyz;
    let rayCrossEdge1 = cross(ray.direction, edge1);
    let determinant = dot(edge0, rayCrossEdge1);
    if(determinant > -FLT_EPSILON && determinant < FLT_EPSILON)
    {
        result.result = 1u; // Ray is parallel to the triangle
        return result; // Ray is parallel to the triangle
    }

    let inverseDeterminant = 1.0 / determinant;
    let s = ray.origin - triangle.vertices[0].xyz;
    let u = dot(s, rayCrossEdge1) * inverseDeterminant;
    if((u < 0.0 && abs(u) > FLT_EPSILON) || (u > 1.0 && abs(u - 1.0) > FLT_EPSILON))
    {
        result.result = 2u; // Intersection is outside the triangle
        return result;
    }

    let sCrossEdge0 = cross(s, edge0);
    let v = dot(ray.direction, sCrossEdge0) * inverseDeterminant;
    if((v < 0.0 && abs(v) > FLT_EPSILON) || (u + v > 1.0 && abs(u + v - 1.0) > FLT_EPSILON))
    {
        result.result = 3u; // Intersection is outside the triangle
        return result;
    }

    result.distance = dot(edge1, sCrossEdge0) * inverseDeterminant;
    if(result.distance > FLT_EPSILON)
    {
        // Return the intersection point
        result.position = ray.origin + ray.direction * result.distance;
        return result;
    }

    result.distance = -1.0; // No intersection found
    result.result = 4u; // No intersection found
    return result;
}

fn evaluateLambert(normal: vec3<f32>, lightDirection: vec3<f32>, color: vec3<f32>) -> vec3<f32>
{
    let diffuseIntensity = max(dot(normal, lightDirection), 0.0);
    return color * diffuseIntensity;
}

fn getClosestHitTriangle(ray: Ray) -> HitResult
{
    var hitResult = HitResult(vec3<f32>(0.0, 0.0, 0.0), -1, false, vec3<f32>(0.0, 0.0, 0.0), vec3<f32>(0.0, 0.0, 0.0), -1.0);
    var closestDistance = FLT_MAX;
    var closestTriangleIndex: i32 = -1;

    for(var i: u32 = 0u; i < arrayLength(&gScene); i++)
    {
        let triangle = gScene[i];
        let intersection = intersect(ray, triangle);
        if(intersection.distance > 0.0 && intersection.distance < closestDistance)
        {
            closestDistance = intersection.distance;
            closestTriangleIndex = i32(i);
            hitResult.position = intersection.position;
            hitResult.normal = triangle.normal.xyz; // Extract normal from the triangle
            hitResult.distance = intersection.distance;
            hitResult.color = triangle.color.xyz; // Use the color from the triangle
        }
    }

    for(var i: u32 = 0u; i < arrayLength(&gEmissives); i++)
    {
        let triangle = gEmissives[i];
        let intersection = intersect(ray, triangle);
        if(intersection.distance > 0.0 && intersection.distance < closestDistance)
        {
            closestDistance = intersection.distance;
            closestTriangleIndex = i32(i);
            hitResult.bIsEmissive = true; // Mark as emissive
            hitResult.position = intersection.position;
            hitResult.normal = triangle.normal.xyz; // Extract normal from the triangle
            hitResult.distance = intersection.distance;
            hitResult.color = triangle.color.xyz; // Use the color from the triangle
        }
    }

    if(closestTriangleIndex >= 0)
    {
        hitResult.triangleIndex = closestTriangleIndex;
    }

    return hitResult;
}

fn wang_hash(seed: ptr<function, u32>) -> u32
{
    *seed = (*seed ^ 61u) ^ (*seed >> 16u);
    *seed *= 9u;
    *seed = *seed ^ (*seed >> 4u);
    *seed *= 0x27d4eb2du;
    *seed = *seed ^ (*seed >> 15u);
    return *seed;
}

fn float_from_u32(x: u32) -> f32
{
    return f32(x) / 4294967296.0; // 2^32
}

fn random(seed: ptr<function, u32>) -> f32
{
    let result = float_from_u32(wang_hash(seed));
    *seed = *seed + 1u; // Increment seed for next random number
    return result;
}

fn getPointByBarycentricCoordinates(triangle: Triangle, barycentric: vec3<f32>) -> vec3<f32>
{
    return triangle.vertices[0].xyz * barycentric.x + triangle.vertices[1].xyz * barycentric.y + triangle.vertices[2].xyz * barycentric.z;
}

fn onClosestHit(ray: Ray, hitResult: HitResult, renderContext: ptr<function, RenderContext>) -> vec3<f32>
{
    var color = vec3<f32>(0.0, 0.0, 0.0);
    if(hitResult.triangleIndex >= 0)
    {
        if(hitResult.bIsEmissive)
        {
            color = hitResult.color; // Use the color from the triangle
        }
        else
        {
            var intensity: vec3<f32> = vec3<f32>(0.0, 0.0, 0.0);
            for(var i: u32 = 0u; i < arrayLength(&gEmissives); i++)
            {
                let triangle = gEmissives[i];
                var shadowRay: Ray;
                shadowRay.origin = hitResult.position;
                var randomBarycentric: vec3<f32> = vec3<f32>(random(&renderContext.seed), 0.0, 0.0);
                randomBarycentric.y = random(&renderContext.seed) * (1.0 - randomBarycentric.x);
                randomBarycentric.z = 1.0 - (randomBarycentric.x + randomBarycentric.y); // Ensure barycentric coordinates sum to 1.0
                var pointOnLightTriangle = getPointByBarycentricCoordinates(triangle, randomBarycentric);
                shadowRay.direction = normalize(pointOnLightTriangle - hitResult.position);
                shadowRay.origin += shadowRay.direction * 0.1f; // Offset to avoid self-intersection

                var shadowHitResult = getClosestHitTriangle(shadowRay);
                if(shadowHitResult.triangleIndex >= 0 && shadowHitResult.bIsEmissive == true && shadowHitResult.triangleIndex == i32(i))
                {
                    var lightColor = shadowHitResult.color; // Use the color from the emissive triangle   
                    // If the shadow ray hits an emissive geometry, we can consider it lit
                    let lambertian = max(dot(shadowRay.direction, hitResult.normal), 0.0);
                    lightColor *= lambertian; // Scale light color by Lambertian reflectance
                    intensity += lightColor; // Add light color
                }
            }
            color = intensity * hitResult.color; // Scale the triangle color by the intensity from the emissive triangles
        }
    }
    return color;
}

fn onMiss() -> vec3<f32>
{
    // Handle ray miss logic here, e.g., return background color
    return vec3<f32>(1.0, 1.0, 1.0); // Background color (white)
}

fn traceRay(ray: Ray, renderContext: ptr<function, RenderContext>) -> vec3<f32>
{
    renderContext.traceDepth += 1;
    if(renderContext.traceDepth > renderContext.maxTraceDepth)
    {
        return vec3<f32>(0.0, 0.0, 0.0); // Return early if max trace depth is reached
    }

    var hitResult = getClosestHitTriangle(ray);
    if(hitResult.triangleIndex >= 0)
    {
        hitResult.color = onClosestHit(ray, hitResult, renderContext);
    }
    else
    {
        hitResult.color = onMiss(); // Handle ray miss logic
    }

    return hitResult.color;
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) globalId: vec3<u32>)
{
    let resolution = vec2<f32>(textureDimensions(gOutput).xy);
    let pixel = vec2<f32>(f32(globalId.x), f32(globalId.y));
    let uv = pixel / resolution;
    let textureStoreUv: vec2<i32> = vec2<i32>(i32(globalId.x), i32(resolution.y) - 1 - i32(globalId.y));

    let pixelSize = vec2<f32>(gCamera.width / resolution.x, gCamera.height / resolution.y);
    let focalLeftBottom = gCamera.position + (gCamera.forward * gCamera.focalLength) -
        (gCamera.right * gCamera.width / 2.0) -
        (gCamera.up * gCamera.height / 2.0);
    let focalRightTop = gCamera.position + (gCamera.forward * gCamera.focalLength) +
        (gCamera.right * gCamera.width / 2.0) +
        (gCamera.up * gCamera.height / 2.0);

    var seed: u32 = (globalId.x + globalId.y * u32(resolution.x)) ^ gFrameInput.randomSeed; // Use frame input seed for randomness
    
    let jitter = vec2<f32>(
        random(&seed),
        random(&seed) // Use a different seed for the second component to avoid identical jitters
    );

    // jitters[sampleIndex] = {
    //     UniformRandomGenerator::GetRandomNumber(),
    //     UniformRandomGenerator::GetRandomNumber()
    // };

    // for (uint32_t jitterIndex = 0; jitterIndex < context.NumSamples; ++jitterIndex)
    // {
    //     if (jitterIndex == sampleIndex)
    //     {
    //         continue;
    //     }

    //     if (jitters[sampleIndex].X == jitters[jitterIndex].X &&
    //         jitters[sampleIndex].Y == jitters[jitterIndex].Y)
    //     {
    //         jitters[sampleIndex] = {
    //             UniformRandomGenerator::GetRandomNumber(),
    //             UniformRandomGenerator::GetRandomNumber()
    //         };
    //         jitterIndex = 0; // Restart the loop to check against all other jitters
    //     }
    // }
    let pixelPosition = vec3<f32>(
        mix(focalLeftBottom.x, focalRightTop.x, (pixel.x + jitter.x) / resolution.x),
        mix(focalLeftBottom.y, focalRightTop.y, (pixel.y + jitter.y) / resolution.y),
        mix(focalLeftBottom.z, focalRightTop.z, 0.5f),
    );

    // Generate primary ray
    let rayDirection = normalize(pixelPosition - gCamera.position);
    let ray: Ray = Ray(
        gCamera.position,
        rayDirection
    );

    var renderContext: RenderContext = RenderContext(0u, 1u, seed); // Example max trace depth of 1
    var pixelColor: vec3<f32> = traceRay(ray, &renderContext);

    // Write the final pixel color to the gOutput texture
    textureStore(gOutput, textureStoreUv, vec4<f32>(pixelColor, 1.0));
    // let triangleIndex = 4*2;
    // let vertexIndex = 1; // Example vertex index to store
    // Store the vertex position of the triangle for debugging
    // textureStore(gOutput, textureStoreUv, vec4<f32>(gScene[triangleIndex].vertices[vertexIndex].x / 559.2, gScene[triangleIndex].vertices[vertexIndex].y / 548.8, 0.0, 1.0));
    // textureStore(gOutput, textureStoreUv, gScene[triangleIndex].color);

    // DEBUGGING
    // 1. uv
    // textureStore(gOutput, textureStoreUv, vec4<f32>(uv.x, uv.y, 0.0, 1.0));
    // 1.1. resolution
    // if(abs(resolution.x - 720.0) > FLT_EPSILON || abs(resolution.y - 720.0) > FLT_EPSILON)
    // {
    //     textureStore(gOutput, textureStoreUv, vec4<f32>(1.0, 0.0, 0.0, 1.0));
    // }
    // 2. Camera
    // 2.1. Camera size
//     -		CAMERA	{Position={X=278.000000 Y=273.000000 Z=-800.000000 } Direction={X=0.00000000 Y=0.00000000 Z=1.00000000 } ...}	Camera
// +		Position	{X=278.000000 Y=273.000000 Z=-800.000000 }	raytracing::Vector<float,3>
// +		Direction	{X=0.00000000 Y=0.00000000 Z=1.00000000 }	raytracing::Vector<float,3>
// +		UpDirection	{X=0.00000000 Y=1.00000000 Z=0.00000000 }	raytracing::Vector<float,3>
// 		FocalLength	0.0350000001	float
// 		Width	0.0250000004	float
// 		Height	0.0250000004	float
    // if(abs(gCamera.position.x - 278.0) > FLT_EPSILON || abs(gCamera.position.y - 273.0) > FLT_EPSILON || abs(gCamera.position.z + 800.0) > FLT_EPSILON)
    // {
    //     // If focal length is zero, just store the ray direction
    //     textureStore(gOutput, textureStoreUv, vec4<f32>(1.0f, 0.0f, 0.0f, 1.0));
    // }
    // else if (gCamera.forward.x != 0.0 || gCamera.forward.y != 0.0 || gCamera.forward.z != 1.0)
    // {
    //     // If focal length is zero, just store the ray direction
    //     textureStore(gOutput, textureStoreUv, vec4<f32>(0.0f, 1.0f, 0.0f, 1.0));
    // }
    // else if (gCamera.right.x != -1.0 || gCamera.right.y != 0.0 || gCamera.right.z != 0.0)
    // {
    //     // If focal length is zero, just store the ray direction
    //     textureStore(gOutput, textureStoreUv, vec4<f32>(0.0f, 0.0f, 1.0f, 1.0));
    // }
    // else if (gCamera.up.x != 0.0 || gCamera.up.y != 1.0 || gCamera.up.z != 0.0)
    // {
    //     // If focal length is zero, just store the ray direction
    //     textureStore(gOutput, vec2<i32>(globalId.xy), vec4<f32>(1.0f, 1.0f, 1.0f, 1.0));
    // }
    // else if (abs(gCamera.focalLength - 0.035f) > FLT_EPSILON)
    // {
    //     // If focal length is zero, just store the ray direction
    //     textureStore(gOutput, textureStoreUv, vec4<f32>(0.5f, 0.5f, 0.5f, 1.0));
    // }
    // else if (abs(gCamera.width - 0.025f) > FLT_EPSILON || abs(gCamera.height - 0.025f) > FLT_EPSILON)
    // {
    //     // If focal length is zero, just store the ray direction
    //     textureStore(gOutput, textureStoreUv, vec4<f32>(0.66f, 0.5f, 0.33f, 1.0));
    // }
    // else
    // {
    //     textureStore(gOutput, textureStoreUv, vec4<f32>(uv.x, uv.y, 0.0, 1.0));
    // }
    // // else
    //  if(abs(focalLeftBottom.x - 278.012512) > 0.1f || abs(focalLeftBottom.y - 272.987488) > 0.1f || abs(focalLeftBottom.z + 799.965027) > 0.1f)
    // {
    //     // If focal length is zero, just store the ray direction
    //     textureStore(gOutput, vec2<i32>(globalId.xy), vec4<f32>(1.0f, 0.0f, 1.0f, 1.0));
    // }
    // else if (abs(focalRightTop.x - 277.987488) > 0.1f || abs(focalRightTop.y - 273.012512) > 0.1f || abs(focalRightTop.z + 799.965027) > 0.1f)
    // {
    //     // If focal length is zero, just store the ray direction
    //     textureStore(gOutput, vec2<i32>(globalId.xy), vec4<f32>(0.0f, 1.0f, 1.0f, 1.0));
    // }
    // else
    // // {
    //     // let debugColor = normalize(pixelSize);
    //     // textureStore(gOutput, vec2<i32>(globalId.xy), vec4<f32>(debugColor.x, debugColor.y, 0.0, 1.0));
    // // }
    
    {
        // Store the pixel color
        // textureStore(gOutput, textureStoreUv, vec4<f32>(clamp((rayDirection.x + 1.0f) * 0.5f, 0.0f, 1.0f), clamp((rayDirection.y + 1.0f) * 0.5f, 0.0f, 1.0f), 0.0f, 1.0));
    //     // let normalizedPixelPosition = normalize(gCamera.position);
    //     // textureStore(gOutput, vec2<i32>(globalId.xy), vec4<f32>(normalizedPixelPosition.x, normalizedPixelPosition.y, normalizedPixelPosition.z, 1.0));
    //     // textureStore(gOutput, vec2<i32>(globalId.x, i32(resolution.y) - 1 - globalId.y), vec4<f32>(uv.x, uv.y, 0.0, 1.0));
    }
}