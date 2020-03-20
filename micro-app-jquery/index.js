const express = require("express");
const path = require("path");

const app = express();

app.use('/jquery', express.static('static'));
app.get("/", (req, res) => {
  const route = req.headers.referer.split("http://localhost:8082/jquery")[1];
  res.sendFile(path.join(__dirname, `./static/${route || 'index'}.html`))
});

app.listen(8902, () => {
  console.log("server is listening in http://localhost:8902")
})