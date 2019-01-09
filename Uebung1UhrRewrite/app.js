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
    void main() { 
        gl_PointSize = 10.0;
        gl_Position = vec4(aPosition, 1.0);
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

let roofPositions = new Float32Array(
    [
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

let program = gl.createProgram();
let shader = new Shader(program, vsSourceString, fsSourceString);
let vertexArray = new VertexArray();

// Den Shader binden 
shader.bind();
shader.setUniform3f("uColor", 1.0, 0.0, 1.0);

// test array
let testArray = [-0.4,0.1, 0.4,0.1, -0.4,-0.7];

// setup indexbuffer
const ib1 = new IndexBuffer([0, 1, 2, 3, 4, 1, 6, 7, 8]);
const vb1 = new VertexBuffer(housePositions);
const vb2 = new VertexBuffer(roofPositions);
let posAttribLocation = shader.getParameter("aPosition");
vertexArray.addBuffer(vb1, [posAttribLocation], 2);
// vertexArray.addBuffer(vb2, [posAttribLocation], 2)
renderer.clear();
renderer.draw(vertexArray, ib1, shader);

