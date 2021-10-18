const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
var mid = require('../middleware');

router.use(express.static('public'));

const base_url = '<baseUrl>';
const secretKey = '<secretKey>';

// Get the cart
router.get('/', mid.requiresLogin, function(request, response, next) {

	JWT_Token = request.cookies.JWT_Token;

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
      
              // The  array that's going to hold all the cart data
              let bigArray = [];
      
              for(let i = 0; i < data.items.length; i++) {

                  // After getting the productId, we need to send an https req to get the image and other info about the product
                  var cartProductId = data.items[i].productId;
                  const cartSpecificProductUrl = `${base_url}products/product_search?id=${cartProductId}&secretKey=${secretKey}`;
      
                  const res = await fetch(cartSpecificProductUrl)
                  const cartData = await res.json()
				  cartData.quantity = data.items[i].quantity; 
                  bigArray.push(cartData);
      
                  if (i === data.items.length - 1) {
                      response.render('cart', { cartItems: bigArray });
                  }
              }
        } catch (error) {
            response.render('noCart');
        }
	})();
});

// Add item to the cart
router.post('/addItem', function(request, response, next) {

	JWT_Token = request.cookies.JWT_Token;

    let productDataForCart = JSON.parse(request.body.productId);
    let addItemToCartUrl = `${base_url}cart/addItem?secretKey=${secretKey}`;

	if (productDataForCart[0].variants.length === 0) {
		response.render('productError');			
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
					  "quantity": "1"
				  })
				  });
				  const data = await rawResponse.json();
				  response.redirect('/cart');
			} catch (error) {
				response.render('error', { message: error.message, status: error.status, stack: error.stack });
			}
		})();
	}
});

// Change quantity of the Item for Cart
router.post('/changeItemQuantity', function(request, response, next) {

	JWT_Token = request.cookies.JWT_Token;

    let productDataForCart = JSON.parse(request.body.generalData);
	let newQuantity = request.body.newQuantity;
    let changeQuantityUrl = `${base_url}cart/changeItemQuantity?secretKey=${secretKey}`;

	(async () => {
		try {
			const rawResponse = await fetch(changeQuantityUrl, {
				method: 'POST',
				headers: {
					'Authorization':`Bearer ${JWT_Token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					"secretKey": `${secretKey}`,
					"productId": productDataForCart[0].id,
					"variantId": productDataForCart[0].variants[0].product_id,
					"quantity": newQuantity
				})
				});
				const data = await rawResponse.json();
				response.redirect('/cart');
		} catch (error) {
			response.render('error', { message: error.message, status: error.status, stack: error.stack });
		}
	})();
});

// Delete item from the cart
router.post('/removeItem', function(request, response, next) {

	JWT_Token = request.cookies.JWT_Token;

    let productDataForRemoval = JSON.parse(request.body.deleteProductId);
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
				response.redirect('/cart');
		} catch (error) {
			response.render('error', { message: error.message, status: error.status, stack: error.stack });				
		}
	})();
});

module.exports = router;
