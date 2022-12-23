import { SELECTED_STOCK } from "./types";

const selectStock = (stockSymbol) => ({
  type: SELECTED_STOCK,
  payload: { stockSymbol },
});

export default selectStock;
