/**
* Node.js script to pull top artists from last.fm and post to a specified Slack channel
* Slack Incoming WebHook API Reference: https://api.slack.com/incoming-webhooks
*/
var request = require('request');

var api_key = '';       // Last.fm API Key
var user_name = '';     // Last.fm User Name
var period = '7day';    // Interval of top artists
var limit = '5';        // Number of top artists to pull

var service = '';// Slack Services Hook URL
var channel_override = ''; // Slack Channel (# prepend) or Slack UserName (@ prepend)

var lastURL = 'http://ws.audioscrobbler.com/2.0/?method=user.gettopartists'
            +'&user='+user_name
            +'&period='+period
            +'&limit='+limit
            +'&api_key='+api_key
            +'&format=json';

request(lastURL, function(error, response, body) {
    if (error) {
        console.log('Error!\n'+error);
    } else if (response.statusCode !== 200) {
        console.log('Error!\n'+response);
    } else {
        var str = 'My Top Artists this week: ';
        var artists = JSON.parse(body).topartists.artist;
        artists.forEach(function(elem) {
            str += elem['@attr'].rank+') '+'<'+elem.url+'|'+elem.name+'> ';
        });
        postToSlack(str);
    }
});

function postToSlack(str) {
    request.post(
        service,
        { form: { payload:'{"text": "'+str+'","channel":"'+channel_override+'"}' } },
        function (error, response, body) {
            if (error) {
                console.log(error);
            } else if (response.statusCode !== 200) {
                console.log(response)
            } else {
                console.log(body);
            }
        }
    );
}
