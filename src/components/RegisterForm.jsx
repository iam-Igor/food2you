import { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import AccountBox from "../components/accountBox/index";

const RegisterForm = () => {
  const showModalLogin = useSelector((state) => state.showModalregister);

  const [loginClicked, setLoginClicked] = useState(false);

  const dispatch = useDispatch();

  return (
    <Modal
      onHide={() => {
        dispatch({ type: "SHOW_LOGIN_MODAL", payload: false });
      }}
      show={showModalLogin}
      id="modal-login"
      className="d-flex justify-content-center"
    >
      <Modal.Body>
        <AccountBox />
      </Modal.Body>
    </Modal>
  );
};

export default RegisterForm;
