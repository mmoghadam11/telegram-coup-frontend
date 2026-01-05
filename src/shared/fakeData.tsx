import { PayCheckDataType } from "types/paycheck";

export const createRandomPaycheks = (num: number) => {
    let array: PayCheckDataType[] = [];
    for (let i = 0; i < num; i++) {
      array.push({
        id: i,
        date: Date.now().toString(),
        pureSalary: Math.random() * 10_000_000,
        overallSalary: Math.random() * 10_000_000,
      });
    }
    return array;
  };
