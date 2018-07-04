import request from 'supertest';

import app from '../src/server';

const dummyUser = {
  email: 'johndoe@example.com',
  password: 'password',
};

describe('login route', () => {
  afterAll(() => {
    app.server.close();
  });
  test('should respond with a 200 for login route', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toMatch('Working!');
  });
});

describe('POST / sends response', () => {
  afterAll(() => {
    app.server.close();
  });

  test('should respond with 200', async () => {
    const response = await request(app).post('/login').send(dummyUser);
    expect(response.statusCode).toBe(200);
  });
});
