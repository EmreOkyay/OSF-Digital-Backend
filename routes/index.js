const express = require('express');
const router = express.Router();
const https = require('https');
const bodyParser = require('body-parser');

const base_url = 'https://osf-digital-backend-academy.herokuapp.com/api/';
const secretKey = '$2a$08$wurKWjXAIBE8zHmIsC8wPONR5Dk6X/Ov4zdrR6Rr0BQT5kqQtIq5m';


router.use(express.static('public')); // DON'T FORGET THIS, IMPORTANT  FOR STATIC ASSETS

var baseCategories = `${base_url}categories?secretKey=${secretKey}`;
var subCategories = `${base_url}categories/:id?secretKey=${secretKey}`;
var parentCategories = `${base_url}categories/parent/:id?secretKey=${secretKey}`;

let Data = ''; // Global Variable

/* PROBLEMS

- Now, categories parent work but the page loads before the getting elements from the API
Used setTimeout function for it but need to find a better way

- Parent ID page is trying to load images from a wrong path

*/

// Get Categories by Parent ID
router.get('/categories/parent/:id', function(req, res, next) {

    let id = req.params.id;

    var subCatUrl = `${base_url}categories/parent/${id}?secretKey=${secretKey}`;

    https.get(subCatUrl, res => {
        let response = console.log('statusCode:', res.statusCode);
        let body = '';
        res.on('data', data => {
            body += data.toString();
        });

        res.on('end', () => {
            const categoryData = JSON.parse(body);
            Data = categoryData;
        });

    });

    setTimeout(function(){
        res.render('categories', { categories: Data,
            nullData: 'categories/category_404.png',
            parentId: req.params.id });            
    },1000);

});


// Get All Categories
https.get(baseCategories, res => {
    let response = console.log('statusCode:', res.statusCode);
    let body = '';
    res.on('data', data => {
        body += data.toString();
    });

    let Data = '';

    res.on('end', () => {
        const categoryData = JSON.parse(body);
        Data = categoryData;
    });

    router.get('/categories', function(req, res, next) {
        res.render('index', { categories: Data, 
                              nullData: 'categories/category_404.png'});
    });

    // router.get('/categories/:id', function(req, res, next) {
    //     res.render('subCategories', { categories: Data, 
    //                             nullData: 'categories/category_404.png', 
    //                             categoriesId: req.params.id});
    // });
});

module.exports = router;