const items = require('../data/items');

describe('items module', () => {
  // Test: Verify the items array is properly exported
  test('should export an array of items', () => {
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
  });

  // Test: Verify the structure of each item in the array
  test('should contain items with correct structure', () => {
    items.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(typeof item.id).toBe('number');
      expect(typeof item.name).toBe('string');
    });
  });

  // Test: Verify specific items exist with correct data
  test('should contain expected default items', () => {
    expect(items).toContainEqual({ id: 1, name: "Kalem" });
    expect(items).toContainEqual({ id: 2, name: "Defter" });
  });

  // Test: Verify array length and initial state
  test('should have initial length of 2', () => {
    expect(items).toHaveLength(2);
  });

  // Test: Verify items can be accessed by index
  test('should allow access to items by index', () => {
    expect(items[0]).toEqual({ id: 1, name: "Kalem" });
    expect(items[1]).toEqual({ id: 2, name: "Defter" });
  });

  // Test: Verify items array is mutable (edge case)
  test('should allow modification of the exported array', () => {
    const originalLength = items.length;
    items.push({ id: 3, name: "Silgi" });
    expect(items).toHaveLength(originalLength + 1);
    expect(items[2]).toEqual({ id: 3, name: "Silgi" });
    
    // Cleanup
    items.pop();
  });

  // Test: Verify individual item properties can be modified
  test('should allow modification of individual item properties', () => {
    const originalName = items[0].name;
    items[0].name = "Kurşun Kalem";
    expect(items[0].name).toBe("Kurşun Kalem");
    
    // Cleanup
    items[0].name = originalName;
  });

  // Test: Verify items array reference consistency
  test('should maintain reference consistency across imports', () => {
    const itemsRef1 = require('../data/items');
    const itemsRef2 = require('../data/items');
    expect(itemsRef1).toBe(itemsRef2);
  });

  // Test: Verify edge case with empty array access
  test('should handle out of bounds access gracefully', () => {
    expect(items[999]).toBeUndefined();
    expect(items[-1]).toBeUndefined();
  });

  // Test: Verify array methods work correctly
  test('should support array methods', () => {
    const foundItem = items.find(item => item.id === 1);
    expect(foundItem).toEqual({ id: 1, name: "Kalem" });
    
    const itemNames = items.map(item => item.name);
    expect(itemNames).toContain("Kalem");
    expect(itemNames).toContain("Defter");
  });
});