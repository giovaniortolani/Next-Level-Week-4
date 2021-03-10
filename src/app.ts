import 'reflect-metadata';
import express from 'express';
import './database'; // por padrão reconhece que o arquivo a ser importado é o index.ts
import { router } from './routes';
import createConnection from './database';

// Cria a conexão com o banco
createConnection();

const app = express();

app.use(express.json());
app.use(router);

export { app };