
// 阅后即焚时间
var destroy = {
    time: 0,
    type: 'n'
};
// 信息 ID
var msgId = 0;
    

$(function () {
    // 问好
    welcome();
    setDestroy();
    setCtrl();
    Setpop();
    
    // 获取用户名
    var username = $(".username").html();
    var socket = io();
    // 发送消息
    $('form').submit(function (e) {
        e.preventDefault();
        socket.emit('chat message', {
            user: username,
            content: $('#msgInput').val(),
            destroy: destroy
        });
        $('#msgInput').val('');
        $('#msgInput').focus();
        return false;
    });

    // 有用户消息
    socket.on('chat message', function (msg) {
        var html = '';
        var liId = 'message-' + msgId;
        if(msg.content == ''){
            msg.content = '&nbsp;';
        }
        if (msg.user == username) {
            html = `<li class="item self" id="${liId}">
                        <div class="user">${ msg.user}</div>
                        <div class="content">${ msg.content }</div>
                        <div class="clear"></div>
                    </li>`;
        } else {
            html = `<li class="item" id="${liId}">
                        <div class="user">${ msg.user}</div>
                        <div class="content">${ msg.content }</div>
                        <div class="clear"></div>
                    </li>`;
            // 提醒消息
            msgAlert();
        }
        
        liId = '#' + liId;console.log(destroy)
        // 销毁信息
        destroyMsg(msg.destroy, liId);
        $('#messages').append($(html));
        window.scrollTo(0, document.body.scrollHeight);
        
        msgId++;
    });
    // 有新用户登录
    socket.on('user login', function (msg) {
        $("#usernum").html(msg.usernum);
        var html = `<li>
                    <div class="new-user-box">
                        <div class="new-user">欢迎 ${msg.username} 加入聊天 ^_^</div>
                    </div>
                </li>`;
        $('#messages').append($(html));
        window.scrollTo(0, document.body.scrollHeight);
    });
    // 用户退出
    window.onbeforeunload = function (e) {
        e = e || window.event;
        socket.emit('logout', {
            user: username
        });
    }
    socket.on('user logout', function (msg) {
        $("#usernum").html(msg.usernum);
        var html = `<li>
                    <div class="new-user-box">
                        <div class="new-user"> ${msg.username} 退出聊天 ^_^</div>
                    </div>
                </li>`;
        $('#messages').append($(html));
        window.scrollTo(0, document.body.scrollHeight);
    });
});

// 问好
function welcome() {
    var date = new Date();
    var hour = date.getHours();
    var saygood = '';
    if (hour >= 18) {
        saygood = '晚上';
    } else if (hour >= 12) {
        saygood = '下午';
    } else {
        saygood = '早上'
    }
    document.getElementById('saygood').innerText = saygood;
}
// 消息提醒
function msgAlert() {
    // 播放消息音
    var audio = document.getElementById('msgAlert');
    audio.currentTime = 0;
    audio.play();
    // 标签闪烁
    var times = 0;
    var content = '·';
    var timer = setInterval(function () {
        if (times === 10) {
            clearInterval(timer);
            timer = null;
            $('title').html('悄悄话');
            return;
        }
        if (times % 2 === 0) {
            $('title').html('您有信息 ^_^');
        } else {
            $('title').html(content);
            content += '·';
        }
        times++;
    }, 400);
}
// 设置阅后即焚
function setDestroy() {
    var type = $('[name=destroyType]:checked').val();
    var time = $('[name=destroyTime]').val();
    destroy.time = time;
    destroy.type = type;
}
// 设置按钮开关
function setCtrl() {
    $('.set').click(function () {
        $(".pop").fadeIn(); 
    });
    $('#saveBtn').click(function () {
        $(".pop").fadeOut(); 
        setDestroy();
        $('#msgInput').focus();
    })
}
// 焚毁消息
function destroyMsg(destroy, liId) {
    var time = destroy.time;
    var type = destroy.type;
    if (type === 'n') {
        return;
    }
    if (type === 'f') {
        time *= 60;
    }
    time *= 1000;
    var html = `<span class='destroyMsg'><i>匿了</i></span>`;
    // var timer = setTimeout(() => {
    //     $(liId).html(html);
    //     $(liId).addClass('destroyed');
    //     clearTimeout(timer);
    //     timer = null;
    // }, time);
    var timer = setTimeout(() => {
        $(liId).remove();
        clearTimeout(timer);
        timer = null;
    }, time);
}
// 关闭设置窗口
function Setpop() {
    $(".pop").click(function () {console.log(0)
        $(this).hide();
    });
    // 阻止冒泡
    $(".setBox").click(function (event) {
        window.event ? window.event.cancelBubble = true : e.stopPropagation();
    });
}
