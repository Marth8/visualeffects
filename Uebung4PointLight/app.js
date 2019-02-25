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

const vsSourceString =
    `
    attribute vec3 aPosition;
    attribute vec2 aTexCoord;
    attribute vec3 aNormal;

    uniform mat4 uTransform;
    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;

    varying vec2 vTexcoord;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() { 
        vNormal = (uNormalMatrix * vec4(aNormal, 0.0)).xyz;
        vPosition = (uModelViewMatrix * vec4(aPosition, 1.0)).xyz;
        vTexcoord = aTexCoord;
        gl_PointSize = 10.0;
        gl_Position = uTransform * vec4(aPosition, 1.0);
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
    struct DirectionalLight
    {
        vec3 direction;
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
        int isOn;
    };
    struct PointLight
    {
        vec3 position;

        vec3 ambient;
        vec3 diffuse;
        vec3 specular;

        float constant;
        float linear;
        float quadratic;

        int isOn;
    };
    uniform DirectionalLight dLight;
    uniform PointLight pLight;
    vec3 GetDirectionalLight(DirectionalLight dLight, vec3 normal);
    vec3 GetPointLight(PointLight pLight, vec3 normal);
    void main() {
        vec3 result = GetDirectionalLight(dLight, normalize(vNormal)) * uColor;
        result += GetPointLight(pLight, normalize(vNormal)) * uColor;
        gl_FragColor = vec4(result, 1.0);
    }
    
    vec3 GetDirectionalLight(DirectionalLight dLight, vec3 normal)
    {
        if(dLight.isOn != 1) {
            return vec3(0,0,0);
        }

        vec3 ambient = dLight.ambient;

        vec3 lightDir = normalize(dLight.direction);
        float nDotL = max(dot(normal, lightDir), 0.0);
        vec3 diffuse = dLight.diffuse * nDotL;

        vec3 viewDir = normalize(-vPosition);
        vec3 halfway = normalize(lightDir + viewDir);
        float spec = pow(max(dot(normal, halfway), 0.0), 16.0);

        vec3 specular = (dLight.specular * spec);
        
        return (diffuse + ambient + specular);
    }
    
    vec3 GetPointLight(PointLight pLight, vec3 normal)
    {
        if(pLight.isOn != 1) {
            return vec3(0,0,0);
        }

        vec3 ambient = pLight.ambient;

        vec3 lightDir = normalize(pLight.position - vPosition);
        float nDotL = max(dot(normal, lightDir), 0.0);
        vec3 diffuse = dLight.diffuse * nDotL;

        vec3 viewDir = normalize(-vPosition);
        vec3 halfway = normalize(lightDir + viewDir);
        float spec = pow(max(dot(normal, halfway), 0.0), 16.0);
        vec3 specular = (dLight.specular * spec);

        float distance = length(pLight.position - vPosition);
        float attenuation = 1.0 / (pLight.constant + pLight.linear * distance + pLight.quadratic * (distance * distance));

        ambient *= attenuation;
        diffuse *= attenuation;
        specular *= attenuation;

        return (diffuse + ambient + specular);
    }`;

const fsHalfColorSourceString =
`
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec3 uColor;
varying vec3 vNormal;
void main() {
    gl_FragColor = vec4(uColor, 0.5);
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
let objShader = new Shader(program3, vsSourceString, fsSourceString);
objShader.bind();
let texture4 = new Texture("uTexture", objShader, path + "res/capsule0.jpg", 0);
let capsule = new Object(objShader, 'res/capsule.obj', 1, null, null, texture4);

// Draw capsule2
let program = gl.createProgram();
let objShader2 = new Shader(program, vsSourceString, fsColorSourceString);
objShader2.bind();
let color = new Color("uColor", objShader2, 1, 0.5, 0);
let capsule2 = new Object(objShader2, 'res/capsule.obj', 1, null, color, null);
capsule2.gameObject.transform.move([-3, 0, 2]);

// Draw cube3
let program2 = gl.createProgram();
let objShader3 = new Shader(program2, vsSourceString, fsColorSourceString);
objShader3.bind();
let color2 = new Color("uColor", objShader3, 0, 0.5, 0);
let cube3 = new Cube(objShader3, false, color2, null);
cube3.gameObject.transform.move([3, 0, -2]);

// Draw cube4
let program4 = gl.createProgram();
let objShader4 = new Shader(program4, vsSourceString, fsColorSourceString);
objShader4.bind();
let color3 = new Color("uColor", objShader4, 0.9, 0.1, 0.1);
let plane = new Cube(objShader4, false, color3, null);
plane.gameObject.transform.setScale([10, 0.1, 10]);
plane.gameObject.transform.move([0, -1.1, 0]);

let objects = [plane, capsule2, cube3];
let dLight = new DirectionalLight("dLight", 0.1, 0.4, 0.3, [5, 2, 0]);
renderer.addLight(dLight);
let pLight = new PointLight("pLight", 0.1, 0.4, 0.3, [3, 0, -2], 1.0, 0.09, 0.032);
renderer.addLight(pLight);

$("#point").change((e) => {
    console.log(e);
    pLight.isOn = (pLight.isOn + 1) % 2;
});

$("#directional").change((e) => {
    console.log(e);
    dLight.isOn = (dLight.isOn + 1) % 2;
});

requestAnimationFrame(() => animate());

function animate()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    renderer.drawElements(objects, camera, zSorting);
    requestAnimationFrame(animate);
}
