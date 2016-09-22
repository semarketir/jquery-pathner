// Very simple express app
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

// Use JWT for Token protection
// @see https://github.com/auth0/node-jsonwebtoken
var jwt = require('jsonwebtoken');
var JWT_KEY = 'your secret key';

var app = express();

var CONFIG = {
    host: '0',
    port: 3000,
    auth: {
        clientId: '<client-id>', // insert your client id in here
        clientSecret: '<client-secret>' // insert your client secret in here
    },
    api: {
        access_token: 'https://partner.path.com/oauth2/access_token',
        moment: {
            photo: 'https://partner.path.com/1/moment/photo'
        }
    }
};

// set static public folder
app.use(express.static('public'));

app.use(cookieParser('secret'));
// For parsing application/json
app.use(bodyParser.json());
// For parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Load html example
app.get('/', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
});

// Handle request_url for getting a token
app.get('/redirect', function (req, res, next) {
    const code = req.query.code;
    if (!code) {
        return next(new Error('Code is not provided'));
    }
    const options = {
        url: CONFIG.api.access_token,
        form: {
            grant_type: 'authorization_code',
            client_id: CONFIG.auth.clientId,
            client_secret: CONFIG.auth.clientSecret,
            code: code
        }
    };

    request.post(options, function(error, response, body) {
        if (error) {
            return res.json({status: false, error: JSON.stringify(error)});
        }
        if (!body) {
            return res.json({status: false, message: 'invalid json'});
        }
        var json = JSON.parse(body);
        if (!json.access_token) {
            return res.json({status: false, message: 'access_token not found'});
        }

        // sign with default (HMAC SHA256)
        var token = jwt.sign({ token: json.access_token }, JWT_KEY);
        res.json({
            token: token // jquery-pathner using `token` key for get token data, so please keep for this one
        });
    });
});

// Post moment to Path
app.post('/post-moment', function (req, res, next) {
    var decodeToken,
        bearerToken = req.header('Authorization');
    try {
        var imageUrl = req.body.image,
        // Join title, description and url as a default caption
            caption  = [
                req.body.title,
                req.body.description,
                req.body.url
            ];
        if (req.body.caption) {
            // insert user caption in top of caption
            caption.unshift(req.body.caption + '\n\n');
        }
        decodeToken = jwt.verify(bearerToken, JWT_KEY);
        request.post(CONFIG.api.moment.photo, {
            headers: {
                Authorization: 'Bearer ' + decodeToken.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // set with your image url
                source_url: imageUrl,
                caption: caption.join('\n'),
                // Set true if your app has been accepted by Admin
                private: false
            })
        }, function (error, response, body) {
            if (error) {
                return next(error);
            }
            res.json(body);
        });
    } catch(err) {
        return next(err);
    }
});

app.listen(CONFIG.port, function () {
    console.log("Example app listening at http://%s:%s", CONFIG.host, CONFIG.port);
});
