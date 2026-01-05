export function generateRandomColor() {
  let maxVal = 0xffffff; // 16777215
  let randomNumber = Math.random() * maxVal;
  randomNumber = Math.floor(randomNumber);
  let result = randomNumber.toString(16);
  return `#${result.padStart(6, "0").toUpperCase()}`;
}
