import addStockData from "../actions/stockDataActions";
import stockDataReducer from "./stockDataReducer";
import selectStock from "../actions/chosenStockActions";
import { setUser, unsetUser } from "../actions/userActions";
import chosenStockReducer from "./chosenStockReducer";
import userReducer from "./userReducer";
import symbols from "../../data/stocks";

const stockSymbol = "IBM";
const stockData = {
  stockPrices: { x: "2022-01-01", y: ["250", "251", "252", "253"] },
  stockVolume: { x: "2022-01-01", y: "1234567" },
};

const emptyUser = {
  uid: null,
  displayName: null,
  email: null,
  photoURL: null,
};
const userData = {
  uid: 1,
  email: "jest@example.com",
  displayName: "John Doe",
  photoURL: "",
  firestore: { wallet: 1000 },
};

describe("REDUCERS", () => {
  it("Reducer addStockData should work.", () => {
    const action = addStockData(stockSymbol, stockData);
    const oldState = {
      AAPL: {
        stockPrices: { x: "2022-01-01", y: ["101", "102", "103", "104"] },
        stockVolume: { x: "2022-01-01", y: "7654321" },
      },
    };
    const newState = stockDataReducer(oldState, action);
    expect(newState).toEqual({
      ...oldState,
      [stockSymbol]: stockData,
    });
  });
  it("Reducer chosenStockReducer should work.", () => {
    const action = selectStock(stockSymbol);
    const oldState = symbols[0].symbol;
    const newState = chosenStockReducer(oldState, action);
    expect(newState).toEqual(stockSymbol);
  });
  it("Reducer userReducer should work.", () => {
    const actionSet = setUser(userData);
    const newStateSet = userReducer(emptyUser, actionSet);
    expect(newStateSet).toEqual(userData);
    const actionUnset = unsetUser(userData);
    const newStateUnset = userReducer(emptyUser, actionUnset);
    expect(newStateUnset).toEqual(emptyUser);
  });
});
