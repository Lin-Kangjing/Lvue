/*
 * @Description:
 * @FilePath: \lvue\src\asyncUpdateQueue.js
 * @Date: 2022-07-18 19:26:01
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-18 20:30:22
 * @author: Lin_kangjing
 */
// 存储本次更新的所有watcher
const queue = [];
// 标识着现在是否正在刷新队列（比如用户watcher的回调函数中更改了某个响应式数据,处理 watcher 渲染时，可能产生的新 watcher
let flushing = false;
// 标识 保证 callbacks 数组中只会有一个刷新（执行）watcher 队列的函数 让所有的 watcher 都在一个 tick 内进行更新。
let waiting = false;
// 存放着刷新watcher队列的函数，或者nextTick方法传递的函数
let callbacks = [];
// 标识浏览器当前任务队列中是否存在刷新(执行)callbacks数组的函数
let pending = false;

/**将watcher放入队列
 * @param {*} watcher
 * @return {*}
 * @author: Lin_kangjing
 */
export default function queueWatcher(watcher) {
  if (!queue.includes(watcher)) {
    if (!flushing) {
      queue.push(watcher);
    } else {
      // 正在刷新watcher队列（执行每一个watcher.run)
      let flag = false;
      // 这时的 watcher 队列时有序的(uid 由小到大)，需要保证当前 watcher 插入进去后仍然有序
      for (let i = queue.length - 1; i >= 0; i--) {
        if (queue[i].uid < watcher.uid) {
          queue.splice(i + 1, 0, watcher);
          flag = true;
          break;
        }
      }
      if (!flag) {
        // 说明上面的for循环没有找到比当前watcher.uid小的watcher，直接插入队首
        queue.unshift(watcher);
      }
    }
  }
  // 标识当前callbacks数组中还没有刷新（执行）watcher队列的函数
  if (!waiting) {
    waiting = true;
    nextTick(flushSchedulerQueue);
  }
}

/**负责刷新（执行）watcher队列的函数,由flushCallbacks函数调用
 * @return {*}
 * @author: Lin_kangjing
 */
function flushSchedulerQueue() {
  // 标识正在刷新（执行）watcher队列
  flushing = true;
  // 从小到大排列
  queue.sort((a, b) => a.uil - b.uid);
  while (queue.length) {
    // 取出队首并执行run
    const watcher = queue.shift();
    watcher.run();
  }
  //watcher queue队列已经刷新（执行）完毕
  // 标识当前callbacks数组中已经没有刷新（执行）watcher队列的函数了
  flushing = waiting = false;
}
/**将刷新（执行）watcher队列的函数或者Vue.nextTick会滴函数放进callbacks数组中，如果浏览器任务队列当前没有刷新callbacks的函数，则将flushCallbacks函数放进浏览器任务队列
 * @param {*} cn
 * @return {*}
 * @author: Lin_kangjing
 */
function nextTick(cb) {
  callbacks.push(cb);
  // 标识浏览器任务队列中没有刷新（执行）callbacks数组的函数
  if (!pending) {
    // flushCallbacks放进微任务队列中
    Promise.resolve().then(() => {
      flushCallbacks();
    });
    // 标识浏览器任务队列中已经有了刷新（执行）callbacks数组的函数了
    pending = true;
  }
}
function flushCallbacks() {
  // 浏览器任务队列中的flushCallbacks已经拿到执行栈了，新的flushCallbacks可以入列了
  pending = false;
  // 取出队列中的函数执行
  while (callbacks.length) {
    const cb = callbacks.shift();
    cb();
  }
}
