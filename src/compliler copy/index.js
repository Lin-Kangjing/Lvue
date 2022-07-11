import complileNode from './complileNode.js'
/**编译器
 * @param {*} vm
 * @return {*}
 * @author: Lin_kangjing
 */
export default function mount (vm) {
  let el = document.querySelector(vm.$options.el)
  complileNode(Array.from(el.childNodes),vm)
}
