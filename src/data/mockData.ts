import type {
  ProductionRecord,
  Line,
  User,
  WorkerMaster,
  LineMaster,
  ClientMaster,
} from '../types';

// ライン一覧
export const lines: Line[] = [
  { id: 'L1', name: '本社-成形ライン1' },
  { id: 'L2', name: '本社-成形ライン2' },
  { id: 'L3', name: '加古川-成形ライン1' },
  { id: 'L4', name: '加古川-成形ライン2' },
];

// 作業者一覧
export const workers: User[] = [
  { id: 'EMP001', name: '田中 誠',   employeeNumber: 'EMP001' },
  { id: 'EMP002', name: '鈴木 健太', employeeNumber: 'EMP002' },
  { id: 'EMP003', name: '山本 直樹', employeeNumber: 'EMP003' },
  { id: 'EMP004', name: '中村 亮',   employeeNumber: 'EMP004' },
  { id: 'EMP005', name: '佐藤 美咲', employeeNumber: 'EMP005' },
  { id: 'EMP006', name: '伊藤 拓也', employeeNumber: 'EMP006' },
];

// 製品名一覧
export const productNames = [
  '電磁弁ユニット',
  '注湯電磁弁',
  'ガス通路制御ユニット',
  '台所リモコン筐体',
];

