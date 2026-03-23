// ── QC マスタ管理 型定義 ──────────────────────────────────

export type QcViewMode = "result" | "master";
export type QcPageSize = 10 | 20 | 50;

export type QcResultItem = {
  id: number;
  processCode: string;
  masterVersion: string;
  checkItemName: string;
  measuredValue: string;
  judgement: "OK" | "NG" | "-";
  inspectedAt: string;
  inspectedBy: string;
  registeredAt: string;
  registeredBy: string;
  isAdded: boolean;
  isUpdated: boolean;
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
  judgement: string;
  changeType: string;
};

export type MasterSearchState = {
  processCode: string;
  masterVersion: string;
  checkItemName: string;
};

export type ModalState = {
  mode: "create" | "edit";
  data: QcMasterItem | null;
} | null;

export type PreviewFile = {
  name: string;
  data: string | null;
} | null;
