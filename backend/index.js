//
require('dotenv').config()
const path = require('path')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()

// import DB Sequelize
const sequelize = require('./config/db')
const advRoutes = require('./routes/advRouter')
const categoryRoutes = require('./routes/categoryRouter')
const authRoutes = require('./routes/authRouter')
const userRoutes = require('./routes/userRouter')
const eventRoutes = require('./routes/eventRouter')
const config = require('./config/config')
const { authMiddleware } = require('./middleware/authMiddleware')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Gestion des CORS
app.use(
  cors({
    origin: config.client.url,
    credentials: true,
  })
)

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

app.get('/', (req, res) => {
  res.send('Ласкаво просимо до серверної частини')
})

app.get('/api', (req, res) => {
  res.status(200).json({ msg: 'Ласкаво просимо до серверної частини' })
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', authMiddleware, userRoutes)
app.use('/api/v1/adv', advRoutes)
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/events', authMiddleware, eventRoutes)

// Gestion des erreurs 404
// app.use('*', (req, res) => {
//   res.status(404).json({ msg: 'не знайдено' })
// })

// Gestion des erreurs 500
app.use((err, req, res, next) => {
  console.error('Erreur interne du serveur:', err)
  res.status(500).json({ msg: 'Щось пішло не так!!!', error: err.message })
})

const port = process.env.PORT || 5000

const testDbConnection = async () => {
  try {
    await sequelize.sync({ alter: true })
    console.log("З'єднання з базою даних встановлено успішно")
    app.listen(port, () => {
      console.log('Сервер працює на порту ' + port)
      console.log(`Сервер запущено в ${process.env.NODE_ENV}`)
    })
  } catch (error) {
    console.error('Не вдається підключитися до бази даних:', error)
    console.error(
      "L'application ne peut pas démarrer sans connexion à la base de données."
    )
    process.exit(1) // Arrête l'application si la connexion échoue
  }
}

testDbConnection()
