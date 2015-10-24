// entry point for in-browser, config requirejs here

requirejs.config({
  paths: {
    'creanvas': '../../Server' ,
    'client': '../../Client'
  }
});


var minApp;

requirejs([
  './testApplicationClient',
  '../Server/testApplication'
],
  function (client, testApplication) {
  
  startClient = function (clientEvents) {
    client(
      clientEvents, 
      document.getElementById('browserCanvas'));
  };
  
  minApp = {
    join: function () {
      console.log('Join');
        
      testApplication.getApplication(function (newInstance) {
        console.log('newInstance:', newInstance);
        startClient(newInstance.connect());
      });
    }
  };

  minApp.join();
});

