import { Accordion, Row } from "react-bootstrap";

import ProductsSection from "./ProductsSection";
import OrdersSection from "./OrdersSection";
import UserSection from "./UsersSection";
import RestaurantsSection from "./RestaurantsSection";

const BackOffice = () => {
  return (
    <Row>
      <Accordion className="profile-accordion">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Sezione Ristoranti</Accordion.Header>
          <Accordion.Body className="d-flex flex-column align-items-center">
            <RestaurantsSection />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1" className="my-3">
          <Accordion.Header>Sezione Prodotti</Accordion.Header>
          <Accordion.Body>
            <ProductsSection />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Sezione Ordini</Accordion.Header>
          <Accordion.Body>
            <OrdersSection />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3" className="mt-3">
          <Accordion.Header>Sezione Utenti</Accordion.Header>
          <Accordion.Body>
            <UserSection />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Row>
  );
};

export default BackOffice;
