// // src/components/render/formInputs/RenderFormDisplay.tsx

// import React from "react";
// import { Box, Typography } from "@mui/material";
// import { Check, Close } from "@mui/icons-material";
// import { FormItem } from "types/formItem"; // مسیر تایپ خود را وارد کنید

// interface RenderFormDisplayProps {
//   item: FormItem;
//   value: any;
// }

// // تابع کمکی برای فرمت کردن مقادیر برای نمایش
// const getFormattedValue = (item: FormItem, value: any): React.ReactNode => {
//   if (value === null || value === undefined || value === "") {
//     return "---"; // نمایش برای مقادیر خالی
//   }

//   switch (item.inputType) {
//     case "autocomplete":
//       // اگر مقدار یک آبجکت است (storeValueAs="object")
//       if (typeof value === "object" && value?.title) {
//         return value.title;
//       }
//       // اگر مقدار فقط id است (storeValueAs="id")
//       if ((typeof value === "number" || typeof value === "string") && item.options) {
//         const selectedOption = item.options.find(opt => opt.value === value);
//         return selectedOption?.title || "---";
//       }
//       return "---";

//     case "select":
//        // منطق select مشابه autocomplete با storeValueAs="id" است
//        if ((typeof value === "number" || typeof value === "string") && item.options) {
//         // برای مقادیر boolean که به صورت استرینگ ذخیره شده‌اند
//         if (value === "false") return "خیر";
//         if (value === "true") return "بله";
        
//         const selectedOption = item.options.find(opt => opt.value === value);
//         return selectedOption?.title || "---";
//       }
//       return "---";

//     case "checkbox":
//       // برای checkbox آیکون نمایش می‌دهیم
//       const boolValue = value === "false" ? false : Boolean(value);
//       return boolValue ? <Check color="success" /> : <Close color="error" />;

//     case "date":
//       try {
//         // با استفاده از toLocaleDateString برای نمایش تاریخ شمسی
//         return new Date(value).toLocaleDateString("fa-IR", {
//           year: 'numeric',
//           month: '2-digit',
//           day: '2-digit'
//         });
//       } catch (error) {
//         return String(value); // اگر فرمت تاریخ نامعتبر بود
//       }
      
//     case "password":
//         return "********"; // هرگز پسورد را نمایش ندهید

//     default:
//       // برای بقیه موارد مثل text, number و ...
//       return String(value);
//   }
// };

// const RenderFormDisplay: React.FC<RenderFormDisplayProps> = ({ item, value }) => {
//   // برای آیتم‌هایی که نباید نمایش داده شوند (مثل جداکننده‌ها)
//   if (item.inputType === "titleDivider") {
//     return null; 
//   }

//   const displayValue = getFormattedValue(item, value);

//   return (
//     <Box sx={{ py: 1, width: '100%' ,display:"flex",gap:1}}>
//       <Typography
//         variant="body2"
//         color="text.secondary"
//         component="div"
//         gutterBottom
//       >
//         {item.label+" :"}
//       </Typography>
//       <Typography 
//         variant="body1" 
//         component="div" 
//         gutterBottom
//         sx={{ 
//           fontWeight: 500,
//           display: 'flex',
//           alignItems: 'center',
//           minHeight: '24px' // برای هماهنگی ارتفاع با آیکون‌ها
//         }}
//       >
//         {displayValue}
//       </Typography>
//     </Box>
//   );
// };


import React from "react";
import { Box, Chip, Skeleton, Stack, Typography } from "@mui/material";
import moment from "jalali-moment";
import type { FormItem } from "types/formItem";
import type { TOption } from "types/render";
import { CheckCircle, Close } from "@mui/icons-material";

type Option = TOption & { value: any; title: string };

const isEmpty = (val: any) =>
  val === undefined ||
  val === null ||
  (typeof val === "string" && val.trim() === "") ||
  (Array.isArray(val) && val.length === 0);

const asBool = (val: any) =>
  val === true || val === "true" || val === 1 || val === "1";

/**
 * تاریخ رو به فرمت شمسی خوانا تبدیل می‌کنه
 * تلاش می‌کنه حالت‌های مختلف (ISO, Gregorian, Jalali) رو بشناسه
 */
function formatFaDate(value?: any, fallback?: string): string {
  if (!value) return fallback ?? "—";
  // اگر عدد میلی‌ثانیه باشد
  if (typeof value === "number") {
    const m = moment(value);
    return m.isValid() ? m.locale("fa").format("jYYYY/jMM/jDD") : fallback ?? "—";
  }
  // اگر Date باشد
  if (value instanceof Date) {
    const m = moment(value);
    return m.isValid() ? m.locale("fa").format("jYYYY/jMM/jDD") : fallback ?? "—";
  }

  // اگر رشته باشد
  const str = String(value);
  const tryFormats = [
    "YYYY-MM-DD",
    "YYYY/MM/DD",
    "YYYY-M-D",
    "YYYY/M/D",
    "jYYYY/jMM/jDD",
    "jYYYY/jM/jD",
    moment.ISO_8601,
  ];

  for (const f of tryFormats) {
    const m = f === moment.ISO_8601 ? moment(str) : moment(str, f, true);
    if (m.isValid()) {
      return m.locale("fa").format("jYYYY/jMM/jDD");
    }
  }

  // اگر هیچ‌کدام معتبر نبود، همان مقدار را برگردان
  return str || fallback || "—";
}

