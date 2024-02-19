import {
  Accordion,
  Button,
  Col,
  Form,
  ListGroup,
  Modal,
  Row,
} from "react-bootstrap";
import {
  addNewRestaurant,
  deleteRestaurant,
  getAllRestaurants,
  updateRestaurant,
} from "../functions";
import { useEffect, useState } from "react";

const BackOffice = () => {
  const [restaurantData, setRestaurantData] = useState(null);
  const [ordersData, setOrdersdata] = useState(null);

  // setto un ristorante come salvato per il trigger dell'animazione del bottone
  const [savedrestaurant, setSavedRestaurant] = useState(false);

  // ristorante selezionato
  const [restaurantSelected, setRestaurantSelected] = useState(null);

  //variabile che cambia se un ristornate viene modificato
  const [restUpdated, setRestUpdated] = useState(false);

  const updatePayload = (rest) => {
    setShowRestdetails(true);
    setRestaurantName(rest.name);
    setStreetAddress(rest.streetAddress);
    setRestaurantCity(rest.city);
    setLongitude(rest.latitude);
    setLatitude(rest.longitude);
    setSummary(rest.summary);
  };

  // trigger del modale per i dettagli di un ristorante
  const [showRestDetails, setShowRestdetails] = useState(false);

  //trigger per la sezione di tutti i ristoranti
  const [showRestSection, setShowRestSection] = useState(false);

  // trigger per il modale con il form di aggiunta nuovo ristorante
  const [addNewRest, setAddNewrest] = useState(false);

  // hooks per il payload di un nuovo ristorante
  const [restaurantName, setRestaurantName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [restaurantCity, setRestaurantCity] = useState("");
  const [longitude, setLongitude] = useState(0.0);
  const [latitude, setLatitude] = useState(0.0);
  const [summary, setSummary] = useState("");

  const restaurantPayload = {
    name: restaurantName,
    streetAddress: streetAddress,
    city: restaurantCity,
    longitude: longitude,
    latitude: latitude,
    summary: summary,
  };

  const getDatas = () => {
    getAllRestaurants().then((data) => {
      setRestaurantData(data);
      setShowRestSection(!showRestSection);
    });
  };

  const saveNewRestaurant = () => {
    addNewRestaurant(restaurantPayload).then((res) => {
      if (res) {
        setSavedRestaurant(true);
        setTimeout(() => {
          setAddNewrest(false);
          setSavedRestaurant(false);
        }, 2000);
      } else {
      }
    });
  };

  const updateRest = (id) => {
    updateRestaurant(id, restaurantPayload).then((res) => {
      if (res) {
        setRestUpdated(!restUpdated);
      }
    });
  };

  const deleteRest = (id) => {
    deleteRestaurant(id).then((res) => {
      if (res) {
        setRestUpdated(!restUpdated);
        setShowRestdetails(false);
      }
    });
  };

  useEffect(() => {
    getAllRestaurants().then((data) => {
      setRestaurantData(data);
    });
  }, [restUpdated]);

  return (
    <Row>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Sezione Ristoranti</Accordion.Header>
          <Accordion.Body className="d-flex flex-column align-items-center">
            <Col className="d-flex">
              <Button
                className="me-3"
                variant="success"
                onClick={() => {
                  setAddNewrest(true);
                }}
              >
                Aggiungi nuovo ristorante
              </Button>
              <Button onClick={getDatas}>Visualizza tutti i ristoranti</Button>
            </Col>
            {showRestSection && (
              <Col className="col-12">
                <ListGroup as="ul" className="mt-3">
                  {restaurantData.map((rest, i) => {
                    return (
                      <ListGroup.Item
                        key={rest.id}
                        as="li"
                        onClick={() => {
                          setRestaurantSelected(rest);
                          updatePayload(rest);
                        }}
                      >
                        <span className="fw-bold me-2">ID: {rest.id}</span>
                        {rest.name}, {rest.city}, {rest.streetAddress}
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>

                <Modal
                  show={showRestDetails}
                  onHide={() => {
                    setShowRestdetails(false);
                  }}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Modifica un ristorante</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                          value={restaurantName}
                          required
                          type="text"
                          onChange={(e) => {
                            setRestaurantName(e.target.value);
                          }}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Indirizzo</Form.Label>
                        <Form.Control
                          value={streetAddress}
                          required
                          type="text"
                          placeholder="Via e numero civico"
                          onChange={(e) => {
                            setStreetAddress(e.target.value);
                          }}
                        />
                        <Form.Select
                          value={restaurantCity}
                          required
                          aria-label="Default select example"
                          className="mt-2"
                          onChange={(e) => {
                            setRestaurantCity(e.target.value);
                          }}
                        >
                          <option value={0}>Città</option>
                          <option value="Cosenza">Cosenza</option>
                          <option value="Firenze">Firenze</option>
                          <option value="Milano">Milano</option>
                          <option value="Napoli">Napoli</option>
                          <option value="Roma">Roma</option>
                          <option value="Torino">Torino</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        className="mb-3 d-flex mt-3 justify-content-between"
                        controlId="exampleForm.ControlInput1"
                      >
                        <div className="text-center">
                          <Form.Label>Latitudine</Form.Label>
                          <Form.Control
                            value={longitude}
                            step="0.01"
                            min="0"
                            required
                            type="number"
                            onChange={(e) => {
                              setLongitude(parseInt(e.target.value));
                            }}
                          />
                        </div>
                        <div className="text-center">
                          <Form.Label>Longitudine</Form.Label>
                          <Form.Control
                            value={latitude}
                            step="0.01"
                            min="0"
                            required
                            type="number"
                            onChange={(e) => {
                              setLatitude(parseInt(e.target.value));
                            }}
                          />
                        </div>
                      </Form.Group>
                      <Form.Group>
                        <Form.Select
                          value={summary}
                          required
                          aria-label="Default select example"
                          className="mt-2"
                          onChange={(e) => {
                            setSummary(e.target.value);
                          }}
                        >
                          <option value={0}>Tipo</option>
                          <option value="PIZZA">Pizzeria</option>
                          <option value="PASTA">Ristorante</option>
                          <option value="SUSHI">Sushi</option>
                          <option value="FAST_FOOD">Fast food</option>
                          <option value="KEBAB">Kebab</option>
                        </Form.Select>
                      </Form.Group>
                      <Button
                        variant="warning"
                        className="mt-2 shadow-card"
                        onClick={() => {
                          updateRest(restaurantSelected.id);
                        }}
                      >
                        Modifica
                      </Button>
                      <Button
                        variant="danger"
                        className="mt-2 ms-2 shadow-card"
                        onClick={() => {
                          deleteRest(restaurantSelected.id);
                        }}
                      >
                        Elimina
                      </Button>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setShowRestdetails(false);
                      }}
                    >
                      Chiudi
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Col>
            )}
            <Modal
              show={addNewRest}
              onHide={() => {
                setAddNewrest(false);
              }}
            >
              <Modal.Header closeButton>
                <Modal.Title>Aggiungi nuovo ristorante</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      onChange={(e) => {
                        setRestaurantName(e.target.value);
                      }}
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Indirizzo</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Via e numero civico"
                      onChange={(e) => {
                        setStreetAddress(e.target.value);
                      }}
                    />
                    <Form.Select
                      required
                      aria-label="Default select example"
                      className="mt-2"
                      onChange={(e) => {
                        setRestaurantCity(e.target.value);
                      }}
                    >
                      <option value={0}>Città</option>
                      <option value="Cosenza">Cosenza</option>
                      <option value="Firenze">Firenze</option>
                      <option value="Milano">Milano</option>
                      <option value="Napoli">Napoli</option>
                      <option value="Roma">Roma</option>
                      <option value="Torino">Torino</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group
                    className="mb-3 d-flex mt-3 justify-content-between"
                    controlId="exampleForm.ControlInput1"
                  >
                    <div className="text-center">
                      <Form.Label>Latitudine</Form.Label>
                      <Form.Control
                        step="0.01"
                        min="0"
                        required
                        type="number"
                        onChange={(e) => {
                          setLongitude(parseInt(e.target.value));
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <Form.Label>Longitudine</Form.Label>
                      <Form.Control
                        step="0.01"
                        min="0"
                        required
                        type="number"
                        onChange={(e) => {
                          setLatitude(parseInt(e.target.value));
                        }}
                      />
                    </div>
                  </Form.Group>
                  <Form.Group>
                    <Form.Select
                      required
                      aria-label="Default select example"
                      className="mt-2"
                      onChange={(e) => {
                        setSummary(e.target.value);
                      }}
                    >
                      <option value={0}>Tipo</option>
                      <option value="PIZZA">Pizzeria</option>
                      <option value="PASTA">Ristorante</option>
                      <option value="SUSHI">Sushi</option>
                      <option value="FAST_FOOD">Fast food</option>
                      <option value="KEBAB">Kebab</option>
                    </Form.Select>
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer className="d-flex align-items-center">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setAddNewrest(false);
                  }}
                >
                  Close
                </Button>
                {savedrestaurant ? (
                  <div className="success-animation d-flex justify-content-center ms-4 mb-3">
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
                    variant="primary"
                    type="submit"
                    onClick={() => {
                      saveNewRestaurant();
                    }}
                  >
                    Salva
                  </Button>
                )}
              </Modal.Footer>
            </Modal>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1" className="my-3">
          <Accordion.Header>Sezione Prodotti</Accordion.Header>
          <Accordion.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Sezione Ordini</Accordion.Header>
          <Accordion.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3" className="mt-3">
          <Accordion.Header>Sezione Utenti</Accordion.Header>
          <Accordion.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Row>
  );
};

export default BackOffice;
