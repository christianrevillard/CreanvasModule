// entry point for in-browser, config requirejs here

requirejs.config({
  paths: { 'creanvas': '../../Server' }
});

define([
  '../../Server/creanvasServer',
  '../../Client/creanvasClient'],
  function (server, client) {
  
  console.log('creating the server-- browser');  
  
  console.log('Server started,adding an element');
  server.events.emit("addElement", 100, 100);
  
  var clientEvents = server.connect();
  
  console.log('And the client - browser');
  client(
    clientEvents, 
    document.getElementById('browserCanvas'));
 
   
 });

