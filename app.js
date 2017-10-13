const express = require('express');
const WebSocketServer = require('websocket').Server;
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
    output: "jpeg",
    //Which camera to use
    //Use Webcam.list() for results
    //false for default device
    device: false,
    callbackReturn: "base64",
    //Logging
    verbose: false
});
