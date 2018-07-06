import request from 'supertest';
import mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';

import app from '../src/server';

const mockgoose = new Mockgoose(mongoose);


const dummyUser = {
  email: 'johndoe@example.com',
  password: 'password',
};

describe('login route', () => {
  beforeAll(async (done) => {
    await mockgoose.prepareStorage();
    mongoose.connect('mongodb://example.com/classinsights');
    done();
  });

  afterAll((done) => {
    mockgoose.reset(done);
    app.server.close();
  });
  test('should respond with a 200 for login route', async (done) => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toMatch('Working!');
    done();
  });
  test('POST / should respond with 200', async (done) => {
    const response = await request(app).post('/login').send(dummyUser);
    expect(response.statusCode).toBe(200);
    done();
  });
});
