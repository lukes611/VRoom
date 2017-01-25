//LPolygon object and LBox object representing a bounding box
//depends on LLA.js

function LCollisionParticle(foundCollision, distance, normal, point){
	this.foundCollision = foundCollision;
	this.distance = distance;
	this.normal = normal;
	this.point = point;
}

//the constructor for the box object
//mn : the minimum (top left) x and y axes
//mx : the maximum (top right) x and y axes
function Lbox(topLeft, bottomRight){
	this.mn = topLeft;
	this.mx = bottomRight;
}
Lbox.prototype.toString = function(){
	return '{' + this.mn + ', ' + this.mx + '}';
};
Lbox.prototype.copy = function(){
	return new Lbox(this.mn.copy(), this.mx.copy());
};
//returns true or false whether there is a collision
Lbox.prototype.collision = function(b2){
	if(this.mn.x > b2.mx.x || this.mx.x < b2.mn.x) return false;
	if(this.mn.y > b2.mx.y || this.mx.y < b2.mn.y) return false;
	return true;
};
//returns width and height of the Lbox
Lbox.prototype.width = function(){ return this.mx.x - this.mn.x; };
Lbox.prototype.height = function(){ return this.mx.y - this.mn.y; };

function LPolygon(pointList){
	this.points = pointList;
}
LPolygon.prototype.toString = function(){
	var ret = [];
	for(var i = 0; i < this.points.length; i++)
		ret.push(this.points[i]+'');
	return '{'+ret.join(',')+'}';
};

LPolygon.prototype.toJSON = function(){
    var points = [];
    for(var i = 0; i < this.points.length; i++)
        points.push(this.points[i].toJSON());
    return {
        points : points
    };
};

LPolygon.fromJSON = function(ob){
    var pointList = [];
    for(var i = 0; i < ob.points.length; i++)
        pointList.push(LV2.fromJSON(ob.points[i]));
    return new LPolygon(pointList);
};

//gets a deep copy of the polygon
LPolygon.prototype.copy = function(){
	var ar = [];
	for(var i = 0; i < this.points.length; i++) ar.push(this.points[i].copy());
	return new LPolygon(ar);
};
//gets the center of the polygon
LPolygon.prototype.center = function(){
	var ret = new LV2(0,0);
	for(var i = 0; i < this.points.length; i++){
		ret.x += this.points[i].x;
		ret.y += this.points[i].y;
	}
	ret.x /= this.points.length;
	ret.y /= this.points.length;
	return ret;
};
//returns the radius of the polygon
LPolygon.prototype.radius = function(){
	var center = this.center();
	var rad = this.points[0].dist(center);
	for(var i = 1; i < this.points.length; i++){
		var test = this.points[i].dist(center);
		rad = test > rad ? test : rad;
	}
	return rad;
};
//return the bounding box for this polygon
LPolygon.prototype.Lbox = function(){
	var mn = this.points[0].copy();
	var mx = mn.copy();
	var pts = this.points;
	for(var i = 1; i < pts.length; i++){	
		mn.x = mn.x <= pts[i].x ? mn.x : pts[i].x;
		mn.y = mn.y <= pts[i].y ? mn.y : pts[i].y;
		mx.x = mx.x >= pts[i].x ? mx.x : pts[i].x;
		mx.y = mx.y >= pts[i].y ? mx.y : pts[i].y;
	}
	return new Lbox(mn, mx);
};
LPolygon.prototype.itransform = function(m){
	for(var i = 0; i < this.points.length; i++)
		this.points[i] = m.multLV2(this.points[i]);
};
LPolygon.prototype.transform = function(m){
	var ret = [];
	for(var i = 0; i < this.points.length; i++)
		ret.push( m.multLV2(this.points[i]) );
	return new LPolygon(ret);
};

LPolygon.prototype.toOrigin = function(){
	var center = this.center();
	for(var i = 0; i < this.points.length; i++) this.points[i].isub(center);
};

