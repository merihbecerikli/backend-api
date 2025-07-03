/**
 * Unit tests for items module
 * Tests the items data array and its structure
 */

const items = require('../data/items');

describe('items module', () => {
  /**
   * Test that items module exports an array
   */
  test('should export an array', () => {
    expect(Array.isArray(items)).toBe(true);
  });

  /**
   * Test that items array contains expected initial data
   */
  test('should contain initial items data', () => {
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
   * Test that items have unique ids
   */
  test('should have unique ids for all items', () => {
    const ids = items.map(item => item.id);
    const uniqueIds = [...new Set(ids)];
    expect(uniqueIds).toHaveLength(ids.length);
  });

  /**
   * Test that items array can be modified (reference test)
   */
  test('should allow modifications to the array', () => {
    const originalLength = items.length;
    items.push({ id: 3, name: "Silgi" });
    expect(items).toHaveLength(originalLength + 1);
    
    // Clean up
    items.pop();
    expect(items).toHaveLength(originalLength);
  });

  /**
   * Test that individual items can be modified
   */
  test('should allow modifications to individual items', () => {
    const originalName = items[0].name;
    items[0].name = "Modified Name";
    expect(items[0].name).toBe("Modified Name");
    
    // Clean up
    items[0].name = originalName;
    expect(items[0].name).toBe(originalName);
  });

  /**
   * Test items array structure validation
   */
  test('should maintain consistent item structure', () => {
    const expectedKeys = ['id', 'name'];
    items.forEach(item => {
      expect(Object.keys(item)).toEqual(expectedKeys);
    });
  });

  /**
   * Test that items are not null or undefined
   */
  test('should not contain null or undefined items', () => {
    items.forEach(item => {
      expect(item).not.toBeNull();
      expect(item).not.toBeUndefined();
    });
  });
});