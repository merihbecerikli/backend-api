const items = require('../data/items');

describe('items.js', () => {
  describe('Module Export', () => {
    // Test that the module exports an array
    it('should export an array', () => {
      expect(Array.isArray(items)).toBe(true);
    });

    // Test that the array contains expected initial data
    it('should contain initial items with correct structure', () => {
      expect(items).toEqual([
        { id: 1, name: "Kalem" },
        { id: 2, name: "Defter" }
      ]);
    });

    // Test that each item has required properties
    it('should have items with id and name properties', () => {
      items.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(typeof item.id).toBe('number');
        expect(typeof item.name).toBe('string');
      });
    });
  });

  describe('Data Integrity', () => {
    // Test that items have unique IDs
    it('should have unique IDs for each item', () => {
      const ids = items.map(item => item.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });

    // Test that all items have non-empty names
    it('should have non-empty names for all items', () => {
      items.forEach(item => {
        expect(item.name).toBeTruthy();
        expect(item.name.trim()).not.toBe('');
      });
    });

    // Test that IDs are positive numbers
    it('should have positive numeric IDs', () => {
      items.forEach(item => {
        expect(item.id).toBeGreaterThan(0);
        expect(Number.isInteger(item.id)).toBe(true);
      });
    });
  });

  describe('Array Behavior', () => {
    // Test that the array is mutable (can be modified)
    it('should allow modifications to the array', () => {
      const originalLength = items.length;
      const newItem = { id: 3, name: "Silgi" };
      
      items.push(newItem);
      expect(items.length).toBe(originalLength + 1);
      expect(items[items.length - 1]).toEqual(newItem);
      
      // Clean up
      items.pop();
    });

    // Test that individual items can be modified
    it('should allow modifications to individual items', () => {
      const originalName = items[0].name;
      items[0].name = "Test Item";
      
      expect(items[0].name).toBe("Test Item");
      
      // Clean up
      items[0].name = originalName;
    });
  });

  describe('Edge Cases', () => {
    // Test behavior when array is empty (after clearing)
    it('should handle empty array state', () => {
      const originalItems = [...items];
      items.length = 0;
      
      expect(items).toHaveLength(0);
      expect(Array.isArray(items)).toBe(true);
      
      // Restore original data
      items.push(...originalItems);
    });

    // Test that the module reference remains consistent
    it('should maintain consistent module reference', () => {
      const itemsRef1 = require('../data/items');
      const itemsRef2 = require('../data/items');
      
      expect(itemsRef1).toBe(itemsRef2);
      expect(itemsRef1).toBe(items);
    });
  });
});