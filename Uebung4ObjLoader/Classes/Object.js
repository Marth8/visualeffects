import GL from "./GL.js";
import Transform from "./Transform.js";
import VertexArray from "./VertexArray.js";
import VertexBuffer from "./VertexBuffer.js";
import IndexBuffer from "./IndexBuffer.js";
import GameObject from "./Gameobject.js";
import Color from "./Color.js";

class Object
{
    constructor(shader, file, scaleFac, transform = new Transform(), texture = null)
    {
        this.gl = GL.getGL();
        this.transform  = transform;
        this.canBeDrawn = false;
        this.texture = texture;
        var request = new XMLHttpRequest();
        request.open('GET', file, true);
        request.send();

        request.onload = () => {
            var objDoc = new OBJDoc(file);
            // parse parameters: fileString, scale, reverse
            if (!objDoc.parse(request.responseText, scaleFac, true)) {
                console.error("OBJ file parsing error: " + file);
                return;
            }

            var geo = objDoc.getDrawingInfo();
            console.log(geo);
            
            this.vertexArray = new VertexArray();
            this.vb1 = new VertexBuffer(geo.positions);
            this.posAttribLocation = shader.getParameter("aPosition");
            this.vertexArray.addBuffer(this.vb1, [this.posAttribLocation], 3);
            this.ib = new IndexBuffer(geo.indices);
            
            if(!texture)
            {
                this.color = new Color("uColor", shader, 0.5, 0.5, 0);
                this.gameObject = new GameObject(this.vertexArray, this.ib, this.color);
            }
            else
            {
                this.vb2 = new VertexBuffer(geo.texCoords);
                this.texCoordsAttribLocation = shader.getParameter("aTexCoord");
                this.vertexArray.addBuffer(this.vb2, [this.texCoordsAttribLocation], 2);
                this.gameObject = new GameObject(this.vertexArray, this.ib, this.texture);
            }


            this.canBeDrawn = true;

            //var app = { imgSrc: [] };
            //if (geo.textureName)
                //app.imgSrc.push(geo.textureName);

            //that.renderer.addObject(geo, app, transform);
            //that.renderer.triggerRedraw();
        };
    }

    draw()
    {
        this.gameObject.draw();
    }
}
export default Object