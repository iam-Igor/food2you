const initialState = {
  showModalregister: false,
  userPosition: "",
  lon: 0,
  lat: 0,
};

const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SHOW_LOGIN_MODAL":
      return {
        ...state,
        showModalregister: action.payload,
      };
    case "SET_USER_POSITION":
      return {
        ...state,
        userPosition: action.payload,
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
