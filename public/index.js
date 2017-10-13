/**
 * Here we do stuff, yes.
 */
var canvas = document.getElementById('canvas'); // get canvas
var context = canvas.getContext('2d'); // get context
var updateFrame = false; // boolean whether the frame has changed
var frame = '';
/* set frame */
function setFrame(base64) {
	frame = base64;
	updateFrame = true;
}
/* draw stuff */
function draw() {
	var image = new Image();
	image.onload = function() {
		context.drawImage(image, 0, 0);
	};
	image.src = 'data:image/png;base64,'+frame;
}
/* main loop */
function anim() {
	if (updateFrame) { // we don't want to redraw the frame constantly
		canvas.width = canvas.width;
		draw();
		updateFrame = false;
	}
	requestAnimationFrame(anim); // magical stuff
}
anim(); // start the loop

/**
 * NOTE!
 * To implement websockets, when recieving base64, simply just call setFrame with the base64 as an argument.
 */