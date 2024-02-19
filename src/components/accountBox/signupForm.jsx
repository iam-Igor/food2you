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
import { autoLoginClient } from "../../functions";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Alert } from "react-bootstrap";

export function SignupForm(props) {
  const { switchToSignin } = useContext(AccountContext);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerError, setRegisterError] = useState(false);

  // HOOKS FOR REGISTER PAYLOAD
  const [name, setName] = useState("");
  const [surname, setsurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");

  const bodyLogin = {
    email: email,
    password: password,
  };

  const payload = {
    name: name,
    lastname: surname,
    email: email,
    password: password,
    address: address,
    username: username,
  };

  const registerUser = (payload) => {
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
        autoLoginClient(bodyLogin);
        setRegisterError(false);
      })
      .catch((err) => {
        console.log(err);
        dispatch({ type: "SHOW_LOGIN_MODAL", payload: false });
        navigate("/bad_request");
      });
  };

  return (
    <BoxContainer>
      <FormContainer>
        <Input
          type="text"
          placeholder="Nome"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <Input
          type="text"
          placeholder="Cognome"
          onChange={(e) => {
            setsurname(e.target.value);
          }}
        />
        <Input
          type="text"
          placeholder="Username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <Input
          type="text"
          placeholder="Indirizzo completo"
          onChange={(e) => {
            setAddress(e.target.value);
          }}
        />
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
      {registerError && (
        <Alert variant="danger" style={{ fontSize: "0.9em" }} className="mt-2">
          Tutti i campi sono obbligatori!
        </Alert>
      )}

      <Marginer direction="vertical" margin={10} />
      <SubmitButton
        type="submit"
        onClick={() => {
          if (
            name !== "" &&
            surname !== "" &&
            username !== "" &&
            address !== "" &&
            email !== "" &&
            password !== ""
          ) {
            registerUser(payload);
          } else {
            setRegisterError(true);
          }
        }}
      >
        Signup
      </SubmitButton>

      <Marginer direction="vertical" margin="5px" />
      <LineText>
        Hai gia un account? <BoldLink onClick={switchToSignin}>Login</BoldLink>
      </LineText>
    </BoxContainer>
  );
}
