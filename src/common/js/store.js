// 数据的存储
// parse()在接收服务器数据时一般是字符串。将字符串转化为JS对象
// stringify()向服务器发送数据时一般是字符串。将JS对象转化为字符串
export function saveToLocal (id, key, val) {
  // __私有
  // 原生JS无localStorage, 浏览器中window
  // 从服务器获取的seller是字符串
  let seller = window.localStorage.__seller__;
  if (!seller) {
    seller = {};
    seller[id] = {};
  } else {
    // 将从服务器获得的字符串seller转化成JS对象
    seller = JSON.parse(seller);
    if (!seller.id) {
      seller[id] = {};
    }
  }
  seller[id][key] = val;
  // 将添加后的sellerJS对象转化为字符串，并存储
  window.localStorage.__seller__ = JSON.stringify(seller);
};
// def对应key的val
export function loadFromLocal (id, key, def) {
  // seller 字符串
  let seller = window.localStorage.__seller__;
  if (!seller) {
    return def;
  }
  // seller字符串->JS对象->seller[id]JS对象
  seller = JSON.parse(seller)[id];
  if (!seller) {
    return def;
  }
  let ret = seller[key];
  return ret || def;
}
