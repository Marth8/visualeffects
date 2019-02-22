import GL from "./GL.js";
class ViewCamera
{
    constructor(viewMatrix, projectionMatrix)
    {
        this.gl = GL.getGL();
        this.viewMatrix = viewMatrix;
        this.projectionMatrix = projectionMatrix;
        this.cameraMatrix = mat4.create();
        this.viewProjectionMatrix = mat4.create();
    }

    getViewProjectionMatrix()
    {
        this.cameraMatrix = mat4.invert(this.cameraMatrix, this.viewMatrix);
        this.viewProjectionMatrix = mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix);
        return this.viewProjectionMatrix;
    }
}

export default ViewCamera