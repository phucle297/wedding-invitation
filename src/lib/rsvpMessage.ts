interface RsvpMessageOptions {
  title: string;
  date: string;
  name: string;
  attend: string;
  count: number | string;
  note: string;
  absentValue: string;
}

export function buildRsvpMessage({ title, date, name, attend, count, note, absentValue }: RsvpMessageOptions) {
  const lines = [title, date, `Tên: ${name}`, `Tham dự: ${attend}`];
  if (attend !== absentValue) {
    const people = Math.min(10, Math.max(1, Number.parseInt(String(count), 10) || 1));
    lines.push(`Số người: ${people}`);
  }
  if (note) lines.push(`Lời nhắn: ${note}`);
  return lines.join("\n");
}
