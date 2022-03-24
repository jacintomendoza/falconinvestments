export interface Certificate {
  id: number;
  name?: string;
  initialAmount: number;
  interestRate: number;
  startDate: Date;
  maturityDate: Date;
  userId: number;
}
