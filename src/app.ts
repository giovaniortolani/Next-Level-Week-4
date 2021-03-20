import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import './database'; // por padrão reconhece que o arquivo a ser importado é o index.ts
import { router } from './routes';
import createConnection from './database';
import { AppError } from './errors/AppError';

// Cria a conexão com o banco
createConnection();

const app = express();

app.use(express.json());
app.use(router);

app.use((error: Error, request: Request, response: Response, _next: NextFunction) => {

  // Erros customizados lançados por nós
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message
    });
  }

  // Senão, provavelmente é um erro de servidor
  return response.status(500).json({
    message: `Internal server error: ${error.message}`
  });
});

export { app };