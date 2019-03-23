const fragmentShaderShadowString = 
`
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec4 vProjCoord;
void main() {
}
`;

export default fragmentShaderShadowString