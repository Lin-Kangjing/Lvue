/*
 * @Description: 
 * @FilePath: \lvue\src\compliler\renderHelper.js
 * @Date: 2022-07-13 19:29:18
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-13 19:39:36
 * @author: Lin_kangjing
 */

/**在vue实例上安装运行时的渲染帮助函数，_c,_v,这些函数会生成VNode
 * @param {*} target
 * @return {*}
 * @author: Lin_kangjing
 */
export default function renderHelper(target){
  target._c = createElement
  target._v = createTextNode
}
/**根据标签信息创建vNode
 * @param {*} tag
 * @param {*} attr
 * @param {*} children
 * @return {*}
 * @author: Lin_kangjing
 */
function createElement (tag,attr,children) {
  return VNode(tag,attr,children,this)
}
/**生成文本节点的VNode
 * @param {*} textAst
 * @return {*}
 * @author: Lin_kangjing
 */
function createTextNode (textAst) {
  return VNode(null,null,null,this,textAst)
}
/**生成VNode节点
 * @param {*} tag
 * @param {*} attr
 * @param {*} children
 * @param {*} context
 * @param {*} text
 * @return {*}VNode
 * @author: Lin_kangjing
 */
function VNode (tag,attr,children,context,text=null) {
  return {
    // 标签
    tag,
    // 属性map对象
    attr,
    // 父节点
    parent:null,
    // 子节点组成的VNode
    children,
    // 文本的ast对象
    text,
    // VNode对应真实节点
    elm:null,
    // vue实例
    context,
  }
}