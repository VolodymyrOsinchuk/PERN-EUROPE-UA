require('dotenv').config()
const config = require('./config')

const { Sequelize } = require('sequelize')

let sequelize

if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(config.database.url, {
    logging: false,
    dialect: config.database.dialect || 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
        // ca: fs.readFileSync(path.join(__dirname, "./ca.pem"), "utf8").toString(),
      },
    },
  })
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      // Supprimé dialectModule: pg pour éviter les problèmes
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      dialectOptions: {
        // Pas besoin de spécifier ssl: false explicitement
      },
    }
  )
}

module.exports = sequelize
