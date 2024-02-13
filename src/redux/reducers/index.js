const initialState = {
  showModalregister: false,
  restaurantSelected: {},
  showOffCanvas: false,
  showCart: false,
  userPosition: "",
  lon: 0,
  lat: 0,
  cart: [],
  orderPayload: {},
  showNotification: false,
  orderCompleted: false,
  showOrdersBadge: false,
};

const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SHOW_LOGIN_MODAL":
      return {
        ...state,
        showModalregister: action.payload,
      };
    case "SHOW_ORDER_BADGES":
      return {
        ...state,
        showOrdersBadge: action.payload,
      };
    case "SHOW_NOTIFICATION":
      return {
        ...state,
        showNotification: action.payload,
      };
    case "SET_ORDER_COMPLETED":
      return {
        ...state,
        orderCompleted: action.payload,
      };
    case "SHOW_CART":
      return {
        ...state,
        showCart: action.payload,
      };
    case "SAVE_ORDER_PAYLOAD":
      return {
        ...state,
        orderPayload: action.payload,
      };
    case "ADD_TO_CART":
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item, i) => i !== action.payload),
      };
    case "SHOW_OFF_CANVAS":
      return {
        ...state,
        showOffCanvas: action.payload,
      };
    case "SET_USER_POSITION":
      return {
        ...state,
        userPosition: action.payload,
      };
    case "SET_REST_SELECTED":
      return {
        ...state,
        restaurantSelected: action.payload,
      };
    case "SET_LON":
      return {
        ...state,
        lon: action.payload,
      };
    case "SET_LAT":
      return {
        ...state,
        lat: action.payload,
      };

    default:
      return state;
  }
};

export default mainReducer;
