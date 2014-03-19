function AssetManager(){
	this.sucessCount= 0;
	this.errorCount= 0;
	this.cache={};
	this.downloadQueue=[];
}

AssetManager.prototype.queueDownload= function(path){
	this.downloadQueue.push(path);
	console.log(path);
};

AssetManager.prototype.isDone= function(){
	return(this.downloadQueue.length==this.sucessCount + this.errorCount);
};

AssetManager.prototype.downloadAll= function(callback){
	console.log("Downloading...");
	for(var i=0 ; i< this.downloadQueue.length; i++){
		var path= this.downloadQueue[i];
		var img= new Image();
		var that= this;
		
		console.log("Download "+ i);
		img.addEventListener("load", function(){
			console.log("Sucess "+ i);
			that.sucessCount=+1;
			if (that.isDone()){ 
				callback();
			}
		},false);
		img.addEventListener("error", function(){
			console.log("Error "+ i);
			that.errorCount=+1;
			console,log(that.errorCount);
			if (that.isDone()){ 
				callback();
			}
		}, false);
				
		img.src= path;
		this.cache[path]=img;
	}		
};

AssetManager.prototype.getAsset= function(path){
	return this.cache[path];
};