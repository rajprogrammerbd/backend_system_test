require('express-async-errors');
require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import Database from "./config/db.config"
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.route';
import appRoute from './routes/appRoutes.route';

process.on('uncaughtException', err => {
  console.log(`Uncaught Exception logged:`, err, err.stack);
});

process.on('unhandledRejection', error => {
  console.error('unhandledRejection', error);
});

// Check for database connection.
Database.connect().then(() => {
  console.log('Database (MongoDB) is connected');
});

const app: express.Application = express();

app.use(cookieParser());
app.use(express.json());

const corsConfig = {
  credentials: true,
  origin: true,
};

app.use(cors(corsConfig));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use('/api', authRoutes);
app.use('/api', appRoute);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const statusCode = err.statusCode || 500;
    
    res.status(statusCode).json({'message': err.message});
    
    return;
});

const PORT = process.env.PORT || 5000;
export const appPort = app.listen(PORT, () => console.log(`Application is running on ${PORT}`));