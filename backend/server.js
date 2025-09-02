// backend/server.js

const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// --- Database Connection (Sequelize) ---
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite' // Name of the database file
});

// Import the model and initialize it with the sequelize instance
const Article = require('./models/Article')(sequelize);

// --- Test Database Connection and Sync Models ---
async function initializeDb() {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
        
        // Sync all defined models to the DB.
        // This creates the table if it doesn't exist.
        await sequelize.sync({ alter: true });
        console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error('Unable to connect to the database or sync models:', error);
    }
}

// --- API Routes ---
const articlesRouter = require('./routes/articles')(Article); // Pass the Article model to the router
app.use('/api/articles', articlesRouter);

// --- Start Server ---
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    initializeDb();
});