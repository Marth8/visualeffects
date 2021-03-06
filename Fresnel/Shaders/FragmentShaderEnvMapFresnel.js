const fragmentShaderEnvMapFresnelString =
`
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec3 uColor;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 xPosition;
varying vec4 vPositionLightSpace;
uniform sampler2D shadowMap;
uniform vec3 uEyePosition;
uniform samplerCube envBox;
uniform float uAlpha;
struct DirectionalLight
{
    vec3 color;

    vec3 position;
    vec3 direction;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;

    int isOn;
};
struct PointLight
{
    vec3 color;

    vec3 position;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;

    float constant;
    float linear;
    float quadratic;

    int isOn;
};
struct Material
{
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
    float metalness;
};

uniform Material material;
uniform DirectionalLight dLight;
uniform PointLight pLight;
vec3 GetDirectionalLight(DirectionalLight dLight, vec3 normal);
vec3 GetPointLight(PointLight pLight, vec3 normal);
void main() {
    vec3 normal = normalize(vNormal);

    // compute light intensity
    vec3 result = GetDirectionalLight(dLight, normal);
    result += GetPointLight(pLight, normal);

    // compute normal color
    vec3 refractColor = result * uColor;

    // compute reflect color
    vec3 incident = normalize(xPosition - uEyePosition);
    vec3 reflect = reflect(incident, normal);
    vec3 reflectColor = vec3(textureCube(envBox, reflect)) * result;

    // set f0 for dialetics (approximation of F0 value)
    vec3 F0 = vec3(0.04);
    F0 = mix(F0, uColor, material.metalness);

    // computer fresnel by schlick
    float fresnelPower = 1.0;
    vec3 fresnel = F0 + (1.0 - F0) * pow(1.0 - dot(-incident, normal), fresnelPower);

    // compute color with lerp
    vec3 color = mix(refractColor, reflectColor, fresnel);
    
    gl_FragColor = vec4(color, uAlpha);
}

vec3 GetDirectionalLight(DirectionalLight dLight, vec3 normal)
{
    if(dLight.isOn != 1) {
        return vec3(0,0,0);
    }

    vec3 ambient = dLight.ambient * material.ambient * dLight.color;

    vec3 lightDir = normalize(-dLight.direction);
    float nDotL = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = dLight.diffuse * (nDotL * material.diffuse * dLight.color);

    vec3 viewDir = normalize(uEyePosition - xPosition);
    vec3 halfway = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfway), 0.0), material.shininess);
    vec3 specular = dLight.specular * (spec * material.specular * dLight.color);
    
    // calculate lighting
    vec3 lighting = (ambient + (1.0) * (diffuse + specular));  

    return lighting;
}

vec3 GetPointLight(PointLight pLight, vec3 normal)
{
    if(pLight.isOn != 1) {
        return vec3(0,0,0);
    }

    vec3 ambient = pLight.ambient * material.ambient * pLight.color;

    vec3 lightDir = normalize(pLight.position - xPosition);
    float nDotL = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = pLight.diffuse * (nDotL * material.diffuse * pLight.color);

    vec3 viewDir = normalize(uEyePosition - xPosition);
    vec3 halfway = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfway), 0.0), material.shininess);
    vec3 specular = pLight.specular * (spec * material.specular * pLight.color);

    float distance = length(pLight.position - xPosition);
    float attenuation = 1.0 / (pLight.constant + pLight.linear * distance + pLight.quadratic * (distance * distance));

    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;

    return (diffuse + ambient + specular);
}`;

export default fragmentShaderEnvMapFresnelString