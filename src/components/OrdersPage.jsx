import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getOrdersData } from "../functions";

const OrdersPage = () => {
  const [orders, setOrders] = useState(null);

  const darkMode = useSelector((state) => state.darkModeEnabled);

  const [orderSelected, setOrderSelected] = useState(null);

  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const [filterBy, setFilterBy] = useState("id");

  const dispatch = useDispatch();

  const [rotate, setRotate] = useState(false);

  const [orderFilter, setOrderFilter] = useState("asc");

  const getOrders = () => {
    getOrdersData().then((res) => {
      if (res) {
        switch (filterBy) {
          case "id": {
            if (orderFilter === "asc") {
              res.sort((a, b) => a.id - b.id);
              break;
            } else {
              res.sort((a, b) => b.id - a.id);
              break;
            }
          }
          case "data": {
            if (orderFilter === "asc") {
              res.sort((a, b) => {
                return a.orderTime.localeCompare(b.orderTime);
              });
            } else {
              res.sort((a, b) => {
                return b.orderTime.localeCompare(a.orderTime);
              });
            }

            break;
          }
          case "totale": {
            if (orderFilter === "asc") {
              res.sort((a, b) => a.totalAmount - b.totalAmount);
            } else {
              res.sort((a, b) => b.totalAmount - a.totalAmount);
            }

            break;
          }
          case "stato": {
            res.sort((a, b) => a.orderStatus - b.orderStatus);
            break;
          }
          default: {
            return res;
          }
        }

        setOrders(res);
      } else {
        navigate("bad_request");
      }
    });
  };
  const generatePDFContent = (order) => {
    let content = `Fattura\n\n`;
    content += `Dettagli ordine N. ${order.id}\n`;
    content += `---------------------------------------\n`;
    content += `Ristorante: ${order.restaurant.name}\n`;
    content += `Data: ${order.orderTime}\n\n`;
    content += `Prodotti:\n`;
    order.productList.forEach((product) => {
      content += `${product.name}: ${product.price}€\n`;
    });
    content += `---------------------------------------\n`;
    content += `\nTotale: ${order.totalAmount}€ \n`;
    content += `---------------------------------------\n`;
    content += `Grazie per averci scelto!\n`;
    return content;
  };

  const downloadPDF = (body) => {
    const content = generatePDFContent(orderSelected);
    const pdf = new jsPDF();
    pdf.text(content, 10, 10);
    pdf.save("fattura_N_" + body.id + "_" + body.user.username + ".pdf");
  };

  useEffect(() => {
    getOrders();
    window.scrollTo(0, 0);
  }, [filterBy, orderFilter]);

  return (
    <Container
      fluid
      data-bs-theme={darkMode ? "dark" : "light"}
      className={darkMode ? "bg-black text-white" : ""}
    >
      {orders && (
        <Row
          className={
            darkMode
              ? "mt-0 py-4 bg-black justify-content-center"
              : "mt-0 py-4 justify-content-center"
          }
        >
          <h2 className="text-center">
            {orders.length <= 0 ? "Non hai alcun ordine" : "I tuoi ordini "}
            <i className="fs-4 bi bi-bag ms-2"></i>
          </h2>
          <Col className="col-8 d-flex align-items-center">
            <Form.Select
              aria-label="Default select example"
              onChange={(e) => {
                setFilterBy(e.target.value);
              }}
            >
              <option value="id">Filtra per</option>
              <option value="id">ID</option>
              <option value="data">Data</option>
              <option value="totale">Totale</option>
              <option value="stato">Stato</option>
            </Form.Select>
            <i
              className={
                rotate
                  ? "bi bi-arrow-down-up fs-4 ms-2 rotate"
                  : "bi bi-arrow-down-up fs-4 ms-2 rotate-inv"
              }
              onClick={() => {
                setRotate(!rotate);
                if (rotate) {
                  setOrderFilter("asc");
                } else {
                  setOrderFilter("desc");
                }
              }}
            ></i>
          </Col>
          {orders.map((order, i) => {
            return (
              <Col
                key={order.id}
                className="d-flex  border border-2 py-3 rounded-4 shadow-card col-12 col-md-8 ms-md-2 mt-3 pointer"
              >
                <div className="d-flex flex-column ms-3">
                  <h6 className="m-0 mt-1">
                    <span className="fw-bold">Ordine N.</span>
                    {order.id}
                  </h6>
                  <h6 className="m-0 mt-1">
                    {" "}
                    <span className="fw-bold">Data: </span>
                    {order.orderTime}
                  </h6>
                </div>
                <div className="d-flex flex-column ms-4">
                  <h6 className="m-0 mt-1">
                    {" "}
                    <span className="fw-bold">Stato: </span>
                    {order.orderStatus}
                  </h6>
                  <h6 className="m-0 mt-1">
                    {" "}
                    <span className="fw-bold">Totale: </span>
                    {order.totalAmount}€
                  </h6>
                </div>
                <div className="my-auto ms-auto me-4">
                  <i
                    className="bi bi-arrow-right-circle fs-3 "
                    onClick={() => {
                      setOrderSelected(order);
                      setShow(true);
                      dispatch({ type: "SHOW_ORDER_BADGES", payload: false });
                    }}
                  ></i>
                </div>
              </Col>
            );
          })}
          {orderSelected && (
            <Modal
              data={orderSelected}
              show={show}
              size="md"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              onHide={() => {
                setShow(false);
              }}
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  Dettaglio ordine N. {orderSelected.id}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h6>Data: {orderSelected.orderTime}</h6>
                <h6>Indirizzo di consegna: {orderSelected.userPosition}</h6>
                <h6>
                  {orderSelected.restaurant.name},{" "}
                  {orderSelected.restaurant.streetAddress},
                  {orderSelected.restaurant.city}
                </h6>

                <p className="fw-bold">Prodotti</p>
                <ul className="list-unstyled">
                  {orderSelected.productList.map((product, i) => {
                    return (
                      <li key={product.id}>
                        {product.name}{" "}
                        <span className="ms-auto">{product.price}€</span>
                      </li>
                    );
                  })}
                  <hr></hr>
                  <li className="fw-bold">
                    Totale:{" "}
                    <span className="fw-light">
                      {orderSelected.totalAmount}€
                    </span>
                  </li>
                </ul>
              </Modal.Body>
              <Modal.Footer className="d-flex justify-content-between">
                <div>
                  <Button
                    variant="warning"
                    onClick={() => {
                      navigate("/order/status/" + orderSelected.id);
                    }}
                  >
                    Stato
                  </Button>
                </div>
                <div>
                  {" "}
                  <Button
                    variant="success"
                    onClick={() => {
                      downloadPDF(orderSelected);
                    }}
                  >
                    Scarica
                  </Button>
                  <Button
                    variant="danger"
                    className="mx-2"
                    onClick={() => {
                      setShow(false);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </Modal.Footer>
            </Modal>
          )}
        </Row>
      )}
    </Container>
  );
};

export default OrdersPage;
