import { useDispatch } from "react-redux";

export function generateRandomMobileNumber() {
  const countryCode = "+39";
  const mobileNumber =
    countryCode +
    Math.floor(Math.random() * 10000000000)
      .toString()
      .padStart(10, "0");
  return mobileNumber;
}

export const autoLoginClient = (payload) => {
  fetch("https://localhost:3030/auth/login", {
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
        // setLoginError(true);
        throw new Error("errore nel login");
      }
    })
    .then((data) => {
      console.log(data);
      localStorage.setItem("tokenUser", "Bearer " + data.token);

      // setLoginError(false);
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
};
