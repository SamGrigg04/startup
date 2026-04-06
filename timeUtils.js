export function timeToMs(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.split(':').map(Number);
  const [min, sec, mil] = parts;
  return min * 60000 + sec * 1000 + mil * 10;
}
