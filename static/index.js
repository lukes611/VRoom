
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000.0);

var renderer = new THREE.WebGLRenderer();
renderer.shadowMapEnabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function generateCube(x,y,z, color){
    x = x || 0, y = y || 0, z = z || 0;
    color = color || 0x0000ff;
    var geometry = new THREE.BoxGeometry(1,1,1);
    var material = new THREE.MeshPhongMaterial({color : color});
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(x,y,z);
    cube.castShadow = true;
    cube.receiveShadow = true;
    
    var shape = new CANNON.Box(new CANNON.Vec3(1*.5,1*.5,1*.5));
    var body = new CANNON.Body({mass : 1, shape : shape});
    body.position.set(x,y,z);
    
    
    return {mesh:cube, body : body};
}

var cubes = [generateCube(0,3,0), generateCube(0, 6, -.5, 0xff0000), generateCube(-2,5,0, 0xa1a1a1)];

//create floor:
var floor = (function(){
    var geometry = new THREE.BoxGeometry(50,.2,50);
    var material = new THREE.MeshPhongMaterial({color : 0x222222});
    var mesh = new THREE.Mesh(geometry, material);
    //mesh.scale.set(50, .2, 50);
    //mesh.position.y -= 1;
    //mesh.position.set(0,-1,0);
    //mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    var shape = new CANNON.Box(new CANNON.Vec3(50*.5,.2*.5,50*.5));
    var body = new CANNON.Body({mass : 0, shape : shape});
    //body.position.set(0,-1,0);
    
    console.log(shape.convexPolyhedronRepresentation.vertices);
    console.log(mesh.geometry.vertices);
    
    return {mesh : mesh, body : body};
    
})();

cubes.forEach(cube => scene.add(cube.mesh));
scene.add(floor.mesh);

var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1);
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

camera.position.x = 5;
camera.position.z = 2;
camera.position.y = 1;
camera.lookAt(new THREE.Vector3(0,0,0));

//setting up physics
var world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
world.boradphase = new CANNON.NaiveBroadphase();

world.add(floor.body);
cubes.forEach(cube => world.add(cube.body));


function updatePhysicsOnObject(mesh, body){
    mesh.position.x = body.position.x;
    mesh.position.y = body.position.y;
    mesh.position.z = body.position.z;
    mesh.quaternion.x = body.quaternion.x;
    mesh.quaternion.y = body.quaternion.y;
    mesh.quaternion.z = body.quaternion.z;
    mesh.quaternion.w = body.quaternion.w;
}

var lastTime;
function render(){
    renderer.render(scene, camera);
    
    
    requestAnimationFrame(render);
    var time = (new Date()).getTime();
    if(lastTime !== undefined){
        //var dt = (time - lastTime) / 100000;
        world.step(.01);
    }
    
    updatePhysicsOnObject(floor.mesh, floor.body);
    cubes.forEach(cube => updatePhysicsOnObject(cube.mesh, cube.body));
    
    
    lastTime = time;
}
render();

function interact(){
    var c = cubes[0].mesh;
    var worldPoint = new CANNON.Vec3(c.position.x, c.position.y+1, c.position.z);
    var impulse = new CANNON.Vec3(0,1,-1);
    c = cubes[0].body;
    c.applyImpulse(impulse, worldPoint);
    //c.position.x += .5;
}