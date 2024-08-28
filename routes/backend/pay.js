const express = require('express');
// const fetch = require('node-fetch');
const router = express.Router();
const productsModel = require('../../server/models/products')
const ordersModel = require('../../server/models/order'); // Assuming you have an orders model
const tempOrdersModel = require('../../server/models/tempOrderModel'); // Assuming you have an orders model
const order = require('../../server/models/order');

const api = "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TVRRNU9EUXpMQ0p1WVcxbElqb2lNVGN4TnpnMk9EQTJOeTQyTXpJMU1qRWlmUS5NZlY5R0hUQXdkOTZOb0NzbmZ3bFQzbmk2RC10bDRmWnZ6dENBU1RYRVJocE5TdTUxeG5XSUN4cXBOU1JSVktDQzU3M3hycUFRRl9rQ2x3aXlud0d0Zw==";

router.post('/product/:id', async function (req, res, next) {
  try {
    let productId = req.params.id
    const product = await productsModel.findOne({ _id: productId })
    const fetch = (await import('node-fetch')).default;
    // First step
    let data = {
      "api_key": api
    };
    let request = await fetch('https://pakistan.paymob.com/api/auth/tokens', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    let response = await request.json();
    let token = response.token;

    // Second step
    data = {
      "auth_token": token,
      "delivery_needed": "false",
      "amount_cents": (product.price * req.body.quantity) * 100,
      "currency": "PKR",
      "items": []
    };
    request = await fetch('https://pakistan.paymob.com/api/ecommerce/orders', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    response = await request.json();
    let id = response.id;

    // Third step
    data = {
      "auth_token": token,
      "amount_cents": (product.price * req.body.quantity) * 100,
      "expiration": 3600,
      "order_id": id,
      "billing_data": {
        "apartment": "803",
        "email": req.body.email,
        "floor": "42",
        "first_name": req.body.firstName,
        "street": req.body.address,
        "building": "8028",
        "phone_number": req.body.phone,
        "shipping_method": "PKG",
        "postal_code": req.body.zip,
        "city": req.body.city,
        "country": req.body.countery,
        "last_name": req.body.lastName,
        "state": req.body.state
      },
      "currency": "PKR",
      "integration_id": 171959
    };
    request = await fetch('https://pakistan.paymob.com/api/acceptance/payment_keys', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    response = await request.json();
    let theToken = response.token;

    const tempOrder = new tempOrdersModel({
      productName: product.productName,
      productPrice: product.price * req.body.quantity,
      productImage: product.images,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      countery: req.body.countery,
      state: req.body.state,
      city: req.body.city,
      address: req.body.address,
      zip: req.body.zip,
      quantity: req.body.quantity,
      paymob_order_id: id,
      payment_status: "pending"
    })
    await tempOrder.save();
    // Redirect to the payment page
    res.redirect(`https://pakistan.paymob.com/api/acceptance/iframes/181286?payment_token=${theToken}`);
  }

  catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong!');
  }
});


router.get('/payment-status', async function (req, res, next) {
  try {
    const orderId = req.query.order;
    const success = req.query.success === 'true';
    const amountCents = parseInt(req.query.amount_cents, 10); // Convert to integer

    if (success) {
      // Fetch product details using Paymob order ID
      const tempOrder = await tempOrdersModel.findOne({ paymob_order_id: orderId })

      let order = await new ordersModel({
        productName: tempOrder.productName,
        productPrice: tempOrder.productPrice,
        productImage: tempOrder.productImage,
        email: tempOrder.email,
        firstName: tempOrder.firstName,
        lastName: tempOrder.lastName,
        phone: tempOrder.phone,
        countery: tempOrder.countery,
        state: tempOrder.state,
        city: tempOrder.city,
        address: tempOrder.address,
        zip: tempOrder.zip,
        quantity: tempOrder.quantity,
        paymob_order_id: tempOrder.paymob_order_id,
        payment_status: "Sucess"
      })
      await order.save();
      await tempOrdersModel.findOneAndDelete({ paymob_order_id: orderId })
      res.status(200).send('Thank You! Your Order Has Been Placed Successfully :)');
    } else {
      await tempOrdersModel.findOneAndDelete({ paymob_order_id: orderId })
      res.send("Your Order Could Not Be Placed. Please Try Again");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong!');
  }
});

module.exports = router;