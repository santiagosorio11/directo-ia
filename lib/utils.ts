export function safeParseItems(items: any): any[] {
  if (!items) return [];
  if (Array.isArray(items)) return items;
  if (typeof items === 'string') {
    try {
      const parsed = JSON.parse(items);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Error parsing items:", e);
      return [];
    }
  }
  return [];
}

export function formatItems(items: any): string {
  const parsed = safeParseItems(items);
  if (parsed.length === 0) return "Sin items";
  return parsed.map((item: any) => `${item.quantity || 1} x ${item.name}`).join(", ");
}
