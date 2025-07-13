// src/types.ts 
export interface User {
  id: string;
  ID?: string;
  _id?: string;
  NICKNAME: string;
  REGISTRATION : string;
  PURCHASES: Purchase[];
  CURRENCIES: Currency[];
  purchasesCount?: number; // Добавляем вычисляемое поле
}

interface Purchase {
  id: string;
  item: string;
  amount: number;
  date: string;
}

interface Currency {
  TYPE: string;
  COUNT: number;
}

export interface Transaction {
  user_id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  created_at: string;
  status: 'completed' | 'pending' | 'failed';
}