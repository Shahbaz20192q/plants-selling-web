var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const productModel = require('../../server/models/products')
const categoryModel = require('../../server/models/categories')
const imageUpload = require('../../server/config/category-photo-upload')
const adminLayout = '../views/layouts/Admin_layout.ejs';

router.post('/add', imageUpload.single('image'), async function (req, res) {
    try {
        const categoryData = await new categoryModel({
            pageTitle: req.body.pageTitle,
            categoryName: req.body.categoryName,
            categorymetaDescription: req.body.categorymetaDescription,
            categoryDescription: req.body.categoryDescription,
            metaKeywords: req.body.metaKeywords,
            image: req.file.filename,
        })
        await categoryData.save();
        res.redirect('/admin/categories')
    } catch (error) {
        console.log(error)
    }
})

router.get('/edit/:id', async function (req, res) {
    try {
        const category = await categoryModel.findOne({ _id: req.params.id })
        res.render('admin/category-edit', { layout: adminLayout, category })
    } catch (error) {
        console.log(error)
    }
})

router.post('/edit/:id', imageUpload.single('image'), async function (req, res) {
    try {
        let dataArr = {
            pageTitle: req.body.pageTitle,
            categoryName: req.body.categoryName,
            categorymetaDescription: req.body.categorymetaDescription,
            categoryDescription: req.body.categoryDescription,
            metaKeywords: req.body.metaKeywords
        }
        if (req.file) {
            dataArr.image = req.file.filename
        }
        const category = await categoryModel.findOneAndUpdate(
            { _id: req.params.id },
            dataArr,
            { new: true }
        )
        res.redirect('/admin/categories')
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;