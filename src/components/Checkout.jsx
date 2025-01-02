import { useContext } from "react";
import Modal from "../UI/Modal";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import CustomInput from "../UI/CustomInput";
import Button from "../UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import useFetch from "../hooks/useFetch";
import { useActionState } from "react";
const configRequest = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};
export default function Checkout() {
  const cartContext = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);
  const total = cartContext.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const { data, error, sendRequest, clearData } = useFetch(
    "http://localhost:3000/orders",
    configRequest
  );

  function handleCloseForm() {
    userProgressCtx.hideCheckout();
  }

  function handlefinish() {
    userProgressCtx.hideCheckout();
    cartContext.clearItems();
    clearData();
  }
  async function checkoutAction(prevState, fd) {
    const customerDetails = Object.fromEntries(fd.entries());
    await sendRequest(
      JSON.stringify({
        order: {
          items: cartContext.items,
          customer: customerDetails,
        },
      })
    );
  }

  const [formState, formAction, isSending] = useActionState(
    checkoutAction,
    null
  );

  let actions = (
    <>
      <Button onClick={handleCloseForm} type="button" textOnly>
        Close
      </Button>
      <Button>Submit Order</Button>
    </>
  );
  if (isSending) {
    actions = <span>Sending order data...</span>;
  }
  if (data && !error) {
    return (
      <Modal
        open={userProgressCtx.progress === "checkout"}
        onClose={handlefinish}
      >
        <h2>Success!</h2>
        <p>Your order was submitted successfully.</p>
        <p>
          We will get back to you with more details via email within the next
          few minutes
        </p>
        <p className="modal-actions">
          <Button onClick={handlefinish}>Okay</Button>
        </p>
      </Modal>
    );
  }
  return (
    <Modal
      open={userProgressCtx.progress === "checkout"}
      onClose={userProgressCtx.progress === "checkout" ? handleCloseForm : null}
    >
      <form action={formAction}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(total)}</p>
        <CustomInput label="Full Name" type="text" id="name" />
        <CustomInput label="E-Mail Address" type="email" id="email" />
        <CustomInput label="Street" type="text" id="street" />
        <div className="control-row">
          <CustomInput label="Postal Code" type="text" id="postal-code" />
          <CustomInput label="City" type="text" id="city" />
        </div>
        {error && <Error title="Failed to submit order" message={error} />}
        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}
