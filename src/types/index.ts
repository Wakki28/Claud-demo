export type User = {
  id: string;
  name: string;
  employeeNumber: string;
};

export type Line = {
  id: string;
  name: string;
};

export type ProductionRecord = {
  id: string;
  date: string;
  lineId: string;
  lineName: string;
  workerId: string;
  workerName: string;
  productName: string;
  plannedCount: number;
  actualCount: number;
  workHours: number;
  createdAt: string;
};

// 権限ロール
export type Role = 'admin' | 'general';

// ログインユーザー
export type AuthUser = {
  id: string;
  name: string;
  employeeNumber: string;
  role: Role;
  department: string;
};

// 作業者マスタ
export type WorkerMaster = {
  id: string;
  name: string;
  employeeNumber: string;
  department: string;
  isActive: boolean;
};

// ラインマスタ
export type LineMaster = {
  id: string;
  name: string;
  capacity: number;
  isActive: boolean;
};

// 受発注変換フォーマット設定
export type ColumnMapping = {
  orderNumber: string;
  productCode: string;
  quantity: string;
  deliveryDate: string;
  clientCode: string;
};

// 取引先マスタ
export type ClientMaster = {
  id: string;
  name: string;
  formatType: string;
  columnMapping: ColumnMapping;
  isActive: boolean;
};
