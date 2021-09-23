const express = require('express');
const router = express.Router();
const https = require('https');
var mid = require('../middleware');


const base_url = 'https://osf-digital-backend-academy.herokuapp.com/api/';
const secretKey = '$2a$08$wurKWjXAIBE8zHmIsC8wPONR5Dk6X/Ov4zdrR6Rr0BQT5kqQtIq5m';

let Data = '';

router.use(express.static('public'));

// Function so we can clear the primary_category_id for breadcrumb and use it as a main category
var removeWords = function(txt) {
    var wordsArray = [
        '-luggage', '-ties', '-accessories', '-dress-shirts', '-pants', '-shorts', '-sportscoats', '-suits',
        '-footwear', '-bottoms', '-dresses', '-jackets', '-tops', '-earrings', '-necklaces'
    ];

    var expStr = wordsArray.join("|");
    return txt.replace(new RegExp('\\b(' + expStr + ')\\b', 'gi'), ' ')
    .replace(/\s{2,}/g, ' ');
}

// Get Products
router.get('/product_search', mid.requiresLogin, function(request, response, next) {
    let product_id = request.query.id;
    
    // If the query isn't a number, show all the products, if it's a number, show the specific product
    if(isNaN(product_id)){
        var allProducts = `${base_url}products/product_search?primary_category_id=${product_id}&secretKey=${secretKey}`;

        https.get(allProducts, res => {
            let body = '';
    
            res.on('data', data => {
                body += data.toString();
            });
        
            let Data = '';
        
            res.on('end', () => {
                const categoryData = JSON.parse(body);
                Data = categoryData;
                breadcrumb_id = removeWords(product_id);
    
                response.render('products', { products: Data, 
                                              productId: product_id,
                                              breadcrumbId: breadcrumb_id});
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
                breadcrumb_id = Data[0].primary_category_id;
                breadcrumb_id_2 = removeWords(breadcrumb_id);
    
                response.render('specificProduct', { products: Data,
                                                     productId: product_id,
                                                     breadcrumbId: breadcrumb_id,
                                                     secondBreadcrumbId: breadcrumb_id_2 });
            });
        });
     }
});

module.exports = router;