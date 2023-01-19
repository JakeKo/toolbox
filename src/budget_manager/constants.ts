const EXPENSE_CATEGORIES_MAP: Record<string, string> = {
  DINING: "Dining",
  HOUSING_UTILITIES: "Housing & Utilities",
};
const EXPENSE_CATEGORY_LABELS = Object.values(EXPENSE_CATEGORIES_MAP);
const EXPENSE_CATEGORY_DROPDOWN_VALUES = Object.entries(
  EXPENSE_CATEGORIES_MAP
).map(([key, value]) => ({ value: key, label: value }));

export {
  EXPENSE_CATEGORIES_MAP,
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_CATEGORY_DROPDOWN_VALUES,
};
