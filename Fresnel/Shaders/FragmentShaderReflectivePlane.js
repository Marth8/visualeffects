const fragmentShaderDepthPlaneString =
`
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 vTexcoord;
uniform sampler2D uTexture;
void main() {
    gl_FragColor = vec4(vec3(texture2D(uTexture, vTexcoord).xyz), 1.0);
}`;

export default fragmentShaderDepthPlaneString