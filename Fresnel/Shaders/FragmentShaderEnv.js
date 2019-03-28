const fragmentShaderEnvString =
`
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec3 uColor;
uniform float uAlpha;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 xPosition;
varying vec4 vPositionLightSpace;
uniform vec3 uEyePosition;
uniform samplerCube envBox;
void main() {
    vec3 normal = normalize(vNormal);
    vec3 incident = normalize(xPosition - uEyePosition);
    vec3 reflect = reflect(incident, normal);
    gl_FragColor = textureCube(envBox, reflect);
}`;

export default fragmentShaderEnvString