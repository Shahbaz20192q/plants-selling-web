var express = require('express');
var router = express.Router();
const userLayout = '../views/layouts/User_layout.ejs';
const productsModel = require('../server/models/products')
const categoryModel = require('../server/models/categories')
const settingsModel = require('../server/models/settings')
const customerModel = require('../server/models/customers')
const messageModel = require('../server/models/messages')

/* GET home page. */
router.get('/', async function (req, res, next) {
  settingsModel.create({
    logo: ''
  })
  const settings = await settingsModel.findOne();
  const products = await productsModel.find();
  const categories = await categoryModel.find();

  res.render('index', { layout: userLayout, products, categories, settings });
});

router.get('/product/:id', async function (req, res, next) {
  try {
    const categories = await categoryModel.find();
    const settings = await settingsModel.findOne();
    const product = await productsModel.findOne({ _id: req.params.id });
    res.render('user/single_product', { layout: userLayout, settings, product, categories });
  } catch (error) {
    console.log(error)
  }
});

router.get('/product/:id/buy', async function (req, res) {
  try {
    const categories = await categoryModel.find();
    const product = await productsModel.findOne({ _id: req.params.id });
    const settings = await settingsModel.findOne();

    res.render('user/buy_page', { categories, product, settings })
  } catch (error) {
    console.log(error)
  }

})

router.get('/category/:categoryName', async function (req, res, next) {
  try {
    // const product = await productsModel.findOne({ _id: req.params.id });
    const category = await categoryModel.findOne({ categoryName: req.params.categoryName }).populate('products');
    const categories = await categoryModel.find();
    const settings = await settingsModel.findOne();

    res.render('user/category', { layout: userLayout, category, settings, categories });
  } catch (error) {
    console.log(error)
  }
});

router.get('/shop', async function (req, res, next) {
  try {
    const products = await productsModel.find();
    const settings = await settingsModel.findOne();
    const categories = await categoryModel.find();
    res.render('user/shop', { layout: userLayout, products, settings, categories });
  } catch (error) {
    console.log(error)
  }
});
router.get('/contect', async function (req, res, next) {
  try {
    const categories = await categoryModel.find();
    const settings = await settingsModel.findOne();
    res.render('user/contect', { categories, settings })
  } catch (error) {
    console.log(error)
  }
});

router.post('/message', async function (req, res, next) {
  try {
    const messageData = await new messageModel({
      userName: req.body.userName,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message,
    })
    await messageData.save()
    req.flash('success', 'Thank You! Your Message has been received success fully ')
    res.redirect('/contect')
  } catch (error) {
    console.log(error)
  }
});

router.post('/subscribe', async function (req, res, next) {
  try {
    const chachEmail = await customerModel.findOne({ customer: req.body.email })
    if (!req.body.email) {
      req.flash('error', 'Please Enter Your Email Address');
      return res.redirect('/')
    }

    if (chachEmail) {
      req.flash('error', 'This email is already exist. Try an other');
      return res.redirect('/')
    }
    console.log(req.body.email)
    const customersSchema = customerModel.create({
      customer: req.body.email
    })
    req.flash('success', 'Thank You, You have Subscribe Successfully. :-)');
    res.redirect("/")
  } catch (error) {
    console.log(error)
  }
});

router.get('/search', async function (req, res, next) {
  try {
    const query = req.query.search
    const settings = await settingsModel.findOne();
    const categories = await categoryModel.find();
    if (query) {
      products = await productsModel.find({
        $or: [
          { productName: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
          { metaKeywords: { $regex: query, $options: 'i' } }
        ]
      });
    } else {
      products = [];
    }
    res.render('user/search', { layout: userLayout, categories, products, settings })
  } catch (error) {
    console.log(error)
  }
});

module.exports = router;
