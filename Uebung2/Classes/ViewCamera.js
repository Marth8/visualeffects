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
        this.cameraMatrix = mat4.invert(this.viewMatrix, this.cameraMatrix);
        this.viewProjectionMatrix = mat4.multiply(this.viewProjectionMatrix, this.cameraMatrix, this.projectionMatrix);
        return this.viewProjectionMatrix;
    }
}
export default ViewCamera