LPolygon.prototype._collisionHelper2 = function(point, poly2){
	var mn1 = this.points[0].projectionScalar(point);
	var mx1 = mn1;
	var mn2 = poly2.points[0].projectionScalar(point);
	var mx2 = mn2;
	var i;
	for(i = 1; i < this.points.length; i++){
		var tmp = this.points[i].projectionScalar(point);
		mn1 = tmp < mn1 ? tmp : mn1;
		mx1 = tmp > mx1 ? tmp : mx1;
	}
	for(i = 1; i < poly2.points.length; i++){
		var tmp = poly2.points[i].projectionScalar(point);
		mn2 = tmp < mn2 ? tmp : mn2;
		mx2 = tmp > mx2 ? tmp : mx2;
	}
	return mx1 >= mn2 && mx2 >= mn1; //returns false if mx1 < mn2 || mx2 < mn1
};

LPolygon.prototype._collisionHelper1 = function(poly2){ //s2 : poly2
	var normals = [];
	var i;
	for(i = 0; i < this.points.length; i++){
		var j = (i+1) % this.points.length;
		var line = this.points[j].sub(this.points[i]);
		line.inormal();
		normals.push(line);
	}
	for(i = 0; i < poly2.points.length; i++)
	{
		var j = (i+1) % poly2.points.length;
		var line = poly2.points[j].sub(poly2.points[i]);
		line.inormal();
		normals.push(line);
	}
	
	for(i = 0; i < normals.length; i++)
		if(!this._collisionHelper2(normals[i], poly2)) return false;
	return true;
};

LPolygon.prototype._surrounds = function(point){ // p : point
	var ret = new LCollisionParticle(true, 100000000, new LV2(0,0), point.copy());
	var set = false;
	for(var i = 0; i < this.points.length; i++){
		var j = (i+1) % this.points.length;
		//compute the normal
		var normal = this.points[j].sub(this.points[i]);
		normal.inormal();
		var D = normal.scale(-1).dot(this.points[i]);
		var v = normal.dot(point) + D;
		if(v > 0){
			ret.foundCollision = false;
			return ret;
		}
		var absV = Math.abs(v);
		if(absV >= ret.distance && set) continue;
		ret.foundCollision = true;
		ret.distance = absV;
		ret.normal = normal.copy();
		set = true;	
	}
	return ret;
};

//returns a list of intersections represented as LCollisionParticles
LPolygon.prototype.collisionInfo = function(poly2){ //s2 : poly2
	var ret = [];
	var bb1 = this.Lbox();
	var bb2 = poly2.Lbox();
	if(!bb1.collision(bb2)) return ret;
	if(!this._collisionHelper1(poly2)) return ret;
	var i;
	for(i = 0; i < poly2.points.length; i++){
		var test = this._surrounds(poly2.points[i]);
		if(test.foundCollision){
			test.normal.iscale(-1);
			ret.push(test);
		}
	}
	for(i = 0; i < this.points.length; i++){
		var test = poly2._surrounds(this.points[i]);
		if(test.foundCollision)
			ret.push(test);
	}
	return ret;
};

//returns true or false if there was a collision
LPolygon.prototype.collision = function(poly2){ //s2 : poly2
	var bb1 = this.Lbox();
	var bb2 = poly2.Lbox();
	if(!bb1.collision(bb2)) return false;
	if(!this._collisionHelper1(poly2)) return false;
	var i;
	for(i = 0; i < poly2.points.length; i++){
		var test = this._surrounds(poly2.points[i]);
		if(test.foundCollision)
			return true;
	}
	for(i = 0; i < this.points.length; i++){
		var test = poly2._surrounds(this.points[i]);
		if(test.foundCollision)
			return true;
	}
	return false;
};

//reverses the indices of the points (in case they were clock-wise)
LPolygon.prototype.reversePoints = function(){
	var hl = Math.floor(this.points.length / 2);
	for(var i = 0, j = this.points.length-1; i < hl; i++, j--){
		var tmp = this.points[i];
		this.points[i] = this.points[j];
		this.points[j] = tmp;
	}
};