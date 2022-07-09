/*
 * @Description: 
 * @FilePath: \lvue\src\compliler\complileNode.js
 * @Date: 2022-07-09 17:09:00
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-09 19:48:37
 * @author: Lin_kangjing
 */
import compileAttribute from './compileAttribute.js'
import compileTextNode from './compileTextNode.js'
/**递归编译整棵树节点
 * @param {ArrayBuffer} nodes
 * @param {*} vm
 * @return {*}
 * @author: Lin_kangjing
 */
export default function compileNode(nodes, vm) {
  for (let i = 0, len = nodes.length; i < len; i++) {
    const node = nodes[i];
    if (node.nodeType === 1) {
      // 元素节点
      compileAttribute(node, vm);
      // 递归编译子节点
      compileNode(Array.from(node.childNodes), vm);
    } else if (node.nodeType === 3 && node.textContent.match(/{{(.*)}}/)) {
      // 编译文本节点
      compileTextNode(node, vm);
    }
  }
}
