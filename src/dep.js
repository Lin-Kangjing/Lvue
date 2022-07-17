/*
 * @Description:
 * @FilePath: \lvue\src\dep.js
 * @Date: 2022-07-09 10:25:25
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-17 01:50:01
 * @author: Lin_kangjing
 */
// 存储所有的Dep.target
// 组件会产生一个渲染watcher,在渲染的过程中如果处理到用户watcher，如：
// computed计算属性，这时候会执行evalute =》get
// 假如直接复制Dep.target,那Dep.target的上一个值(渲染watcher就会丢失)
//造成computed计算属性之后的渲染忍得响应式数据无法完成依赖收集
const targetStack = []
/**备份本次传递进来的watcher，并将其复制给Dep.target
 * @param {*} target
 * @return {*}
 * @author: Lin_kangjing
 */
export function pushTarget(target){
  targetStack.push(target)
  Dep.target  = target
}
/**将 Dep.target 重置为上一个 Watcher 或者 null
 * @return {*}
 * @author: Lin_kangjing
 */
export function popTarget(){
  targetStack.pop()
  Dep.target  = targetStack[targetStack.length - 1]
}
/**vue1 中的key和dep是一一对应关系，举例说明:
 * new Vue({
 *  data(){
 *    return {
 *      a:0,
 *      b:1
 *    }
 *  }
 * })
 * data函数return的对象对应dep
 * 对象中的key：a,b分别对应一个dep
 * @return {*}
 * @author: Lin_kangjing
 */
export default function Dep() {
  // dep实例收集到的所有watcher
  this.watchers = [];
}
// target是Dep的静态属性，值为null或者watcher实例
// 在实例化Watcher时进行赋值为当代watcher实例，待依赖收集完成后再Watcher中重置为null
Dep.target = null;
/**收集watcher
 * 在发生读取操作是（vm.xx）并且Dep.target不为null时进行依赖收集
 * @return {*}
 * @author: Lin_kangjing
 */
Dep.prototype.depend = function () {
  // 防止重复收集watcher
  if (this.watchers.includes(Dep.target)) return;
  // 收集watcher实例
  this.watchers.push(Dep.target);
};
/**dep通知收集到的所有watcher执行更新
 * @return {*}
 * @author: Lin_kangjing
 */
Dep.prototype.notify = function () {
  for (const watcher of this.watchers) {
    watcher.update();
  }
};
