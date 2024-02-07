import { Col, Container, Row, Form, Button } from "react-bootstrap";

import bgHeader from "../assets/img/wave-haikei.svg";
import hamburger from "../assets/img/95af3cd3-85de-4f17-92e8-647af7967071-removebg-preview.png";
import { useEffect, useState } from "react";
import SelectCityModal from "./SelectCityModal";

const Homepage = () => {
  const [formVisible, setFormVisible] = useState(false);

  const [showCityModal, setShowCityModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      console.log(window.scrollY);
      if (window.scrollY > 300) {
        setFormVisible(true);
      } else {
        setFormVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
  }, [window.scrollY]);

  return (
    <Container fluid>
      <Row className="header-bg d-flex flex-column flex-md-row justify-content-center align-items-center">
        <h3 className="text-white text-center w-50">
          Sapore di consegne, rapidità di servizio: il tuo mondo a portata di
          clic con Food2You!
        </h3>
        <Col className=" align-items-center justify-content-around py-5 col-md-4">
          <div className="d-flex">
            <img alt="hamburger" src={hamburger} style={{ width: "100%" }} />
          </div>
        </Col>
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
                  setShowCityModal(true);
                }}
              />
            </Form.Group>
          </Form>
        </Col>
        <Col
          className={
            formVisible
              ? "col-12 scende mt-3 topbar py-3"
              : "col-12 sale topbar py-3"
          }
        >
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
                  setShowCityModal(true);
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
    </Container>
  );
};

export default Homepage;
