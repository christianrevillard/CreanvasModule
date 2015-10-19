# Usage

server:creanvasServer

server interface
----------------


app interface
-------------
connect(socket) : to pass the socket for node/socket.io usage;
connect(): to connct for browser usage, returning the created events
addElement(parameters): add an element to the current application.
dispose: clean up event listeners. Application will no longer work.

commands
--------
(emit event on commands object)
appCommand : connecting a command to a specific app so it can be disposed.

events
------

----------------------------------
elementData
-----------
position x,y, angle
speed x,y,angle
acceleration x,y, angle



Usage
--------

Add ElementTypes on browser client to draw correctly
Elements are added by the application (browser or node)

