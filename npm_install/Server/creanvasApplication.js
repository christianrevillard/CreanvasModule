//define(['creanvas/events'], function (events) {
  
//  var Application = function (applicationModule) {
//    var self = this;
//    var module = applicationModule;
//    var applicationEvents = new events.EventEmitter();


//    var createInstance = function (onCreated) {
      

//      events.serverEvents.emit("createInstance", self, onCreated);
    
//    }
//  };

//  events.serverEvents.on("createApplication", function (applicationModule, callback) {
//    requirejs(applicationModule, function (app) {
      
//      var app = new Application(applicationModule);
    
//      callback(app);
//    })    
//  })
//});
