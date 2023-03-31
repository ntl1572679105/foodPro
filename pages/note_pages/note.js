$(function () {
  // page number : 页的 数量
  // number : No.1  
  function getData(pno) {
    var url = 'https://serverms.xin88.top/note?page=' + pno

    $.get(url, data => {
      console.log(data)

      $('.list').html(
        data.data.map(value => {
          const { cover, favorite, head_icon, name, title } = value

          return `<li>
        <img src="./assets/img/note/${cover}" alt="">
        <div>
          <p class="line-2">${title}</p>
          <div>
            <div>
              <img src="./assets/img/note/${head_icon}" alt="">
              <span>${name}</span>
            </div>
            <span>${favorite}</span>
          </div>
        </div>
      </li>`
        })
      )

      //分页
      const { page, pageCount } = data

      $('.pages>ul').empty()

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

      $(window).scrollTop(0)

      $('.pages>.next').prop('disabled', page == pageCount)
      $('.pages>.prev').prop('disabled', page == 1)
    })
  }

  getData(1)

  $('.pages').on('click', 'li', function () {
    getData($(this).text())
  })

  $('.pages>.next').click(function () {
    $('.pages li.active').next().click()
  })

  $('.pages>.prev').click(function () {
    $('.pages li.active').prev().click()
  })
})