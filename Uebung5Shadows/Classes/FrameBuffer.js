import GL from "./GL.js";
var viewSizedPoints = {
    positions: [ -1, -1, 0,  1, -1, 0,  1, 1, 0,  -1, 1, 0 ],
    indices:   [ 0, 1, 2,  2, 3, 0 ]
};

class FrameBuffer {
    constructor(height, width)
    {
        const gl = this.gl = GL.getGL();
        this.depthMap = gl.createTexture();
        this.depthMap.width = width;
        this.depthMap.height = height;
        this.depthMap.ready = true;

        gl.bindTexture(gl.TEXTURE_2D, this.depthMap);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);

        this.frameBuffer = gl.createFramebuffer();
        this.renderBuffer = gl.createRenderbuffer();
        this.width = width;
        this.height = height;

        gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderBuffer);

        var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (status != gl.FRAMEBUFFER_COMPLETE) {
            console.warn("FBO status: " + status);
        }
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    bind()
    {
        gl.bindFrameBuffer(gl.FRAMEBUFFER, this.frameBuffer);
        gl.viewport(0, 0, this.width, this.height);

        gl.clearColor(1, 1, 1, 1);
        gl.clearDepth(1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.CULL_FACE);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    cleanup()
    {
    }
}

export default FrameBuffer