# Picker - Server Side Router for Meteor

Picker is an easy to use server side router for Meteor. This router respect others. So, you can use Iron Router and other routers and middlewares along side with this.

## Install

~~~
meteor add meteorhacks:picker
~~~

## Getting Started

~~~js

Picker.router('/post/:_id', function(params, req, res, next) {
  var post = Posts.findOne(params._id);

  // req is an instance of NodeJS http.inc
  res.end(post.content);
});

~~~

 * You can use Meteor APIs inside this callback (runs inside a Fiber)
 * Route definitions are very similar to Iron Router and Express
 * `req` is an instance of NodeJS [http.IncomingMessage](http://nodejs.org/api/http.html#http_http_incomingmessage)
 * `res` is an instance of NodeJS [http.ServerResponse](http://nodejs.org/api/http.html#http_class_http_serverresponse)
 * `next` is optional and call it, if you don't need to handle the current request

## Filtering and Sub Routes

This is an unique functionality of this routes which does not available in any other NodeJS server side router.

This is how we can use **Picker** to handle `POST` requests.

~~~js
var postRoutes = Picker.filter(function(req, res) {
  // you can any logic you want.
  // but this does not runs inside a fiber
  // at the end you must, return either true or false
  return req.method == "POST";
});

postRoutes.route('/post/:id', function(params, req, res, next) {
  // ...
});
~~~

You can create any amount of sub routes with this `filter` API. Same time, you can create nested sub routes as well.

## Middlewares

You can use existing `connect` and `express` middlewares without any issues.

~~~js
var bodyParser = Meteor.npmRequire('body-parser'); // using meteorhacks:npm package
Picker.middleware(bodyParser());
~~~

You can use middlewares on sub routes as well.