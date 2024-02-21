import { Button, Col, Form, ListGroup, Modal } from "react-bootstrap";
import { getAllorders } from "../../functions";
import { useEffect, useState } from "react";

const OrdersSection = () => {
  const [page, setpage] = useState(0);
  const [size, setSize] = useState(15);
  const [order, setorder] = useState("");

  const [showOrderDetails, setShoworderDetails] = useState(false);

  const [showProdList, setShowProdList] = useState(false);

  const [chosenOrder, setChosenOrder] = useState(null);

  const [orderData, setOrderdata] = useState(null);

  const [showOrders, setShowOrders] = useState(false);

  const getOrders = () => {
    getAllorders(page, size, order).then((data) => {
      setOrderdata(data);
    });
  };

  useEffect(() => {
    getOrders();
  }, [order, page, size]);

  return (
    <Col className="d-flex flex-column">
      <div className="text-center mb-2">
        <Button
          onClick={() => {
            setShowOrders(!showOrders);
          }}
        >
          Visualizza Ordini
        </Button>
      </div>
      {orderData && showOrders && (
        <div>
          <div>
            {" "}
            <Form.Select
              aria-label="Default select example"
              className="my-3"
              onChange={(e) => {
                setorder(e.target.value);
              }}
            >
              <option value="id">Ordina per</option>
              <option value="id">ID</option>
              <option value="totalAmount">Totale</option>
              <option value="orderTime">Data</option>
            </Form.Select>
            <Form.Select
              aria-label="Default select example"
              className="my-md-3 mx-md-0 my-3"
              onChange={(e) => {
                setSize(e.target.value);
              }}
            >
              <option value="15">Elementi</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </Form.Select>
          </div>

          <ListGroup>
            {orderData.content.map((order, i) => {
              return (
                <ListGroup.Item
                  key={i}
                  className="d-flex my-1 pointer"
                  onClick={() => {
                    setChosenOrder(order);
                    setShoworderDetails(true);
                  }}
                >
                  <span className="fw-bold">ID: {order.id}</span>, Stato :{" "}
                  {order.orderStatus}, Data: {order.orderTime}, Tot:{" "}
                  {order.totalAmount}€<i className="bi bi-pencil ms-auto"></i>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
          {chosenOrder && showOrderDetails && (
            <Modal
              show={showOrderDetails}
              onHide={() => {
                setShoworderDetails(false);
              }}
            >
              <Modal.Header closeButton>
                <Modal.Title>Dettagli Ordine N. {chosenOrder.id}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  {" "}
                  <ul className="list-unstyled">
                    <li>
                      Utente: ID {chosenOrder.user.id}, Username:{" "}
                      {chosenOrder.user.username}
                    </li>
                    <li>Stato: {chosenOrder.orderStatus}</li>
                    <li>Data: {chosenOrder.orderTime}</li>
                    <li>
                      Pagamento accettato:{" "}
                      {chosenOrder.paymentAccepted === true ? "Si" : "No"}
                    </li>
                    <li>Totale: {chosenOrder.totalAmount}€</li>
                  </ul>
                </div>
                <div>
                  <p
                    className="m-0"
                    onClick={() => {
                      setShowProdList(!showProdList);
                    }}
                  >
                    Lista prodotti:{" "}
                    <i
                      className={
                        showProdList
                          ? "bi bi-dash-circle ms-3 me-2"
                          : "bi bi-plus-circle ms-3 me-2"
                      }
                    ></i>
                    {showProdList ? "Riduci" : "Espandi"}
                  </p>
                  {showProdList && (
                    <ul>
                      {chosenOrder.productList.map((prod, i) => {
                        return (
                          <li key={i}>
                            {prod.name}, {prod.price}€
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShoworderDetails(false);
                  }}
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </div>
      )}
    </Col>
  );
};

export default OrdersSection;
