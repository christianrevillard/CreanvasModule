// make sure all the modules are loaded at least once...
define([
  'creanvas/intervals', 
  'creanvas/element', 
  'creanvas/clientUpdater',
  'creanvas/creanvasApplicationInstance'
], function () {
  console.log('Not directly referenced modules are loaded.');
});
