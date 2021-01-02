# How to create a simple hmr server

## Steps

1. Include a script in the markup that opens a connection to a websocket server.
   ```js
   window.addEventListener('DOMContentLoaded', function(){
      const ws = new WebSocket('ws://localhost:7878')
      ws.onmessage = function(e){
        if(e.data == 'reload'){
          window.location.href = window.location.href
        }
      }
    })
    ```
2.  install websocket node library 
  `npm -i ws` or `yarn add ws`
3.  create a js file with this script
```js
const fs = require("fs");
const Websocket = require("ws");

const wss = new Websocket.Server({ port: 7878 });

wss.on("connection", watchFiles);
function watchFiles(ws) {
  fs.readdir("input", { encoding: "utf-8" }, (err, files) => {
    files.forEach((file) => {
      const watch = watchFactory(() => {
        ws.send("reload");
      });
      watch(`input/${file}`);
    });
  });
}
function watchFactory(cb) {
  let isActive = false; // state so the event function only fires once
  return (fileName) => {
    fs.watch(
      fileName,
      { encoding: "utf8" },
      function listener(event, fileName) {
        if (fileName) {
          if (!isActive) {
            cb();
          }
          isActive = !isActive; //toggles boolean
        }
      }
    );
  };
}
```
Basically the websockets.onConnection event listener needs to loop through a list of files to watch, and fs.watch them. Once the file is changed the event is fired and the listener for this function sends a websocket message that the client is listening for and once it receives this message it will reload the page