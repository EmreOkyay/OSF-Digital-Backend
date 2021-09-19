var express = require('express');
var router = express.Router();
var https = require('https');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo');

const base_url = 'https://osf-digital-backend-academy.herokuapp.com/api/';
const secretKey = '$2a$08$wurKWjXAIBE8zHmIsC8wPONR5Dk6X/Ov4zdrR6Rr0BQT5kqQtIq5m';

var router = express();

router.use(express.static('public')); // DON'T FORGET THIS, IMPORTANT  FOR STATIC ASSETS

var product = `${base_url}categories?secretKey=${secretKey}`;


https.get(product, res => {
    let response = console.log('statusCode:', res.statusCode);
    let body = '';
    res.on('data', data => {
        body += data.toString();
    });

    let Data = '';

    // How I can access some api elements, looking at the JSON file from Postman
    res.on('end', () => {
        const productData = JSON.parse(body);
        Data = productData;
    });

    router.get('/categories', function(req, res, next) {
        res.render('index', { product: Data, nullData: 'categories/category_404.png'});
    });

    router.get('/categories/:id', function(req, res, next) {
        res.render('product', { product: Data, 
                                nullData: 'categories/category_404.png', 
                                productId: req.params.id});
    });

    // router.get('/categories/parent/:id', function(req, res, next) {
    //     res.render('product', { product: Data, 
    //                             nullData: 'categories/category_404.png', 
    //                             productId: req.params.id});
    // });
});


// Basically, how I can use the OSF API
https.get(`${base_url}/products/product_search?id=25565189&secretKey=${secretKey}`, res => {
    let response = console.log('statusCode:', res.statusCode);
    let body = '';
    res.on('data', data => {
        body += data.toString();
    });

    let Data = '';

    // How I can access some api elements, looking at the JSON file from Postman
    res.on('end', () => {
        const wholeData = JSON.parse(body);
        console.dir(`----------------------------------------------------------
        This items name is: ${wholeData[0].page_title} 
        it's description reads: ${wholeData[0].page_description}
        and it costs: ${wholeData[0].price}${wholeData[0].currency}
        ----------------------------------------------------------`);
        Data = wholeData;
    });


    // Created a let variable named Data and modified it in res.on and show it on homepage when GET reques to /
    router.get('/api', (req, res) => {
        res.json(`Product Name: ${Data[0].page_title}`);
    });

    // How we can pass api variable into .pug file and html
    // app.get('/', (req, res) => {
    //     res.render('index', { product: `${Data[0].page_title}` });
    // });

    // 404 after all routes but before (err, req, res, next)
    router.use((req, res, next) => {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // Error middleware, when app encounters an error, express jumps to the first middleware that has 4 parameters like this
    // app.use((err, req, res, next) => {
    //     res.locals.error = err;
    //     res.status(err.status);
    //     res.render('error');
    // });

});
// --------------------------------------------------------------------------------------------------------------



/* GET home page. */
// router.get('/', function(req, res, next) {
//     res.render('index', { title: 'MAIN CATEGORY NAME', mainCategoryDescription: 'This is the place holder for main category description' });
// });

module.exports = router;