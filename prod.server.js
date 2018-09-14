// node.js调试 node prod.server.js
var express = require('express');
var config = require('./config/index');

var port = process.env.PORT || config.build.port;
// 请求server
var app = express();

var router = express.Router();

router.get('/', function (req, res, next) {
  req.url = './index.html';
  next();
});

app.use(router);


var appData = require('./data.json');
// 卖家数据
var seller = appData.seller;
// 商品数据
var goods = appData.goods;
// 评论数据
var ratings = appData.ratings;
// 编写路由
var apiRoutes = express.Router();
app.get('/api/seller', function (req, res) {
  // 服务端收到请求后返回给客户端一个json数据
  res.json({
    // 当我们数据正常时，我们通过传递errno字符为0表示数据正常
    errno: 0,
    // 返回json中的卖家的数据
    data: seller
  });
});
app.get('/api/goods', function (req, res) {
  res.json({
    errno: 0,
    data: goods
  });
});
app.get('/api/ratings', function (req, res) {
  res.json({
    errno: 0,
    data: ratings
  });
});
// path, express.Router()
app.use('/api', apiRoutes);
app.use(express.static('./dist'));
module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
});
