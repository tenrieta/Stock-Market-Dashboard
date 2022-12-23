import { combineReducers } from "redux";
import userReducer from "./userReducer";
import stockDataReducer from "./stockDataReducer";
import chosenStockReducer from "./chosenStockReducer";

export default combineReducers({
  currentUser: userReducer,
  stockData: stockDataReducer,
  chosenStock: chosenStockReducer,
});
