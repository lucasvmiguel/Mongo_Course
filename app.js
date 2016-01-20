import "babel-polyfill"; //para usar generator(async/await) no pm2

import express from 'express';
import mongodb from 'mongodb';
import engines from 'consolidate';
import pmx from 'pmx';

pmx.init({http : true});

const API = express();
let DB;

API.engine('html', engines.nunjucks);
API.set('view engine', 'html');
API.set('views', __dirname + '/templates');

mongodb.connect('mongodb://localhost:27017/video', (err, db) => {
  if(!!err){
    throw new Error('cant open connection with mongo!');
    process.exit();
  }
  DB = db;
});

API.get('/', async (req , res) => {
  try{
    const docs = await DB.collection('movies').find({}).toArray();
    req.query.json ? res.json(docs) : res.render('movies',  {movies: docs});
  }catch(e){
    pmx.notify(new Error('não foi possível buscar os filmes'));
    res.status(500).send(e.message);
  }
});

API.use((_, res) => {
  pmx.notify(new Error('página não encontrada'));
  res.sendStatus(404)
});

API.listen(3000, () => console.log('Running'));
