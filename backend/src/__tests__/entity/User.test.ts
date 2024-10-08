import { User } from '../../entity/User';

describe('User Entity', () => {
  it('should create a user instance', () => {
    const user = new User();
    user.username = 'testuser';
    user.password_hash = 'hashedpassword';
    user.email = 'test@example.com';

    expect(user).toBeInstanceOf(User);
    expect(user.username).toBe('testuser');
    expect(user.password_hash).toBe('hashedpassword');
    expect(user.email).toBe('test@example.com');
    expect(user.id).toBeUndefined();
    expect(user.created_at).toBeUndefined();
    expect(user.updated_at).toBeUndefined();
  });
});