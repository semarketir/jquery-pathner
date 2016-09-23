## jQuery Pathner
A super simple jQuery plugin for Path Partner

### Demo
https://secure-river-30341.herokuapp.com

Source code: https://github.com/semarketir/jquery-pathner-nodejs-server-demo

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

#### Example 1 - set data with function
```html
<button data-url="http://.." data-title="title 1" data-image="http://cdn.image..." data-description="description 1">Share</button>
```
```js
$('button').pathPartner({
    clientId: '<client-id>', // insert your client id in here
    appname: '<your-appname>', // insert your app name in here
    action: '/post-moment', // url for post moment on server
    method: 'post', // let's set post as a method
    data: function(self) {
        // self is button object from jquery
        return {
           url: $(self).data('url'),
           image: $(self).data('image'), // use your cdn for image source
           title: $(self).data('title'),
           description: $(self).data('description')
       };
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

#### Example 2 - set data with object
```js
$('button').pathPartner({
    clientId: '<client-id>', // insert your client id in here
    appname: '<your-appname>', // insert your app name in here
    action: '/post-moment', // url for post moment on server
    method: 'post', // let's set post as a method
    data: {
        url: 'http://www.theverge.com/2016/9/20/12988208/brad-pitt-angelina-jolie-divorce-tabloid-rumors',
        // use your cdn for image source
        image: 'https://cdn0.vox-cdn.com/thumbor/G_osnpGN__W6l7PAhLH8fTxZ49w=/0x58:1531x919/1600x900/cdn0.vox-cdn.com/uploads/chorus_image/image/50942129/495998868.0.jpg', 
        title: 'When a tabloid rumor is true, let’s not forget the entire decade it was wrong',
        description: 'After 11 years of grocery store check-out tabloids like US Weekly, In Touch, Star, and even the occasionally reputable People reporting that Brad Pitt and Angelina Jolie were splitting up, Brad...'
    }
});
```

#### Server side example
Can be found at [example folder](https://github.com/semarketir/jquery-pathner/tree/master/example) or https://github.com/semarketir/jquery-pathner-nodejs-server-demo

### LINCESE
WTFPL
