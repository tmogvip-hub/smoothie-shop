export const MENU_ITEMS = [
  {
    id: 'sm-1',
    name: 'สตรอว์เบอร์รีโยเกิร์ต',
    category: 'yogurt',
    price: 65,
    tag: 'ยอดนิยม 🔥',
    desc: 'สตรอว์เบอร์รีสดปั่นผสมโยเกิร์ตแท้ เปรี้ยวอมหวานละมุนลิ้น',
    color: '#ff6b81'
  },
  {
    id: 'sm-2',
    name: 'มะม่วงเสาวรสปั่น',
    category: 'fresh',
    price: 60,
    tag: 'สดชื่นสุดๆ 🥭',
    desc: 'มะม่วงน้ำดอกไม้สุกหอมหวาน ผสานความเปรี้ยวจากเสาวรสแท้',
    color: '#ffa502'
  },
  {
    id: 'sm-3',
    name: 'อโวคาโดนมสดปั่น',
    category: 'special',
    price: 75,
    tag: 'สายสุขภาพ 🥑',
    desc: 'เนื้ออโวคาโดเข้มข้น หอมมันนัว ผสมนมสดแท้ฮอกไกโด',
    color: '#2ed573'
  },
  {
    id: 'sm-4',
    name: 'มิกซ์เบอร์รีดีท็อกซ์',
    category: 'fresh',
    price: 70,
    tag: 'วิตามินสูง 🫐',
    desc: 'รวมผลเบอร์รี 4 ชนิด สตรอว์เบอร์รี บลูเบอร์รี ราสป์เบอร์รี แบล็กเบอร์รี',
    color: '#a55eea'
  },
  {
    id: 'sm-5',
    name: 'กล้วยหอมช็อกโกแลตฟิต',
    category: 'special',
    price: 75,
    tag: 'เพิ่มพลังงาน 🍌',
    desc: 'กล้วยหอมทองเกรดเอ ผงโกโก้เข้มข้น และนมอัลมอนด์',
    color: '#8854d0'
  },
  {
    id: 'sm-6',
    name: 'แตงโมปั่นเกล็ดหิมะ',
    category: 'fresh',
    price: 50,
    tag: 'คลายร้อน 🍉',
    desc: 'แตงโมคัดเกรดหวานฉ่ำ ปั่นเนื้อเนียน ดับร้อนได้ทันที',
    color: '#ff4757'
  }
];

export const TOPPINGS = [
  { id: 'pearl', name: 'บุกคอลลาเจนหนึบ', price: 10 },
  { id: 'chia', name: 'เมล็ดเจียออร์แกนิก', price: 10 },
  { id: 'aloe', name: 'เยลลี่ว่านหางจระเข้', price: 15 },
  { id: 'granola', name: 'กราโนล่ากรุบกรอบ', price: 15 }
];

export const SWEETNESS_LEVELS = [
  { id: '100', label: '100% (หวานปกติ)' },
  { id: '50', label: '50% (หวานน้อย)' },
  { id: '25', label: '25% (หวานเบาๆ)' },
  { id: '0', label: '0% (ไม่เติมหวาน)' }
];

export function calculateItemPrice(basePrice, toppings = []) {
  const toppingCost = (toppings || []).reduce((acc, t) => acc + (Number(t.price) || 0), 0);
  return Number(basePrice) + toppingCost;
}

export function calculateCartTotal(cartItems = []) {
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (Number(item.totalPriceEach) * Number(item.quantity));
  }, 0);
  const totalQuantity = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);

  return {
    subtotal,
    itemCount: totalQuantity,
    total: subtotal
  };
}
