const items = require('../data/items');

describe('items module', () => {
  // Test that the module exports the expected data structure
  test('should export an array of items', () => {
    expect(Array.isArray(items)).toBe(true);
    expect(items).toHaveLength(2);
  });

  // Test the structure of individual items
  test('should have items with correct structure', () => {
    items.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(typeof item.id).toBe('number');
      expect(typeof item.name).toBe('string');
    });
  });

  // Test specific item values
  test('should contain expected default items', () => {
    expect(items).toEqual([
      { id: 1, name: "Kalem" },
      { id: 2, name: "Defter" }
    ]);
  });

  // Test that items array can be modified (mutable reference)
  test('should allow modification of items array', () => {
    const originalLength = items.length;
    items.push({ id: 3, name: "Silgi" });
    expect(items).toHaveLength(originalLength + 1);
    expect(items[2]).toEqual({ id: 3, name: "Silgi" });
    
    // Cleanup
    items.pop();
  });

  // Test that individual item properties can be modified
  test('should allow modification of item properties', () => {
    const originalName = items[0].name;
    items[0].name = "Kurşun Kalem";
    expect(items[0].name).toBe("Kurşun Kalem");
    
    // Cleanup
    items[0].name = originalName;
  });

  // Test accessing items by index
  test('should allow accessing items by index', () => {
    expect(items[0]).toBeDefined();
    expect(items[1]).toBeDefined();
    expect(items[2]).toBeUndefined();
  });

  // Test that module maintains reference consistency
  test('should maintain reference consistency across requires', () => {
    const itemsReference = require('../data/items');
    expect(itemsReference).toBe(items);
  });

  // Test array methods work correctly
  test('should support array methods', () => {
    const foundItem = items.find(item => item.id === 1);
    expect(foundItem).toEqual({ id: 1, name: "Kalem" });

    const itemNames = items.map(item => item.name);
    expect(itemNames).toEqual(["Kalem", "Defter"]);

    const hasKalem = items.some(item => item.name === "Kalem");
    expect(hasKalem).toBe(true);
  });
});