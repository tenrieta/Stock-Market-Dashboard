import { SET_USER, UNSET_USER } from "../actions/types";

const initialState = {
  uid: null,
  displayName: null,
  email: null,
  photoURL: null,
};

export default function userReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_USER:
      return action.payload;
    case UNSET_USER:
      return initialState;
    default:
      return state;
  }
}
