$(function () {
  function getData(pno) {
    // type=ms :美食   type=yz :颜值
    var url = `https://douyu.xin88.top/api/room/list?page=${pno}&type=yz`

    $.get(url, data => {
      console.log(data)

      $('.list').html(
        data.data.list.map(value => {
          const { hn, nickname, roomName, roomSrc } = value

          return `<li>
          <div>
            <img src="${roomSrc}" alt="">
            <span class="hn">${hn}</span>
            <span class="nickname">${nickname}</span>
          </div>
          <p>${roomName}</p>
        </li>`
        })
      )

      // 分页
      const { nowPage, pageCount } = data.data

      $('.pages>ul').empty()

      let minPage = nowPage - 2
      let maxPage = nowPage + 2

      if (minPage < 1) {
        minPage = 1
        maxPage = minPage + 4
      }

      if (maxPage > pageCount) {
        maxPage = pageCount
        minPage = maxPage - 4
      }

      for (let i = minPage; i <= maxPage; i++) {
        $('.pages>ul').append(`<li class="${i == nowPage ? 'active' : ''}">${i}</li>`)
      }

      $(window).scrollTop(0)

      // 按钮的不可用状态:
      if (nowPage == 1) {
        // 设置按钮的 disabled 属性为 true
        // prop() : 操作系统属性
        $('.pages>.prev').prop('disabled', true)
      } else {
        $('.pages>.prev').prop('disabled', false)
      }

      // 简化:  不做判断, 直接把判定结果设置
      $('.pages>.next').prop('disabled', nowPage == pageCount)
    })
  }

  getData(1)

  $('.pages').on('click', 'li', function () {
    const pno = $(this).text()

    getData(pno)
  })

  // 上下页
  $('.pages>.next').click(function () {
    $('.pages li.active').next().click()
  })

  $('.pages>.prev').click(function () {
    $('.pages li.active').prev().click()
  })
})