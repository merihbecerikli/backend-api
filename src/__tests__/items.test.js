const items = require('../data/items');

describe('items module', () => {
  // Test that the module exports the expected data structure
  test('should export an array of items', () => {
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
  });

  // Test that each item has the expected properties
  test('should have items with id and name properties', () => {
    items.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(typeof item.id).toBe('number');
      expect(typeof item.name).toBe('string');
    });
  });

  // Test the specific default data
  test('should contain default items', () => {
    expect(items).toEqual([
      { id: 1, name: "Kalem" },
      { id: 2, name: "Defter" }
    ]);
  });

  // Test that the exported array is mutable
  test('should allow modifications to the array', () => {
    const originalLength = items.length;
    items.push({ id: 3, name: "Silgi" });
    expect(items.length).toBe(originalLength + 1);
    expect(items[items.length - 1]).toEqual({ id: 3, name: "Silgi" });
    
    // Clean up
    items.pop();
  });

  // Test that the array reference is consistent
  test('should maintain reference consistency', () => {
    const itemsReference = require('../data/items');
    expect(items).toBe(itemsReference);
  });

  // Test edge case: empty array scenario
  test('should handle empty array state', () => {
    const originalItems = [...items];
    items.length = 0;
    expect(items).toEqual([]);
    expect(Array.isArray(items)).toBe(true);
    
    // Restore original data
    items.push(...originalItems);
  });
});