import React from "react";
import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import store from "../store";

import SignUp from "./SignUp";

describe("SignUp", () => {
  test("SignUp snapshot renders", () => {
    const component = renderer.create(
      <Provider store={store}>
        <SignUp />
      </Provider>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
