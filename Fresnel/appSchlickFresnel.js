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
import fragmentShaderSchlickFresnelColorString from './Shaders/FragmentShaderSchlickFresnelColor.js';
import fragmentShaderSchlickFresnelTextureString from './Shaders/FragmentShaderSchlickFresnelTexture.js';

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
let objShader1 = new Shader(vertexShaderString, fragmentShaderSchlickFresnelTextureString);
let texture1 = new Texture(objShader1, path + "Resources/capsule0.jpg", 4);
let capsule1 = new Object(objShader1, 'Resources/capsule.obj', 1, null, texture1, "r");
capsule1.transform.move([-1, -0.5, -3]);

// Erstelle den Mobster
let objShader2 = new Shader(vertexShaderString, fragmentShaderSchlickFresnelColorString);
let color2 = new Color(objShader2, 0.9, 0.7, 0.1);
color2.metalness = 0.5;
let object2 = new Object(objShader2, 'Resources/mobster.obj', 1, color2, null, "r");
object2.transform.move([-3, 0, 2]);

// Erstelle den Cube
let objShader3 = new Shader(vertexShaderString, fragmentShaderSchlickFresnelColorString);
let color3 = new Color(objShader3, 0, 0.5, 0, 1);
color3.ambient = [1, 1, 1];
color3.diffuse = [1, 1, 1];
color3.specular = [1, 1, 1];
color3.shininess = 77;
let cube3 = new Cube(objShader3, false, color3, null, "r");
cube3.transform.move([0, 3, 0]);

// Erstelle die Sphere
let objShader4 = new Shader(vertexShaderString, fragmentShaderSchlickFresnelColorString);
let color4 = new Color(objShader4, 0, 0.5, 0.5);
let sphere4 = new Sphere(objShader4, false, color4, null, "r");
sphere4.transform.move([4, 2.5, 2]);

// Erstelle einen weiteren Cube
let objShader5 = new Shader(vertexShaderString, fragmentShaderSchlickFresnelTextureString);
let texture5 = new Texture(objShader5, path + 'Resources/rustediron2_basecolor.png', 3, 1.0);
let cube5 = new Cube(objShader5, true, null, texture5, "r");
cube5.transform.move([4, 2, -2]);

// Erstelle plane
let objShader6 = new Shader(vertexShaderString, fragmentShaderSchlickFresnelColorString);
let color6 = new Color(objShader6, 0.9, 0.1, 0.1);
color6.ambient = [1, 0.5, 0.31];
color6.diffuse = [1, 0.5, 0.31];
color6.specular = [0.5, 0.5, 0.5];
color6.shininess = 32;
let plane6 = new Cube(objShader6, false, color6, null, "r");
plane6.transform.setScale([10, 0.1, 10]);
plane6.transform.move([0, -3.5, 0]);

// Erstelle die Lichter und füge dieser der Kamera hinzu
let dLight = new DirectionalLight("dLight", [-3, 10, -3], [1, -3, -1], 0.2, 0.9, 1.0);
let pLight = new PointLight("pLight", [0, 1, 2], 1, 0.07, 0.17, 0.05, 0.5, 0.5);
let sLight = new SpotLight("sLight", [2, 2, 5], [0, -1, -0], 12);
renderer.addLight(dLight);
renderer.addLight(pLight);
renderer.addLight(sLight);

// Erstelle die Objekte, welche gezeichnet werden
let objects = [sphere4, cube3, object2, cube5, capsule1, plane6];

// Den depthFrameBuffer erstellen
let depthFrameBuffer = new FrameBuffer(canvas.clientHeight, canvas.clientWidth);

// Pfad hinterlegen
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

    // Cull-Face aktivieren
    gl.enable(gl.CULL_FACE);

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
