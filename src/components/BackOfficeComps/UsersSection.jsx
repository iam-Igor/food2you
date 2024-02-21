import { useEffect, useState } from "react";
import { Button, Col, Form, ListGroup, Modal } from "react-bootstrap";
import { getAllusers } from "../../functions";

const UserSection = () => {
  const [showSection, setShowSection] = useState(false);

  const [page, setpage] = useState(0);
  const [size, setSize] = useState(15);
  const [order, setorder] = useState("");

  const [userData, setUserData] = useState(null);

  const [showUserDetails, setShowuserDetails] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const getUsers = () => {
    getAllusers(page, size, order).then((data) => {
      setUserData(data);
    });
  };

  useEffect(() => {
    getUsers();
  }, [page, size, order]);

  return (
    <Col>
      <div className="text-center">
        <Button
          onClick={() => {
            setShowSection(!showSection);
          }}
        >
          Visualizza tutti
        </Button>
      </div>
      {userData && showSection && (
        <div>
          <div className="d-flex flex-column flex-md-row">
            <Form.Select
              aria-label="Default select example"
              className="my-3"
              onChange={(e) => {
                setorder(e.target.value);
              }}
            >
              <option value="id">Ordina per</option>
              <option value="id">ID</option>
              <option value="name">Nome</option>
              <option value="lastname">Cognome</option>
              <option value="username">Username</option>
            </Form.Select>
            <Form.Select
              aria-label="Default select example"
              className="my-md-3 mx-md-2"
              onChange={(e) => {
                setSize(e.target.value);
              }}
            >
              <option value="15">Elementi</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </Form.Select>
          </div>
          <div>
            <ListGroup>
              {userData.content.map((user, i) => {
                return (
                  <ListGroup.Item
                    key={i}
                    className="d-flex pointer mt-2"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowuserDetails(true);
                    }}
                  >
                    <span className="fw-bold">ID: {user.id},</span> {user.name}{" "}
                    {user.lastname}, {user.username}
                    <i className="bi bi-pencil ms-auto"></i>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </div>
        </div>
      )}
      {showUserDetails && selectedUser && (
        <Modal
          show={showUserDetails}
          onHide={() => {
            setShowuserDetails(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Dettagli utente con id: {selectedUser.id}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex flex-column justify-content-center align-items-center">
              <p className="m-0 fw-bold">Avatar</p>
              <img
                alt="user avatar"
                src={selectedUser.avatarUrl}
                style={{ width: "30%" }}
              />
            </div>
            <ul className="list-unstyled">
              <li>Nome: {selectedUser.name}</li>
              <li>Cognome: {selectedUser.lastname}</li>
              <li>Indirizzo: {selectedUser.address}</li>
              <li>Email: {selectedUser.email}</li>
              <li>Abilitato: {selectedUser.enabled === true ? "Si" : "No"}</li>
              <li>Ruolo: {selectedUser.authorities[0].authority}</li>
              <li>Username: {selectedUser.username}</li>
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowuserDetails(false);
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Col>
  );
};

export default UserSection;
