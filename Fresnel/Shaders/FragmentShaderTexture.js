const fragmentShaderTextureString =
`
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 xPosition;
varying vec2 vTexCoord;
varying vec4 vPositionLightSpace;
uniform sampler2D shadowMap;
uniform vec3 uEyePosition;
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
struct SpotLight
{
    vec3 color;

    vec3 direction;
    vec3 position;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;

    float cutOff;

    int isOn;
};
struct Material
{
    sampler2D diffuse;
    sampler2D specular;
    vec3 ambient;
    float shininess;
};

uniform Material material;
uniform DirectionalLight dLight;
uniform PointLight pLight;
uniform SpotLight sLight;

vec3 GetDirectionalLight(DirectionalLight dLight, vec3 normal);
vec3 GetPointLight(PointLight pLight, vec3 normal);
vec3 GetSpotLight(SpotLight sLight, vec3 normal);
float ShadowCalculation(vec4 vPositionLightSpace, vec3 normal, vec3 lightDir);

void main() {
    vec3 result = GetDirectionalLight(dLight, normalize(vNormal));
    result += GetPointLight(pLight, normalize(vNormal));
    result += GetSpotLight(sLight, normalize(vNormal));
    gl_FragColor = vec4(result, 1.0);
}

vec3 GetDirectionalLight(DirectionalLight dLight, vec3 normal)
{
    if(dLight.isOn != 1) {
        return vec3(0,0,0);
    }

    vec3 ambient = dLight.ambient * vec3(texture2D(material.diffuse, vTexCoord))  * dLight.color;

    vec3 lightDir = normalize(-dLight.direction);
    float nDotL = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = dLight.diffuse * (nDotL * vec3(texture2D(material.diffuse, vTexCoord)) * dLight.color);

    vec3 viewDir = normalize(uEyePosition - xPosition);
    vec3 halfway = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfway), 0.0), material.shininess);
    vec3 specular = dLight.specular * (spec * vec3(texture2D(material.specular, vTexCoord)) * dLight.color);
    
    // calculate shadow
    float shadow = ShadowCalculation(vPositionLightSpace, normal, lightDir);       
    vec3 lighting = (ambient + (1.0 - shadow) * (diffuse + specular));  

    return lighting;
}

vec3 GetPointLight(PointLight pLight, vec3 normal)
{
    if(pLight.isOn != 1) {
        return vec3(0,0,0);
    }

    vec3 ambient = pLight.ambient * vec3(texture2D(material.diffuse, vTexCoord)) * pLight.color;

    vec3 lightDir = normalize(pLight.position - xPosition);
    float nDotL = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = pLight.diffuse * (nDotL * vec3(texture2D(material.diffuse, vTexCoord)) * pLight.color);

    vec3 viewDir = normalize(uEyePosition - xPosition);
    vec3 halfway = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfway), 0.0), material.shininess);
    vec3 specular = pLight.specular * (spec * vec3(texture2D(material.specular, vTexCoord)) * pLight.color);

    float distance = length(pLight.position - xPosition);
    float attenuation = 1.0 / (pLight.constant + pLight.linear * distance + pLight.quadratic * (distance * distance));

    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;

    return (diffuse + ambient + specular);
}

vec3 GetSpotLight(SpotLight sLight, vec3 normal)
{
    if(sLight.isOn != 1) {
        return vec3(0,0,0);
    }
    vec3 lightDir = normalize(sLight.position - xPosition);

    float theta = dot(lightDir, normalize(-sLight.direction));

    if (theta > sLight.cutOff)
    {
        vec3 ambient = sLight.ambient * vec3(texture2D(material.diffuse, vTexCoord)) * sLight.color;

        vec3 lightDir = normalize(-sLight.direction);
        float nDotL = max(dot(normal, lightDir), 0.0);
        vec3 diffuse = sLight.diffuse * (nDotL * vec3(texture2D(material.diffuse, vTexCoord)) * sLight.color);

        vec3 viewDir = normalize(uEyePosition - xPosition);
        vec3 halfway = normalize(lightDir + viewDir);
        float spec = pow(max(dot(normal, halfway), 0.0), material.shininess);
        vec3 specular = sLight.specular * (spec * vec3(texture2D(material.specular, vTexCoord)) * sLight.color);
        
        return (diffuse + ambient + specular);
    }
    else
    {
        return sLight.ambient * material.ambient * sLight.color;
    }
}

float ShadowCalculation(vec4 vPositionLightSpace, vec3 normal, vec3 lightDir)
{
    vec3 projCoords = vPositionLightSpace.xyz / vPositionLightSpace.w;    
    projCoords = projCoords * 0.5 + 0.5;
    
    float closestDepth = texture2D(shadowMap, projCoords.xy).r; 
    float currentDepth = projCoords.z;

    // prevent shadow acne with bias
    float bias = max(0.05 * (1.0 - dot(normal, lightDir)), 0.005);

    float shadow = (currentDepth) - bias > closestDepth ? 1.0 : 0.0;

    return shadow;
}`;

export default fragmentShaderTextureString