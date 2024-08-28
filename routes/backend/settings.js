var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const productModel = require('../../server/models/products');
const logoUpload = require('../../server/config/logoUploder');
let categoryModel = require('../../server/models/categories');
let orderModel = require('../../server/models/order');
const settingsModel = require('../../server/models/settings')
const adminLayout = '../views/layouts/Admin_layout.ejs';

router.post('/create', logoUpload.single('logo'), async function (req, res) {
    try {
        const settings = await new settingsModel({
            webName: req.body.webName,
            webDescription: req.body.webDescription,
            webKeywords: req.body.webKeywords,
            whatsappNumber: req.body.whatsappNumber,
            otherNumber: req.body.otherNumber,
            email: req.body.email,
            logo: req.file.filename,
            facebook: req.body.facebook,
            X: req.body.X,
            LinkedIn: req.body.LinkedIn,
            Instagram: req.body.Instagram
        })
        await settings.save();
        res.redirect('/admin/settings')
    } catch (error) {
        console.log(error)
    }
})

router.post('/updade', logoUpload.single('logo'), async function (req, res) {
    try {
        const updateFields = {
            webName: req.body.webName,
            webDescription: req.body.webDescription,
            webKeywords: req.body.webKeywords,
            whatsappNumber: req.body.whatsappNumber,
            otherNumber: req.body.otherNumber,
            email: req.body.email,
            facebook: req.body.facebook,
            X: req.body.X,
            LinkedIn: req.body.LinkedIn,
            Instagram: req.body.Instagram
        }
        if (req.file) {
            updateFields.logo = req.file.filename
        }
        const settings = await settingsModel.findOneAndUpdate(
            {},
            updateFields,
            { new: true }
        )
        await settings.save();
        res.redirect('/admin/settings')
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;