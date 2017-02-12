/*
functionality:
isMobile -> returns whether device is mobile or not
isMobileOrTablet -> returns whether device is mobile or tablet
*/


function LDevice(){
	this.repaint = window.requestAnimationFrame !== undefined ? window.requestAnimationFrame.bind(window) : function(f){setTimeout(f, 30);};
}

//sets the timeout for the repaint function
LDevice.prototype.setRepaintTimeout = function(t){
	this.repaint = function(f){setTimeout(f, t)};	
};

//returns whether the device is a mobile or not
LDevice.prototype.isMobile = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

//detects if device is mobile or table
LDevice.prototype.isMobileOrTablet = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

//gets the orientation 'portait' or 'landscape'
LDevice.prototype.getOrientation = function(){
	if(typeof screen !== 'undefined'){
		if(typeof screen.orientation !== 'undefined'){
			if(screen.orientation.angle == 0 || screen.orientation.angle == 360)
				return 'portrait';
		}
	}
	return 'landscape';
};

//sets the width and height of the screen
LDevice.prototype.getScreenSize = function(){
	var w = window.innerWidth;
	var h = window.innerHeight;
	if(w === undefined || h === undefined){
		w = document.documentElement.clientWidth;
		h = document.documentElement.clientHeight;
	}
	if(w === undefined || h === undefined){
		w = $(window).width();
		h = $(window).height();
	}
	return {
		width : w,
		height : h
	};
};

LDevice.prototype.cssSize = function(object){
	var filter = function(x){
		return Number(x.split('').slice(0,-2).join(''));
	};
	return {
		width : filter($(object).css('width')),
		height : filter($(object).css('height'))
	};
};


LDevice.prototype.onOrientationChange = function(f){
	$(window).on('orientationchange', f);
};

LDevice.prototype.onResize = function(f){
	$(window).on('resize', f);
};

LDevice.prototype.info = function(){
	var ss = this.getScreenSize();
	var type = this.isMobile() ? 'mobile' : 'desktop';
	if(!this.isMobile() && this.isMobileOrTablet()) type = 'tablet';
	return {
		width : ss.width,
		height : ss.height,
		orientation : this.getOrientation(),
		type : type
	};
};

LDevice.prototype.onScreenChange = function(f){
	var me = this;
	var func = function(){
		f(me.info());
	};
	$(window).on('resize', func);	
	$(window).on('orientationchange', func);
};

LDevice.prototype.keyBoard = function(object, f){
    var _keydownFunction = function(event){
		f({code:event.keyCode, type: 'down'}, event);
	};
    var _keyupFunction = function(event){
		f({code:event.keyCode, type: 'up'}, event);
	};
	$(object).keydown(_keydownFunction);
	$(object).keyup(_keyupFunction);
    return function(){
        $(object).off('keydown', _keydownFunction);
        $(object).off('keyup', _keyupFunction);
    };
};


LDevice.prototype.mouse = function(object, f){
	object.addEventListener('mousedown', function(event){
		event.preventDefault();
		var rect = event.target.getBoundingClientRect();
		var ret = {
			x : event.clientX - rect.left,
			y : event.clientY - rect.top,
			id : event.button,
			type: 'start'
		};
		f(ret, event);
	});
	object.addEventListener('mouseup', function(event){
		event.preventDefault();
		var rect = event.target.getBoundingClientRect();
		var ret = {
			x : event.clientX - rect.left,
			y : event.clientY - rect.top,
			id : event.button,
			type : 'end'
		};
		f(ret, event);
	});
	object.addEventListener('mousemove', function(event){
		event.preventDefault();
		var rect = event.target.getBoundingClientRect();
		var ret = {
			x : event.clientX - rect.left,
			y : event.clientY - rect.top,
			id : event.button,
			type : 'move'
		};
		f(ret, event);
	});
};

LDevice.prototype.rightClick = function(object, f){
	object.addEventListener('contextmenu', function(event){
		event.preventDefault();
		var rect = event.target.getBoundingClientRect();
		var ret = {
			x : event.clientX - rect.left,
			y : event.clientY - rect.top,
			id : event.button
		};
		f(ret, event);
	});
};

LDevice.prototype.touch = function(object, f){
	var me = this;
    
    var startFunction = function(event){
		event.preventDefault();
		var rect = event.target.getBoundingClientRect();
		for(var i = 0; i < event.touches.length; i++){
			f({
				x : event.touches[i].clientX - rect.left,
				y : event.touches[i].clientY - rect.top,
				id : event.touches[i].identifier,
				type : 'start'
			});
		}
	};
    
    var moveFunction = function(event){
		event.preventDefault();
		var rect = event.target.getBoundingClientRect();
		for(var i = 0; i < event.changedTouches.length; i++){
			f({
				x : event.changedTouches[i].clientX - rect.left,
				y : event.changedTouches[i].clientY - rect.top,
				id : event.changedTouches[i].identifier,
				type : 'move'
			});
		}
	};
    
    var endFunction = function(event){
		event.preventDefault();
		var rect = event.target.getBoundingClientRect();
		for(var i = 0; i < event.changedTouches.length; i++){
			f({
				x : event.changedTouches[i].clientX - rect.left,
				y : event.changedTouches[i].clientY - rect.top,
				id : event.changedTouches[i].identifier,
				type : 'end'
			});
		}
	};
    
	object.addEventListener('touchstart', startFunction, false);
	object.addEventListener('touchmove', moveFunction, false);
	object.addEventListener('touchend', endFunction, false);
    
    return function(){
        object.removeEventListener('touchstart', startFunction);
        object.removeEventListener('touchmove', moveFunction);
        object.removeEventListener('touchend', endFunction);
    };
};