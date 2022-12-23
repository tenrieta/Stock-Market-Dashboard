import { SELECTED_STOCK } from "../actions/types";
import symbols from "../../data/stocks";

export default function chosenStockReducer(
  state = symbols[0].symbol,
  action = {}
) {
  switch (action.type) {
    case SELECTED_STOCK:
      return action.payload.stockSymbol;
    default:
      return state;
  }
}
