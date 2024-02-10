import { Col, Container, Row } from "react-bootstrap";
import notFound from "../assets/img/404error.jpg";

const NotFoundPage = () => {
  return (
    <Container>
      <Row>
        <Col className="d-flex justify-content-center align-items-center">
          <img alt="not-found-img" src={notFound} style={{ width: "50%" }} />
          <h1>404-Non c'è niente qui.</h1>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;
