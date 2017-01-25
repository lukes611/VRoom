
if(typeof LV3 === 'undefined' && typeof module !== 'undefined' && require){
    var LV3 = require('./LLA.js').LV3;
    var LV2 = require('./LLA.js').LV2;
}


function L3DOb(){
    this.verts = [];
    this.faces = [];
    this.normals = [];
    this.textures = [];
    this.texInds = [];
    this.normInds = [];
    this.groups = []; //group: {name, vertsFrom, numVerts, facesFrom, numFaces}
}

L3DOb.prototype.copy = function(){
    var ret = new L3DOb();
    var lCopy = function(x){return x.copy();};
    var aCopy = function(x){return x.map(function(x){return x;});};
    var assignF = function(member){ ret[member] = this[member].map(this.f); };
    var lItems = 'verts normals textures'.split(' ');
    var aItems = 'faces texInds normInds'.split(' ');
    lItems.forEach(assignF.bind({f:lCopy}));
    aItems.forEach(assignF.bind({f:aCopy}));
    ret.groups = this.groups.map(function(g){ //copy over groups
        var ret = {};
        for(var item in g){
            if(g.hasOwnProperty(item)) ret[item] = g[item];
        }
    });
    return ret;
};

L3DOb.prototype.itransform = function(matrix){
    this.verts=this.verts.map(function(v){
        return matrix.multLV3(v);
    });
};

L3DOb.prototype.yFlip = function(flipFacesToo){
    flipFacesToo = flipFacesToo||false;
    for(var i = 0; i < this.verts.length; i++)
        this.verts[i].y = -this.verts[i].y;
    if(flipFacesToo){
        for(var i = 0; i < this.faces.length; i++){
            this.faces[i].reverse();
            if(i < this.normInds.length) this.normInds[i].reverse();
            if(i < this.texInds.length) this.texInds[i].reverse();
        }
    }
};

L3DOb.prototype.import = function(s){
    var lines = s.split('\n');
    var _ = undefined, j = undefined, tmp, tmpArr, tmpArr2, tmpArr3;
    var me = this;
    var lastGroup = {
        name : 'default',
        vertsFrom : 0,
        numVerts : 0,
        facesFrom : 0,
        numFaces : 0
    };
    
    //reg-expressions
    var vertRE = /^v (([0-9])*.([0-9])){3,}/;
    var texRE = /^vt (([0-9])*.([0-9])){2,}/;
    var normsRE = /^vn (([0-9])*.([0-9])){3,}/;
    
    var faceOnlyRE = /^f (([0-9]*)\s){2,}([0-9])*$/;
    var faceFTRE = /^f ((([0-9]*)\/([0-9]*))\s){2,}((([0-9]*)\/([0-9]*)))$/;
    var faceFNRE = /^f ((([0-9]*)\/\/([0-9]*))\s){2,}((([0-9]*)\/\/([0-9]*)))$/;
    var faceFTNRE = /^f ((([0-9]*)\/([0-9]*)\/([0-9]*))\s){2,}(([0-9]*)\/([0-9]*)\/([0-9]*))$/;
    var groupRE = /^(o|g) (\S)*$/;
    
    for(var i = 0; i < lines.length; i++){
        var line = lines[i];
        if(vertRE.test(line)){
            _ = line.split(' ');
            this.verts.push(new LV3(Number(_[1]), Number(_[2]), Number(_[3])));
            lastGroup.numVerts++;
        }else if(normsRE.test(line)){
            _ = line.split(' ');
            this.normals.push(new LV3(Number(_[1]), Number(_[2]), Number(_[3])));
        }else if(texRE.test(line)){
            _ = line.split(' ');
            this.textures.push(new LV2(Number(_[1]), Number(_[2])));
        }else if(faceOnlyRE.test(line)){
            this.faces.push(line.split(' ').slice(1).map(function(x){return Number(x)-1;}));
            lastGroup.numFaces++;
        }else if(faceFTRE.test(line)){
            tmpArr = [], tmpArr2 = [];
            line.split(' ').slice(1).forEach(function(x){
                var _ = x.split('/').map(Number);
                tmpArr.push(_[0]-1);
                tmpArr2.push(_[1]-1);
            });
            this.faces.push(tmpArr);
            this.texInds.push(tmpArr2);
            lastGroup.numFaces++;
        }else if(faceFNRE.test(line)){
            tmpArr = [], tmpArr2 = [];
            line.replace(/\/\//g, '/').split(' ').slice(1).forEach(function(x){
                var _ = x.split('/').map(Number);
                tmpArr.push(_[0]-1);
                tmpArr2.push(_[1]-1);
            });
            this.faces.push(tmpArr);
            this.normInds.push(tmpArr2);
            lastGroup.numFaces++;
        }else if(faceFTNRE.test(line)){
            tmpArr = [], tmpArr2 = [], tmpArr3 = [];
            line.split(' ').slice(1).forEach(function(x){
                var _ = x.split('/').map(Number);
                tmpArr.push(_[0]-1);
                tmpArr2.push(_[1]-1);
                tmpArr3.push(_[2]-1);
            });
            this.faces.push(tmpArr);
            this.texInds.push(tmpArr2);
            this.normInds.push(tmpArr3);
            lastGroup.numFaces++;
        }else if(groupRE.test(line)){
            var groupName = line.split(' ')[1];
            if(lastGroup.numFaces > 0 || lastGroup.numVerts > 0){
                this.groups.push(lastGroup);
            }
            lastGroup = {
                name : groupName,
                vertsFrom : this.verts.length,
                numVerts : 0,
                facesFrom : this.faces.length,
                numFaces : 0
            };
        }
    }
    this.groups.push(lastGroup);
};


