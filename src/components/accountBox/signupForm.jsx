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

export function SignupForm(props) {
  const { switchToSignin } = useContext(AccountContext);

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
      })
      .catch((err) => {
        console.log(err);
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
      <Marginer direction="vertical" margin={10} />
      <SubmitButton
        type="submit"
        onClick={() => {
          registerUser(payload);
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
