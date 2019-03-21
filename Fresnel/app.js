import GL from './Classes/GL.js';
import Renderer from './Classes/Renderer.js';
import Shader from './Classes/Shader.js';
import Color from './Classes/Color.js';
import Texture from './Classes/Texture.js';
import ViewCamera from './Classes/ViewCamera.js';
import Cube from './Classes/Cube.js';
import Sphere from './Classes/Sphere.js';
import Object from './Classes/Object.js';
import DirectionalLight from './Classes/DirectionalLight.js';
import PointLight from './Classes/PointLight.js';
import HeadLight from './Classes/HeadLight.js';
import FrameBuffer from './Classes/FrameBuffer.js';
import vertexShaderString from './Shaders/VertexShader.js';
import fragmentShaderColorString from './Shaders/FragmentShaderColor.js';
import fragmentShaderTextureString from './Shaders/FragmentShaderTexture.js';

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
let objShader = new Shader(program3, vertexShaderString, fragmentShaderTextureString);
objShader.bind();
let texture4 = new Texture(objShader, [1, 1, 1], [1, 1, 1], [1, 1, 1], 32, path + "Resources/capsule0.jpg", 0);
let capsule = new Object(objShader, 'Resources/capsule.obj', 1, null, null, texture4);
capsule.gameObject.transform.move([-1, 0, -3]);

let program = gl.createProgram();
let objShader2 = new Shader(program, vertexShaderString, fragmentShaderColorString);
objShader2.bind();
let color = new Color(objShader2, [1, 0.5, 0.31], [1, 0.5, 0.31], [0.5, 0.5, 0.5], 32, 0.9, 0.7, 0.1);
let object = new Object(objShader2, 'Resources/mobster.obj', 1, null, color);
object.gameObject.transform.move([-3, 2, 2]);

// Draw cube3
let program2 = gl.createProgram();
let objShader3 = new Shader(program2, vertexShaderString, fragmentShaderColorString);
objShader3.bind();
let color2 = new Color(objShader3, [1, 1, 1], [1, 1, 1], [1, 1, 1], 77, 0, 0.5, 0);
let cube3 = new Cube(objShader3, false, color2, null);
cube3.gameObject.transform.move([3, 4, -2]);

// Draw cube4
let program4 = gl.createProgram();
let objShader4 = new Shader(program4, vertexShaderString, fragmentShaderColorString);
objShader4.bind();
let color3 = new Color(objShader4, [1, 0.5, 0.31], [1, 0.5, 0.31], [0.5, 0.5, 0.5], 32, 0.9, 0.1, 0.1);
let plane = new Cube(objShader4, false, color3, null);
plane.gameObject.transform.setScale([40, 0.1, 100]);
plane.gameObject.transform.move([0, -1.5, 0]);

// Draw cube3
let program5 = gl.createProgram();
let objShader5 = new Shader(program5, vertexShaderString, fragmentShaderColorString);
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
