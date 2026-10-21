export const DEFAULT_SKIN = "minimal";

// فقط شش کارت واقعی؛ آنارشیست کارت دست بازیکن نیست
export const CARD_ROLES = ["duke", "captain", "ambassador", "princess", "assassin", "contessa"];

// هر اسکین = اسم پوشه. roles = نقش‌هایی که فایلشون توی اون پوشه هست
// price فعلاً ۰ است؛ برای فروش بعدی (راهنما پایین)
export const SKINS: Record<string, { title: string; roles: string[]; price: number }> = {
  minimal: { title: "کلاسیک", roles: CARD_ROLES, price: 0 },
  hero: { title: "قهرمانان", roles: ["assassin"], price: 0 },
};

export type SkinSelection = Record<string, string>; // نقش ← اسم پوشه

const BASE = "/assets/images/cards";

export const skinImagePath = (folder: string, role: string) => `${BASE}/${folder}/${role}.webp`;

export function skinFolderFor(role: string, sel?: SkinSelection): string {
  const wanted = sel?.[role];
  return wanted && SKINS[wanted]?.roles.includes(role) ? wanted : DEFAULT_SKIN;
}

export const cardImagePath = (role: string, sel?: SkinSelection) =>
  skinImagePath(skinFolderFor(role, sel), role);

// مسیر تصاویری که یه انتخاب لازم داره (برای پیش‌دانلود اسکین بقیه‌ی بازیکن‌ها)
export const selectedImagePaths = (sel?: SkinSelection) =>
  Object.keys(sel ?? {}).map((role) => cardImagePath(role, sel));

export const ALL_SKIN_IMAGES = Object.entries(SKINS).flatMap(([folder, s]) =>
  s.roles.map((r) => skinImagePath(folder, r))
);

// این سه مسیر رو با فایل‌های واقعی‌تون هماهنگ کنید؛ اسم دقیق فایل‌هاتون رو ندیدم
export const CARD_BACK_PATH = `${BASE}/minimal/card-back.webp`;
export const COIN_PATH = `${BASE}/coin.webp`;
export const ANARCHIST_IMAGE = `${BASE}/minimal/anarchist.webp`;