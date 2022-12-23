module.exports = {
  setupFilesAfterEnv: ["./enzyme.js"],
  reporters: ["default", "jest-junit"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<root>/__mocks__/fileMock.js",
    "\\.(css|less)$": "<root>/__mocks__/styleMock.js",
  },
  testEnvironment: "jsdom",
  testRegex: "((\\.|/*.)(spec))\\.jsx?$",
};
process.env = Object.assign(process.env, {
  REACT_APP_FIREBASE_API_KEY: "AIzaSyCXd2qcm2mW-sz48qYtorIQaZ0EfGLU8dU",
  REACT_APP_FIREBASE_AUTH_DOMAIN: "telerik-project.firebaseapp.com",
  REACT_APP_FIREBASE_PROJECT_ID: "telerik-project",
  REACT_APP_FIREBASE_STORAGE_BUCKET: "telerik-project.appspot.com",
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID: "318843897158",
  REACT_APP_FIREBASE_APP_ID: "1:318843897158:web:28362b9552b1963991d147",
  PUBLIC_BASENAME_PATH: "/stock-market-dashboard",
});
