// video.js
// $(函数): 监听DOM加载完毕后, 再执行

$(function () {
  // 下一页
  $('.pages>.next').click(function () {
    // 当前激活页的下一页
    $('.pages li.active').next().click()
  })
  // 上一页: 上一个元素 prev()
  $('.pages>.prev').click(function () {
    $('.pages li.active').prev().click()
  })



  // 请求的代码需要复用, page会变化 -- 函数封装
  function getData(pno) {
    var url = 'https://serverms.xin88.top/video?page=' + pno

    $.get(url, data => {
      console.log(data)

      $('.list').html(
        data.data.map(value => {
          // 解构出数据, 便于后续的 html 中拼接
          const { duration, pic, title, views } = value

          return `<li>
          <div>
            <img src="./assets/img/video/${pic}" alt="">
            <div>
              <span>${views}次播放</span>
              <span>${duration}</span>
            </div>
          </div>
          <p>${title}</p>
        </li>`
        })
      )

      // 分页相关:
      const { page, pageCount } = data

      // 网络图默认的高度是0, 当请求完毕后才会按照 图片的比例, 计算出自身的高度
      // 当请求新的页数时, 整个页面高度很小, 有一种回到顶部的感觉
      // 由于浏览器自带的缓存功能, 会把下载过的图片临时存储在本地, 而本地图片使用时, 高度就是图片的高度, 所以页面不会有变化
      // 统一效果: 
      // 方案1: 给图片一个固定的高度
      // 方案2: 统一回到顶部

      // scrollTop: 滚动到顶部; 参数代表具体离顶部多远, 单位px
      $(window).scrollTop(0)

      // 先清空旧的页数信息,再添加新的
      $('.pages>ul').empty() //empty(): 删除所有子元素

      // 生成页数

      // 保持最多五页(难!)
      let minPage = page - 2
      let maxPage = page + 2

      // minPage 极限值 1
      if (minPage < 1) {
        minPage = 1
        maxPage = minPage + 4
      }

      // maxPage 极限值 是总页数, 即 pageCount 
      if (maxPage > pageCount) {
        maxPage = pageCount
        minPage = pageCount - 4
      }

      for (let i = minPage; i <= maxPage; i++) {
        // 生成页数时, 判断当前添加的页数 是否为当前页, 如果是就添加激活样式
        $('.pages>ul').append(`<li class="${i == page ? 'active' : ''}">${i}</li>`)
      }

      // 在生成页数后, 再查询这些页数, 绑定点击事件
      $('.pages li').click(function () {
        var pno = $(this).text() // 获取 li 上的文本, 即页数
        getData(pno)
      })

      // 根据当前页 来调整 上一页和下一页按钮的显示状态
      if (page == 1) {
        $('.pages>.prev').hide()
      } else {
        $('.pages>.prev').show()
      }

      if (page == pageCount) {
        $('.pages>.next').hide()
      } else {
        $('.pages>.next').show()
      }
    })
  }

  // 初始化: 获取第一页数据
  getData(1)

  // 这些页数的li元素, 是请求完毕后 利用 for循环动态新增的
  // 如何给 动态新增 的元素添加事件?
  // 委托模式: 基于 事件冒泡机制, 让一直存在的 .pages 元素帮 li 处理事件
  // on: 专门绑定委托事件; 
  // 参数1: 事件名   参数2: 当事元素
  // $('.pages').on('click', 'li', function () {
  //   console.log(333);
  //   // li元素的 内容, 就是页数
  //   var pno = $(this).text()
  //   getData(pno)
  // })

})