import request from 'supertest';
import mongoose from 'mongoose';

import app from '../src/server';
import URLS from '../src/lib/urls';

const newForm = {
  subject: 'test subject15',
  topic: 'topic15 topic14',
  email: 'moni@mi.com',
  batchId: 'p01',
  subtopics: [
    {
      subtopicName: 'subtopic15.1',
    },
    {
      subtopicName: 'subtopic15.2',
    },
  ],
};

const topicMissing = {
  subject: 'test subject15',
  subtopics: [
    {
      subtopicName: 'subtopic15.1',
    },
    {
      subtopicName: 'subtopic15.2',
    },
  ],
};

const subjectMissing = {
  topic: 'topic15 topic14',
  subtopics: [
    {
      subtopicName: 'subtopic15.1',
    },
    {
      subtopicName: 'subtopic15.2',
    },
  ],
};

describe('Feedback form creation', () => {
  afterAll(() => {
    mongoose.disconnect();
    app.server.close();
  });

  test('should respond with subject field is required', async () => {
    const response = await request(app).post(URLS.submitform).send(subjectMissing);
    expect(response.body.error).toBe('subject field is required');
    expect(response.statusCode).toBe(422);
  });

  test('should respond with Topic field is required', async () => {
    const response = await request(app).post(URLS.submitform).send(topicMissing);
    expect(response.body.error).toBe('Topic field is required');
    expect(response.statusCode).toBe(422);
  });

  test('Form submission successful', async () => {
    const response = await request(app).post(URLS.submitform).send(newForm);
    expect(response.body.success).toBe('Form saved successfully');
    expect(response.statusCode).toBe(200);
  }, 10000);
});
