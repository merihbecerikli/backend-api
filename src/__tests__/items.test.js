const items = require('../data/items');

describe('items module', () => {
  
  // Test: Verify items array structure and content
  test('should export an array with correct structure', () => {
    expect(Array.isArray(items)).toBe(true);
    expect(items).toHaveLength(2);
  });

  // Test: Verify first item properties
  test('should contain first item with correct properties', () => {
    expect(items[0]).toEqual({
      id: 1,
      name: "Kalem"
    });
    expect(items[0]).toHaveProperty('id');
    expect(items[0]).toHaveProperty('name');
    expect(typeof items[0].id).toBe('number');
    expect(typeof items[0].name).toBe('string');
  });

  // Test: Verify second item properties
  test('should contain second item with correct properties', () => {
    expect(items[1]).toEqual({
      id: 2,
      name: "Defter"
    });
    expect(items[1]).toHaveProperty('id');
    expect(items[1]).toHaveProperty('name');
    expect(typeof items[1].id).toBe('number');
    expect(typeof items[1].name).toBe('string');
  });

  // Test: Verify all items have unique IDs
  test('should have unique IDs for all items', () => {
    const ids = items.map(item => item.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids).toHaveLength(uniqueIds.length);
  });

  // Test: Verify all items have non-empty names
  test('should have non-empty names for all items', () => {
    items.forEach(item => {
      expect(item.name).toBeTruthy();
      expect(item.name.trim()).not.toBe('');
    });
  });

  // Test: Verify items array is mutable (edge case)
  test('should allow array modification', () => {
    const originalLength = items.length;
    items.push({ id: 3, name: "Test Item" });
    expect(items).toHaveLength(originalLength + 1);
    
    // Clean up
    items.pop();
    expect(items).toHaveLength(originalLength);
  });

  // Test: Verify items maintain reference equality
  test('should maintain reference equality on multiple requires', () => {
    const itemsReference1 = require('../data/items');
    const itemsReference2 = require('../data/items');
    expect(itemsReference1).toBe(itemsReference2);
  });

  // Test: Verify item structure consistency
  test('should have consistent structure across all items', () => {
    const expectedKeys = ['id', 'name'];
    items.forEach(item => {
      expect(Object.keys(item)).toEqual(expectedKeys);
    });
  });
});