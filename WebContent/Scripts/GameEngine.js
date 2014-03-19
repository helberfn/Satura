window.requestAnimFrame = (function(callback){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(callback){
                window.setTimeout(callback, 1000 / 60);
              };
});

// Timer
function Timer(){
	this.gameTime = 0;
	this.maxStep = 0.05;
	this.lastTimestamp = 0;
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
function Camera (xView,yView,wView,hView,wRoom,hRoom){
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
	if (this.target =! null){
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
	this.timer = new Timer();
	this.surfaceWidth = null;
	this.surfaceHeight = null;
}

GameEngine.prototype.setCamera= function(xView,yView,wView,hView,wRoom,hRoom){
	this.camera = new Camera(xView,yView,wView,hView,wRoom,hRoom);
};
 
GameEngine.prototype.init = function(ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.setCamera(0,0,this.surfaceWidth,this.surfaceHeight,this.surfaceWidth*2,this.surfaceHeight*2 );
    this.start();
    console.log('game initialized');
};

GameEngine.prototype.update = function(){
	for (var i = this.entities.length-1; i >=0; i--) {
		if (this.entities[i].isAlive()){
			this.entities[i].update(this.ctx);
		} else {
			this.entities.splice(i,1);
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
	(function gameLoop(){
		that.loop();
		requestAnimFrame(gameLoop, that.ctx.canvas);
	})();
};

GameEngine.prototype.createEntity= function(Entity){
	this.entities.push(Entity);
};

function Entity(x,y,visible){
	this.x = x;
	this.y = y;
	this.visible = visible || true;
	this.exist=true;
};

Entity.prototype.update = function(){};

Entity.prototype.draw = function(ctx){};

Entity.prototype.isAlive = function(){
	return this.exist;
};

function Player(x,y,sprite){
	this.x = x;
	this.y = y;
	this.exist=true;
	this.sprite=sprite;
}
Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.draw = function(ctx){
	ctx.drawImage(this.sprite,this.x,this.y);
};
