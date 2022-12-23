export default {
  optionsCandle: {
    chart: {
      type: "candlestick",
      height: 290,
      id: "candles",
      toolbar: {
        autoSelected: "pan",
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#3C90EB",
          downward: "#DF7D46",
        },
      },
    },
    xaxis: {
      type: "datetime",
      convertedCatToNumeric: false,
      xaxis: { max: +new Date(), min: +new Date() - 1000 * 60 * 60 * 24 * 28 },
    },
  },
  optionsBar: {
    chart: {
      height: 160,
      type: "bar",
      brush: {
        enabled: true,
        target: "candles",
      },
      selection: {
        enabled: true,
        xaxis: {
          max: +new Date(),
          min: +new Date() - 1000 * 60 * 60 * 24 * 28,
        },
        fill: { color: "#ccc", opacity: 0.4 },
        stroke: { color: "#0D47A1" },
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        columnWidth: "80%",
        colors: {
          ranges: [
            {
              from: -1000,
              to: 0,
              color: "#F15B46",
            },
            {
              from: 1,
              to: 10000,
              color: "#FEB019",
            },
          ],
        },
      },
    },
    stroke: {
      width: 0,
    },
    xaxis: {
      type: "datetime",
      axisBorder: {
        offsetX: 13,
      },
      convertedCatToNumeric: false,
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
  },
};
