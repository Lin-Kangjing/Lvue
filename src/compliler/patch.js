/*
 * @Description: 
 * @FilePath: \lvue\src\compliler\patch.js
 * @Date: 2022-07-13 19:47:27
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-13 20:44:38
 * @author: Lin_kangjing
 */
/**初始渲染和后续更新的入库
 * @param {*} oldVnode 老的vnode或者是挂载根节点
 * @param {*} vnode
 * @return {*}VNode的真实节点
 * @author: Lin_kangjing
 */
export default function patch(oldVnode, vnode) {
  if (oldVnode && !vnode) {
    // 老节点存在，新节点不存在，销毁组件
    return;
  }
  if (!oldVnode) {
    // oldVnode不存在，说明子组件首次渲染
    createElm(vnode);
  } else {
    // 真实节点，为根组件渲染
    if (oldVnode.nodeType) {
      const parent = vnode.parentNode;
      // 老vnode的下一个相邻节点
      const refNode = oldVnode.nextSibling;
      createElm(vnode,parent,refNode);
      parent.removeChild(oldVnode);
    }else {
      console.log('update')
    }
  }
  return vnode.elm
}

/**创建元素，如果有父元素，建立关联，并插到父元素内
 * @param {*} vnode
 * @param {*} parent 父节点
 * @param {*} refNode 下一个相邻节点
 * @return {*}
 * @author: Lin_kangjing
 */
function createElm (vnode,parent,refNode) {
  // 记录vnode的父节点
  vnode.parent = parent
  // 创建自定义组件，如果是非组件，则会继续后面的流程
  if(createComponent(vonde))return
  const {attr,children,text} = vnode
  // 只有文本节点有text
  if(text){
    // 创建文本节点，并插到父节点内
    vnode.elm = createTextNode(vnode)
  }else{
    // 元素节点
    vonde.elm = document.createElement(vnode.tag)
    // 给节点创建属性
    setAttribute(attr,vnode)
    // 递归创建子节点
    for (let i = 0,len = children.length; i < len; i++) {
      createElement(children[i],vnode.elm)
    }
  }
  // 如果存在parent，则将创建的节点插入到父节点内
  if(parent){
    const elm = vnode.elm
    if(refNode){
      parent.insertBefore(elm, refNode)
    }else{
      parent.appendChild(elm)
    }
  }


}

/**创建文本节点
 * @param {*} textVNode
 * @return {*}
 * @author: Lin_kangjing
 */
function createTextNode (textVNode) {
  let {text:textAst} = textVNode,textNode = null
  // 存在表达式 文本中有{{key}},则为响应式数据
  if(text.expression){
    const value = textVNode.context[text.expression]
    textNode = document.createTextNode(typeof value === 'object' ? JSON.stringify(value) : String(value))
  }else{
    // 普通文本节点
    textNode = document.createTextNode(text.text)
  }
  return textNode
}
function setAttribute (attr,vnode) {
  // 遍历属性如果是普通属性直接设置，如果是指令特殊处理
  for(let name in attr){
    if(name === 'vModel'){
      // 处理v-model指令
      const {tag,value} = attr.vModel
      setVModel(tag,value,vnode)
    }else if(name === 'vBind'){
      // 处理v-bind指令
      setVBind(vnode)
    }else if(name ==='vOn'){
      // 处理v-on指令
      setVOn(vnode)
    }else{
      // 普通属性
      vonde.elm.setAttribute(name,attr[name])
    }
  }
}
