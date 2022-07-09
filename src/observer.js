/*
 * @Description: 
 * @FilePath: \lvue\src\observer.js
 * @Date: 2022-07-06 19:05:07
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-09 13:35:07
 * @author: Lin_kangjing
 */
import Dep from './dep.js'
import protoArgument from './protoArgument.js'
import defineReactive from './defineReactive.js'
import observe from './observe.js'

/**为对象或者数组设置响应式
 * @param {object} value 需要响应式的对象
 * @return {*}
 * @author: Lin_kangjing
 */
export default function Observer(value){
  // 为对象本身设置一个dep，方便在更新对象本身是使用，比如 数组通知依赖更新时就会用到
  this.dep = new Dep()
  Object.defineProperty(value,'__ob__',{
    value:this,
    enumerable:false,
    writable:true,
    configurable:true
  })
  if(Array.isArray(value)){
    protoArgument(value)
    this.observeArray(value)
  }else{
    this.walk(value)
  }
}
/**遍历对象的每一个属性，为这些属性设置getter，setter拦截
 * @param {object} obj
 * @return {*}
 * @author: Lin_kangjing
 */
Observer.prototype.walk = function(obj){
  for(let key in obj){
    defineReactive(obj,key,obj[key])
  }
}
/**遍历数组的每一个元素，为这些元素设置getter，setter拦截,其实是为了处理元素对象的情况
 * @param {array} arr
 * @return {*}
 * @author: Lin_kangjing
 */
Observer.prototype.observeArray = function(arr){
  for(let item of arr){
    observe(item)
  }
}