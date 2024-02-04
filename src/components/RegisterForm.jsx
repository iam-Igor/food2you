import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

const RegisterForm = () => {
  const showModalLogin = useSelector((state) => state.showModalregister);

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch({ type: "SHOW_LOGIN_MODAL", payload: false });
  };

  return (
    <Modal show={showModalLogin}>
      <Modal.Title className="text-center">Registra i tuoi dati</Modal.Title>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control type="text" rows={3} autoFocus />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cognome</Form.Label>
            <Form.Control type="text" rows={3} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="name@example.com" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" rows={3} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <div className="text-end">
        <Button variant="success" className="me-3 mb-3">
          Registrati
        </Button>
        <Button variant="secondary" className="me-3 mb-3" onClick={handleClose}>
          Chiudi
        </Button>
      </div>
    </Modal>
  );
};

export default RegisterForm;
