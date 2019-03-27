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
uniform mat3 inverseViewTransform;
uniform samplerCube envBox;
void main() {
    vec3 normal = normalize(vNormal);
    vec3 I = normalize(xPosition - uEyePosition);
    vec3 R = reflect(I, normal);
    vec3 T = inverseViewTransform * R;
    gl_FragColor = textureCube(envBox, R);
}`;

export default fragmentShaderEnvString