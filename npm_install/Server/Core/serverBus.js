define(['creanvas/Core/EventEmitter'],
  function (EventEmitter) {
  var serverBus = new EventEmitter();
  serverBus.setMaxListeners(0);
  return serverBus;
});
