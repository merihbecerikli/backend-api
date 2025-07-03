const items = require('../data/items');

describe('items data module', () => {
  
  // Test: Verify the items array exists and is properly exported
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

  // Test: Verify items have unique IDs
  test('should have unique IDs for each item', () => {
    const ids = items.map(item => item.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids).toHaveLength(uniqueIds.length);
  });

  // Test: Verify array mutability (since it's not frozen)
  test('should allow array modifications', () => {
    const originalLength = items.length;
    items.push({ id: 3, name: "Silgi" });
    expect(items).toHaveLength(originalLength + 1);
    
    // Clean up
    items.pop();
    expect(items).toHaveLength(originalLength);
  });

  // Test: Verify individual item properties can be modified
  test('should allow item property modifications', () => {
    const originalName = items[0].name;
    items[0].name = "Modified Name";
    expect(items[0].name).toBe("Modified Name");
    
    // Clean up
    items[0].name = originalName;
  });

  // Test: Verify array reference consistency
  test('should maintain same reference when required multiple times', () => {
    const items1 = require('../data/items');
    const items2 = require('../data/items');
    expect(items1).toBe(items2);
  });

  // Test: Edge case - verify array is not empty
  test('should not be empty array', () => {
    expect(items.length).toBeGreaterThan(0);
  });

  // Test: Verify data types are consistent
  test('should have consistent data types across all items', () => {
    const firstItemKeys = Object.keys(items[0]);
    items.forEach(item => {
      expect(Object.keys(item)).toEqual(firstItemKeys);
    });
  });

  // Test: Verify no null or undefined values
  test('should not contain null or undefined values', () => {
    items.forEach(item => {
      Object.values(item).forEach(value => {
        expect(value).not.toBeNull();
        expect(value).not.toBeUndefined();
      });
    });
  });
});