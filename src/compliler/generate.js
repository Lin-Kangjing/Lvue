/*
 * @Description:
 * @FilePath: \lvue\src\compliler\generate.js
 * @Date: 2022-07-10 16:29:27
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-16 16:01:56
 * @author: Lin_kangjing
 */
/**从ast生成函数
 * @param {*} ast
 * @return {*}
 * @author: Lin_kangjing
 */
export default function generate(ast) {
  // 字符串形式的渲染函数
  const renderStr = genElement(ast);
  // with为渲染函数扩展作用域
  return new Function(`with(this){ return ${renderStr}}`);
}
/**解析ast生成渲染函数的字符串
 * @param {*} ast
 * @return {*}
 * @author: Lin_kangjing
 */
function genElement(ast) {
  const { tag, rawAttr, attr } = ast;
  const attrs = { ...rawAttr, ...attr };
  const children = genChildren(ast);
  // 生成插槽处理函数
  // if(tag ==='slot'){
  //   return `_t(${JSON.stringify(attrs)},[${children}])`
  // }
  // 生成vnode的可执行方法
  return `_c("${tag}",${JSON.stringify(attrs)},[${children}])`;
}
/**处理ast子节点，将子节点编程渲染函数
 * @param {*} ast
 * @return {*}
 * @author: Lin_kangjing
 */
function genChildren (ast) {
  const ret = [],{children} = ast;
  for (let i = 0,len = children.length; i < len; i++) {
    const child = children[i];
    if(child.type ===3){
      // 文本节点
      ret.push(`_v(${JSON.stringify(child)})`)
    }else if(child.type===1){
      // 元素节点
      ret.push(genElement(child))
    }
  }
  return ret
}
