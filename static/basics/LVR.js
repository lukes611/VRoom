
/*LVR vr object*/
function LVR(){
    this.abg = new LV3(0,0,0);
    this.orientation = 0;
    this.xRotation = LMat4.rotateX(90);
}

LVR.prototype.toString = function(){
    return this.abg + '*' + this.orientation;
};

LVR.fromString = function(s){
    var ret = new LVR();
    var _ = s.split('*');
    ret.abg = LV3.fromString(_[0]);
    ret.orientation = Number(_[1]);
    return ret;
};

LVR.screenOrientation = function(){
    switch (window.screen.orientation || window.screen.mozOrientation) {
        case 'landscape-primary':
            return 0;
        case 'landscape-secondary':
            return 0;
        case 'portrait-secondary':
            return 180;
        case 'portrait-primary':
            return 0;
    }
    
    if (window.orientation !== undefined) return window.orientation;
    return 0;
};


LVR.fix = function(angle){
    return angle < 0 ? 360 + angle : angle;
};

LVR.prototype.update = function(alpha, beta, gamma){
    this.abg = new LV3(alpha, beta, gamma);
    this.orientation = LVR.screenOrientation();
};

//gets orientation matrix for phone
LVR.prototype.getMatrix = function(){
    var zm = LMat4.rotateZ(this.abg.x);
    var xm = LMat4.rotateX(-this.abg.y);
    var ym = LMat4.rotateY(-this.abg.z);
    var m = zm.mult(xm).mult(ym);
    return this.xRotation.mult(m);
};

//returns the vector space of the phone (phone axes)
LVR.prototype.getAxis = function(){
    var m = this.getMatrix();
    var x = new LV3(m.arr[0], m.arr[4], m.arr[8]);
    var y = new LV3(m.arr[1], m.arr[5], m.arr[9]);
    var z = new LV3(m.arr[2], m.arr[6], m.arr[10]);
    return [x,y,z];
};

//get a matrix to align the world to a new set of axes axes[0-2] are the next x,y,z axis
LVR.__rMatrix = function(axes){
    return (new LMat4([
        axes[0].x, axes[1].x, axes[2].x, 0,
        axes[0].y, axes[1].y, axes[2].y, 0,
        axes[0].z, axes[1].z, axes[2].z, 0,
        0, 0, 0, 1
    ]));
};

/*end LVR*/