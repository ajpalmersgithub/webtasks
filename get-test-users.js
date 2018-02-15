var MongoClient = require('mongodb').MongoClient;
var waterfall   = require('async').waterfall;
var request = require('request');
const url ="https://randomuser.me/api/?results=20";


module.exports = function(ctx, cb) {

    var MONGO_URL = ctx.data.MONGO_URL;
    if (!MONGO_URL) return cb(new Error('MONGO_URL secret is missing'))

    waterfall([
        function con_str(done) {
            MongoClient.connect(MONGO_URL, function(err, db) {
                if(err) return done(err);

                done(null, db);
            });
      },
        
      function insert_users(db, done) {
         request(url, (error, response, body) => {
          var users = JSON.parse(body);
           db.collection('test-users').deleteMany({},
           function (err, result) {
                  if(err) return done(err);
                  done(null, result);
           }),
              db.collection('test-users').insert({users: users}, function (err, result) {
                  if(err) return done(err);

                  done(null, result);
              })
              });
      }
    ], cb);
};
