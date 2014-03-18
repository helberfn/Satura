window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function(callback){
            	window.setTimeout(callback, 1000 / 60);
            };
  })();

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

function GameEngine(){
	this.entities = [];
	this.ctx = null;
	this.timer = new Timer();
	this.surfaceWidth = null;
	this.surfaceHeight = null;
}

GameEngine.prototype.init = function(ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    
    console.log('game initialized');
};

GameEngine.prototype.update = function(){
	for (var i = this.entities.length-1; i >=0; i--) {
		if (this.entities[i].isAlive()){
			this.entities[i].update(this.ctx);
		}
		else {
			this.entities.splice(i,1);
		}
	}
};

GameEngine.prototype.draw = function(){
	this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
	for (var i = 0; i < this.entities.length; i++) {
		if (this.entities[i].visible){
			this.entities[i].draw(this.ctx);
		}
	}
};

GameEngine.prototype.loop = function(){
	this.timer.tick();
	this.update();
	this.draw();
};

GameEngine.prototype.start = function(){
	console.log("starting game...");
	this.lastUpdateTimestamp = Date.now();
	(function gameLoop(){
		that.loop();
		requestAnimFrame(gameLoop);
	})();
};


