window.requestAnimFrame = (function(callback){
      return  window.requestAnimationFrame(callback)       ||
              window.webkitRequestAnimationFrame(callback) ||
              window.mozRequestAnimationFrame(callback)    ||
              window.oRequestAnimationFrame(callback)      ||
              window.msRequestAnimationFrame(callback)     ||
              function(callback){
                window.setTimeout(callback, 1000 / 60);
              };
});

// Timer
function Timer(){
	this.gameTime = 0;
	this.maxStep = 0.05;
	this.lastTimestamp = Date.now();
	this.clockTick= this.maxStep;
}
Timer.prototype.tick=function(){
	var currentTime = Date.now();
	var clockTick = (currentTime - this.lastTimestamp)/1000;
	this.lastTimestamp = currentTime;	
	deltaTime= Math.min(clockTick,this.maxStep);
	this.gameTime += clockTick;	
};
//Camera
function Camera (room,xView,yView,wView,hView,wRoom,hRoom){
	this.room=room;
	this.xView=xView || 0;
	this.yView=yView || 0;
	this.wView=wView;
	this.hView=hView;
	this.wRoom=wRoom;
	this.hRoom=hRoom;
	
	this.target=null;
	this.xDeadZone = 0;
	this.yDeadZone = 0;
	
}

Camera.prototype.follow= function(object,xDeadZone,yDeadZone){
	this.target = object;
	this.xDeadZone = 0 || xDeadZone;
	this.yDeadZone = 0 || yDeadZone;
};

Camera.prototype.filter=function(ctx){
	var imgData=ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);

	for (var i=0;i<imgData.data.length;i+=4){
		var r = imgData.data[i];
		var g = imgData.data[i+1];
		var b = imgData.data[i+2];
		var cor = 0.2126*r + 0.7152*g + 0.0722*b;
		imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] = cor;
	}
	ctx.putImageData(imgData,0,0);
};
	
Camera.prototype.update = function(){
	if (this.target != null){
		// Movimento X
		if(this.target.x - this.xView  + this.xDeadZone > this.wView){
			this.xView = this.target.x - (this.wView - this.xDeadZone);
		} else if(this.target.x  - this.xDeadZone < this.xView){
			this.xView = this.target.x  - this.xDeadZone;
			}
		// Movimento Y
		if(this.target.y - this.yView  + this.yDeadZone > this.hView){
			this.yView = this.target.y - (this.hView - this.yDeadZone);
		} else if(this.target.y  - this.yDeadZone < this.yView){
			this.yView = this.target.y  - this.yDeadZone;
			}
	}
	if (this.xView<0) {this.xView=0;};
	if (this.yView<0) {this.yView=0;};
	if (this.xView+this.wView>this.wRoom) {
		console.log(this.wRoom-this.wView);
		this.xView=this.wRoom-this.wView;};
	if (this.yView+this.hView>this.hRoom) {
		this.yView=this.hRoom-this.hView;};

};
//// BoundBox
//function BoundBox(left,top,widht,height){
//	this.left = left || 0;
//	this.top = top || 0;
//    this.width = width || 0;
//	this.height = height || 0;
//	this.right = this.left + this.width;
//	this.bottom = this.top + this.height;
//}
//BoundBox.prototype.setBox = function(left, top, widht, height){
//	this.left = left;
//	this.top = top;
//    this.width = width;
//	this.height = height;
//	this.right = this.left + this.width;
//	this.bottom = this.top + this.height;
//}
//GameEngine
function GameEngine(){
	this.entities = [];
	this.ctx = null;
	this.keyboard={};
	this.timer = new Timer();
	this.surfaceWidth = null;
	this.surfaceHeight = null;
}

GameEngine.prototype.setCamera= function(xView,yView,wView,hView,wRoom,hRoom){
	this.camera = new Camera(this,xView,yView,wView,hView,wRoom,hRoom);
};
 
GameEngine.prototype.init = function(ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.setCamera(0,0,this.surfaceWidth,this.surfaceHeight,3983,800 );
    this.inputStart();
    this.start();

    console.log('game initialized');
};

