'use strict';
const reporter = require('reporter');

module.exports.handler = async (event, context) => {
  const boards = ['board1', 'board2', 'board3'];
  boards.forEach(function(board) {
    reporter(board, '', '');
  });
};
