import moment from "jalali-moment";

export default function jalaliMonthDiff(startDate:any, endDate:any):number {
    // 1. تبدیل به آبجکت moment و صفر کردن ساعت/دقیقه/ثانیه
    // این کار باعث می‌شود اختلاف‌های میلی‌ثانیه‌ای حذف شوند
    const a = moment(startDate).startOf('day');
    const b = moment(endDate).startOf('day');

    // اگر تاریخ شروع بعد از پایان است، جایشان را عوض کن (یا ارور بده)
    // اگر اختلاف منفی می‌خواهید، این بلوک را حذف کنید
    if (a.isAfter(b)) {
        return -jalaliMonthDiff(b, a);
    }

    // 2. محاسبه اختلاف اولیه بر اساس سال و ماه
    let months = (b.jYear() - a.jYear()) * 12 + (b.jMonth() - a.jMonth());

    // 3. بررسی روز: اگر روزِ تاریخِ مقصد کمتر از روزِ تاریخِ مبدا باشد،
    // یعنی هنوز ماهِ آخر کامل نشده است، پس یک ماه کم می‌کنیم.
    if (b.jDate() < a.jDate()) {
        months--;
    }

    return months;
}