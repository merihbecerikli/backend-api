const items = require('../data/items');

describe('items data module', () => {
  // Test that the items module exports an array
  test('should export an array of items', () => {
    expect(Array.isArray(items)).toBe(true);
  });

  // Test the structure and content of the items array
  test('should contain the expected default items', () => {
    expect(items).toEqual([
      { id: 1, name: "Kalem" },
      { id: 2, name: "Defter" },
    ]);
  });

  // Test that items have the correct structure
  test('should have items with id and name properties', () => {
    items.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(typeof item.id).toBe('number');
      expect(typeof item.name).toBe('string');
    });
  });

  // Test that the array is not empty
  test('should not be empty', () => {
    expect(items.length).toBeGreaterThan(0);
  });

  // Test that IDs are unique
  test('should have unique IDs for each item', () => {
    const ids = items.map(item => item.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids).toEqual(uniqueIds);
  });

  // Test that names are not empty strings
  test('should have non-empty names for all items', () => {
    items.forEach(item => {
      expect(item.name).toBeTruthy();
      expect(item.name.trim()).not.toBe('');
    });
  });

  // Test array mutability (since it's exported as reference)
  test('should be mutable when imported', () => {
    const originalLength = items.length;
    items.push({ id: 3, name: "Test Item" });
    expect(items.length).toBe(originalLength + 1);
    
    // Clean up
    items.pop();
    expect(items.length).toBe(originalLength);
  });

  // Test that specific items can be found by ID
  test('should find items by ID', () => {
    const item1 = items.find(item => item.id === 1);
    const item2 = items.find(item => item.id === 2);
    
    expect(item1).toEqual({ id: 1, name: "Kalem" });
    expect(item2).toEqual({ id: 2, name: "Defter" });
  });

  // Test edge case: searching for non-existent item
  test('should return undefined for non-existent ID', () => {
    const nonExistentItem = items.find(item => item.id === 999);
    expect(nonExistentItem).toBeUndefined();
  });
});