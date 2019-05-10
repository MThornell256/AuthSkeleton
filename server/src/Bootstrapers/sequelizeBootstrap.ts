import { Sequelize, DataTypes } from 'sequelize';

//import { Sequelize } from 'sequelize';

// Sequelize Docs
// http://docs.sequelizejs.com/

// Local DB?
const dbConnectionString = process.env.DATABASE_URL || 'postgresql://postgres:admin@localhost:5432/Test1';

export const SequelizeOrm: Sequelize = new Sequelize(dbConnectionString, {
    dialect: 'postgres',
    protocol: 'postgres'
});

// Register Mappings
const defaultPK = { type: DataTypes.INTEGER, primaryKey: true };
const defaultOptions = {
    updatedAt: false,
    createdAt: false,
    schema: 'public'
};

export const UserDto = SequelizeOrm.define(
    'User',
    {
        userid: defaultPK,
        username: DataTypes.STRING(50),
        passwordHash: { type: DataTypes.STRING(128), field: 'passwordhash' },
        passwordSalt: { type: DataTypes.STRING(64), field: 'passwordsalt' },
        failedLogins: { type: DataTypes.INTEGER, field: 'failedlogins' },
        lastFailedLogin: { type: DataTypes.DATE, field: 'lastfailedlogin' },
        lastLogin: { type: DataTypes.DATE, field: 'lastlogin' }
    },
    {
        ...defaultOptions,
        tableName: 'users'
    }
);

// connect to the database
SequelizeOrm.authenticate();
