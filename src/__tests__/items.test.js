/**
 * Unit tests for items.js module
 * Tests the exported items array data structure
 */

const items = require('../data/items');

describe('items module', () => {
  /**
   * Test: Verify items array is properly exported
   */
  test('should export items array', () => {
    expect(items).toBeDefined();
    expect(Array.isArray(items)).toBe(true);
  });

  /**
   * Test: Verify items array has correct initial data
   */
  test('should contain initial items data', () => {
    expect(items).toHaveLength(2);
    expect(items).toEqual([
      { id: 1, name: "Kalem" },
      { id: 2, name: "Defter" }
    ]);
  });

  /**
   * Test: Verify each item has required properties
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
   * Test: Verify items have unique IDs
   */
  test('should have unique item IDs', () => {
    const ids = items.map(item => item.id);
    const uniqueIds = [...new Set(ids)];
    expect(uniqueIds).toHaveLength(ids.length);
  });

  /**
   * Test: Verify items array can be modified (mutable reference)
   */
  test('should allow modification of items array', () => {
    const originalLength = items.length;
    const newItem = { id: 3, name: "Silgi" };
    
    items.push(newItem);
    expect(items).toHaveLength(originalLength + 1);
    expect(items).toContain(newItem);
    
    // Cleanup
    items.pop();
    expect(items).toHaveLength(originalLength);
  });

  /**
   * Test: Verify items array reference consistency
   */
  test('should maintain consistent reference across imports', () => {
    const itemsRef1 = require('../data/items');
    const itemsRef2 = require('../data/items');
    
    expect(itemsRef1).toBe(itemsRef2);
    expect(itemsRef1).toBe(items);
  });

  /**
   * Test: Verify items array structure integrity
   */
  test('should maintain proper array structure', () => {
    expect(items.constructor).toBe(Array);
    expect(items instanceof Array).toBe(true);
    expect(Object.prototype.toString.call(items)).toBe('[object Array]');
  });

  /**
   * Test: Verify items array handles empty scenarios
   */
  test('should handle array operations correctly', () => {
    const backup = [...items];
    
    // Test clearing array
    items.length = 0;
    expect(items).toHaveLength(0);
    expect(Array.isArray(items)).toBe(true);
    
    // Restore original data
    items.push(...backup);
    expect(items).toEqual(backup);
  });
});