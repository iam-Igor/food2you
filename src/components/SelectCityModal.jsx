import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { googleApikey } from "../apifile";
import { GoogleApiWrapper, Map, Marker } from "google-maps-react";
import { useEffect, useState } from "react";

const SelectCityModal = ({ show, setShow, google }) => {
  const [position, setPosition] = useState({ lat: null, lng: null });

  const [address, setAddress] = useState("");
  const [cityName, setCityName] = useState("");

  const containerStyle = {
    position: "relative",
    width: "100",
    height: "250px",
  };

  const getData = () => {
    fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=Via+" +
        address +
        "," +
        cityName +
        "&key=AIzaSyAObGi76zTUoyYXgesUhxM5TqhxV5KQ3z0"
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
        setPosition({
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Modal size="lg" centered show={show}>
      <div className="text-center pt-3">
        <h3>Aggiungi il tuo indirizzo di consegna</h3>
      </div>
      <hr></hr>
      <Row className="d-flex flex-column flex-md-row py-3 justify-content-around px-2">
        <Col className="col-12 col-md-5">
          <Form.Group className="mb-3 d-flex align-items-center">
            <Form.Control
              type="text"
              placeholder="Es. Via Roma 50"
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3 d-flex align-items-center">
            <Form.Control
              type="text"
              placeholder="Città Es. Milano "
              onChange={(e) => {
                setCityName(e.target.value);
              }}
            />
            <i className="bi bi-search ms-1 fs-4" onClick={() => getData()}></i>
          </Form.Group>
        </Col>
        <Col className="col-12 col-md-6">
          {position.lat !== null && (
            <Map
              google={google}
              zoom={15}
              containerStyle={containerStyle}
              initialCenter={{ lat: position.lat, lng: position.lng }}
            >
              <Marker
                position={{ lat: position.lat, lng: position.lng }}
                icon={{
                  anchor: new window.google.maps.Point(32, 32),
                  scaledSize: new window.google.maps.Size(38, 38),
                }}
              ></Marker>
            </Map>
          )}
        </Col>
      </Row>
      <Modal.Footer>
        <Button onClick={setShow}>Salva</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GoogleApiWrapper({
  apiKey: googleApikey,
})(SelectCityModal);
