const passport = require("passport");
let publicUri = [];

function common(req, res, next){
    // res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.append('Content-Type', 'application/json');

    res.sendError = function (msg) {
      res.status(200).json({code: 200, status: 'error', message: msg});
    }

    res.sendSuccess = function (msg, data=[]) {
      res.status(200).json({code: 200, status: 'ok', message: msg, data: data});
    }
    next();
}

function authenticate(req, res, next) {
  //check for anonymous URLs
  let publicUrl = (publicUri.indexOf(req.originalUrl) > -1 ? true : false);

  if(!publicUrl) {
    passport.authenticate('jwt', { session: false })(req, res, function() {
      if(req.user) {
        next();
      } else {
        res.status(401).json({code: 401, status: 'Unauthorized access', message: "Unauthorized access"});
      }
    });
  } else {
    next();
  }
}

function errorHandler(err, req, res, next){
  //Log errors to server here.
  console.log(err);
  let error = ""+ err;
  res.status(500).json({code: 500, status: 'server_error', message: error});
  res.end();
}

module.exports = {
    common,
    authenticate,
    errorHandler
}