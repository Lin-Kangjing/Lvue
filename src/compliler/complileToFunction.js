/*
 * @Description: 
 * @FilePath: \lvue\src\compliler\complileToFunction.js
 * @Date: 2022-07-09 21:50:06
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-10 16:54:37
 * @author: Lin_kangjing
 */
import parse from './parse.js'
import generate from './generate.js'
/**解析模板字符串，得到ast语法树
 * @param {string} template
 * @return {*} render
 * @author: Lin_kangjing
 */
export default function complileToFunction(template) {
  const ast = parse(template)
  const render = generate(ast)
  return render
}
