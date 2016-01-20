'use strict';

require('babel-polyfill');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _consolidate = require('consolidate');

var _consolidate2 = _interopRequireDefault(_consolidate);

var _pmx = require('pmx');

var _pmx2 = _interopRequireDefault(_pmx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; } //para usar generator(async/await) no pm2

_pmx2.default.init({ http: true });

var API = (0, _express2.default)();
var DB = undefined;

API.engine('html', _consolidate2.default.nunjucks);
API.set('view engine', 'html');
API.set('views', __dirname + '/templates');

_mongodb2.default.connect('mongodb://localhost:27017/video', function (err, db) {
  if (!!err) {
    throw new Error('cant open connection with mongo!');
    process.exit();
  }
  DB = db;
});

API.get('/', function () {
  var _this = this;

  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res) {
    var docs;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return DB.collection('movies').find({}).toArray();

          case 3:
            docs = _context.sent;

            req.query.json ? res.json(docs) : res.render('movies', { movies: docs });
            _context.next = 11;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](0);

            _pmx2.default.notify(new Error('não foi possível buscar os filmes'));
            res.status(500).send(_context.t0.message);

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this, [[0, 7]]);
  }));

  return function (_x, _x2) {
    return ref.apply(this, arguments);
  };
}());

API.use(function (_, res) {
  _pmx2.default.notify(new Error('página não encontrada'));
  res.sendStatus(404);
});

API.listen(3000, function () {
  return console.log('Running');
});
