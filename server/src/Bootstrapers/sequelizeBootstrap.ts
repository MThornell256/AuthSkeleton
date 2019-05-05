import { Sequelize, DefineAttributeColumnOptions } from 'sequelize';

// Sequelize Docs
// http://docs.sequelizejs.com/

// Local DB?
const dbConnectionString = process.env.DATABASE_URL || "postgresql://postgres:admin@localhost:5432/Test1";

export const SequelizeOrm: Sequelize = new Sequelize(dbConnectionString, {
    dialect:  'postgres',
    protocol: 'postgres',
});



// Register Mappings
const defaultPK: DefineAttributeColumnOptions = {type: Sequelize.INTEGER, primaryKey: true};
const defaultOptions = {
    updatedAt: false,
    createdAt: false,
    schema: 'public',
};

export const UserDto = SequelizeOrm.define('User', {
    userid: defaultPK,
    username: Sequelize.STRING(50),
    passwordHash: Sequelize.STRING(256),
    passwordSalt: Sequelize.STRING(10),
    failedLogins: Sequelize.NUMBER,
    lastFailedLogin: Sequelize.DATE,
    FailedLogin: Sequelize.DATE
}, {
    ...defaultOptions, 
    tableName: 'users'
});

// connect to the database
SequelizeOrm.authenticate()