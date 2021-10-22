function addNumber(a, b) {
  return a + b;
}

describe('Example test', () => {
  it('adds two numbers', () => {
    expect(addNumber(4, 3)).toEqual(7);
  });
});
