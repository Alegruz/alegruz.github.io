struct Ray
{
    origin: vec3<f32>,
    direction: vec3<f32>,
};

struct Triangle
{
    vertices: array<vec3<f32>, 3>,
    normal: vec4<f32>,  // 4th component is emissive factor. If 0, then not emissive, if > 0, then emissive
    color: vec3<f32>, // Color of the triangle for shading
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

@group(0) @binding(0)
var<uniform> camera: Camera;
@group(0) @binding(1)
var<storage, read> scene: array<Triangle>;
@group(0) @binding(2)
var<storage, write> output: texture_storage_2d<rgba8unorm, write>;

const FLT_EPSILON: f32 = 1.19209290e-07f;

struct IntersectionResult
{
    hit: bool,
    distance: f32,
    position: vec3<f32>,
}

fn intersect(ray: Ray, triangle: Triangle) -> IntersectionResult
{
    var result: IntersectionResult = IntersectionResult(false, -1.0, vec3<f32>(0.0, 0.0, 0.0));

    let edge0 = triangle.Vertices[1] - triangle.Vertices[0];
    let edge1 = triangle.Vertices[2] - triangle.Vertices[0];
    let rayCrossEdge1 = cross(ray.direction, edge1);
    let determinant = dot(edge0, rayCrossEdge1);
    if(determinant > -FLT_EPSILON && determinant < FLT_EPSILON)
    {
        return result; // Ray is parallel to the triangle
    }

    let inverseDeterminant = 1.0 / determinant;
    let s = ray.origin - triangle.vertices[0];
    let u = dot(s, rayCrossEdge1) * inverseDeterminant;
    if((u < 0.0 && abs(u) > FLT_EPSILON) || (u > 1.0 && abs(u - 1.0) > FLT_EPSILON))
    {
        return result;
    }

    let sCrossEdge0 = cross(s, edge0);
    let v = dot(ray.direction, sCrossEdge0) * inverseDeterminant;
    if((v < 0.0 && abs(v) > FLT_EPSILON) || (u + v > 1.0 && abs(u + v - 1.0) > FLT_EPSILON))
    {
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
    return result;
}

fn evaluateLambert(normal: vec3<f32>, lightDirection: vec3<f32>, color: vec3<f32>) -> vec3<f32>
{
    let diffuseIntensity = max(dot(normal, lightDirection), 0.0);
    return color * diffuseIntensity;
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) globalId: vec3<u32>)
{
    let resolution = vec2<f32>(textureDimensions(output).xy);
    let pixel = vec2<f32>(f32(globalId.x), f32(globalId.y));
    let uv = pixel / resolution;

    let x = (2.0 * uv.x - 1.0) * camera.width / camera.focalLength;
    let y = (1.0 - 2.0 * uv.y) * camera.height / camera.focalLength;

    // Generate primary ray
    let ray = Ray(
        origin: camera.position,
        direction: normalize(x * camera.right + y * camera.up + camera.forward)
    );

    // Initialize pixel color
    var closestDistance = FLT_MAX;
    var closestTriangleIndex: u32 = 0;
    var pixelColor = vec3<f32>(0.0, 0.0, 0.0);

    // Ray generation and scene intersection logic goes here
    // For each triangle in the scene, perform intersection tests
    for(var i = 0; i < scene.length(); i++)
    {
        let triangle = scene[i];
        let intersection = intersect(ray, triangle);
        if(intersection.hit && intersection.distance < closestDistance)
        {
            closestDistance = intersection.distance;
            closestTriangleIndex = u32(i);
        }
    }

    // If a triangle was hit, calculate the color
    if(closestDistance < FLT_MAX)
    {
        let triangle = scene[closestTriangleIndex];
        let normal = triangle.normal;
        let lightDirection = normalize(vec3<f32>(1.0, -1.0, -1.0)); // Example light direction
        let color = triangle.color; // Get the color from the triangle

        // Evaluate Lambertian shading
        pixelColor = evaluateLambert(normal, lightDirection, color);
    }
    else
    {
        // Background color if no intersection
        pixelColor = vec3<f32>(0.0, 0.0, 0.0); // Black background
    }

    // Write the final pixel color to the output texture
    output.write(globalId.xy, vec4<f32>(pixelColor, 1.0));
}