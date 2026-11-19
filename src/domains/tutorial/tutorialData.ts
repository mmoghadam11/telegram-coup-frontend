export const toFa = (n: number) => n.toLocaleString("fa-IR");

export type Cat = "money" | "swap" | "kill";

export interface RoleInfo {
  role: string; name: string; count: number; cat: Cat;
  does: string[];       // کارهایی که این کارت ادعا می‌کند
  blocks?: string;      // چه چیزی را بلاک می‌کند
}

export const ROLE_INFO: RoleInfo[] = [
  { role: "duke", name: "بزرگ‌زاده", count: 2, cat: "money", does: ["مالیات: ۳ سکه از بانک می‌گیرد"], blocks: "کمک خارجی را بلاک می‌کند" },
  { role: "captain", name: "فرمانده", count: 2, cat: "money", does: ["باج‌گیری: ۲ سکه از یک بازیکن زورگیری می‌کند"], blocks: "باج‌گیری را بلاک می‌کند" },
  { role: "princess", name: "شاهدخت", count: 2, cat: "kill", does: [], blocks: "ترور و آنارشیست را بلاک می‌کند" },
  { role: "ambassador", name: "سفیر", count: 2, cat: "swap", does: ["تعویض: ۲ کارت از دسته می‌کشد، هر کدام را خواست نگه می‌دارد و بقیه را زیر دسته برمی‌گرداند"], blocks: "دزدی را بلاک می‌کند" },
  { role: "assassin", name: "قاتل", count: 2, cat: "kill", does: ["ترور: ۳ سکه می‌دهی و یک کارت از هدف حذف می‌شود"] },
  { role: "contessa", name: "بازرس", count: 5, cat: "swap", does: ["تعویض کارت خودم: یکی از کارت‌هایت را زیر دسته کارت‌ها گذاشته و کارت رویی دسته را برمیداری ", "اجبار به تعویض: بازیکن هدف باید یکی از کارت‌هایش را با دسته عوض کند"] },
];

export const CATS: Record<Cat, { title: string; icon: string; color: string; roles: string[] }> = {
  money: { title: "جمع‌آوری سکه", icon: "💰", color: "#e0a52f", roles: ["duke", "captain"] },
  swap: { title: "تعویض کارت", icon: "🔄", color: "#42a5f5", roles: ["ambassador", "contessa"] },
  kill: { title: "قتل و دفاع", icon: "🗡️", color: "#e53935", roles: ["assassin", "princess"] },
};

// ---------- بازیکن‌های نمایشی و سناریوی میز ----------
export type DemoId = "a" | "s" | "r";
export const DEMO_PLAYERS: { id: DemoId; name: string; color: string }[] = [
  { id: "a", name: "شما", color: "#42a5f5" },
  { id: "s", name: "سارا", color: "#ab47bc" },
  { id: "r", name: "رضا", color: "#66bb6a" },
];

export interface UiOpt { id: string; label: string; color: "primary" | "warning" | "secondary" }

// ابزاری که بیرون میز نشان داده می‌شود و خودکار انتخاب می‌شود
export type DemoUi =
  | { kind: "act"; action: string; coins: number; label: string }   // coins: سکه‌ی قبل از انتخاب
  | { kind: "respond"; question: string; options: UiOpt[]; pick: string }
  | { kind: "prove"; question: string; pick: string };               // pick: نقش کارتِ نشان‌داده‌شده

export interface DemoLine { who: DemoId; text: string; at: number }   // at: میلی‌ثانیه از شروع مرحله

export interface DemoStep {
  turn: DemoId;
  coins: [number, number, number];
  hidden: [number, number, number];
  revealed: [string[], string[], string[]];
  mine: string[];                       // کارت‌های پنهانِ «شما»
  ui?: DemoUi;
  pickAt?: number;                      // لحظه‌ی انتخاب خودکار (میلی‌ثانیه)
  lines?: DemoLine[];
  pop?: { role: string; ok: boolean; claimed?: string };
  note: string;
  winner?: DemoId;
}

const E: [string[], string[], string[]] = [[], [], []];
const ALLOW: UiOpt = { id: "allow", label: "قبول", color: "primary" };

