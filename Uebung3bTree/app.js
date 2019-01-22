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

let renderer = new Renderer();

// Setzt den Ansichtsbereich, welcher die Transformation
// von x und y von normalisierten Geräte Koordinaten
// zu window Koordinaten spezifiziert.
// (x, y, width, height)
let gl = GL.getGL();
gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight)
renderer.clear();

// Die Keyeventlistener hinzufügen
canvas.setAttribute("tabindex", "0");
canvas.addEventListener('keypress', function(evt) {
    switch (evt.charCode) {
        case 43: /* + */
            mat4.translate(viewMatrix,     // destination matrix
                viewMatrix,     // matrix to translate
                [-0.0, 0.0, 0.10]);  // amount to translate 
            break;
        case 45: /* - */
            mat4.translate(viewMatrix,     // destination matrix
                viewMatrix,     // matrix to translate
                [-0.0, 0.0, -0.10]);  // amount to translate 
            break;
    }   
}, true);

canvas.addEventListener('keydown', function
(evt) {
    switch (evt.keyCode) {
        case 37: /* left */
            mat4.translate(viewMatrix,
                viewMatrix,
                [0.01, 0, 0]);
            break;
        case 38: /* up */
            mat4.translate(viewMatrix,
                viewMatrix,
                [-0.0, -0.01, 0]);
            break;
        case 39: /* right */
            mat4.translate(viewMatrix,
                viewMatrix,
                [-0.01, 0, 0]);
            break;
        case 40: /* down */
            mat4.translate(viewMatrix,
                viewMatrix,
                [-0.0, 0.01, 0]);
            break;
    }
}, true);

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

const viewMatrix = mat4.create();

// Now move the drawing position a bit to where we want to
// start drawing the square.
mat4.translate(viewMatrix,     // destination matrix
               viewMatrix,     // matrix to translate
               [-0.0, 0.0, -15.0]);  // amount to translate

// Den Cube mit Textur erstellen
let program = gl.createProgram();
let shader = new Shader(program, vsSourceString, fsSourceString);
shader.bind();
let texture = new Texture("uTexture", shader, window.location.href + "res/woodWall.jpg", 0);
let cube = new Cube(shader, true, null, texture);
cube.gameObject.transform.translate([0, -3, 0]);
cube.gameObject.transform.scale([1, 2, 1]);

// Erster Ast
let program2 = gl.createProgram();
let shader2 = new Shader(program2, vsSourceString, fsSourceString);
shader2.bind();
let texture2 = new Texture("uTexture", shader2, window.location.href + "res/woodWall.jpg", 0);
let cube2 = new Cube(shader2, true, null, texture2);
cube2.gameObject.transform.scale([1, 2, 1]);
cube2.gameObject.transform.rotate(1.0472, [1, 0, 0]);

// Zweiter Ast
let program3 = gl.createProgram();
let shader3 = new Shader(program3, vsSourceString, fsSourceString);
shader3.bind();
let texture3 = new Texture("uTexture", shader3, window.location.href + "res/woodWall.jpg", 0);
let cube3 = new Cube(shader3, true, null, texture3);
cube3.gameObject.transform.scale([1, 2, 1]);
cube3.gameObject.transform.rotate(1.0472, [1, 0, 0]);
cube3.gameObject.transform.rotate(10 * 0.20944, [0, 1, 0]);

// Dritter Ast
let program4 = gl.createProgram();
let shader4 = new Shader(program4, vsSourceString, fsSourceString);
shader4.bind();
let texture4 = new Texture("uTexture", shader4, window.location.href + "res/woodWall.jpg", 0);
let cube4 = new Cube(shader4, true, null, texture4);
cube4.gameObject.transform.scale([1, 2, 1]);
cube4.gameObject.transform.rotate(1.0472, [1, 0, 0]);
cube4.gameObject.transform.rotate(20 * 0.20944, [0, 1, 0]);

let camera = new ViewCamera(viewMatrix, projectionMatrix);

function animate()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    renderer.drawCube(cube, shader, camera);
    renderer.drawCube(cube2, shader2, camera);
    //renderer.drawCube(cube3, shader3, camera);
    renderer.drawCube(cube4, shader4, camera);
    requestAnimationFrame(animate);
}