/**
 * از روی options و مقدار (id یا object)، عنوان قابل‌نمایش را برمی‌گرداند
 */
function resolveOptionTitle(opts: Option[] = [], value: any, storeValueAs?: "object" | "id"): string {
  if (isEmpty(value)) return "";

  // آرایه‌ای (multiple)
  if (Array.isArray(value)) {
    const titles = value.map((v) => resolveOptionTitle(opts, v, storeValueAs)).filter(Boolean);
    return titles.join("، ");
  }

  if (storeValueAs === "id" || typeof value !== "object") {
    const found = opts.find((o) => o.value == value);
    return found?.title ?? String(value);
  }

  // object
  if ("title" in (value || {})) return value.title ?? "";
  if ("name" in (value || {})) return (value as any).name ?? "";
  if ("value" in (value || {})) {
    const found = opts.find((o) => o.value == value.value);
    return found?.title ?? String(value.value ?? "");
  }
  if ("id" in (value || {})) { // <-- اضافه شده
    const found = opts.find((o) => o.value == (value as any).id);
    return found?.title ?? String((value as any).id ?? "");
  }
  return String(value);
}

/**
 * اگر multiple باشد، چیپ لیست نمایش می‌دهد
 */
function renderValueOrChips(val: any, renderLabel: (v: any) => string) {
  if (Array.isArray(val)) {
    const items = val
      .map((v) => renderLabel(v))
      .filter((t) => t && t.trim() !== "");
    if (items.length === 0) return "—";
    return (
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {items.map((t, idx) => (
          <Chip key={`${t}-${idx}`} size="small" label={t} />
        ))}
      </Stack>
    );
  }
  const text = renderLabel(val);
  return text && text.trim() !== "" ? text : "—";
}

export default function RenderFormDisplay({
  item,
  value,
  renderEmptyAs = "—",
}: {
  item: FormItem;
  value: any;
  renderEmptyAs?: React.ReactNode;
}): JSX.Element {
  const {
    inputType,
    label,
    options,
    storeValueAs = "object",
    elementProps,
  } = item as any;

  // وضعیت لودینگ/ارور اختیاری؛ اگر در FormItem گذاشتید، می‌تونید اینجا هندل کنید
  // اگر دوست دارید Skeleton نمایش داده بشه:
  if ((item as any)?.status === "loading") {
    return (
      <Box sx={{ minHeight: 56 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Skeleton variant="rounded" height={32} sx={{ mt: 1 }} />
      </Box>
    );
  }

  // اگر لازم بود ارور آپشن‌ها را نمایش دهید:
  if ((item as any)?.status === "error") {
    return (
      <Box
        sx={{
          border: "1px solid",
          borderColor: "error.light",
          p: 1.25,
          borderRadius: 1,
          minHeight: 56,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2" color="error" sx={{ mt: 0.75 }}>
          خطا در بارگیری اطلاعات
        </Typography>
      </Box>
    );
  }

  let display: React.ReactNode = renderEmptyAs;

  switch (inputType) {
    case "autocomplete":
    case "select": {
      const titles = (v: any) => resolveOptionTitle(options, v, storeValueAs);
      display = renderValueOrChips(value, titles);
      break;
    }

    case "checkbox": {
      const val = asBool(value);
      display = (
        <Chip size="small" color={val ? "success" : "default"} label={val ? "بله" : "خیر"} icon={val?<CheckCircle/>:<Close/>} />
      );
      break;
    }

    case "date": {
      display = formatFaDate(value, String(renderEmptyAs ?? "—"));
      break;
    }

    case "password": {
      display = value ? "••••••••" : renderEmptyAs;
      break;
    }

    case "titleDivider": {
      // اگر در حالت نمایش هم می‌خواهید divider نشان دهید
      return (
        <Box width="100%">
          <Typography variant="subtitle2">{label}</Typography>
        </Box>
      );
    }

    default: {
      // text, number, email, textarea, ...
      if (!isEmpty(value)) {
        display = (
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {String(value)}
          </Typography>
        );
      }
    }
  }

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        p: 1.25,
        borderRadius: 1,
        minHeight: 46,
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Box sx={{ mt: 0.35 , ml:1}}>{display}</Box>
    </Box> 
    // <Box
    //   sx={{
    //     border: "1px solid",
    //     borderColor: "divider",
    //     p: 1.25,
    //     borderRadius: 1,
    //     minHeight: 56,
    //   }}
    // >
    //   <Typography variant="caption" color="text.secondary">
    //     {label}
    //   </Typography>
    //   <Box sx={{ mt: 0.75 , ml:1}}>{display}</Box>
    // </Box>
  );
}
// export default RenderFormDisplay;