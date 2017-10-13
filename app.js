const express = require('express');
const WebSocket = require('ws');
const NodeWebcam = require('node-webcam');
const chalk = require('chalk');

const port = 8080;
const FPS = 1;

var webcam = NodeWebcam.create({
  width: 854,
  height: 480,
  quality: 80,

  delay: 0,
  saveShots: false,
  output: 'jpeg',
  //Which camera to use
  //Use Webcam.list() for results
  //false for default device
  device: false,
  callbackReturn: 'base64',
  //Logging
  verbose: false
});
var app = express();
app.use(express.static(__dirname + '/public'));

var httpServer = require('http').createServer(app);
var wss = new WebSocket.Server({ server: httpServer, path: '/ws' });
var lastFrame = null;

wss.on('connection', function(ws, req) {
  if(lastFrame !== null) ws.send(JSON.stringify({ type: "image", data: lastFrame }));
  console.log(req.connection.remoteAddress.substring(7) + " connected.");
  ws.on('close', function(code, reason) {
    console.log(req.connection.remoteAddress.substring(7) + " disconnected with reason " + code + ":" + reason);
  })
});

const captureFrame = function() {
  let currentTime = Date.now();
  webcam.capture("picture", function(err, data) {
    if(err) {
      console.error(chalk.red("Webcam error!"));
      console.error(err);
    } else {
      lastFrame = data;
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "image", data: data }));
        }
      });
    }
    let captureTime = Date.now() - currentTime;
    if(captureTime / (1000 / FPS) >= 2) console.log(chalk.gray(Math.floor(captureTime / (1000 / FPS)) + " frame skips since last capture!" ))
    if(captureTime % (1000 / FPS) !== 0) setTimeout(captureFrame, captureTime % (1000 / FPS));
    else captureFrame();
    currentTime = null; captureTime = null;
  });
}

httpServer.listen(port, function() { console.log(chalk.green("Server listening on port " + port)); captureFrame(); });
