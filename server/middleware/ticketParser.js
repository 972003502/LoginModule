const { isType } = require('../lib/util');

/**
 * define express middleware, If the request object contains ticket
 * this middleware will parse it.
 * The format of the ticket must be 'xxx.xxxxxx'
 */
function ticketParser(req, res, next) {
  req.ticket = function (ticketName) {
    const ticket = req.query.ticket || req.body.ticket;
    if (isType(ticket) == 'Array') {
      for (let item of ticket) {
        if (item.slice(0, item.indexOf('.')) == ticketName) {
          return item;
        }
      }
    } else if (isType(ticket) == 'String') {
      return ticket;
    } else {
      return;
    }
  }
  next();
}

module.exports = ticketParser;
