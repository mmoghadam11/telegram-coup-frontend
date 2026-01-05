export function getNowDate(): { today: IDate; date: Date } {
  let date = new Date();
  let tempDate = date.toLocaleDateString("fa-IR-u-nu-latn").split("/");
  let today = {
    day: parseInt(tempDate[2]),
    month: parseInt(tempDate[1]),
    year: parseInt(tempDate[0]),
  };
  return { date, today };
}

interface IDate {
  day: number;
  month: number;
  year: number;
}
