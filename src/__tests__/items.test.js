const items = require('../data/items');

describe('items module', () => {
  // Test: Verify that items is exported as an array
  test('should export an array of items', () => {
    expect(Array.isArray(items)).toBe(true);
  });

  // Test: Verify the structure and content of exported items
  test('should contain default items with correct structure', () => {
    expect(items).toEqual([
      { id: 1, name: "Kalem" },
      { id: 2, name: "Defter" }
    ]);
  });

  // Test: Verify each item has required properties
  test('should have items with id and name properties', () => {
    items.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(typeof item.id).toBe('number');
      expect(typeof item.name).toBe('string');
    });
  });

  // Test: Verify items array is not empty
  test('should not be empty', () => {
    expect(items.length).toBeGreaterThan(0);
  });

  // Test: Verify items have unique IDs
  test('should have unique IDs for each item', () => {
    const ids = items.map(item => item.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids.length).toBe(uniqueIds.length);
  });

  // Test: Verify items can be mutated (since it's a mutable array)
  test('should allow mutation of the items array', () => {
    const originalLength = items.length;
    const newItem = { id: 3, name: "Silgi" };
    
    items.push(newItem);
    expect(items.length).toBe(originalLength + 1);
    expect(items[items.length - 1]).toEqual(newItem);
    
    // Clean up
    items.pop();
  });

  // Test: Verify items array reference consistency
  test('should maintain reference consistency', () => {
    const itemsRef1 = require('../data/items');
    const itemsRef2 = require('../data/items');
    
    expect(itemsRef1).toBe(itemsRef2);
  });
});