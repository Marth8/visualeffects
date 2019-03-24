const fragmentShaderSkyboxString =
`
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec3 vPosition;
uniform samplerCube cubeMap;
uniform vec3 uEyePosition;

void main() {
    gl_FragColor = textureCube(cubeMap, vPosition);
}`;

export default fragmentShaderSkyboxString