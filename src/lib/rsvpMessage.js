export function buildRsvpMessage({ title, date, name, attend, count, note, absentValue }) {
  const lines = [title, date, `Tên: ${name}`, `Tham dự: ${attend}`];
  if (attend !== absentValue) {
    const people = Math.min(10, Math.max(1, Number.parseInt(count, 10) || 1));
    lines.push(`Số người: ${people}`);
  }
  if (note) lines.push(`Lời nhắn: ${note}`);
  return lines.join("\n");
}
