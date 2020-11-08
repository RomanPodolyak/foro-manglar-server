var mongooseConnection = require("mongoose");

//MongoDB connection string
//mongodb://admin:asdf@localhost:27017/   <- TEST DATABASE, TODO CHANGE
let dbUserName = "admin";
let dbPassword = "asdf";
let dbLogin = false;
let dbHost = "localhost";
let dbPort = "27017";
let dbConnectionString =
  "mongodb://" +
  (dbLogin ? dbUserName + ":" + dbPassword + "@" : "") +
  dbHost +
  ":" +
  dbPort +
  "/";

//connect to MongoDB
mongooseConnection
  .connect(dbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "foroManglar",
  })
  .catch((e) => {
    console.log(e);
  });

module.exports = mongooseConnection;
