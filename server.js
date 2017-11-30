var express = require('express');
var path = require('path');
var serveStatic = require('serve-static')
app = express();
app.use(serveStatic(path.join(__dirname, 'dist')));
app.use(function (req, res) {
  const indexPath  = path.join(__dirname, 'dist')
  res.sendFile(`${indexPath}/index.html`)
});
var port = process.env.PORT || 5000;
app.listen(port);
console.log('server started '+port);
