import express from 'express';
import createError from 'http-errors'
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
import brandRouter from './routes/brands.js';
import mongoose from 'mongoose';
import dotenv  from "dotenv"


const app = express();
dotenv.config()

mongoose.connect(process.env.MONGO_URI, {useNewURLParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', MONGO_URI => console.log('Connected to Database'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '../public')));


app.use('/', indexRouter);
app.use('/brands', brandRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
  
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


export default app;