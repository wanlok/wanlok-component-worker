import { GameEntry, GamePrice } from "../Types";

const TWO_YEARS_IN_MS = 2 * 365.25 * 24 * 60 * 60 * 1000;

const lower = (a: GamePrice | undefined, b: GamePrice): GamePrice => (!a || b.price <= a.price ? b : a);

const higher = (a: GamePrice | undefined, b: GamePrice): GamePrice => (!a || b.price >= a.price ? b : a);

export const recordPrice = (entry: GameEntry, datetime: string, price: number): GameEntry => {
  const date = datetime.slice(0, 10);
  const prices = [...entry.prices];
  const last = prices[prices.length - 1];
  if (last?.datetime.slice(0, 10) === date) {
    prices.pop();
  }
  const point = { datetime, price };
  prices.push(point);

  const cutoff = new Date(datetime).getTime() - TWO_YEARS_IN_MS;
  const trimmedPrices = prices.filter((p) => new Date(p.datetime).getTime() >= cutoff);

  const lowest = lower(entry.lowest ?? entry.prices.reduce<GamePrice | undefined>(lower, undefined), point);
  const highest = higher(entry.highest ?? entry.prices.reduce<GamePrice | undefined>(higher, undefined), point);

  return { ...entry, prices: trimmedPrices, lowest, highest };
};
