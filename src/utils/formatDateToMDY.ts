 type DateOverride = { year: number; month: number; day: number } | null;

 export function formatDateToMDY(
    dateInput: string | number | Date,
    override: DateOverride = null
  ) {
    const original = new Date(dateInput);

    const finalDate = override
      ? new Date(
          Date.UTC(
            override.year,
            override.month - 1,
            override.day,
            original.getUTCHours(),
            original.getUTCMinutes(),
            original.getUTCSeconds()
          )
        )
      : original;

    const month = finalDate.getUTCMonth() + 1;
    const day = finalDate.getUTCDate();
    const year = String(finalDate.getUTCFullYear()).slice(-2);

    return `${month}/${day}/${year}`;
  }