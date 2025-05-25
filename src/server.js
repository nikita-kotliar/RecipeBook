import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session'; 
import { env } from './utils/env.js';
import { ENV_VARS } from './constants/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import router from './routers/index.js';

const whitelist = [
  'https://recipe-book-ruddy-iota.vercel.app',
  'https://recipe-book-ojfs37rwk-nikita-kotliars-projects.vercel.app',
  'http://localhost:5173',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

export const setupServer = () => {
  const PORT = env(ENV_VARS.PORT, '3000');
  const app = express();

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions)); 

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));


  app.use(
    session({
      secret: env(ENV_VARS.SESSION_SECRET),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: env('NODE_ENV') === 'production', 
        sameSite: 'none', 
      },
    })
  );

  app.use(router);
  const docsMiddlewares = swaggerDocs();
  app.use('/api-docs', ...docsMiddlewares);
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, (error) => {
    if (error) {
      console.log('Server crushed. error: ', error);
      process.exit(1);
    }
    console.log('Server is running', PORT);
  });
};
