import GL from './Classes/GL.js';
import Renderer from './Classes/Renderer.js';
import Shader from './Classes/Shader.js';
import VertexArray from './Classes/VertexArray.js';
import VertexBuffer from './Classes/VertexBuffer.js';
import IndexBuffer from './Classes/IndexBuffer.js';
import Texture from './Classes/Texture.js';
import Color from './Classes/Color.js';

let canvas = document.getElementById('c');
GL.loadGL(canvas);

const vsSourceString =
    `
    attribute vec3 aPosition;
    attribute vec2 aTexCoord;
    varying vec2 vTexcoord;
    void main() { 
        vTexcoord = aTexCoord;
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
    varying vec2 vTexcoord;
    uniform sampler2D uTexture;
    void main() {
        gl_FragColor = texture2D(uTexture, vTexcoord);
    }`;

const fsSourceString2 =
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

let texCoords = new Float32Array(
    [
        1,1, 
        0,0, 
        1,0, 
        0,1,
        1,1
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
renderer.clear();

// Draw House
let program = gl.createProgram();
let shader = new Shader(program, vsSourceString, fsSourceString);
let vertexArray = new VertexArray();
let texture = new Texture(window.location.href + "res/f-texture.png", 0, shader, "uTexture");
texture.bind();

// Den Shader binden 
shader.bind();

// shader.setUniform3f("uColor", 0.5, 0.5, 1.0);
// shader.setUniform1i("uTexture", 0);

// setup indexbuffer
const ib1 = new IndexBuffer([0, 1, 2, 3, 4, 1]);
const vb1 = new VertexBuffer(housePositions);
const vb2 = new VertexBuffer(texCoords);
let posAttribLocation = shader.getParameter("aPosition");
let texCoordsAttribLocation = shader.getParameter("aTexCoord");
vertexArray.addBuffer(vb1, [posAttribLocation], 2);
vertexArray.addBuffer(vb2, [texCoordsAttribLocation], 2);


// Draw roof
let program2 = gl.createProgram();
let shader2 = new Shader(program2, vsSourceString, fsSourceString2);
let vertexArray2 = new VertexArray();
let vertexBuffer3 = new VertexBuffer(housePositions);

// Den Shader binden 
shader2.bind();
//shader2.setUniform3f("uColor", 0.5, 0.5, 1.0);
let color = new Color("uColor", shader2, 0.5, 0.5, 1);
color.bind();

// setup indexbuffer
const ib2 = new IndexBuffer([6, 7, 8]);
let posAttribLocation2 = shader2.getParameter("aPosition");
vertexArray2.addBuffer(vertexBuffer3, [posAttribLocation2], 2);

requestAnimationFrame(() => animate());

function animate()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    renderer.draw(vertexArray, ib1, shader);
    renderer.draw(vertexArray2, ib2, shader2);
    requestAnimationFrame(animate);
}