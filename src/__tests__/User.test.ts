import request from 'supertest';
import { app } from '../app';
import createConnection from '../database';

describe('Users', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  it('Should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      email: 'example@example.com',
      name: 'User example'
    });

    expect(response.status).toBe(201);
  });

  it('Should NOT be able to create a new user with existing email', async () => {
    const response = await request(app).post('/users').send({
      email: 'example@example.com',
      name: 'User example'
    });
    expect(response.status).toBe(400);
  });
});