import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MENU_ITEMS,
  TOPPINGS,
  SWEETNESS_LEVELS,
  calculateItemPrice,
  calculateCartTotal
} from '../src/shopLogic.js';

test('MENU_ITEMS has required properties and valid prices', () => {
  assert.ok(MENU_ITEMS.length >= 6, 'Menu should contain at least 6 smoothie items');
  for (const item of MENU_ITEMS) {
    assert.ok(item.id, 'Item must have an id');
    assert.ok(item.name, 'Item must have a name');
    assert.ok(item.category, 'Item must have a category');
    assert.ok(typeof item.price === 'number' && item.price > 0, 'Price must be positive');
  }
});

test('TOPPINGS has valid structure', () => {
  assert.ok(TOPPINGS.length >= 4, 'Should offer multiple topping choices');
  for (const topping of TOPPINGS) {
    assert.ok(topping.id);
    assert.ok(topping.name);
    assert.ok(topping.price >= 0);
  }
});

test('SWEETNESS_LEVELS covers 0% to 100%', () => {
  const ids = SWEETNESS_LEVELS.map(s => s.id);
  assert.ok(ids.includes('0'));
  assert.ok(ids.includes('25'));
  assert.ok(ids.includes('50'));
  assert.ok(ids.includes('100'));
});

test('calculateItemPrice correctly computes base + toppings', () => {
  const base = 65;
  const toppings = [
    { id: 'pearl', price: 10 },
    { id: 'aloe', price: 15 }
  ];
  assert.strictEqual(calculateItemPrice(base, toppings), 90);
  assert.strictEqual(calculateItemPrice(base, []), 65);
});

test('calculateCartTotal sums up items accurately', () => {
  const cart = [
    { totalPriceEach: 90, quantity: 2 },
    { totalPriceEach: 60, quantity: 1 }
  ];
  const summary = calculateCartTotal(cart);
  assert.strictEqual(summary.subtotal, 240);
  assert.strictEqual(summary.itemCount, 3);
  assert.strictEqual(summary.total, 240);
});

test('calculateCartTotal handles empty cart', () => {
  const summary = calculateCartTotal([]);
  assert.strictEqual(summary.subtotal, 0);
  assert.strictEqual(summary.itemCount, 0);
  assert.strictEqual(summary.total, 0);
});
