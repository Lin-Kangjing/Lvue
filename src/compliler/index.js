/*
 * @Description: 
 * @FilePath: \lvue\src\compliler\index.js
 * @Date: 2022-07-09 17:05:37
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-13 19:23:17
 * @author: Lin_kangjing
 */
import complileToFunction from './complileToFunction.js'
import mountComponent from './mountComponent.js'
/**编译器
 * @param {*} vm
 * @return {*}
 * @author: Lin_kangjing
 */
export default function mount (vm) {
  // 若果没有提供render选项，则编译生成render函数
  if(!vm.$options.render){
    let template =``
    if(vm.$options.template){
      // 存在模板
      template = vm.$options.template
    }else if(vm.$options.el){
      // 存在挂载点
      template = document.querySelector(vm.$options.el).outerHTML
      vm.$el = document.querySelector(vm.$options.el)
    }
    // 生成渲染函数
    const render = complileToFunction(template)
    // 将渲染函数挂载到$options上
    vm.$options.render = render
  }
  // 挂载组件
  mountComponent(vm)
}

