const canvas = document.querySelector("#glCanvas");
const gl = canvas.getContext("webgl");
const vsSourceString =
    `attribute vec3 position;
    void main() {
        gl_PointSize = 10.0;
        gl_Position = vec4(position, 1.0);
    }`;
const fsSourceString =
    `void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }`;

const fsRedString =
    `void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }`;

const fsBlueString =
    `void main() {
        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    }`;

const fsGreenString =
    `void main() {
        gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    }`;

main();

/// TODO: Punkt rendern und dann zum Dreieck rendern
function main() {
    // Nur fortfahren, wenn WebGL verfügbar ist und funktioniert
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    resetCanvas();

    let housePositions = new Float32Array(
        [
            0.4, -0.6,
            -0.4, 0   ,
            0.4 , 0   ,

            -0.4, -0.6,
            0.4 , -0.6,
            -0.4, 0
        ]
    );

    let roofPositions = new Float32Array(
        [
            -0.5, 0   ,
            0   , 0.5 ,
            0.5 , 0
        ]
    );

    // Bei n-verschiedenen Shadern => n-mal useProgram
    drawObject(housePositions, 2, 6, vsSourceString, fsBlueString);
    drawObject(roofPositions, 2, 3, vsSourceString, fsRedString);
}

function drawObject(positions, dimension, vertexCount, vsSourceString, fsSourceString)
{
    const vertexShader = createVertexShader(vsSourceString);
    const fragmentShader = createFragmentShader(fsSourceString);
    let shaderProgram = initShader(vertexShader, fragmentShader);
    let posAttributeLocation = initBuffer(shaderProgram, positions);
    let buffers = {position: posAttributeLocation};

    // Bei n-verschiedenen Shadern => n-mal useProgram
    gl.useProgram(shaderProgram);
    gl.enableVertexAttribArray(buffers);

    // 2 components (x,y); 32bit floats; don't normalize; no stride and offset
    gl.vertexAttribPointer(buffers, dimension, gl.FLOAT, false, 0, 0);

    // offset is 0, with 1 element, TRIANGLE STRIP
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

    gl.disableVertexAttribArray(buffers);

    // Aufräumen
    gl.detachShader(shaderProgram, vertexShader);
    gl.detachShader(shaderProgram, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    gl.deleteProgram(shaderProgram);
}

function drawScene(buffers, dimension, vertexCount)
{
    resetCanvas();

    gl.enableVertexAttribArray(buffers);

    // 2 components (x,y); 32bit floats; don't normalize; no stride and offset
    gl.vertexAttribPointer(buffers, dimension, gl.FLOAT, false, 0, 0);

    // offset is 0, with 1 element, TRIANGLE STRIP
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

    gl.disableVertexAttribArray(buffers);
}

function initBuffer(shaderProgram, positions)
{
    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    return gl.getAttribLocation(shaderProgram, "position");
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