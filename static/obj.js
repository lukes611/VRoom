function ldphy(other){
    this.position.x = other.position.x;
    this.position.y = other.position.y;
    this.position.z = other.position.z;
    this.quaternion.x = other.quaternion.x;
    this.quaternion.y = other.quaternion.y;
    this.quaternion.z = other.quaternion.z;
    this.quaternion.w = other.quaternion.w;
}

function generateCube(obj){
    obj = obj || {};
    obj.position = obj.position || [0,0,0];
    obj.size = obj.size || [1,1,1];
    obj.color = obj.color || 0x999999;
    obj.rotation = obj.rotation || [0,0,0];
    
    obj.rotation = obj.rotation.map(x => x / 57.3);
    
    console.log(obj.mass, obj.mass === undefined)
    if(obj.mass === undefined) obj.mass = 1;
    //obj.mass = obj.mass!==undefined ? 1 : mass;
    
    var geometry = new THREE.BoxGeometry(obj.size[0],obj.size[1],obj.size[2]);
    var material = new THREE.MeshPhongMaterial({color : obj.color});
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(obj.position[0],obj.position[1],obj.position[2]);
    cube.rotation.set(obj.rotation[0],obj.rotation[1],obj.rotation[2]);
    cube.castShadow = true;
    cube.receiveShadow = true;
    
    var shape = new CANNON.Box(new CANNON.Vec3(obj.size[0]*.5,obj.size[1]*.5,obj.size[2]*.5));
    var body = new CANNON.Body({mass : obj.mass, shape : shape});
    body.position.set(obj.position[0],obj.position[1],obj.position[2]);
    
    'xyzw'.split('').forEach(s => body.quaternion[s] = cube.quaternion[s]);
    
    cube.ldphy = ldphy;
    cube.upd = function(){this.ldphy(body);};
    
    return {mesh:cube, body : body};
}
