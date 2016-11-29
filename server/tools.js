const reA = /[^a-zA-Z]/g;
const reN = /[^0-9]/g;
function sortAlphaNum(a, b) {
  a = a.name.toLowerCase();
  b = b.name.toLowerCase();

  const AInt = parseInt(a, 10);
  const BInt = parseInt(b, 10);

  if (isNaN(AInt) && isNaN(BInt)) {
    const aA = a.replace(reA, "");
    const bA = b.replace(reA, "");
    if (aA === bA) {
      const aN = parseInt(a.replace(reN, ""), 10);
      const bN = parseInt(b.replace(reN, ""), 10);
      return aN === bN ? 0 : aN > bN ? 1 : -1;
    } else {
      return aA > bA ? 1 : -1;
    }
  } else if (isNaN(AInt)) { //A is not an Int
    return 1; //to make alphanumeric sort first return -1 here
  } else if (isNaN(BInt)) { //B is not an Int
    return -1; //to make alphanumeric sort first return 1 here
  } else {
    return AInt > BInt ? 1 : -1;
  }
}

module.exports = {
  data: {
    name: 'bikes',
    children: []
  },

  _sort(array) {
    array.sort(sortAlphaNum);

    array.forEach((value) => {
      if (value.children !== undefined) {
        this._sort(value.children);
      }
    });
  },

  sort() {
    this._sort(this.data.children);
  },

  // Insert data to a given path
  insertTo(path, value) {
    let node = this.data;

    path.split('.').forEach((key) => {
      const found = node.children.some((child) => {
        if (child.name === key) {
          node = child;
          return true;
        }
      });

      if (!found) {
        const index = node.children.push({
          name: key,
          children: []
        });
        node = node.children[index - 1];
      }
    });
    delete node.children;
    node.data = value;
  }
};
