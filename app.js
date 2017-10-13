const express = require('express');
const WebSocket = require('ws');
const NodeWebcam = require('node-webcam');
const chalk = require('chalk');

const port = 8080;
const FPS = 3;

var webcam = NodeWebcam.create({
    width: 1280,
    height: 720,
    quality: 100,

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
var httpServer = require('http').createServer(app);
var wss = new WebSocket.Server({ server: httpServer, path: '/ws' });

app.use(express.static('/public'));

httpServer.listen(port, function() { console.log(chalk.green("Server listening on port " + port)); });
