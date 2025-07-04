/**
 * Unit tests for items.js module
 * 
 * Test Strategy:
 * - Verify module exports correctly
 * - Test data structure and content validation
 * - Test array properties and methods
 * - Test immutability and reference behavior
 * - Test edge cases for array manipulation
 * - Validate data integrity and type safety
 */

const items = require('../data/items');

describe('items module', () => {
  describe('Module Export', () => {
    it('should export an array', () => {
      expect(Array.isArray(items)).toBe(true);
    });

    it('should not be null or undefined', () => {
      expect(items).toBeDefined();
      expect(items).not.toBeNull();
    });
  });

  describe('Data Structure Validation', () => {
    it('should contain initial items with correct structure', () => {
      expect(items).toHaveLength(2);
      expect(items[0]).toEqual({ id: 1, name: "Kalem" });
      expect(items[1]).toEqual({ id: 2, name: "Defter" });
    });

    it('should have items with required properties', () => {
      items.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(typeof item.id).toBe('number');
        expect(typeof item.name).toBe('string');
      });
    });

    it('should have unique IDs for each item', () => {
      const ids = items.map(item => item.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids).toHaveLength(uniqueIds.length);
    });

    it('should have non-empty names for all items', () => {
      items.forEach(item => {
        expect(item.name).toBeTruthy();
        expect(item.name.trim()).not.toBe('');
      });
    });
  });

  describe('Array Behavior', () => {
    it('should be mutable and allow modifications', () => {
      const originalLength = items.length;
      const newItem = { id: 3, name: "Silgi" };
      
      items.push(newItem);
      expect(items).toHaveLength(originalLength + 1);
      expect(items[items.length - 1]).toEqual(newItem);
      
      // Cleanup
      items.pop();
    });

    it('should maintain reference equality across imports', () => {
      const itemsSecondImport = require('../data/items');
      expect(items).toBe(itemsSecondImport);
    });

    it('should support array methods', () => {
      const foundItem = items.find(item => item.id === 1);
      expect(foundItem).toEqual({ id: 1, name: "Kalem" });

      const filteredItems = items.filter(item => item.name.includes('e'));
      expect(filteredItems).toHaveLength(2);

      const itemNames = items.map(item => item.name);
      expect(itemNames).toEqual(["Kalem", "Defter"]);
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    it('should handle empty array scenarios', () => {
      const originalItems = [...items];
      items.length = 0;
      
      expect(items).toHaveLength(0);
      expect(items.find(item => item.id === 1)).toBeUndefined();
      expect(items.filter(item => item.name)).toHaveLength(0);
      
      // Restore original data
      items.push(...originalItems);
    });

    it('should handle accessing non-existent indices', () => {
      expect(items[999]).toBeUndefined();
      expect(items[-1]).toBeUndefined();
    });

    it('should handle modifications to individual items', () => {
      const originalName = items[0].name;
      items[0].name = "Modified Kalem";
      
      expect(items[0].name).toBe("Modified Kalem");
      
      // Restore original data
      items[0].name = originalName;
    });

    it('should handle array destructuring', () => {
      const [firstItem, secondItem, thirdItem] = items;
      
      expect(firstItem).toEqual({ id: 1, name: "Kalem" });
      expect(secondItem).toEqual({ id: 2, name: "Defter" });
      expect(thirdItem).toBeUndefined();
    });

    it('should handle spread operator', () => {
      const itemsCopy = [...items];
      expect(itemsCopy).toEqual(items);
      expect(itemsCopy).not.toBe(items);
      
      itemsCopy.push({ id: 3, name: "Test" });
      expect(itemsCopy).toHaveLength(items.length + 1);
      expect(items).toHaveLength(2);
    });
  });

  describe('Data Integrity', () => {
    it('should maintain data consistency after operations', () => {
      const originalItems = JSON.parse(JSON.stringify(items));
      
      // Perform various operations
      items.push({ id: 999, name: "Temp" });
      items.sort((a, b) => a.id - b.id);
      const tempItem = items.pop();
      
      expect(tempItem).toEqual({ id: 999, name: "Temp" });
      expect(items).toEqual(originalItems);
    });

    it('should handle concurrent access patterns', () => {
      const accessResults = [];
      
      // Simulate concurrent access
      for (let i = 0; i < 5; i++) {
        accessResults.push(items.map(item => ({ ...item })));
      }
      
      // All accesses should return the same data
      accessResults.forEach(result => {
        expect(result).toEqual([
          { id: 1, name: "Kalem" },
          { id: 2, name: "Defter" }
        ]);
      });
    });
  });

  describe('Performance and Memory', () => {
    it('should handle large operations efficiently', () => {
      const startTime = performance.now();
      
      // Perform operations that would be common in production
      for (let i = 0; i < 1000; i++) {
        const found = items.find(item => item.id === 1);
        const filtered = items.filter(item => item.name.length > 0);
        const mapped = items.map(item => item.name.toUpperCase());
      }
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // Should complete within reasonable time (adjust threshold as needed)
      expect(executionTime).toBeLessThan(1000);
    });
  });
});