$(window).bind("load",function(){
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var imgData=ctx.getImageData(0,0,c.width,c.height);

for (var i=0;i<imgData.data.length;i+=4){
	var r = imgData.data[i];
	var g = imgData.data[i+1];
	var b = imgData.data[i+2];
	var cor = 0.2126*r + 0.7152*g + 0.0722*b;
	imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] = cor;
}

ctx.putImageData(imgData,0,0);
});
