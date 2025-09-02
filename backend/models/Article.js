// backend/models/Article.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // Define the Article model
    const Article = sequelize.define('Article', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Staff Writer'
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        summary: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'General'
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tags: {
            type: DataTypes.TEXT, // comma-separated tags
            allowNull: true
        },
        views: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        publishedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    });
    return Article;
};