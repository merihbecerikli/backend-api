const items = require('../data/items');

describe('items module', () => {
  // Test: Verify items array is properly exported
  test('should export items array', () => {
    expect(items).toBeDefined();
    expect(Array.isArray(items)).toBe(true);
  });

  // Test: Verify initial items data structure
  test('should contain initial items with correct structure', () => {
    expect(items).toHaveLength(2);
    
    items.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(typeof item.id).toBe('number');
      expect(typeof item.name).toBe('string');
    });
  });

  // Test: Verify specific initial items content
  test('should contain expected initial items', () => {
    expect(items[0]).toEqual({ id: 1, name: "Kalem" });
    expect(items[1]).toEqual({ id: 2, name: "Defter" });
  });

  // Test: Verify items array is mutable
  test('should allow adding new items', () => {
    const initialLength = items.length;
    items.push({ id: 3, name: "Silgi" });
    
    expect(items).toHaveLength(initialLength + 1);
    expect(items[2]).toEqual({ id: 3, name: "Silgi" });
    
    // Cleanup
    items.pop();
  });

  // Test: Verify items array allows modification
  test('should allow modifying existing items', () => {
    const originalItem = { ...items[0] };
    items[0].name = "Kurşun Kalem";
    
    expect(items[0].name).toBe("Kurşun Kalem");
    
    // Cleanup
    items[0] = originalItem;
  });

  // Test: Verify items array allows removal
  test('should allow removing items', () => {
    const originalLength = items.length;
    const removedItem = items.pop();
    
    expect(items).toHaveLength(originalLength - 1);
    expect(removedItem).toEqual({ id: 2, name: "Defter" });
    
    // Cleanup
    items.push(removedItem);
  });

  // Test: Verify items array reference consistency
  test('should maintain reference consistency across imports', () => {
    const itemsSecondImport = require('../data/items');
    expect(items).toBe(itemsSecondImport);
  });

  // Test: Edge case - empty array behavior
  test('should handle empty array state', () => {
    const originalItems = [...items];
    items.length = 0;
    
    expect(items).toHaveLength(0);
    expect(Array.isArray(items)).toBe(true);
    
    // Cleanup
    items.push(...originalItems);
  });
});