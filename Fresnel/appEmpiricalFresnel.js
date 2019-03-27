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
import SpotLight from './Classes/SpotLight.js';
import FrameBuffer from './Classes/FrameBuffer.js';
import FrameBufferTexture from './Classes/FrameBufferTexture.js';
import Plane from './Classes/Plane.js';
import vertexShaderString from './Shaders/VertexShader.js';
import fragmentShaderColorString from './Shaders/FragmentShaderColor.js';
import fragmentShaderTextureString from './Shaders/FragmentShaderTexture.js';
import vertexShaderDepthMapString from './Shaders/VertexShaderDepthPlane.js';
import fragmentShaderDepthMapString from './Shaders/FragmentShaderDepthPlane.js';
import fragmentShaderReflectivePlaneString from './Shaders/FragmentShaderReflectivePlane.js';
import fragmentShaderSchlickFresnelString from './Shaders/FragmentShaderSchlickFresnel.js';
import CubeMap from './Classes/CubeMap.js';
import fragmentShaderSkyboxString from './Shaders/FragmentShaderSkybox.js';
import vertexShaderSkyboxString from './Shaders/VertexShaderSkybox.js';
import Skybox from './Classes/Skybox.js';
import fragmentShaderSkyboxReflectiveString from './Shaders/FragmentShaderSkyboxReflective.js';
import fragmentShaderEmpricialString from './Shaders/FragmentShaderEmpricialFresnel.js';

// Das Canvas holen, GL laden, Blending aktivieren und den aktuellen Path ermitteln
const canvas = document.getElementById('c');
const gl = GL.loadGL(canvas);
const enableBlending = true;
const path = window.location.href.substring(0,window.location.href.lastIndexOf("\/")+1);

// Falls gewünscht, Blending aktivieren
if (enableBlending)
{
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

// Depthtest/Lequal aktivieren
gl.enable(gl.DEPTH_TEST);

// Den Renderer erstellen
let renderer = new Renderer();

// Setzt den Ansichtsbereich, welcher die Transformation
// von x und y von normalisierten Geräte Koordinaten
// zu window Koordinaten spezifiziert.
// (x, y, width, height)
gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight)

// Die View clearen
renderer.clear();

// Die Kamera mit der Prespektivenmatrix erstellen
const fieldOfView = 45 * Math.PI / 180;   // in radians
const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
const zNear = 0.1;
const zFar = 1000.0;
const projectionMatrix = mat4.create();
/**mat4.perspective(projectionMatrix,
                 fieldOfView,
                 aspect,
                 zNear,
                 zFar); */
mat4.perspective(projectionMatrix, Math.PI/4, 1, 1, 100);
let camera = new ViewCamera(projectionMatrix);
camera.move([0, 0, -15]);

// Die Events des Canvas vorbereiten
prepareCanvasEvents();
prepareCheckboxEvents();

// Erstelle die Kapsel
let objShader = new Shader(vertexShaderString, fragmentShaderTextureString);
let texture4 = new Texture(objShader, path + "Resources/capsule0.jpg", 4);
let capsule = new Object(objShader, 'Resources/capsule.obj', 1, null, texture4);
capsule.transform.move([-1, -0.5, -3]);

// Erstelle den Mobster
let objShader2 = new Shader(vertexShaderString, fragmentShaderEmpricialString);
let color = new Color(objShader2, 0.9, 0.7, 0.1);
let object = new Object(objShader2, 'Resources/mobster.obj', 1, color, null, "r");
object.transform.move([-3, 0, 2]);

// Erstelle den Cube
let objShader3 = new Shader(vertexShaderString, fragmentShaderEmpricialString);
let color2 = new Color(objShader3, 0, 0.5, 0, 1);
color2.ambient = [1, 1, 1];
color2.diffuse = [1, 1, 1];
color2.specular = [1, 1, 1];
color2.shininess = 77;
let cube3 = new Cube(objShader3, false, color2, null, "r");
cube3.transform.move([0, 0, 0]);

// Erstelle die Sphere
let objShader5 = new Shader(vertexShaderString, fragmentShaderSkyboxReflectiveString);
let color5 = new Color(objShader5, 0, 0.5, 0);
let sphere = new Sphere(objShader5, false, color5, null, "fr");
sphere.transform.move([4, 0, 2]);

