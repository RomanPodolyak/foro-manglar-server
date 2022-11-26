const mongooseConnection = require('mongoose')
mongooseConnection.set('debug', true)

// MongoDB connection string
// mongodb://admin:asdf@localhost:27017/?authSource=someDb   <- TEST DATABASE, TODO CHANGE
const dbConnectionString =
  'mongodb://' +
  (process.env.DB_LOGIN === 'true'
    ? process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@'
    : '') +
  process.env.DB_HOST +
  ':' +
  process.env.DB_PORT +
  '/' + (process.env.DB_AUTH_SOURCE_TEST === 'true' ? '?authSource=' + process.env.DB_AUTH_SOURCE : '')
console.log(dbConnectionString)

// connect to MongoDB
mongooseConnection
  .connect(dbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'foroManglar'
  })
  .catch((e) => {
    console.error(e)
  })

const db = mongooseConnection.connection
// event handlers
db.on('error', console.error.bind(console, 'connection error:'))
db.on('open', function () {
  console.log('Connected to MongoDB')
})

module.exports = mongooseConnection
