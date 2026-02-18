import { cancelOrder } from "../utils/orderService";

const CancelOrderButton = ({ order }) => {
  if (order.status !== "Placed") return null;

  return (
    <button
      onClick={() => {
        cancelOrder(order.orderId);
        window.location.reload();
      }}
      className="mt-4 bg-red-600 text-white px-4 py-2"
    >
      Cancel Order
    </button>
  );
};

export default CancelOrderButton;
