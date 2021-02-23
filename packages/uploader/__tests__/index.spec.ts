import { add, greet } from '../src';

describe('@guploader/uploader module', () => {
  it('should add', () => {
    expect(add(2, 3)).toEqual(5);
  });
  it('should greet', () => {
    expect(greet('world')).toEqual('@guploader/uploader says: hello to world');
  });
});
