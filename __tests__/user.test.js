import mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';

import UserSchema from '../src/models/user.model';

const mockgoose = new Mockgoose(mongoose);

describe('User', () => {
  beforeAll(async () => {
    await mockgoose.prepareStorage();
    mongoose.connect('mongodb://example.com/classinsights');
  });

  afterAll((done) => {
    mockgoose.reset(done);
  });
  test('should be retrieved after saved', async () => {
    const user = new UserSchema({ name: 'Dummy User', email: 'test@test.com' });
    expect(true).toBe(true);

    await user.save();
    const users = await UserSchema.find();
    expect(users).not.toEqual(undefined);
    expect(users.length).toEqual(1);
    expect(users[0]).toHaveProperty('name', 'Dummy User');
  });
});
