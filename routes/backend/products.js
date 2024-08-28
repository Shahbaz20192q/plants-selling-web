var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const productModel = require('../../server/models/products');
const imageUpload = require('../../server/config/product-photo-upload');
let categoryModel = require('../../server/models/categories');
let orderModel = require('../../server/models/order');

router.post('/add', imageUpload.array("images"), async function (req, res, next) {
    try {
        const category = await categoryModel.findOne({ categoryName: req.body.category });
        if (!category) {
            req.flash('error', 'Category not found');
            return res.redirect('/admin/products/add');
        }
        // Check if any input is empty
        for (const key in req.body) {
            if (!req.body[key]) {
                req.flash('error', 'Please fill all inputs');
                return res.redirect('/admin/products/add');
            }
        }

        if (!req.files) {
            req.flash('error', 'Please Select Images');
            return res.redirect('/admin/products/add');
        }

        const product = await new productModel({
            pageTitle: req.body.pageTitle,
            productName: req.body.productName,
            price: req.body.price,
            productDescription: req.body.productDescription,
            productmetaDescription: req.body.productmetaDescription,
            metaKeywords: req.body.metaKeywords,
            images: req.files.map(file => file.filename)
        });
        category.products.push(product._id)
        await category.save()
        await product.save();
        res.redirect('/admin/products');
    } catch (error) {
        console.log(error);
        req.flash('error', error.message);
        res.redirect('/admin/products/add');
    }
});

router.post('/edit/:id', imageUpload.array("images"), async function (req, res, next) {
    try {
        for (const key in req.body) {
            if (!req.body[key]) {
                req.flash('error', 'Please fill all inputs');
                return res.redirect('/admin/products/add');
            }
        }

        if (!req.files) {
            req.flash('error', 'Please Select Images');
            return res.redirect('/admin/products/add');
        }
        let dataArr = {
            pageTitle: req.body.pageTitle,
            productName: req.body.productName,
            category: req.body.category,
            price: req.body.price,
            productDescription: req.body.productDescription,
            productmetaDescription: req.body.productmetaDescription,
            metaKeywords: req.body.metaKeywords,
        };

        // Check if new images are uploaded
        if (req.files.length > 0) {
            dataArr.images = req.files.map(file => file.filename);
        }

        let product = await productModel.findOneAndUpdate(
            { _id: req.params.id },
            dataArr,
            { new: true }
        );

        console.log(product);
        res.redirect('/admin/products');
    } catch (error) {
        console.log(error);
        req.flash('error', 'An error occurred while Updating the product');
        res.redirect('/admin/products/add');
    }
});

// Delete product

router.get('/delete/:id', async function (req, res) {
    try {
        const product = await productModel.findOneAndDelete({ _id: req.params.id });
        res.redirect('/admin/products')
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;