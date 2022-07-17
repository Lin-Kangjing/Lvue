/*
 * @Description:
 * @FilePath: \lvue\src\compliler\patch.js
 * @Date: 2022-07-13 19:47:27
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-16 20:13:01
 * @author: Lin_kangjing
 */
import Vue from '../index.js'
import { isReserveTag } from "../utils.js";
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
      const parent = oldVnode.parentNode;
      // 老vnode的下一个相邻节点
      const refNode = oldVnode.nextSibling;
      createElm(vnode, parent, refNode);
      parent.removeChild(oldVnode);
    } else {
      // console.log("update");
      patchVnode(oldVnode,vnode);
    }
  }
  return vnode.elm;
}

/**判断两个节点是否相同
 * @param {*} node
 * @param {*} node2
 * @return {*}
 * @author: Lin_kangjing
 */
function sameVNode (node,node2) {
  // 其实还有其他的判断的，这里就不写了
  return node.key == node2.key && node.tag === node2.tag
}
/**对比子节点，找出不同点，将不通电更新到老节点上
 * @param {*} ch vnode子节点
 * @param {*} oldCh oldVnode子节点
 * @return {*}
 * @author: Lin_kangjing
 */
function updateChildren (ch,oldCh) {
  // 声明四个游标
  // 新节点开始引索
  let newStartIdx = 0
  // 新节点结束引索
  let newEndIdx = ch.length-1
  // 老节点开始引索
  let oldStartIdx = 0
  // 老节点结束引索
  let oldEndIdx = oldCh.length-1


  // 遍历新老节点
  while(newStartIdx <= newEndIdx && oldStartIdx <=oldEndIdx){
    // 新老开始，结束节点
    const newStartNode = ch[newStartIdx]
    const newEndNode = ch[newEndIdx]
    const oldStartNode = oldCh[oldStartIdx]
    const oldEndNode = oldCh[oldEndIdx]
    // 双端对比
    // 新老节点 开始节点对比
    if(sameVNode(newStartNode, oldStartNode)){
      patchVnode(oldStartNode,newStartNode )
      // 移动游标
      newStartIdx++
      oldStartIdx++
    }else if(sameVNode(newStartNode,oldEndNode)){
      // 新开始节点，老结束节点对比
      patchVnode(oldEndNode,newStartNode)
      // 将老借宿移动到新开始的位置
      oldEndNode.elm.parentNode.insertBefore(oldEndNode.elm,oldCh[newStartIdx].elm)
      // 移动游标
      newStartIdx++
      oldEndIdx--
    }else if(sameVNode(newEndNode,oldStartNode)){
      // 新结束，老开始 对比
      patchVnode(oldStartNode,newEndNode)
      // 将老节点移动到新结束的位置
      oldStartNode.elm.parentNode.insertBefore(oldStartNode.elm,oldCh[newEndIdx].nextSibling)
      // 移动游标
      newEndIdx--
      oldStartIdx++
    }else if(sameVNode(newEndNode,oldEndNode)){
      // 新结束，老结束
      patchVnode(oldEndNode,newEndNode)
      // 移动游标
      newEndIdx--
      oldEndIdx--
    }else{
      // 上面双端对比情况都不正确，遍历找到相同的元素
    }
  }

  // 跳出循环，说明ch或者oldCn有一个先遍历完了

  // 这种情况是oldCh先遍历结束了
  if(newStartIdx<newEndIdx){
    //todo 把成渝的ch添加到dom中
  }
  // 这种情况是ch先遍历完了
  if(oldStartIdx <oldEndIdx){
    //将剩余的oldCh从dom中删除
  }
}
/**对比新老节点，找出其中的不同，然后更新老节点
 * @param {*} oldVnode
 * @param {*} vnode
 * @return {*}
 * @author: Lin_kangjing
 */
function patchVnode (oldVnode,vnode) {
  if(oldVnode === vnode){
    console.log({vnode})
    return
  }
  vnode.elm = oldVnode.elm
  // 找出新老节点的子节点
  const ch = vnode.children
  const oldCh = oldVnode.children

  // 新节点不是文本节点
  if(!vnode.text){    
    if(ch && oldCh){
      // 更新子节点
      updateChildren(ch,oldCh)
    }else if(ch){
      // 老节点没有子节点，新节点有子节点
      // todo 增加子节点
    }else{
      // 新节点没有子节点
      //todo 删除子节点
    }
  }else{
    // 新节点是文本节点
    const expression = vnode.text.expression
    if(expression){
      // 存在响应式数据
      const  value = JSON.stringify(vnode.context[expression])
      try{
        const oldValue = oldVnode.elm.textContent
        if(value !==oldValue){
          oldVnode.elm.textContent = value
        }
      }catch(e){
        // 防止更新时遇到插槽，导致报错
        // 目前不处理插槽数据的响应式更新
      }
    }
    
  }

}
/**创建元素，如果有父元素，建立关联，并插到父元素内
 * @param {*} vnode
 * @param {*} parent 父节点
 * @param {*} refNode 下一个相邻节点
 * @return {*}
 * @author: Lin_kangjing
 */
