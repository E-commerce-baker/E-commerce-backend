const fs = require('fs');
const dotenv = require('dotenv');
const { Product } = require('./models/ProductModel');
const dbConnection = require('./config/connectToDB');
require('colors');

dotenv.config();

// connect to DB
dbConnection.connectToDB();

// Read data
const products = JSON.parse(fs.readFileSync('./product.json'));


// Insert data into DB
const insertData = async () => {
    try {
        await Product.create(products);

        console.log('Data Inserted'.green.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
};

// Delete data from DB
const destroyData = async () => {
    try {
        await Product.deleteMany();
        console.log('Data Destroyed'.red.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
};

// node seeder.js -d
if (process.argv[2] === '-i') {
    insertData();
} else if (process.argv[2] === '-d') {
    destroyData();
}