$(function () {
  // 根据本地存储的 user 信息, 来判定当前的登录状态
  // 存在user 说明登录;  不存在 说明没登录过

  // 由于 user 可能存储在不同的位置, 会话 或 本地
  // 所以利用 逻辑短路 逻辑或语法;  从左向右 读取第一个有值的
  let user = sessionStorage.getItem('user') || localStorage.getItem('user')
  // 因为存储的是 JSON字符串, 必须解析后使用
  user = JSON.parse(user)

  if (user) {
    // 设置头部栏的头像
    $('.user>img').prop('src', user.avatar || './assets/img/user_unknown.png')

    // prev(): 上一个元素
    $('.user').show().prev().hide()
    // 设置用户名
    $('.user>a').html(user.phone)
  } else {
    $('.user').hide().prev().show()
  }


  // 读取路径中的 参数 wd, 把值作为输入框的默认值
  const params = new URLSearchParams(location.search)
  const wd = params.get('wd')
  $('.search>input').val(wd) // val(值): 相当于 .value = 值

  // 如何让网页上的内容, 在刷新后不消失?
  // 方案1: 通过 url 地址栏的参数 来保存这些值


  $('.search>button').click(function () {
    // 读取 输入框中的值, 拼接到路径中
    var wd = $('.search>input').val()  // val() : 读取 value 属性

    // 通过代码 修改 地址栏的地址
    // url格式: ?参数=值&参数=值
    location.assign('?p=search&wd=' + wd)
  })

  // 输入框 按回车时, 触发搜索
  // keyup: 按键抬起
  $('.search>input').keyup(function (e) {
    // 分辨出 回车按钮
    // 事件参数中的 keyCode 代表当前按键的编号, 其中 13 属于回车
    if (e.keyCode == 13) {
      // next(): 下一个兄弟元素, 即 按钮
      // click(): 没有参数, 作用是 触发事件
      $(this).next().click()
    }
  })


  // logo动画
  setInterval(() => {
    $('#logo').addClass('animate__rubberBand')
  }, 4000);

  // 动画结束时, 删除动画类;  便于下次添加
  $('#logo').on('animationend', function () {
    $(this).removeClass('animate__rubberBand')
  })
})