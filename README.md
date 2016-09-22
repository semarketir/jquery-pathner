## jQuery Pathner
A super simple jQuery plugin for Path Partner

### Register Application
Link can be found at https://api.path.com/developers/app/new

### Installation
Get the script via one of the methods below, and add it to your page after jQuery and jQuery Popwindow:

```html
<script src="jquery.js"></script>
<script src="jquery.popupwindow.js"></script>
<script src="jquery.pathner.js"></script>
```

#### Bower
```sh
$ bower install jquery-pathner
```

#### Manual
Download the [jquery.pathner.js](https://github.com/semarketir/jquery-pathner/raw/master/dist/jquery.pathner.js) file to your project.


### Basic use
```js
$('button').pathPartner(options, [jqueryPopupWindowOption]);
```
See https://github.com/mkdynamic/jquery-popupwindow for more details of jQuery Popup Window

#### Example
```js
$('button').pathPartner({
    clientId: '<client-id>', // insert your client id in here
    appname: '<your-appname>', // insert your app name in here
    action: '/post-moment', // url for post moment on server
    method: 'post', // let's set post as a method
    data: {
        url: 'http://megapolitan.kompas.com/read/2016/09/23/00004351/tak.ikut.poros.cikeas.gerindra-pks.sepakat.usung.cagub.dan.cawagub.dki',
        image: 'http://assets.kompas.com/data/photo/2016/09/14/1337126sandiaga780x390.jpg',
        title: 'Tak Ikut Poros Cikeas, Gerindra-PKS Sepakat Usung Cagub dan Cawagub DKI',
        description: 'Gerindra dan PKS memutuskan tak akan bergabung dengan poros Cikeas.'
    },
    
    // callback is optional
    callback: {
        success: function (data, done) {
            console.log(data);
            done();
        },
        error: function (xhr, status, err) {
            console.error(status, err.toString());
        }
    }
});
```

#### Server side example
Can be found at [example folder](https://github.com/semarketir/jquery-pathner/tree/master/example).

### LINCESE
WTFPL
