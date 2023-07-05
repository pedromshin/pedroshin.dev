export const detectCommonErrors = (resultValue?: string) => {
  if (resultValue) {
    const commonErrors = ["NATURALIDACE", "NATURALIDADE"];
    if (commonErrors.includes(resultValue)) {
      resultValue = "";
    }
  }

  return resultValue;
};
