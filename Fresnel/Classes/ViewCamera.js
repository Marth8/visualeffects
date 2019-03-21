import GL from "./GL.js";
import Transform from "./Transform.js";

/**
 * Klasse repräsentiert die Camera.
 */
class ViewCamera extends Transform
{
    /**
     * Konstruktor zum Erstellen der Kamera.
     * @param {mat4} projectionMatrix Die Projektionsmatrix.
     */
    constructor(projectionMatrix)
    {
        super();

        // Den Kontext holen
        this.gl = GL.getGL();

        // Die benötigten Matrizen erstellen
        this.viewMatrix = mat4.create();
        this.cameraMatrix = mat4.create();
        this.viewProjectionMatrix = mat4.create();

        // Parameter merken
        this.projectionMatrix = projectionMatrix;

        // Das Transform erstellen
        this.cameraTransform = new Transform();

        // Das Transform als Parent erstellen, um die Camera einfach zu verschieben
        this.setParent(this.cameraTransform);
    }

    /**
     * Methode zum Ermitteln der ViewProjectionMatrix.
     */
    getViewProjectionMatrix()
    {
        this.viewMatrix = this.getWorldMatrix();
        this.cameraMatrix = mat4.invert(this.cameraMatrix, this.viewMatrix);
        this.viewProjectionMatrix = mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix);
        return this.viewProjectionMatrix;
    }

    /**
     * Methode zum Ermitteln der ViewMatrix.
     */
    getViewMatrix()
    {
        return this.getWorldMatrix();
    }

    /**
     * Methode zum Ermitteln der Augenposition der Camera.
     */
    getEyePosition()
    {
        let viewMatrix = this.getViewMatrix();
        let cameraMatrix = mat4.create();
        mat4.invert(cameraMatrix, viewMatrix);
        let eye = vec3.fromValues(cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]);
        return eye;
    }

    /**
     * Methode zum Ermitteln der Lokation zur Kamera.
     * @param {vec3} location Die Lokation.
     */
    getInverseTransformLocation(location) 
    {
        const translatedLocation = vec3.create();
        vec3.subtract(translatedLocation, location, this.position);

        const invertedRotation = quat.create();
        quat.invert(invertedRotation, this.rotationQuarternion);

        const rotatedLocation = vec3.create();
        vec3.transformQuat(rotatedLocation, translatedLocation, invertedRotation);

        const scaledLocation = vec3.create();
        vec3.multiply(scaledLocation, rotatedLocation, this.scale);

        return scaledLocation;
    }

    /**
     * Methode zum Ermitteln der Richtung zur Kamera.
     * @param {vec3} direction Die Richtung.
     */
    getInverseTransformDirection(direction) 
    {
        // Invert Rotation
        const invertedQuat = quat.create();
        quat.invert(invertedQuat, this.rotationQuarternion);

        // Transform Direction
        const transformedDirection = vec3.create();
        vec3.transformQuat(transformedDirection, direction, invertedQuat);
        return transformedDirection;
    }
}

export default ViewCamera