function createElm(vnode, parent, refNode) {
  // 记录vnode的父节点
  vnode.parent = parent;
  // 创建自定义组件，如果是非组件，则会继续后面的流程
  if (createComponent(vnode)) return;
  const { attr, children, text } = vnode;
  // 只有文本节点有text
  if (text) {
    // 创建文本节点，并插到父节点内
    vnode.elm = createTextNode(vnode);
  } else {
    // 元素节点
    vnode.elm = document.createElement(vnode.tag);
    // 给节点创建属性
    setAttribute(attr, vnode);
    // 递归创建子节点
    for (let i = 0, len = children.length; i < len; i++) {
      createElm(children[i], vnode.elm);
    }
  }
  // 如果存在parent，则将创建的节点插入到父节点内
  if (parent) {
    const elm = vnode.elm;
    if (refNode) {
      parent.insertBefore(elm, refNode);
    } else {
      parent.appendChild(elm);
    }
  }
}

/**创建文本节点
 * @param {*} textVNode
 * @return {*}
 * @author: Lin_kangjing
 */
function createTextNode(textVNode) {
  let { text: textAst } = textVNode,
    textNode = null;
  // 存在表达式 文本中有{{key}},则为响应式数据
  if (textAst.expression) {
    const value = textVNode.context[textAst.expression];
    textNode = document.createTextNode(
      typeof value === "object" ? JSON.stringify(value) : String(value)
    );
  } else {
    // 普通文本节点
    textNode = document.createTextNode(textAst.text);
  }
  return textNode;
}
/**给节点设置属性
 * @param {*} attr
 * @param {*} vnode
 * @return {*}
 * @author: Lin_kangjing
 */
function setAttribute(attr, vnode) {
  // 遍历属性如果是普通属性直接设置，如果是指令特殊处理
  for (let name in attr) {
    if (name === "vModel") {
      // 处理v-model指令
      const { tag, value } = attr[name];
      setVModel(tag, value, vnode);
    } else if (name === "vBind") {
      // 处理v-bind指令
      setVBind(vnode);
    } else if (name === "vOn") {
      // 处理v-on指令
      setVOn(vnode);
    } else {
      // 普通属性
      vnode.elm.setAttribute(name, attr[name]);
    }
  }
}
/**v-model的原理
 * @param {*} tag
 * @param {*} value
 * @param {*} vnode
 * @return {*}
 * @author: Lin_kangjing
 */
function setVModel(tag, value, vnode) {
  const { context: vm, elm } = vnode;
  if (tag === "select") {
    // 如果不用Promise.resolve,option节点元素还没创建
    Promise.resolve().then(() => {
      elm.value = vm[value];
    });
    elm.addEventListener("change", function () {
      vm[value] = elm[value];
    });
  } else if (tag === "input" && vnode.elm.type === "text") {
    // 文本框<input v-model="value" type="text" />
    elm.value = vm[value];
    elm.addEventListener("input", function () {
      vm[value] = elm[value];
    });
  } else if (tag === "input" && vnode.elm.type === "checkbox") {
    // 选择框，<input type="checkbox" />
    elm.checked = vm[value];
    elm.addEventListener("change", function () {
      vm[value] = elm.checked;
    });
  }
}
/**v-bind原理
 * @param {*} vnode
 * @return {*}
 * @author: Lin_kangjing
 */
function setVBind(vnode) {
  const {
    attr: { vBind },
    elm,
    context: vm,
  } = vnode;
  for (let attrName in vBind) {
    elm.setAttribute(attrName, vm[vBind[attrName]]);
    elm.removeAttribute(`v-bind:${attrName}`);
  }
}
/**v-on原理
 * @param {*} vnode
 * @return {*}
 * @author: Lin_kangjing
 */
function setVOn(vnode) {
  const {
    attr: { vOn },
    elm,
    context: vm,
  } = vnode;
  for (let eventName in vOn) {
    elm.addEventListener(eventName, function (...args) {
      vm.$options.methods[vOn[eventName]].apply(vm, args);
    });
  }
}

function createComponent(vnode) {
  // 不是保留节点，说明是组件
  if (vnode.tag && !isReserveTag(vnode.tag)) {
    // 获取组件配置
    const {
      tag,
      context: {
        $options: { components },
      },
    } = vnode;
    // console.log({components})
    // console.log({tag})
    const compOptions = components[tag];
    // 创建组件实例
    const compIns = new Vue(compOptions);

    compIns._parentVnode = vnode;
    // 挂载子组件
    compIns.$mount();
    // 记录子组件vnode的父节点信息
    compIns._vnode.parent = vnode.parent;
    // 将子组件添加到父节点内
    vnode.parent.appendChild(compIns._vnode.elm);
    return true;
  }
}
