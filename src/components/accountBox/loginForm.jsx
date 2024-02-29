import React, { useContext, useState } from "react";
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  LineText,
  MutedLink,
  SubmitButton,
} from "./common";
import { Marginer } from "../marginer";
import { AccountContext } from "./accountContext";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { evaluateError } from "../../functions";

export function LoginForm(props) {
  const { switchToSignup } = useContext(AccountContext);
  const [loginError, setLoginError] = useState(false);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const bodyLogin = {
    email: email,
    password: password,
  };

  const dispatch = useDispatch();

  const handleClose = () => {};

  const autoLoginClient = (payload) => {
    fetch("http://localhost:3030/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok) {
          dispatch({ type: "SHOW_LOGIN_MODAL", payload: false });
          return res.json();
        } else {
          if (res.status === 401) {
            setLoginError(true);
          } else {
            evaluateError(res.status, navigate, dispatch);
            throw new Error("errore nel login");
          }
        }
      })
      .then((data) => {
        console.log(data);
        localStorage.setItem("tokenUser", "Bearer " + data.token);
        setLoginError(false);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <BoxContainer>
      <FormContainer>
        <Input
          type="email"
          placeholder="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <div className="d-flex align-items-center">
          {" "}
          <Input
            className="password-input"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <div
            className="eye-container d-flex align-items-center"
            onClick={() => {
              setShowPassword(!showPassword);
            }}
          >
            {" "}
            <i
              className={
                showPassword
                  ? "bi bi-eye-slash-fill fs-3 ms-1 me-1"
                  : "bi bi-eye-fill fs-3 ms-1 me-1"
              }
            ></i>
          </div>
        </div>
      </FormContainer>
      {loginError && (
        <Alert variant="danger" style={{ fontSize: "0.9em" }} className="mt-2">
          Username o password errati!
        </Alert>
      )}
      <Marginer direction="vertical" margin={10} />
      <MutedLink href="#">Hai dimenticato la password?</MutedLink>
      <Marginer direction="vertical" margin="1.6em" />
      <SubmitButton
        type="submit"
        onClick={() => {
          autoLoginClient(bodyLogin);
          handleClose();
        }}
      >
        Login
      </SubmitButton>
      <Marginer direction="vertical" margin="5px" />
      <LineText>
        Non hai un account?{" "}
        <BoldLink onClick={switchToSignup} href="#">
          Registrati
        </BoldLink>
      </LineText>
    </BoxContainer>
  );
}
