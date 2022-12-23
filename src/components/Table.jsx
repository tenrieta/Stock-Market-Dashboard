import React, { useState } from "react";
import FormControl from "react-bootstrap/FormControl";
import { useDispatch, useSelector } from "react-redux";
import {
  // makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { Search } from "@material-ui/icons";
import selectStock from "../actions/chosenStockActions";
import useTable from "../hooks/useTable";
import symbols from "../../data/stocks";
import ModalForm from "./ModalForm";
import { getStockDataFromStorage, getYesterday } from "./Chart";

// Redux action creators
import addStockData from "../actions/stockDataActions";
/*
const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "75%",
  },
}));
*/

const headCells = [
  { id: "symbol", label: "Symbol" },
  { id: "name", label: "Name" },
  { id: "price", label: "Price" },
  { id: "change", label: "Change" },
  { id: "volume", label: "Volume" },
  { id: "actions", label: "Action" },
];

const Table = function Table() {
  const selectedStock = useSelector((state) => state.chosenStock);
  const currentUser = useSelector((state) => state.currentUser);
  const stockDataFromRedux = useSelector((state) => state.stockData);
  // const [stocks] = useState([...symbols]);
  // const classes = useStyles();
  // const [records] = useState([...symbols]);
  // const [symbol, setSymbol] = useState("");
  const [filterFn, setFilterFn] = useState({
    fn: (stocks) => stocks,
  });
  const [modalStatus, setModalStatus] = React.useState({
    modalOpened: false,
    activeStock: null,
  });

  const newSymbols = [...symbols];

  Object(symbols).map((stock) => {
    const stockDataFromStorage1 = getStockDataFromStorage();
    Object.assign(stock, {
      price:
        Math.round(
          Number(
            stockDataFromStorage1?.[Object(stock.symbol)]?.seriesCandle[0]
              ?.data[0]?.y[3]
          ) * 100
        ) / 100,
    });
    Object.assign(stock, {
      change:
        Math.round(
          Math.abs(
            100 -
              (Number(
                stockDataFromStorage1?.[Object(stock.symbol)]?.seriesCandle[0]
                  ?.data[1]?.y[3]
              ) /
                Number(
                  stockDataFromStorage1?.[Object(stock.symbol)]?.seriesCandle[0]
                    ?.data[0]?.y[3]
                )) *
                100
          ) * 100
        ) / 100,
    });
    Object.assign(stock, {
      volume: Math.round(
        Number(
          stockDataFromStorage1?.[Object(stock.symbol)]?.seriesBar[0]?.data[0]
            ?.y
        ) / 1000000
      ),
    });
    return true;
  });

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(newSymbols, headCells, filterFn);

  const handleSearch = (e) => {
    setFilterFn({
      fn: (stocks) => {
        if (e.target.value === "") return stocks;
        return stocks.filter(
          (x) =>
            x.name.toLowerCase().includes(e.target.value) ||
            x.symbol.toLowerCase().includes(e.target.value)
        );
      },
    });
  };

  const dispatch = useDispatch();

  const handleStockAction = (activeStock, action) => {
    setModalStatus({
      modalOpened: true,
      activeStock,
      action,
    });
  };

  React.useEffect(() => {
    const stockDataFromStorage = getStockDataFromStorage();
    const yesterdayDate = getYesterday();
    symbols.map((stock) => {
      if (
        stockDataFromStorage?.[stock.symbol]?.seriesCandle?.[0]?.data?.[0]
          ?.x === yesterdayDate ||
        stockDataFromStorage?.[stock.symbol]?.seriesCandle?.[0]?.data?.[1]
          ?.x === yesterdayDate
      ) {
        dispatch(
          addStockData(stock.symbol, stockDataFromStorage[stock.symbol])
        );
      }
      return true;
    });
  }, [dispatch]);

  return (
    <>
      {/* Stocks Table */}
      <Toolbar>
        <FormControl
          type="search"
          placeholder="Search"
          aria-label="Search"
          inputprops={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          onChange={handleSearch}
        />
      </Toolbar>
      <TblContainer>
        <TblHead />
        <TableBody>
          {recordsAfterPagingAndSorting().map((stock) => (
            <TableRow
              key={stock.id}
              selected={stock.symbol === selectedStock}
              onClick={() => dispatch(selectStock(stock.symbol))}
              id={stock.symbol.concat("-row")}
            >
              <TableCell>{stock.symbol}</TableCell>
              <TableCell>{stock.name}</TableCell>
              {stockDataFromRedux?.[stock.symbol]?.seriesCandle[0]?.data[0] ? (
                <>
                  <TableCell>
                    $
                    {Math.round(
                      Number(
                        stockDataFromRedux?.[stock.symbol]?.seriesCandle[0]
                          ?.data[0]?.y[3]
                      ) * 100
                    ) / 100}
                  </TableCell>
                  <TableCell>
                    {Math.round(
                      Math.abs(
                        100 -
                          (Number(
                            stockDataFromRedux?.[stock.symbol]?.seriesCandle[0]
                              ?.data[1]?.y[3]
                          ) /
                            Number(
                              stockDataFromRedux?.[stock.symbol]
                                ?.seriesCandle[0]?.data[0]?.y[3]
                            )) *
                            100
                      ) * 100
                    ) / 100}
                    %
                  </TableCell>
                  <TableCell>
                    {Math.round(
                      Number(
                        stockDataFromRedux?.[stock.symbol]?.seriesBar[0]
                          ?.data[0]?.y
                      ) / 1000000
                    )}
                    m
                  </TableCell>
                  <TableCell>
                    {currentUser.uid ? (
                      <Button
                        variant={
                          currentUser.firestore?.stockUnits?.[stock.symbol]
                            ? "primary"
                            : "outline-primary"
                        }
                        size="sm"
                        onClick={() => handleStockAction(stock.symbol)}
                      >
                        Buy / Sell
                      </Button>
                    ) : (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        as={Link}
                        to="/log-in"
                      >
                        Buy / Sell
                      </Button>
                    )}
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </TblContainer>
      <TblPagination />
      <ModalForm modalStatus={modalStatus} setModalStatus={setModalStatus} />
    </>
  );
};

export default Table;
