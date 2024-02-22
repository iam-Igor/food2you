import { useDispatch } from "react-redux";
import { json } from "react-router-dom";

// Profilo

export const deleteMyProfile = () => {
  return fetch("http://localhost:3030/users/me", {
    method: "DELETE",
    headers: {
      Authorization: localStorage.getItem("tokenUser"),
    },
  })
    .then((res) => {
      if (res.ok) {
        return true;
      } else {
        throw new Error("Errore nell' eliminazione del profilo");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

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

export const uploadRestaurantPicture = (id, image) => {
  return fetch("http://localhost:3030/admin/restaurant/upload/" + id, {
    method: "PATCH",
    headers: {
      Authorization: localStorage.getItem("tokenUser"),
      Accept: "application/json",
    },
    body: image,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Errore durante la richiesta");
      }

      return response.url;
    })
    .catch((error) => {
      console.error("Si è verificato un errore durante la richiesta:", error);
    });
};

//PRODUCTS

export const uploadProductPicture = (id, image) => {
  return fetch("http://localhost:3030/admin/product/upload/" + id, {
    method: "PATCH",
    headers: {
      Authorization: localStorage.getItem("tokenUser"),
      Accept: "application/json",
    },
    body: image,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Errore durante la richiesta");
      }

      return response.url;
    })
    .catch((error) => {
      console.error("Si è verificato un errore durante la richiesta:", error);
    });
};

export const addNewProduct = (payload) => {
  return fetch("http://localhost:3030/admin/products/new", {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("tokenUser"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (res.ok) {
        console.log("prodotto caricato!");
        return res.json();
      } else {
        throw new Error("Errore nell' upload del prodotto");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getAllProducts = (page, size, order) => {
  if (!page) {
    page = 0;
  }
  if (!size) {
    size = 15;
  }
  if (!order) {
    order = "id";
  }
  return fetch(
    "http://localhost:3030/products?page=" +
      page +
      "&size=" +
      size +
      "&order=" +
      order
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("errore nel caricamento dei prodotti");
      }
    })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const findProdsByName = (page, size, order, name) => {
  if (!page) {
    page = 0;
  }
  if (!size) {
    size = 15;
  }
  if (!order) {
    order = "id";
  }

  return fetch(
    "http://localhost:3030/products/search?page=" +
      page +
      "&size=" +
      size +
      "&name=" +
      name
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("errore nella ricerca dei prodotti");
      }
    })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateProduct = (payload, id) => {
  return fetch("http://localhost:3030/admin/products/update/" + id, {
    method: "PATCH",
    headers: {
      Authorization: localStorage.getItem("tokenUser"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (res.ok) {
        console.log("prodotto modificato!");
        return res.json();
      } else {
        throw new Error("Errore nell' upload del prodotto");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteProduct = (id) => {
  return fetch("http://localhost:3030/admin/products/" + id, {
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

// SEZIONE ORDINI

export const getAllorders = (page, size, order) => {
  if (!page) {
    page = 0;
  }
  if (!size) {
    size = 15;
  }
  if (!order) {
    order = "id";
  }

  return fetch(
    "http://localhost:3030/admin/orders?page=" +
      page +
      "&size=" +
      size +
      "&order=" +
      order,
    {
      headers: { Authorization: localStorage.getItem("tokenUser") },
    }
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("errore nella ricerca dei prodotti");
      }
    })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};

// SEZIONE UTENTI

export const getAllusers = (page, size, order) => {
  if (!page) {
    page = 0;
  }
  if (!size) {
    size = 15;
  }
  if (!order) {
    order = "id";
  }

  return fetch(
    "http://localhost:3030/admin/users?page=" +
      page +
      "&size=" +
      size +
      "&order=" +
      order,
    {
      headers: { Authorization: localStorage.getItem("tokenUser") },
    }
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("errore nella ricerca dei prodotti");
      }
    })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};
