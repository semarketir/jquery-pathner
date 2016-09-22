A simple Server side app to handle request for records or information from jquery-pathner, of course; you can use your favorite programming languages for server side.

#### Demo
https://secure-river-30341.herokuapp.com

#### Install server dependencies with NPM
```$ cd example/ && npm install```

#### Install client dependencies with bower
```$ cd example/public && bower install```

#### Set your configuration API
Open `example/server.js` file then change the values:
```js
var CONFIG = {
    ...
    auth: {
        clientId: '<client-id>', // insert your client id in here
        clientSecret: '<client-secret>' // insert your client secret in here
    },
    ...
};
```

Open `example/index.html` file then change the values:
```js
...
$('button').pathPartner({
    clientId: '<client-id>', // insert your client id in here
    appname: '<your-appname>', // insert your app name in here
...
```

#### Run server
```$ cd example/ && npm start```

Then visit http://localhost:3000
