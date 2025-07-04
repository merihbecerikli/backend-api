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

  // Test: Verify specific items exist in the array
  test('should contain expected default items', () => {
    expect(items).toContainEqual({ id: 1, name: "Kalem" });
    expect(items).toContainEqual({ id: 2, name: "Defter" });
  });

  // Test: Verify items have unique IDs
  test('should have unique IDs for all items', () => {
    const ids = items.map(item => item.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids.length).toBe(uniqueIds.length);
  });

  // Test: Verify items array is not empty
  test('should not be empty', () => {
    expect(items.length).toBeGreaterThan(0);
  });

  // Test: Verify items array can be modified (mutable reference)
  test('should allow modification of the array', () => {
    const originalLength = items.length;
    items.push({ id: 3, name: "Test Item" });
    expect(items.length).toBe(originalLength + 1);
    
    // Clean up
    items.pop();
    expect(items.length).toBe(originalLength);
  });

  // Test: Verify all items have non-empty names
  test('should have non-empty names for all items', () => {
    items.forEach(item => {
      expect(item.name).toBeTruthy();
      expect(item.name.length).toBeGreaterThan(0);
    });
  });

  // Test: Verify all items have positive IDs
  test('should have positive IDs for all items', () => {
    items.forEach(item => {
      expect(item.id).toBeGreaterThan(0);
    });
  });
});