const vertexShaderDepthPlaneString =
`
attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexcoord;

void main() { 
    vTexcoord = aTexCoord;
    gl_Position = vec4(aPosition.xy, 0.0, 1.0);
}`;

export default vertexShaderDepthPlaneString