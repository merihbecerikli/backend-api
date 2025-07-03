const items = require('../data/items');

describe('items module', () => {
  // Test that the module exports the expected default items array
  test('should export default items array with initial data', () => {
    expect(items).toBeDefined();
    expect(Array.isArray(items)).toBe(true);
    expect(items).toHaveLength(2);
    expect(items[0]).toEqual({ id: 1, name: "Kalem" });
    expect(items[1]).toEqual({ id: 2, name: "Defter" });
  });

  // Test that each item has the expected structure
  test('should have items with correct structure', () => {
    items.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(typeof item.id).toBe('number');
      expect(typeof item.name).toBe('string');
    });
  });

  // Test that items have unique IDs
  test('should have unique IDs for each item', () => {
    const ids = items.map(item => item.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids).toHaveLength(uniqueIds.length);
  });

  // Test that the array is mutable (can be modified)
  test('should allow modifications to the items array', () => {
    const originalLength = items.length;
    const newItem = { id: 3, name: "Silgi" };
    
    items.push(newItem);
    expect(items).toHaveLength(originalLength + 1);
    expect(items[items.length - 1]).toEqual(newItem);
    
    // Clean up
    items.pop();
    expect(items).toHaveLength(originalLength);
  });

  // Test that individual items can be modified
  test('should allow modifications to individual items', () => {
    const originalName = items[0].name;
    items[0].name = "Yeni Kalem";
    
    expect(items[0].name).toBe("Yeni Kalem");
    
    // Clean up
    items[0].name = originalName;
  });

  // Test empty array behavior when all items are removed
  test('should handle empty array when all items are removed', () => {
    const originalItems = [...items];
    items.length = 0;
    
    expect(items).toHaveLength(0);
    expect(Array.isArray(items)).toBe(true);
    
    // Restore original items
    items.push(...originalItems);
  });
});