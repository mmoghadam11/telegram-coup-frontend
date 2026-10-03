export const ACTION_CARD_DATA: Record<string, { image: string; title: string; description: string; cost: number }> = {
  income: { image: "/assets/images/cards/minimal/income.png", title: "درآمد", description: "یک سکه از بانک", cost: 0 },
  foreign_aid: { image: "/assets/images/cards/minimal/aid.png", title: "کمک خارجی", description: "دو سکه از بانک(قابل بلاک)", cost: 0 },
  coup: { image: "/assets/images/cards/minimal/coup.png", title: "کودتا", description: "کودتا با ۷ سکه", cost: 7 },
  coup1: { image: "/assets/images/cards/minimal/coup1.png", title: "کودتا", description: "کودتا با ۷ سکه", cost: 7 },
  tax: { image: "/assets/images/cards/minimal/duke.png", title: "مالیات (بزرگ‌زاده)", description: "3 سکه از بانک بردار", cost: 0 },
  assassinate: { image: "/assets/images/cards/minimal/assassin.png", title: "ترور (قاتل)", description: "قتل با ۳ سکه", cost: 3 },
  steal: { image: "/assets/images/cards/minimal/captain.png", title: "باجگیری (فرمانده)", description: "باجگیری ۲سکه", cost: 0 },
  exchange: { image: "/assets/images/cards/minimal/ambassador.png", title: "تعویض (سفیر)", description: "سفارت کارت‌ها", cost: 0 },
  contessa_self: { image: "/assets/images/cards/minimal/contessa.png", title: "تعویض خودم (بازرس)", description: "تعویض کارت خودم", cost: 0 },
  contessa_other: { image: "/assets/images/cards/minimal/contessa.png", title: "اجبار به تعویض (بازرس)", description: "تعویض کارت حریف", cost: 0 },
  anarchist_attack: { image: "/assets/images/cards/minimal/anarchist.png", title: "آنارشیست", description: "حمله با 5 سکه", cost: 5 },
};