import GL from './GL.js';
import Shader from "./Shader.js";
import DirectionalLight from './DirectionalLight.js';
import vertexShaderShadowString from './../Shaders/VertexShaderShadow.js';
import fragmentShaderShadowString from './../Shaders/FragmentShaderShadow.js';

/**
 * Klasse repräsentiert den Renderer.
 */
class Renderer
{
    /**
     * Konstruktor zum Erstellen des Renderers.
     */
    constructor()
    {
       this.gl = GL.getGL();
       this.lights = [];
    }

    /**
     * Methode zum Hinzufügen eines lichtes.
     * @param {Light} light Das Licht.
     */
    addLight(light)
    {
        this.lights.push(light);
    }

    /**
     * Methode zum Rendern der Szene anhand des Typs der Objekte.
     * @param {array} elements Die Elemente.
     * @param {ViewCamera} camera Die Kamera.
     * @param {*} shadowMap Die Shadowmap
     * @param {Skybox} skybox Die Skybox 
     */
    render(elements, camera, shadowMap, skybox)
    {
        // Den Elementen ein z-Position geben
        const sorting = [];
        for(let element of elements)
        {
            if(element.canBeDrawn)
            {
                let zMatrix = mat4.create();
                mat4.multiply(zMatrix, camera.getViewMatrix(), element.transform.getWorldMatrix());
                let zPos = zMatrix[14];
                sorting.push({element: element, z: zPos});
            }
        }

        // z-Sorting durchführen
        sorting.sort((a, b) => a.z - b.z);

        // Elemente anhand des z-Sortings zeichnen
        for(let zElement of sorting)
        {
            switch(zElement.element.type)
            {
                case "fr":
                    this.drawFullReflectiveElement(zElement.element, camera, skybox);
                    break;
                case "r":
                    this.drawReflectiveElement(zElement.element, camera, shadowMap, skybox);
                    break;
                case "e":
                    this.drawReflectiveEnvMapElement(zElement.element, camera, skybox)
                case "n":
                default: 
                    this.drawElementWithShadow(zElement.element, camera, shadowMap, skybox);
                    break;
            }
        }
    }

