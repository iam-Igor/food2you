import { useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Card,
  Col,
  Form,
  ListGroup,
  Modal,
} from "react-bootstrap";
import paymenLogos from "../assets/img/Credit-Card-Icons-removebg-preview.png";
import { Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addCreditCard, getCreditCardInfo } from "../functions";

const PaymentModal = ({ show, setShow, total }) => {
  const [fullName, setFullName] = useState("");
  const [cardNumber, setCardNumber] = useState(0);
  const [cvv, setCvv] = useState(0);
  const [expiringDate, setExpiringdate] = useState("");

  const paymentPayload = {
    fullName: fullName,
    cardNumber: cardNumber,
    cvv: cvv,
    expiringDate: expiringDate,
  };

  const [saved, setSaved] = useState(false);
  const [savedPaymentInfo, setSavedPaymentInfo] = useState(false);
  const [paymentSelected, setPaymentSelected] = useState("");
  const [error, setError] = useState(false);

  const [wrongCity, setWrongCity] = useState(false);

  const [profileData, setProfileData] = useState(null);

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");

  const [paymentAccepted, setPaymentAccepted] = useState(false);

  const [paymentData, setPaymentData] = useState(null);

  const getPaymentInfo = () => {
    getCreditCardInfo().then((res) => {
      if (res) {
        setPaymentData(res);
      }
    });
  };

  const [order, setOrder] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const payloadOrder = useSelector((state) => state.orderPayload);

  const makeNeworder = () => {
    fetch("http://localhost:3030/orders/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("tokenUser"),
      },
      body: JSON.stringify(payloadOrder),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("errore nel login");
        }
      })
      .then((data) => {
        dispatch({ type: "SHOW_ORDER_BADGES", payload: true });
        dispatch({ type: "CLEAR_CART" });
        dispatch({ type: "SET_NEWEST_ORDER", payload: data.id });
        setTimeout(() => {
          dispatch({ type: "SHOW_NOTIFICATION", payload: true });
        }, 4000);
      })
      .catch((err) => {
        console.log(err);
        navigate("/bad_request");
      });
  };

  const getData = () => {
    fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        street +
        "," +
        city +
        "&key=" +
        process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("error");
        }
      })
      .then((data) => {
        dispatch({ type: "SET_ORDER_COMPLETED", payload: true });
        setOrder(true);
        setTimeout(() => {
          setOrder(false);
          setShow();
          dispatch({ type: "SHOW_CART", payload: false });
          makeNeworder();
          navigate("/");
        }, 4000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClose = () => {
    setShow();
    setSavedPaymentInfo(false);
    setPaymentAccepted(false);
    setSaved(false);
    setError(false);
  };

  const getUserData = () => {
    fetch("http://localhost:3030/users/me", {
      headers: {
        Authorization: localStorage.getItem("tokenUser"),
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("ERRORE NEL CARICAMENTO DEI DATI UTENTE");
        }
      })
      .then((data) => {
        setProfileData({
          address: data.address,
        });
      })
      .catch((err) => {
        console.log(err);
        navigate("/bad_request");
      });
  };

  const checkCityDistance = (param) => {
    fetch("http://localhost:3030/restaurants/" + param)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("errore nel caricamento dei dati");
        }
      })
      .then((data) => {
        if (data.city.toLowerCase() === city.toLowerCase()) {
          dispatch({
            type: "ADD_POSITION_ORDER",
            payload: street + "," + city,
          });
          setPaymentAccepted(true);
          setWrongCity(false);
        } else {
          setWrongCity(true);
        }
      })
      .catch((err) => {
        console.log(err);
        navigate("/bad_request");
      });
  };

  const addPayment = () => {
    if (
      fullName !== "" &&
      cardNumber !== 0 &&
      cvv !== 0 &&
      expiringDate !== ""
    ) {
      addCreditCard(paymentPayload).then((res) => {
        if (res) {
          setSaved(true);
          setSavedPaymentInfo(true);
          setPaymentData(res);
        }
      });
    }
  };

  useEffect(() => {
    getPaymentInfo();
    getUserData();
  }, []);

  return (
    <Modal show={show} onHide={setShow} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Checkout: {total}€</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Pagamento</Accordion.Header>
            <Accordion.Body>
              {!paymentData ? (
                <>
                  <div className="d-flex align-items-center">
                    <h3>
                      <span className="fs-6 fw-light">
                        Metodo di pagamento:{" "}
                      </span>
                    </h3>
                    <img
                      src={paymenLogos}
                      alt="payment-logos"
                      style={{ width: "40%" }}
                    />
                  </div>

                  <Form.Select
                    aria-label="Default select example"
                    onChange={(e) => {
                      setPaymentSelected(e.target.value);
                    }}
                  >
                    <option>Seleziona un metodo:</option>
                    <option value="1">Paypal</option>
                    <option value="2">Carta di credito</option>
                  </Form.Select>
                  {paymentSelected === "2" ? (
                    <Form className="mt-3">
                      <p>Aggiungi nuova carta di credito</p>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Titolare carta</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Es. Mario Rossi"
                          required
                          onChange={(e) => {
                            setFullName(e.target.value);
                          }}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Numero carta</Form.Label>
                        <Form.Control
                          onChange={(e) => {
                            setCardNumber(parseInt(e.target.value));
                          }}
                          type="number"
                          placeholder="Es. 1234567"
                          required
                        />

                        <Form.Label>CCV</Form.Label>
                        <Form.Control
                          onChange={(e) => {
                            setCvv(parseInt(e.target.value));
                          }}
                          type="number"
                          placeholder="CCV"
                          required
                        />

                        <Form.Label>Scadenza MM/YYYY</Form.Label>
                        <Form.Control
                          type="month"
                          required
                          onChange={(e) => {
                            setExpiringdate(e.target.value + "-01");
                          }}
                        />
                      </Form.Group>
                      {saved ? (
                        <div className="success-animation d-flex justify-content-start">
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
                      ) : (
                        <Button
                          variant="success rounded-4"
                          onClick={() => {
                            addPayment();
                          }}
                        >
                          Salva
                        </Button>
                      )}
                    </Form>
                  ) : paymentSelected === "1" ? (
                    <div className="mt-3">
                      <p>
                        Login su{" "}
                        <a
                          className="text-primary"
                          href="http://www.paypal.com"
                        >
                          PayPal
                        </a>
                        <i className=" ms-2 bi bi-paypal text-primary"></i>
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                <Col className="d-flex flex-column align-items-center">
                  <h6 className="text-center">
                    Sul tuo account risulta salvata la seguente carta:
                  </h6>
                  <Button
                    className="my-2"
                    variant="warning rounded-4 shadow-card"
                    onClick={() => {
                      setShow(false);
                      dispatch({ type: "SHOW_CART", payload: false });
                      navigate("/profile");
                    }}
                  >
                    Modifica
                  </Button>
                  <Card style={{ width: "18rem" }}>
                    <Card.Header>
                      <span className="fw-bold">ID Carta: </span>
                      {paymentData.id}
                    </Card.Header>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <span className="fw-bold">Titolare: </span>
                        {paymentData.fullName}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        {" "}
                        <span className="fw-bold">Numero carta: </span>
                        {paymentData.cardNumber}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        {" "}
                        <span className="fw-bold">CVV: </span>
                        ***
                      </ListGroup.Item>
                      <ListGroup.Item>
                        {" "}
                        <span className="fw-bold">Scadenza: </span>
                        {paymentData.expiringDate.slice(0, 7)}
                      </ListGroup.Item>
                    </ListGroup>
                  </Card>
                  {saved ? (
                    <div className="success-animation d-flex justify-content-start">
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
                  ) : (
                    <Button
                      className="mt-2"
                      variant="success rounded-4 shadow-card"
                      onClick={() => {
                        setSaved(true);
                        setSavedPaymentInfo(true);
                      }}
                    >
                      Conferma
                    </Button>
                  )}
                </Col>
              )}
            </Accordion.Body>
          </Accordion.Item>
          {profileData && (
            <Accordion.Item eventKey="1" className="mt-2">
              <Accordion.Header>Consegna</Accordion.Header>
              <Accordion.Body>
                <Form>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Indirizzo</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Es. Via Roma 12"
                      onChange={(e) => {
                        setStreet(e.target.value);
                      }}
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Città</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Es. Milano"
                      onChange={(e) => {
                        setCity(e.target.value);
                      }}
                    />
                  </Form.Group>
                  {wrongCity && (
                    <Alert
                      variant="filled"
                      severity="error"
                      className="my-3 shake"
                    >
                      La città scelta è troppo distante dal tuo indirizzo!
                    </Alert>
                  )}
                  <Form.Select
                    aria-label="Default select example"
                    className="mb-3"
                  >
                    <option>Quando?</option>
                    <option value="1">Adesso</option>
                    <option value="2">Tra un'ora</option>
                    <option value="3">Tra due ore</option>
                  </Form.Select>
                </Form>
                {paymentAccepted ? (
                  <div className="success-animation d-flex justify-content-start">
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
                ) : (
                  <Button
                    variant="success rounded-4"
                    onClick={() => {
                      if (savedPaymentInfo) {
                        checkCityDistance(payloadOrder.restaurantId);
                      } else {
                        setError(true);
                        setTimeout(() => {
                          setError(false);
                        }, 5000);
                      }
                    }}
                  >
                    Salva
                  </Button>
                )}
              </Accordion.Body>
            </Accordion.Item>
          )}
        </Accordion>
        {error && (
          <Alert variant="filled" severity="error" className="mt-3 shake">
            Salva prima i dati relativi al pagamento!
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          onClick={handleClose}
          className="rounded-4 shadow-card"
        >
          Annulla
        </Button>
        {order ? (
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          <Button
            variant="success rounded-4 shadow-card"
            onClick={() => {
              getData();
            }}
          >
            Ordina
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;
