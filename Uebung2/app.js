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

let canvas = document.getElementById('c');
GL.loadGL(canvas);

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

let housePositions = new Float32Array(
    [
        0.4, -0.6,
        -0.4, 0   ,
        0.4 , 0   ,

        -0.4, -0.6,
        0.4 , -0.6,
        -0.4, 0   ,
        
        -0.5, 0   ,
        0   , 0.5 ,
        0.5 , 0
    ]
);

let renderer = new Renderer();

// Setzt den Ansichtsbereich, welcher die Transformation
// von x und y von normalisierten Geräte Koordinaten
// zu window Koordinaten spezifiziert.
// (x, y, width, height)
let gl = GL.getGL();
gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight)
renderer.clear();

// Draw House
let program = gl.createProgram();

let shader = new Shader(program, vsSourceString, fsSourceString);
shader.bind();

let texture = new Texture("uTexture", shader, window.location.href + "res/woodWall.jpg", 0);

let vertexArray = new VertexArray();
const ib1 = new IndexBuffer([0, 1, 2, 3, 4, 1]);
const vb1 = new VertexBuffer(housePositions);
const vb2 = new VertexBuffer(housePositions);
let posAttribLocation = shader.getParameter("aPosition");
let texCoordsAttribLocation = shader.getParameter("aTexCoord");
vertexArray.addBuffer(vb1, [posAttribLocation], 2);
vertexArray.addBuffer(vb2, [texCoordsAttribLocation], 2);

let gameObject = new GameObject(vertexArray, ib1, texture);

//-------------------------------------------------------------------
// Draw roof
let program2 = gl.createProgram();

let shader2 = new Shader(program2, vsSourceString, fsSourceString);
shader2.bind();

let vertexArray2 = new VertexArray(); 

let texture2 = new Texture("uTexture", shader2, window.location.href + "res/roof.jpg", 0);

const ib2 = new IndexBuffer([6, 7, 8]);
const vb3 = new VertexBuffer(housePositions);
const vb4 = new VertexBuffer(housePositions);
let posAttribLocation2 = shader2.getParameter("aPosition");
let texCoordsAttribLocation2 = shader.getParameter("aTexCoord");
vertexArray2.addBuffer(vb3, [posAttribLocation2], 2);
vertexArray2.addBuffer(vb4, [texCoordsAttribLocation2], 2);

let gameObject2 = new GameObject(vertexArray2, ib2, texture2);

let testMatrix = mat4.create();
let invertedMatrix = null;
mat4.translate(testMatrix,     // destination matrix
    testMatrix,     // matrix to translate
    [-0.0, 0.0, -6.0]);  // amount to translate
mat4.invert(testMatrix, testMatrix);

// Die Keyeventlistener hinzufügen
canvas.setAttribute("tabindex", "0");
canvas.addEventListener('keypress', function(evt) {
    switch (evt.charCode) {
        case 43: /* + */
            break;
        case 45: /* - */
            break;
    }   
}, true);

canvas.addEventListener('keydown', function
(evt) {
    switch (evt.keyCode) {
        case 37: /* left */
            break;
        case 38: /* up */
            break;
        case 39: /* right */
            break;
        case 40: /* down */
            break;
    }
}, true);

requestAnimationFrame(() => animate());
const fieldOfView = 45 * Math.PI / 180;   // in radians
const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
const zNear = 0.1;
const zFar = 100.0;
const projectionMatrix = mat4.create();

// note: glmatrix.js always has the first argument
// as the destination to receive the result.
mat4.perspective(projectionMatrix,
                 fieldOfView,
                 aspect,
                 zNear,
                 zFar);

const viewMatrix = mat4.create();

// Now move the drawing position a bit to where we want to
// start drawing the square.

mat4.translate(viewMatrix,     // destination matrix
               viewMatrix,     // matrix to translate
               [-0.0, 0.0, -6.0]);  // amount to translate 
let camera = new ViewCamera(viewMatrix, projectionMatrix);

function animate()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    shader.bind();
    renderer.drawGameObject(gameObject, shader, camera);
    shader2.bind();
    renderer.drawGameObject(gameObject2, shader2, camera);
    requestAnimationFrame(animate);
}