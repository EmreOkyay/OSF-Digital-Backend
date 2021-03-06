const express = require('express');
const router = express.Router();
const https = require('https');
var mid = require('../middleware');


const base_url = '<baseUrl>';
const secretKey = '<secretKey>';

let Data = '';

router.use(express.static('public'));

// NOTE: function of router.get has 'request' and 'response' cause router 'res' was being mistaken for https res

// Get Categories by Parent Id
router.get('/:parent/:id', function(request, response, next) {
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

            response.render('parentCategories', { categories: Data,
                                            nullData: 'categories/category_404.png',
                                            parentId: request.params.id }); 
        });
    });
});

// Get Categories by Id
router.get('/:id', function(request, response, next) {
    let id = request.params.id;
    let allCatUrl = `${base_url}categories?secretKey=${secretKey}`;
    var search_word = '';

    if(id === 'women') {
        search_word = 'womens';
    } else if (id === 'men') {
        search_word = 'mens';
    }

    function women_or_men(data) {
        let newData = [];
        let length = data.length;
        for (var i = 0; i < length; i++){
            if(data[i].id.startsWith(search_word)) {
                newData.push(data[i]);
            }
        }
        return newData;
    }

    https.get(allCatUrl, res => {
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
router.get('/', function(request, response, next) {
    const allCategoriesUrl = `${base_url}categories?secretKey=${secretKey}`;

    https.get(allCategoriesUrl, res => {
        let body = '';

        res.on('data', data => {
            body += data.toString();
        });
    
        let Data = '';
    
        res.on('end', () => {
            const categoryData = JSON.parse(body);
            Data = categoryData;

            response.render('allCategories', { categories: Data, 
                                       nullData: 'categories/category_404.png' });
        });
    });
});

module.exports = router;
