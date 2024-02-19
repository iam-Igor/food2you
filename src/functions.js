import { useDispatch } from "react-redux";
import { json } from "react-router-dom";

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

//BACK OFFICE

// Restaurant

export const getAllRestaurants = () => {
  return fetch("http://localhost:3030/restaurants")
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Errore nel caricamento dei dati ristorante");
      }
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const addNewRestaurant = (payload) => {
  return fetch("http://localhost:3030/admin/restaurant/new", {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("tokenUser"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Errore nell' upload del ristorante");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateRestaurant = (id, payload) => {
  return fetch("http://localhost:3030/admin/restaurant/update/" + id, {
    method: "PATCH",
    headers: {
      Authorization: localStorage.getItem("tokenUser"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (res.ok) {
        console.log("modificato");
        return res.json();
      } else {
        throw new Error("Errore nell' upload del ristorante");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteRestaurant = (id) => {
  return fetch("http://localhost:3030/admin/restaurant/" + id, {
    method: "DELETE",
    headers: {
      Authorization: localStorage.getItem("tokenUser"),
    },
  })
    .then((res) => {
      if (res.ok) {
        return true;
      } else {
        throw new Error("Errore nell' eliminazione del ristorante");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const filterByCityAndSummary = (city, summary) => {
  return fetch(
    "http://localhost:3030/restaurants/search?city=" +
      city +
      "&summary=" +
      summary
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("errore nella ricerca del ristorante");
      }
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};
