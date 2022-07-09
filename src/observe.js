/*
 * @Description: 
 * @FilePath: \lvue\src\observe.js
 * @Date: 2022-07-06 19:01:02
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-09 10:04:16
 * @author: Lin_kangjing
 */
import Observer from './observer.js'
/**
 * @description: 为对象设置响应式能力
 * @param {*} value
 * @return {object} Observer实例
 * @author: Lin_kangjing
 */
export default function observe(value) {
  if (typeof value !== "object") return;
  // 如果value.__ob__存在，说明value已经具备响应式能力了，直接返回响应式对象
  if (value.__ob__) return value.__ob__;
  return new Observer(value)
}
