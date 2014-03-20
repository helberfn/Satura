/**
 * 
 */
canvas=document.getElementById("canvas");
ctx=canvas.getContext("2d");

Game= new GameEngine();

ASSET_MANAGER= new AssetManager();
ASSET_MANAGER.queueDownload("Assets/img/player.png");
ASSET_MANAGER.queueDownload("Assets/img/bg.png");

console.log("Downloads: "+ASSET_MANAGER.downloadQueue);
ASSET_MANAGER.downloadAll(function(){
	
	Game.init(ctx);
	Game.camera.follow(player,Game.surfaceWidth/2,Game.surfaceHeight/2);

});

player = new Player(Game,0,0,ASSET_MANAGER.getAsset("Assets/img/player.png"));
bg= new  Background (Game,0,0,ASSET_MANAGER.getAsset("Assets/img/bg.png"));

Game.createEntity(player);
Game.createEntity(bg);

console.log(Game.camera);

