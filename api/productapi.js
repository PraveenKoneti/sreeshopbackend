const router = require('express').Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const fs = require('fs');
const path = require('path');

const moment = require('moment');


let Product = require('../models/productschema');
let Wishlist = require('../models/wishlistschema');
let Orderlist = require("../models/orderschema");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'productimages');
    },
    filename: function(req, file, cb) {   
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({ storage, fileFilter });

router.route('/saveproduct').post(upload.single('productimage'), (req, res) => {

    const sellerid            =  req.body.sellerid;
    const brandname           =  req.body.brandname;
    const categoryname        =  req.body.categoryname;
    const productname         =  req.body.productname;
    const productprice        =  req.body.productprice;
    const productactive       =  req.body.productactive;
    const productdate         =  req.body.date;
    const producturl          =  req.body.producturl;
    const productdescription  =  req.body.productdescription;
    const productimage        =  req.file.filename;

    const newproductData = {
       sellerid, 
       brandname,
       categoryname,
       productname,
       productprice,
       productactive,
       productdate,
       productimage,
       producturl,
       productdescription
    }
    const newproduct = new Product(newproductData);             //   http://localhost:7777/product/saveproduct
    newproduct.save()
           .then(() => res.json('product Added'))
           .catch(err => res.status(400).json('Error: ' + err));
});


//-------------------------------------------------------------------------------------------------------------------------------------------------------

                        //    To get the Product details        //   http://localhost:7777/product/getproducts      

router.get("/getproducts", async(req, res) => {
    let searchbrandname = typeof req.query.searchbrandname === 'string' ? req.query.searchbrandname.trim() : '';
    let searchcategoryname = typeof req.query.searchcategoryname === 'string' ? req.query.searchcategoryname.trim() : '';
    let brandProducts = [];
    let combinedResults = [];

    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const userid = req.query.user;

    // Fetch brand products if searchbrandname is provided
    if (searchbrandname) {
        brandProducts = await Product.find({
            brandname: { $regex: searchbrandname, $options: 'i' }
        });
    }

    // Fetch category products
    let categoryProducts = await Product.find({
        categoryname: { $regex: searchcategoryname, $options: 'i' }
    });

    // Combine brand and category products, ensuring no duplicates
    if (brandProducts.length > 0) {
        let brandProductIds = new Set(brandProducts.map(product => product._id.toString()));
        let filteredCategoryProducts = categoryProducts.filter(product => !brandProductIds.has(product._id.toString()));
        combinedResults = [...brandProducts, ...filteredCategoryProducts];
    } 
    else 
        combinedResults = categoryProducts;

    // Extract unique brand names
    let uniqueBrandNames = Array.from(new Set(combinedResults.map(product => product.brandname)));

    // Total number of combined products
    const total = await Product.countDocuments({_id: { $in: combinedResults.map(product => product._id) }})

    // Paginate using MongoDB's skip() and limit() at the query level
    const paginatedResults = await Product.find({
        _id: { $in: combinedResults.map(product => product._id) } // Use IDs from combined results
    }).skip(skip).limit(limit);

    // Add wishlist status if user ID is provided
    let paginatedResultsWithWishlistStatus = paginatedResults.map(product => ({ ...product.toObject(), isInWishlist: false }));

    if (userid && userid.trim() !== 'null' && userid.trim() !== '') {
        const userWishlist = await Wishlist.find({ userid });
        const wishlistProductMap = new Map(userWishlist.map(item => [item.productid.toString(), item._id.toString()]));

        paginatedResultsWithWishlistStatus = paginatedResults.map(product => {
            const productIdStr = product._id.toString();
            const wishlistId = wishlistProductMap.get(productIdStr) || " ";
            return {
                ...product.toObject(),
                isInWishlist: wishlistProductMap.has(productIdStr),
                wishlistId
            };
        });
    }

    // Send the response with paginated results, unique brand names, and total count
    res.status(200).json({
        products: paginatedResultsWithWishlistStatus,
        brands: uniqueBrandNames,
        total
    });
  
})



//-------------------------------------------------------------------------------------------------------------------------------------------------------


                //   TO GET THE ALL PRODUCTS WITHOUT ANY POST DATA

router.get("/getallproducts", async(req, res)=>{
    let allproducts = await Product.find();
    res.status(200).json( allproducts );                   //   http://localhost:7777/product/getallproducts
});



//-------------------------------------------------------------------------------------------------------------------------------------------------------



               //   TO GET THE PARTICULAR PRODUCT DATA 

router.get("/getoneproduct", async(req, res)=>{
    try {
        const producturl = req.query.producturl;
        const userId = req.query.userid;
    
        // Fetch the product based on producturl
        let product = await Product.findOne({ producturl: producturl });
    
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
    
        // Check if the product exists in the user's wishlist
        const wishlistItem = await Wishlist.findOne({ userid: userId, productid: product.id });
        console.log("Wishlist Item:", wishlistItem); // This should log the wishlist item
    
        product = product.toObject(); // Convert to plain object if needed
        product.wishlistId = wishlistItem ? wishlistItem._id : ""; // Add wishlistId or empty string
        // If the wishlistItem exists, add the wishlistId to the product
        product.wishlistId = wishlistItem ? wishlistItem._id : ""; // Add wishlistId or empty string
        console.log("Product with wishlistId:", product); // This should log the product with the wishlistId
        res.status(200).json(product);
    } catch (error) {
        console.error("Error occurred:", error); // Log any errors that occur
        res.status(500).json({ message: "Internal Server Error" });
    }
              
})


//-------------------------------------------------------------------------------------------------------------------------------------------------------


                //  TO GET THE PARTICULAR SELLER PRODUCT DATA 

router.get("/getsellerproduct", async(req, res)=>{
    
    let sellerid = req.query.sellerid;
    let productsCount = await Product.countDocuments( {sellerid:sellerid} )
    let product = await Product.find( {sellerid:sellerid} ).skip(req.query.skip).limit(req.query.limit) 
    res.status(200).json( {product, productsCount} );                     //  http://localhost:7777/product/getsellerproduct
})



//-------------------------------------------------------------------------------------------------------------------------------------------------------


                //  TO UPDATE THE PRODUCT ACTIVE / STOCK PARTICULAR SELLER PRODUCT 

router.put("/updatestock/:id", async(req, res)=>{
    const { active, id } = req.body;
        const product = await Product.findById(id);             //  http://localhost:7777/product/updatestock
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        product.productactive = active;
        await product.save({ validateModifiedOnly: true });    
        res.status(200).json({ message: 'Product Active/Stock Updated Successfully' });
})



//-------------------------------------------------------------------------------------------------------------------------------------------------------


                //  TO DELETE THE PARTICULAR SELLER PRODUCT 

router.delete("/deleteproduct/:id", async(req, res)=>{
    let id = req.params.id;                                        //  http://localhost:7777/product/deleteproduct
    let product = await Product.findById(id);
    const imagePath = path.join(__dirname, 'productimages', product.productimage);
    await product.deleteOne();
    fs.unlink(imagePath, (err) => {                      
        if (err) {
            return res.status(500).json({ "message": "Failed to delete product image", "error": err });
        }
        res.status(200).json({ "message": "Deleted Successfully" });
    });
})



//-------------------------------------------------------------------------------------------------------------------------------------------------------


                    //  TO UPDATE THE PRODUCT DETAILS
                                                            //  http://localhost:7777/product/updateproduct

router.put('/updateproduct/:id', upload.single('productimage'), async (req, res) => {
    const { _id, brandname, categoryname, productname, productprice, productactive, productdate, productdescription, producturl } = req.body;

        // Find the product by its ID
        const product = await Product.findById(_id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found',success:true });
        }

        // Check if a new image is uploaded
        if (req.file) {
            // Check if the new uploaded file is different from the current product image
            if (product.productimage !== req.file.filename) {
                // Delete the previous image if it exists
                if (product.productimage) {
                    const imagePath = path.join(__dirname, 'productimages', product.productimage);
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            console.error('Failed to delete old product image:', err);
                        }
                    });
                }

                // Update product image with new filename
                product.productimage = req.file.filename;
            }
        }

        // Update the product fields
        product.brandname = brandname;
        product.categoryname = categoryname;
        product.productname = productname;
        product.productprice = productprice;
        product.productactive = productactive;
        product.productdate = productdate;
        product.productdescription = productdescription;         //  http://localhost:7777/product/updateproduct
        product.producturl = producturl;

        // Save the updated product
        await product.save();

        // Respond with success message
        res.status(200).json({ message: 'Product updated successfully', product: product, success:true });
})



