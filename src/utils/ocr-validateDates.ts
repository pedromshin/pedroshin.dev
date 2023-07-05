export const validateDates = (
  result: any,
  date1Alias: any,
  date2Alias: any
) => {
  // TODO improve this validation
  const date1Index = result.findIndex((item: any) => item.field === date1Alias);
  const date2Index = result.findIndex((item: any) => item.field === date2Alias);
  const date1 = result[date1Index]?.value;
  const date2 = result[date2Index]?.value;

  if (date1 && date2) {
    if (date1 === date2) {
      result[date1Index] = {
        field: date1Alias,
        error: "ERROR_INVALID_VALUE",
      };
      result[date2Index] = {
        field: date2Alias,
        error: "ERROR_INVALID_VALUE",
      };
    }
  }

  return result;
};
