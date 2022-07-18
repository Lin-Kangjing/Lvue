/*
 * @Description:
 * @FilePath: \lvue\src\watcher.js
 * @Date: 2022-07-09 13:16:53
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-18 20:34:52
 * @author: Lin_kangjing
 */
import { pushTarget, popTarget } from "./dep.js";
import queueWatcher from './asyncUpdateQueue.js'
/**watcher,渲染Dom和computed和watch都是使用Watcher
 * @param {function} cb
 * @return {*}
 * @author: Lin_kangjing
 */
let uid = 0
// 实质上computed watcher中的依赖收集并没有写在这里面
export default function Watcher(cb, options = {}, vm = null) {
  this.uid = uid++
  this._cb = cb;
  // 计算属性的值
  this.value = null;
  // 标记当前回调函数在本次渲染周期内是否已经执行过了
  this.lazy = options.lazy;
  this.dirty = !!options.lazy;
  // vue实例
  this.vm = vm || (!options.lazy && this.get());
}

/**响应式数据更新是，dep通知watcher执行update方法，让update方式执行this._cb函数执行对应的更新
 * @return {*}
 * @author: Lin_kangjing
 */
Watcher.prototype.update = function () {
  // 这是没写异步队列更新之前的写法
  // 通过 Promise，将 this._cb 的执行放到 this.dirty = true 的后面
  // 否则，在点击按钮时，computed 属性的第一次计算会无法执行，
  // 属性 counter
  // 计算属性
  // doubleCounter() {  （fn1）
  //   return this.counter * 2
  // }
  // 改变属性counter的时候，会触发渲染watcher更新，
  // 这时候 doubleCounter watcher中的dirty 依然是上一次的false（因为还没执行到oubleCounter watcher 的update），
  // 当oubleCounter watcher update 的时候 设置 this.dirty = true,然后执行 this._cb()（即为执行 fn1 ），没有触发evalute 方法，
  // 所以第一次点击按钮的时候 doubleCounter值不变
  // 所以使用了promise将 this._cb();放进微任务队列中稍后执行
  // Promise.resolve().then(() => {
  //   this._cb.apply(this.vm);
  // });
  //  将 dirty 置为 true，可以让 computedGetter 执行时重新计算 computed 回调函数的执行结果
  // 当再次获取 计算属性 时就可以重新执行 evalute 方法获取最新的值了
  // if (this.lazy) this.dirty = true;
  // 有了异步队列更新之后的写法
  if(this.lazy){
    this.dirty = true
  }else{
    // 将watcher放入异步队列中
    queueWatcher(this)
  }
};
/**执行watcher的cb函数，执行时进行依赖收集
 * @return {*}
 * @author: Lin_kangjing
 */
Watcher.prototype.get = function () {
  // 设置Dep.target
  pushTarget(this);
  this.value = this._cb.apply(this.vm);
  popTarget();
};
/**通知执行计算属性回调函数
 * @return {*}
 * @author: Lin_kangjing
 */
Watcher.prototype.evalute = function () {
  this.get();
  this.dirty = false;
};
/**由刷新watcher队列的函数调用，负责执行watcher.get方法
 * @return {*}
 * @author: Lin_kangjing
 */
Watcher.prototype.run = function () {
  // 其实还有其他处理，watcher options中的watcher,这里就不写了
  this.get();
}
