exports.emptyCart = (query, userId) => {
  query.findOneAndUpdate(
    { userId },
    {
      $set: { items: [], totalItems: 0, totalPrice: 0, totalQuantity: 0 },
    },
    { new: true }
  );
  return query;
};

exports.updateUtil = (key, query, ind) => {
  if (key === 0 || query.items[ind].quantity === 1) {
    if (key === 0) {
      query.totalPrice -= query.items[ind].price * query.items[ind].quantity;
      query.totalQuantity -= query.items[ind].quantity;
    } else {
      query.totalPrice -= query.items[ind].price;
      query.totalQuantity--;
    }
    query.items.splice(ind, 1);
    query.totalItems = query.items.length;
  } else {
    query.items[ind].quantity--;
    query.totalPrice -= query.items[ind].price;
    query.totalQuantity--;
    // query.totalItems = query.items.length;
  }
  return query;
};

exports.addToCart = (query, ind, items) => {
  if (ind > -1) {
    userCart.items[ind].quantity++;
  } else {
    userCart.items.push(items);
    userCart.totalItems++;
  }
  userCart.totalPrice += product.price;
  userCart.totalQuantity++;
  return userCart;
};
