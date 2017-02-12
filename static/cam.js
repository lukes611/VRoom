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

CameraType.prototype.startTouch = function(){
    this.kill();
    var me = this;
    var move_speed = 0.4;
    var look_speed = 1.2;
    
    var ids = [];
    
    var setDirection = function(type, dir1, dir2, amnt){
        if(amnt < 0){
            me[type][dir1] = Math.abs(amnt);
            me[type][dir2] = 0;
        }else if(amnt > 0){
            me[type][dir1] = 0;
            me[type][dir2] = amnt;
        }else{
            me[type][dir1] = me[type][dir2] = 0;
        }
    };
    
    var killF1 = this.JoyStickHelper('LeftJoyStickSide', 'LJSOuter', 'LJSInner', ids, function(p){
        setDirection('go', 'Left', 'Right', p.x * move_speed);
        setDirection('go','Forward', 'Backward', p.y * move_speed);
    });
    var killF2 = this.JoyStickHelper('RightJoyStickSide', 'RJSOuter', 'RJSInner', ids, function(p){
        setDirection('look','Left', 'Right', p.x * look_speed);
        setDirection('look','Up', 'Down', p.y * look_speed);
    });
    this.kill = function(){killF1(); killF2();};
};


CameraType.prototype.JoyStickHelper = function(outsideDivId, outerJSId, innerJSId, ids, output){
    //get references,
    var container = $('#'+outsideDivId);
    output = output || function(){};
    var outer = $('#'+outerJSId);
    var outerSize = new LV2(outer.width(),outer.height());
    var inner = $('#'+innerJSId);
    var innerSize = new LV2(inner.width(),inner.height());
    var position = new LV2(-1, -1);
    var starting_position = position.copy();
    var device = new LDevice();
    var id = -1;


    container.show();

    var hide = function(){
        outer.hide();
        inner.hide();
    };
    var show = function(){
        outer.show();
        inner.show();
    };

    var setPosition = function(element, position){
        element.css('left',position.x+'px');
        element.css('top',position.y+'px');
    };
    
    var outputPosition = function(){
        var p = position.sub(starting_position);
        var dist = position.dist(starting_position);
        p.iunit();
        p.iscale(Math.min(dist, outerSize.x*0.5,dist));
        p.iscale(1/(outerSize.x*0.5));
        output(p);
    };

    hide();

    //return a function which kills it all
    var kill = device.touch(document.getElementById(outsideDivId), function(event){
        if(id == -1 && event.type == 'start' && ids.indexOf(event.id) == -1){
            id = event.id;
            ids.push(id);
            starting_position = new LV2(event.x, event.y);
            position = starting_position.copy();
            setPosition(outer, starting_position.sub(outerSize.scale(0.5)));
            show();
            outputPosition();
        }else if(event.type == 'end' && event.id == id){
            hide();
            ids.splice(ids.indexOf(id));
            id = -1;
            output(new LV2(0,0));
        }else if(id == event.id && event.type == 'move'){
            position = new LV2(event.x, event.y);
            outputPosition();
        }



        if(id != -1){
            var distance = position.dist(starting_position);
            var output_position = position.copy().sub(starting_position)
            .unit().scale(Math.min(outerSize.x*0.5,distance));
            output_position.iadd(starting_position);
            setPosition(inner, output_position.sub(innerSize.scale(0.5)));
        }
    });

    return function(){
        kill();
        container.hide();
    };
};
