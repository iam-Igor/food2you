import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  Col,
  Container,
  Modal,
  Row,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const [orders, setOrders] = useState(null);

  const [orderSelected, setOrderSelected] = useState(null);
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  console.log(orderSelected);

  const dispatch = useDispatch();
  const getOrdersData = () => {
    fetch("https://localhost:3030/users/orders/me", {
      headers: {
        Authorization: localStorage.getItem("tokenUser"),
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error();
        }
      })
      .then((data) => {
        console.log(data);
        setOrders(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const generatePDFContent = (order) => {
    let content = `Dettagli ordine N. ${order.id}\n\n`;
    content += `Ristorante: ${orderSelected.restaurant.name}\n\n`;
    content += `Data: ${order.orderTime}\n\n`;
    content += "Prodotti:\n";
    order.productList.forEach((product) => {
      content += `${product.name}: ${product.price}€\n`;
    });
    content += `\nTotale: ${order.totalAmount}€`;

    return content;
  };

  const downloadPDF = () => {
    const content = generatePDFContent(orderSelected);
    const pdf = new jsPDF();
    pdf.text(content, 10, 10);
    pdf.save("ordine.pdf");
  };

  useEffect(() => {
    getOrdersData();
  }, []);

  return (
    <Container fluid>
      {orders && (
        <Row className="mt-4 py-4">
          <h2>
            I tuoi ordini <i className="fs-4 bi bi-bag"></i>
          </h2>
          {orders.map((order, i) => {
            return (
              <Col
                key={order.id}
                className="d-flex  border border-2 py-3 rounded-4 shadow-card col-12 col-md-8 ms-md-2 mt-3"
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
                <h6>
                  {orderSelected.restaurant.name},{" "}
                  {orderSelected.restaurant.streetAddress},
                  {orderSelected.restaurant.city}
                </h6>

                <p className="fw-bold">Prodotti</p>
                <ul className="list-unstyled">
                  {orderSelected.productList.map((product, i) => {
                    return (
                      <li>
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
                  <Button variant="success" onClick={downloadPDF}>
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
