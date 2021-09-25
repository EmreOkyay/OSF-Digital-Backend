const express = require('express');
const router = express.Router();
const https = require('https');
var mid = require('../middleware');


const base_url = 'https://osf-digital-backend-academy.herokuapp.com/api/';
const secretKey = '$2a$08$wurKWjXAIBE8zHmIsC8wPONR5Dk6X/Ov4zdrR6Rr0BQT5kqQtIq5m';

let Data = '';

router.use(express.static('public'));

// NOTE: function of router.get has 'request' and 'response' cause router 'res' was being mistaken for https res

// Get Categories by Parent Id
router.get('/:parent/:id', mid.requiresLogin, function(request, response, next) {
    let id = request.params.id;
    let parent = request.params.parent;
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
router.get('/:id', mid.requiresLogin, function(request, response, next) {
    let id = request.params.id;
    var allCat = `${base_url}categories?secretKey=${secretKey}`;
    var search_word = '';

    if(id === 'women') {
        search_word = 'womens';
    } else if (id === 'men') {
        search_word = 'mens';
    }

    function women_or_men(data) {
        let newData = [];
        for (var i = 0; i < data.length; i++){
            if(data[i].id.startsWith(search_word)) {
                newData.push(data[i]);
            }
        }
        return newData;
    }

    https.get(allCat, res => {
        let body = '';

        res.on('data', data => {
            body += data.toString();
        });

        res.on('end', () => {
            const categoryData = JSON.parse(body);
            Data = categoryData;
            let genderData = women_or_men(Data);

            response.render('subCategories', { categories: genderData,
                nullData: 'categories/category_404.png',
                searchWord: search_word });   
        });
    });
});

// Gel All Categories
router.get('/', mid.requiresLogin, function(request, response, next) {
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