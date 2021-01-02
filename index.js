const fs = require("fs");

fs.readdir("input", { encoding: "utf-8" }, (err, files) => {
  files.forEach((file) => {
    readThenWriteOutput("input", file);
    const watcher = watchFactory();
    watcher(`input/${file}`);
  });
});

function watchFactory() {
  let isActive = false; // state so the event function only fires once
  return (fileName) => {
    fs.watch(
      fileName,
      { encoding: "utf8" },
      function listener(event, fileName) {
        if (fileName) {
          if (!isActive) {
            readThenWriteOutput("input", fileName);
          }
          isActive = !isActive; //toggles boolean
        }
      }
    );
  };
}

function readThenWriteOutput(dir, fileName) {
  fs.readFile(
    `${dir}/${fileName}`,
    { encoding: "utf-8" },
    function (err, data) {
      console.log(data);
      fs.writeFile(`output/${fileName}`, data, { encoding: "utf-8" }, () =>
        console.log("done")
      );
    }
  );
}
