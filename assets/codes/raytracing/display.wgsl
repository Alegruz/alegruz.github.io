@group(0) @binding(0) var sampler0 : sampler;
@group(0) @binding(1) var texture0 : texture_2d<f32>;

@vertex
fn vs_main(@builtin(vertex_index) index: u32) -> @builtin(position) vec4<f32> {
    var pos = array<vec2<f32>, 6>(
        vec2<f32>(-1.0, -1.0), vec2<f32>(1.0, -1.0), vec2<f32>(-1.0, 1.0),
        vec2<f32>(-1.0, 1.0), vec2<f32>(1.0, -1.0), vec2<f32>(1.0, 1.0)
    );
    return vec4<f32>(pos[index], 0.0, 1.0);
}

@fragment
fn fs_main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
    let dims = vec2<f32>(textureDimensions(texture0));
    let uv = fragCoord.xy / dims;
    let color = textureSample(texture0, sam, uv);
    return vec4<f32>(pow(color.rgb, vec3<f32>(1.0 / 2.2)), 1.0);
}