var Board = require('./models/board');

var permission = function(req, res, next) {
  // console.log("fail");
  // if(!req.user) {
    
  //   return res.redirect('http://localhost:3000/login');
  // }
  // Board.findById(req.params.BOARDID, function(err, board) {
  //   if(!board.members.includes(req.session.user.username)) {
  //     return res.redirect('/denied-permission');
  //   }
  // });
  next();
};

module.exports = permission;
