import { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

const RegisterForm = () => {
  const showModalLogin = useSelector((state) => state.showModalregister);
  const dispatch = useDispatch();

  const [loginError, setLoginError] = useState(false);

  const [loginClicked, setLoginClicked] = useState(false);

  // HOOKS FOR REGISTER PAYLOAD
  const [name, setName] = useState("");
  const [surname, setsurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");

  const payload = {
    name: name,
    lastname: surname,
    email: email,
    password: password,
    address: address,
    username: username,
  };

  const registerUser = () => {
    fetch("http://localhost:3030/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("errore nella registrazione");
        }
      })
      .then((data) => {
        console.log(data);
        autoLoginClient();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const bodyLogin = {
    email: email,
    password: password,
  };

  const autoLoginClient = () => {
    fetch("http://localhost:3030/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyLogin),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          setLoginError(true);
          throw new Error("errore nel login");
        }
      })
      .then((data) => {
        console.log(data);
        localStorage.setItem("tokenUser", "Bearer " + data.token);
        handleClose();
        setLoginError(false);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClose = () => {
    dispatch({ type: "SHOW_LOGIN_MODAL", payload: false });
  };

  return (
    <Modal show={showModalLogin}>
      <div className={loginClicked ? "testo-out" : ""}>
        <Modal.Title className="text-center">Registra i tuoi dati</Modal.Title>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              registerUser();
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                rows={3}
                autoFocus
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cognome</Form.Label>
              <Form.Control
                type="text"
                rows={3}
                onChange={(e) => {
                  setsurname(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                rows={3}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Indirizzo</Form.Label>
              <Form.Control
                type="text"
                rows={3}
                placeholder="Es. Via Roma 15, Milano"
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                rows={3}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Form.Group>
            <Button variant="success" className="me-3 mb-3" type="submit">
              Registrati
            </Button>
          </Form>
        </Modal.Body>
        <div className="d-flex align-items-center justify-content-between">
          <h6 className="ms-3">
            Hai gia un account?
            <span
              className="ms-2 text-primary"
              onClick={() => {
                setLoginClicked(true);
              }}
            >
              Login
            </span>
          </h6>
          <Button
            variant="secondary"
            className="me-3 mb-3"
            onClick={handleClose}
          >
            Chiudi
          </Button>
        </div>
      </div>
      {loginClicked && (
        <div className={loginClicked ? "testo-in" : ""}>
          <Modal.Title className="text-center">
            Registra i tuoi dati
          </Modal.Title>
          <Modal.Body>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                autoLoginClient();
              }}
            >
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  rows={3}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </Form.Group>
              {loginError && (
                <Alert variant="danger">Username o password errati!</Alert>
              )}

              <Button variant="success" className="me-3 mb-3" type="submit">
                Login
              </Button>
            </Form>
          </Modal.Body>
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="ms-2">
              Non hai un account?{" "}
              <span
                className="text-primary"
                onClick={() => setLoginClicked(false)}
              >
                Registrati
              </span>
            </h5>
            <Button
              variant="secondary"
              className="me-3 mb-3"
              onClick={() => {
                handleClose();
                setLoginClicked(false);
              }}
            >
              Chiudi
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default RegisterForm;
