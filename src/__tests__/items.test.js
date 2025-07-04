const items = require('../data/items');

describe('items module', () => {
  // Test: Verify the items array is exported correctly
  test('should export an array of items', () => {
    expect(Array.isArray(items)).toBe(true);
    expect(items).toHaveLength(2);
  });

  // Test: Verify the structure of each item object
  test('should have items with correct structure', () => {
    items.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(typeof item.id).toBe('number');
      expect(typeof item.name).toBe('string');
    });
  });

  // Test: Verify specific item data
  test('should contain expected items', () => {
    expect(items).toContainEqual({ id: 1, name: "Kalem" });
    expect(items).toContainEqual({ id: 2, name: "Defter" });
  });

  // Test: Verify the first item
  test('should have correct first item', () => {
    expect(items[0]).toEqual({ id: 1, name: "Kalem" });
  });

  // Test: Verify the second item
  test('should have correct second item', () => {
    expect(items[1]).toEqual({ id: 2, name: "Defter" });
  });

  // Test: Verify array is not empty
  test('should not be empty', () => {
    expect(items.length).toBeGreaterThan(0);
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
      expect(item.name.length).toBeGreaterThan(0);
    });
  });
});