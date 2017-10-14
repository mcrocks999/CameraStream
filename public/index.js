/**
 * Canvas rendering
 */
var canvas = document.getElementById('canvas'); // get canvas
var context = canvas.getContext('2d'); // get context
var updateFrame = true; // boolean whether the frame has changed
var frame = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAPCAAAAACDsMMeAAABWklEQVQoz63STSjDARjH8V95OThJcpZyYQ5WkoP0nxtFTCEu8hKym7U4KMtLSmqWkgMuFkkKeXfBzct1orTTZjh4Kfsr7eswa3ZDntOvnj6H50X8uvS/JDvz16TGSOSltx+RigR50Ml3MnF5NDBlAqy4xuKdoGd4t8CAgNcxHeLKqW5PgINx5wIIrOWSLBAqlqRFAB7zJWUYBFM0bMt+2rersu7GIzlzWhBYS0Ls6ZJ+C9BZBIA7H/xZBvjhWVvc6RxMoDcNgdUNEe1R5gDW9QJQ3xUf/3rLK1+MwMVyj0yBdQSi2iF3EDhUAKC0C6g1oEWtPXHiL1RnZYyMQlTb2JqA+XQAqu0xsqZbkI+wzqG1CjaTyGzqJqulQwDM6ZhJGWxomxn5+FBHhLZik+YkwmCG0vq+ltwuNbgMqJYa5YMO6fQsTxqSmXzKYCJ+vMZW9PL+1QoD9398y085E1ZIUYf1aAAAAABJRU5ErkJggg==';
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
/**
 * WebSocket
 */
var socket; // define our web socket
if(window.location.protocol === "https://") // make sure to use wss if on https
    socket = new WebSocket("wss://" + window.location.host + "/ws"); // create our socket over wss
else // otherwise use ws
    socket = new WebSocket("ws://" + window.location.host + "/ws"); // create our socket over ws
/* function called when connected */
socket.onopen = function() {
    console.log("Connected to " + socket.url);
};
/* function called when disconnected */
socket.onclose = function() {
    console.log("Disconnected from " + socket.url);
}
/* function called when recieving a message */
socket.onmessage = function(message) {
	let data = JSON.parse(message.data); // parse the data we recieved
	if(data.type === "image") setFrame(data.data); // in the case of it being an image, render it
}
