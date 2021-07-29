const express = require('express')
const app = express()

const data = require('../data')
const utils = require('../utils')

function validateUsername(username) {
    return username === 'lauriethomas69'
}

function validatePassword(password) {
    return password === 'bhenchod'
}

app.route('/login')
    .get((req, res, next) => res.redirect('/'))
    .post((req, res, next) => {
        const username = req.body['username']
        const password = req.body['password']

        if (validateUsername(username) && validatePassword(password)) {
            const vUsername = validateUsername(username)
            res.cookie('userAuth', vUsername)
            res.redirect('/')
        } else {
            if (!validateUsername(username))
                res.redirect('/?error=user')
            else if (!validatePassword(password))
                res.redirect('/?error=pass')
            else
                res.redirect('/?error=yes')
        }
    })

app.route('/logout')
    .get((req, res, next) => {
        res.clearCookie('userAuth')
        res.redirect('/a/login')
    })

module.exports = app
