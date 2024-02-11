import { useEffect, useState } from "react";
import { Accordion, Button, Col, Form, Modal } from "react-bootstrap";
import paymenLogos from "../assets/img/Credit-Card-Icons-removebg-preview.png";
import { Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PaymentModal = ({ show, setShow, total }) => {
  const [saved, setSaved] = useState(false);
  const [savedPaymentInfo, setSavedPaymentInfo] = useState(false);
  const [paymentSelected, setPaymentSelected] = useState("");
  const [error, setError] = useState(false);

  const [profileData, setProfileData] = useState(null);

  const [paymentAccepted, setPaymentAccepted] = useState(false);

  const [order, setOrder] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const payloadOrder = useSelector((state) => state.orderPayload);

  console.log(payloadOrder);

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
        console.log(data);
        alert("ordine okkkkkk");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getData = () => {
    fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        profileData.address +
        "&key=" +
        process.env.GOOGLE_MAPS_API_KEY
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("error");
        }
      })
      .then((data) => {
        console.log(data);

        dispatch({
          type: "SET_LON",
          payload: data.results[0].geometry.location.lng,
        });
        dispatch({
          type: "SET_LAT",
          payload: data.results[0].geometry.location.lat,
        });

        dispatch({ type: "SET_ORDER_COMPLETED", payload: true });
        dispatch({ type: "SHOW_NOTIFICATION", payload: true });
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
        console.log(data);
        setProfileData({
          address: data.address,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
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
              <div className="d-flex align-items-center">
                <h3>
                  <span className="fs-6 fw-light">Metodo di pagamento: </span>
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
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Numero carta</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Es. 1234567"
                      required
                    />

                    <Form.Label>CCV</Form.Label>
                    <Form.Control type="number" placeholder="CCV" required />

                    <Form.Label>Scadenza MM/YYYY</Form.Label>
                    <Form.Control type="month" required />
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
                        setSaved(true);
                        setSavedPaymentInfo(true);
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
                    <a className="text-primary" href="http://www.paypal.com">
                      PayPal
                    </a>
                    <i className=" ms-2 bi bi-paypal text-primary"></i>
                  </p>
                </div>
              ) : (
                ""
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
                      value={profileData.address}
                      onChange={(e) => {
                        setProfileData({
                          ...profileData,
                          address: e.target.value,
                        });
                      }}
                    />
                  </Form.Group>
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
                        setPaymentAccepted(true);
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
