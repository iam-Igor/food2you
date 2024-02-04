import { Col, Container, Row, Form, Button } from "react-bootstrap";

import bgHeader from "../assets/img/layered-waves-haikei (6).png";
import hamburger from "../assets/img/95af3cd3-85de-4f17-92e8-647af7967071-removebg-preview.png";

const Homepage = () => {
  return (
    <Container fluid>
      <Row className="flex-column">
        {/* HEADER */}
        <Col
          className="header-col d-flex align-items-center justify-content-around py-md-5 py-2"
          style={{
            backgroundImage: `url(${bgHeader})`,
            backgroundSize: "cover",
          }}
        >
          <div className="w-25 d-flex">
            <img alt="hamburger" src={hamburger} style={{ width: "60%" }} />
          </div>
          <div>
            <p className="text-white">
              Cerca la tua città o usa la tua posizione
            </p>
            <Form className="d-flex align-items-center">
              <Form.Group>
                <Form.Control
                  type="email"
                  placeholder="Cerca la tua città"
                  className="rounded-4"
                />
              </Form.Group>
              <Button className="ms-3 rounded-pill">Cerca</Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Homepage;
