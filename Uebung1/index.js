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

main();

/// TODO: Punkt rendern und dann zum Dreieck rendern
function main() {
    // Nur fortfahren, wenn WebGL verfügbar ist und funktioniert
    if (!gl) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
      return;
    }

    resetCanvas();

    const vertexShader = createVertexShader(vsSourceString);
    const fragmentShader = createFragmentShader(fsSourceString);
    let shaderProgram = initShader(vertexShader, fragmentShader);

    const posBuf = gl.createBuffer();
    let positions = new Float32Array([-0.75, 0, 0, 0.75, 0.75, 0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    let posAttributeLocation =	gl.getAttribLocation(shaderProgram,	"position");

    resetCanvas();

    gl.useProgram(shaderProgram);

    gl.enableVertexAttribArray(posAttributeLocation);

    // 2 components (x,y); 32bit floats; don't normalize; no stride and offset
    gl.vertexAttribPointer(posAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // offset is 0, with 1 element, TRIANGLE STRIP
    gl.drawArrays(gl.TRIANGLE_STRIP, 0,	3);

    gl.disableVertexAttribArray(posAttributeLocation);

    // Aufräumen
    gl.detachShader(shaderProgram, vertexShader);
    gl.detachShader(shaderProgram, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    gl.deleteProgram(shaderProgram);
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