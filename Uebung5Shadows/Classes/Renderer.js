import GL from './GL.js';
import Shader from "./Shader.js";
import GameObject from "./Gameobject.js"
const vertexShaderShadow = `
uniform mat4 uTransform;
attribute vec3 aPosition;
varying vec4 vProjCoord;

void main() {
    vProjCoord  = uTransform * vec4(position, 1.0);
    gl_Position = vProjCoord;
}
`;
const fragmentShaderShadow = `
varying vec4 vProjCoord;

void main() {
    vec3 proj = (vProjCoord.xyz / vProjCoord.w + 1.0) / 2.0;
    gl_FragColor = vec4(proj, 1.0);
}
`;
class Renderer
{
    constructor()
    {
       this.gl = GL.getGL();
       this.lights = [];
    }

    addLight(light)
    {
        this.lights.push(light);
    }

    draw(vertexArray, indexBuffer, shader)
    {
        shader.bind();
        vertexArray.bind();
        indexBuffer.bind();

        // Zeichnen der Elemente
        this.gl.drawElements(this.gl.TRIANGLES, indexBuffer.count, this.gl.UNSIGNED_SHORT, 0);
    }

    drawGameObject(gameObject, shader, camera)
    {
        shader.bind();

        this.lights.forEach(value => value.bind(shader));

        let matrix = camera.getViewProjectionMatrix();
        mat4.multiply(matrix, matrix, gameObject.transform.getWorldMatrix());
        shader.setUniformMatrix4fv("uTransform", false, matrix);

        let normalMatrix = mat4.create();
        mat4.invert(normalMatrix, modelMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        element.shader.setUniformMatrix4fv("uNormalMatrix", false, normalMatrix);
        gameObject.draw();
    }
    
    drawElement(element, camera)
    {
        element.shader.bind();

        this.lights.forEach(value => value.bind(element.shader));

        let modelViewMatrix = mat4.create();
        mat4.multiply(modelViewMatrix, camera.getViewMatrix(), element.gameObject.transform.getWorldMatrix());
        element.shader.setUniformMatrix4fv("uModelViewMatrix", false, modelViewMatrix);

        let normalMatrix = mat4.create();
        mat4.invert(normalMatrix, modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        element.shader.setUniformMatrix4fv("uNormalMatrix", false, normalMatrix);

        let matrix = camera.getViewProjectionMatrix();
        let modelMatrix = element.gameObject.transform.getWorldMatrix();
        mat4.multiply(matrix, matrix, modelMatrix);
        element.shader.setUniformMatrix4fv("uTransform", false, matrix);

        element.shader.setUniformMatrix4fv("uModelMatrix", false, element.gameObject.transform.getWorldMatrix());

        element.gameObject.draw();
    }

    drawElementWithoutLight(element, camera)
    {
        element.shader.bind();

        let matrix = camera.getViewProjectionMatrix();
        let modelMatrix = element.gameObject.transform.getWorldMatrix();
        mat4.multiply(matrix, matrix, modelMatrix);
        element.shader.setUniformMatrix4fv("uTransform", false, matrix);

        element.gameObject.draw();
    }

    drawElements(elements, camera, zSorting)
    {
        if (zSorting)
        {
            const sorting = [];
            for(let element of elements)
            {
                if(element.canBeDrawn)
                {
                    let zMatrix = mat4.create();
                    mat4.multiply(zMatrix, camera.getViewMatrix(), element.gameObject.transform.getWorldMatrix());
                    let zPos = zMatrix[14];
                    sorting.push({element: element, z: zPos});
                }
            }

            sorting.sort((a, b) => a.z - b.z);

            for(let zElement of sorting)
            {
                this.drawElement(zElement.element, camera);
            }
        }
        else
        {
            for(let element of elements)
            {
                if(element.canBeDrawn)
                {
                    this.drawElement(element, camera);
                }
            }
        }

        for(let light of this.lights)
        {
            if(light.type == "p")
            {
                let lightCube = light.getLightCube();
                lightCube.gameObject.transform.setScale([0.3, 0.3, 0.3]);
                lightCube.gameObject.transform.move(light.position);
                this.drawElementWithoutLight(lightCube, camera);
            } 
        }
    }

    renderDepthScene(elements, light, left = -10.0, right = 10.0, bottom = 10.0, top = 10.0, nearPlane = 1.0, farPlane = 7.5)
    {
        let lightProjection = mat4.create();
        mat4.ortho(lightProjection, left, right, bottom, top, nearPlane, farPlane);  
        let lightView = light.getViewMatrix();
        let lightViewProjection = mat4.create();
        mat4.multiply(lightViewProjection, lightProjection, lightView);

        // Das neue Programm mit dem neuen Shader hinterlegen
        const newProgram = gl.createProgram();
        let vertexshader = Shader.getShader(vsShaderString, "vertex");
        let fragmentShader = Shader.getShader(fsShaderString, "fragment");
        gl.attachShader(newProgram, vertexshader);
        gl.attachShader(newProgram, fragmentShader);
        this.gl.linkProgram(newProgram);
        this.gl.useProgram(newProgram);

        for(let element of elements)
        {
            let matrix = light.getViewProjectionMatrix();
            let modelMatrix = element.gameObject.transform.getWorldMatrix();
            mat4.multiply(matrix, matrix, modelMatrix);
            this.gl.uniformMatrix4fv(this.gl.getUniformLocation(newProgram, "uTransform"));
            element.draw(false);
        };
    }

    clear()
    {
        // Clear the canvas (setting the background color)
        this.gl.clearColor(0.47, 0.66, 0.25, 1.0)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // Clear the depth buffer. Saves the depth for each pixel.
        this.gl.clearDepth(1.0);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);

        // Tiefentest einschalten.
        this.gl.enable(this.gl.DEPTH_TEST);
    }
}

export default Renderer;