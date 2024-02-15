import { Col, Container, Row, Form, Button, Toast } from "react-bootstrap";

import bgHeader from "../assets/img/wave-haikei.svg";
import hamburger from "../assets/img/95af3cd3-85de-4f17-92e8-647af7967071-removebg-preview.png";
import gifImage from "../assets/img//giphy.gif";
import { useEffect, useState } from "react";
import SelectCityModal from "./SelectCityModal";
import { useDispatch, useSelector } from "react-redux";
import MainContent from "./MainContent";
import RestaurantsCarousel from "./RestaurantsCarousel";
import InfoSection from "./InfoSection";

const Homepage = () => {
  const [formVisible, setFormVisible] = useState(false);
  const selectedCity = useSelector((state) => state.userPosition);
  const dispatch = useDispatch();
  const [showCityModal, setShowCityModal] = useState(false);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);

  console.log(latitude, longitude);

  const fetchData = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=` +
          process.env.REACT_APP_GOOGLE_MAPS_API_KEY
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      const formattedAddress = data.results[0].formatted_address;
      console.log(formattedAddress);
    } catch (error) {
      setError(error.message);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchData(position.coords.latitude, position.coords.longitude);
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // console.log(window.scrollY);
      if (window.scrollY > 560) {
        setFormVisible(true);
      } else {
        setFormVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
  }, [window.scrollY]);

  const accessData = localStorage.getItem("tokenUser");

  return (
    <Container fluid className="p-0 overflow-x-hidden">
      <Row className="header-bg d-flex flex-column flex-md-row justify-content-center align-items-center">
        <h3 className="text-white text-center main-text mt-md-5">
          Sapore di consegne, rapidità di servizio: il tuo mondo a portata di
          clic con <span className="fw-bold">Food2You!</span>
        </h3>
        <Col className=" align-items-center justify-content-around py-2 col-md-4">
          <div className="d-flex justify-content-center">
            <img alt="hamburger" src={gifImage} style={{ width: "100%" }} />
          </div>
        </Col>
        {selectedCity !== "" ? (
          <Col className="col-12 text-center text-white ">
            <h3 className="heartbeat">
              Scorri in basso per scegliere il tuo ristorante su: {selectedCity}
            </h3>
          </Col>
        ) : (
          <Col className="col-md-4">
            <Form className="d-flex  flex-column px-2">
              <p className="text-white text-center">
                Cerca la tua città o{" "}
                <span className="fw-bold pointer" onClick={getLocation}>
                  usa la tua posizione
                </span>
                <i className="bi bi-geo-alt-fill fs-4 ms-2"></i>
              </p>
              <Form.Group>
                <Form.Control
                  type="email"
                  placeholder="Es. Napoli"
                  className="rounded-4"
                  onClick={() => {
                    if (accessData) {
                      setShowCityModal(true);
                    } else {
                      dispatch({ type: "SHOW_LOGIN_MODAL", payload: true });
                    }
                  }}
                />
              </Form.Group>
            </Form>
          </Col>
        )}

        <Col
          className={
            formVisible
              ? "col-12 scende mt-3 topbar py-3 header-nav"
              : "col-12 sale topbar py-3 header-nav"
          }
        >
          <Form className="d-flex  flex-column align-items-center justify-content-center">
            {selectedCity ? (
              <>
                <p className="text-white">
                  Hai sbagliato città? Cercala o{" "}
                  <span className="fw-bold pointer" onClick={getLocation}>
                    usa la tua posizione
                  </span>
                  <i className="bi bi-geo-alt-fill fs-4 ms-2"></i>
                </p>
              </>
            ) : (
              <>
                <p className="text-white">
                  Cerca la tua città o{" "}
                  <span className="fw-bold pointer" onClick={getLocation}>
                    usa la tua posizione
                  </span>
                  <i className="bi bi-geo-alt-fill fs-4 ms-2"></i>
                </p>
              </>
            )}
            <Form.Group>
              <Form.Control
                type="email"
                placeholder="Es. Napoli"
                className="rounded-4 w-100"
                onClick={() => {
                  if (accessData) {
                    setShowCityModal(true);
                  } else {
                    dispatch({ type: "SHOW_LOGIN_MODAL", payload: true });
                  }
                }}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row className="p-0">
        <img src={bgHeader} className="p-0" />
      </Row>
      {showCityModal && (
        <SelectCityModal
          show={showCityModal}
          setShow={() => setShowCityModal(false)}
        />
      )}
      <MainContent />
      <RestaurantsCarousel />
      <InfoSection />
    </Container>
  );
};

export default Homepage;
