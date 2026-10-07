const express = require('express')
const app = express()
const cors = require('cors')

require('dotenv').config()
const rateLimit = require('express-rate-limit')
const { sequelize, connectDB } = require('./config/database')
const authRoutes = require('./routes/authRoute')
const storyRoutes = require('./routes/storyRoute')


// const startServer = async () => {
//     await connectDB()
//     await sequelize.sync({alter: false})
//     console.log('Table sync')
// }
// startServer()
// app.use(
//     helmet({
//         contentSecurityPolicy: false,
//         crossOriginRessoucePolicy: { policy: "cross-origin" }
//     })
// )

const allowedOrigins = [
  'https://front-slugman.vercel.app',
  'http://localhost:5173',
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Autorise Postman, curl, etc.
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
        ],
    })
);

app.use(express.json())

const limiter = rateLimit({
    windowMs: 15*60*1000, // femetre de 15min,
    limit: 100, // Max 100 requete par créneau
    message: { status: 429, error: 'Trop de requete, réessayez plus tard'}
})

app.use(limiter)



app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/story', storyRoutes)

app.get('/', (req, res) => {
    res.send('Bienvenue sur mon api rest')
})

const initializeDatabase = async () => {
    await connectDB();
    await sequelize.sync({ alter: false });
};

// Pour Vercel
module.exports = async (req, res) => {
    try {
        await initializeDatabase();
        return app(req, res);
    } catch (error) {
        console.error('Erreur initialisation serveur:', error);

        return res.status(500).json({
            error: 'Erreur serveur',
        });
    }
};

// Pour le développement local
if (require.main === module) {
    const port = process.env.PORT || 3001;

    initializeDatabase()
        .then(() => {
            app.listen(port, () => {
                console.log(`Serveur démarré sur http://localhost:${port}`);
            });
        })
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}


// app.listen(port, ()=>{
//     console.log(`Serveur start on http://localhost:${port}`)
// })

