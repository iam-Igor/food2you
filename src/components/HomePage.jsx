import {
  Col,
  Container,
  Row,
  Form,
  Button,
  Toast,
  Modal,
} from "react-bootstrap";
import { Parallax } from "react-scroll-parallax";

import bgHeader from "../assets/img/wave-haikei.svg";
import bgHeaderDark from "../assets/img/darkMode/wave-haikei-dark.svg";
import gifImage from "../assets/img//giphy.gif";
import { useEffect, useState } from "react";
import SelectCityModal from "./SelectCityModal";
import { useDispatch, useSelector } from "react-redux";
import MainContent from "./MainContent";
import RestaurantsCarousel from "./RestaurantsCarousel";
import InfoSection from "./InfoSection";
import ReviewsSection from "./ReviewsSection";
import { evaluateError } from "../functions";
import MostUsedCategories from "./MostUsedCategories";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [formVisible, setFormVisible] = useState(false);
  const selectedCity = useSelector((state) => state.userPosition);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showCityModal, setShowCityModal] = useState(false);

  const darkMode = useSelector((state) => state.darkModeEnabled);

  const [show, setShow] = useState(false);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const fetchData = (lat, lon) => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=` +
        process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    )
      .then((response) => {
        if (!response.ok) {
          setIsLoading(false);
          evaluateError(response.status, navigate, dispatch);
          throw new Error();
        }
        setIsLoading(false);
        return response.json();
      })
      .then((data) => {
        const formattedAddress = data.results[0].formatted_address;
        if (
          formattedAddress.toLowerCase().includes("Milano") ||
          formattedAddress.toLowerCase().includes("Cosenza") ||
          formattedAddress.toLowerCase().includes("Roma") ||
          formattedAddress.toLowerCase().includes("Torino") ||
          formattedAddress.toLowerCase().includes("Napoli") ||
          formattedAddress.toLowerCase().includes("Firenze")
        ) {
        } else {
          setShow(true);
        }
      })
      .catch((error) => {
        setError(error.status);
      });
  };

  const getLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchData(position.coords.latitude, position.coords.longitude);
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          setError(error.message);
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const accessData = localStorage.getItem("tokenUser");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 560) {
        setFormVisible(true);
      } else {
        setFormVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
  }, [window.scrollY, accessData]);

  return (
    <>
      <Container
        fluid
        className={
          darkMode ? "p-0 overflow-x-hidden bg-black" : "p-0 overflow-x-hidden"
        }
        data-bs-theme={darkMode ? "dark" : "light"}
      >
        <Row className="header-bg d-flex flex-column flex-md-row justify-content-center align-items-center">
          <h3 className="text-white text-center main-text mt-md-5">
            Sapore di consegne, rapidità di servizio: il tuo mondo a portata di
            click con <span className="fw-bold">Food2You! 😁</span>
          </h3>
          <Col className=" align-items-center justify-content-around py-2 col-md-4">
            <div className="d-flex justify-content-center">
              <img alt="hamburger" src={gifImage} style={{ width: "100%" }} />
            </div>
          </Col>
          {selectedCity !== "" ? (
            <Col className="col-12 text-center text-white ">
              <h3 className="heartbeat">
                Scorri in basso per scegliere il tuo ristorante su:{" "}
                {selectedCity}
              </h3>
            </Col>
          ) : (
            <Parallax
              speed={12}
              className="d-flex justify-content-center mt-md-5 mb-2"
            >
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
                      placeholder="Dove lo consegniamo?"
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
            </Parallax>
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
                  placeholder="Dove lo consegniamo?"
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
          <img src={darkMode ? bgHeaderDark : bgHeader} className="p-0" />
        </Row>
        {showCityModal && (
          <SelectCityModal
            show={showCityModal}
            setShow={() => setShowCityModal(false)}
          />
        )}
        <MainContent />
        <RestaurantsCarousel />
        <MostUsedCategories />
        <InfoSection />
        {/* REVIEWS */}
        <ReviewsSection />
        <Modal
          show={show}
          onHide={() => {
            setShow(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Spiacenti :(</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Al momento il tuo indirizzo non è supportato dalla nostra app.
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="shadow-card"
              variant="warning"
              onClick={() => {
                setShow(false);
              }}
            >
              Chiudi
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={isLoading} className="loading-modal">
          <Modal.Body className="d-flex justify-content-center">
            <div className="spinner2">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default Homepage;
