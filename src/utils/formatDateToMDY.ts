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


export const parseISODate = (isoString: string): Date | null => {
        try {
            const date = new Date(isoString);
            return isNaN(date.getTime()) ? null : date;
        } catch {
            return null;
        }
    };

export const formatTimeFromISO = (isoString: string): string => {
    const date = parseISODate(isoString);
    if (!date) return isoString; // Return original if parsing fails

    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strHours = hours < 10 ? `0${hours}` : `${hours}`;
    const strMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${strHours}:${strMinutes} ${ampm}`;
    };