    drawReflectiveEnvMapElement(element, camera, envMap)
    {
        // Den Shader binden
        element.shader.bind();

        // Die envMap binden
        envMap.bind();

        // Die ModelViewmatrix setzen
        let modelViewMatrix = mat4.create();
        let modelWorldMatrix = element.transform.getWorldMatrix();
        mat4.multiply(modelViewMatrix, camera.getViewMatrix(), modelWorldMatrix);
        element.shader.setUniformMatrix4fv("uModelViewMatrix", false, modelViewMatrix);

        // Die Normalenmatrix setzen
        let normalMatrix = mat4.create();
        mat4.invert(normalMatrix, modelWorldMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        element.shader.setUniformMatrix4fv("uNormalMatrix", false, normalMatrix);

        // Die ModelViewProjectionMatrix setzen
        let matrix = camera.getViewProjectionMatrix();
        let modelMatrix = element.transform.getWorldMatrix();
        mat4.multiply(matrix, matrix, modelMatrix);
        element.shader.setUniformMatrix4fv("uTransform", false, matrix);

        // Die ModelMatrix setzen
        element.shader.setUniformMatrix4fv("uModelMatrix", false, element.transform.getWorldMatrix());

        // Die LightSpaceMatrix setzen
        element.shader.setUniformMatrix4fv("lightSpaceMatrix", false, this.lightViewProjection);

        // Die Camera(Eye)-Position setzen
        let eyePosition = camera.getEyePosition();
        element.shader.setUniform3f("uEyePosition", eyePosition[0], eyePosition[1], eyePosition[2]);

        // Die InverseViewTransform setzen
        
        // Die EnvMap setzen
        element.shader.setUniform1i("envBox", envMap.slot);

        // Zeichnen
        element.draw(false);
    }

    /**
     * Methode zum Zeichnen eines Elements mit Schatten.
     * @param {*} element Das Element (Objekt, Cube, Sphere oder Plane).
     * @param {ViewCamera} camera Die Kamera.
     * @param {*} shadowMap Die Texture des Tiefenbildes.
     * @param {Skybox} skybox Die Skybox.
     */
    drawReflectiveElement(element, camera, shadowMap, skybox)
    {
        // Den Shader binden
        element.shader.bind();

        // Die Lichter binden
        this.lights.forEach(value => value.bind(element.shader, camera));

        // Die ModelViewmatrix setzen
        let modelViewMatrix = mat4.create();
        let modelWorldMatrix = element.transform.getWorldMatrix();
        mat4.multiply(modelViewMatrix, camera.getViewMatrix(), modelWorldMatrix);
        element.shader.setUniformMatrix4fv("uModelViewMatrix", false, modelViewMatrix);

        // Die Normalenmatrix setzen
        let normalMatrix = mat4.create();
        mat4.invert(normalMatrix, modelWorldMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        element.shader.setUniformMatrix4fv("uNormalMatrix", false, normalMatrix);

        // Die ModelViewProjectionMatrix setzen
        let matrix = camera.getViewProjectionMatrix();
        let modelMatrix = element.transform.getWorldMatrix();
        mat4.multiply(matrix, matrix, modelMatrix);
        element.shader.setUniformMatrix4fv("uTransform", false, matrix);

        // Die ModelMatrix setzen
        element.shader.setUniformMatrix4fv("uModelMatrix", false, element.transform.getWorldMatrix());

        // Die LightSpaceMatrix setzen
        element.shader.setUniformMatrix4fv("lightSpaceMatrix", false, this.lightViewProjection);

        // Die Camera(Eye)-Position setzen
        let eyePosition = camera.getEyePosition();
        element.shader.setUniform3f("uEyePosition", eyePosition[0], eyePosition[1], eyePosition[2]);

        // Das Tiefenbild setzen
        this.gl.activeTexture(this.gl.TEXTURE0 + 0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, shadowMap);
        element.shader.setUniform1i("shadowMap", 0); 

        // Die Skybox setzen
        this.gl.activeTexture(this.gl.TEXTURE0 + 2);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, skybox.cubeMap.texture);
        element.shader.setUniform1i("skybox", 2);

        // Zeichnen
        element.draw();
    }

    /**
     * Methode zum Zeichnen eines reflektiven Elements.
     * @param {*} element Das Element (Objekt, Cube, Sphere oder Plane).
     * @param {ViewCamera} camera Die Kamera.
     * @param {Skybox} skybox Die Skybox.
     */
    drawFullReflectiveElement(element, camera, skybox)
    {
        // Den Shader binden
        element.shader.bind();

        // Die ModelViewmatrix setzen
        let modelViewMatrix = mat4.create();
        let modelWorldMatrix = element.transform.getWorldMatrix();
        mat4.multiply(modelViewMatrix, camera.getViewMatrix(), modelWorldMatrix);
        element.shader.setUniformMatrix4fv("uModelViewMatrix", false, modelViewMatrix);

        // Die Normalenmatrix setzen
        let normalMatrix = mat4.create();
        mat4.invert(normalMatrix, modelWorldMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        element.shader.setUniformMatrix4fv("uNormalMatrix", false, normalMatrix);

        // Die ModelViewProjectionMatrix setzen
        let matrix = camera.getViewProjectionMatrix();
        let modelMatrix = element.transform.getWorldMatrix();
        mat4.multiply(matrix, matrix, modelMatrix);
        element.shader.setUniformMatrix4fv("uTransform", false, matrix);

        // Die ModelMatrix setzen
        element.shader.setUniformMatrix4fv("uModelMatrix", false, element.transform.getWorldMatrix());

        // Die LightSpaceMatrix setzen
        element.shader.setUniformMatrix4fv("lightSpaceMatrix", false, this.lightViewProjection);

        // Die Camera(Eye)-Position setzen
        let eyePosition = camera.getEyePosition();
        element.shader.setUniform3f("uEyePosition", eyePosition[0], eyePosition[1], eyePosition[2]);

        // Die Skybox setzen
        this.gl.activeTexture(this.gl.TEXTURE0 + 2);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, skybox.cubeMap.texture);
        element.shader.setUniform1i("skybox", 2);

        // Zeichnen
        element.draw(false);
    }

    /**
     * Methode zum Zeichnen eines Elements mit Schatten.
     * @param {*} element Das Element (Objekt, Cube, Sphere oder Plane).
     * @param {ViewCamera} camera Die Kamera.
     * @param {*} shadowMap Die Texture des Tiefenbildes.
     */
    drawElementWithShadow(element, camera, shadowMap, skybox)
    {
        // Den Shader binden
        element.shader.bind();

        // Die Lichter binden
        this.lights.forEach(value => value.bind(element.shader, camera));

        // Die ModelViewmatrix setzen
        let modelViewMatrix = mat4.create();
        let modelWorldMatrix = element.transform.getWorldMatrix();
        mat4.multiply(modelViewMatrix, camera.getViewMatrix(), modelWorldMatrix);
        element.shader.setUniformMatrix4fv("uModelViewMatrix", false, modelViewMatrix);

        // Die Normalenmatrix setzen
        let normalMatrix = mat4.create();
        mat4.invert(normalMatrix, modelWorldMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        element.shader.setUniformMatrix4fv("uNormalMatrix", false, normalMatrix);

        // Die ModelViewProjectionMatrix setzen
        let matrix = camera.getViewProjectionMatrix();
        let modelMatrix = element.transform.getWorldMatrix();
        mat4.multiply(matrix, matrix, modelMatrix);
        element.shader.setUniformMatrix4fv("uTransform", false, matrix);

        // Die ModelMatrix setzen
        element.shader.setUniformMatrix4fv("uModelMatrix", false, element.transform.getWorldMatrix());

        // Die LightSpaceMatrix setzen
        element.shader.setUniformMatrix4fv("lightSpaceMatrix", false, this.lightViewProjection);

        // Die Camera(Eye)-Position setzen
        let eyePosition = camera.getEyePosition();
        element.shader.setUniform3f("uEyePosition", eyePosition[0], eyePosition[1], eyePosition[2]);

        // Das Tiefenbild setzen
        this.gl.activeTexture(this.gl.TEXTURE0 + 0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, shadowMap);
        element.shader.setUniform1i("shadowMap", 0); 

        // Zeichnen
        element.draw();
    }
    
    /**
     * Methode zum Zeichnen eines Elements ohne Licht (normalerweise LightCube)
     * @param {Cube} element Das Element (normalerweise Cube).
     * @param {ViewCamera} camera Die Camera.
     */
    drawElementWithoutLight(element, camera)
    {
        // Den Shader binden
        element.shader.bind();

        // Die ModelViewProjectionMatrix setzen
        let matrix = camera.getViewProjectionMatrix();
        let modelMatrix = element.transform.getWorldMatrix();
        mat4.multiply(matrix, matrix, modelMatrix);
        element.shader.setUniformMatrix4fv("uTransform", false, matrix);

        // Das Objekt zeichnen
        element.draw(false);
    }

    /**
     * Methode zum Rendern des Tiefenbildes.
     * @param {*} elements Die Elemente (Cube, Sphere, Plane, Objects, ..).
     * @param {DirectionalLight} light Das DirectionalLIght.
     * @param {float} left Linker Anteil des Bereichs.
     * @param {float} right Rechter Anteil des Bereichs.
     * @param {float} bottom Unterer Anteil des Bereichs.
     * @param {float} top Oberer Anteil des Bereichs.
     * @param {float} nearPlane Die nearPlane der Clippingplane.
     * @param {float} farPlane Die farPlane der Clippingplane.
     */
    renderDepthScene(elements, light, left = -10.0, right = 10.0, bottom = -10.0, top = 10.0, nearPlane = 0.1, farPlane = 100)
    {
        // Die Lightprojectionmatrix berechnen
        let lightProjection = mat4.create();
        mat4.ortho(lightProjection, left, right, bottom, top, nearPlane, farPlane); 
        
        // Die Viewmatrix holen und die LightViewProjectionmatrix berechnen
        let lightView = light.getViewMatrix();
        let lightViewProjection = mat4.create();
        mat4.multiply(lightViewProjection, lightProjection, lightView);
        this.lightViewProjection = lightViewProjection;

        // Das neue Programm mit dem neuen Shader hinterlegen
        const newProgram = this.gl.createProgram();
        let vertexshader = Shader.getShader(vertexShaderShadowString, "vertex");
        let fragmentShader = Shader.getShader(fragmentShaderShadowString, "fragment");
        this.gl.attachShader(newProgram, vertexshader);
        this.gl.attachShader(newProgram, fragmentShader);
        this.gl.linkProgram(newProgram);
        this.gl.useProgram(newProgram);

        // Die Elemente aus der Position des Lichtes zeichen
        for(let element of elements)
        {
            // Die Matrix des Elements aus dem Blick des Lichtes erstellen und setzen
            let uTransform = mat4.create();
            let modelMatrix = element.transform.getWorldMatrix();
            mat4.multiply(uTransform, lightViewProjection, modelMatrix);
            this.gl.uniformMatrix4fv(this.gl.getUniformLocation(newProgram, "uTransform"), false, uTransform);

            // Die Elemente ohne Material zeichnen
            element.draw(false);
        };
    }

    /**
     * Methode zum Rendern des Tiefenbildes (Einer Plane mit Texture).
     * @param {Plane} plane Das Tiefenbild auf einer Plane.
     */
    renderDepthPlane(plane)
    {
        plane.shader.bind();
        plane.draw();
    }

    /**
     * Methode zum Rendern der Reflektionsszene anhand des Elements, welches aktuell betrachtet wird.
     * @param {array} elements Die Elemente, die gerendert werden
     * @param {ViewCamera} camera Die Kamera.
     * @param {*} element Das Element.
     */
    renderReflectiveSceneForElement(elements, camera, element)
    {
        this.drawElements(elements, camera);
    }

    /**
     * Methode zum Rendern der Skybox.
     * @param {Skybox} skybox Die Skybox.
     * @param {ViewCamera} camera Die Camera.
     */
    renderSkybox(skybox, camera)
    {
        // Den shader binden
        skybox.shader.bind();

        // Die viewMatrix ermitteln
        let cameraMatrix = camera.getViewMatrix();
        let viewMatrix = mat4.create();
        mat4.invert(viewMatrix, cameraMatrix);

        // Die ViewRotation ermitteln und invertieren
        let viewRotation = quat.create();
        mat4.getRotation(viewRotation, viewMatrix);
        quat.invert(viewRotation, viewRotation);

        // Matrix aus der InversenViewRotation erstellen
        let inverseViewRotationMatrix = mat4.create();
        mat4.fromRotationTranslationScale(inverseViewRotationMatrix, viewRotation, vec3.create(), vec3.fromValues(1, 1, 1));
        
        // Die ProjectionMatrix holen
        let projectionMatrix = camera.getProjectionMatrix();

        // Die ViewDirectionProjectionMatrix neu zusammenabuen
        let viewDirectionProjectionMatrix = mat4.create();
        mat4.multiply(viewDirectionProjectionMatrix, projectionMatrix, inverseViewRotationMatrix);

        // Die Rotation als mat4 setzen
        skybox.shader.setUniformMatrix4fv("uTransform", false, viewDirectionProjectionMatrix);

        // Die Skybox zeichnen
        skybox.draw();
    }

    
    /**
     * Methode zum Zeichnen von Elementen mit Schatten.
     * @param {array} elements Das Array der Elemente.
     * @param {ViewCamera} camera Die Kamera.
     * @param {*} shadowMap Die Texture der Tiefenmap.
     */
    drawElementsWithShadow(elements, camera, shadowMap, skybox)
    {
        // Den Elementen ein z-Position geben
        const sorting = [];
        for(let element of elements)
        {
            if(element.canBeDrawn)
            {
                let zMatrix = mat4.create();
                mat4.multiply(zMatrix, camera.getViewMatrix(), element.transform.getWorldMatrix());
                let zPos = zMatrix[14];
                sorting.push({element: element, z: zPos});
            }
        }

        // z-Sorting durchführen
        sorting.sort((a, b) => a.z - b.z);

        // Elemente anhand des z-Sortings zeichnen
        for(let zElement of sorting)
        {
            this.drawElementWithShadow(zElement.element, camera, shadowMap, skybox);
        }
    }

    /**
     * Methode zum Zeichnen eines Elementes.
     * @param {*} element Das Element (Object, Cube, Plane, Sphere, ..)
     * @param {ViewCamera} camera Die Kamera.
     */
    drawElement(element, camera)
    {
        // Den Shader binden
        element.shader.bind();

        // Die Lichter binden
        this.lights.forEach(value => value.bind(element.shader, camera));

        // Die ModelViewMatrix erstellen und setzen
        let modelViewMatrix = mat4.create();
        mat4.multiply(modelViewMatrix, camera.getViewMatrix(), element.transform.getWorldMatrix());
        element.shader.setUniformMatrix4fv("uModelViewMatrix", false, modelViewMatrix);

        // Die Normalenmatrix erstellen und setzen
        let normalMatrix = mat4.create();
        mat4.invert(normalMatrix, modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        element.shader.setUniformMatrix4fv("uNormalMatrix", false, normalMatrix);

        // Die ModelViewProjectionMatrix erstellen und setzen
        let matrix = camera.getViewProjectionMatrix();
        let modelMatrix = element.transform.getWorldMatrix();
        mat4.multiply(matrix, matrix, modelMatrix);
        element.shader.setUniformMatrix4fv("uTransform", false, matrix);

        // Die ModelMatrix setzen
        element.shader.setUniformMatrix4fv("uModelMatrix", false, element.transform.getWorldMatrix());

        // Das Objekt zeichnen
        element.draw();
    }

    /**
     * Methode zum Zeichnen von mehreren Elementen
     * @param {array} elements Die Elemente im Array.
     * @param {ViewCamera} camera Die Kamera.
     * @param {boolean} zSorting Ob zSorting durchgeführt werden soll.
     */
    drawElements(elements, camera, zSorting)
    {
        // Wenn z-Sorting durchgeführt werden soll.
        if (zSorting)
        {
            // Den Elementen ihre zPosition zuordnen
            const sorting = [];
            for(let element of elements)
            {
                if(element.canBeDrawn)
                {
                    let zMatrix = mat4.create();
                    mat4.multiply(zMatrix, camera.getViewMatrix(), element.transform.getWorldMatrix());
                    let zPos = zMatrix[14];
                    sorting.push({element: element, z: zPos});
                }
            }

            // Die Elemente sortieren
            sorting.sort((a, b) => a.z - b.z);

            // Die Elemente anhand der Position zeichnen
            for(let zElement of sorting)
            {
                this.drawElement(zElement.element, camera);
            }
        }
        else
        {
            // Die Elemente zeichnen
            for(let element of elements)
            {
                if(element.canBeDrawn)
                {
                    this.drawElement(element, camera);
                }
            }
        }

        /*
        // Die Punkt- und Headlights noch als Cube zeichnen
        for(let light of this.lights)
        {
            if(light.type == "p" || light.type == "s")
            {
                let lightCube = light.getLightCube();
                lightCube.transform.setScale([0.3, 0.3, 0.3]);
                lightCube.transform.move(light.position);
                this.drawElementWithoutLight(lightCube, camera);
            } 
        }
        */
    }

    /**
     * Methode zum Resetten des Blickfeldes.
     */
    clear()
    {
        // Clear the canvas (setting the background color)
        this.gl.clearColor(0, 0, 0, 1)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // Clear the depth buffer. Saves the depth for each pixel.
        this.gl.clearDepth(1.0);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);

        // Tiefentest einschalten.
        this.gl.enable(this.gl.DEPTH_TEST);
    }
}

export default Renderer;