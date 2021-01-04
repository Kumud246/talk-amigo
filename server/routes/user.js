const express = require("express"),
  router = express.Router(),
  mongoose = require("mongoose"),
  requireLogin = require("../middleware/requireLogin"),
  Post = require("../models/post"),
  User = require("../models/user");

router.get("/user/:userId", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.userId })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.userId })
        .populate("postedBy", "_id username")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          return res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: " user not found" });
    });
});

router.put("/user/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }

      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true })
        .select("-password")
        .then(result =>  res.json(result) )
        .catch(err =>{return res.status(422).json({ error: err });} )
    
      
    }
  );
});

router.put("/user/unfollow", requireLogin, (req, res) => {
    User.findByIdAndUpdate(
      req.body.unfollowId,
      {
        $pull: { followers: req.user._id },
      },
      { new: true },
      (err, result) => {
        if (err) {
          return res.status(422).json({ error: err });
        }
  
        User.findByIdAndUpdate(
          req.user._id,
          {
            $pull: { following: req.body.unfollowId },
          },
          { new: true },
          (err, result) => {
            if (err) {
              return res.status(422).json({ error: err });
            }
            return res.json(result);
          }
        );
      }
    );
  });

  router.put("/user/updateImg" , requireLogin , (req, res) => {
    User.findByIdAndUpdate(req.user._id ,{ $set : { image : req.body.image}} , {new : true}
      , (err, result) => {
        if(err)
        {
          return res.status(422).json({error : err})
        }
        res.json(result)
      })
    
  })

module.exports = router;
