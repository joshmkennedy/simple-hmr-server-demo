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
