function Liso(){

}

Liso.iso44 = function(p){
	if(p === undefined)
		return LMat4.rotateX(30).mult(LMat4.rotateY(45));
	return LMat4.rotateX(30).mult(LMat4.rotateY(45).mult(LMat4.trans(-p.x, -p.y, -p.z)));
};

Liso.iiso44 = function(){
	return LMat4.rotateX(30).mult(LMat4.rotateY(45)).transpose();
};

Liso.iso33 = function(p){
	if(p === undefined)
		return LMat3.rotateX(30).mult(LMat3.rotateY(45).mult(LMat3.rotateX(90)));
	return LMat3.rotateX(30).mult(LMat3.rotateY(45).mult(LMat3.rotateX(90).mult(LMat3.trans(-p.x, -p.z))));
};

Liso.iiso33 = function(){
	return LMat3.rotateX(30).mult(LMat3.rotateY(45).mult(LMat3.rotateX(90))).transpose();
};


Liso.screen2Tile = function(p){
	var m = Liso.iso33();
	var p1 = new LV2(1, 0);
	var p2 = new LV2(0, -1);
	p1 = m.multLV2(p1);
	p2 = m.multLV2(p2);
	return new LV3(p1.dot(p) * 2, 0, p2.dot(p) * 2);
};

Liso.directionRight = function(){
	var angle = 45 * 0.0174533;
	var cosine = Math.cos(angle);
	var sinus = Math.sin(angle);
	return new LV3(cosine, 0, sinus);
};

Liso.directionDown = function(){
	var angle = -45 * 0.0174533;
	var cosine = Math.cos(angle);
	var sinus = Math.sin(angle);
	return new LV3(cosine, 0, sinus);
};


LMat3.iso = function(){
	return LMat3.rotateX(30).mult(LMat3.rotateY(45).mult(LMat3.rotateX(90)));
};

LMat3.iiso = function(){
	return LMat3.rotateX(30).mult(LMat3.rotateY(45).mult(LMat3.rotateX(90))).transpose();	
};

function LisoMap(w, h){
	this.w = w;
	this.h = h;
	this.focus = new LV3(0, 0, 0);
	this.tileSize = 25;
	this.tiles = new Array(this.w * this.h);
	this.objects = new Array(this.w * this.h);
	for(var i = 0; i < this.tiles.length; i++){
		this.tiles[i] = undefined;
		this.objects[i] = undefined;
	}
}

LisoMap.prototype.resize = function(nw, nh){
	if(nw == this.w && nh == this.h) return;
	var tiles = new Array(nw * nh);
	var objects = new Array(nw * nh);
	for(var y = 0; y < nh; y++){
		for(var x = 0; x < nw; x++){
			if(this.inBounds(x, y)){
				tiles[y*nw + x] = this.getTile(x,y);
				objects[y*nw + x] = this.getObject(x,y);
			}else{
				tiles[y*nw + x] = undefined;
				objects[y*nw + x] = undefined;
			}
		}
	}
	this.tiles = tiles;
	this.objects = objects;
	this.w = nw;
	this.h = nh;
};

LisoMap.prototype.getTile = function(x, y){return this.tiles[this.w * y + x]; };
LisoMap.prototype.setTile = function(x, y, v){this.tiles[this.w * y + x] = v; };
LisoMap.prototype.getObject = function(x, y){return this.objects[this.w * y + x]; };
LisoMap.prototype.setObject = function(x, y, v){this.objects[this.w * y + x] = v; };

LisoMap.prototype.inBounds = function(x, y){return x >= 0 && y >= 0 && x < this.w && y < this.h;};
LisoMap.prototype.hasTile = function(x, y){return this.getTile(x, y) !== undefined; };

LisoMap.prototype.moveRight = function(scalar){
	this.focus.iadd(Liso.directionRight().scale(scalar));
};
LisoMap.prototype.moveLeft = function(scalar){
	this.focus.isub(Liso.directionRight().scale(scalar));
};
LisoMap.prototype.moveUp = function(scalar){
	this.focus.isub(Liso.directionDown().scale(scalar));
};
LisoMap.prototype.moveDown = function(scalar){
	this.focus.iadd(Liso.directionDown().scale(scalar));
};
LisoMap.prototype.screen2Position = function(screenPoint){
	var rv = Liso.screen2Tile(screenPoint);
	rv.iadd(this.focus);
	rv.idiv(this.tileSize);
	return rv;
};
LisoMap.prototype.screen2Tile = function(screenPoint){
	var rv = Liso.screen2Tile(screenPoint);
	rv.iadd(this.focus);
	rv.idiv(this.tileSize);
	rv.ifloor();
	return rv;	
};

LisoMap.prototype.tileCorner = function(index, pos3d){
	var p3d = pos3d.copy();
	var m = Liso.iso33(this.focus);
	if(index == 1){
		p3d.x += 1;
	}else if(index == 2){
		p3d.x += 1;
		p3d.z += 1;
	}else if(index == 3){
		p3d.z += 1;
	}
	p3d.iscale(this.tileSize);
	return m.multLV3(new LV3(p3d.x, p3d.z, 1));
};

LisoMap.prototype.position2Screen = function(pos3d){
	var p3d = pos3d.copy();
	var m = Liso.iso44(this.focus);
	p3d.iscale(this.tileSize);
	return m.multLV3(p3d);
};


