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
    varying vec2 vTexcoord;
    uniform mat4 uTransform;
    void main() { 
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
    void main() {
        gl_FragColor = vec4(uColor, 1.0);
    }`;

    const fsHalfColorSourceString =
    `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    uniform vec3 uColor;
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
let lastXPosition = -1;
let lastYPosition = -1;

requestAnimationFrame(() => animate());

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
let object = new Object(objShader, 'res/capsule.obj', 1, null, texture4);

// Draw capsule2
let program = gl.createProgram();
let objShader2 = new Shader(program, vsSourceString, fsHalfColorSourceString);
objShader2.bind();
let color = new Color("uColor", objShader2, 1, 0.5, 0);
let capsule2 = new Object(objShader2, 'res/capsule.obj', 1, null, color, null);
capsule2.gameObject.transform.move([0, 1, 2]);

// Draw cube3
let program2 = gl.createProgram();
let objShader3 = new Shader(program2, vsSourceString, fsHalfColorSourceString);
objShader3.bind();
let color2 = new Color("uColor", objShader3, 0, 0.5, 0);
let cube3 = new Cube(objShader3, false, color2, null);
cube3.gameObject.transform.move([0, -1, -2]);

// Draw cube4
let program4 = gl.createProgram();
let objShader4 = new Shader(program4, vsSourceString, fsHalfColorSourceString);
objShader4.bind();
let color3 = new Color("uColor", objShader4, 0, 0, 0.5);
let cube4 = new Plane(objShader4, false, color3, null);
cube4.gameObject.transform.setScale([1, 1, 1]);
cube4.gameObject.transform.move([0, -1, 5]);

let objects = [cube4, capsule2, cube3, object];
function animate()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    renderer.drawElements(objects, camera, zSorting);
    requestAnimationFrame(animate);
}