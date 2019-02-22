class Transform
{
    constructor()
    {
        this.worldMatrix = mat4.create();
        this.modelMatrix = mat4.create();
        this.parent = null;
        this.childs = [];
        this.worldChanged = true;
        this.localChanged = true;
        this.position = vec3.create();
        this.rotation = vec3.create();
        this.rotationQuarternion = quat.fromEuler(quat.create(), this.rotation[0], this.rotation[1], this.rotation[2]);
        this.scale = vec3.fromValues(1, 1, 1);
    }

    getWorldMatrix()
    {
        if(this.worldChanged) 
        {
            if (this.localChanged) 
            {
                mat4.fromRotationTranslationScale(this.modelMatrix, this.rotationQuarternion, this.position, this.scale);
                this.localChanged = false;
            }

            if (this.parent) 
            {
                mat4.multiply(this.worldMatrix, this.parent.getWorldMatrix(), this.modelMatrix);
            }
            else 
            {
                mat4.copy(this.worldMatrix, this.modelMatrix);
            }

            this.worldChanged = false;
        }

        return this.worldMatrix;
    }

    getModelMatrix()
    {
        if (this.localChanged) 
        {
            mat4.fromRotationTranslationScale(this.modelMatrix, this.rotationQuarternion, this.position, this.scale);
            this.localChanged = false;
        }

        return this.modelMatrix;
    }
    
    setPosition(position)
    {
        this.position = position;
        this.localChanged = true;
    }

    move(moveVector)
    {
        this.position = vec3.add(this.position, this.position, moveVector);
        this.localChanged = true;
    }

    setAxisAngle(angle, axis)
    {
        quat.setAxisAngle(this.rotationQuarternion, axis, (angle / 180) * Math.PI);
        this.localChanged = true;
    }

    rotateX(angle)
    {
        quat.rotateX(this.rotationQuarternion, this.rotationQuarternion, (angle / 180) * Math.PI);
        this.localChanged = true;
    }

    rotateY(angle)
    {
        this.localChanged = true;
        quat.rotateY(this.rotationQuarternion, this.rotationQuarternion, (angle / 180) * Math.PI);
    }

    rotateZ(angle)
    {
        quat.rotateZ(this.rotationQuarternion, this.rotationQuarternion, (angle / 180) * Math.PI);
        this.localChanged = true;
    }

    setScale(scale)
    {
        this.scale = scale;
        this.localChanged = true;
    }

    setParent(parent)
    {
        this.parent = parent;
        this.worldChanged = true;
    }

    addChild(child)
    {
        this.childs.push(child);
    }
}

export default Transform