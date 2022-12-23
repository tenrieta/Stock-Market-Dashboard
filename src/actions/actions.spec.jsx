/* eslint-disable no-unused-vars */
import React from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import configureStore from "redux-mock-store";
import renderer from "react-test-renderer";

import { auth } from "../firebase";
import { ADD_STOCK_DATA, SELECTED_STOCK, SET_USER, UNSET_USER } from "./types";
import addStockData from "./stockDataActions";
import selectStock from "./chosenStockActions";
import { updateUser, setUser, unsetUser } from "./userActions";
import Profile from "../pages/Profile";

const mockStore = configureStore([thunk]);
const stockSymbol = "IBM";
const stockData = {
  stockPrices: { x: "2022-01-01", y: ["250", "251", "252", "253"] },
  stockVolume: { x: "2022-01-01", y: "1234567" },
};
const userData = {
  uid: 1,
  email: "jest@example.com",
  displayName: "John Doe",
  photoURL: "",
  firestore: { wallet: 1000 },
};
const formData = {
  email: "jest@example.com",
  oldPassword: "abc123",
  password1: "",
  displayName: "Jim Halpert",
  photoURL: "",
  firestore: { wallet: 1000 },
};
const setFormData = () => true;

describe("ACTION CREATORS", () => {
  it("chosenStockActions.js -> Action creator addStockData should work.", () => {
    const action = addStockData(stockSymbol, stockData);

    expect(action).toEqual({
      type: ADD_STOCK_DATA,
      payload: { stockSymbol, stockData },
    });
  });
  it("stockDataActions.js -> Action creator selectStock should work.", () => {
    const action = selectStock(stockSymbol);

    expect(action).toEqual({
      type: SELECTED_STOCK,
      payload: { stockSymbol },
    });
  });
  it("userActions.js -> Action creator setUser should work.", () => {
    const userAction = setUser(userData);
    expect(userAction).toEqual({
      type: SET_USER,
      payload: userData,
    });
  });
  it("userActions.js -> Action creator unsetUser should work.", () => {
    const userAction = unsetUser();
    expect(userAction).toEqual({
      type: UNSET_USER,
    });
  });
});

/*
describe("ACTION CREATORS WITH REDUX", () => {
  it("userActions.js -> Action creator updateUser should work.", async () => {
    const mockStoreInstance = mockStore({ currentUser: userData });
    const component = renderer.create(
      <Provider store={mockStoreInstance}>
        <Profile />
      </Provider>
    );

    await signInWithEmailAndPassword(auth, "jest@example.com", "abc123");

    renderer.act(() => {
      component.root.findByProps({ name: "displayName" }).props.onChange({
        target: { name: "displayName", value: "Jim Halpert" },
      });
    });

    expect(
      component.root.findByProps({ name: "displayName" }).props.value
    ).toBe("Jim Halpert");

    renderer.act(() => {
      component.root.findByType("form").props.onSubmit();
      // component.root.findByProps({ id: "submit-button" }).props.onClick();
    });
    const newState = mockStoreInstance.getState();
    expect(newState.currentUser.displayName).toBe("Jim Halpert");
  });
});
*/
