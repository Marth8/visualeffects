import GL from './Classes/GL.js';
import Renderer from './Classes/Renderer.js';
import Shader from './Classes/Shader.js';
import VertexArray from './Classes/VertexArray.js';
import VertexBuffer from './Classes/VertexBuffer.js';
import IndexBuffer from './Classes/IndexBuffer.js';
import GameObject from './Classes/GameObject.js';
import Color from './Classes/Color.js';
import Texture from './Classes/Texture.js';
import ViewCamera from './Classes/ViewCamera.js';
import Cube from './Classes/Cube.js';
import Transform from './Classes/Transform.js';
import Tree from './Classes/Tree.js';
import Sphere from './Classes/Sphere.js';
import Object from './Classes/Object.js';
import Plane from './Classes/Plane.js';
import DirectionalLight from './Classes/DirectionalLight.js';
import PointLight from './Classes/PointLight.js';
import HeadLight from './Classes/HeadLight.js';
import FrameBuffer from './Classes/FrameBuffer.js';
import DepthTexture from './Classes/DepthTexture.js';

const canvas = document.getElementById('c');
const gl = GL.loadGL(canvas);
const enableBlending = true;
const zSorting = true;
const path = window.location.href.substring(0,window.location.href.lastIndexOf("\/")+1);

if (enableBlending)
{
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LEQUAL);

const vsDepthPlane = 
    `
    attribute vec3 aPosition;
    attribute vec2 aTexCoord;
    varying vec2 vTexcoord;

    void main() { 
        vTexcoord = aTexCoord;
        gl_Position = vec4(aPosition.xy, 0.0, 1.0);
    }`;

const fsDepthPlane =
    `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    varying vec2 vTexcoord;
    uniform sampler2D uTexture;
    void main() {
        gl_FragColor = vec4(vec3(texture2D(uTexture, vTexcoord).x), 1.0);
    }`;

const vsSourceString =
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

const fsSourceString =
    `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    varying vec3 vNormal;
    varying vec2 vTexcoord;
    uniform sampler2D uTexture;
    void main() {
        gl_FragColor = texture2D(uTexture, vTexcoord);
    }`;

