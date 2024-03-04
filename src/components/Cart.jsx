import { Alert, List } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Offcanvas, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import PaymentModal from "./PaymentModal";
import { evaluateError, getOrdersData } from "../functions";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const show = useSelector((state) => state.showCart);

  const [showCheckout, setShowCheckout] = useState(false);
  const darkMode = useSelector((state) => state.darkModeEnabled);

  const cartContent = useSelector((state) => state.cart);
  const restaurantData = useSelector((state) => state.restaurantSelected);

  const userData = localStorage.getItem("tokenUser");

  const navigate = useNavigate();

  const [isNewUser, setIsNewUser] = useState(false);

  const getOrdersByUser = () => {
    getOrdersData().then((res) => {
      if (typeof res !== "number") {
        if (res.length <= 0) {
          setIsNewUser(true);
        }
      } else {
        evaluateError(res, navigate, dispatch);
      }
    });
  };

  const [showConfirm, setShowConfirm] = useState(false);

  const [promoCodeInput, setPromoCodeInput] = useState("");
  const promoCode = "FOOD20YOU";

  const [promoCodeAccepted, setPromoCodeAccepted] = useState(false);

  const [backgroundColor, setBackgroundColor] = useState("background.paper");

  let payload = {
    productIds: [],
    restaurantId: restaurantData.id,
    isPromoCodePresent: promoCodeAccepted === true ? true : false,
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
    if (promoCodeAccepted === true) {
      const discount = total * 0.2;
      return total - discount.toFixed(2);
    } else {
      return total.toFixed(2);
    }
  };

  const total = setTotalOfCart();

  const dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      getOrdersByUser();
    }

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
              <h6 className="mt-3">
                Totale: {total} € <br></br>
                {promoCodeAccepted === true
                  ? "(Sconto del 20% con promo code)"
                  : ""}
              </h6>
            </Col>
            {isNewUser && (
              <Col className="my-3">
                <Form
                  className="d-flex align-items-center"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (promoCodeInput === promoCode) {
                      setPromoCodeAccepted(true);
                      setTotalOfCart();
                    } else {
                      setPromoCodeAccepted("error");
                      setTimeout(() => {
                        setPromoCodeAccepted(false);
                      }, 4000);
                    }
                  }}
                >
                  <div>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label>Hai un promo code?</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Digita un promocode"
                        onChange={(e) => {
                          setPromoCodeInput(e.target.value);
                        }}
                      />
                    </Form.Group>
                  </div>
                  {promoCodeAccepted === true ? (
                    <div className="success-animation d-flex justify-content-start mt-4 ms-4">
                      <svg
                        className="checkmark"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 52 52"
                      >
                        <circle
                          className="checkmark__circle"
                          cx="26"
                          cy="26"
                          r="25"
                          fill="none"
                        />
                        <path
                          className="checkmark__check"
                          fill="none"
                          d="M14.1 27.2l7.1 7.2 16.7-16.8"
                        />
                      </svg>
                    </div>
                  ) : promoCodeAccepted === false ? (
                    <Button
                      type="submit"
                      style={{ height: "38px" }}
                      className="align-self-end ms-2 rounded-4 btn-success"
                    >
                      Verifica
                    </Button>
                  ) : (
                    promoCodeAccepted === "error" && (
                      <div className="ui-error ms-3">
                        <svg
                          viewBox="0 0 87 87"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g
                            id="Page-1"
                            stroke="none"
                            stroke-width="1"
                            fill="none"
                            fill-rule="evenodd"
                          >
                            <g
                              id="Group-2"
                              transform="translate(2.000000, 2.000000)"
                            >
                              <circle
                                id="Oval-2"
                                stroke="rgba(252, 191, 191, .5)"
                                stroke-width="4"
                                cx="41.5"
                                cy="41.5"
                                r="41.5"
                              ></circle>
                              <circle
                                class="ui-error-circle"
                                stroke="#F74444"
                                stroke-width="4"
                                cx="41.5"
                                cy="41.5"
                                r="41.5"
                              ></circle>
                              <path
                                class="ui-error-line1"
                                d="M22.244224,22 L60.4279902,60.1837662"
                                id="Line"
                                stroke="#F74444"
                                stroke-width="3"
                                stroke-linecap="square"
                              ></path>
                              <path
                                class="ui-error-line2"
                                d="M60.755776,21 L23.244224,59.8443492"
                                id="Line"
                                stroke="#F74444"
                                stroke-width="3"
                                stroke-linecap="square"
                              ></path>
                            </g>
                          </g>
                        </svg>
                      </div>
                    )
                  )}
                </Form>
              </Col>
            )}

            <Col>
              <Button
                className="mt-2 drop-nav border-0 text-black shadow-card rounded-4"
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
