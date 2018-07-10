import request from 'supertest';

import app from '../src/server';

describe('index route', () => {
  test('should respond with a 200 with no query parameters', () => {
    return request(app)
      .get('/')
      .expect(200)
      .then((response) => {
        expect(response.text).toMatch('Working!');
      });
  });
  test('should respond with a json data for server status', () => {
    return request(app)
      .get('/status')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          status: 'Server is up and running!',
        });
      });
  });
  test('should respond with a 404 for unhandled routes', () => {
    return request(app)
      .get('/somestrangeroute')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(404)
      .then((response) => {
        expect(response.status).toEqual(404);
      });
  });
  afterAll(async () => {
    await app.server.close();
  });
});
