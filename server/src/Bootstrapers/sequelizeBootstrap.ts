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
    passwordHash: { type: Sequelize.STRING(128), field: 'passwordhash'},
    passwordSalt: { type: Sequelize.STRING(64), field: 'passwordsalt'},
    failedLogins: { type: Sequelize.INTEGER, field: 'failedlogins'},
    lastFailedLogin: { type: Sequelize.DATE, field: 'lastfailedlogin'},
    lastLogin: { type: Sequelize.DATE, field: 'lastlogin'},
}, {
    ...defaultOptions, 
    tableName: 'users'
});

// connect to the database
SequelizeOrm.authenticate()