const canvas = document.querySelector("#glCanvas");
const gl = canvas.getContext("webgl");
const vsSourceString =
    `
    attribute vec3 aPosition;
    uniform mat4 uRotate;
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
let squareRotation = 0.0;

main();

function main() {
    // Nur fortfahren, wenn WebGL verfügbar ist und funktioniert
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    resetCanvas();

    let housePositions = new Float32Array(
        [
            0.01, 0 ,
            -0.01, 0.2   ,
            0.01 , 0.2   ,

            -0.01, 0,
            0.01 , 0,
            -0.01, 0.2
        ]
    );

    let roofPositions = new Float32Array(
        [
            -0.05, 0.2   ,
            0 , 0.25 ,
            0.05 , 0.2
        ]
    );

    const vertexShader = createVertexShader(vsSourceString);
    const fragmentShader = createFragmentShader(fsSourceString);
    const shaderProgram = initShader(vertexShader, fragmentShader);
    const programInfo = {
        shaderProgram: shaderProgram,
        attributeLocations: {
            aPosition: gl.getAttribLocation(shaderProgram, "aPosition")
        },
        uniformLocations: {
            uColor: gl.getUniformLocation(shaderProgram, "uColor"),
            uRotate: gl.getUniformLocation(shaderProgram, "uRotate")
        }
    };
    /*
    // Draw the scene repeatedly
    function render(now) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;

        drawScene(gl, programInfo, buffers, deltaTime);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);*/

    // Bei n-verschiedenen Shadern => n-mal useProgram
    //drawObject(programInfo, housePositions, 2, 6, new Float32Array([1.0, 0.0, 1.0]));
    //drawObject(programInfo, roofPositions, 2, 3, new Float32Array([0.0, 1.0, 0.0]));
    drawScene(programInfo, housePositions, roofPositions, 0);

    // Aufräumen
    gl.detachShader(programInfo.shaderProgram, vertexShader);
    gl.detachShader(programInfo.shaderProgram, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    gl.deleteProgram(shaderProgram);
}

//
// Draw the scene.
//
function drawScene(programInfo, housePositions, roofPositions, deltaTime) {
    this.resetCanvas();

    // Bei n-verschiedenen Shadern => n-mal useProgram
    drawObject(programInfo, housePositions, 2, 6, new Float32Array([1.0, 0.0, 1.0]));
    drawObject(programInfo, roofPositions, 2, 3, new Float32Array([0.0, 1.0, 0.0]));

    squareRotation += deltaTime;
}

function drawObject(programInfo, positions, dimension, vertexCount, colorArray)
{
    const buffers = initBuffer(programInfo.shaderProgram, positions, colorArray);

    // Den Position-Buffer binden und verbinden
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(programInfo.attributeLocations.position, dimension, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attributeLocations.position);

    const rotationMatrix = mat4.create();

    // Bei n-verschiedenen Shadern => n-mal useProgram
    gl.useProgram(programInfo.shaderProgram);
    gl.uniform3fv(programInfo.uniformLocations.uColor, colorArray);
    gl.uniform4fv(programInfo.uniformLocations.uRotate, rotationMatrix);

    // offset is 0, with 1 element, TRIANGLE STRIP
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

    gl.disableVertexAttribArray(programInfo.attributeLocations.position);
    gl.disableVertexAttribArray(programInfo.uniformLocations.uColor);
}

function initBuffer(shaderProgram, positions, color)
{
    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const colorBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuf);
    gl.bufferData(gl.ARRAY_BUFFER, color, gl.STATIC_DRAW);
    return {position: posBuf, color: colorBuf};
}

function initShader(vertexShader, fragmentShader)
{
    if (vertexShader && fragmentShader) {
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
            console.warn("Could not	link program: "	+ gl.getProgramInfoLog(program));
            return null;
        }

        return program;
    }

    return null
}

function createVertexShader(vsSourceString)
{
    let shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(shader, vsSourceString);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        let info = gl.getShaderInfoLog(shader);
        console.warn("could not compile web gl shader. \n\n" + info);
    }

    return shader;
}

function createFragmentShader(fsSourceString)
{
    let shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(shader, fsSourceString);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        let info = gl.getShaderInfoLog(shader);
        console.warn("could not compile web gl shader. \n\n" + info);
    }

    return shader;
}

function resetCanvas()
{
    // Setze clear color auf schwarz, vollständig sichtbar
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.viewport(0, 0,	canvas.width, canvas.height);

    // Lösche den color buffer mit definierter clear color
    gl.clear(gl.COLOR_BUFFER_BIT |	gl.DEPTH_BUFFER_BIT);
}