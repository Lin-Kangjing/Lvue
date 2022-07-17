import { isUnaryTag } from "../utils.js";
/**解析模板字符串，生成ast语法树
 * @param {*} template
 * @return {*} ast语法树
 * @author: Lin_kangjing
 */
export default function parse(template) {
  // 存放所有的未配对的开始标签的ast对象
  const stack = [];
  // 最终的ast语法树
  let root = null;
  let html = template;
  while (html.trim()) {
    // 过滤注释标签
    if (html.indexOf("<!--") === 0) {
      html = html.slice(html.indexOf("-->") + 3);
      continue;
    }
    // 匹配开始标签
    const startIdx = html.indexOf("<");
    if (startIdx === 0) {
      if (html.indexOf("</") === 0) {
        // 闭合标签
        parseEnd();
      } else {
        // 处理开始标签
        parseStartTag();
      }
    } else if (startIdx > 0) {
      // 说明在开始标签之间有一段文本内容，在html中找到下一个标签的开始位置
      const nextStartIdx = html.indexOf("<");
      if (stack.length) {
        processChars(html.slice(0, nextStartIdx));
      }
      html = html.slice(nextStartIdx);
    } else {
      // 没有匹配到开始标签，整个html是一段文本
    }
  }
  return root;
  /**处理开始标签
   * @return {*}
   * @author: Lin_kangjing
   */
  function parseStartTag() {
    // 开始标签结束位置
    const end = html.indexOf(">");
    // 开始标签里面的内容
    // <div id="app"></div> 中的 div id="app"
    const content = html.slice(1, end);
    // 将上面已解析的内容从html中去掉
    html = html.slice(end + 1);
    // 找到第一个空格的位置
    const firstSpaceIdx = content.indexOf(" ");
    let tagName = "",
      attrsStr = "";
    if (firstSpaceIdx === -1) {
      // 没有空格，则节点没有属性，类似：<div></div>
      tagName = content;
      attrsStr = "";
    } else {
      // <div id="app"></div>
      tagName = content.slice(0, firstSpaceIdx);
      // attrsStr为id="app"
      attrsStr = content.slice(firstSpaceIdx + 1);
    }
    // attrs属性组 [id="app"]
    const attrs = attrsStr ? attrsStr.split(" ") : [];
    // 解析attrs数组生成map对象
    const attrMap = parseAttrs(attrs);
    // 生成ast对象
    const elementAst = generateAST(tagName, attrMap);
    // root为空，则当前为模板第一个节点
    if (!root) {
      root = elementAst;
    }
    // 把开始标签的ast对象push到栈中，当遇到结束标签的时候将栈顶的ast对象pop出来
    stack.push(elementAst);
    // 自闭合标签，则直接调用end方法，进入闭合标签处理阶段
    if (isUnaryTag(tagName)) {
      processElement();
    }
  }
  /**处理结束标签
   * @return {*}
   * @author: Lin_kangjing
   */
  function parseEnd() {
    html = html.slice(html.indexOf(">") + 1);
    // 处理栈顶元素
    processElement();
  }
  /**处理文本
   * @param {*} text
   * @return {*}
   * @author: Lin_kangjing
   */
  function processChars(text) {
    if (!text.trim()) return;
    const textAst = {
      type: 3,
      text,
    };
    if (text.match(/{{(.*)}}/)) {
      // 说明表达式
      textAst.expression = RegExp.$1.trim();
    }
    // 放进栈顶元素中children中
    stack[stack.length - 1].children.push(textAst);
  }
  /**处理元素的闭合标签时会调用该方法。进一步处理元素上的个个属性，将处理结果放到attr属性上
   * @return {*}
   * @author: Lin_kangjing
   */
  function processElement() {
    // 栈顶的开始标签
    const curEle = stack.pop();
    const stackLen = stack.length;
    // 进一步处理ast对象中的rawAttr对象
    const { rawAttr } = curEle;
    // 将处理结果都放到attr对象上，并删除rawAttr对象中响应的属性
    curEle.attr = {};
    const propertyArr = Object.keys(rawAttr);

    // 处理指令
    // 处理v-model指令
    if (propertyArr.includes("v-model")) {
      processVModel(curEle);
    } else if (propertyArr.find((item) => item.match(/^v-bind:(.*)/))) {
      // 处理v-bind指令
      processVBind(curEle, RegExp.$1, rawAttr[`v-bind:${RegExp.$1}`]);
    } else if (propertyArr.find((item) => item.match(/^v-on:(.*)/))) {
      // 处理v-on指令
      processVOn(curEle, RegExp.$1, rawAttr[`v-on:${RegExp.$1}`]);
    }
    // 处理插槽内容
    processSlotContent(curEle);

    // 节点处理完毕以后让其和父节点关联
    if (stackLen) {
      stack[stackLen - 1].children.push(curEle);
      curEle.parent = stack[stackLen - 1];

      // 如果节点存在slotName,则说明节点是组件传递给插槽的内容
      if (curEle.slotName) {
        const {parent, slotName, scopeSlot, children } = curEle;
        const slotInfo = {
          slotName,
          scopeSlot,
          children: children.map((item) => {
            delete item.parent;
            return item;
          }),
        };
        if (parent.rawAttr.scopedSlots) {
          parent.rawAttr.scopedSlots[curEle.slotName] = slotInfo;
        } else {
          paren.rawAttr.scopedSlots = { [curEle.slotName]: slotInfo }
        }
      }
    }
  }
}
/**解析属性数组，得到一个{attrName:attrValue}对象
 * @param {array} attrs [id="app"]
 * @return {object}{attrName:attrValue}
 * @author: Lin_kangjing
 */
