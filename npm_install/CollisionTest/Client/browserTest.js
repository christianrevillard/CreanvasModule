// entry point for in-browser, config requirejs here

requirejs.config({
  paths: {
    'creanvas': '../../Server' ,
    'modules': '../../Modules' ,
    'client': '../../Client'
  }
});

requirejs([
  './collisionTestClient',
  '../Server/CollisionTest'
],
  function (client, testApplication) {
  
  startClient = function (clientEvents) {
    client(
      clientEvents, 
      document.getElementById('browserCanvas'));
  };
  
  testApplication.getApplication(function (newInstance) {
    console.log('newInstance:', newInstance);
    startClient(newInstance.connect());
  });
});
