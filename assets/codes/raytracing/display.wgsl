@group(0) @binding(0) var sampler0 : sampler;
@group(0) @binding(1) var texture0 : texture_2d<f32>;

@fragment
fn fs_main(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32>
{
    // Sample the texture using the provided sampler and UV coordinates
    let uv = pos.xy / vec2<f32>(canvasWidth, canvasHeight);
    let color = textureSample(texture0, sampler0, uv);
    return vec4<f32>(pow(color.rgb, vec3<f32>(1.0 / 2.2)), 1.0); // Return the sampled color with full opacity
}