/*
 * @Description:
 * @FilePath: \lvue\src\dep.js
 * @Date: 2022-07-09 10:25:25
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-09 13:42:17
 * @author: Lin_kangjing
 */
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