const fsColorSourceString =
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
    struct HeadLight
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
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
        float shininess;
    };

    uniform Material material;
    uniform DirectionalLight dLight;
    uniform PointLight pLight;
    uniform HeadLight hLight;
    
    vec3 GetDirectionalLight(DirectionalLight dLight, vec3 normal);
    vec3 GetPointLight(PointLight pLight, vec3 normal);
    vec3 GetHeadLight(HeadLight hLight, vec3 normal);
    float ShadowCalculation(vec4 vPositionLightSpace);

    void main() {
        vec3 result = GetDirectionalLight(dLight, normalize(vNormal));
        result += GetPointLight(pLight, normalize(vNormal));
        result += GetHeadLight(hLight, normalize(vNormal));
        gl_FragColor = vec4(result, 1.0);
    }
    
    vec3 GetDirectionalLight(DirectionalLight dLight, vec3 normal)
    {
        if(dLight.isOn != 1) {
            return vec3(0,0,0);
        }

        vec3 ambient = dLight.ambient * material.ambient * dLight.color;

        vec3 lightDir = normalize(dLight.direction);
        float nDotL = max(dot(normal, lightDir), 0.0);
        vec3 diffuse = dLight.diffuse * (nDotL * material.diffuse * dLight.color);

        vec3 viewDir = normalize(-vPosition);
        vec3 halfway = normalize(lightDir + viewDir);
        float spec = pow(max(dot(normal, halfway), 0.0), material.shininess);
        vec3 specular = dLight.specular * (spec * material.specular * dLight.color);
        
        // calculate shadow
        float shadow = ShadowCalculation(vPositionLightSpace);       
        vec3 lighting = (ambient + (1.0 - shadow) * (diffuse + specular));  

        return lighting * uColor;
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

        vec3 viewDir = normalize(-xPosition);
        vec3 halfway = normalize(lightDir + viewDir);
        float spec = pow(max(dot(normal, halfway), 0.0), material.shininess);
        vec3 specular = pLight.specular * (spec * material.specular * pLight.color);

        float distance = length(pLight.position - xPosition);
        float attenuation = 1.0 / (pLight.constant + pLight.linear * distance + pLight.quadratic * (distance * distance));

        ambient *= attenuation;
        diffuse *= attenuation;
        specular *= attenuation;

        return (diffuse + ambient + specular) * uColor;
    }
    
    vec3 GetHeadLight(HeadLight hLight, vec3 normal)
    {
        if(hLight.isOn != 1) {
            return vec3(0,0,0);
        }
        vec3 lightDir = normalize(hLight.position - xPosition);

        float theta = dot(lightDir, normalize(-hLight.direction));

        if (theta > hLight.cutOff)
        {
            vec3 ambient = hLight.ambient * material.ambient * hLight.color;

            vec3 lightDir = normalize(-hLight.direction);
            float nDotL = max(dot(normal, lightDir), 0.0);
            vec3 diffuse = hLight.diffuse * (nDotL * material.diffuse * hLight.color);
    
            vec3 viewDir = normalize(-xPosition);
            vec3 halfway = normalize(lightDir + viewDir);
            float spec = pow(max(dot(normal, halfway), 0.0), material.shininess);
            vec3 specular = hLight.specular * (spec * material.specular * hLight.color);
            
            return (diffuse + ambient + specular) * uColor;
        }
        else
        {
            return hLight.ambient * material.ambient * hLight.color * uColor;
        }
    }
    
    float ShadowCalculation(vec4 vPositionLightSpace)
    {
        // perform perspective divide
        vec3 projCoords = vPositionLightSpace.xyz / vPositionLightSpace.w;    
        projCoords = projCoords * 0.5 + 0.5;
    
        float closestDepth = texture2D(shadowMap, projCoords.xy).r; 
        float currentDepth = projCoords.z;

        float shadow = currentDepth > closestDepth ? 1.0 : 0.0;

        return shadow;
    }`;

const fsTexSourceString =
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
struct HeadLight
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
uniform HeadLight hLight;

vec3 GetDirectionalLight(DirectionalLight dLight, vec3 normal);
vec3 GetPointLight(PointLight pLight, vec3 normal);
vec3 GetHeadLight(HeadLight hLight, vec3 normal);
float ShadowCalculation(vec4 vPositionLightSpace);

void main() {
    vec3 result = GetDirectionalLight(dLight, normalize(vNormal));
    result += GetPointLight(pLight, normalize(vNormal));
    result += GetHeadLight(hLight, normalize(vNormal));
    gl_FragColor = vec4(result, 1.0);
}

vec3 GetDirectionalLight(DirectionalLight dLight, vec3 normal)
{
    if(dLight.isOn != 1) {
        return vec3(0,0,0);
    }

    vec3 ambient = dLight.ambient * vec3(texture2D(material.diffuse, vTexCoord))  * dLight.color;

    vec3 lightDir = normalize(dLight.direction);
    float nDotL = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = dLight.diffuse * (nDotL * vec3(texture2D(material.diffuse, vTexCoord)) * dLight.color);

    vec3 viewDir = normalize(-vPosition);
    vec3 halfway = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfway), 0.0), material.shininess);
    vec3 specular = dLight.specular * (spec * vec3(texture2D(material.specular, vTexCoord)) * dLight.color);
    
    // calculate shadow
    float shadow = ShadowCalculation(vPositionLightSpace);       
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

    vec3 viewDir = normalize(-xPosition);
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

vec3 GetHeadLight(HeadLight hLight, vec3 normal)
{
    if(hLight.isOn != 1) {
        return vec3(0,0,0);
    }
    vec3 lightDir = normalize(hLight.position - xPosition);

    float theta = dot(lightDir, normalize(-hLight.direction));

    if (theta > hLight.cutOff)
    {
        vec3 ambient = hLight.ambient * vec3(texture2D(material.diffuse, vTexCoord)) * hLight.color;

        vec3 lightDir = normalize(-hLight.direction);
        float nDotL = max(dot(normal, lightDir), 0.0);
        vec3 diffuse = hLight.diffuse * (nDotL * vec3(texture2D(material.diffuse, vTexCoord)) * hLight.color);

        vec3 viewDir = normalize(-xPosition);
        vec3 halfway = normalize(lightDir + viewDir);
        float spec = pow(max(dot(normal, halfway), 0.0), material.shininess);
        vec3 specular = hLight.specular * (spec * vec3(texture2D(material.specular, vTexCoord)) * hLight.color);
        
        return (diffuse + ambient + specular);
    }
    else
    {
        return hLight.ambient * material.ambient * hLight.color;
    }
}

float ShadowCalculation(vec4 vPositionLightSpace)
{
    vec3 projCoords = vPositionLightSpace.xyz / vPositionLightSpace.w;    
    projCoords = projCoords * 0.5 + 0.5;
    
    float closestDepth = texture2D(shadowMap, projCoords.xy).r; 
    float currentDepth = projCoords.z;

    float shadow = (currentDepth) > closestDepth ? 1.0 : 0.0;

    return shadow;
}`;

