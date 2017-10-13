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
	image.src = frame;
}
/* main loop */
function anim() {
	if (updateFrame) { // we don't want to redraw the frame constantly
		draw();
		updateFrame = false;
	}
	requestAnimationFrame(anim); // magical stuff
}
anim(); // start the loop

var socket;
if(window.location.protocol === "https://") socket = new WebSocket("wss://" + window.location.host + "/ws");
else socket = new WebSocket("ws://" + window.location.host + "/ws");
socket.onopen = function() { console.log("Connected to " + socket.url); }
socket.onclose = function() { console.log("Disconnected from " + socket.url); }
socket.onmessage = function(message) {
	let data = JSON.parse(message.data);
	if(data.type === "image") setFrame(data.data);
}
