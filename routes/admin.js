var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const adminLayout = '../views/layouts/Admin_layout.ejs';
const formLayout = '../views/layouts/login.ejs';
const adminModel = require('../server/models/adminModel');
const productModel = require('../server/models/products');
const categoriesModel = require('../server/models/categories');
const ordersModel = require('../server/models/order');
const settingsModel = require('../server/models/settings')
const customerModel = require('../server/models/customers')
const messageModel = require('../server/models/messages')
const nodemailer = require('nodemailer');
const url = require('url')

const passport = require('passport');

const localStrategy = require('passport-local');
passport.use(new localStrategy(adminModel.authenticate()));

/* GET admin login page */
router.get('/', function (req, res, next) {
    try {
        res.render('admin/login', { layout: formLayout });
    } catch (error) {
        console.log(error)
    }
})

router.get('/orders', async function (req, res, next) {
    try {
        const orders = await ordersModel.find()
        res.render('admin/admin_orders', { layout: adminLayout, orders });
    } catch (error) {
        console.log(error)
    }
})

router.get('/orders/:id', async function (req, res, next) {
    try {
        const order = await ordersModel.findOne({ _id: req.params.id })
        res.render('admin/single_order', { layout: adminLayout, order });
    } catch (error) {
        console.log(error)
    }
})

router.get('/products', async function (req, res, next) {
    try {
        const products = await productModel.find();
        res.render('admin/admin_progucts', { layout: adminLayout, products })
    } catch (error) {
        console.log(error)
    }
})

router.get('/settings', async function (req, res, next) {
    try {
        const settings = await settingsModel.findOne();

        if (settings) {
            res.render('admin/update_settings', { layout: adminLayout, settings })
        } else {
            res.render('admin/settings', { layout: adminLayout, settings })
        }
    } catch (error) {
        console.log(error)
    }
})

router.get('/products/add', async function (req, res, next) {
    try {
        const categories = await categoriesModel.find();
        res.render('admin/admin_product_add', { layout: adminLayout, categories })
    } catch (error) {
        console.log(error)
    }
})

router.get('/products/edit/:id', async function (req, res) {
    try {
        const id = req.params.id;
        const categories = await categoriesModel.find();
        const product = await productModel.findById(id);
        res.render('admin/edit', { layout: adminLayout, categories, product })
    } catch (error) {
        console.log(error)
    }
});

router.get('/categories', async function (req, res, next) {
    try {
        const categories = await categoriesModel.find();
        res.render('admin/categories', { layout: adminLayout, categories })
    } catch (error) {
        console.log(error)
    }
})

router.get('/category/add', function (req, res, next) {
    try {
        res.render('admin/admin_category_add', { layout: adminLayout })
    } catch (error) {
        console.log(error)
    }
})

router.get('/customers', async function (req, res, next) {
    try {
        const customers = await customerModel.find();
        res.render('admin/customers', { layout: adminLayout, customers })
    } catch (error) {
        console.log(error)
    }
})

router.get('/customer/mail/:id', async function (req, res, next) {
    try {
        const customer = await customerModel.findOne({ _id: req.params.id });
        res.render('admin/single_customer_mail', { layout: adminLayout, customer })
    } catch (error) {
        console.log(error)
    }
})

router.get('/customers/mail', async function (req, res, next) {
    try {
        const customers = await customerModel.find();
        res.render('admin/customers_mail', { layout: adminLayout, customers })
    } catch (error) {
        console.log(error)
    }
})

router.post('/customers/mail', function (req, res, next) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "shahbazghaffar00@gmail.com",
                pass: "wsgm vvlt hcko axzo",
            }
        });

        const EmailBody = req.body.EmailBody;
        const mailOptions = {
            from: "shahbazghaffar00@gmail.com",
            to: req.body.emails,
            subject: req.body.subject,
            text: `${EmailBody}`,
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.error('Error occurred:', error);
            }
            console.log('Message sent successfully!');
            console.log('Message info:', info);
        });
        req.flash('success', 'Mail Send Successfully');
        const referringPage = req.headers.referer || '/';
        const redirectURL = url.resolve(req.protocol + '://' + req.get('host'), referringPage);
        res.redirect(redirectURL);
    } catch (error) {
        console.log(error)
    }
})

router.get('/messages', async function (req, res, next) {
    try {
        const messages = await messageModel.find();
        res.render('admin/messages', { layout: adminLayout, messages })
    } catch (error) {
        console.log(error)
    }
})
router.get('/messages/:id', async function (req, res, next) {
    try {
        const id = req.params.id
        
        const message = await messageModel.findOne({ _id: id });
        res.render('admin/singel_Message', { layout: adminLayout, message })
    } catch (error) {
        console.log(error)
    }
})

router.post('/register', function (req, res, next) {
    try {
        var adminData = new adminModel({
            username: req.body.username,
            email: req.body.email
        })
        adminModel.register(adminData, req.body.password).then(function () {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/admin/orders")
            })
        })
    } catch (error) {
        console.log(error)
    }
})

router.post("/login", passport.authenticate("local", {
    successRedirect: '/admin/orders',
    failureRedirect: "/admin"
}), function (req, res) { })

module.exports = router;