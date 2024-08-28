var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const productModel = require('../../server/models/products');
const imageUpload = require('../../server/config/product-photo-upload');
let categoryModel = require('../../server/models/categories');
let orderModel = require('../../server/models/order');

// add Order

router.post('/buy/:id', async function (req, res) {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            req.flash('error', 'Product not found');
            res.redirect('/admin/products');
        }
        for (const key in req.body) {
            if (!req.body[key]) {
                req.flash('error', 'Please fill all inputs');
                return res.redirect(`/product/${product._id}/buy`);
            }
        }
        const orderData = await new orderModel({
            productName: product.productName,
            productPrice: product.price * req.body.quantity,
            productImage: product.images,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            quantity: req.body.quantity,
            email: req.body.email,
            phone: req.body.phone,
            countery: req.body.countery,
            state: req.body.state,
            city: req.body.city,
            address: req.body.address,
            zip: req.body.zip,
        })
        await orderData.save();
        req.flash('success', 'Order Placed Successfully');
        res.redirect(`/product/${product._id}/buy`)
    } catch (error) {
        console.log(error)
    }
})



// Cancel order

router.get('/cancel/:id', async function (req, res) {
    try {
        const order = await orderModel.findOneAndUpdate(
            { _id: req.params.id },
            { status: "Cancel" },
            { new: true }
        );
        res.redirect('/admin/orders')
    } catch (error) {
        console.log(error)
    }
})

// compelete order

router.get('/Complete/:id', async function (req, res) {
    try {
        const order = await orderModel.findOneAndUpdate(
            { _id: req.params.id },
            { status: "Completed" },
            { new: true }
        );
        res.redirect('/admin/orders')
    } catch (error) {
        console.log(error)
    }
})


// Delete order

router.get('/delete/:id', async function (req, res) {
    try {
        const order = await orderModel.findOneAndDelete({ _id: req.params.id });
        res.redirect('/admin/orders')
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;