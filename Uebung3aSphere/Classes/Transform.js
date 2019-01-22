class Transform
{
    constructor()
    {
        this.modelMatrix = mat4.create();
    }

    translate(translation)
    {
        mat4.translate(this.modelMatrix, this.modelMatrix, translation);
    }

    rotate(angle, axis)
    {
        mat4.rotate(this.modelMatrix, this.modelMatrix, angle, axis);
    }

    scale(scale)
    {
        mat4.scale(this.modelMatrix, this.modelMatrix, scale);   
    }
}

export default Transform