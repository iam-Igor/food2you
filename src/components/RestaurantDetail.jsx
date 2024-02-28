import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import restmarker from "../assets/img/rest_marker.png";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { evaluateError } from "../functions";

const RestaurantDetail = () => {
  const urlParams = useParams();
  const [category, setCategory] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [show, setShow] = useState(true);
  const [restaurantSelected, setRestaurantSelected] = useState([]);

  const darkMode = useSelector((state) => state.darkModeEnabled);

  const containerStyle = {
    width: "100%",
    height: "330px",
  };

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

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

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
          throw res;
        }
      })
      .then((data) => {
        setRestaurantSelected(data);
      })
      .catch((err) => {
        console.log(err);
        evaluateError(err.status, navigate, dispatch);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container fluid className={darkMode ? "py-2 bg-black" : "py-2"}>
      <Row className="justify-content-center py-5">
        {restaurantSelected.length > 0 ? (
          <>
            <h3
              className={
                darkMode ? "mt-4 text-center text-white" : "mt-4 text-center"
              }
            >
              Scegli uno dei ristoranti in evidenza sulla mappa
            </h3>
            <Col
              className="mt-4 border border-2 p-0 shadow-btm col-10 col-md-1o "
              id="google-map-cont"
            >
              {isLoaded && (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  zoom={15}
                  options={{
                    mapTypeId: "hybrid",
                  }}
                  center={{
                    lat: restaurantSelected[0].longitude,
                    lng: restaurantSelected[0].latitude,
                  }}
                >
                  {restaurantSelected.map((rest, i) => (
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
                    />
                  ))}
                </GoogleMap>
              )}
            </Col>
          </>
        ) : city !== "" ? (
          <Col className="mt-4 text-center py-5">
            <h3 className={darkMode ? "text-white" : ""}>
              Spiacenti nessun ristorante di tipo {category} a {city}
            </h3>
            <div className="d-flex align-items-center mt-4 justify-content-center">
              <h4 className={darkMode ? "text-white m-0" : "m-0"}>
                Vuoi scegliere una nuova città?
              </h4>
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
        ) : (
          <></>
        )}
      </Row>
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Qual è la tua città?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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

export default RestaurantDetail;
