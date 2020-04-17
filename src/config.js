const configProd = {
  API_URI: "https://thequarentiniclub.herokuapp.com",
};
// development specific config goes here
const configDev = {
  API_URI: "http://localhost:3001",
};

console.log("process", process.env);
const config = process.env.NODE_ENV === "development" ? configDev : configProd;
export default config;
