const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// Item model
const Item = require('../../models/Item');

// Post model
const Post = require('../../models/Post');

/**
 * @route GET api/items
 * @desc get all items
 * @access public
 */
router.get('/', (req, res) => {
    Post.find()
        .sort({date: -1})
        .then(items => res.json(items))
})

/**
 * @route POST api/items
 * @desc create a post
 * @access private
 */
router.post('/', auth, (req, res) => {
    const newItem = new Post({
        description: req.body.name,
        img: req.body.img,
        username: req.body.username,
        likes: 0
    });

    newItem.save().then(item => 
        {res.json(item); console.log(item)});
});

/**
 * @route POST api/items
 * @desc create a post
 * @acess private
 */
// router.post('/', auth, (req, res) => {
//     const newItem = new Post({
//         name: req.body.name
//     });

//     newItem.save().then(post => res.json(post));
// });

/**
 * @route POST api/items
 * @desc like a post
 * @acess private
 */
router.post('/like/', auth, (req, res) => {
    console.log("post route hit")

    Post.findById(req.body.id)
        .then(item => {item.likes += 1; item.save(); console.log(item)})
        .catch(err => res.status(404).json({success: false}));
});

/**
 * @route DELETE api/items
 * @desc delete a post
 * @acess private
 */
router.delete('/:id', auth, (req, res) => {
    console.log("delete route hit")
    Post.findById(req.params.id)
        .then(item => item.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json({success: false}));
});

// @route GET api/items

module.exports = router;