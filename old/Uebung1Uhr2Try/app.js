let gl = null;
let vs = null;
let fs = null;
let canvas = null;
let shaderProgram = null;
let posAttribLocation = null;
let color = null;
let positionBuffer = null;
let texcoordLocation = null;
let squareRotation = 0;

const trianglePositions = 
    new Float32Array([
        0.01, 0 ,
        -0.01, 0.2   ,
        0.01 , 0.2   ,

        -0.01, 0,
        0.01 , 0,
        -0.01, 0.2,

        -0.05, 0.2   ,
        0 , 0.25 ,
        0.05 , 0.2
    ]);

function main() {
    let test = "#ifdef GL_FRAGMENT_PRECISION_HIGH" +
                "precision highp float;" + 
                "#else" +
                "precision mediump float;" + 
                "#endif";

    canvas = document.getElementById('c');
    initGl(canvas);

    // Nur weiter machen, wenn WebGL verfügbar ist.
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    }

    let vertexShaderStr =`
                        uniform vec3 color;
                        varying vec3 vColor;
                        attribute vec3 position;
                        uniform mat4 uRotate;
                        void main () { 
                            vColor = color;
                            gl_PointSize = 10.0;
                            gl_Position = vec4(position, 1.0);
                        }`;

    let fragmentShaderStr = `
                        precision mediump float; 
                        varying vec3 vColor; 
                        void main() {
                            gl_FragColor = vec4(vColor, 1.0);
                        }`;

    vs = createShaderFunction(gl.VERTEX_SHADER, vertexShaderStr);
    fs = createShaderFunction(gl.FRAGMENT_SHADER, fragmentShaderStr);
    shaderProgram = createProgramFunction(vs, fs);

    // Look up the location of the attributes and uniforms.
    color = gl.getUniformLocation(shaderProgram, "color");
    posAttribLocation = gl.getAttribLocation(shaderProgram, "position");

    // Because attributes get their date from buffers, its necessary to create one.
    positionBuffer = gl.createBuffer();
    
    // Um den Zugriff auf den Buffer zu ermöglichen, wird die Referenz zu diesem erstellt.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Dem Buffer die Daten übergeben.
    gl.bufferData(gl.ARRAY_BUFFER, trianglePositions, gl.STATIC_DRAW);

    animate();

    // cleanup();
}

function cleanup() {
    gl.disableVertexAttribArray(posAttribLocation);

    // finally delete VBO after last frame
    gl.deleteBuffer(positionBuffer);

    // Speicher freigeben.
    gl.detachShader(shaderProgram, vs);
    gl.detachShader(shaderProgram, fs);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.deleteProgram(shaderProgram);
}

function initGl(canvas) {
    gl = canvas.getContext('webgl', {alpha:true, depth:true});
}

function updateScene() {
    // asdf
}

function renderScene() {
    // Setzt den Ansichtsbereich, welcher die Transformation
    // von x und y von normalisierten Geräte Koordinaten
    // zu window Koordinaten spezifiziert.
    // (x, y, width, height)
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight)

    // Clear the canvas (setting the background color)
    gl.clearColor(0.47, 0.66, 0.25, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Clear the depth buffer. Saves the depth for each pixel.
    gl.clearDepth(1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    // Tiefentest einschalten.
    gl.enable(gl.DEPTH_TEST);

    // Tell WebGl which shader program to execute.
    gl.useProgram(shaderProgram);

    // Tell WebGL how to take date from the buffer and supply it to
    // the attribute in the shader. For that, its necessary to turn
    // the attribute on.
    gl.enableVertexAttribArray(posAttribLocation);

    // Tell the attribute how to get data out of positionBuffer.
    gl.vertexAttribPointer(posAttribLocation, 2, gl.FLOAT, false, 0, 0);

    // oberes linkes Dreieck der Hausmauer.
    // unteres rechtes Dreieck der Hausmauer.
    // Setzt die Farbe für das linke Dreieck, der unteren Haushälfte.
    gl.uniform3f(color, 1.0, 0.96, 0.6);

    // offset is 0, with 1 element
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    
    // Setzt die Farbe für das Dach.
    gl.uniform3f(color, 0.99, 0.27, 0.29);
    gl.drawArrays(gl.TRIANGLES, 6, 3);
}

// Rendering Loop für bspw. Animationen.
function animate() {
    updateScene();
    renderScene();
    requestAnimationFrame(animate);
}

function createShaderFunction(type, shaderString) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, shaderString);
    gl.compileShader(shader);

    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgramFunction(vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log("Beim Erstellen des Programms ist ein Fehler aufgetreten." + gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}