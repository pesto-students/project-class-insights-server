import request from 'supertest';

import app from '../src/server';
import URLS from '../src/lib/urls';

const existingUser = {
  email: 'theo@afc.com',
  password: 'password',
  name: 'theo',
  isInstructor: true,
};
const incompleteUser = {
  password: 'password',
};
const randomNumber = Math.floor(100000 + (Math.random() * 900000));
const invalidEmailUser = {
  email: `random${randomNumber}@`,
  password: 'password',
  name: `random${randomNumber}`,
};
const invalidPasswordUser = {
  email: `random${randomNumber}@example.com`,
  password: 'pass',
  name: `random${randomNumber}`,
};
const randomUser = {
  email: `random${randomNumber}@example.com`,
  password: 'password',
  name: `random${randomNumber}`,
};

describe('POST / sends response', () => {
  afterAll(() => {
    app.server.close();
  });

  test('should respond with email already registered already existing user', async () => {
    await request(app).post(URLS.signup).send(existingUser);
    const response = await request(app).post(URLS.signup).send(existingUser);
    expect(response.body.error).toBe('email already registered');
    expect(response.statusCode).toBe(422);
  }, 10000);
  test('should respond with All fields are required when incomplete data is sent', async () => {
    const response = await request(app).post(URLS.signup).send(incompleteUser);
    expect(response.body.error).toBe('All fields are required');
    expect(response.statusCode).toBe(422);
  });
  test('should respond with email is not valid when email is in incorrect format', async () => {
    const response = await request(app).post(URLS.signup).send(invalidEmailUser);
    expect(response.body.error).toBe('email is not valid');
    expect(response.statusCode).toBe(422);
  });
  test('should respond with Password should be minimum 8 characters long when password is short', async () => {
    const response = await request(app).post(URLS.signup).send(invalidPasswordUser);
    expect(response.body.error).toBe('Password should be minimum 8 characters long');
    expect(response.statusCode).toBe(422);
  });
  test('successful signup', async () => {
    const response = await request(app).post(URLS.signup).send(randomUser);
    expect(response.body.success).toBe('user registration successful');
    expect(response.statusCode).toBe(200);
  }, 10000);
});
