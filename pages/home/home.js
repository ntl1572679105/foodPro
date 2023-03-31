$(function () {
  var url = 'https://serverms.xin88.top/index'

  $.get(url, data => {
    console.log(data)
    // 头部的视频展示
    $('.top-video ul').html(
      data.hot_video.map(value => {
        const { mp4, vname } = value

        return `<li>
          <video src="./assets/video/${mp4}" preload="metadata"></video>
          <div>
            <i style="background-image: url('../../assets/img/979.png')"></i>
            <b>${vname}</b>
          </div>
        </li>`
      })
    )
    // 今日热搜
    $('.hot-search ul').html(
      data.today_hot.map(value => {
        const { name, emphasize } = value
        return `<li><a class="${emphasize ? 'active' : ''}" href="?p=search&wd=${name}">${name}</a></li>`
      })
    )
    // 今日三餐
    // 由于是 二维数组, 所以策略变更
    data.today_meal.forEach((value, index) => {
      const { cate_name, contents } = value

      $('.bar-title>ul').append(`<li class="${index == 0 ? 'active' : ''}">${cate_name}</li>`)

      // 遍历contents, 加入到 swiper 中
      contents.forEach(value => {
        const { desc, pic, title } = value

        $('.swiper-wrapper').append(`<div class="swiper-slide">
          <img src="./assets/img/food/${pic}" alt="">
          <b>${title}</b>
          <span>${desc}</span>
        </div>`)
      })
    })

    // index-items
    data.index_items.forEach(value => {
      const { title, items } = value

      // 把 items 数据转为 li 元素数组
      const lis = items.map(value => {
        const { author, desc, pic, title } = value

        return `<li>
          <div>
            <img src="./assets/img/food/${pic}" alt="">
            <span>${author}</span>
          </div>
          <b>${title}</b>
          <span class="line-1">${desc}</span>
        </li>`
      })

      // join(''): 把数组拼接为字符串, 中间用 空字符串 间隔; 默认是逗号间隔
      $('.index-items').append(`<div>
        <h2>${title}</h2>
        <ul>${lis.join('')}</ul>
      </div>`)
    })
  })

  // 视频是通过网络请求获取, 异步;  利用委托操作 动态新增元素的点击事件
  $('.top-video').on('click', 'li', function () {
    if ($(this).hasClass('active')) {
      $(this).removeClass('active')
        .siblings().removeClass('noactive')

      $(this).children().trigger('pause')
    } else {
      $(this).addClass('active').removeClass('noactive')
        .siblings().addClass('noactive').removeClass('active')

      $(this).children().trigger('play')
      $(this).siblings().children().trigger('pause')
    }
  })

  // 利用委托方式 为 今日三餐 的 li 增加点击事件
  $('.bar-title>ul').on('click', 'li', function () {
    $(this).addClass('active').siblings().removeClass('active')

    // 联动 swiper
    const i = $(this).index()
    mySwiper.slideTo(i * 3)
  })

  // swiper
  var mySwiper = new Swiper('.swiper', {
    // 每页3个, 3个一组, 空间10px
    slidesPerView: 3,
    slidesPerGroup: 3,
    spaceBetween: 10,
    on: {
      slideChange: function () {
        // alert('改变了，activeIndex为' + this.activeIndex);
        const i = this.activeIndex / 3
        $('.bar-title>ul>li').eq(i).addClass('active').siblings().removeClass('active')
      },
    },
  })


  // 用定时器, 切换 广告的激活状态
  setInterval(() => {
    // 切换: toggle    有则删, 无则加
    $('.banner').toggleClass('active')
  }, 4000);
})