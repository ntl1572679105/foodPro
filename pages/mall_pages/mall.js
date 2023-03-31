$(function () {
  function getData(pno) {
    var url = 'https://serverms.xin88.top/mall?page=' + pno

    $.get(url, data => {
      console.log(data)

      $('.list').html(
        data.data.map(value => {
          const { name, pic, price, sale_count } = value

          return `<li>
            <img src="./assets/img/mall/${pic}" alt="">
            <p class="line-2">${name}</p>
            <div>
              <b>¥${price}</b>
              <span>月售${sale_count}</span>
            </div>
          </li>`
        })
      )

      // 分页
      const { page, pageCount } = data

      //清空
      $('.pages>ul').empty()

      // 最多5页
      let minPage = page - 2
      let maxPage = page + 2

      if (minPage < 1) {
        minPage = 1
        maxPage = minPage + 4
      }

      if (maxPage > pageCount) {
        maxPage = pageCount
        minPage = maxPage - 4
      }

      for (let i = minPage; i <= maxPage; i++) {
        $('.pages>ul').append(`<li class="${i == page ? 'active' : ''}">${i}</li>`)
      }

      // 手动回调顶部
      $(window).scrollTop(0)

      // 在首页 和 最后一页 隐藏
      page == 1 ? $('.pages>.prev').hide() : $('.pages>.prev').show()

      page == pageCount ? $('.pages>.next').hide() : $('.pages>.next').show()
    })
  }

  getData(1)

  // 委托方式:
  $('.pages').on('click', 'li', function () {
    const pno = $(this).text() // 点击栏目上的文本 - 页数
    getData(pno)
  })

  // 下一页 和 上一页
  $('.pages>.next').click(function () {
    $('.pages li.active').next().click()
  })

  $('.pages>.prev').click(function () {
    $('.pages li.active').prev().click()
  })


})