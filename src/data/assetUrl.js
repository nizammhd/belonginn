export function assetUrl(source) {
  if (typeof source !== 'string' || !source.trim()) return '';
  const path = source.trim();
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|\/)/i.test(path)) return path;
  return `/${path.replace(/^(?:\.\/)+/, '')}`;
}