//-------------------------------------------------------------------------------------------------------------------------------------------------------


                        //  TO GET THE INSTOCKCOUNT OF PRODUCTS PARTICULAR SELLER PRODUCTS

router.get("/instockcount", async(req, res)=>{
    let id = req.query.id;                                         // http://localhost:7777/product/instockcount
    let productcount = await Product.find({sellerid:id});
    let instockcount = await Product.find({sellerid:id,productactive:"In Stock"})   
    res.status(200).json({productcount:productcount.length, instockcount:instockcount.length})
})



//-------------------------------------------------------------------------------------------------------------------------------------------------------


                    //  TO GET THE INSTOCKCOUNT OF PRODUCTS PARTICULAR SELLER PRODUCTS

router.get("/outofstockcount", async(req, res)=>{
    let id = req.query.id;                                        // http://localhost:7777/product/outofstockcount
    let productcount = await Product.find({sellerid:id});
    let outofstockcount = await Product.find({sellerid:id,productactive:"Out Of Stock"})  
    res.status(200).json({productcount:productcount.length, outofstockcount:outofstockcount.length})
})



//-------------------------------------------------------------------------------------------------------------------------------------------------------


                    //  TO SEARCH THE PRODUCTS 

router.get("/search", async(req, res)=>{
    let searchQuery = req.query.searchquery;
    const searchCondition = {
        $or: [
            { productname: { $regex: searchQuery, $options: 'i' } },
            { categoryname: { $regex: searchQuery, $options: 'i' } },
            { brandname: { $regex: searchQuery, $options: 'i' } }
        ]
    };
    let searchresults = await Product.find(searchCondition);     //  http://localhost:7777/product/search
    res.status(200).json(searchresults);
})


