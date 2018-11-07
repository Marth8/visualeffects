const canvas = document.querySelector("#glCanvas");
const gl = canvas.getContext("webgl");
const vsSourceString = `
    attribute vec3 position;
    void main() { 
        gl_Position = vec4(position, 1.0);
    }
    `;
const fsSourceString = `
    void main() {
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

    const vertexShader = createVertexShader();
    const fragmentShader = createFragmentShader();
    let shaderProgram = initShader(vertexShader, fragmentShader);

    let posAttributeLocation = generateBuffer(shaderProgram);

    gl.useProgram(shaderProgram);

    gl.enableVertexAttribArray(posAttribLocation);

    // 2 components (x,y); 32bit	floats;	don't normalize;	no stride and offset
    gl.vertexAttribPointer(posAttribLocation,	2,	gl.FLOAT,	false,	0,	0);

    // offset is 0, with 1	element
    gl.drawArrays(gl.POINTS,	0,	1);
    gl.disableVertexAttribArray(posAttribLocation);

    gl.deleteBuffer();

    // Aufräumen
    gl.detachShader(shaderProgram, vertexShader);
    gl.detachShader(shaderProgram, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    gl.deleteProgram(shaderProgram);
}

function generateBuffer(shaderProgram)
{
    let posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,	posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0]), gl.STATIC_DRAW);
    let posAttribLocation =	gl.getAttribLocation(shaderProgram,	"pos");

    return posAttribLocation;
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
    return shader;
}

function createFragmentShader(fsSourceString)
{
    let shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(shader, fsSourceString);
    gl.compileShader(shader);
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