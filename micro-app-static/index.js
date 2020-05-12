const express = require("express");
const cors = require("cors");

const app = express();
// 解决跨域问题
app.use(cors());
app.use('/', express.static('static'));

// 监听端口
app.listen(10400, () => {
  console.log("server is listening in http://localhost:10400")
})