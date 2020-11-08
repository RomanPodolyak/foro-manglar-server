var mongooseConnection = require("mongoose");

//MongoDB connection string
//mongodb://admin:asdf@localhost:27017/   <- TEST DATABASE, TODO CHANGE
let dbConnectionString =
  "mongodb://" +
  (process.env.DB_LOGIN
    ? process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@"
    : "") +
  process.env.DB_HOST +
  ":" +
  process.env.DB_PORT +
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