// Erstelle plane
let objShader4 = new Shader(vertexShaderString, fragmentShaderEmpricialString);
objShader4.bind();
let color3 = new Color(objShader4, 0.9, 0.1, 0.1);
color3.ambient = [1, 0.5, 0.31];
color3.diffuse = [1, 0.5, 0.31];
color3.specular = [0.5, 0.5, 0.5];
color3.shininess = 32;
let plane = new Cube(objShader4, false, color3, null, "r");
plane.transform.setScale([20, 0.1, 20]);
plane.transform.move([0, -3.5, 0]);

// Erstelle die Objekte, welche gezeichnet werden
let objects = [sphere, object, cube3, capsule, plane];

// Erstelle die Lichter und füge dieser der Kamera hinzu
let dLight = new DirectionalLight("dLight", [-3, 10, -3], [1, -3, -1], 0.2, 0.9, 1.0);
let pLight = new PointLight("pLight", [0, 1, 2], 1, 0.07, 0.17, 0.05, 0.5, 0.5);
let sLight = new SpotLight("sLight", [2, 2, 5], [0, -1, -0], 12);
renderer.addLight(dLight);
renderer.addLight(pLight);
renderer.addLight(sLight);

// Den depthFrameBuffer erstellen
let depthFrameBuffer = new FrameBuffer(canvas.clientHeight, canvas.clientWidth);

// Den reflectionFrameBuffer erstellen
//let reflectionFrameBuffer = new FrameBuffer(canvas.clientHeight, canvas.clientWidth,);

// CubeMap erzeugen

/*
let paths = 
[
    "Resources/skybox/right.jpg",
    "Resources/skybox/left.jpg",
    "Resources/skybox/top.jpg",
    "Resources/skybox/bottom.jpg",
    "Resources/skybox/front.jpg",
    "Resources/skybox/back.jpg",
];
*/
let paths = [
    "Resources/park/posx.jpg", "Resources/park/negx.jpg", 
    "Resources/park/posy.jpg", "Resources/park/negy.jpg", 
    "Resources/park/posz.jpg", "Resources/park/negz.jpg"
];



// Die Skybox erstellen
let skybox = new Skybox(paths, 2);

// Die Szene animieren
requestAnimationFrame(() => animate());

/**
 * Funktion zum Animieren innerhalb eines Animationframes. 
 */
function animate()
{
    // Die Szene clearen
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (!skybox.canBeDrawn())
    {
        // neu animieren
        requestAnimationFrame(animate);
        return;
    }
    
    // Das Tiefenbild erzeugen
    depthFrameBuffer.bind();

    // Cull-Frace auf Front setzen
    gl.cullFace(gl.FRONT); 

    renderer.renderDepthScene(objects, dLight);
    depthFrameBuffer.unbind();

    // Cull-Face auf Back setzen
    gl.cullFace(gl.BACK);

    /*
    // Tiefenbild anzeigen
    let depthShader = new Shader(vertexShaderDepthMapString, fragmentShaderDepthMapString);
    let depthTexture = new FrameBufferTexture(depthShader, 1, 1, 1, 32, 0, depthFrameBuffer.depthMap);
    let depthPlane = new Plane(depthShader, true, null, depthTexture, false);
    renderer.renderDepthPlane(depthPlane, camera);
    */

    // Cull-Face aktivieren
    gl.enable(gl.CULL_FACE);

    // Die Skybox zeichnen
    renderer.renderSkybox(skybox, camera);

    // Die Elemente zeichnen
    renderer.render(objects, camera, depthFrameBuffer.depthMap, skybox);

    // neu animieren
    requestAnimationFrame(animate);
}

/**
 * Methode zum Erstellen der Checkboxevents.
 */
function prepareCheckboxEvents()
{
    // Wenn ein Licht ausgeschaltet wird, hier das Uniform anpassen
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

    $("#spotlight").change((e) => {
        if(document.getElementById('spotlight').checked) {
            sLight.isOn = true;
        } else {
            sLight.isOn = false;
        }
    });
}

/**
 * Methode zum Erstellen der Canvasevents.
 */
function prepareCanvasEvents()
{
    // Variable anlegen, falls die Maus gedrückt ist
    let mouseIsDown = false;

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
}