import addUp from ".."

test('test addUp function', () => {
    const value = addUp(5, 6);
    
    expect(value).toBe(11);
})