//-------------------------------------------------------------------------------------------------------------------------------------------------------


                        //  TO GET THE PARTICULARBRANDPRODUCT FROM THE ALL PRODUCTS

router.get("/getparticularbrandproduct", async(req, res)=>{
    let brand = req.query.brand;
    let category = req.query.category;            //   http://localhost:7777/product/getparticularbrandproduct
    let page = req.query.page;
    let limit = req.query.limit;
    let skip = (page - 1) * limit;

    let total = await Product.count({ brandname: brand, categoryname: category });
    let allProducts = await Product.find({ brandname: brand, categoryname: category }).skip(skip).limit(limit);;

    res.status(200).json({products: paginatedProducts, total: total, pages: Math.ceil(total / limit) });
})


//-------------------------------------------------------------------------------------------------------------------------------------------------------


                        //  TO GET THE PRODUCTS COUNT AND NAME TO SHOW IN PIE CHART

router.get("/getpiechartdata", async(req, res)=>{
    let sellerid = req.query.sellerid;
    let products = await Product.find( {sellerid:sellerid} )
     // Reduce logic to group by category and count the products in each category
     const categoryData = products.reduce((acc, product) => {
        const category = product.categoryname;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});

    // Convert the result to an array format with name and value
    const chartData = Object.keys(categoryData).map(category => ({
        name: category,     // Category name
        value: categoryData[category]  // Count of products
    }));

    // Send the chart data as a response
    res.json(chartData);
})



//----------------------------------------------------------------------------------------------------------------

            // TO GET THE MONTHLY ORDERED AND CANCELLED PRODUCTS DATA TO SHOW IN FRONTEND

