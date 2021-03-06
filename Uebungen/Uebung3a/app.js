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

// Draw House
let program = gl.createProgram();

let shader = new Shader(program, vsSourceString, fsSourceString);
shader.bind();

// Den Cube mit Textur erstellen
let texture = new Texture("uTexture", shader, window.location.href + "res/woodWall.jpg", 0);
let cube = new Cube(shader, true, null, texture);
cube.gameObject.transform.translate([2, 0, 0]);

// Male zweiten Cube
let program2 = gl.createProgram();
let shader2 = new Shader(program2, vsSourceString, fsColorSourceString);
shader2.bind();
let color = new Color("uColor", shader2, 0.5, 0, 0.5);
let colorCube = new Cube(shader2, false, color, null);
colorCube.gameObject.transform.translate([-2, 0, 0]);

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
               [-0.0, 0.0, -10.0]);  // amount to translate 
let camera = new ViewCamera(viewMatrix, projectionMatrix);

function animate()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    renderer.drawCube(cube, shader, camera);
    cube.gameObject.transform.rotate(90/10000, [0, 1, 0]);
    colorCube.gameObject.transform.rotate(-90/10000, [1, 1, 0]);
    renderer.drawCube(colorCube, shader2, camera);
    requestAnimationFrame(animate);
}