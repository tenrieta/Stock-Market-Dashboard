import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import App from "./App";

describe("<App />", () => {
  it("renders at least one <div>", () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find("div").length).toBeGreaterThanOrEqual(1);
  });
  it("renders correctly", () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders correctly (inline version)", () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchInlineSnapshot("<div />");
  });
});
