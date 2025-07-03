const items = require('../data/items');

describe('items module', () => {
  // Test: Verify items array is properly exported
  test('should export items array', () => {
    expect(items).toBeDefined();
    expect(Array.isArray(items)).toBe(true);
  });

  // Test: Verify initial items structure and content
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
  test('should allow modification of items array', () => {
    const originalLength = items.length;
    items.push({ id: 3, name: "Silgi" });
    
    expect(items).toHaveLength(originalLength + 1);
    expect(items[items.length - 1]).toEqual({ id: 3, name: "Silgi" });
    
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

  // Test: Edge case - verify array reference behavior
  test('should maintain reference when accessed multiple times', () => {
    const firstAccess = require('../data/items');
    const secondAccess = require('../data/items');
    
    expect(firstAccess).toBe(secondAccess);
  });

  // Test: Edge case - verify type safety
  test('should handle array methods correctly', () => {
    expect(typeof items.push).toBe('function');
    expect(typeof items.pop).toBe('function');
    expect(typeof items.length).toBe('number');
  });

  // Test: Edge case - verify data integrity
  test('should maintain data integrity after operations', () => {
    const backup = [...items];
    
    // Perform operations
    items.sort((a, b) => b.id - a.id);
    items.reverse();
    
    expect(items).toEqual(backup);
  });
});