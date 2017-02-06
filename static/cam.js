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
    this.kill = dev.keyBoard(document.body, function(obj){
        var speed = {
            "look" : 1.5,
            "go" : 0.8
        };

        function cc(ch, t, n){
            if(obj.code == ch){
                if(obj.type == 'down') lc[t][n] = speed[t];
                else lc[t][n] = 0;
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
    });
};