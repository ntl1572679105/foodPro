$(function () {
  // 用变量保存当前页数
  let nowPage = 1
  // 通过加锁的方式, 保证 同一个页数的请求 只能发送一次
  // 类似上厕所: 先查看是否上锁, 锁-则不做事; 没有锁-进门+锁门
  // 完事之后, 把锁打开
  let lock = false // 锁的状态: 初始false 代表未锁

  function getData(pno) {
    // 判断 : 如果锁定为真, 则不做事
    if (lock) return

    // 记录 当前是否还有更多数据
    // 判定方式: 如果 .nomore 元素 处于可见状态, 就说明没有更多数据了
    // 则不应该再发新的请求

    // 查询 .nomore 元素, 条件为: 可见的
    // length: 读取查询结果的个数; 如果是 1 个, 就说明存在可见的
    // 可见 就说明 没有更多数据, 则直接返回, 不再发送请求
    if ($('.nomore:visible').length == 1) return

    lock = true // 正常执行时, 则先锁定

    var url = 'https://serverms.xin88.top/mall?page=' + pno
    // 网络请求完毕后, 把锁打开
    $.get(url, data => {
      lock = false //未锁定

      console.log(data)

      // html: 覆盖 替换
      // append: 累加 拼接
      $('.list').append(
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

      // 分页相关:
      const { page, pageCount } = data

      nowPage = page // 更新当前页

      // 当前页 == 总页数 ,说明最后一页, 显示没有更多; 否则 加载中
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

  // 触底监听:
  $(window).scroll(function () {
    // 滚动偏移量
    const y = $(window).scrollTop()
    // 窗口高
    const win_h = $(window).height()
    // 内容高
    const dom_h = $(document).height()
    // 判断触底, 提前300px 触发触底
    if (y > dom_h - win_h - 300) {
      // alert("触底 加载更多数据!")

      getData(nowPage + 1) //当前页+1
    }
  })
})