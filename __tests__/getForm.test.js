/* eslint no-underscore-dangle: 0 */
/* underscore dangle disable because of need to compare id from mongo data */
import request from 'supertest';

import app from '../src/server';
import URLS from '../src/lib/urls';

const randomNumber = Math.floor(100000 + (Math.random() * 900000));
const newSubject = `NewForm${randomNumber}`;
const formId = '5b47bbdc58514355dcdf8e45';

const newForm = {
  subject: newSubject,
  topic: 'someTopic',
  subtopics: [
    {
      subtopicName: 'somesubtopic 1',
    },
    {
      subtopicName: 'somesubtopic 2',
    },
  ],
};


describe('APIs to get form', () => {
  afterAll(() => {
    app.server.close();
  });

  test('should return an form object with same form id as requested', async () => {
    const response = await request(app).get(`${URLS.getFormById}/${formId}`);
    expect(response.body._id).toBe(formId);
  });

  test('should return an array of 5 forms when no limit is provided', async () => {
    const response = await request(app).get(URLS.getForm);
    expect(response.body.length).toBe(5);
  });

  test('should return an array of 10 forms when limit is provided as 10', async () => {
    const response = await request(app).get(URLS.getForm).query({ limit: 10 });
    expect(response.body.length).toBe(10);
  });

  test('should return an array of 5 forms with newest first when no sort is provided', async () => {
    const response = await request(app).get(URLS.getForm);
    const epoch0 = (new Date(response.body[0].date)).getTime();
    const epoch1 = (new Date(response.body[1].date)).getTime();
    expect(epoch0 - epoch1).toBeGreaterThan(0);
  });

  test('should return an array of 5 forms with oldest form first when sort is equal to 1', async () => {
    const response = await request(app).get(URLS.getForm).query({ sort: 1 });
    const epoch0 = (new Date(response.body[0].date)).getTime();
    const epoch1 = (new Date(response.body[1].date)).getTime();
    expect(epoch0 - epoch1).toBeLessThan(0);
  });

  test('should return latest form ', async () => {
    await request(app).post(URLS.submitform).send(newForm);
    const response = await request(app).get(URLS.getLatestForm);
    expect(response.body.subject).toBe(newSubject);
  });
});
