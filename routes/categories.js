const express = require('express');
const router = express.Router();
const https = require('https');


const base_url = 'https://osf-digital-backend-academy.herokuapp.com/api/';
const secretKey = '$2a$08$wurKWjXAIBE8zHmIsC8wPONR5Dk6X/Ov4zdrR6Rr0BQT5kqQtIq5m';

let Data = '';

router.use(express.static('public'));

// NOTE: function of router.get has 'request' and 'response' cause router 'res' was being mistaken for https res

// Get Categories by Parent Id
router.get('/parent/:id', function(request, response, next) {
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
router.get('/:id', function(request, response, next) {
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
router.get('/', function(request, response, next) {
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

module.exports = router;