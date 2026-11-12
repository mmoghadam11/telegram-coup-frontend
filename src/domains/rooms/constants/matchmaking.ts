export const MIN_PLAYERS_TO_START = 2;
export const MAX_PLAYERS_PER_ROOM = 7;

// باید با readyQuorum بک‌اند (roomRules.ts) یکی باشد
export const readyQuorum = (present: number) => Math.max(MIN_PLAYERS_TO_START, Math.floor(present / 2) + 1);