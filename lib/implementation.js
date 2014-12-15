var pathToRegexp = Npm.require('path-to-regexp');
var Fiber = Npm.require('fibers');
var urlParse = Npm.require('url').parse;

PickerImp = function(filterFunction) {
  this.filterFunction = filterFunction;
  this.routes = [];
  this.subRouters = [];
  this.middlewares = [];
}

PickerImp.prototype.middleware = function(callback) {
  this.middlewares.push(callback);
};

PickerImp.prototype.route = function(path, callback) {
  var regExp = pathToRegexp(path);
  regExp.callback = callback;
  this.routes.push(regExp);
  return this;
};

PickerImp.prototype.filter = function(callback) {
  var subRouter = new PickerImp(callback);
  this.subRouters.push(subRouter);
  return subRouter;
};

PickerImp.prototype._dispatch = function(req, res, bypass) {
  var self = this;
  var currentRoute = 0;
  var currentSubRouter = 0;
  var currentMiddleware = 0;

  if(this.filterFunction) {
    var result = this.filterFunction(req, res);
    if(!result) {
      return bypass();
    }
  }

  processNextMiddleware();
  function processNextMiddleware () {
    var middleware = self.middlewares[currentMiddleware++];
    if(middleware) {
      self._processMiddleware(middleware, req, res, processNextMiddleware);
    } else {
      processNextRoute();
    }
  }

  function processNextRoute () {
    var route = self.routes[currentRoute++];
    if(route) {
      var uri = req.url.replace(/\?.*/, '');
      var m = uri.match(route);
      if(m) {
        var params = self._buildParams(route.keys, m);
        params.query = urlParse(req.url, true).query;
        self._processRoute(route.callback, params, req, res, processNextRoute);
      } else {
        processNextRoute();
      }
    } else {
      processNextSubRouter();
    } 
  }

  function processNextSubRouter () {
    var subRouter = self.subRouters[currentSubRouter++];
    if(subRouter) {
      subRouter._dispatch(req, res, processNextSubRouter);
    } else {
      bypass();
    }
  }
};

PickerImp.prototype._buildParams = function(keys, m) {
  var params = {};
  for(var lc=1; lc<m.length; lc++) {
    var key = keys[lc-1].name;
    var value = m[lc];
    params[key] = value;
  }

  return params;
};

PickerImp.prototype._processRoute = function(callback, params, req, res, next) {
  if(Fiber.current) {
    doCall();
  } else {
    new Fiber(doCall).run();
  }

  function doCall () {
    callback.call(null, params, req, res, next); 
  }
};

PickerImp.prototype._processMiddleware = function(middleware, req, res, next) {
  if(Fiber.current) {
    doCall();
  } else {
    new Fiber(doCall).run();
  }

  function doCall() {
    middleware.call(null, req, res, next);
  }
};