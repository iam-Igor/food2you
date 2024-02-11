import { Col, Container, Row, Form, Button, Toast } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import bgHeader from "../assets/img/wave-haikei.svg";
import hamburger from "../assets/img/95af3cd3-85de-4f17-92e8-647af7967071-removebg-preview.png";
import { useEffect, useState } from "react";
import SelectCityModal from "./SelectCityModal";
import { useDispatch, useSelector } from "react-redux";
import MainContent from "./MainContent";
import RestaurantsCarousel from "./RestaurantsCarousel";
import InfoSection from "./InfoSection";
import "react-toastify/dist/ReactToastify.css";

const Homepage = () => {
  const [formVisible, setFormVisible] = useState(false);
  const selectedCity = useSelector((state) => state.userPosition);
  const dispatch = useDispatch();
  const [showCityModal, setShowCityModal] = useState(false);

  const showNotification = useSelector((state) => state.showNotification);

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

  const notify = () => {
    toast("🍔  Il tuo ordine è quasi pronto!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      toastId: "customId1",
    });
  };

  useEffect(() => {
    if (showNotification) {
      notify();
    }
  });

  return (
    <Container fluid className="px-0">
      {showNotification && (
        <ToastContainer
          limit={1}
          position="top-right"
          autoClose={false}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          theme="light"
          onClick={() => {
            alert("ciao");
          }}
        />
      )}

      <Row className="header-bg d-flex flex-column flex-md-row justify-content-center align-items-center">
        <h3 className="text-white text-center w-50">
          Sapore di consegne, rapidità di servizio: il tuo mondo a portata di
          clic con <span className="fw-bold">Food2You!</span>
        </h3>
        <Col className=" align-items-center justify-content-around py-5 col-md-4">
          <div className="d-flex">
            <img
              alt="hamburger"
              src={hamburger}
              style={{ width: "100%" }}
              className="rotate-center"
            />
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
            <Form className="d-flex  flex-column ">
              <p className="text-white">
                Cerca la tua città o usa la tua posizione
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
            <p className="text-white">
              {selectedCity !== ""
                ? "Hai sbagliato città? Cerca la tua città o usa la tua posizione"
                : "Cerca la tua città o usa la tua posizione"}
              <i className="bi bi-geo-alt-fill fs-4 ms-2"></i>
            </p>
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
