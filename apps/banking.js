const express = require('express')
const app = express()

const data = require('../data')
const utils = require('../utils')

app.get('*', (req, res, next) => {
    if (req.cookies['userAuth'])
        return next()
    else
        return res.redirect('/')
})

app.get('/accounts', function (req, res, next) {
    res.render('accounts', {
        ...utils.basicData(req)
    })
})

app.get('/transfer', function (req, res, next) {
    res.render('transfer', {
        pageTitle: 'Transfer',
        query: {
            ...req.query,
            amount: utils.parseAmount(req.query.amount)
        },
        ...data,
        ...utils.basicData(req)
    })
})

app.use('/transfer/*', (req, res, next) => {
    if (req.query && req.query.origin === req.query.destination)
        return next('Cannot transfer to the same account')

    if (req.query && !(+utils.parseAmount(req.query.amount)))
        return next('Invalid amount')
        
    var accountNum
    if(req.query.origin == 1337)
        accountNum = 0;
    else if(req.query.origin == 2579)
        accountNum = 1;
    else if(req.query.origin == 2580)
        accountNum = 2;
    else 
        accountNum = 3;

    if(req.query && data.accounts[accountNum].balance < utils.parseAmount(req.query.amount)) 
        return next('You do not have sufficient balance to complete this transaction')

    return next()
})

app.get('/transfer/confirm', function (req, res, next) {
    res.render('transfer.confirm.pug', {
        query: {
            ...req.query,
            amount: utils.parseAmount(req.query.amount)
        },
        ...data,
        ...utils.basicData(req)
    })
})

app.get('/transfer/submit', function (req, res, next) {
    res.render('transfer.complete.pug', {
        query: {
            ...req.query,
            amount: utils.parseAmount(req.query.amount)
        },
        ...data,
        ...utils.basicData(req)
    })
})

module.exports = app