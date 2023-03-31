$(function () {
  let nowPage = 1

  // 加锁:
  let lock = false

  function getData(pno) {
    if (lock) return

    // 如果 .nomore 可见, 不再发请求
    if ($('.nomore:visible').length == 1) return

    lock = true

    // type=ms :美食   type=yz :颜值
    var url = `https://douyu.xin88.top/api/room/list?page=${pno}&type=yz`

    $.get(url, data => {
      lock = false

      console.log(data)

      $('.list').append(
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
      // 解构时, 可以为元素声明 别名
      // {属性名: 别名}  -- 解决重名的问题
      const { nowPage: page, pageCount } = data.data

      nowPage = page

      // 解决1页数量过少的问题:  首次加载时  额外加载第二页
      if (page == 1) getData(2)

      if (page == pageCount) {
        $('.loadmore').hide()
        $('.nomore').show()
      } else {
        $('.loadmore').show()
        $('.nomore').hide()
      }
    })
  }

  getData(1)

  // 触底
  $(window).scroll(function () {
    const y = $(window).scrollTop()

    const dom_h = $(document).height()
    const win_h = $(window).height()

    if (y > dom_h - win_h - 300) {
      getData(nowPage + 1)
    }
  })

})