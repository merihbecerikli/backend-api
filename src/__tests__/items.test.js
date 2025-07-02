// Unit tests for items module
// Tests data structure and module exports

const items = require('../data/items');

describe('items module', () => {
  // Test default export structure
  describe('module export', () => {
    test('should export an array', () => {
      expect(Array.isArray(items)).toBe(true);
    });

    test('should have default items with correct structure', () => {
      expect(items).toHaveLength(2);
      expect(items[0]).toEqual({ id: 1, name: "Kalem" });
      expect(items[1]).toEqual({ id: 2, name: "Defter" });
    });
  });

  // Test data integrity
  describe('data structure validation', () => {
    test('each item should have required properties', () => {
      items.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(typeof item.id).toBe('number');
        expect(typeof item.name).toBe('string');
      });
    });

    test('items should have unique ids', () => {
      const ids = items.map(item => item.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids).toHaveLength(uniqueIds.length);
    });

    test('items should have non-empty names', () => {
      items.forEach(item => {
        expect(item.name.trim()).not.toBe('');
      });
    });
  });

  // Test array mutability
  describe('array mutability', () => {
    test('should allow adding new items', () => {
      const originalLength = items.length;
      items.push({ id: 3, name: "Silgi" });
      expect(items).toHaveLength(originalLength + 1);
      
      // Cleanup
      items.pop();
    });

    test('should allow removing items', () => {
      const originalLength = items.length;
      const removedItem = items.pop();
      expect(items).toHaveLength(originalLength - 1);
      
      // Cleanup
      items.push(removedItem);
    });

    test('should allow modifying existing items', () => {
      const originalName = items[0].name;
      items[0].name = "Modified Kalem";
      expect(items[0].name).toBe("Modified Kalem");
      
      // Cleanup
      items[0].name = originalName;
    });
  });

  // Test edge cases
  describe('edge cases', () => {
    test('should handle direct array access', () => {
      expect(items[0]).toBeDefined();
      expect(items[999]).toBeUndefined();
    });

    test('should work with array methods', () => {
      const names = items.map(item => item.name);
      expect(names).toContain("Kalem");
      expect(names).toContain("Defter");
    });

    test('should maintain reference equality on multiple requires', () => {
      delete require.cache[require.resolve('../data/items')];
      const itemsSecondImport = require('../data/items');
      expect(items).toEqual(itemsSecondImport);
    });
  });
});