let renderer = new Renderer();

// Setzt den Ansichtsbereich, welcher die Transformation
// von x und y von normalisierten Geräte Koordinaten
// zu window Koordinaten spezifiziert.
// (x, y, width, height)
gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight)
renderer.clear();

// Die Keyeventlistener hinzufügen
canvas.setAttribute("tabindex", "0");
canvas.addEventListener('keypress', function(evt) {
    switch (evt.charCode) {
        case 43: /* + */
            camera.move([0, 0, 0.5]);
            break;
        case 45: /* - */
            camera.move([0, 0, -0.5]);
            break;
    }   
}, true);

canvas.addEventListener('keydown', function
(evt) {
    switch (evt.keyCode) {
        case 37: /* left */
            camera.move([0.05, 0, 0]);
            break;
        case 38: /* up */
            camera.move([0.0, -0.05, 0]);
            break;
        case 39: /* right */
            camera.move([-0.05, 0, 0])
            break;
        case 40: /* down */
            camera.move([-0.0, 0.05, 0])
            break;
    }
}, true);

let mouseIsDown = false;

const fieldOfView = 45 * Math.PI / 180;   // in radians
const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
const zNear = 0.1;
const zFar = 1000.0;
const projectionMatrix = mat4.create();

// Perspektivmatrix setzen
mat4.perspective(projectionMatrix,
                 fieldOfView,
                 aspect,
                 zNear,
                 zFar);

let camera = new ViewCamera(projectionMatrix);

// Die Eventlistener für die Mausbewegungen hinterlegen
canvas.addEventListener('mousedown', (evt) => {
    mouseIsDown = true;
});
canvas.addEventListener('mousemove', (evt) => {
    if (mouseIsDown)
    {
        let xRotation = evt.movementX / 4;
        let yRotation = evt.movementY / 4;
        camera.rotateY(xRotation);
        camera.rotateX(yRotation);
    }
})
canvas.addEventListener('mouseup', (evt) => {
    mouseIsDown = false;
});

camera.move([0, 0, -15]);

// Draw object
let program3 = gl.createProgram();
let objShader = new Shader(program3, vsSourceString, fsTexSourceString);
objShader.bind();
let texture4 = new Texture(objShader, [1, 1, 1], [1, 1, 1], [1, 1, 1], 32, path + "res/capsule0.jpg", 0);
let capsule = new Object(objShader, 'res/capsule.obj', 1, null, null, texture4);
capsule.gameObject.transform.move([-1, 0, -3]);

