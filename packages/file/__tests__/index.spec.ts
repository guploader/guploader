import { add, greet } from '../src';

describe('@guploader/file module', () => {
  it('should add', () => {
    expect(add(2, 3)).toEqual(5);
  });
  it('should greet', () => {
    expect(greet('world')).toEqual('@guploader/file says: hello to world');
  });
});
