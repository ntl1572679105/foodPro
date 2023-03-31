$(function () {
  // 获取用户的信息
  let user = sessionStorage.getItem('user') || localStorage.getItem('user')
  user = JSON.parse(user)

  // 把用户信息 显示到对应的 元素中
  const { nickname, phone, created, avatar, id } = user

  // avatar: 头像地址, 不一定是否存在; 利用逻辑或 短路语法, 为 avatar 提供默认值
  $('#my-photo>div>img').prop('src', avatar || './assets/img/user_unknown.png')


  $('#nickname').text(nickname)
  $('#phone').text(phone)

  $('#created').text(
    moment(created).format('YYYY/MM/DD HH:mm:ss')
  )


  $('.sidemenu li').click(function () {
    $(this).addClass('active').siblings().removeClass('active')

    //根据当前项序号, 找到右侧对应的详情元素, 切换显示状态
    const i = $(this).index()

    $('.content>div').eq(i).show().siblings().hide()
  })

  // 初始化时, 触发一次 侧边栏中 激活项目的点击事件
  $('.sidemenu li.active').click()

  // 退出
  $('button#logout').click(function () {
    // 登录的判定条件: WebStorage中是否存储了 user 信息
    // 退出: 删除user信息即可
    sessionStorage.removeItem('user') // 短期存储
    localStorage.removeItem('user') // 上期存储

    location.replace('?p=home')
  })

  // 头像相关
  var url = 'https://serverms.xin88.top/users/head_photos'
  $.get(url, data => {
    console.log(data)

    $('#my-photo>div>ul').html(
      data.hero.map(value => {
        const { alias, selectAudio } = value

        return `<li><img data-ausrc="${selectAudio}" src="https://game.gtimg.cn/images/lol/act/img/champion/${alias}.png" alt=""></li>`
      })
    )
  })


  //全局音频播放器
  const au = new Audio()

  $('#my-photo').on('click', 'li>img', function () {
    // prop
    // 获取点击的图片的 src 
    const src1 = $(this).prop('src')
    // 设置给 头像
    $('#my-photo>div>img').prop('src', src1)

    // 读取绑定的音频地址:
    const ausrc = $(this).data('ausrc') //读取 data- 属性
    au.src = ausrc
    au.play()
  })


  // 头像修改 确定按钮:
  $('#my-photo>div>button').click(function () {
    var url = 'https://serverms.xin88.top/users/head_photo'

    const alias = $('#my-photo>div>img').prop('src')

    $.post(url, { id, alias }, data => {
      console.log('上传结果:', data)
      if (data.code == 200) {
        alert("头像更新成功")

        // 1. 把本地缓存中的数据项进行更新
        user.avatar = alias
        // 重新设置到缓存里
        // 判断当前是 长期存储 还是 短期存储
        if (sessionStorage.getItem('user')) {
          sessionStorage.setItem('user', JSON.stringify(user))
        }
        if (localStorage.getItem('user')) {
          localStorage.setItem('user', JSON.stringify(user))
        }

        // 2. 头部的图片进行更新
        $('.user>img').prop('src', alias)
      } else {
        alert("头像更新失败")
      }
    })
  })
})