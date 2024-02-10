import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { Col, Offcanvas, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

const Cart = () => {
  const show = useSelector((state) => state.showCart);

  const cartContent = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  return (
    <Offcanvas
      show={show}
      placement="end"
      onHide={() => dispatch({ type: "SHOW_CART", payload: false })}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          Il tuo carrello <i className="bi bi-cart4 fs-5 ms-2 text-black"></i>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {cartContent.length === 0
          ? "Non hai prodotti nel carrello"
          : "Rivedi il tuo ordine"}
        {cartContent.length > 0 && (
          <Row>
            <Col>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
              >
                {cartContent.map((item, i) => {
                  return (
                    <div
                      key={i}
                      className="d-flex border border-1 rounded-3 my-3 p-2 align-items-center"
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
          </Row>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Cart;
