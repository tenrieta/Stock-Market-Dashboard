/* eslint-disable no-unused-vars */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactApexChart from "react-apexcharts";

// Bootstrap
import Spinner from "react-bootstrap/Spinner";

// Redux action creators
import addStockData from "../actions/stockDataActions";

// Design for the chart
import chartOptions from "../../data/chartOptions";

export const getStockDataFromStorage = () => {
  // Local storage for stock data to prevent unnecessary calls to the Alpha Ventage API
  const stockDataFromStorageJSON = window.localStorage.getItem("stockData");
  const stockDataFromStorage = JSON.parse(stockDataFromStorageJSON);
  return stockDataFromStorage;
};

export const getYesterday = () => {
  // Last week's trading day to check whether we have up-to-date stock data
  const currentDate = new Date();
  const yesterdayDay = currentDate.getDate() - 1;
  const yesterdayDate = new Date(currentDate.setDate(yesterdayDay))
    .toISOString()
    .split("T")[0];
  return yesterdayDate;
};

const StocksChart = function StocksChart() {
  const selectedStock = useSelector((state) => state.chosenStock);

  const dispatch = useDispatch();
  const stockDataFromRedux = useSelector(
    (state) => state.stockData[selectedStock]
  );

  React.useEffect(() => {
    const stockDataFromStorage = getStockDataFromStorage();
    const yesterdayDate = getYesterday();

    if (
      stockDataFromStorage?.[selectedStock]?.seriesCandle?.[0]?.data?.[0]?.x ===
        yesterdayDate ||
      stockDataFromStorage?.[selectedStock]?.seriesCandle?.[0]?.data?.[1]?.x ===
        yesterdayDate
    ) {
      dispatch(
        addStockData(selectedStock, stockDataFromStorage[selectedStock])
      );
    } else {
      console.log("Fetching Alpha Vantage.");
      fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${selectedStock}&apikey=${process.env.APLHA_VENTAGE}&outputsize=compact`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data["Time Series (Daily)"]) {
            const stockPrices = Object.keys(data["Time Series (Daily)"]).map(
              (key) => ({
                x: key,
                y: [
                  data["Time Series (Daily)"][key]["1. open"],
                  data["Time Series (Daily)"][key]["2. high"],
                  data["Time Series (Daily)"][key]["3. low"],
                  data["Time Series (Daily)"][key]["4. close"],
                ],
              })
            );
            const stockVolume = Object.keys(data["Time Series (Daily)"]).map(
              (key) => ({
                x: key,
                y: data["Time Series (Daily)"][key]["5. volume"],
              })
            );

            const formattedData = {
              [selectedStock]: {
                seriesCandle: [{ name: "prices", data: stockPrices }],
                seriesBar: [{ name: "volume", data: stockVolume }],
              },
            };

            dispatch(addStockData(selectedStock, formattedData[selectedStock]));
            window.localStorage.setItem(
              "stockData",
              JSON.stringify({
                ...stockDataFromStorage,
                [selectedStock]: formattedData[selectedStock],
              })
            );
          } else {
            throw new Error(JSON.stringify(data));
          }
        })
        .catch((error) => {
          console.log("Alpha Vantage ", error);
        });
    }
  }, [dispatch, selectedStock]);

  return (
    <div>
      {stockDataFromRedux && (
        <div className="chart-box">
          <h2>{selectedStock}</h2>
          <div id="chart-candlestick">
            <ReactApexChart
              options={chartOptions.optionsCandle}
              series={stockDataFromRedux.seriesCandle}
              type="candlestick"
              height={290}
              width="100%"
            />
          </div>
          <div id="chart-bar">
            <ReactApexChart
              options={chartOptions.optionsBar}
              series={stockDataFromRedux.seriesBar}
              type="bar"
              height={160}
              width="100%"
            />
          </div>
        </div>
      )}
      {!stockDataFromRedux && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
    </div>
  );
};

export default StocksChart;
