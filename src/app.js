import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
import brandRouter from './routes/brands.js';


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '../public')));


app.use('/', indexRouter);
app.use('/brands', brandRouter);


export default app;