const items = require('../data/items');

describe('items module', () => {
  // Test that the module exports an array of items
  test('should export an array of items', () => {
    expect(Array.isArray(items)).toBe(true);
    expect(items).toHaveLength(2);
  });

  // Test the structure of each item in the array
  test('should contain items with correct structure', () => {
    items.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(typeof item.id).toBe('number');
      expect(typeof item.name).toBe('string');
    });
  });

  // Test specific item values
  test('should contain expected item data', () => {
    expect(items[0]).toEqual({ id: 1, name: "Kalem" });
    expect(items[1]).toEqual({ id: 2, name: "Defter" });
  });

  // Test that items have unique IDs
  test('should have unique IDs for each item', () => {
    const ids = items.map(item => item.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids).toHaveLength(uniqueIds.length);
  });

  // Test that the module returns the same reference
  test('should return the same reference when required multiple times', () => {
    const items2 = require('../data/items');
    expect(items).toBe(items2);
  });

  // Test array immutability expectations
  test('should allow array modifications (mutable reference)', () => {
    const originalLength = items.length;
    items.push({ id: 3, name: "Silgi" });
    expect(items).toHaveLength(originalLength + 1);
    
    // Clean up
    items.pop();
    expect(items).toHaveLength(originalLength);
  });
});