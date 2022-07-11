/*
 * @Description: 
 * @FilePath: \lvue\src\compliler\compileTextNode.js
 * @Date: 2022-07-09 17:18:18
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-09 17:23:37
 * @author: Lin_kangjing
 */
import Watcher from '../watcher.js'
/**编译文本节点
 * @param {*} node
 * @param {*} vm
 * @return {*}
 * @author: Lin_kangjing
 */
export default function compileTextNode(node,vm){
  // <span>{{key}}</span>
  const key = RegExp.$1.trim()
  // 响应式数据key更新时，dep通知watcher执行update函数，cb会被调用
  function cb () {
    node.textContent = JSON.stringify(vm[key])
  }
  // 实例化Watcher，执行cb，（vm[key]）触发getter，进行依赖收集
  new Watcher(cb)
}