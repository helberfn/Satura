/**
 * 
 */
canvas=document.getElementById("canvas");
ctx=canvas.getContext("2d");

Game= new GameEngine();

ASSET_MANAGER= new AssetManager();
ASSET_MANAGER.queueDownload("Assets/img/teste.png");

console.log("Downloads: "+ASSET_MANAGER.downloadQueue);
ASSET_MANAGER.downloadAll(function(){
	
	Game.init(ctx);
	Game.start();
});

player = new Player(0,0,ASSET_MANAGER.getAsset("Assets/img/teste.png"));


Game.createEntity(player);
Game.camera.follow(player,Game.surfaceWidth/2,Game.surfaceHeight/2);
