const express = require('express');
const router = express.Router();
const https = require('https');

const baseUrl = 'https://osf-digital-backend-academy.herokuapp.com/api/';
const secretKey = '$2a$08$wurKWjXAIBE8zHmIsC8wPONR5Dk6X/Ov4zdrR6Rr0BQT5kqQtIq5m';

let Data = ''; // Global Variable

router.use(express.static('public')); // DON'T FORGET THIS, IMPORTANT  FOR STATIC ASSETS

// NOTE: function of router.get has 'request' and 'response' cause router 'res' was being mistaken for https res

// Get Categories by Parent Id
router.get('/categories/parent/:id', function(request, response, next) {
    let id = request.params.id;
    let parentCatUrl = `${baseUrl}categories/parent/${id}?secretKey=${secretKey}`;

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
    var specificCatUrl = `${baseUrl}categories/${id}?secretKey=${secretKey}`;

    https.get(specificCatUrl, res => {
        let response = console.log('statusCode:', res.statusCode);
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
    var allCategories = `${baseUrl}categories?secretKey=${secretKey}`;

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