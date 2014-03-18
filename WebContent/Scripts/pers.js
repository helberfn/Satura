/**
 * 
 */
 ctx= document.getElementById("canvas").getContext("2d");
 var img = new Image();
 img.src = "Assets/img/teste.png";
 img.onload= function(){
 	ctx.drawImage(img,0,0);
 };

 
