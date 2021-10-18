const express = require('express');
const router = express.Router();
const https = require('https');
var mid = require('../middleware');


const base_url = '<baseUrl>';
const secretKey = '<secretKey>';

router.use(express.static('public'));

// Function so we can clear the primary_category_id for breadcrumb and use it as a main category
var removeWords = function(txt) {
    var wordsArray = [
        '-luggage', '-ties', '-dress-shirts', '-pants', '-shorts', '-sportscoats', '-suits',
        '-footwear', '-bottoms', '-dresses', '-jackets', '-tops', '-earrings', '-necklaces'
    ];

    var expStr = wordsArray.join("|");
    return txt.replace(new RegExp('\\b(' + expStr + ')\\b', 'gi'), ' ')
    .replace(/\s{2,}/g, ' ');
}

// Get Products
router.get('/product_search', mid.requiresLogin, function(request, response, next) {
    let product_id = request.query.id;

    // Since luggage product id's start with a letter, isNaN fails
    let productIdCopy = product_id;
    let length = productIdCopy.length;
    productIdCopy = productIdCopy.substr(1, length);
    
    // If the query isn't a number, show all the products, if it's a number, show the specific product
    if(isNaN(productIdCopy)){
        const allProductsUrl = `${base_url}products/product_search?primary_category_id=${product_id}&secretKey=${secretKey}`;

        https.get(allProductsUrl, res => {
            let body = '';
            let Data = '';
    
            res.on('data', data => {
                body += data.toString();
            });
        
            res.on('end', () => {
                const categoryData = JSON.parse(body);
                Data = categoryData;
                breadcrumb_id = removeWords(product_id);
    
                response.render('products', { products: Data, 
                                              productId: product_id,
                                              breadcrumbId: breadcrumb_id });
            });
        });
     } else {
         const specificProductUrl = `${base_url}products/product_search?id=${product_id}&secretKey=${secretKey}`;
    
         https.get(specificProductUrl, res => {
             let body = '';
             let Data = '';
     
             res.on('data', data => {
                 body += data.toString();
             });
         
             res.on('end', () => {
                 const categoryData = JSON.parse(body);
                 Data = categoryData;
                 let arrayForCart = [];
                 arrayForCart = Data;
                 breadcrumb_id = Data[0].primary_category_id;
                 breadcrumb_id_2 = removeWords(breadcrumb_id);
     
                 response.render('specificProduct', { products: Data,
                                                      productId: product_id,
                                                      breadcrumbId: breadcrumb_id,
                                                      secondBreadcrumbId: breadcrumb_id_2, 
                                                      arrayForCart: arrayForCart });
             });
         });
     }
});

module.exports = router;
