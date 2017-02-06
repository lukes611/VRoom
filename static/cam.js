/*
set camera type
reset
update camera
update
*/

function CameraType(){
    this.reset();
    
}

CameraType.prototype.reset = function(){
    this.c = new LCamera();
    this.c.angles.y = 220;
    this.c.position.x = 9;
    this.c.position.z = 9;
    this.c.position.y = 6;
};

CameraType.prototype