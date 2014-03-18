function AssetManager(){
	this.sucessCount= 0;
	this.errorCount= 0;
	this.cache={};
	this.downloadQueue=[];
}

AssetManager.prototype.queueDownload= function(path){
	this.downloadQueue.push(path);
};

AssetManager.prototype.isDone= function(){
	return(this.downloadQueue.length==this.sucessCount + this.errorCount);
};

AssetManager.prototype.downloadAll= function(callback){
	for(var i=0 ; i< this.downloadQueue.lenght; i++){
		var path= this.downloadQueue[i];
		var img= new Image();
		var that= this;
		
		img.addEventListener("load", function(){
			that.sucessCount=+1;}
		,false);
		img.addEventListener("error", function(){
			that.errorCount=+1;}
		,false);
		
		if (that.isDone()){ callback(); }
				
		img.src= path;
		this.cache[path]=img;
	}		
};

AssetManager.prototype.getAsset= function(path){
	return this.cache[path];
};