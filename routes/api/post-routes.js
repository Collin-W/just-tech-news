const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Vote } = require('../../models');

// get all users
router.get('/', (req, res) => {
    console.log('==========================');
    Post.findAll({
        // Query Config
        attributes: ['id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
        //latest post appear first
        order: [['create_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
        
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    })
});

router.get('/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id',
      'post_url',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']

      ],
      include: [
        {
          model: Post,
          attributes: ['id', 'title', 'post_url', 'create_at']
        },
        {
          model: Post,
          attributes: ['title'],
          through: Vote,
          as: 'voted_posts'
        }
      ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// PUT /api/posts/upvote
router.put('/upvote', (req, res) => {
// create the vote
// custom static method created in models/Post.js
Post.upvote(req.body, { Vote })


  
  .then(updatedPostData => res.json(updatedPostData))
  .catch(err => {
    console.log(err);
    res.status(400).json(err);
  })
})




router.post('/post', (req, res) => {
  Post.create({
   title: req.body.title,
   post_url: req.body.post_url,
   user_id: req.body.user_id
  })
  .then(dbPostData => { res.json(dbPostData) })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
})

// {
//   "title": "Runbuddy reaches 1 million subscribers",
//   "post_url": "https://runbuddy.com/press",
//   "user_id": 1
// }

router.put('/:id', (req, res) => {
  Post.update(
    {
      title: req.body.title
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;