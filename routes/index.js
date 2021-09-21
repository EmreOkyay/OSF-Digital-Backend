const express = require('express');
const router = express.Router();
const https = require('https');

const base_url = 'https://osf-digital-backend-academy.herokuapp.com/api/';
const secretKey = '$2a$08$wurKWjXAIBE8zHmIsC8wPONR5Dk6X/Ov4zdrR6Rr0BQT5kqQtIq5m';

let Data = ''; // Global Variable

router.use(express.static('public')); // DON'T FORGET THIS, IMPORTANT  FOR STATIC ASSETS

// NOTE: function of router.get has 'request' and 'response' cause router 'res' was being mistaken for https res

// Get Categories by Parent Id
router.get('/categories/parent/:id', function(request, response, next) {
    let id = request.params.id;
    let parentCatUrl = `${base_url}categories/parent/${id}?secretKey=${secretKey}`;

    https.get(parentCatUrl, res => {  
        let body = '';

        res.on('data', data => {
            body += data.toString();
        });
        
        res.on('end', () => {
            const categoryData = JSON.parse(body);
            Data = categoryData;

            response.render('categories', { categories: Data,
                nullData: 'categories/category_404.png',
                parentId: request.params.id }); 
        });
    });
});

// Get Categories by Id
router.get('/categories/:id', function(request, response, next) {
    let id = request.params.id;
    var specificCatUrl = `${base_url}categories/${id}?secretKey=${secretKey}`;

    https.get(specificCatUrl, res => {
        let body = '';

        res.on('data', data => {
            body += data.toString();
        });

        res.on('end', () => {
            const categoryData = JSON.parse(body);
            Data = categoryData;

            response.render('subCategories', { categories: Data,
                nullData: 'categories/category_404.png',
                subCatId: id });   
        });
    });
});

// Gel All Categories
router.get('/categories', function(request, response, next) {
    var allCategories = `${base_url}categories?secretKey=${secretKey}`;

    https.get(allCategories, res => {
        let body = '';

        res.on('data', data => {
            body += data.toString();
        });
    
        let Data = '';
    
        res.on('end', () => {
            const categoryData = JSON.parse(body);
            Data = categoryData;

            response.render('index', { categories: Data, 
                nullData: 'categories/category_404.png' });
        });
    });
});

// Get Products
router.get('/products/product_search', function(request, response, next) {
    let category_id = request.query.id;
    console.log(response);
    
    // If the query isn't a number, show all the products, if it's a number, show the specific product
    if(isNaN(category_id)){
        var allProducts = `${base_url}products/product_search?primary_category_id=${category_id}&secretKey=${secretKey}`;

        https.get(allProducts, res => {
            let body = '';
    
            res.on('data', data => {
                body += data.toString();
            });
        
            let Data = '';
        
            res.on('end', () => {
                const categoryData = JSON.parse(body);
                Data = categoryData;
    
                response.render('products', { products: Data });
                // console.log(Data[0].master.master_id);
            });
        });
     } else {
        let product_id = request.query.id;
        var specificProduct = `${base_url}products/product_search?id=${product_id}&secretKey=${secretKey}`;
    
        https.get(specificProduct, res => {
            let body = '';
    
            res.on('data', data => {
                body += data.toString();
            });
        
            let Data = '';
        
            res.on('end', () => {
                const categoryData = JSON.parse(body);
                Data = categoryData;
    
                response.render('specificProduct', { products: Data });
            });
        });
     }
});



module.exports = router;