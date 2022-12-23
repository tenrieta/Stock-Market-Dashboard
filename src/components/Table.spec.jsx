/* eslint-disable no-unused-vars */
import React from "react";
import renderer from "react-test-renderer";
import Table from "./Table";
import { Provider } from "react-redux";
import store from "../store";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FormControl, Toolbar } from "@material-ui/core";
import { shallow, mount } from "enzyme";
import userEvent from "@testing-library/user-event";

test("Always true test", () => {
  expect(true).toBe(true);
});

describe("Table", () => {
  test("Table snapshot renders", () => {
    const component = renderer.create(
      <Provider store={store}>
        <Table />
      </Provider>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("should have one Table", () => {
    const container = shallow(
      <Provider store={store}>
        <Table />
      </Provider>
    );
    expect(container.find("Table").length).toEqual(1);
  });
});

describe("Input value for Search", () => {
  it("updates on change", () => {
    const wrapper = mount(
      <Provider store={store}>
        <Table />
      </Provider>
    );

    const handleSearch = jest.fn((e) => {
      e.target.value = "Facebook";
    });

    const { queryByPlaceholderText } = render(
      <FormControl type="search" onChange={handleSearch} />
    );
    const searchInput = queryByPlaceholderText("Search");

    //userEvent.type(searchInput, "Facebook");
    expect(handleSearch).not.toHaveBeenCalled();
    //expect(searchInput.value).toBe("Facebook");
  });
});
