
const express = require("express");
const app = express();
const cors = require("cors")
app.use(express.json())
const path = require('path'); 
const mongoose = require("mongoose");

app.use(cors());

                            // Improved CORS setup
// app.use(cors({
//     origin: '*',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));



            //    To import the mongoose

    // Ensure the username and password are URL-encoded if they contain special characters
const username = encodeURIComponent("konetipraveen");
const password = encodeURIComponent("@Praveen123");
const dbName = "ShreeShop";

const uri = `mongodb+srv://${username}:${password}@cluster0.nnowk.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(uri)
    .then(() => console.log("Mongodb Database is Connected"))
    .catch(error => console.error("Error in Database Connection", error));

const db = mongoose.connection;

// Optionally, you can listen for errors
db.on("error", (error) => console.error("Database Error", error));




app.use('/productimages', express.static(path.join(__dirname, 'productimages')));

// Example route to test serving static files
app.get('/', (req, res) => {
    res.send('Static files are served!');
});


            //    To Create Database Collection 

const User = require("./api/userapi")
app.use("/user", User);                       //  http://localhost:7777/user

const Email = require("./api/emailapi");
app.use("/email", Email);                     //  http://localhost:7777/email

const Seller = require("./api/sellerapi");
app.use("/seller", Seller);                   //  http://localhost:7777/seller

const Brand = require("./api/brandapi");
app.use("/brand", Brand);                     //  http://localhost:7777/brand

const Category = require("./api/categoryapi")
app.use("/category", Category);               //  http://localhost:7777/category

const Product = require("./api/productapi");
app.use("/product", Product);                 //  http://localhost:7777/product

const Wishlist = require('./api/wishlistapi')
app.use("/wishlist", Wishlist);               //  http://localhost:7777/wishlist

const Cartlist = require("./api/cartapi")
app.use("/cartlist", Cartlist);               //  http://localhost:7777/cartlist

const Emailpdf = require("./api/emailpdfapi")
app.use("/emailpdf", Emailpdf);               //  http://localhost:7777/emailpdf 

const Orderlist = require("./api/orderapi");
app.use("/orderlist", Orderlist) ;            //  http://localhost:7777/orderlist 



app.listen(7777, function(){
    console.log("The Server is Live Now !....");
})