// Draw capsule2
/*
let program = gl.createProgram();
let objShader2 = new Shader(program, vsSourceString, fsColorSourceString);
objShader2.bind();
let color = new Color(objShader2, [1, 0.5, 0.31], [1, 0.5, 0.31], [0.5, 0.5, 0.5], 32, 1, 0.5, 0);
let capsule2 = new Object(objShader2, 'res/capsule.obj', 1, null, color, null);
capsule2.gameObject.transform.move([-3, 0, 2]);
*/
/*
let program = gl.createProgram();
let objShader2 = new Shader(program, vsSourceString, fsColorSourceString);
objShader2.bind();
let color = new Color(objShader2, [1, 0.5, 0.31], [1, 0.5, 0.31], [0.5, 0.5, 0.5], 32, 0.9, 0.1, 0.1);
let cube2 = new Cube(objShader2, false, color, null);
cube2.gameObject.transform.move([-3, 0, 2]);
*/
let program = gl.createProgram();
let objShader2 = new Shader(program, vsSourceString, fsColorSourceString);
objShader2.bind();
let color = new Color(objShader2, [1, 0.5, 0.31], [1, 0.5, 0.31], [0.5, 0.5, 0.5], 32, 0.9, 0.7, 0.1);
let object = new Object(objShader2, 'res/mobster.obj', 1, null, color);
object.gameObject.transform.move([-3, 2, 2]);

// Draw cube3
let program2 = gl.createProgram();
let objShader3 = new Shader(program2, vsSourceString, fsColorSourceString);
objShader3.bind();
let color2 = new Color(objShader3, [1, 1, 1], [1, 1, 1], [1, 1, 1], 77, 0, 0.5, 0);
let cube3 = new Cube(objShader3, false, color2, null);
cube3.gameObject.transform.move([3, 4, -2]);

// Draw cube4
let program4 = gl.createProgram();
let objShader4 = new Shader(program4, vsSourceString, fsColorSourceString);
objShader4.bind();
let color3 = new Color(objShader4, [1, 0.5, 0.31], [1, 0.5, 0.31], [0.5, 0.5, 0.5], 32, 0.9, 0.1, 0.1);
let plane = new Cube(objShader4, false, color3, null);
plane.gameObject.transform.setScale([40, 0.1, 100]);
plane.gameObject.transform.move([0, -1.5, 0]);

// Draw cube3
let program5 = gl.createProgram();
let objShader5 = new Shader(program5, vsSourceString, fsColorSourceString);
objShader5.bind();
let color5 = new Color(objShader5, [1, 1, 1], [1, 1, 1], [1, 1, 1], 77, 0, 0.5, 0);
let sphere = new Sphere(objShader5, false, color5, null);
sphere.gameObject.transform.move([4, 0, 2]);

let objects = [plane, sphere, object, cube3, capsule];
let dLight = new DirectionalLight("dLight", 0.1, 0.7, 0.6, [0, 10, 0], [0, 2, 0]);
renderer.addLight(dLight);
let pLight = new PointLight("pLight", 0.3, 0.6, 0.5, 1.0, 0.07, 0.017, [0, 1, 2], [1.0, 1.0, 1.0]);
renderer.addLight(pLight);
let hLight = new HeadLight("hLight", 0.0, 0.4, 0.3, [2, 2, 5], [0, -1, -0], 12);
renderer.addLight(hLight);

$("#point").change((e) => {
    if(document.getElementById('point').checked) {
        pLight.isOn = true;
    } else {
        pLight.isOn = false;
    }
});

$("#directional").change((e) => {
    if(document.getElementById('directional').checked) {
        dLight.isOn = true;
    } else {
        dLight.isOn = false;
    }
});

$("#headlight").change((e) => {
    if(document.getElementById('headlight').checked) {
        hLight.isOn = true;
    } else {
        hLight.isOn = false;
    }
});

let frameBuffer = new FrameBuffer(canvas.clientHeight, canvas.clientWidth);

requestAnimationFrame(() => animate());

function animate()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    frameBuffer.bind();
    renderer.renderDepthScene(objects, dLight);
    frameBuffer.unbind();

    /*
    // Tiefenbild anzeigen
    let program4 = gl.createProgram();
    let depthShader = new Shader(program4, vsDepthPlane, fsDepthPlane);
    depthShader.bind();
    let depthTexture = new DepthTexture(depthShader, 1, 1, 1, 32, 0, frameBuffer.depthMap);
    let depthPlane = new Plane(depthShader, true, null, depthTexture, false);
    renderer.renderDepthPlane(depthPlane, camera);
    */

    gl.enable(gl.CULL_FACE);
    renderer.drawElementsWithShadow(objects, camera, frameBuffer.depthMap, dLight);
    requestAnimationFrame(animate);
}
