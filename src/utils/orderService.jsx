export const getOrders = () => {
  return JSON.parse(localStorage.getItem("orders")) || [];
};

export const saveOrders = (orders) => {
  localStorage.setItem("orders", JSON.stringify(orders));
};

export const createOrder = (order) => {
  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);
};

export const getOrdersByUser = (userId) => {
  const orders = getOrders();
  return orders.filter((order) => order.userId === userId);
};

export const cancelOrder = (orderId) => {
  const orders = getOrders();
  const updated = orders.map((o) =>
    o.orderId === orderId ? { ...o, status: "Cancelled" } : o,
  );
  saveOrders(updated);
};
