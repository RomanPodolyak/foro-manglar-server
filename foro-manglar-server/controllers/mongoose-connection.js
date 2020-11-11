const mongooseConnection = require('mongoose')
mongooseConnection.set('debug', true)

// MongoDB connection string
// mongodb://admin:asdf@localhost:27017/   <- TEST DATABASE, TODO CHANGE
const dbConnectionString =
  'mongodb://' +
  (process.env.DB_LOGIN
    ? process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@'
    : '') +
  process.env.DB_HOST +
  ':' +
  process.env.DB_PORT +
  '/'

// connect to MongoDB
mongooseConnection
  .connect(dbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'foroManglar'
  })
  .catch((e) => {
    console.log(e)
  })

const db = mongooseConnection.connection
// event handlers
db.on('error', console.error.bind(console, 'connection error:'))
db.on('open', function () {
  console.log('Connected to MongoDB')
})

module.exports = mongooseConnection
