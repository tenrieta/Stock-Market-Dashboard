import { ADD_STOCK_DATA } from "./types";

const addStockData = (stockSymbol, stockData) => ({
  type: ADD_STOCK_DATA,
  payload: { stockSymbol, stockData },
});

export default addStockData;
