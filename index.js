const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var querystring = require('querystring');

const ENDPOINT = "https://westeurope.api.cognitive.microsoft.com/luis/v2.0/apps/";
const APPID = "7366970f-b44a-402f-b823-a6dad845a707";
const APPKEY = "0c75fb35ca384e5d8b8c77da9fb60f6a";

app.use(express.static('public'));

io.on('connection', function (socket) {
    socket.on('assessment', function (msg) {
        sendToLuis(msg, socket.id);
    });
});

function sendToLuis(assessment, socketId) {
    // Send to LUIS
    var queryParams = {
        "subscription-key": APPKEY,
        "verbose": true, // If true will return all intents instead of just the topscoring intent
        "q": assessment
    }

    var luisRequest =
        ENDPOINT + APPID +
        '?' + querystring.stringify(queryParams);


    request(luisRequest,
        function (err, response, body) {
         if (err) {
                io.to(socketId).emit('Error', 'Error understanding your assessment: ' + err);
         } else {
                var data = JSON.parse(body);

                // Check if the relevant properties exist
                if (!data.hasOwnProperty('query') ||
                    !data.topScoringIntent.hasOwnProperty('intent') ||
                    !data.entities[0] ||
                    !data.entities[0].hasOwnProperty('entity')) {
                    io.to(socketId).emit('Error', 'Sorry, I could not understand that. [No intent or entity identified]');
                    return;
                }

                io.to(socketId).emit(data.topScoringIntent.intent, data.entities[0].entity);
            }
        }
    );
}

http.listen(3000, () => console.log('Glucose Metabolism Checklist server listening'));