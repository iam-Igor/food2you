import { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Modal,
  Overlay,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";
import paymenLogos from "../assets/img/Credit-Card-Icons-removebg-preview.png";
import { useNavigate } from "react-router-dom";
import BackOffice from "./BackOfficeComps/BackOffice";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  addCreditCard,
  deleteCreditCard,
  deleteMyProfile,
  getCreditCardInfo,
} from "../functions";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const target = useRef(null);
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState(null);

  const [showDeleteCardConfirm, setShowDeleteCardConfirm] = useState(false);

  const [imageUploaded, setImageUploaded] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const [popup, setPopup] = useState(false);

  const darkMode = useSelector((state) => state.darkModeEnabled);

  const [showAdvnced, setShowAdvanced] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    lastname: "",
    username: "",
    email: "",
    address: "",
    avatarUrl: "",
  });
  const [saved, setSaved] = useState(false);
  const [paymentSelected, setPaymentSelected] = useState("");
  const [showModalPost, setShowModalPost] = useState(false);
  const [savedProfile, setSavedProfile] = useState(false);
  const [image, setImage] = useState(null);

  const [password, setpassword] = useState("");

  //hooks per salvare carta di credito

  const [fullName, setFullName] = useState("");
  const [cardNumber, setCardNumber] = useState(0);
  const [cvv, setCvv] = useState(0);
  const [expiringDate, setExpiringdate] = useState("");

  const [creditCardData, setCreditCarddata] = useState(null);

  const [showCvv, setShowCvv] = useState(false);

  const paymentPayload = {
    fullName: fullName,
    cardNumber: cardNumber,
    cvv: cvv,
    expiringDate: expiringDate,
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
          return res;
        }
      });
    }
  };

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const modifiedPayload = {
    email: profileData.email,
    password: password,
    username: profileData.username,
    address: profileData.address,
    name: profileData.name,
    lastname: profileData.lastname,
  };

  const data = new FormData();
  if (image) {
    data.append("image", image[0]);
  }

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
        setUserRole(data.role);
        setProfileData({
          name: data.name,
          lastname: data.lastname,
          username: data.username,
          email: data.email,
          address: data.address,
          avatarUrl: data.avatarUrl,
        });
      })
      .catch((err) => {
        console.log(err);
        navigate("/bad_request");
      });
  };

  const uploadImage = () => {
    fetch("http://localhost:3030/users/me/upload", {
      method: "PATCH",
      headers: {
        Authorization: localStorage.getItem("tokenUser"),
        Accept: "application/json",
      },
      body: data,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore durante la richiesta");
        }
        setImageUploaded(true);
        setIsImageUploading(false);
        return response.json();
      })
      .catch((error) => {
        console.error("Si è verificato un errore durante la richiesta:", error);
        setIsImageUploading(false);
        // navigate("/bad_request");
      });
  };

  const uploaduserData = () => {
    fetch("http://localhost:3030/users/me", {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("tokenUser"),

        "Content-Type": "application/json",
      },
      body: JSON.stringify(modifiedPayload),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("errore nel login");
        }
      })
      .then((data) => {
        setSavedProfile(true);
      })
      .catch((err) => {
        console.log(err);
        navigate("/bad_request");
      });
  };

  useEffect(() => {
    getCreditCardInfo().then((res) => {
      if (res) {
        setCreditCarddata(res);
      }
    });
    getUserData();
  }, [imageUploaded]);

  return (
    <Container
      fluid
      className={darkMode ? "bg-black text-white pt-4" : ""}
      data-bs-theme={darkMode ? "dark" : "light"}
    >
      <h3 className="text-center ">
        Account e impostazioni <i className="bi bi-gear"></i>
      </h3>
      {profileData && (
        <Row className="mt-5">
          <Tabs
            defaultActiveKey="profile"
            id="fill-tab-example"
            className={darkMode ? "mb-3 profile-tab-dark" : "mb-3 profile-tab"}
            fill
          >
            <Tab eventKey="profile" title="Profilo" className="mt-4">
              <Row className="flex-column flex-md-row px-2 py-2">
                <Col className="col-12 col-md-3 text-center position-relative border border-1 me-2 shadow-card rounded-4 p-2">
                  <img
                    alt="user-img"
                    className="rounded-circle"
                    src={
                      profileData.avatarUrl !== null
                        ? profileData.avatarUrl
                        : "https://cdn-icons-png.flaticon.com/512/3607/3607444.png"
                    }
                    style={{ width: "80%" }}
                  />
                  <i
                    className="bi bi-pencil-square fs-3 position-absolute profile-edit"
                    onClick={() => setPopup(!popup)}
                    ref={target}
                  ></i>
                  <Overlay
                    target={target.current}
                    show={popup}
                    placement="bottom"
                  >
                    {({
                      placement: _placement,
                      arrowProps: _arrowProps,
                      show: _show,
                      popper: _popper,
                      hasDoneInitialMeasure: _hasDoneInitialMeasure,
                      ...props
                    }) => (
                      <div
                        className="p-2 rounded-3 shadow-card"
                        {...props}
                        style={{
                          position: "absolute",
                          backgroundColor: "#009688",
                          padding: "2px 10px",
                          color: "white",
                          borderRadius: 3,
                          ...props.style,
                        }}
                      >
                        <Form
                          onSubmit={(e) => {
                            e.preventDefault();
                            setIsImageUploading(true);
                            uploadImage();
                          }}
                        >
                          <Form.Label>Upload immagine</Form.Label>
                          <div className="d-flex align-items-center">
                            <Form.Control
                              className="w-75 me-3"
                              type="file"
                              size="sm"
                              onChange={(e) => {
                                setImage(e.target.files);
                              }}
                              required
                            />
                            {!isImageUploading ? (
                              <div className="ms-3">
                                <button className="btn-form-upload p-0 text-center">
                                  {" "}
                                  <i className="bi bi-cloud-upload fs-3 ms-3"></i>
                                </button>
                              </div>
                            ) : (
                              <div className="spinner ms-5"></div>
                            )}
                          </div>
                        </Form>
                      </div>
                    )}
                  </Overlay>
                </Col>
                <Col className="d-flex flex-column border border-1 p-3 shadow-card rounded-4 mt-3 mt-md-0">
                  <h3>
                    {profileData.name} {profileData.lastname}{" "}
                    <span className="fs-6 text-secondary ms-3">
                      <i className="bi bi-geo-alt-fill"></i>
                      {profileData.address}
                    </span>
                  </h3>
                  <h6>
                    <span className="fs-6 fw-light">Email: </span>
                    {profileData.email}
                  </h6>
                  <h6>
                    <span className="fs-6 fw-light">Username: </span>
                    {profileData.username}
                  </h6>
                  <i
                    className="bi bi-pencil-square fs-3 text-end mt-auto"
                    onClick={() => setShowModalPost(true)}
                  ></i>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="pagamenti" title="Pagamenti" className="mt-4">
              {/* 2 */}
              <Row className="px-2 py-2 justify-content-center">
                {" "}
                {!creditCardData ? (
                  <Col className="col-12 col-md-8 border border-1 rounded-3 shadow-card mt-4 p-3">
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
                            type="number"
                            placeholder="Es. 1234567"
                            required
                            onChange={(e) => {
                              setCardNumber(parseInt(e.target.value));
                            }}
                          />

                          <Form.Label>CCV</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="CCV"
                            required
                            minLength={3}
                            maxLength={3}
                            onChange={(e) => {
                              setCvv(parseInt(e.target.value));
                            }}
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
                              setTimeout(() => {
                                window.location.reload();
                              }, 2000);
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
                  </Col>
                ) : (
                  <Col className="d-flex flex-column align-items-center">
                    <h6 className="text-center">
                      Sul tuo account risulta salvata la seguente carta:
                    </h6>
                    <Card style={{ width: "18rem" }}>
                      <Card.Header>
                        <span className="fw-bold">ID Carta: </span>
                        {creditCardData.id}
                      </Card.Header>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <span className="fw-bold">Titolare: </span>
                          {creditCardData.fullName}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          {" "}
                          <span className="fw-bold">Numero carta: </span>
                          {creditCardData.cardNumber}
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex">
                          <span className="fw-bold">CVV: </span>
                          {showCvv ? (
                            creditCardData.cvv
                          ) : (
                            <p className="m-0 mt-1">***</p>
                          )}
                          {showCvv ? (
                            <i
                              className="bi bi-eye-slash ms-auto fs-5 pointer"
                              onClick={() => {
                                setShowCvv(false);
                              }}
                            ></i>
                          ) : (
                            <i
                              className="bi bi-eye ms-auto fs-5 pointer"
                              onClick={() => {
                                setShowCvv(true);
                              }}
                            ></i>
                          )}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          {" "}
                          <span className="fw-bold">Scadenza: </span>
                          {creditCardData.expiringDate.slice(0, 7)}
                        </ListGroup.Item>
                      </ListGroup>
                    </Card>
                    <div className="mt-2">
                      <Button
                        variant="danger"
                        className="rounded-4 shadow-card"
                        onClick={() => {
                          setShowDeleteCardConfirm(true);
                        }}
                      >
                        Elimina carta
                      </Button>
                    </div>
                    <Modal
                      show={showDeleteCardConfirm}
                      onHide={() => {
                        setShowDeleteCardConfirm(false);
                      }}
                    >
                      <Modal.Header closeButton></Modal.Header>
                      <Modal.Body>
                        Sicuro di voler eliminare la carta?
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setShowDeleteCardConfirm(false);
                          }}
                        >
                          Annulla
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => {
                            deleteCreditCard(creditCardData.id).then((res) => {
                              if (res) {
                                setShowDeleteCardConfirm(false);
                                window.location.reload();
                              }
                            });
                          }}
                        >
                          Elimina
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </Col>
                )}
              </Row>
            </Tab>
            {userRole === "ADMIN" && (
              <Tab eventKey="back-office" title="Back Office" className="mt-4">
                <BackOffice />
              </Tab>
            )}
          </Tabs>
        </Row>
      )}
      {profileData && (
        <Modal size="lg" show={showModalPost} centered>
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Modifica profilo
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              className="mt-3"
              onSubmit={(e) => {
                e.preventDefault();
                uploaduserData();
                setTimeout(() => {
                  setShowModalPost(false);
                  setSavedProfile(false);
                }, 2000);
              }}
            >
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Il tuo nome"
                  required
                  value={profileData.name}
                  onChange={(e) => {
                    setProfileData({ ...profileData, name: e.target.value });
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Cognome</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Il tuo cognome"
                  required
                  value={profileData.lastname}
                  onChange={(e) => {
                    setProfileData({
                      ...profileData,
                      lastname: e.target.value,
                    });
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Il tuo username"
                  required
                  value={profileData.username}
                  onChange={(e) => {
                    setProfileData({
                      ...profileData,
                      username: e.target.value,
                    });
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={profileData.email}
                  onChange={(e) => {
                    setProfileData({
                      ...profileData,
                      email: e.target.value,
                    });
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Nuova password"
                  required
                  onChange={(e) => {
                    setpassword(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Indirizzo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Es. Via Roma 10, Milano"
                  required
                  value={profileData.address}
                  onChange={(e) => {
                    setProfileData({
                      ...profileData,
                      address: e.target.value,
                    });
                  }}
                />
              </Form.Group>
              <div>
                <h6
                  className="text-end pointer"
                  onClick={() => {
                    setShowAdvanced(!showAdvnced);
                  }}
                >
                  Avanzate <i class="bi bi-shield-lock"></i>
                </h6>
                {showAdvnced && (
                  <div className="text-end">
                    <hr></hr>
                    <Button
                      variant="danger"
                      className="rounded-4 shadow-card "
                      onClick={() => {
                        setShowDeleteConfirm(true);
                      }}
                    >
                      Elimina Profilo
                    </Button>
                    <hr></hr>
                  </div>
                )}
                <Dialog
                  open={showDeleteConfirm}
                  onClose={() => {
                    setShowDeleteConfirm(false);
                  }}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Sicuro di voler eliminare il tuo profilo?"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      <p className="fw-bold text-center">
                        Questa azione sarà irreversibile, verranno inoltre
                        eliminati tutti i tuoi ordini effettuati.
                      </p>
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                      }}
                    >
                      Annulla
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        deleteMyProfile().then((res) => {
                          if (res) {
                            localStorage.removeItem("tokenUser");
                            navigate("/");
                          }
                        });
                      }}
                    >
                      Conferma
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>

              {savedProfile ? (
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
                  type="submit"
                  variant="success rounded-4"
                  className="shadow-card"
                >
                  Salva
                </Button>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => setShowModalPost(false)}
              className="rounded-4 btn-danger shadow-card"
            >
              Chiudi
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default UserProfile;
