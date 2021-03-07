import 'reflect-metadata';
import express from 'express';
import './database'; // por padrão reconhece que o arquivo a ser importado é o index.ts
import { router } from './routes';

const app = express();

app.use(express.json());
app.use(router);

app.listen(3333, () => console.log('Server is running.'));

