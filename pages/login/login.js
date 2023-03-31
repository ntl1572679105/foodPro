$(function () {

  $('button#login').click(function () {
    const phone = $('#phone').val()
    const pwd = $('#pwd').val()

    var url = 'https://serverms.xin88.top/users/login'
    // 请求参数的格式2, 对象方式: {属性名:值, 属性名:值..}
    // var params = { phone: phone, pwd: pwd }

    // 人为制造巧合: 变量名和参数名 相同, 则可以合写
    var params = { phone, pwd }
    console.log('params:', params)

    $.post(url, params, data => {
      console.log('登录结果:', data)

      if (data.code == 200) {
        alert("登录成功!")
        // 根据用户的勾选---下次自动登录; 来选择把用户信息存放在哪里(会话,本地)
        const autologin = $('#autologin').prop('checked')

        if (autologin) {
          // 下次自动登录, 说明是长期存储
          localStorage.setItem('user', JSON.stringify(data.data))
        } else {
          // 短期存储
          sessionStorage.setItem('user', JSON.stringify(data.data))
        }

        location.replace('?p=home')
      } else {
        alert("登录失败, 请检查账号密码!")
      }
    })
  })

})