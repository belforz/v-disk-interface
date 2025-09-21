const GUEST_KEY = "vdi_guest_cart";

export type GuestItem = { vinylId: string; qty: number };

export function readGuestCart(): GuestItem[] {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as GuestItem[];
  } catch (e) {
    return [];
  }
}

export function writeGuestCart(items: GuestItem[]) {
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(items));
  } catch (e) {
    // ignore
  }
}

export function clearGuestCart() {
  try {
    localStorage.removeItem(GUEST_KEY);
  } catch (e) {
    // ignore
  }
}

export function addToGuestCart(vinylId: string, qty = 1) {
  const items = readGuestCart();
  const idx = items.findIndex((i) => i.vinylId === vinylId);
  if (idx >= 0) {
    items[idx].qty = Math.max(1, items[idx].qty + qty);
  } else {
    items.push({ vinylId, qty });
  }
  writeGuestCart(items);
  return items;
}
