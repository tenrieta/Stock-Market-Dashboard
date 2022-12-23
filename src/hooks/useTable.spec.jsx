import renderer from "react-test-renderer";
import {
  getDigitsFromString,
  stableSort,
  getComparator,
  descendingComparator,
} from "./useTable";

test("Get Digits", () => {
  expect(getDigitsFromString("123$")).toBe(123);
});

const a = {
  symbol: "TWTR",
  name: "Twitter, Inc.",
  id: 2,
  price: 34.82,
  change: 7.06,
  volume: 25,
};

const b = {
  symbol: "FB",
  name: "Facebook Inc.",
  id: 8,
  price: 303.17,
  change: 4.42,
  volume: 29,
};

test("Sort Objects by symbol", () => {
  expect(descendingComparator(a, b, "symbol")).toBe(-1);
});

test("SortObjects by price", () => {
  expect(descendingComparator(a, b, "change")).toBe(-1);
});

test("SortObjects by price", () => {
  expect(descendingComparator(a, b, "price")).toBe(1);
});

function comparator(a, b) {
  return -descendingComparator(a, b, "symbol");
}

test("Sort Array of strings", () => {
  expect(stableSort([a, b], comparator)).toStrictEqual([b, a]);
});
