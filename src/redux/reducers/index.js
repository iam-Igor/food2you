const initialState = {
  showModalregister: false,
};

const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SHOW_LOGIN_MODAL":
      return {
        ...state,
        showModalregister: action.payload,
      };

    default:
      return state;
  }
};

export default mainReducer;
