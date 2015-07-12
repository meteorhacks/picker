Tinytest.add('normal route', function(test) {
  var path = "/" + Random.id();
  Picker.route(path, function(params, req, res) {
    res.end("done");
  });

  var res = HTTP.get(getPath(path));
  test.equal(res.content, 'done');
});

Tinytest.add('with params', function(test) {
  var id = Random.id();
  var path = "/post/:id";
  Picker.route(path, function(params, req, res) {
    res.end(params.id);
  });

  var res = HTTP.get(getPath("/post/" + id));
  test.equal(res.content, id);
});

Tinytest.add('filter only POST', function(test) {
  var path = "/" + Random.id();
  var postRoutes = Picker.filter(function(req, res) {
    return req.method == "POST";
  });

  postRoutes.route(path, function(params, req, res) {
    res.end("done");
  });

  var res = HTTP.get(getPath(path));
  test.isFalse(res.content == "done");

  var res = HTTP.post(getPath(path));
  test.isTrue(res.content == "done");
});

Tinytest.add('query strings', function(test) {
  var path = "/" + Random.id();
  Picker.route(path, function(params, req, res) {
    res.end("" + params.query.aa);
  });

  var res = HTTP.get(getPath(path + "?aa=10"));
  test.equal(res.content, "10");
});

Tinytest.add('middlewares', function(test) {
  var path = "/" + Random.id();

  Picker.middleware(function(req, res, next) {
    setTimeout(function() {
      req.middlewarePass = "ok";
      next();
    }, 100);
  });

  Picker.route(path, function(params, req, res) {
    res.end(req.middlewarePass);
  });

  var res = HTTP.get(getPath(path + "?aa=10"));
  test.equal(res.content, "ok");
});

Tinytest.add('middlewares - with filtered routes', function(test) {
  var path = "/" + Random.id() + "/coola";

  var routes = Picker.filter(function(req, res) {
    var matched = /coola/.test(req.url);
    return matched;
  });

  routes.middleware(function(req, res, next) {
    setTimeout(function() {
      req.middlewarePass = "ok";
      next();
    }, 100);
  });

  routes.route(path, function(params, req, res) {
    res.end(req.middlewarePass);
  });

  var res = HTTP.get(getPath(path));
  test.equal(res.content, "ok");
});

var urlResolve = Npm.require('url').resolve;
function getPath(path) {
  return urlResolve(process.env.ROOT_URL, path);
}