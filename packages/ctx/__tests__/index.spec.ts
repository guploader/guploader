import { add, greet } from '../src';

describe('@guploader/ctx module', () => {
  it('should add', () => {
    expect(add(2, 3)).toEqual(5);
  });
  it('should greet', () => {
    expect(greet('world')).toEqual('@guploader/ctx says: hello to world');
  });
});
