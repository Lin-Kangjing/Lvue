/*
 * @Description: 入口文件
 * @FilePath: \lvue\src\index.js
 * @Date: 2022-07-05 19:41:33
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-17 01:20:12
 * @author: Lin_kangjing
 */
import initData from './initData.js'
import initComputed from './initComputed.js'
import mount from './compliler/index.js'
import renderHelper from './compliler/renderHelper.js'
import patch from './compliler/patch.js'
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
  // 初始化计算属性
  initComputed(this)
  // 安装运行时的渲染工具函数
  renderHelper(this)
  // 在实例上安装patch函数
  this.__patch__ = patch
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
