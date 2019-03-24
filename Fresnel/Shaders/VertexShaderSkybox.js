const vertexShaderSkyboxString = 
`
uniform mat4 uTransform;
attribute vec3 aPosition;
varying vec3 vPosition;

void main() {
    vPosition = aPosition;
    gl_Position = (uTransform * vec4(aPosition, 1.0)).xyww;
}
`;

export default vertexShaderSkyboxString