$(function () {
  // 计算某个元素 底部的位置信息
  function offset_bottom(elem) {
    const h = $(elem).height()
    const top = $(elem).css('top') // 读取结果带有px单位, 例如: '12px'
    // 先去掉 px 单位, 即 '12px' -> 12
    // parseInt('12px') -> 12
    return parseInt(top) + h
  }



  let nowPage = 1

  // 加锁: 防止网络卡顿情况下, 滚动事件多次触发, 导致同一个页面多次被请求
  let lock = false

  // page number : 页的 数量
  // number : No.1  
  function getData(pno) {
    // 检查锁的状态
    if (lock) return

    // 查看 .nomore 元素是否可见, 如果可见 说明没有更多, 则不请求数据
    if ($('.nomore:visible').length == 1) return

    lock = true

    var url = 'https://serverms.xin88.top/note?page=' + pno

    $.get(url, data => {
      lock = false

      console.log(data)

      // 图片分本地 和 网络 图两种
      // 本地图片: 默认的宽高 就是图片本身 -- 因为读取速度快
      // 网络图: 需要通过网络下载 -- 下载完成之前, 图片高度是0; 下载完毕后才有高度

      // 当前的情况: 在进行展示时, 就要布局; 不能等到图片下载完毕后再布局
      // 两段式的布局 会消耗系统的性能
      // 1. 网络请求完成前, 显示出的布局 -- 属于浪费的操作
      // 2. 图片请求完毕后, 需要重新布局  
      // 解决方案: 让服务器直接传递图片的宽高数据

      $('.list').append(
        data.data.map(value => {
          // 服务器返回的宽高, 是图片的原有宽高
          const { cover, favorite, head_icon, name, title, width, height } = value

          // 图片显示的宽度 243
          // 计算出 图片显示的高度
          const img_h = 243 * height / width

          return `<li>
            <img style="height:${img_h}px;" src="./assets/img/note/${cover}" alt="">
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

      // 数组: 存放每一列中, 摆放在最下方的那个元素
      const xia_arr = []

      // 查询到所有的li元素, 挨个进行位置的调整
      // jQuery: 提供了 each 方法, 用于遍历查询到的元素
      // 参数1: 当前元素的序号    参数2: 当前遍历的元素
      // 形参名随意   element元素 -> 缩写 elem
      $('.list>li').each((index, elem) => {
        console.log(index, elem)

        // 读取元素的宽度
        const w = $(elem).width()

        // 第一排: 有4个元素, 序号 0 1 2 3
        if (index < 4) {
          // $(元素) : 把元素封装成 jQuery 类型的对象
          // 利用 css({属性名:值, 属性名:值}) 设置元素的 style 
          $(elem).css({ top: 0, left: index * w + index * 10 })
          // 第一排属于首行, 添加到数组中
          xia_arr.push(elem)
        } else {
          // 第二排开始, 要先查询 已有元素中, 底部最矮的元素
          // forEach: 数组的遍历语法;  参数1:元素  参数2:序号

          // 求最小的思路: 先假设第一个元素最小
          var min_el = xia_arr[0]

          xia_arr.forEach((el, i) => {
            console.log('底部的位置:', offset_bottom(el))
            // 用 临时的最小元素 和 当前遍历的元素 相比较, 看看谁更小
            if (offset_bottom(el) < offset_bottom(min_el)) {
              // 如果当前遍历元素 比 临时的最小元素 还要小; 则覆盖当前最小元素
              min_el = el
            }
          })

          // 把当前遍历的元素 放在 找到的这个最小元素的下方
          $(elem).css({
            left: $(min_el).css('left'),
            top: offset_bottom(min_el) + 10
          })

          // 当最小元素所在列 添加新的元素之后, 从 xia_arr 中替换掉 这一列的最小元素
          // 数组的 splice(序号, 个数, 新元素)
          // 从 指定序号位置, 删除指定个数个元素, 添加新的元素进入

          // 找到 最小元素 在 xia_arr 中的序号
          const i = xia_arr.indexOf(min_el)
          // 从序号 i 位置, 删除1个元素 - 即最小元素;  把当前遍历的元素加入
          xia_arr.splice(i, 1, elem)
        }
      })

      // 最后: 由于 ul 标签中的所有子元素都是 绝对定位, 导致其父元素的高度丢失!
      // 需要手动计算: 查看最下方的那个子元素的 底部的位置, 设置成 ul 的高度

      // 晚上的扩展作业:  完成此功能
      // $('.list').height( 最下方元素的底部位置 )

      // 假设 第一个元素 最大
      var max_el = xia_arr[0]
      // 遍历查找, 是否有更大的
      xia_arr.forEach(el => {
        // 如果: 当前遍历元素 比 当前最大元素 更大
        if (offset_bottom(el) > offset_bottom(max_el)) {
          max_el = el //替换掉 当前最大元素
        }
      })
      // 设置 ul 标签的高度, 为最大元素的 底部位置
      $('.list').height(offset_bottom(max_el))


      //分页
      const { page, pageCount } = data

      nowPage = page //更新当前页

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

  // 触底检测
  $(window).scroll(function () {
    // 滚动距离
    const y = $(window).scrollTop()
    // 窗口高度
    const win_h = $(window).height()
    // 内容高度
    const dom_h = $(document).height()
    // 提前 200 像素触发触底
    if (y > dom_h - win_h - 200) {
      getData(nowPage + 1)
    }
  })

})