export type PayCheckDataType = {
  id: number,
  date: string | Date,
  pureSalary: string | number,
  overallSalary: string | number
}

export type PayCheckPreviewProps = {
  pageSize: number;
  personnelNumber: string | null;
}

export interface PayCheckDataInterface {
  id: number;
  date: string | Date;
  pureSalary: string | number;
  overallSalary: string | number;
  personnelNumber: string;
}