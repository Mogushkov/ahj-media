import validate from '../validation';

describe('корректный ввод', () => {
  const expected = { latitude: 51.50851, longitude: -0.12572 };

  test('test 1', () => {
    expect(validate('51.50851, -0.12572')).toEqual(expected);
  });

  test('test 2', () => {
    expect(validate('51.50851,-0.12572')).toEqual(expected);
  });

  test('test 3', () => {
    expect(validate('[51.50851, -0.12572]')).toEqual(expected);
  });

  test('test 4', () => {
    expect(validate('[51.50851,-0.12572]')).toEqual(expected);
  });
});

describe('некорректный ввод', () => {
  test('test 1', () => {
    expect(() => validate('hello')).toThrowError(new Error(''));
  });

  test('test 2', () => {
    expect(() => validate('51.50851; -0.12572')).toThrowError(new Error(''));
  });

  test('test 3', () => {
    expect(() => validate('51.50851,  oo.125')).toThrowError(new Error(''));
  });
});
