import { Alert, List } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Offcanvas, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import PaymentModal from "./PaymentModal";

const Cart = () => {
  const show = useSelector((state) => state.showCart);

  const [showCheckout, setShowCheckout] = useState(false);
  const darkMode = useSelector((state) => state.darkModeEnabled);

  const cartContent = useSelector((state) => state.cart);
  const restaurantData = useSelector((state) => state.restaurantSelected);

  const [showConfirm, setShowConfirm] = useState(false);

  const [backgroundColor, setBackgroundColor] = useState("background.paper");

  let payload = {
    productIds: [],
    restaurantId: restaurantData.id,
  };

  const addItemsInPayload = () => {
    for (let i = 0; i < cartContent.length; i++) {
      for (let x = 0; x < cartContent[i].quantity; x++) {
        payload.productIds.push(cartContent[i].id);
      }
    }
    dispatch({ type: "SAVE_ORDER_PAYLOAD", payload: payload });
    setShowCheckout(true);
  };

  const setTotalOfCart = () => {
    let total = 0;
    for (let i = 0; i < cartContent.length; i++) {
      const singleItemPrice = cartContent[i].price * cartContent[i].quantity;
      total += singleItemPrice;
    }
    return total;
  };

  const total = setTotalOfCart();

  const dispatch = useDispatch();

  useEffect(() => {
    if (cartContent.length > 0) {
      setTotalOfCart();
    }
  }, []);

  useEffect(() => {
    setBackgroundColor(darkMode ? "background.black" : "background.paper");
  }, [darkMode]);

  return (
    <Offcanvas
      className={darkMode ? "bg-dark text-white" : ""}
      show={show}
      placement="end"
      onHide={() => dispatch({ type: "SHOW_CART", payload: false })}
    >
      <Offcanvas.Header closeButton data-bs-theme={darkMode ? "dark" : "light"}>
        <Offcanvas.Title>
          Il tuo carrello{" "}
          <i
            className={
              darkMode
                ? "bi bi-cart4 fs-5 ms-2 text-white"
                : "bi bi-cart4 fs-5 ms-2 text-black"
            }
          ></i>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {cartContent.length === 0
          ? "Non hai prodotti nel carrello"
          : "Rivedi il tuo ordine"}
        {cartContent.length > 0 && (
          <Row className="flex-column">
            <a
              className="m-0 mt-2 text-danger link-underline-danger pointer"
              onClick={() => {
                setShowConfirm(!showConfirm);
              }}
            >
              Svuota Carrello<i className="bi bi-trash3"></i>
            </a>
            {showConfirm && (
              <Alert
                variant="filled"
                severity="error"
                className="d-flex align-items-center shake"
              >
                Confermi di voler svuotare il carrello?
                <i
                  className="bi bi-check2-circle fs-3 ms-2 pointer"
                  onClick={() => {
                    dispatch({ type: "CLEAR_CART" });
                    setShowConfirm(false);
                  }}
                ></i>
                <i
                  className="bi bi-x-circle fs-3 ms-3 pointer"
                  onClick={() => {
                    setShowConfirm(false);
                  }}
                ></i>
              </Alert>
            )}

            <Col>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: backgroundColor,
                }}
              >
                {cartContent.map((item, i) => {
                  return (
                    <div
                      key={i}
                      className="d-flex border border-1 rounded-3 my-3 p-2 align-items-center mt-0"
                    >
                      <div className="w-25">
                        <img
                          src={item.imageUrl}
                          alt="item-img"
                          style={{ width: "80%" }}
                          className="rounded-circle"
                        />
                      </div>
                      <div>
                        <p className="m-0 fw-bold">{item.name}</p>
                        <p className="m-0">{item.price}€</p>
                        <p className="m-0">Quantità: {item.quantity}</p>
                      </div>
                      <div className="ms-auto">
                        <i
                          class="bi bi-x-circle fs-3 text-danger"
                          onClick={() => {
                            dispatch({
                              type: "REMOVE_FROM_CART",
                              payload: i,
                            });
                          }}
                        ></i>
                      </div>
                    </div>
                  );
                })}
              </List>
            </Col>
            <Col className="border-top mt-2">
              <h6 className="mt-3">Totale: {total} €</h6>
            </Col>
            <Col>
              <Button
                className="mt-2 drop-nav border-0 text-black shadow-card"
                onClick={() => {
                  addItemsInPayload();
                }}
              >
                Checkout
              </Button>
            </Col>
          </Row>
        )}
      </Offcanvas.Body>
      <PaymentModal
        show={showCheckout}
        setShow={() => {
          setShowCheckout(false);
        }}
        total={total}
      />
    </Offcanvas>
  );
};

export default Cart;
