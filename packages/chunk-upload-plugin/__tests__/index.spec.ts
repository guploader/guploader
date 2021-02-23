import { add, greet } from '../src';

describe('@guploader/chunk-upload-plugin module', () => {
  it('should add', () => {
    expect(add(2, 3)).toEqual(5);
  });
  it('should greet', () => {
    expect(greet('world')).toEqual(
      '@guploader/chunk-upload-plugin says: hello to world'
    );
  });
});