// 製造実績モックデータ（直近3ヶ月分 25件）
export const productionRecords: ProductionRecord[] = [
  { id: 'PR001', date: '2025-12-05', lineId: 'L1', lineName: '本社-成形ライン1',  workerId: 'EMP001', workerName: '田中 誠',   productName: '電磁弁ユニット',       plannedCount: 200, actualCount: 210, workHours: 8,   createdAt: '2025-12-05T17:00:00' },
  { id: 'PR002', date: '2025-12-08', lineId: 'L2', lineName: '本社-成形ライン2',  workerId: 'EMP002', workerName: '鈴木 健太', productName: '注湯電磁弁',           plannedCount: 180, actualCount: 175, workHours: 8,   createdAt: '2025-12-08T17:00:00' },
  { id: 'PR003', date: '2025-12-10', lineId: 'L3', lineName: '加古川-成形ライン1', workerId: 'EMP003', workerName: '山本 直樹', productName: 'ガス通路制御ユニット', plannedCount: 150, actualCount: 155, workHours: 7.5, createdAt: '2025-12-10T17:00:00' },
  { id: 'PR004', date: '2025-12-12', lineId: 'L4', lineName: '加古川-成形ライン2', workerId: 'EMP004', workerName: '中村 亮',   productName: '台所リモコン筐体',   plannedCount: 300, actualCount: 290, workHours: 8,   createdAt: '2025-12-12T17:00:00' },
  { id: 'PR005', date: '2025-12-15', lineId: 'L1', lineName: '本社-成形ライン1',  workerId: 'EMP005', workerName: '佐藤 美咲', productName: '電磁弁ユニット',       plannedCount: 200, actualCount: 205, workHours: 8,   createdAt: '2025-12-15T17:00:00' },
  { id: 'PR006', date: '2025-12-18', lineId: 'L2', lineName: '本社-成形ライン2',  workerId: 'EMP006', workerName: '伊藤 拓也', productName: '注湯電磁弁',           plannedCount: 180, actualCount: 160, workHours: 7,   createdAt: '2025-12-18T17:00:00' },
  { id: 'PR007', date: '2025-12-20', lineId: 'L3', lineName: '加古川-成形ライン1', workerId: 'EMP001', workerName: '田中 誠',   productName: 'ガス通路制御ユニット', plannedCount: 150, actualCount: 148, workHours: 8,   createdAt: '2025-12-20T17:00:00' },
  { id: 'PR008', date: '2025-12-22', lineId: 'L4', lineName: '加古川-成形ライン2', workerId: 'EMP002', workerName: '鈴木 健太', productName: '台所リモコン筐体',   plannedCount: 300, actualCount: 310, workHours: 8.5, createdAt: '2025-12-22T17:00:00' },
  { id: 'PR009', date: '2026-01-06', lineId: 'L1', lineName: '本社-成形ライン1',  workerId: 'EMP003', workerName: '山本 直樹', productName: '電磁弁ユニット',       plannedCount: 200, actualCount: 198, workHours: 8,   createdAt: '2026-01-06T17:00:00' },
  { id: 'PR010', date: '2026-01-08', lineId: 'L2', lineName: '本社-成形ライン2',  workerId: 'EMP004', workerName: '中村 亮',   productName: '注湯電磁弁',           plannedCount: 180, actualCount: 185, workHours: 8,   createdAt: '2026-01-08T17:00:00' },
  { id: 'PR011', date: '2026-01-10', lineId: 'L3', lineName: '加古川-成形ライン1', workerId: 'EMP005', workerName: '佐藤 美咲', productName: 'ガス通路制御ユニット', plannedCount: 150, actualCount: 150, workHours: 8,   createdAt: '2026-01-10T17:00:00' },
  { id: 'PR012', date: '2026-01-13', lineId: 'L4', lineName: '加古川-成形ライン2', workerId: 'EMP006', workerName: '伊藤 拓也', productName: '台所リモコン筐体',   plannedCount: 300, actualCount: 295, workHours: 8,   createdAt: '2026-01-13T17:00:00' },
  { id: 'PR013', date: '2026-01-15', lineId: 'L1', lineName: '本社-成形ライン1',  workerId: 'EMP001', workerName: '田中 誠',   productName: '電磁弁ユニット',       plannedCount: 200, actualCount: 215, workHours: 8.5, createdAt: '2026-01-15T17:00:00' },
  { id: 'PR014', date: '2026-01-17', lineId: 'L2', lineName: '本社-成形ライン2',  workerId: 'EMP002', workerName: '鈴木 健太', productName: '注湯電磁弁',           plannedCount: 180, actualCount: 170, workHours: 7.5, createdAt: '2026-01-17T17:00:00' },
  { id: 'PR015', date: '2026-01-20', lineId: 'L3', lineName: '加古川-成形ライン1', workerId: 'EMP003', workerName: '山本 直樹', productName: 'ガス通路制御ユニット', plannedCount: 150, actualCount: 155, workHours: 8,   createdAt: '2026-01-20T17:00:00' },
  { id: 'PR016', date: '2026-01-22', lineId: 'L4', lineName: '加古川-成形ライン2', workerId: 'EMP004', workerName: '中村 亮',   productName: '台所リモコン筐体',   plannedCount: 300, actualCount: 305, workHours: 8,   createdAt: '2026-01-22T17:00:00' },
  { id: 'PR017', date: '2026-01-25', lineId: 'L1', lineName: '本社-成形ライン1',  workerId: 'EMP005', workerName: '佐藤 美咲', productName: '電磁弁ユニット',       plannedCount: 200, actualCount: 192, workHours: 8,   createdAt: '2026-01-25T17:00:00' },
  { id: 'PR018', date: '2026-02-03', lineId: 'L2', lineName: '本社-成形ライン2',  workerId: 'EMP006', workerName: '伊藤 拓也', productName: '注湯電磁弁',           plannedCount: 180, actualCount: 178, workHours: 8,   createdAt: '2026-02-03T17:00:00' },
  { id: 'PR019', date: '2026-02-05', lineId: 'L3', lineName: '加古川-成形ライン1', workerId: 'EMP001', workerName: '田中 誠',   productName: 'ガス通路制御ユニット', plannedCount: 150, actualCount: 152, workHours: 8,   createdAt: '2026-02-05T17:00:00' },
  { id: 'PR020', date: '2026-02-07', lineId: 'L4', lineName: '加古川-成形ライン2', workerId: 'EMP002', workerName: '鈴木 健太', productName: '台所リモコン筐体',   plannedCount: 300, actualCount: 312, workHours: 8.5, createdAt: '2026-02-07T17:00:00' },
  { id: 'PR021', date: '2026-02-10', lineId: 'L1', lineName: '本社-成形ライン1',  workerId: 'EMP003', workerName: '山本 直樹', productName: '電磁弁ユニット',       plannedCount: 200, actualCount: 200, workHours: 8,   createdAt: '2026-02-10T17:00:00' },
  { id: 'PR022', date: '2026-02-13', lineId: 'L2', lineName: '本社-成形ライン2',  workerId: 'EMP004', workerName: '中村 亮',   productName: '注湯電磁弁',           plannedCount: 180, actualCount: 182, workHours: 8,   createdAt: '2026-02-13T17:00:00' },
  { id: 'PR023', date: '2026-02-17', lineId: 'L3', lineName: '加古川-成形ライン1', workerId: 'EMP005', workerName: '佐藤 美咲', productName: 'ガス通路制御ユニット', plannedCount: 150, actualCount: 145, workHours: 7.5, createdAt: '2026-02-17T17:00:00' },
  { id: 'PR024', date: '2026-02-20', lineId: 'L4', lineName: '加古川-成形ライン2', workerId: 'EMP006', workerName: '伊藤 拓也', productName: '台所リモコン筐体',   plannedCount: 300, actualCount: 298, workHours: 8,   createdAt: '2026-02-20T17:00:00' },
  { id: 'PR025', date: '2026-02-24', lineId: 'L1', lineName: '本社-成形ライン1',  workerId: 'EMP001', workerName: '田中 誠',   productName: '電磁弁ユニット',       plannedCount: 200, actualCount: 208, workHours: 8,   createdAt: '2026-02-24T17:00:00' },
];

