# Usage

server:creanvasServer

server interface
----------------
return just a function(callback);

callback is function(app)

app interface
-------------
connect(socket) : to pass the socket for node/socket.io usage;
connect(): to connct for browser usage, returning the created events
addElement(parameters): add an element to the current application.
dispose: clean up event listeners. Application will no longer work.

Should be everything?
the reste is done by elements parameters....