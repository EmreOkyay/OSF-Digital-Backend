const express = require('express');
const router = express.Router();
const https = require('https');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const app = express();

const base_url = 'https://osf-digital-backend-academy.herokuapp.com/api/';
const secretKey = '$2a$08$wurKWjXAIBE8zHmIsC8wPONR5Dk6X/Ov4zdrR6Rr0BQT5kqQtIq5m';

let Data = ''; // Global Variable

router.use(express.static('public')); // DON'T FORGET THIS, IMPORTANT  FOR STATIC ASSETS

// Sentry Set Up
Sentry.init({
    dsn: "https://f38f23aa1b864887a40bd62da2fb1457@o1001494.ingest.sentry.io/5972902",
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
});
  
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

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
            dataCarrier = categoryData;

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