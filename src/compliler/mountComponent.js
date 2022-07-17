/*
 * @Description: 
 * @FilePath: \lvue\src\compliler\mountComponent.js
 * @Date: 2022-07-13 19:23:12
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-16 20:13:05
 * @author: Lin_kangjing
 */
import Vue from '../index.js'
import Watcher from '../watcher.js'
export default function mountComponent(vm){
  // 更新组件的函数
  const updateComponent =()=>{
    // console.log(vm._render())
    vm._update(vm._render())
  }
  // 实例化一个渲染watcher（一个组件只有一个渲染watcher）,当响应式数据更新时，这个更新函数会被机智
  new Watcher(updateComponent)
}

/**执行vm.$options.render函数
 * @return {*}
 * @author: Lin_kangjing
 */
Vue.prototype._render = function(){
  // 给render函数绑定this上下文为vue实例
  return this.$options.render.apply(this)
}

Vue.prototype._update = function(vnode){
  // 久的虚拟节点
  const prevVNode = this._vnode
  // 新的虚拟节点
  this._vnode = vnode
  if(!prevVNode){
    // 老vnode不存在，为首次渲染根组件或子组件
    this.$el = this.__patch__(this.$el,vnode)
  }else{
    // 后续更新组件或，走这里
    // debugger
    this.$el = this.__patch__(prevVNode
      ,vnode)
  }
}