const express = require('express');
const router = express.Router();
const app = express();
const fetch = require('node-fetch');
var XMLHttpRequest = require('xhr2');
const https = require('https');
var mid = require('../middleware');
var Token = require('./auth.js');
const cookieParser = require('cookie-parser');

router.use(express.static('public'));

const base_url = 'https://osf-digital-backend-academy.herokuapp.com/api/';
const secretKey = '$2a$08$wurKWjXAIBE8zHmIsC8wPONR5Dk6X/Ov4zdrR6Rr0BQT5kqQtIq5m';

// Get the cart
router.get('/', function(request, response, next) {

	let JWT_Token = request.cookies.JWT_Token;
	console.log("THIS IS JWT:" + JWT_Token);

	// Send a fetch request to get the data about the cart so we can send the product ıd and get the actual info about the product
    let cartUrl = `${base_url}cart?secretKey=${secretKey}`;
	
	(async () => {
        try {
            const rawResponse = await fetch(cartUrl, {
                method: 'GET',
                headers: {
                  'Authorization':`Bearer ${JWT_Token}`,
                  'Content-Type': 'application/json'
              }
              });
              const data = await rawResponse.json();

              // console.log(data);
      
              // The  array that's going to hold all the cart data
              let bigArray = [];
      
              for(let i = 0; i < data.items.length; i++) {
                  // After getting the productId, we need to send a https req to get the image and other info about the product
                  var cartProductId = data.items[i].productId;
                  const cartSpecificProductUrl = `${base_url}products/product_search?id=${cartProductId}&secretKey=${secretKey}`;
      
                  const ress = await fetch(cartSpecificProductUrl)
                  const cartData = await ress.json()
                  bigArray.push(cartData);
      
                  if (i === data.items.length - 1) {
                      response.render('cart', { cartItems: bigArray });
                  }
              }
        } catch (error) {
            console.log(error);
            response.render('noCart');
        }
	})();
});

// Add item to the cart
router.post('/addItem', function(request, response, next) {

	let JWT_Token = request.cookies.JWT_Token;
	console.log("THIS IS JWT:" + JWT_Token);

    let productDataForCart = JSON.parse(request.body.productId);
	console.log(productDataForCart[0].variants.length);
    let addItemToCartUrl = `${base_url}cart/addItem?secretKey=${secretKey}`;

	if (productDataForCart[0].variants.length === 0) {
		alert("This item does not exist in our stocks yet, please wishlist it");			
	} else {
		(async () => {
			try {
				const rawResponse = await fetch(addItemToCartUrl, {
					method: 'POST',
					headers: {
					  'Authorization':`Bearer ${JWT_Token}`,
					  'Content-Type': 'application/json'
				  },
				  body: JSON.stringify({
					  "secretKey": `${secretKey}`,
					  "productId": productDataForCart[0].id,
					  "variantId": productDataForCart[0].variants[0].product_id,
					  "quantity": "3"
				  })
				  });
				  const data = await rawResponse.json();
				  response.redirect('/cart');
			} catch (error) {
				console.log(error);
				response.render('error', { message: error.message, status: error.status, stack: error.stack });
			}
		})();
	}
});

// Delete item from the cart
router.post('/removeItem', function(request, response, next) {

	let JWT_Token = request.cookies.JWT_Token;
	console.log("THIS IS JWT:" + JWT_Token);

    let productDataForRemoval = JSON.parse(request.body.deleteProductId);
	// console.log(productDataForRemoval[0]);
    let removeItemFromCartUrl = `${base_url}cart/removeItem?secretKey=${secretKey}`;

	(async () => {
		try {
			const rawResponse = await fetch(removeItemFromCartUrl, {
				method: 'DELETE',
				headers: {
					'Authorization':`Bearer ${JWT_Token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					"secretKey": `${secretKey}`,
					"productId": productDataForRemoval[0].id,
					"variantId": productDataForRemoval[0].variants[0].product_id
				})
				});
				// const data = await rawResponse.json();
				response.redirect('/cart');
		} catch (error) {
			console.log(error);
			response.render('error', { message: error.message, status: error.status, stack: error.stack });				
		}
	})();
});

module.exports = router;