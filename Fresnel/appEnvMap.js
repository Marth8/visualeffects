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
import fragmentShaderColorString from './Shaders/FragmentShaderColor.js';
import fragmentShaderTextureString from './Shaders/FragmentShaderTexture.js';
import Skybox from './Classes/Skybox.js';
import fragmentShaderSkyboxReflectiveString from './Shaders/FragmentShaderSkyboxReflective.js';
import EnvironmentalMap from './Classes/EnvironmentalMap.js';
import fragmentShaderEnvString from './Shaders/FragmentShaderEnv.js';

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
let objShader = new Shader(vertexShaderString, fragmentShaderTextureString);
let texture4 = new Texture(objShader, path + "Resources/capsule0.jpg", 4);
let capsule = new Object(objShader, 'Resources/capsule.obj', 1, null, texture4, "n");
capsule.transform.move([-1, -2.5, -3]);

// Erstelle den Mobster
let objShader2 = new Shader(vertexShaderString, fragmentShaderColorString);
let color = new Color(objShader2, 0.9, 0.7, 0.1);
let object = new Object(objShader2, 'Resources/mobster.obj', 1, color, null, "n");
object.transform.move([-3, 0, 2]);

// Erstelle die Sphere
let objShader5 = new Shader(vertexShaderString, fragmentShaderSkyboxReflectiveString);
let color5 = new Color(objShader5, 0, 0.5, 0);
let sphere = new Sphere(objShader5, false, color5, null, "fr");
sphere.transform.move([4, -2, 2]);

// Erstelle die Objekte, welche gezeichnet werden
let objects = [sphere, object, capsule];

// Erstelle die Lichter und füge dieser der Kamera hinzu
let dLight = new DirectionalLight("dLight", [-3, 10, -3], [1, -3, -1], 0.2, 0.9, 1.0);
let pLight = new PointLight("pLight", [0, 1, 2], 1, 0.07, 0.17, 0.05, 0.5, 0.5);
let sLight = new SpotLight("sLight", [2, 2, 5], [0, -1, -0], 12);
renderer.addLight(dLight);
renderer.addLight(pLight);
renderer.addLight(sLight);

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

// Die Environment-Map zeichnen
let environmentalMap = new EnvironmentalMap(6, () => renderer.render(objects, camera, depthFrameBuffer.depthMap, skybox), canvas.clientWidth, canvas.clientHeight);
let envShader = new Shader(vertexShaderString, fragmentShaderEnvString);
let color2 = new Color(envShader, 0, 0.5, 0);
color2.ambient = [1, 1, 1];
color2.diffuse = [1, 1, 1];
color2.specular = [1, 1, 1];
color2.shininess = 77;
let cube3 = new Cube(envShader, false, color2, null, "e");
cube3.transform.move([0, 0, 0]);

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

    // Cull-Face aktivieren
    gl.enable(gl.CULL_FACE);

    // Die Skybox zeichnen
    renderer.renderSkybox(skybox, camera);

    // Die Elemente zeichnen
    renderer.render(objects, camera, depthFrameBuffer.depthMap, skybox);

    // Die Environmentalmap neuzeichnen
    environmentalMap.rerender();

    // Das EnvMap-Element zeichnen
    renderer.drawReflectiveEnvMapElement(cube3, camera, environmentalMap);

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
