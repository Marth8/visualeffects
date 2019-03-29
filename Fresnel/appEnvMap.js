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
import vertexShaderString from './Shaders/VertexShader.js';
import Skybox from './Classes/Skybox.js';
import EnvironmentalMap from './Classes/EnvironmentalMap.js';
import fragmentShaderEnvString from './Shaders/FragmentShaderEnv.js';
import fragmentShaderSimpleString from './Shaders/FragmentShaderSimpleColor.js';
import vertexShaderSimpleString from './Shaders/VertexShaderSimple.js';
import fragmentShaderSimpleTextureString from './Shaders/FragmentShaderSimpleTexture.js';

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
const projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix, Math.PI/4, 1, 1, 100);
let camera = new ViewCamera(projectionMatrix);
camera.move([0, 0, -15]);

// Die Events des Canvas vorbereiten
prepareCanvasEvents();
prepareCheckboxEvents();

// Erstelle die Kapsel
let objShaderCapsule = new Shader(vertexShaderSimpleString, fragmentShaderSimpleTextureString);
let textureCapsule = new Texture(objShaderCapsule, path + "Resources/capsule0.jpg", 4);
let capsule = new Object(objShaderCapsule, 'Resources/capsule.obj', 1, null, textureCapsule, "s");
capsule.transform.move([-5, -0.5, -3]);

// Erstelle den Mobster
let objShaderObject = new Shader(vertexShaderSimpleString, fragmentShaderSimpleString);
let colorObject = new Color(objShaderObject, 0.9, 0.7, 0.1);
let object = new Object(objShaderObject, 'Resources/mobster.obj', 1, colorObject, null, "s");
object.transform.move([-3, 0, 2]);

// Erstelle die Sphere
let objShaderSphere = new Shader(vertexShaderSimpleString, fragmentShaderSimpleString);
let colorSphere = new Color(objShaderSphere, 0, 0.5, 0);
let sphere = new Sphere(objShaderSphere, false, colorSphere, null, "s");
sphere.transform.move([3, -2, 2]);

// Erstelle einen weiteren Cube
let objShaderCube = new Shader(vertexShaderSimpleString, fragmentShaderSimpleTextureString);
let textureCube = new Texture(objShaderCube, path + 'Resources/rustediron2_basecolor.png', 2);
let cube = new Cube(objShaderCube, true, null, textureCube, "s");
cube.transform.move([2.5, 2, -1]);

// Erstelle die Objekte, welche gezeichnet werden
let objects = [sphere, object, capsule, cube];

// Erstelle die Lichter und füge dieser der Kamera hinzu
let dLight = new DirectionalLight("dLight", [-3, 10, -3], [1, -3, -1], 0.2, 0.9, 1.0);
let pLight = new PointLight("pLight", [0, 1, 2], 1, 0.07, 0.17, 0.05, 0.5, 0.5);
renderer.addLight(dLight);
renderer.addLight(pLight);

// Den depthFrameBuffer erstellen
let depthFrameBuffer = new FrameBuffer(canvas.clientHeight, canvas.clientWidth);

// Paths anlegen
let paths = [
    "Resources/park/posx.jpg", "Resources/park/negx.jpg", 
    "Resources/park/posy.jpg", "Resources/park/negy.jpg", 
    "Resources/park/posz.jpg", "Resources/park/negz.jpg"
];

// Das Tiefenbild erzeugen
depthFrameBuffer.bind();

// Cull-Frace auf Front setzen
gl.cullFace(gl.FRONT); 

renderer.renderDepthScene(objects, dLight);
depthFrameBuffer.unbind();

// Cull-Face auf Back setzen
gl.cullFace(gl.BACK);

// Die Skybox erstellen
let skybox = new Skybox(paths, 2);

// Die Skybox zeichnen
renderer.renderSkybox(skybox, camera);

// Das Element, was die Umgebungsmap reflektiert, erstellen
let envShader = new Shader(vertexShaderString, fragmentShaderEnvString);
let envColor = new Color(envShader, 0, 0.5, 0);
envColor.ambient = [1, 1, 1];
envColor.diffuse = [1, 1, 1];
envColor.specular = [1, 1, 1];
envColor.shininess = 77;
let envSphere = new Sphere(envShader, false, envColor, null, "e");
envSphere.transform.move([0, 0, 0]);

// Die Environment-Map zeichnen
let environmentalMap = new EnvironmentalMap(3, (camera) => renderer.render(objects, camera, depthFrameBuffer.depthMap, skybox), canvas.clientWidth, canvas.clientHeight);

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

    // Cull-Face auf Back setzen
    gl.cullFace(gl.BACK);

    // Cull-Face aktivieren
    gl.enable(gl.CULL_FACE);

    // Den Mobster rotieren
    object.transform.rotateY(2);

    // Die Elemente zeichnen
    renderer.render(objects, camera, depthFrameBuffer.depthMap, skybox);

    // Die Environmentalmap neu rendern (Achtung: sehr rechenintensiv)
    environmentalMap.rerender();

    // Das EnvMap-Element zeichnen
    renderer.drawReflectiveEnvMapElement(envSphere, camera, environmentalMap);

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
