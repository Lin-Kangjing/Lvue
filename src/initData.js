/*
 * @Description: 初始化vue的data数据
 * @FilePath: \lvue\src\initData.js
 * @Date: 2022-07-05 19:50:48
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-09 10:03:38
 * @author: Lin_kangjing
 */
import observe from './observe.js'
import {proxy} from './utils.js'
/**
 * 1.初始化options.data
 * 2.代理data对象上的各个属性到vue实例上
 * 3.给data上的各个属性设置响应式能力
 * @param {object} vm
 * @return {*}
 * @author: Lin_kangjing
 */
export default function initData(vm){
  let {data} = vm.$options
  if(!data){
    vm._data = {}
  }else{
    vm._data= typeof data ==='function'?data():{}
  }
  // 把_data中的数据代理到vue实例上，可以实现this[data.key]访问，设置
  for(let key in vm._data){
    proxy(vm,'_data',key)
  }
  // 设置响应式
  observe(vm._data)
}