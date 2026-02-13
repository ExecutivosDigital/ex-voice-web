/**
 * Helpers para cálculos responsivos baseados em conteúdo
 */

/**
 * Calcula classes de grid baseado na quantidade de itens
 */
export function getGridColsClass(itemCount: number): string {
  if (itemCount === 0) return "grid-cols-1";
  if (itemCount === 1) return "grid-cols-1";
  if (itemCount <= 4) return "grid-cols-1 md:grid-cols-2";
  if (itemCount <= 6) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
}

/**
 * Calcula max-width baseado na quantidade de itens
 */
export function getMaxWidthClass(itemCount: number, hasManyTags = false): string {
  if (itemCount === 0) return "max-w-[400px] mx-auto";
  if (itemCount === 1) return "max-w-[500px]";
  if (itemCount <= 2 && !hasManyTags) return "max-w-[450px]";
  if (itemCount >= 3 || hasManyTags) return "max-w-none";
  return "max-w-full";
}

/**
 * Verifica se um item tem muitos metadados/tags
 */
export function hasManyMetadata(item: {
  metadata?: Array<{ label: string; value: string }>;
  tags?: string[];
}): boolean {
  const metadataCount = item.metadata?.length || 0;
  const tagsCount = item.tags?.length || 0;
  return metadataCount > 2 || tagsCount > 2;
}

/**
 * Verifica se uma lista de items tem muitos metadados/tags
 */
export function hasManyTagsInList(
  items: Array<{
    metadata?: Array<{ label: string; value: string }>;
    tags?: string[];
  }>
): boolean {
  return items.some(hasManyMetadata);
}
