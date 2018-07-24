import request from 'supertest';

import app from '../src/server';
import URLS from '../src/lib/urls';

const newFeedback = {
  _id: '5b4633336fb0d55498fb0420',
  subject: 'test subject15',
  topic: 'topic15 topic14',
  batchId: 'P-01',
  creationDate: '2018-07-10',
  email: 'moni@mi.com',
  subtopics: [
    {
      rating: 7,
      _id: '5b4633336fb0d55498fb0422',
      subtopicName: 'subtopic15.1',
    },
    {
      rating: 7,
      _id: '5b4633336fb0d55498fb0421',
      subtopicName: 'subtopic15.2',
    },
  ],
  comments: 'WOOOOOOOOOWWWWWW!!!!!!',
};

const missingTopic = {
  _id: '5b4633336fb0d55498fb0420',
  subject: 'test subject15',
  subtopics: [
    {
      rating: 7,
      _id: '5b4633336fb0d55498fb0422',
      subtopicName: 'subtopic15.1',
    },
    {
      rating: 7,
      _id: '5b4633336fb0d55498fb0421',
      subtopicName: 'subtopic15.2',
    },
  ],
  comments: 'WOOOOOOOOOWWWWWW!!!!!!',
};

const missingId = {
  subject: 'test subject15',
  topic: 'topic15 topic14',
  subtopics: [
    {
      rating: 7,
      _id: '5b4633336fb0d55498fb0422',
      subtopicName: 'subtopic15.1',
    },
    {
      rating: 7,
      _id: '5b4633336fb0d55498fb0421',
      subtopicName: 'subtopic15.2',
    },
  ],
  comments: 'WOOOOOOOOOWWWWWW!!!!!!',
};

const missingSubject = {
  _id: '5b4633336fb0d55498fb0420',
  topic: 'topic15 topic14',
  subtopics: [
    {
      rating: 7,
      _id: '5b4633336fb0d55498fb0422',
      subtopicName: 'subtopic15.1',
    },
    {
      rating: 7,
      _id: '5b4633336fb0d55498fb0421',
      subtopicName: 'subtopic15.2',
    },
  ],
  comments: 'WOOOOOOOOOWWWWWW!!!!!!',
};


describe('Testing feedback submission', () => {
  afterAll(() => {
    app.server.close();
  });

  test('When request does not contain feedbackForm_ID, error: feedbackForm_ID is required is the response', async () => {
    const response = await request(app).post(URLS.submitfeedback).send(missingId);
    expect(response.body.error).toBe('feedbackForm_ID is required');
    expect(response.statusCode).toBe(422);
  });

  test('When request does not contain Topic, error: Topic field is required is the response ', async () => {
    const response = await request(app).post(URLS.submitfeedback).send(missingTopic);
    expect(response.body.error).toBe('Topic field is required');
    expect(response.statusCode).toBe(422);
  });

  test('When request does not contain subject, error: subject field is required is the response', async () => {
    const response = await request(app).post(URLS.submitfeedback).send(missingSubject);
    expect(response.body.error).toBe('subject field is required');
    expect(response.statusCode).toBe(422);
  });

  test('When request contains all the required data, success: feedback submission successful is the response', async () => {
    const response = await request(app).post(URLS.submitfeedback).send(newFeedback);
    expect(response.body.success).toBe('feedback submitted successfully');
    expect(response.statusCode).toBe(200);
  }, 10000);
});
