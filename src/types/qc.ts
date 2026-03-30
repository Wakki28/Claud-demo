// ── QC マスタ管理 型定義 ──────────────────────────────────

export type QcViewMode = "result" | "master";
export type QcPageSize = 10 | 20 | 50;

// 正しい階層：工程 > バージョン > 改版 > 検査項目 > 検査段階 > 検査結果(N数)
export type QcResultItem = {
  id: number;
  processCode: string;
  masterVersion: string;
  revisionNumber: number;
  checkItemName: string;      // 検査項目（改版の下）
  inspectionStage: string;    // 検査段階（検査項目の下：初/中1/中2.../終）
  nIndex: number;             // N数番号（1始まり）
  measuredValue: string;
  judgement: "OK" | "NG" | "-";
  inspectedAt: string;
  inspectedBy: string;
  registeredAt: string;
  registeredBy: string;
  isAdded: boolean;
  isUpdated: boolean;
  originalData?: OriginalResultData;
};

// 総合結果（工程 × バージョン × 改版 の単位）
// overallResult はフロントエンドで自動計算する（手動登録不可）
export type QcGroupOverall = {
  processCode: string;
  masterVersion: string;
  revisionNumber: number;
  overallResult?: "OK" | "NG" | null; // 計算値（nullは検査中）
  isAdopted: boolean;
};

export type QcMasterItem = {
  id: number;
  processCode: string;
  masterVersion: string;
  checkItemName: string;
  checkMethodType: string;
  nCount: number;
  judgementCriteria: string;
  measurementMethod: string;
  specUpperLimit: number | null;
  specLowerLimit: number | null;
  specCenterValue: number | null;
  referenceFile: string;
  referenceFileData: string | null;
  updatedAt: string;
};

export type ResultSearchState = {
  processCode: string;
  masterVersion: string;
  checkItemName: string;
  overallResult: string;      // すべて/"OK"/"NG"/"検査中"
  inspectionStage: string;   // すべて/"初"/"中"/"終"
  adoptionStatus: string;    // ""=すべて / "adopted" / "notAdopted"
  changedOnly: boolean;      // 変更ありのみ表示
};

export type MasterSearchState = {
  processCode: string;
  masterVersion: string;
  checkItemName: string;
  checkMethodType: string;
};

export type ModalState = {
  mode: "create" | "edit";
  data: QcMasterItem | null;
} | null;

export type PreviewFile = {
  name: string;
  data: string | null;
} | null;

export type AnomalyInfo = {
  rowId: string;
  reason: string;
  detectedAt?: string;
};

export type OriginalResultData = {
  measuredValue: string;
  judgement: "OK" | "NG" | "-";
  inspectedAt: string;
  inspectedBy: string;
  registeredAt: string;
  registeredBy: string;
  modifiedAt: string;
  modifiedBy: string;
};
