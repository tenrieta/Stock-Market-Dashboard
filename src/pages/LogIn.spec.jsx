import React from "react";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import { render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";
import store from "../store";
import LogIn from "./LogIn";

describe("SNAPSHOT TESTS", () => {
  test("SignUp snapshot renders", () => {
    const component = renderer.create(
      <Provider store={store}>
        <LogIn />
      </Provider>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("UNIT TESTS", () => {
  test("Log In form is usable.", () => {
    const { getByRole, getByLabelText } = render(
      <Provider store={store}>
        <LogIn />
      </Provider>
    );

    const emailInput = getByLabelText(/Email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");

    const passwordInput = getByLabelText(/Password/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");

    const submitButton = getByRole("button", { type: "submit" });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  test("Log In button is disabled if form is loading Firebase status, or if email or password are not filled out.", () => {
    const { getByLabelText, getByRole } = render(
      <Provider store={store}>
        <LogIn />
      </Provider>
    );
    const emailInput = getByLabelText(/Email/i);
    const passwordInput = getByLabelText(/Password/i);
    const submitButton = getByRole("button", { type: "submit" });
    expect(submitButton).toHaveAttribute("disabled");
    fireEvent.change(emailInput, { target: { value: "jest@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "abc123" } });
    expect(submitButton).not.toHaveAttribute("disabled");
  });
});

describe("INTEGRATION TESTS", () => {
  test("Sign in should throw error on wrong credentials.", async () => {
    let error = "";
    try {
      await signInWithEmailAndPassword(auth, "random@email.com", "1");
    } catch (err) {
      error = err.toString();
    }
    expect(error).toMatch(/user-not-found/);
  });

  test("Sign in should return logged in user from Firebase on correct credentials. ", async () => {
    try {
      await signInWithEmailAndPassword(auth, "jest@example.com", "abc123");
    } catch (err) {
      console.log(err.toString());
    }
    expect(auth.currentUser).toBeTruthy();
    expect(auth.currentUser.email).toBe("jest@example.com");
  });

  test("Sign out should work with Firebase.", async () => {
    await signInWithEmailAndPassword(auth, "jest@example.com", "abc123");
    expect(auth.currentUser).toBeTruthy();
    await signOut(auth);
    expect(auth.currentUser).toBeFalsy();
  });
});
