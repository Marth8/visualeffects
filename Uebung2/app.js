import GL from './Classes/GL.js';
import Renderer from './Classes/Renderer.js';
import Shader from './Classes/Shader.js';
import VertexArray from './Classes/VertexArray.js';
import VertexBuffer from './Classes/VertexBuffer.js';
import IndexBuffer from './Classes/IndexBuffer.js';

let canvas = document.getElementById('c');
GL.loadGL(canvas);

const vsSourceString =
    `
    attribute vec3 aPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    void main() { 
        gl_PointSize = 10.0;
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
    }`;

const fsSourceString =
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
let vertexArray = new VertexArray();

// Den Shader binden 
shader.bind();

// Create a perspective matrix, a special matrix that is
// used to simulate the distortion of perspective in a camera.
// Our field of view is 45 degrees, with a width/height
// ratio that matches the display size of the canvas
// and we only want to see objects between 0.1 units
// and 100 units away from the camera.

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

// Set the drawing position to the "identity" point, which is
// the center of the scene.
const modelViewMatrix = mat4.create();

// Now move the drawing position a bit to where we want to
// start drawing the square.

mat4.translate(modelViewMatrix,     // destination matrix
                modelViewMatrix,     // matrix to translate
                [-0.0, 0.0, -6.0]);  // amount to translate

shader.setUniform3f("uColor", 1, 0, 0);
shader.setUniformMatrix4fv("uProjectionMatrix", false, projectionMatrix);
shader.setUniformMatrix4fv("uModelViewMatrix", false, modelViewMatrix);

// setup indexbuffer
const ib1 = new IndexBuffer([0, 1, 2, 3, 4, 1]);
const vb1 = new VertexBuffer(housePositions);
let posAttribLocation = shader.getParameter("aPosition");
vertexArray.addBuffer(vb1, [posAttribLocation], 2);

//-------------------------------------------------------------------
// Draw second zeiger
let program2 = gl.createProgram();
let shader2 = new Shader(program2, vsSourceString, fsSourceString);
let vertexArray2 = new VertexArray();

// Den Shader binden 
shader2.bind();

// Create a perspective matrix, a special matrix that is
// used to simulate the distortion of perspective in a camera.
// Our field of view is 45 degrees, with a width/height
// ratio that matches the display size of the canvas
// and we only want to see objects between 0.1 units
// and 100 units away from the camera.
const projectionMatrix2 = mat4.create();

// note: glmatrix.js always has the first argument
// as the destination to receive the result.
mat4.perspective(projectionMatrix2,
                fieldOfView,
                aspect,
                zNear,
                zFar);

// Set the drawing position to the "identity" point, which is
// the center of the scene.
const modelViewMatrix2 = mat4.create();

// Now move the drawing position a bit to where we want to
// start drawing the square.

mat4.translate(modelViewMatrix2,     // destination matrix
                modelViewMatrix2,     // matrix to translate
                [-0.0, 0.0, -6.0]);  // amount to translate

shader2.setUniform3f("uColor", 0, 0, 0);
shader2.setUniformMatrix4fv("uProjectionMatrix", false, projectionMatrix2);
shader2.setUniformMatrix4fv("uModelViewMatrix", false, modelViewMatrix2);

// setup indexbuffer
const ib2 = new IndexBuffer([6, 7, 8]);
const vb2 = new VertexBuffer(housePositions);
let posAttribLocation2 = shader2.getParameter("aPosition");
vertexArray2.addBuffer(vb2, [posAttribLocation2], 2);

requestAnimationFrame((now) => animate(now));

function animate(now)
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    renderer.draw(vertexArray, ib1, shader);
    renderer.draw(vertexArray2, ib2, shader2);
    requestAnimationFrame(animate);
}