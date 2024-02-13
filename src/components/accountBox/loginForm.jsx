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
import { useDispatch } from "react-redux";
import { Alert } from "react-bootstrap";

export function LoginForm(props) {
  const { switchToSignup } = useContext(AccountContext);
  const [loginError, setLoginError] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const bodyLogin = {
    email: email,
    password: password,
  };

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch({ type: "SHOW_LOGIN_MODAL", payload: false });
  };

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
          return res.json();
        } else {
          setLoginError(true);
          throw new Error("errore nel login");
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
        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
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
