module.exports = {
  checkIfMoveAllowed(dir, pos, bounding) {
    if (dir === "left") {
      return pos > 20 ? true : false;
    }
    if (dir === "right") {
      return pos < bounding - 20 ? true : false;
    }
    if (dir === "up") {
      return pos > 20 ? true : false;
    }
    if (dir === "down") {
      return pos < bounding - 20 ? true : false;
    }
  }
};
