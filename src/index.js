/*
 * @Description: 入口文件
 * @FilePath: \lvue\src\index.js
 * @Date: 2022-07-05 19:41:33
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-09 19:47:19
 * @author: Lin_kangjing
 */
import initData from './initData.js'
import mount from './compliler/index.js'
/**Vue构造函数
 * @param {object} options
 * @return {*}
 * @author: Lin_kangjing
 */
export default function Vue (options) {
  this._init(options)
}
/** 初始化配置对象
 * @param {object} options
 * @return {*}
 * @author: Lin_kangjing
 */
Vue.prototype._init= function  (options) {
  // 将options配置挂载到vue实例上
  this.$options = options
  // 初始化options.data
  initData(this)
  // 如果挂载点存在，调用$mount方法编译模板
  if(this.$options.el){
    this.$mount()
  }
}
/**编译节点
 * @return {*}
 * @author: Lin_kangjing
 */
Vue.prototype.$mount = function  () {
  mount(this)
}
