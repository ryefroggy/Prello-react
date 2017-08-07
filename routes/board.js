var express = require('express');
var mongoose = require('mongoose');
var Board = require('../models/board');
var User = require('../models/user');
var io = require('../socketio');
var cors = require('../cors');

var router = express.Router();

/* GET home page. */
router.get('/', cors, function(req, res) {
    var personal = {};
    var shared = {};
    Board.find({members: req.user.username}, function(err, boards) {
        if(err) return handleError(err);
        for(let i = 0; i < boards.length; i++) {
            if(boards[i].author === req.user.username) {
                personal[boards[i]._id] = boards[i].name;
            }
            else {
                shared[boards[i]._id] = boards[i].name;
            }
        }
        res.json({personal: personal, shared: shared});
    });
});

router.post('/', cors, function(req, res) {
  var newBoard = Board({
    name: req.body.name,
    author: req.user.username,
    members: [req.user.username]
  });
  newBoard.save(function(err, boards) {
    if(err) return handleError(err);
    res.json(newBoard);
  });
});

router.get('/:BOARDID', cors,function(req, res) {
    Board.findById(req.params.BOARDID,function(err, board) {
        res.json(board);
    });
});

router.post('/:BOARDID/member', cors,function(req, res) {
  User.count({username: req.body.member}, function(err, num) {
    if(num == 0) {
      res.send({err: "User does not exist."});
    }
    else {
      Board.findById(req.params.BOARDID,function(err, board) {
        board.members.push(req.body.member);
        board.markModified("members");
        board.save(function(err2, updatedboard) {
          if(err2) handleError(err2);
          res.send(updatedboard);
        });
      });
    }
  });
});

router.get('/:BOARDID/list', cors,function(req, res) {
  Board.findById(req.params.BOARDID, function(err, board) {
    res.json(board.lists);
  });
});

router.post('/:BOARDID/list', cors,function(req, res) {
  Board.findById(req.params.BOARDID, function(err, board) {
    board.lists.push({name: req.body.name});
    board.save(function(err2, newboard) {
      if (err2) {
        console.log(err2);
      } else {
        var list = newboard.lists[newboard.lists.length-1];
        // io.getInstance().in(req.params.BOARDID).emit('New List', {"list": list, "user": req.user.username});
        res.json(board.lists[board.lists.length-1]);
      }
    });
  });
});

router.patch('/:BOARDID/list/:LISTID', cors,function (req, res) {
  Board.findById(req.params.BOARDID, function(err, board) {
    if (err) return handleError(err);
    board.lists(req.params.LISTID).name = req.body.name;
    board.save(function(err2, newboard) {
      if (err2) {
        console.log(err2);
      }
      else {
        res.json(newboard);
      }
    });
  });
});

router.delete('/:BOARDID/list/:LISTID', cors,function(req, res) {
  Board.findById(req.params.BOARDID, function(err, board) {
    if(err) return handleError(err);
    var list = board.lists.id(req.params.LISTID);
    board.lists.id(req.params.LISTID).remove();
    board.save(function(err2, newboard) {
      if (err2) {
        console.log(err2);
      }
      else {
        io.getInstance().in(req.params.BOARDID).emit('Delete List', {"list": list, "user": req.user.username});
        res.json();
      }
    });
  });
});

router.get('/:BOARDID/list/:LISTID/card/:CARDID', cors,function(req, res) {
  Board.findById(req.params.BOARDID, function(err, board) {
    var card = board.lists.id(req.params.LISTID).cards.id(req.params.CARDID);
    res.json(card);
  });
});

router.post('/:BOARDID/list/:LISTID/card', cors,function(req, res) {
  Board.findById(req.params.BOARDID, function(err, board) {
    board.lists.id(req.params.LISTID).cards.push({
      title: req.body.title,
      author: req.user.username,
      members: [''],
      description: ""
    });
    board.save(function(err2, newboard) {
      if (err2) {
        console.log(err2);
      }
      else {
        var list = newboard.lists.id(req.params.LISTID);
        io.getInstance().in(req.params.BOARDID).emit('New Card', list);
        res.json(newboard.lists.id(req.params.LISTID));
      }
    });
  });
});

router.patch('/:BOARDID/list/:LISTID/card/:CARDID', cors,function(req, res) {
  Board.findById(req.params.BOARDID, function (err, board) {
    if(err) return handleError(err);
    var card = board.lists.id(req.params.LISTID).cards.id(req.params.CARDID);
    card.title = req.body.title;
    card.description = req.body.description;
    card.members = req.body.members;
    board.save(function(err2, updatedboard) {
      if(err2) return handleError(err2);
      var list = updatedboard.lists.id(req.params.LISTID);
      io.getInstance().in(req.params.BOARDID).emit('New Card', list);
      res.send(updatedboard);
    });
  });
});

router.delete('/:BOARDID/list/:LISTID/card/:CARDID', cors,function(req, res) {
  Board.findById(req.params.BOARDID, function(err, board) {
    if(err) return handleError(err);
    var card = board.lists.id(req.params.LISTID).cards.id(req.params.CARDID);
    board.lists.id(req.params.LISTID).cards.id(req.params.CARDID).remove();
    board.save(function(err2, updatedboard) {
      if(err2) return handleError(err2);
      io.getInstance().in(req.params.BOARDID).emit('Delete Card', {"card": card, "user": req.user.username});
      res.send();
    });
  });
});

router.post('/:BOARDID/list/:LISTID/card/:CARDID/comment', cors,function(req, res) {
  Board.findById(req.params.BOARDID, function(err, board) {
    if(err) return handleError(err);
    var card = board.lists.id(req.params.LISTID).cards.id(req.params.CARDID);
    card.comments.push({
      content: req.body.content,
      author: req.user.username,
      date: req.body.date,
    });
    board.save(function(err2, updatedboard) {
      if(err2) return handleError(err2);
      res.send(card.comments[card.comments.length-1]);
    });
  });
});

router.post('/:BOARDID/list/:LISTID/card/:CARDID/label', cors,function(req, res) {
  Board.findById(req.params.BOARDID, function(err, board) {
    var card = board.lists.id(req.params.LISTID).cards.id(req.params.CARDID);
    card.labels.push({
      name: req.body.name,
      color: req.body.color
    });
    board.save(function(err2, updatedboard) {
      if(err2) return handleError(err2);
      io.getInstance().in(req.params.BOARDID).emit('Add Label', {"card": card, "user": req.user.username});
      res.send(card.labels[card.labels.length-1]);
    });
  });
});

router.delete('/:BOARDID/list/:LISTID/card/:CARDID/label/:LABELID',cors, function(req, res) {
  Board.findById(req.params.BOARDID, function(err, board) {
    var label = board.lists.id(req.params.LISTID).cards.id(req.params.CARDID).labels.id(req.params.LABELID);
    label.remove();
    board.save(function(err2, updatedboard) {
      if(err2) return handleError(err2);
      io.getInstance().in(req.params.BOARDID).emit('Delete Label', {"label": label, "user": req.user.username, "cardid": req.params.CARDID, "listid": req.params.LISTID});
      res.send();
    });
  });
});

module.exports = router;
