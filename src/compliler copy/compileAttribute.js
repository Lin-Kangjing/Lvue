
import Watcher from '../watcher.js'
/**编译属性节点
 * @param {*} node
 * @param {*} vm
 * @return {*}
 * @author: Lin_kangjing
 */
export default function compileAttribute (node,vm) {
  const attrs = Array.from(node.attributes);
  for (const attr of attrs) {
    const {name,value} = attr
    if(name.match(/v-on:click/)){
      // 编译v-on:click指令
      compileVOnClick(node,value,vm)
    }else if(name.match(/v-bind:(.*)/)){
      // v-bind
      compileVBind(node,value,vm)
    }else if(name.match(/v-model/)){
      // v-model
      compileVModel(node,value,vm)
    }
  }
}
/**编译v-on:click指令事件
 * @param {*} node
 * @param {*} method
 * @param {*} vm
 * @return {*}
 * @author: Lin_kangjing
 */
function compileVOnClick (node,method,vm) {
  node.addEventListener('click',function(...args){
    vm.$options.methods[method].apply(vm,args)
  })
}
/**编译v-bind指令
 * @param {*} node
 * @param {*} attrValue
 * @param {*} vm
 * @return {*}
 * @author: Lin_kangjing
 */
function compileVBind (node,attrValue,vm) {
  const attrName = RegExp.$1
  node.removeAttribute(`v-bind:${attrName}`)
  // 响应式数据key更新时，dep通知watcher执行update函数，cb会被调用
  function cb(){
    node.setAttribute(attrName,vm[attrValue])
  }
  // 实例化Watcher，执行cb，（vm[key]）触发getter，进行依赖收集
  new Watcher(cb)
}
/**编译v-model指令
 * @param {*} node
 * @param {*} key
 * @param {*} vm
 * @return {*}
 * @author: Lin_kangjing
 */
function compileVModel (node,key,vm) {  
  // 节点标签名，input type类型
  let {tagName,type} = node
  tagName = tagName.toLowerCase()
  if(tagName==='input' && type ==='text'){
    // <input type="text" v-model="value"></input>
    // 设置input的值
    node.value = vm[key]
    // 给节点添加input事件，input事件触发时更改响应式数据的值
    node.addEventListener('input',function(){
      vm[key] = node.value
    })
  }else if(tagName==='input' && type==='checkbox'){
    // <input type="checkbox" v-model="value" />
    node.checked = vm[key]
    // 双向绑定语法糖
    node.addEventListener('change',function(){
      vm[key] = node.checked
    })
  }else if(tagName==='select'){
    // <select v-model="value"></select>
    node.value = vm[key]
    // 双向绑定语法糖
    node.addEventListener('change',function(){
      vm[key]  = node.value
    })
  }
}