/**
 * Klasse repäsentiert die Position, Rotation und Skalierung eines Objektes.
 */
class Transform
{
    /**
     * Konstruktor erstellt ein Transform.
     */
    constructor()
    {
        // Die ModelMatrix und WorldMatrix erstellen
        this.worldMatrix = mat4.create();
        this.modelMatrix = mat4.create();

        // Den Vater und die Kinder setzen
        this.parent = null;
        this.childs = [];

        // Melden, dass sich die Matrizen geändert haben
        this.worldChanged = true;
        this.localChanged = true;

        // Position, Rotation und Skalierung erstellen
        this.position = vec3.create();
        this.rotation = vec3.create();
        this.rotationQuarternion = quat.fromEuler(quat.create(), this.rotation[0], this.rotation[1], this.rotation[2]);
        this.scale = vec3.fromValues(1, 1, 1);
    }

    /**
     * Methode zum Ermitteln der Worldmatrix.
     */
    getWorldMatrix()
    {
        // Falls sich etwas geändert hat
        if(this.worldChanged || this.localChanged) 
        {
            // Falls sich die lokale Matrix des Objektes geändert hat, diese neu berechnen
            if (this.localChanged) 
            {
                mat4.fromRotationTranslationScale(this.modelMatrix, this.rotationQuarternion, this.position, this.scale);
                this.localChanged = false;
            }

            // Falls es einen Parent gibt, die WorldMatrix neu berechnen
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

    /**
     * Methode zum Setzen der Position.
     * @param {vec3} position Die Position.
     */
    setPosition(position)
    {
        // Position setzen und Änderung auf Kinder und sich selbst übertragen
        this.position = position;
        this.localChanged = true;
        this.childs.forEach((element) => element.worldChanged = true);
    }

    /**
     * Methode zum Bewegen eines Objektes.
     * @param {vec3} moveVector Der Bewegungsvektor.
     */
    move(moveVector)
    {
        // Bewegung setzen und Änderung auf Kinder und sich selbst übertragen
        this.position = vec3.add(this.position, this.position, moveVector);
        this.localChanged = true;
        this.childs.forEach((element) => element.worldChanged = true);
    }

    /**
     * Methode zum Setzen eines Winkels zu einer Axis.
     * @param {float} angle Der Winkel.
     * @param {vec3} axis Die Achse.
     */
    setAxisAngle(angle, axis)
    {
        // Neue Rotation berechnen und Änderung mitteilen
        quat.setAxisAngle(this.rotationQuarternion, axis, (angle / 180) * Math.PI);
        this.localChanged = true;
        this.childs.forEach((element) => element.worldChanged = true);
    }

    /**
     * Methode zum Rotieren um die X-Achse.
     * @param {float} angle Der Winkel.
     */
    rotateX(angle)
    {
        // Rotieren und die Änderung mitteilen
        quat.rotateX(this.rotationQuarternion, this.rotationQuarternion, (angle / 180) * Math.PI);
        this.localChanged = true;
        this.childs.forEach((element) => element.worldChanged = true);
    }

    /**
     * Methode zum Rotieren um die Y-Achse.
     * @param {float} angle Der Winkel.
     */
    rotateY(angle)
    {
        // Rotieren und die Änderung mitteilen
        quat.rotateY(this.rotationQuarternion, this.rotationQuarternion, (angle / 180) * Math.PI);
        this.localChanged = true;
        this.childs.forEach((element) => element.worldChanged = true);
    }

    /**
     * Methode zum Rotieren um die Z-Achse.
     * @param {float} angle Der WInkel.
     */
    rotateZ(angle)
    {
        // Rotieren und die Änderung mitteilen
        quat.rotateZ(this.rotationQuarternion, this.rotationQuarternion, (angle / 180) * Math.PI);
        this.localChanged = true;
        this.childs.forEach((element) => element.worldChanged = true);
    }

    /**
     * Methode zum Setzen der Skalierung.
     * @param {vec3} scale Die Skalierung
     */
    setScale(scale)
    {
        // Skalierung setzen und Änderung mitteilen
        this.scale = scale;
        this.localChanged = true;
        this.childs.forEach((element) => element.worldChanged = true);
    }

    /**
     * Setzt das Transform auf die Identity-Matrix zurück;
     */
    reset()
    {
        this.position = vec3.create();
        this.rotation = vec3.create();
        this.rotationQuarternion = quat.fromEuler(quat.create(), this.rotation[0], this.rotation[1], this.rotation[2]);
        this.scale = vec3.fromValues(1, 1, 1);
        this.localChanged = true;
        this.childs.forEach((element) => element.worldChanged = true);
    }

    /**
     * Methode zum Setzen des Parents.
     * @param {Transform} parent Der Vater.
     */
    setParent(parent)
    {
        // Vater setzen, Vater das Child setzen und die Änderung mitteilen
        this.parent = parent;
        this.parent.childs.push(this);
        this.worldChanged = true;
        parent.worldChanged = true;
    }

    /**
     * Methode zum Hinzufügen eines Kinds.
     * @param {Transform} child Das Kind.
     */
    addChild(child)
    {
        // Dem Child das Parent setzen und die Veränerung mitteilen
        child.parent = this;
        this.childs.push(child);
        child.worldChanged = true;
        this.worldChanged = true;
    }
}

export default Transform