export interface Etf {
    id: number;
    ticker: string;
    name: string;
    asset: string
    price: number,
    portfolio: string,
    expenseRatio: number,
    inceptionDate: string,
    userId?: number
}