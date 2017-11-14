const express = require('express');
const {db} = require('../db/sequelize');

const router = express.Router();

/* Create a User */
router.post('/', (req, res, next) => {
  console.log('req', req.body.email)
  if(!req.body.email){
    res.status(400)
    return
  }
  db.User.findOne({ where: { email: req.body.email }}).then(user => {
    console.log('Found an existing email address', user)
    if(user !== null){
      res.status(400).send('Can not create, found an existing email address')
      return
    }
    db.User.create({ email: req.body.email }).then(user => {
      console.log('created', user.uuid, user.code)
      res.status(200).json({
        uuid: user.uuid,
        code: user.code
      })
    })
  }).catch(err => {
    console.log('err', err)
    res.status(500).send({
      error: err
    });
    return
  })
});

/* Check a User.code */
router.post('/code', (req, res, next) => {
  if(!req.body.code){
    res.status(400)
    return
  }
  db.User.findOne({ where: { code: req.body.code }}).then(user => {
    if(user === null){
      res.status(400).send('No such code')
      return
    }
    res.status(200).json({
      uuid: user.uuid,
      code: user.code
    })
  }).catch(err => {
      console.log('err', err)
      res.status(500).send({
        error: err
      });
      return
  })
})

module.exports = router;
