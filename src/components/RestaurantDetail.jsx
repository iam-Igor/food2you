import { GoogleApiWrapper, Map, Marker } from "google-maps-react";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { googleApikey } from "../apifile";
import restmarker from "../assets/img/rest_marker.png";
import { useDispatch } from "react-redux";

const RestaurantDetail = ({ google }) => {
  const urlParams = useParams();
  const [category, setCategory] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [city, setCity] = useState("");

  const [show, setShow] = useState(true);

  const [restaurantSelected, setRestaurantSelected] = useState([]);

  useEffect(() => {
    const evaluateParams = () => {
      switch (urlParams.summary) {
        case "pizza":
          setCategory("PIZZA");
          break;
        case "fast_food":
          setCategory("FAST_FOOD");
          break;
        case "kebab":
          setCategory("KEBAB");
          break;
        case "pasta":
          setCategory("PASTA");
          break;
        case "sushi":
          setCategory("SUSHI");
          break;
        default:
          return null;
      }
    };

    evaluateParams();
  }, [urlParams.summary]);

  const containerStyle = {
    position: "relative",
    width: "100",
    height: "350px",
  };

  const getRestaurantData = () => {
    fetch(
      "http://localhost:3030/restaurants/search?city=" +
        city +
        "&summary=" +
        category
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error();
        }
      })
      .then((data) => {
        console.log(data);
        setRestaurantSelected(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container>
      <Row>
        {restaurantSelected.length > 0 ? (
          <>
            <h3 className="mt-4 text-center">
              Scegli uno dei ristoranti in evidenza sulla mappa
            </h3>
            <Col
              className="mt-4 border border-2 p-0 shadow-btm "
              id="google-map-cont"
            >
              <Map
                google={google}
                zoom={15}
                containerStyle={containerStyle}
                initialCenter={{
                  lat: restaurantSelected[0].longitude,
                  lng: restaurantSelected[0].latitude,
                }}
              >
                {restaurantSelected.map((rest, i) => {
                  return (
                    <Marker
                      key={i}
                      position={{ lat: rest.longitude, lng: rest.latitude }}
                      onClick={() => {
                        dispatch({ type: "SHOW_OFF_CANVAS", payload: true });
                        dispatch({ type: "SET_REST_SELECTED", payload: rest });
                      }}
                      icon={{
                        url: restmarker,
                        anchor: new window.google.maps.Point(32, 32),
                        scaledSize: new window.google.maps.Size(50, 50),
                      }}
                    ></Marker>
                  );
                })}
              </Map>
            </Col>
          </>
        ) : (
          <Col className="mt-4">
            <h3>
              Spiacenti nessun ristorante di tipo {category} a {city}
            </h3>
            <div className="d-flex align-items-center mt-4">
              <h4 className="m-0">Vuoi scegliere una nuova città?</h4>
              <i
                className="bi bi-check-circle text-success fs-3 ms-2"
                onClick={() => setShow(true)}
              ></i>
              <i
                className="bi bi-x-circle text-danger fs-3 ms-2"
                onClick={() => navigate("/")}
              ></i>
            </div>
          </Col>
        )}
      </Row>
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Qual è la tua città?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <Form.Select
            aria-label="Default select example"
            onChange={(e) => {
              setCity(e.target.value);
            }}
          >
            <option>Seleziona la città</option>
            <option value="Cosenza">Cosenza</option>
            <option value="Firenze">Firenze</option>
            <option value="Milano">Milano</option>
            <option value="Napoli">Napoli</option>
            <option value="Roma">Roma</option>
            <option value="Torino">Torino</option>
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShow(false);
            }}
          >
            Chiudi
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              getRestaurantData();
              setShow(false);
            }}
          >
            Salva
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GoogleApiWrapper({
  apiKey: googleApikey,
})(RestaurantDetail);
