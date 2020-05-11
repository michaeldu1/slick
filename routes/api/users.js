const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken')

// Item model
const User = require('../../models/User');

/**
 * @route GET api/users
 * @desc get all users
 * @acess public
 */
router.post('/', (req, res) => {
  const { name, username, email, password } = req.body;

  // Simple Validation
  if(!name || !email || !password){
      return res.status(400).json({msg: 'Please enter all fields'});
  }

  User.findOne({username})
    .then(user => {
      if(user) return res.status(400).json({ msg: 'Username taken' })
    })

  // Check for existing user
  User.findOne({ email })
    .then(user => {
      if(user) return res.status(400).json({ msg: 'Email already linked to account' })

      const newUser = new User({
        name,
        username,
        email,
        password
      })

      // Create salt and hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) throw err;
          newUser.password = hash;
          newUser.save()
            .then(user => {
              // sign token that lasts for an hour
              jwt.sign(
                { id: user.id },
                config.get('jwtSecret'),
                { expiresIn: 3600 },
                (err, token) => {
                  if(err) throw err;
                  res.json({
                    token,
                    user: {
                      id: user.id,
                      name: user.name,
                      email: user.email,
                      username: user.username
                    }
                  })
                }
              )
            })
        })
      })
  })

})

module.exports = router;