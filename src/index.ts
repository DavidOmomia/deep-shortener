import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { logger, env, ResourceNotFoundError } from './utils';
import Router from './routes';
import { handleHttpError } from './middleware/middlewareService';
import { sequelize } from './models';

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: '*',
    preflightContinue: true,
  }),
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(helmet());
app.get('/status', (req, res) => res.status(200).end());
app.head('/status', (req, res) => res.status(200).end());
app.get('/welcome', (req, res) => res.send('Welcome to the Deep Shortener API!'));
app.use('/', Router);

//Not found error
app.use((req: Request, res: Response, next: NextFunction) => {
  next(handleHttpError(res, new ResourceNotFoundError()));
});
//Internal server error
app.use((req: Request, res: Response, next: NextFunction) => {
  next(handleHttpError(res));
});

const PORT = process.env.PORT || 3000;

const startApp = () => {
  const port = +env('APP_PORT') || 5050;
  return app.listen(port, async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      logger.info('Database connected successfully.');
    } catch (error) {
      logger.error('Unable to connect to the database:', error);
    }
    logger.info(`
      #################################################
      🛡️  Deep shortener listening on port: ${port} 🛡️ 
      #################################################
    `);
  });
};

if (require.main === module) {
  startApp();
}

export { app, startApp };