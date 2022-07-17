/*
 * @Description: 
 * @FilePath: \lvue\src\compliler\complileToFunction.js
 * @Date: 2022-07-09 21:50:06
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-16 19:12:33
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
  // console.log(ast)
  const render = generate(ast)
  // console.log(render)
  return render
}
