const fragmentShaderEnvString = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec3 uColor;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 xPosition;
uniform vec3 uEyePosition;
uniform samplerCube skybox;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 I = normalize(xPosition - uEyePosition);
    vec3 R = reflect(I, normal);
    gl_FragColor = textureCube(skybox, R);
}`;