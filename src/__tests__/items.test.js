/**
 * Unit tests for items.js module
 * Tests the exported items array data structure
 */

const items = require('../data/items');

describe('items module', () => {
  // Test basic data structure and export
  describe('module export', () => {
    test('should export an array', () => {
      expect(Array.isArray(items)).toBe(true);
    });

    test('should not be empty', () => {
      expect(items.length).toBeGreaterThan(0);
    });
  });

  // Test data structure and properties
  describe('data structure', () => {
    test('should contain items with id and name properties', () => {
      items.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(typeof item.id).toBe('number');
        expect(typeof item.name).toBe('string');
      });
    });

    test('should have unique ids', () => {
      const ids = items.map(item => item.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });

    test('should have non-empty names', () => {
      items.forEach(item => {
        expect(item.name).toBeTruthy();
        expect(item.name.trim()).not.toBe('');
      });
    });
  });

  // Test specific data content
  describe('data content', () => {
    test('should contain expected default items', () => {
      expect(items).toContainEqual({ id: 1, name: "Kalem" });
      expect(items).toContainEqual({ id: 2, name: "Defter" });
    });

    test('should have correct number of default items', () => {
      expect(items).toHaveLength(2);
    });
  });

  // Test data immutability and reference behavior
  describe('data behavior', () => {
    test('should be mutable array (items can be modified)', () => {
      const originalLength = items.length;
      const testItem = { id: 999, name: "Test Item" };
      
      items.push(testItem);
      expect(items).toHaveLength(originalLength + 1);
      expect(items).toContainEqual(testItem);
      
      // Cleanup
      items.pop();
      expect(items).toHaveLength(originalLength);
    });

    test('should maintain reference equality on multiple requires', () => {
      const itemsRef1 = require('../data/items');
      const itemsRef2 = require('../data/items');
      
      expect(itemsRef1).toBe(itemsRef2);
    });
  });

  // Test edge cases and error scenarios
  describe('edge cases', () => {
    test('should handle array methods without errors', () => {
      expect(() => items.map(item => item.id)).not.toThrow();
      expect(() => items.filter(item => item.id > 0)).not.toThrow();
      expect(() => items.find(item => item.id === 1)).not.toThrow();
    });

    test('should return valid results for common array operations', () => {
      const ids = items.map(item => item.id);
      expect(ids).toEqual([1, 2]);
      
      const filteredItems = items.filter(item => item.id > 1);
      expect(filteredItems).toHaveLength(1);
      expect(filteredItems[0].name).toBe("Defter");
      
      const foundItem = items.find(item => item.name === "Kalem");
      expect(foundItem).toBeDefined();
      expect(foundItem.id).toBe(1);
    });
  });
});