GameEngine.prototype.inputStart=function(){
	console.log("Starting input");
    var that=this;
	window.addEventListener("keydown",function(event){
    	that.keyboard[event.keyCode+""]={ "Pressed":true,	
    							  			  "CTRL":event.ctrlKey,
    							  			  "ALT":event.altKey,
    							  			  "LastTimeStamp":event.timeStamp || Date.now()};
    	}, false);
    window.addEventListener("keyup",function(event){
    	if(that.keyboard[event.keyCode+""])
    		{that.keyboard[event.keyCode+""].Pressed=false;}
	    },false);
};

GameEngine.prototype.loop = function(){
	this.timer.tick();
	this.update();
	this.draw();
};

GameEngine.prototype.start = function(){
	console.log("starting game...");
	this.timer.tick();
	var that=this;
	
	(function gameLoop() {
		console.log("loop");
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
	
};

GameEngine.prototype.update = function(){
	for (var i = this.entities.length-1; i >=0; i--) {
		if (this.entities[i].isAlive()){
			this.entities[i].update(this.ctx);
		} else {
			this.entities.splice(i,1);
		};
	};
	if(this.entities.length>=2){
		for(var i = 0; i <this.entities.length-1; i++){
			if (this.entities[i].depth <this.entities[i+1].depth){
				var entitySwap=this.entities[i+1];
				this.entities[i+1]= this.entities[i];
				this.entities[i]= entitySwap;
			};
		};
	};
	this.camera.update();
};

GameEngine.prototype.draw = function(){
	this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
	for (var i = 0; i < this.entities.length; i++) {
		if (this.entities[i].visible){
			this.entities[i].draw(this.ctx);
		};
	};
	this.camera.filter(this.ctx);
	this.ctx.font="10pt Courier";
	this.ctx.fillText("FPS: "+1/this.timer.clockTick, 30, 30);
};

GameEngine.prototype.createEntity= function(Entity){
	this.entities.push(Entity);
};

function Entity(x,y,visible,depth,room){
	this.x = x;
	this.y = y;
	this.depth= depth || 1;
	this.visible = visible || true;
	this.exist=true;
};

Entity.prototype.update = function(){};

Entity.prototype.draw = function(ctx){};

Entity.prototype.isAlive = function(){
	return this.exist;
};

function Player(room,x,y,sprite){
	this.room=room;
	this.sprite=sprite;
	this.x = x - this.sprite.width/2 ;
	this.y = y - this.sprite.height/2;
}
Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.setDepth= function(z){
	this.depth=z;	
};
Player.prototype.draw = function(ctx){
	ctx.drawImage(this.sprite,this.x-this.room.camera.xView,this.y-this.room.camera.yView);
};

Player.prototype.update= function(){
	if(this.room.keyboard["37"] && this.room.keyboard["37"].Pressed){this.x-=6;};
	if(this.room.keyboard["38"] && this.room.keyboard["38"].Pressed){this.y-=6;};	
	if(this.room.keyboard["39"] && this.room.keyboard["39"].Pressed){this.x+=6;};	
	if(this.room.keyboard["40"] && this.room.keyboard["40"].Pressed){this.y+=6;};	
};
function Background(room,x,y,sprite,depth){
	this.room=room;
	this.x = x;
	this.y = y;
	this.sprite=sprite;
	this.depth= depth || 10;
}
Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.draw = function(ctx){
	sWidth =  ctx.canvas.width;
	sHeight = ctx.canvas.height;
	sx=this.room.camera.xView;
	sy=this.room.camera.yView;
	
	if(this.sprite.width - sx < sWidth){
		sWidth = this.sprite.width - sx;
	}
	if(this.sprite.height - sy < sHeight){
		sHeight = this.sprite.height - sy; 
	}
//	console.log("sWidht: "+sWidth);
//	console.log("sHeight: "+sHeight);
//	console.log("sx: "+sx);
//	console.log("sy: "+sy);
	ctx.drawImage(this.sprite, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
};

Background.prototype.setDepht= function(z){
	this.depth=z;	
};