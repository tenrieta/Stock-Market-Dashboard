import { ADD_STOCK_DATA } from "../actions/types";

export default function stockDataReducer(state = {}, action = {}) {
  switch (action.type) {
    case ADD_STOCK_DATA:
      return {
        ...state,
        [action.payload.stockSymbol]: action.payload.stockData,
      };
    default:
      return state;
  }
}
