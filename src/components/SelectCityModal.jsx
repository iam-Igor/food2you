import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import mapPlaceholder from "../assets/img/map-placeholder.jpg";
import { Alert } from "@mui/material";
import { evaluateError } from "../functions";
import { useNavigate } from "react-router-dom";

const containerStyle = {
  width: "100%",
  height: "250px",
};

const SelectCityModal = ({ show, setShow }) => {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("");
  const [cityName, setCityName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showAlertError, setShowAlertError] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const getData = () => {
    fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=Via+" +
        address +
        "," +
        cityName +
        "&key=" +
        process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          evaluateError(res.status, navigate, dispatch);
        }
      })
      .then((data) => {
        setPosition({
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng,
        });
        dispatch({ type: "SET_USER_POSITION", payload: cityName });
        dispatch({
          type: "SET_LON",
          payload: data.results[0].geometry.location.lng,
        });
        dispatch({
          type: "SET_LAT",
          payload: data.results[0].geometry.location.lat,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Modal size="lg" centered show={show}>
      <div className="text-center pt-3 px-1">
        <h3>Aggiungi il tuo indirizzo di consegna</h3>
      </div>
      <hr />
      <Row className="d-flex flex-column flex-md-row py-3 justify-content-around px-2">
        <Col className="col-12 col-md-5">
          <Form.Group className="mb-3 d-flex align-items-center">
            <Form.Control
              type="text"
              placeholder="Indirizzo: Es. Via Roma 50"
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3 d-flex align-items-center">
            <Form.Select
              aria-label="Default select example"
              onChange={(e) => {
                setCityName(e.target.value);
              }}
              className="form-select-city"
            >
              <option value="">Città</option>
              <option value="Cosenza">Cosenza</option>
              <option value="Firenze">Firenze</option>
              <option value="Milano">Milano</option>
              <option value="Torino">Torino</option>
              <option value="Roma">Roma</option>
              <option value="Napoli">Napoli</option>
            </Form.Select>
            <div className="rounded-end lente border border-start-0">
              <i
                className="bi bi-search ms-1 fs-4 me-1"
                onClick={() => {
                  if (address !== "" && cityName !== "") {
                    getData();
                    setShowAlertError(false);
                  } else {
                    setShowAlertError(true);
                  }
                }}
              ></i>
            </div>
          </Form.Group>
          <Alert severity="warning">
            Al momento l'app è disponibile solo nelle città elencate
          </Alert>
          {showAlertError && (
            <Alert severity="error" className="mt-3">
              Devi riempire i campi Indirizzo e città!
            </Alert>
          )}
        </Col>
        <Col className="col-12 col-md-6 text-center">
          {isLoaded && position ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{ lat: position.lat, lng: position.lng }}
              zoom={15}
            >
              <Marker position={{ lat: position.lat, lng: position.lng }} />
            </GoogleMap>
          ) : (
            <img
              src={mapPlaceholder}
              alt="placeholder-map"
              style={{ width: "70%" }}
            />
          )}
        </Col>
      </Row>
      <Modal.Footer>
        <Button
          variant="warning rounded-4 shadow-card"
          onClick={() => {
            setShow();
          }}
        >
          Chiudi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SelectCityModal;
