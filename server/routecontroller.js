var extend = function(dest, orig) {
  for (var i in orig) {
    if (Object.prototype.hasOwnProperty.call(orig, i)) {
      dest[i] = orig[i];
    }
  }
};

module.exports = {
	init: function(server, app, next) {
    next(new RouteController(server, app));

	}
};

function RouteController(server, app) {
  var ctrl = this;

  ctrl.server = server;
  ctrl.app = app;

  function auth(route, model) {
    ctrl.app.post(route, function(req, res) {
      model.find(req.body, function(err, collection) {
        var status = false;
        if (err) {
          console.log('Houve um erro ao obter os dados:\n' + err);
          res.redirect("/unauthorized");
        } else { collection.length && res.redirect("/index?id=" + collection.id); }
      });
    });
  }

  function createGetter(route, model) {
    ctrl.app.get(route, function(req, res) {
      model.find(req.params, function(err, collection) {
        if (err) {
          console.log('Houve um erro ao obter os dados:\n' + err);
        } else {
          res.send(collection);
        }
      });
    });
  }

  function createUpdater(route, model, redirectUrl) {
    ctrl.app.put(route, function(req, res) {
      debugger;
      var obj = {};
      extend(obj, req.body);
      delete obj.__v;
      delete obj._id;
      model.update({ id: req.params.id }, obj, function(err) {
        if (err) {
          console.log(err);
        } else {
          if (redirectUrl)
            res.redirect(redirectUrl);

          res.send({ status: true });
        }
      });
    });
  }

  function createSetter(route, model) {
    ctrl.app.post(route, function(req, res) {
        model.create(req.body, function(err, _model) {
          if (err) {
            console.log(err);
          } else {
            res.send({ status: true });
          }
        });
    });
  }

  function createEraser(route, model) {
    ctrl.app.delete(route, function(req, res) {
        model.remove({ id: req.params.id }, function(err, _model) {
          if (err) {
            ctrl.error.log(ctrl.messages.ERROR_WHILE_FETCHING, err);
          } else {
            res.send({ status: true });
          }
        });
    });
  }

  ctrl.createGETRoute = createGetter;
  ctrl.createPOSTRoute = createSetter;
  ctrl.createPUTRoute = createUpdater;
  ctrl.createDELETERoute = createEraser;
  ctrl.auth = auth;
}