// 作業者マスタ
export const mockWorkerMasters: WorkerMaster[] = [
  { id: 'w001', name: '田中 誠',   employeeNumber: 'EMP001', department: '企画管理室', isActive: true },
  { id: 'w002', name: '鈴木 健太', employeeNumber: 'EMP002', department: '製造部',     isActive: true },
  { id: 'w003', name: '山本 直樹', employeeNumber: 'EMP003', department: '製造部',     isActive: true },
  { id: 'w004', name: '中村 亮',   employeeNumber: 'EMP004', department: '製造部',     isActive: true },
  { id: 'w005', name: '佐藤 美咲', employeeNumber: 'EMP005', department: '品質管理部', isActive: true },
  { id: 'w006', name: '伊藤 拓也', employeeNumber: 'EMP006', department: '製造部',     isActive: false },
];

// ラインマスタ
export const mockLineMasters: LineMaster[] = [
  { id: 'l001', name: '本社-成形ライン1',   capacity: 500, isActive: true },
  { id: 'l002', name: '本社-成形ライン2',   capacity: 450, isActive: true },
  { id: 'l003', name: '加古川-成形ライン1', capacity: 500, isActive: true },
  { id: 'l004', name: '加古川-成形ライン2', capacity: 400, isActive: false },
];

// 取引先マスタ
export const mockClientMasters: ClientMaster[] = [
  {
    id: 'c001',
    name: 'ノーリツ株式会社',
    formatType: 'CSV形式A',
    isActive: true,
    columnMapping: {
      orderNumber: '注文番号',
      productCode: '品番',
      quantity: '数量',
      deliveryDate: '納期',
      clientCode: '得意先コード',
    },
  },
  {
    id: 'c002',
    name: '株式会社ABC商事',
    formatType: 'CSV形式B',
    isActive: true,
    columnMapping: {
      orderNumber: 'ORDER_NO',
      productCode: 'ITEM_CODE',
      quantity: 'QTY',
      deliveryDate: 'DELIVERY',
      clientCode: 'CLIENT_CD',
    },
  },
  {
    id: 'c003',
    name: '山田製作所',
    formatType: 'CSV形式C',
    isActive: true,
    columnMapping: {
      orderNumber: '受注No',
      productCode: '製品コード',
      quantity: '発注数',
      deliveryDate: '希望納期',
      clientCode: '顧客番号',
    },
  },
];
