import React from "react";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import { render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import {
  signInWithEmailAndPassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";
import store from "../store";
import Profile from "./Profile";

const mockStore = configureStore([]);

describe("SNAPSHOT TESTS", () => {
  test("Profile snapshot renders", async () => {
    const mockStoreInstance = mockStore({
      currentUser: { email: "jest@example.com" },
    });
    const component = renderer.create(
      <Provider store={mockStoreInstance}>
        <Profile />
      </Provider>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("UNIT TESTS", () => {
  test("Update profile button is disabled if no password is provided.", () => {
    const { getByRole } = render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );
    const oldPassword = getByRole("textbox", { name: "oldPassword" });
    const submitButton = getByRole("button", { name: "Update your profile" });
    expect(submitButton).toHaveAttribute("disabled");
    fireEvent.change(oldPassword, { target: { value: "abc123" } });
    expect(submitButton).not.toHaveAttribute("disabled");
  });
});

describe("INTEGRATION TESTS", () => {
  test("Update profile should throw error on wrong credentials.", async () => {
    let error = "";
    const incorrectPassword = "xxx";
    const correctPassword = "abc123";
    const newDisplayName = Math.floor(Math.random() * 1000 + 1).toString();
    await signInWithEmailAndPassword(auth, "jest@example.com", correctPassword);
    expect(auth.currentUser).toBeTruthy();
    expect(auth.currentUser.email).toBe("jest@example.com");

    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        incorrectPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updateProfile(auth.currentUser, { displayName: newDisplayName });
    } catch (err) {
      error = err.toString();
    }
    expect(error).toMatch(/auth\/wrong-password/);
  });

  test("Update displayName should work.", async () => {
    const correctPassword = "abc123";
    const newDisplayName = Math.floor(Math.random() * 1000 + 1).toString();
    await signInWithEmailAndPassword(auth, "jest@example.com", correctPassword);
    expect(auth.currentUser).toBeTruthy();
    expect(auth.currentUser.email).toBe("jest@example.com");

    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        correctPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updateProfile(auth.currentUser, { displayName: newDisplayName });
    } catch (err) {
      console.log(err.toString());
    }
    expect(auth.currentUser.displayName).toBe(newDisplayName);
  });
});