/*
gets stats for the object,
including: min, max x/y/z locations
average point, width, height, depth
*/
L3DOb.prototype.stats = function(){
    if(this.verts.length == 0) return null;
    var ret = {
        min : this.verts[0].copy(),
        max : this.verts[0].copy(),
        avg : new LV3(0,0,0),
        width : 0,
        height : 0,
        depth : 0
    };
    var scalar = 1 / this.verts.length;
    for(var i = 0; i < this.verts.length; i++){
        ret.min.x = ret.min.x < this.verts[i].x ? ret.min.x : this.verts[i].x;
        ret.min.y = ret.min.y < this.verts[i].y ? ret.min.y : this.verts[i].y;
        ret.min.z = ret.min.z < this.verts[i].z ? ret.min.z : this.verts[i].z;
        
        ret.max.x = ret.max.x > this.verts[i].x ? ret.max.x : this.verts[i].x;
        ret.max.y = ret.max.y > this.verts[i].y ? ret.max.y : this.verts[i].y;
        ret.max.z = ret.max.z > this.verts[i].z ? ret.max.z : this.verts[i].z;
        
        ret.avg.iadd(this.verts[i].scale(scalar));
    }
    ret.width = ret.max.x - ret.min.x;
    ret.height = ret.max.y - ret.min.y;
    ret.depth = ret.max.z - ret.min.z;
    return ret;
};

//transforms the object to the origin, if useAverage is used then 
//the mean point becomes the origin, else the lower corner is used
L3DOb.prototype.toOrigin = function(useAverage){
    var i;
    useAverage = useAverage || false;
    var stats = this.stats();
    var newOrigin = useAverage ? stats.avg : stats.min;
    for(i=0;i<this.verts.length;i++) this.verts[i].isub(newOrigin);
    return newOrigin;
};

//usage object.tjs([{color:default is red, texture: fileName or image, basicShading:false}])
L3DOb.prototype.tjs = function(settings){
    var s = settings || {color : 'red', basicShading : true};
    s.color = s.color || 'red';
    var mat = undefined;
    if(s.texture){
        if(s.basicShading){
            mat = new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture(s.texture)
            });
        }else{
            new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture(s.texture) } );
        }
    }else{
        if(s.basicShading){
            mat = new THREE.MeshBasicMaterial({
                color : s.color
            });
        }else{
            new THREE.MeshPhongMaterial({
                color: s.color,
                shininess: 10,
                specular: 0x111111,
                shading: THREE.SmoothShading
            });
        }
    }
    
    var g = new THREE.Geometry();
    var i = 0;
    for(; i < this.verts.length; i++){
        g.vertices.push(new THREE.Vector3(this.verts[i].x, this.verts[i].y, this.verts[i].z))    
    }
    for(i=0; i < this.faces.length; i++){
        g.faces.push(new THREE.Face3(this.faces[i][0], this.faces[i][1], this.faces[i][2]));
    }
    
    if(this.texInds.length){
        g.faceVertexUvs[0] = [];
        for(var i = 0; i < this.texInds.length; i++){
            g.faceVertexUvs[0].push([new THREE.Vector2(this.textures[this.texInds[i][0]].x, this.textures[this.texInds[i][0]].y),
                         new THREE.Vector2(this.textures[this.texInds[i][1]].x, this.textures[this.texInds[i][1]].y),
                         new THREE.Vector2(this.textures[this.texInds[i][2]].x, this.textures[this.texInds[i][2]].y)]);
        }
    }
    g.computeBoundingSphere();
	g.computeFaceNormals();
	return new THREE.Mesh(g, mat);
    
};

L3DOb.isoCam = function(screenWidth, screenHeight, origin){
    origin = origin || new LV3(0,0,0);
    var ret = new THREE.PerspectiveCamera(75, screenWidth / screenHeight, 0.01, 10000000);
    ret.matrixAutoUpdate = false;
    var widthLarger = screenWidth > screenHeight;
    var scalar = screenWidth / screenHeight;
    scalar = 1 / scalar;
    
    
    var min = widthLarger ? Math.min(screenWidth, screenHeight) : Math.max(screenWidth, screenHeight);
    
    //setup projection matrix:
    var projectionMatrix = new LMat4([
                    scalar,0,0,0,
                    0,-1,0,0,
                    0,0,.2,0,
                    0,0,0,1]);
    projectionMatrix.imult(LMat4.scale(2/min));
    
    ret.projectionMatrix.set.apply(ret.projectionMatrix, projectionMatrix.arr);

    //setup model-view matrix
    var lisoMat = Liso.iso44().transpose();
    lisoMat = LMat4.trans(origin.x,origin.y,origin.z).mult(lisoMat);
    ret.matrix.set.apply(ret.matrix, lisoMat.arr);
    
    ret.updateMatrixWorld(true);
    return ret;
};

L3DOb.cadCam = function(screenWidth, screenHeight, ry, rx, rad){
    var ret = new THREE.PerspectiveCamera(75, screenWidth / screenHeight, 0.01, 1000000);
    
    var yRV = LV2.fromAngle(ry);
    var xRV = LV2.fromAngle(rx);
    var cameraLocation = new LV3(yRV.x,0,yRV.y);
    var up = new LV3(0,1,0);
    
    cameraLocation = cameraLocation.scale(xRV.x).add(up.scale(xRV.y));
    cameraLocation.iscale(rad);
    
    ret.up.set(0,-1,0);
    ret.position.set(cameraLocation.x, cameraLocation.y, cameraLocation.z);
    ret.lookAt(new THREE.Vector3(0,0,0));
    
    return ret;
};