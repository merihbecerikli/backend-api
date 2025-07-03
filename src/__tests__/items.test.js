const items = require('../data/items');

describe('items module', () => {
  // Test: Verify items module exports an array
  test('should export an array of items', () => {
    expect(Array.isArray(items)).toBe(true);
  });

  // Test: Verify default items structure and content
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

  // Test: Verify items array is mutable (can be modified)
  test('should allow modifications to the array', () => {
    const originalLength = items.length;
    items.push({ id: 3, name: "Silgi" });
    expect(items.length).toBe(originalLength + 1);
    
    // Cleanup
    items.pop();
    expect(items.length).toBe(originalLength);
  });

  // Test: Verify individual item properties can be modified
  test('should allow modifications to item properties', () => {
    const originalName = items[0].name;
    items[0].name = "Modified Name";
    expect(items[0].name).toBe("Modified Name");
    
    // Cleanup
    items[0].name = originalName;
  });

  // Test: Verify items maintain reference equality
  test('should maintain reference equality across requires', () => {
    const itemsRef1 = require('../data/items');
    const itemsRef2 = require('../data/items');
    expect(itemsRef1).toBe(itemsRef2);
  });
});