export const DEMO: DemoStep[] = [
  { turn: "a", coins: [3, 2, 2], hidden: [2, 2, 2], revealed: E, mine: ["assassin", "duke"],
    ui: { kind: "act", action: "income", coins: 2, label: "درآمد" }, pickAt: 1500,
    lines: [{ who: "a", text: "درآمد می‌گیرم: ۱ سکه", at: 2000 }],
    note: "نوبت شماست. این ابزارهای بازی واقعی‌اند؛ این بار «درآمد» خودکار انتخاب می‌شود. ادعای نقش ندارد، پس چالش‌پذیر نیست." },
  { turn: "s", coins: [3, 5, 2], hidden: [2, 2, 2], revealed: E, mine: ["assassin", "duke"],
    ui: { kind: "respond", question: "سارا ادعای بزرگ‌زاده کرد. شما چه می‌کنید؟", options: [ALLOW, { id: "ch", label: "چالش (بلوفه!)", color: "warning" }], pick: "allow" }, pickAt: 2600,
    lines: [{ who: "s", text: "من بزرگ‌زاده دارم؛ مالیات ۳ سکه!", at: 300 }],
    note: "وقتی دیگری ادعا می‌کند، شما این دکمه‌ها را می‌بینید. اینجا «قبول» انتخاب می‌شود. اگر کسی چالش نکند، ادعا پذیرفته می‌شود، حتی بلوف." },
  { turn: "r", coins: [3, 5, 4], hidden: [2, 2, 2], revealed: E, mine: ["assassin", "duke"],
    ui: { kind: "respond", question: "رضا کمک خارجی (۲ سکه) گرفت. شما چه می‌کنید؟", options: [ALLOW, { id: "bl", label: "بلاک می‌کنم", color: "secondary" }], pick: "allow" }, pickAt: 2400,
    lines: [{ who: "r", text: "کمک خارجی: ۲ سکه", at: 300 }],
    note: "کمک خارجی چالش‌پذیر نیست، فقط «بزرگ‌زاده» بلاکش می‌کند. شما بزرگ‌زاده دارید و می‌توانستید بلاک کنید؛ این بار قبول می‌کنید." },
  { turn: "a", coins: [0, 5, 4], hidden: [2, 2, 2], revealed: E, mine: ["assassin", "duke"],
    ui: { kind: "act", action: "assassinate", coins: 3, label: "ترور ← رضا" }, pickAt: 1500,
    lines: [{ who: "a", text: "من قاتل دارم؛ ترور رضا (۳ سکه)", at: 2000 }, { who: "r", text: "باور نمی‌کنم! چالش!", at: 4400 }],
    note: "با ۳ سکه، کارت «ترور» را انتخاب و هدف را مشخص می‌کنید. رضا چالش کرد؛ حالا باید کارت قاتل را نشان دهید." },
  { turn: "a", coins: [0, 5, 4], hidden: [2, 2, 1], revealed: [[], [], ["captain"]], mine: ["ambassador", "duke"],
    ui: { kind: "prove", question: "یکی از کارت‌هایت را برای اثبات نشان بده", pick: "assassin" }, pickAt: 1500,
    pop: { role: "assassin", ok: true },
    note: "قاتل واقعاً دست شماست! کارتتان با یک کارت تازه عوض شد (سفیر آمد) و رضا برای چالش اشتباه یک کارت (فرمانده) از دست داد." },
  { turn: "a", coins: [0, 5, 4], hidden: [2, 2, 0], revealed: [[], [], ["captain", "contessa"]], mine: ["ambassador", "duke"],
    note: "ترور هنوز اجرا می‌شود: رضا کارت دومش را هم از دست داد و حذف شد. چالش اشتباه روی قاتل = ۲ کارت." },
  { turn: "s", coins: [0, 0, 4], hidden: [2, 2, 0], revealed: [[], [], ["captain", "contessa"]], mine: ["ambassador", "duke"],
    ui: { kind: "respond", question: "سارا آنارشیست زد. شما چه می‌کنید؟", options: [{ id: "ok", label: "قبول (یک کارت از دست می‌دهم)", color: "primary" }, { id: "bl", label: "بلاک با شاهدخت", color: "secondary" }], pick: "bl" }, pickAt: 2700,
    lines: [{ who: "s", text: "آنارشیست! هدف: شما (۵ سکه)", at: 300 }, { who: "a", text: "من شاهدخت دارم؛ بلاک!", at: 3200 }],
    note: "آنارشیست ۵ سکه می‌خواهد و ادعای نقش ندارد. شما یا قبول می‌کنید یا با «شاهدخت» بلاک می‌کنید. شاهدخت ندارید، پس این یک بلوف است." },
  { turn: "s", coins: [0, 0, 4], hidden: [2, 2, 0], revealed: [[], [], ["captain", "contessa"]], mine: ["ambassador", "duke"],
    ui: { kind: "prove", question: "سارا چالش کرد؛ یک کارت نشان بده", pick: "duke" }, pickAt: 1800,
    lines: [{ who: "s", text: "دروغه! چالش!", at: 300 }],
    pop: { role: "duke", ok: false, claimed: "princess" },
    note: "فقط بلاک چالش‌پذیر است، نه خود آنارشیست. شما بزرگ‌زاده نشان دادید، نه شاهدخت. بلوف لو رفت و این کارت سوخت." },
  { turn: "s", coins: [0, 0, 4], hidden: [0, 2, 0], revealed: [["duke", "ambassador"], [], ["captain", "contessa"]], mine: [],
    note: "حمله هم اجرا می‌شود و کارت دوم شما (سفیر) می‌رود. شاهدخت دروغین = ۲ کارت. شما حذف شدید." },
  { turn: "s", coins: [0, 0, 4], hidden: [0, 2, 0], revealed: [["duke", "ambassador"], [], ["captain", "contessa"]], mine: [],
    winner: "s", note: "فقط سارا کارت دارد؛ او برنده است! 🏆 حالا نوبت شماست که با دوستانتان بازی کنید." },
];