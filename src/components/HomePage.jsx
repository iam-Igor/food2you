import { Col, Container, Row, Form, Button } from "react-bootstrap";

import bgHeader from "../assets/img/wave-haikei.svg";
import hamburger from "../assets/img/95af3cd3-85de-4f17-92e8-647af7967071-removebg-preview.png";
import { useEffect, useState } from "react";

const Homepage = () => {
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 360) {
        setFormVisible(true);
      } else {
        setFormVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
  }, [window.scrollY]);

  return (
    <Container fluid>
      <Row className="header-bg d-flex flex-md-row justify-content-center align-items-center">
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
              />
            </Form.Group>
            <Button className="mt-2 rounded-pill align-self-start">
              Cerca
            </Button>
          </Form>
        </Col>

        <Col className={formVisible ? "col-12 scende mt-3" : "col-12 sale "}>
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
              />
            </Form.Group>
            <Button className="mt-2 rounded-pill align-self-start">
              Cerca
            </Button>
          </Form>
        </Col>
      </Row>
      <Row className="p-0">
        <img src={bgHeader} className="p-0" />
      </Row>
      <Row className="p-0">
        <img src={bgHeader} className="p-0" />
      </Row>
      <Row className="p-0">
        <img src={bgHeader} className="p-0" />
      </Row>
    </Container>
  );
};

export default Homepage;