function parseAttrs(attrs) {
  const attrMap = {};
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    const [attrName, attrValue] = attr.split("=");
    attrMap[attrName] = attrValue.replace(/"/g, "");
  }
  return attrMap;
}
/**生成AST对象
 * @param {*} tagName
 * @param {*} attrMap
 * @return {*}
 * @author: Lin_kangjing
 */
function generateAST(tagName, attrMap) {
  return {
    // 元素节点
    type: 1,
    // 标签名
    tag: tagName,
    // 原始属性，后续还要进一步处理
    rawAttr: attrMap,
    // 子节点
    children: [],
  };
}
/**处理v-model指令，将处理结果直接放到curEle对象上
 * @param {*} curEle
 * @return {*}
 * @author: Lin_kangjing
 */
function processVModel(curEle) {
  const { tag, rawAttr, attr } = curEle;
  const { type, "v-model": vModelVal } = curEle;
  if (tag === "input") {
    if (/text/.test(type)) {
      // <input type="text" v-model="value" />
      attr.vModel = { tag, type: "text", value: vModelVal };
    } else if (/checkbox/.test(type)) {
      // <input type="checkbox" v-model="value" />
      attr.vModel = { tag, type: "checkbox", value: vModelVal };
    }
  } else if (tag === "textarea") {
    // <textarea v-model="value" />
    attr.vModel = { tag, value: vModelVal };
  } else if (tag === "select") {
    // <select v-model="selectedValue">...</select>
    attr.vModel = { tag, value: vModelVal };
  }
}
/**处理v-bind指令
 * @param {*} curEle
 * @param {*} bindKey v-bind:key 中的 key
 * @param {*} bindVal v-bind:key = val 中的 val
 * @return {*}
 * @author: Lin_kangjing
 */
function processVBind(curEle, bindKey, bindVal) {
  curEle.attr.vBind = { [bindKey]: bindVal };
}
/**处理v-on指令
 * @param {*} curEle
 * @param {*} vOnKey
 * @param {*} vOnVal
 * @return {*}
 * @author: Lin_kangjing
 */
function processVOn(curEle, vOnKey, vOnVal) {
  curEle.attr.vOn = { [vOnKey]: vOnVal };
}
/**处理插槽
 * <scope-slot>
 *   <template v-slot:default="scopeSlot">
 *     <div>{{ scopeSlot }}</div>
 *   </template>
 * </scope-slot>
 * @param {*} elAst
 * @return {*}
 * @author: Lin_kangjing
 */
function processSlotContent(elAst) {
  // 具有v-slot:xx属性的template只能是组件的根元素，这里不做判断
  if (elAst.tag === "template") {
    const attrMap = elAst.rawAttr;
    for (const key of attrMap) {
      if (key.match(/v-slot:(.*)/)) {
        // 说明template上有v-slot标签
        const slotName = (elAst.slotName = RegExp.$1);
        elAst.scopeSlot = attrMap[`v-slot:${slotName}`];
        return;
      }
    }
  }
}
