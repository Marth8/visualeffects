import GL from "./GL.js";
import Transform from "./Transform.js";

class ViewCamera extends Transform
{
    constructor(projectionMatrix)
    {
        super();

        this.gl = GL.getGL();
        this.viewMatrix = mat4.create();
        this.projectionMatrix = projectionMatrix;
        this.cameraMatrix = mat4.create();
        this.viewProjectionMatrix = mat4.create();
        this.cameraTransform = new Transform();
        this.setParent(this.cameraTransform);
    }

    getViewProjectionMatrix()
    {
        this.viewMatrix = this.getWorldMatrix();
        this.cameraMatrix = mat4.invert(this.cameraMatrix, this.viewMatrix);
        this.viewProjectionMatrix = mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix);
        return this.viewProjectionMatrix;
    }

    getViewMatrix()
    {
        return this.getWorldMatrix();
    }

    getEyePosition()
    {
        let viewMatrix = this.getViewMatrix();
        let cameraMatrix = mat4.create();
        mat4.invert(cameraMatrix, viewMatrix);
        let eye = vec3.fromValues(cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]);
        return eye;
    }
}

export default ViewCamera