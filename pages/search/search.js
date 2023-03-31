$(function () {
  // 关于分类:
  $('.sort>li').click(function () {
    $(this).addClass('active').siblings().removeClass('active')

    getData(1) // 重新获取第一页数据
  })


  const params = new URLSearchParams(location.search)
  const wd = params.get('wd')

  function getData(pno) {
    // 获取当前的 排序类型 的值, 用 data() 方法获取 data- 中的值
    var type = $('.sort>li.active').data('type') // data-type

    // 参数中的 kw : 用于向服务器传递 要搜索的商品关键词 - keyword
    var url = `https://serverms.xin88.top/mall/search?type=${type}&kw=${wd}&page=${pno}`

    console.log('url:', url) //如果有错误, 可以查看 kw的值对不对

    $.get(url, data => {
      console.log(data)

      $('.list').html(
        data.data.map(value => {
          const { name, pic, price, sale_count } = value

          // 让搜索的关键词高亮?
          // 思路: 字符串替换 -- replace
          // 例如: 搜索词: 豆      标题: 归田居 | 恩施小土豆5斤鸡蛋大小
          // 替换为: 归田居 | 恩施小土<span style="color:red;">豆</span>5斤鸡蛋大小
          const re = new RegExp(`(${wd})`, 'gi')

          const name_wd = name.replace(re, `<span style="color:red;">$1</span>`)

          return `<li>
          <img src="./assets/img/mall/${pic}" alt="">
          <div>
            <h3>${name_wd}</h3>
            <b>¥${price}</b>
            <span>销量:${sale_count}</span>
          </div>
        </li>`
        })
      )

      // 页数
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
        // 最大页数 小于5页, 则最小页数应该是1
        if (minPage < 1) minPage = 1
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