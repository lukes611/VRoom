
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000.0);

var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.shadowMapEnabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


var cubes = [generateCube({position:[0,3,0],rotation:[20,5,3], mass:.05}),
            generateCube({position:[0,10,0], color:0x00ff00, rotation:[0,0,0]}),
            generateCube({position:[0, 8, -.5], color:0xff0000}),
            generateCube({position:[-2,5,0], color:0xa1a1a1})];

var floor = generateCube({size:[50,.2,50], mass:0});

//add walls
cubes.push(generateCube({position : [0,5,20],size : [100,20,1], mass : 0}));
cubes.push(generateCube({position : [0,5,-20],size : [100,20,1], mass : 0}));
cubes.push(generateCube({position : [20,5,0],size : [1,20,100], mass : 0}));
cubes.push(generateCube({position : [-20,5,0],size : [1,20,100], mass : 0}));

cubes.forEach(cube => scene.add(cube.mesh));
scene.add(floor.mesh);

var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(.2, 0.5, 1);
light.castShadow = true;
light.shadowCameraNear = .1;
light.shadowCameraFar = 1000;
light.shadowCameraLeft = -5.0;
light.shadowCameraRight = 5.0;
light.shadowCameraTop = 5.0;
light.shadowCameraBottom = -5.0;
//light.shadowDarkness = 0.5;

scene.add(light);

var light2 = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(light2);
var sss = 3;
camera.position.x = 3*sss;
camera.position.z = 3*sss;
camera.position.y = 2*sss;

camera.lookAt(new THREE.Vector3(0,0,0));

//setting up physics
var world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
world.boradphase = new CANNON.NaiveBroadphase();

world.add(floor.body);
cubes.forEach(cube => world.add(cube.body));



var lastTime;
function render(){
    renderer.render(scene, camera);
    
    requestAnimationFrame(render);
    var time = (new Date()).getTime();
    if(lastTime !== undefined){
        var dt = (time - lastTime) / 1000;
        world.step(1 * dt);
    }
    
    floor.mesh.upd();
    cubes.forEach(cube => cube.mesh.upd());
    
    
    lastTime = time;
}
render();

function interact(){
    var c = cubes[0].mesh;
    var worldPoint = new CANNON.Vec3(c.position.x, c.position.y+1, c.position.z);
    var impulse = new CANNON.Vec3(0,1,-1);
    c = cubes[0].body;
    c.applyImpulse(impulse, worldPoint);
}


//LVR
var lvr = new LVR();
window.addEventListener('deviceorientation', function(e){
    //console.log(a++);
    if(1){
        lvr.update(e.alpha, e.beta, e.gamma);
        var pos = new LV3(camera.position.x, camera.position.y, camera.position.z);
        var ax = lvr.getMatrix().transpose();
        ax = new LV3(ax.arr[2], ax.arr[6], ax.arr[10]);
        //console.log(ax+'')
        var lat = pos.add(ax);
        camera.lookAt(new THREE.Vector3(lat.x, lat.y, lat.z));
    }
});