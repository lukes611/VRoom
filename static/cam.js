/*
set camera type
reset
update camera
update
*/

function CameraType(){
    this.kill = function(){};
    this.reset();
    
}

CameraType.prototype.reset = function(){
    this.kill();
    this.c = new LCamera();
    this.c.angles.y = 220;
    this.c.position.x = 9;
    this.c.position.z = 9;
    this.c.position.y = 6;
    this.look = {
        Left : 0,
        Right : 0,
        Up : 0,
        Down : 0
    };
    this.go = {
        Up : 0,
        Down : 0,
        Left : 0,
        Right : 0,
        Forward : 0,
        Backward : 0
    };
    this.kill = function(){};
};

CameraType.prototype.setTJSCamera = function(camera){
    var target = this.c.getTarget(10);
    var pos = this.c.getPosition();
    camera.position.set(pos.x, pos.y, pos.z);
    camera.lookAt(new THREE.Vector3(target.x, target.y, target.z));
};

CameraType.prototype.update = function(dt){
    dt = dt || 1;
    var x = {
        look    : ['Left', 'Down', 'Up', 'Right'],
        go      : ['Up', 'Down', 'Left', 'Right', 'Forward', 'Backward']
    };
    for(var type in x){
        for(var i = 0; i < x[type].length; i++){
            var dir = x[type][i];
            if(this[type][dir] > 0) this.c[type + dir](this[type][dir]);
        }
    }
};

CameraType.prototype.startKeyboard = function(){
    this.kill();
    var me = this;
    this.kill = dev.keyBoard(document.body, function(obj){
        var speed = {
            "look" : 1.5,
            "go" : 0.8
        };

        function cc(ch, t, n){
            if(obj.code == ch){
                if(obj.type == 'down') me[t][n] = speed[t];
                else me[t][n] = 0;
            }
        }
        var moveSpeed = 0.8;
        var lookSpeed = 1.5;
        cc(74, 'look', 'Left');
        cc(73, 'look', 'Up');
        cc(76, 'look', 'Right');
        cc(75, 'look', 'Down');
        cc(87, 'go', 'Forward');
        cc(83, 'go', 'Backward');
        cc(65, 'go', 'Left');
        cc(68, 'go', 'Right');
        cc(90, 'go', 'Up');
        cc(88, 'go', 'Down');
        if(obj.code == 82 && obj.type == 'down'){
            me.reset();
            me.startKeyboard();
        }
    });
};

CameraType.prototype.startVR = function(){
    //LVR
    this.kill();
    var lvr = new LVR();
    var me = this;
    
    var _Function = function(e){
        lvr.update(e.alpha, e.beta, e.gamma);
        var ax = lvr.getMatrix();//.transpose();
        var myTarget = new LV3(-ax.arr[2], ax.arr[6], ax.arr[10]);
        myTarget.iunit();
        
        var yAngle = 57.3*Math.atan2(myTarget.z, myTarget.x);
        var cpy = myTarget.copy();
        cpy.y = 0;
        cpy.iunit();
        var dp = cpy.dot(myTarget);
        var xAngle = Math.acos(dp) * 57.3;
        
        
        if(yAngle < 0){
            yAngle = 360 + yAngle;
        }
        
        if(xAngle < 35){
            if(myTarget.y < 0){
                xAngle *= -1;
            }
            me.c.angles.x = xAngle;
        }
        
        me.c.angles.y = yAngle;
    };
    
    window.addEventListener('deviceorientation', _Function);
    this.kill = function(){
        window.removeEventListener('deviceorientation', _Function);
    };
};