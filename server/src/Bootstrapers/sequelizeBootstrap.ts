import { Sequelize } from 'sequelize';

// Sequelize Docs
// http://docs.sequelizejs.com/

// Local DB?
const dbConnectionString = process.env.DATABASE_URL || "postgresql://postgres:admin@localhost:5432/Test1";

export const SequelizeOrm: Sequelize = new Sequelize(dbConnectionString, {
    dialect:  'postgres',
    protocol: 'postgres',
});



// Register Mappings
const defaultPK = {type: Sequelize.INTEGER, primaryKey: true} ;
const defaultOptions = {
    updatedAt: false,
    createdAt: false,
    schema: 'public',
};

export const UserDto = SequelizeOrm.define('User', {
    userid: defaultPK,
    username: Sequelize.STRING,
    password: Sequelize.STRING
}, {
    ...defaultOptions, 
    tableName: 'users'
});

// connect to the database
SequelizeOrm.authenticate()