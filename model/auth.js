const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Auth = sequelize.define('User', {
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // role: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //   },
}, {
    tableName: 'user'
});

module.exports = Auth;
