@group(0) @binding(0) var colorBuffer : texture_2d<f32>;
@group(0) @binding(1) var accumulationBufferToRead : texture_2d<f32>;
@group(0) @binding(2) var accumulationBufferToWrite : texture_storage_2d<rgba8unorm, write>;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) globalId: vec3<u32>)
{
    let resolution = vec2<f32>(textureDimensions(colorBuffer).xy);
    let pixel = vec2<f32>(f32(globalId.x), f32(globalId.y));
    let uv = pixel / resolution;

    let temporalAccumulationRadius: i32 = 3;

    let prevColor: vec4<f32> = textureLoad(accumulationBufferToRead, vec2<i32>(pixel), 0);
    var neighborMinColor = vec3(1.0, 1.0, 1.0);
    var neighborMaxColor = vec3(0.0, 0.0, 0.0);
    for(var offsetY: i32 = -temporalAccumulationRadius; offsetY <= temporalAccumulationRadius; offsetY++)
    {
        for(var offsetX: i32 = -temporalAccumulationRadius; offsetX <= temporalAccumulationRadius; offsetX++)
        {
            let neighborX: u32 = u32(i32(pixel.x) + offsetX);
            let neighborY: u32 = u32(i32(pixel.y) + offsetY);

            if (neighborX < 0 || f32(neighborX) >= resolution.x ||
                neighborY < 0 || f32(neighborY) >= resolution.y)
            {
                continue; // Skip out-of-bounds neighbors
            }

            let neighborColor = textureLoad(accumulationBufferToRead, vec2<i32>(i32(neighborX), i32(neighborY)), 0);
            if (offsetX == -temporalAccumulationRadius && offsetY == -temporalAccumulationRadius)
            {
                neighborMinColor = neighborColor.rgb;
                neighborMaxColor = neighborColor.rgb;
            }
            else
            {
                neighborMinColor = min(neighborMinColor, neighborColor.rgb);
                neighborMaxColor = max(neighborMaxColor, neighborColor.rgb);
            }
        }
    }

    let clampedColor = clamp(prevColor.xyz, neighborMinColor.xyz, neighborMaxColor.xyz);
    var alpha: f32 = 0.1;
    // if(context.NumSamples > 1)
    // {
    //     alpha = 1.0 / f32(context.NumSamples + 1);
    // }
    var color: vec3<f32> = textureLoad(colorBuffer, vec2<i32>(pixel), 0).rgb;
    color = mix(color, clampedColor, alpha);
    textureStore(accumulationBufferToWrite, vec2<i32>(pixel), vec4<f32>(color, 1.0));
}