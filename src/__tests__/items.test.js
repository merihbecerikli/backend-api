// Unit tests for items.js - Static data module containing item list
// Tests data structure integrity, export functionality, and data access patterns

const items = require('../data/items');

describe('items data module', () => {
  // Test 1: Verify module exports correct data structure
  test('should export an array of items', () => {
    expect(Array.isArray(items)).toBe(true);
    expect(items).toBeDefined();
  });

  // Test 2: Verify initial data structure and content
  test('should contain expected initial items', () => {
    expect(items).toHaveLength(2);
    expect(items[0]).toEqual({ id: 1, name: "Kalem" });
    expect(items[1]).toEqual({ id: 2, name: "Defter" });
  });

  // Test 3: Verify each item has required properties
  test('should have items with id and name properties', () => {
    items.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(typeof item.id).toBe('number');
      expect(typeof item.name).toBe('string');
    });
  });

  // Test 4: Test data mutability (since it's exported as reference)
  test('should allow modification of items array', () => {
    const originalLength = items.length;
    items.push({ id: 3, name: "Silgi" });
    
    expect(items).toHaveLength(originalLength + 1);
    expect(items[2]).toEqual({ id: 3, name: "Silgi" });
    
    // Cleanup
    items.pop();
  });

  // Test 5: Test individual item property modification
  test('should allow modification of item properties', () => {
    const originalName = items[0].name;
    items[0].name = "Modified Kalem";
    
    expect(items[0].name).toBe("Modified Kalem");
    
    // Cleanup
    items[0].name = originalName;
  });

  // Test 6: Verify data consistency after operations
  test('should maintain data integrity after array operations', () => {
    const backup = [...items];
    
    // Test splice operation
    items.splice(1, 1);
    expect(items).toHaveLength(1);
    expect(items[0]).toEqual({ id: 1, name: "Kalem" });
    
    // Restore data
    items.length = 0;
    items.push(...backup);
    
    expect(items).toHaveLength(2);
    expect(items).toEqual(backup);
  });

  // Test 7: Test empty state handling
  test('should handle empty array state', () => {
    const backup = [...items];
    items.length = 0;
    
    expect(items).toHaveLength(0);
    expect(Array.isArray(items)).toBe(true);
    
    // Restore data
    items.push(...backup);
  });

  // Test 8: Test find operations on data
  test('should support array methods for data access', () => {
    const foundItem = items.find(item => item.id === 1);
    expect(foundItem).toEqual({ id: 1, name: "Kalem" });
    
    const foundByName = items.find(item => item.name === "Defter");
    expect(foundByName).toEqual({ id: 2, name: "Defter" });
    
    const notFound = items.find(item => item.id === 999);
    expect(notFound).toBeUndefined();
  });

  // Test 9: Test filter operations
  test('should support filtering operations', () => {
    const filtered = items.filter(item => item.name.includes("e"));
    expect(filtered).toHaveLength(2); // Both "Kalem" and "Defter" contain "e"
    
    const exactMatch = items.filter(item => item.name === "Kalem");
    expect(exactMatch).toHaveLength(1);
    expect(exactMatch[0]).toEqual({ id: 1, name: "Kalem" });
  });

  // Test 10: Test data type validation edge cases
  test('should handle edge cases in data structure', () => {
    // Test with invalid data temporarily
    const backup = [...items];
    items.push({ id: "invalid", name: 123 });
    
    expect(items[2].id).toBe("invalid");
    expect(items[2].name).toBe(123);
    
    // Restore original state
    items.length = 0;
    items.push(...backup);
  });
});