router.get("/getorderedcancelledproductsdata", async(req, res)=>{
    const year = req.query.year;
    const sellerid = req.query.sellerid;

    // Ensure year and sellerid are provided
    if (!year || !sellerid) {
        return res.status(400).json({ error: 'Year and sellerid are required' });
    }

    // Define start and end dates of the year in ISO 8601 format
    const startDate = moment.utc(`${year}-01-01T00:00:00.000Z`).startOf('day').toDate();
    const endDate = moment.utc(`${year}-12-31T23:59:59.999Z`).endOf('day').toDate();


    // Fetch orders for the specified year and seller
    const orders = await Orderlist.find({
        date: { $gte: startDate.toISOString(), $lte: endDate.toISOString() },
        "products.sellerid": sellerid
    }).exec();

    console.log(orders);

    // Initialize monthly counts
    const monthlyCounts = {};
    const months = moment.months(); // Get all month names

    // Initialize counts for each month
    months.forEach(month => {
        monthlyCounts[month] = { ordered: 0, cancelled: 0 };
    });

    // Process orders and separate by month and status
    orders.forEach(order => {
        // Convert date to ISO 8601 format if it's not already
        const orderDate = moment.utc(order.date); // Convert to moment object in UTC
        const month = orderDate.format('MMMM'); // Get month name
        if (monthlyCounts[month]) {
            if (order.orderstatus === 'ordered') {
                monthlyCounts[month].ordered++;
            } else if (order.orderstatus === 'cancelled') {
                monthlyCounts[month].cancelled++;
            }
        }
    });

    // Convert the monthlyCounts object to an array of objects and sort by month
    const result = months.map(month => ({
        month,
        ordered: monthlyCounts[month].ordered,
        cancelled: monthlyCounts[month].cancelled
    }));

    // Sort the result array to ensure months are in the correct order
    result.sort((a, b) => moment().month(a.month).diff(moment().month(b.month)));

    // Return the result
    res.json(result);
})


//----------------------------------------------------------------------------------------------------------------



                //  TO GET THE ORDERED PRODUCTS BASED ON SELLERID AND YEAR

router.get('/getorderproducts', async(req, res)=>{
    let sellerid = req.query.sellerid;
    let year = req.query.year;

    const startDate = moment.utc(`${year}-01-01T00:00:00.000Z`).startOf('day').toDate();
    const endDate = moment.utc(`${year}-12-31T23:59:59.999Z`).endOf('day').toDate();

    const orders = await Orderlist.find({
        date: { $gte: startDate.toISOString(), $lte: endDate.toISOString() },
        "products.sellerid": sellerid
    }).exec(); 

    const ordersproducts = await Orderlist.find({
        date: { $gte: startDate.toISOString(), $lte: endDate.toISOString() },
        "products.sellerid": sellerid,
        "orderstatus" : "ordered"
    })


    res.status(200).json( {
        "totalorders" : orders.length,
        "orderscount" : ordersproducts.length
    })
})


//------------------------------------------------------------------------------------------------------------------



                // TO GET THE CANCELLED ORDERS BASED ON SELLERID AND YEAR 

router.get('/getcancelledproducts', async(req, res)=>{

    let sellerid = req.query.sellerid;
    let year = req.query.year;

    const startDate = moment.utc(`${year}-01-01T00:00:00.000Z`).startOf('day').toDate();
    const endDate = moment.utc(`${year}-12-31T23:59:59.999Z`).endOf('day').toDate();

    const orders = await Orderlist.find({
        date: { $gte: startDate.toISOString(), $lte: endDate.toISOString() },
        "products.sellerid": sellerid
    }).exec(); 

    const cancelledproducts = await Orderlist.find({
        date: { $gte: startDate.toISOString(), $lte: endDate.toISOString() },
        "products.sellerid": sellerid,
        "orderstatus" : "cancelled"
    })


    res.status(200).json( {
        "totalorders" : orders.length,
        "cancelledcount" : cancelledproducts.length
    })
})



//------------------------------------------------------------------------------------------------------------------




module.exports = router;