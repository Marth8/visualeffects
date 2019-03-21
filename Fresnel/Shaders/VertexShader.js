const vertexShaderString =
`
attribute vec3 aPosition;
attribute vec2 aTexCoord;
attribute vec3 aNormal;

uniform mat4 uTransform;
uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uModelMatrix; 
uniform mat4 lightSpaceMatrix;

varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 xPosition;
varying vec4 vPositionLightSpace;

void main() { 
    vNormal = (uNormalMatrix * vec4(aNormal, 0.0)).xyz;
    vPosition = (uModelViewMatrix * vec4(aPosition, 1.0)).xyz;
    xPosition = (uModelMatrix * vec4(aPosition, 1.0)).xyz;
    vTexCoord = aTexCoord;
    gl_PointSize = 10.0;
    gl_Position = uTransform * vec4(aPosition, 1.0);
    vPositionLightSpace = lightSpaceMatrix * vec4(xPosition, 1.0);
}`;

export default vertexShaderString