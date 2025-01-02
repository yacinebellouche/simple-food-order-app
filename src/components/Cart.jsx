import { useContext } from "react";
import CartContext from "../store/CartContext.jsx";
import Modal from "../UI/Modal.jsx";
import Button from "../UI/Button.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import CartTiem from "../UI/CartItem.jsx";

export default function Cart() {
  // we can also work with the use hook (note that use hook is moreflexible, for example we can work with the use hook inside conditions +v19)
  const { items, addItem, removeItem } = useContext(CartContext);
  const userProgressContext = useContext(UserProgressContext);

  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const formattedTotalPrice = `${totalPrice.toFixed(2)}`;
  function handleCloseModal() {
    userProgressContext.hideCart();
  }
  function handleGoToCheckout() {
    userProgressContext.showCheckout();
  }

  return (
    <>
      <Modal
        className="cart"
        open={userProgressContext.progress === "cart"}
        onClose={userProgressContext.progress === "cart" ? handleCloseModal : null}
      >
        <h2>Your Cart</h2>
        {items.length === 0 && <p>No items in cart!</p>}
        <ul>
          {items.map((item) => (
            <CartTiem
              key={item.id}
              name={item.name}
              quantity={item.quantity ?? 1}
              price={item.price}
              onIncrease={() => addItem(item)}
              onDecrease={() => removeItem(item.id)}
            />
          ))}
        </ul>
        <p className="cart-total">({formattedTotalPrice})</p>
        <p className="modal-actions">
          <Button onClick={handleCloseModal} textOnly>
            Close
          </Button>
          {items.length > 0 && (
            <Button onClick={handleGoToCheckout}>Go to Checkout</Button>
          )}
        </p>
      </Modal>
    </>
  );
}
