// fmt format
// RegExp
// []方括号用于查找某个范围内的字符 [^]范围以外的字符
export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    // RegExp.$n(n=1~9)属性用于返回正则表达式模式中某个子表达式匹配的文本
    // 正则表达式中每个小括号内的部分表达式就是一个子表达式
    // 虽然正则表达式模式中的小括号可以有任意多个，但是此属性只保存最前面的9个匹配文本
    // 这里的RegExp是全局对象，RegExp.$1...$9是全局属性。
    // 当执行任意正则表达式匹配操作时，JavaScript会自动更新全局对象RegExp上的全局属性，用以存储此次正则表达式模式的匹配结果。
    // 当再次执行正则表达式匹配时，RegExp上的全局属性又会更新，覆盖掉之前的数据，以反映本次正则表达式模式的匹配结果。
    // replace() 方法用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。
    // stringObject.replace(regexp/substr,replacement)
    // regexp/substr:必需。规定子字符串或要替换的模式的 RegExp 对象。请注意，如果该值是一个字符串，则将它作为要检索的直接量文本模式，而不是首先被转换为 RegExp 对象。
    // replacement: 必需。一个字符串值。规定了替换文本或生成替换文本的函数。
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    console.log(RegExp.$1);
    console.log(fmt);
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    console.log(k);
    console.log(`${k}`);
    // 重要的是用括号(),正则表达式中每个小括号内的部分表达式就是一个子表达式，没有括号的话，RegExp.$1不能返回子表达式的文本！
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
      // fmt = fmt.replace(RegExp.$1, str);
      console.log(fmt);
    }
  }
  // true~~~~~~~~~~~~
//   for (var k in o) {
//     if (new RegExp('(' + k + ')').test(fmt)) {
//       fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
//     }
//   }
//   return fmt;
};
// 左侧补零？？？
function padLeftZero (str) {
  console.log('???');
  // stringObject.substr(start,length)
  return ('00' + str).substr(str.length);
}
