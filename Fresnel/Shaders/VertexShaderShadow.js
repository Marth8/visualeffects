const vertexShaderShadowString = 
`
uniform mat4 uTransform;
attribute vec3 aPosition;
varying vec4 vProjCoord;

void main() {
    gl_Position = uTransform * vec4(aPosition, 1.0);;
}
`;

export default vertexShaderShadowString