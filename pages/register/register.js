// 注册 register.js
$(function () {
  // 当密码有修改时, 应该触发 再次验证密码 的验证操作, 即 blur 事件
  $('#pwd').change(function () {
    // 先触发 焦点, 为了清空之前的状态;  再触发 blur 重新验证
    $('#repwd').focus().blur()
  })


  // 再次输入密码
  $('#repwd')
    .blur(function () {
      const repwd = $('#repwd').val()

      if (repwd == '') return

      const pwd = $('#pwd').val()
      if (pwd == repwd) {
        $(this).next().children('.ok').show()
      } else {
        $(this).addClass('err').next().children('.err').show()
      }
    })
    .focus(function () {
      $(this).removeClass('err').next().children().hide()
    })

  // 密码的判定
  $('#pwd')
    .blur(function () {
      const pwd = $('#pwd').val()

      if (pwd == '') return //1. 没填值, 则不做判定

      if (pwd.length >= 6 && pwd.length <= 12) {
        // 正确格式
        $(this).next().children('.ok').show()
      } else {
        // 错误格式
        $(this).addClass('err').next().children('.err').show()
      }
    })
    .focus(function () {
      $(this).removeClass('err').next().children().hide()
    })


  // 手机号输入框 失去焦点时, 检查  && 获得焦点时, 隐藏之前的报错
  $('#phone')
    .blur(function () {
      const phone = $(this).val()

      // 输入框中 未输入值时, 不检测
      if (phone == '') return // return: 终止函数后续代码的执行

      // 1. 判断手机号格式是否正确
      if (/^1[3-9]\d{9}$/.test(phone) == false) {
        // 不正确: 输入框添加 err 样式 && 显示手机号格式错误
        $(this).addClass('err')
        $(this).next().children().eq(0).show()
      } else {
        // 手机号格式正确, 则需要验证是否已经注册过
        var url = 'https://serverms.xin88.top/users/checkPhone'
        // {phone}: 相当于 { phone: phone}
        $.post(url, { phone }, data => {
          console.log('data:', data)
          // code:200 不存在,可以注册;  
          if (data.code == 200) {
            // children('.ok'): 选择 子元素中 带有 class='ok' 的
            $(this).next().children('.ok').show()
          }

          // 202: 已存在, 不可注册
          if (data.code == 202) {
            $(this).addClass('err').next().children().eq(1).show()
          }
        })
      }
    })
    .focus(function () {
      // 获得焦点时, 把自身的报错样式隐藏;  下方元素的子元素 都藏起来
      $(this).removeClass('err').next().children().hide()
    })


  // 注册按钮
  $('button#register').click(function () {
    // 查看 是否已勾选 同意用户协议?
    // jQuery提供的表单元素选择器:   :checkbox  相当于属性选择器 [type=checkbox]
    const agree = $('.agree :checkbox').prop('checked')

    if (!agree) {
      alert("请勾选同意协议内容!")
      return //终止后续代码执行
    }

    // 必须三个输入框的验证结果都是正确的, 才能注册!
    // 即 p.ok 元素, 3个均可见状态
    if ($('.info p.ok:visible').length != 3) {
      alert("请确保所有信息均填写正确, 才能完成注册!!")
      return
    }

    // 获取 账号密码 输入框中的值
    const phone = $('#phone').val()

    const pwd = $('#pwd').val()

    // 网络请求的方式有多种, 最常见两类: GET(获取) 和 POST(传递)
    // 从语义上, GET适合从服务器获取数据, 对应 SQL的查询操作
    // POST 适合向服务器传递数据, 对应SQL 增删改 操作
    // 在实践中, 具体方式由 服务器人员 规定

    // 发送请求时的差别:
    // GET的参数:  请求地址?参数=值&参数=值...  和请求地址一起发
    // POST的参数: 请求地址 和 参数要分开发

    // post的三个参数: 请求地址, 请求参数, 回调函数
    var url = 'https://serverms.xin88.top/users/register'
    // 请求参数: 有两种格式可选 -- 字符串 或 对象
    // 字符串格式: 参数=值&参数=值..
    // 对象格式: {参数:值, 参数: 值}
    var params = `phone=${phone}&pwd=${pwd}`
    console.log('注册参数:', params)

    $.post(url, params, data => {
      console.log('注册结果:', data)

      if (data.code == 200) {
        alert("恭喜,注册成功! 即将跳转到登录页面")
        // 替换页面的地址:  替换操作是无法后退的
        location.replace('?p=login')
      } else {
        alert("很遗憾,注册失败! " + data.msg)
      }
    })
  })
})