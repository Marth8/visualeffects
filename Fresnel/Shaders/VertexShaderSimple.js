const vertexShaderSimpleString =
`
attribute vec3 aPosition;
attribute vec2 aTexCoord;
attribute vec3 aNormal;

uniform mat4 uTransform;
uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uModelMatrix; 

varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 xPosition;

void main() { 
    vNormal = (uNormalMatrix * vec4(aNormal, 0.0)).xyz;
    vPosition = (uModelViewMatrix * vec4(aPosition, 1.0)).xyz;
    xPosition = (uModelMatrix * vec4(aPosition, 1.0)).xyz;
    vTexCoord = (uModelMatrix * vec4(aTexCoord, 1.0, 1.0)).xy;
    
    gl_PointSize = 10.0;
    gl_Position = uTransform * vec4(aPosition, 1.0);
}`;

export default vertexShaderSimpleString