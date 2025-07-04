const items = require('../data/items');

describe('items.js', () => {
  // Test that items module exports the expected data structure
  describe('Module Export', () => {
    it('should export an array of items', () => {
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);
    });

    it('should contain items with id and name properties', () => {
      items.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(typeof item.id).toBe('number');
        expect(typeof item.name).toBe('string');
      });
    });
  });

  // Test the initial data structure and content
  describe('Initial Data', () => {
    it('should contain the expected default items', () => {
      expect(items).toEqual([
        { id: 1, name: "Kalem" },
        { id: 2, name: "Defter" }
      ]);
    });

    it('should have unique item IDs', () => {
      const ids = items.map(item => item.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });

    it('should have non-empty item names', () => {
      items.forEach(item => {
        expect(item.name).toBeTruthy();
        expect(item.name.length).toBeGreaterThan(0);
      });
    });
  });

  // Test array mutation capabilities since it's a mutable export
  describe('Array Mutation', () => {
    let originalItems;

    beforeEach(() => {
      // Store original items to restore after each test
      originalItems = [...items];
    });

    afterEach(() => {
      // Restore original items
      items.length = 0;
      items.push(...originalItems);
    });

    it('should allow adding new items', () => {
      const newItem = { id: 3, name: "Silgi" };
      items.push(newItem);
      
      expect(items).toContain(newItem);
      expect(items.length).toBe(3);
    });

    it('should allow removing items', () => {
      const removedItem = items.pop();
      
      expect(removedItem).toEqual({ id: 2, name: "Defter" });
      expect(items.length).toBe(1);
    });

    it('should allow modifying existing items', () => {
      items[0].name = "Kurşun Kalem";
      
      expect(items[0].name).toBe("Kurşun Kalem");
      expect(items[0].id).toBe(1);
    });
  });

  // Test edge cases and boundary conditions
  describe('Edge Cases', () => {
    it('should handle empty state when all items are removed', () => {
      items.length = 0;
      
      expect(items).toEqual([]);
      expect(items.length).toBe(0);
    });

    it('should maintain reference integrity', () => {
      const itemsReference = require('../data/items');
      
      expect(items).toBe(itemsReference);
    });

    it('should handle array methods correctly', () => {
      const foundItem = items.find(item => item.id === 1);
      const filteredItems = items.filter(item => item.name.includes('e'));
      
      expect(foundItem).toEqual({ id: 1, name: "Kalem" });
      expect(filteredItems.length).toBe(2);
    });
  });
});