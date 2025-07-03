const items = require('../data/items');

describe('items module', () => {
  /**
   * Test that items is properly exported as an array
   */
  test('should export items as an array', () => {
    expect(Array.isArray(items)).toBe(true);
  });

  /**
   * Test that items contains expected default data
   */
  test('should contain default items with correct structure', () => {
    expect(items).toHaveLength(2);
    expect(items[0]).toEqual({ id: 1, name: "Kalem" });
    expect(items[1]).toEqual({ id: 2, name: "Defter" });
  });

  /**
   * Test that each item has required properties
   */
  test('should have items with id and name properties', () => {
    items.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(typeof item.id).toBe('number');
      expect(typeof item.name).toBe('string');
    });
  });

  /**
   * Test that items can be modified (mutable reference)
   */
  test('should allow items to be modified', () => {
    const originalLength = items.length;
    const newItem = { id: 3, name: "Silgi" };
    
    items.push(newItem);
    expect(items).toHaveLength(originalLength + 1);
    expect(items[items.length - 1]).toEqual(newItem);
    
    // Clean up
    items.pop();
  });

  /**
   * Test that items reference is consistent across imports
   */
  test('should maintain same reference across multiple requires', () => {
    const itemsSecondImport = require('../data/items');
    expect(items).toBe(itemsSecondImport);
  });

  /**
   * Test items array structure and data types
   */
  test('should contain valid item objects with correct data types', () => {
    items.forEach((item, index) => {
      expect(item).toBeInstanceOf(Object);
      expect(item.id).toBeGreaterThan(0);
      expect(item.name).toBeTruthy();
      expect(item.name.length).toBeGreaterThan(0);
    });
  });

  /**
   * Test that items array is not empty
   */
  test('should not be empty', () => {
    expect(items.length).toBeGreaterThan(0);
  });

  /**
   * Test that all items have unique IDs
   */
  test('should have unique IDs for all items', () => {
    const ids = items.map(item => item.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids).toHaveLength(uniqueIds.length);
  });
});