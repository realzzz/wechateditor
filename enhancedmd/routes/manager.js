/*
* @Author: Vaninadh
* @Date:   2016-05-27 14:33:10
* @Last Modified by:   Vaninadh
* @Last Modified time: 2016-06-02 17:12:47
*/
var express = require('express');
var router = express.Router();

router.get('/account', function(req, res, next) {
    res.render('manager/account', {});
});

router.get('/gzh', function(req, res, next) {
    res.render('manager/gzh', {});
});

router.get('/auth', function(req, res, next) {
    res.render('manager/auth', {});
});

router.get('/article', function(req, res, next) {
    res.render('manager/article', {});
});

router.get('/syncarticle', function(req, res, next) {
    res.render('manager/syncarticle', {});
});

module.exports = router;