export function getBusinessRange(date: string) {
  // date format: YYYY-MM-DD

  const start = new Date(
    `${date}T16:00:00+07:00`
  );

  const end = new Date(
    `${date}T23:59:59+07:00`
  );

  // tambah sampai besok jam 01:30
  end.setDate(end.getDate() + 1);
  end.setHours(1, 30, 59, 999);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}