export function generateRandomMobileNumber() {
  const countryCode = "+39";
  const mobileNumber =
    countryCode +
    Math.floor(Math.random() * 10000000000)
      .toString()
      .padStart(10, "0");
  return mobileNumber;
}
