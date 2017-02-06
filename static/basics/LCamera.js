function LCamera(){
    this.reset();
}

LCamera.prototype.reset = function(){
    this.position = new LV3(0,0,0);
    this.angles = {
        y : 0,
        x : 0
    };
};

LCamera.prototype.lookLeft = function(amount){
    amount = amount || 1;
    this.angles.y -= amount;
    if(this.angles.y < 0) this.angles.y += 360;
    if(this.angles.y >= 360) this.angles.y = 360 - this.angles.y;
};

LCamera.prototype.lookRight = function(amount){
    amount = amount || 1;
    this.lookLeft(-amount);
};

LCamera.prototype.lookUp = function(amount){
    amount = amount || 1;
    var newValue = this.angles.x + amount;
    if(newValue < 35 && newValue >= -35) this.angles.x = newValue;
};

LCamera.prototype.lookDown = function(amount){
    amount = amount || 1;
    this.lookUp(-amount);
};


LCamera.prototype.getAt = function(){
    var Dir = new LV3(Math.cos(this.angles.y / 57.3), 0, Math.sin(this.angles.y / 57.3));
    var Up = new LV3(0,1,0);
    var scalars = LV2.fromAngle(this.angles.x);
    
    return Dir.scale(scalars.x).add(Up.scale(scalars.y)).unit();
};

LCamera.prototype.getXAt = function(){
    var Dir = new LV3(Math.cos(this.angles.y / 57.3), 0, Math.sin(this.angles.y / 57.3));
    return Dir;
};

LCamera.prototype.getYAt = function(){
    var A = (this.angles.y - 90) / 57.3;
    var Dir = new LV3(Math.cos(A), 0, Math.sin(A));
    return Dir;
};



LCamera.prototype.getTarget = function(scalar){
    scalar = scalar || 1;
    return this.getAt().scale(scalar).add(this.position);
};

LCamera.prototype.getPosition = function(){
    return this.position.copy();
};

LCamera.prototype.goForward = function(amount){
    amount = amount || 1;
    var dir = this.getXAt().scale(amount);
    this.position.iadd(dir);
};

LCamera.prototype.goBackward = function(amount){
    amount = amount || 1;
    this.goForward(-amount);
};

LCamera.prototype.goLeft = function(amount){
    amount = amount || 1;
    var dir = this.getYAt().scale(amount);
    this.position.iadd(dir);
};

LCamera.prototype.goRight = function(amount){
    amount = amount || 1;
    var dir = this.getYAt().scale(-amount);
    this.position.iadd(dir);
};

LCamera.prototype.goUp = function(amount){
    amount = amount || 1;
    this.position.y -= amount;
};

LCamera.prototype.goDown = function(amount){
    amount = amount || 1;
    this.goUp(-amount);
};

