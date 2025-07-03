const items = require('../data/items');

describe('items module', () => {
  
  // Test that items is properly exported and contains expected structure
  describe('module exports', () => {
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

  // Test initial data integrity
  describe('initial data', () => {
    it('should contain expected default items', () => {
      expect(items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 1, name: "Kalem" }),
          expect.objectContaining({ id: 2, name: "Defter" })
        ])
      );
    });

    it('should have unique item ids', () => {
      const ids = items.map(item => item.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });
  });

  // Test data mutability since it's exported as a reference
  describe('data mutability', () => {
    let originalItems;

    beforeEach(() => {
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
      expect(items.length).toBe(originalItems.length + 1);
    });

    it('should allow removing items', () => {
      const removedItem = items.pop();
      expect(items.length).toBe(originalItems.length - 1);
      expect(items).not.toContain(removedItem);
    });

    it('should allow modifying existing items', () => {
      items[0].name = "Kalem Değiştirildi";
      expect(items[0].name).toBe("Kalem Değiştirildi");
    });
  });

  // Test edge cases and error scenarios
  describe('edge cases', () => {
    it('should handle empty array operations', () => {
      items.length = 0;
      expect(items.length).toBe(0);
      expect(Array.isArray(items)).toBe(true);
    });

    it('should handle accessing non-existent indices', () => {
      expect(items[999]).toBeUndefined();
    });

    it('should handle array methods on the exported reference', () => {
      const foundItem = items.find(item => item.id === 1);
      expect(foundItem).toBeDefined();
      expect(foundItem.name).toBe("Kalem");
    });
  });
});