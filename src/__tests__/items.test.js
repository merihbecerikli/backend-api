const items = require('../data/items');

describe('items module', () => {
  
  // Test: Verify the module exports an array
  test('should export an array', () => {
    expect(Array.isArray(items)).toBe(true);
  });

  // Test: Verify the array contains expected initial items
  test('should contain initial items with correct structure', () => {
    expect(items).toHaveLength(2);
    expect(items[0]).toEqual({ id: 1, name: "Kalem" });
    expect(items[1]).toEqual({ id: 2, name: "Defter" });
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

  // Test: Verify array reference behavior (mutable)
  test('should be mutable and allow modifications', () => {
    const originalLength = items.length;
    const newItem = { id: 3, name: "Silgi" };
    
    items.push(newItem);
    expect(items).toHaveLength(originalLength + 1);
    expect(items[items.length - 1]).toEqual(newItem);
    
    // Cleanup
    items.pop();
  });

  // Test: Verify array persistence across requires
  test('should maintain state across multiple requires', () => {
    const items1 = require('../data/items');
    const items2 = require('../data/items');
    
    expect(items1).toBe(items2);
    expect(items1).toBe(items);
  });

  // Test: Edge case - verify IDs are unique
  test('should have unique IDs for all items', () => {
    const ids = items.map(item => item.id);
    const uniqueIds = [...new Set(ids)];
    expect(uniqueIds).toHaveLength(ids.length);
  });

  // Test: Edge case - verify names are not empty
  test('should have non-empty names for all items', () => {
    items.forEach(item => {
      expect(item.name).toBeTruthy();
      expect(item.name.trim()).not.toBe('');
    });
  });
});