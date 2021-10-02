const express = require('express');
const router = express.Router();
const app = express();
const fetch = require('node-fetch');
var mid = require('../middleware');

router.use(express.static('public'));

const base_url = 'https://osf-digital-backend-academy.herokuapp.com/api/';
const secretKey = '$2a$08$wurKWjXAIBE8zHmIsC8wPONR5Dk6X/Ov4zdrR6Rr0BQT5kqQtIq5m';

// Get the wishlist
router.get('/', mid.requiresLogin, function(request, response, next) {

	JWT_Token = request.cookies.JWT_Token;

    let wishlistUrl = `${base_url}wishlist?secretKey=${secretKey}`;
	
	(async () => {
        try {
            const rawResponse = await fetch(wishlistUrl, {
                method: 'GET',
                headers: {
                  'Authorization':`Bearer ${JWT_Token}`,
                  'Content-Type': 'application/json'
              }
              });
              const data = await rawResponse.json();
      
              // The  array that's going to hold all the wishlist data
              let bigArray = [];
			  let quantityArray = [];
      
              for(let i = 0; i < data.items.length; i++) {
                  // After getting the productId, we need to send a https req to get the image and other info about the product
                  var wishlistProductId = data.items[i].productId;
                  const wishlistSpecificProductUrl = `${base_url}products/product_search?id=${wishlistProductId}&secretKey=${secretKey}`;
      
                  const ress = await fetch(wishlistSpecificProductUrl)
                  const wishlistData = await ress.json()
				  wishlistData.quantity = data.items[i].quantity; 
                  bigArray.push(wishlistData);
      
                  if (i === data.items.length - 1) {
                      response.render('wishlist', { wishlistItems: bigArray });
                  }
              }
        } catch (error) {
            response.render('noWishlist');
        }
	})();
});

// alert("This item does not exist in our stocks yet, please wishlist it");			

// Add item to the wishlist
router.post('/addItem', function(request, response, next) {

	JWT_Token = request.cookies.JWT_Token;

    let productDataForWishlist = JSON.parse(request.body.productId);

    let addItemToWishlistUrl = `${base_url}wishlist/addItem?secretKey=${secretKey}`;

	if (productDataForWishlist[0].variants.length === 0) {
		response.render('productError');			
	} else {
		(async () => {
			try {
				const rawResponse = await fetch(addItemToWishlistUrl, {
					method: 'POST',
					headers: {
					  'Authorization':`Bearer ${JWT_Token}`,
					  'Content-Type': 'application/json'
				  },
				  body: JSON.stringify({
					  "secretKey": `${secretKey}`,
					  "productId": productDataForWishlist[0].id,
					  "variantId": productDataForWishlist[0].variants[0].product_id,
					  "quantity": "1"
				  })
				  });
				  const data = await rawResponse.json();
				  response.redirect('/wishlist');
			} catch (error) {
				response.render('error', { message: error.message, status: error.status, stack: error.stack });
			}
		})();
	}
});

// Change quantity of the Item for Wishlist
router.post('/changeItemQuantity', function(request, response, next) {

	JWT_Token = request.cookies.JWT_Token;

    let productDataForWishlist = JSON.parse(request.body.generalData);
	let newQuantity = request.body.newQuantity;
    let changeQuantityUrl = `${base_url}wishlist/changeItemQuantity?secretKey=${secretKey}`;

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
					"productId": productDataForWishlist[0].id,
					"variantId": productDataForWishlist[0].variants[0].product_id,
					"quantity": newQuantity
				})
				});
				const data = await rawResponse.json();
				response.redirect('/wishlist');
		} catch (error) {
			response.render('error', { message: error.message, status: error.status, stack: error.stack });
		}
	})();
});

// Delete item from the wishlist
router.post('/removeItem', function(request, response, next) {

	JWT_Token = request.cookies.JWT_Token;

    let productDataForRemoval = JSON.parse(request.body.deleteProductId);
    let removeItemFromWishlistUrl = `${base_url}wishlist/removeItem?secretKey=${secretKey}`;

	(async () => {
		try {
			const rawResponse = await fetch(removeItemFromWishlistUrl, {
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
				response.redirect('/wishlist');
		} catch (error) {
			response.render('error', { message: error.message, status: error.status, stack: error.stack });				
		}
	})();
});

module.exports = router;