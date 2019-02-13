var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
// 模板模块
var swig = require('swig');
// 加载 body-parser 处理请求数据
var bodyParser = require('body-parser');
// 定义当前应用所使用的模板引擎
// 参数1 模板引擎名称，同时也是模板文件的后缀
// 参数2 解析处理模板内容的方法
app.engine('html', swig.renderFile);
// 设置模板文件的目录，
// 参数1 必须是 views
// 参数2 是目录
app.set('views', './views');
// 注册所使用的模板引擎
// 参数1 必须是 view engine 
// 参数2 必须和 app.engine 的第一个参数一致
app.set('view engine', 'html');
// 在开发过程中，需要取消模板缓存
swig.setDefaults({ cache: false });

// bodyParser 设置
app.use(bodyParser.urlencoded({ extended: true }));

// 用户数组
var users = [];

app.get('/', function (req, res) {
    res.render('login', {
        msg: '请起一个独属于你的昵称吧 ^_^'
    });
});

app.post('/', function (req, res) {
    var username = req.body.username;
    var userIdx = users.indexOf(username); console.log(users, userIdx);
    if (userIdx >= 0) {
        // 用户存在
        res.render('login', {
            msg: '昵称已存在，请重起一个昵称吧 ^_^'
        });
    } else {
        // 用户不存在，是新用户
        users.push(username);
        res.render('index', {
            username: username,
            usernum: users.length
        });
    }
    console.log(req.body)
})
var vip = 0;
io.on('connection', function (socket) {
    // 有新用户登录
    io.emit('user login', {
        username: users[users.length - 1],
        usernum: users.length
    });
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
    // 有用户退出
    socket.on('logout', function (msg) {
        var userIdx = users.indexOf(msg.username);
        users.splice(userIdx,1);
        io.emit('user logout', {
            username: msg.user,
            usernum: users.length
        });
    });
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});