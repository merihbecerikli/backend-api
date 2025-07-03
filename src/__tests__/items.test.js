const items = require('../data/items');

describe('items module', () => {
  // Test: Verify that items is exported correctly
  test('should export items array', () => {
    expect(items).toBeDefined();
    expect(Array.isArray(items)).toBe(true);
  });

  // Test: Verify initial data structure and content
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

  // Test: Verify items array is mutable (can be modified)
  test('should allow array modifications', () => {
    const originalLength = items.length;
    items.push({ id: 3, name: "Silgi" });
    expect(items).toHaveLength(originalLength + 1);
    expect(items[items.length - 1]).toEqual({ id: 3, name: "Silgi" });
    
    // Cleanup
    items.pop();
  });

  // Test: Verify items can be filtered
  test('should allow filtering items by name', () => {
    const filteredItems = items.filter(item => item.name === "Kalem");
    expect(filteredItems).toHaveLength(1);
    expect(filteredItems[0]).toEqual({ id: 1, name: "Kalem" });
  });

  // Test: Verify items can be found by id
  test('should allow finding items by id', () => {
    const foundItem = items.find(item => item.id === 2);
    expect(foundItem).toEqual({ id: 2, name: "Defter" });
  });

  // Test: Edge case - finding non-existent item
  test('should return undefined when finding non-existent item', () => {
    const foundItem = items.find(item => item.id === 999);
    expect(foundItem).toBeUndefined();
  });

  // Test: Verify items array reference consistency
  test('should maintain reference consistency', () => {
    const itemsReference = require('../data/items');
    expect(itemsReference).toBe(items);
  });
});