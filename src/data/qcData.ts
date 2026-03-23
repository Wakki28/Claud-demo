import type { QcResultItem, QcMasterItem, AnomalyInfo } from "../types/qc";

// ── マスタ定義 ───────────────────────────────────────────
export const PROCESS_VERSION_MAP: Record<string, string[]> = {
  P001: ["v1.0", "v2.0", "v3.0"],
  P002: ["v1.0", "v2.0"],
  P003: ["v1.0"],
  P004: ["v1.0", "v2.0", "v2.1"],
};

export const PROCESS_CODES = Object.keys(PROCESS_VERSION_MAP);
export const ALL_VERSIONS = [
  ...new Set(Object.values(PROCESS_VERSION_MAP).flat()),
].sort();

export const ITEMS_PER_PROCESS: Record<string, string[]> = {
  P001: ["外観検査", "寸法測定", "重量測定", "色彩検査"],
  P002: ["強度試験", "耐久性試験", "表面粗さ", "外観検査", "寸法測定"],
  P003: ["重量測定", "外観検査", "色彩検査"],
  P004: ["引張試験", "硬度測定", "外観検査", "耐久性試験", "寸法測定", "表面粗さ"],
};

export const CAT_OPTIONS = ["ユーザー権限マスタ", "品質管理"];
export const NAME_MAP: Record<string, string[]> = {
  ユーザー権限マスタ: ["担当者マスタ", "権限マスタ"],
  品質管理: ["検査項目マスタ"],
};

export const EMPTY_MASTER: Omit<QcMasterItem, "id"> = {
  processCode: "",
  masterVersion: "",
  checkItemName: "",
  checkMethodType: "",
  nCount: 1,
  judgementCriteria: "",
  measurementMethod: "",
  specUpperLimit: null,
  specLowerLimit: null,
  specCenterValue: null,
  referenceFile: "",
  referenceFileData: null,
  updatedAt: "",
};

// ── ユーティリティ ───────────────────────────────────────
export const mkDate = (daysAgo: number, hour = 9): string => {
  const d = new Date(2026, 1, 20 - daysAgo, hour, 30);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const INS = ["田中 一郎", "鈴木 花子", "佐藤 次郎", "山田 三郎"];
const REG = ["田中 一郎", "鈴木 花子", "システム連携"];

// ── 実績ダミーデータ 42件 ─────────────────────────────────
export const DUMMY_RESULTS: QcResultItem[] = [
  // P001 v1.0 — 通常5件
  { id: 1, processCode: "P001", masterVersion: "v1.0", checkItemName: "外観検査", measuredValue: "5.11 mm", judgement: "OK", inspectedAt: mkDate(12, 8), inspectedBy: INS[0], registeredAt: mkDate(12, 9), registeredBy: REG[0], isAdded: false, isUpdated: false },
  { id: 2, processCode: "P001", masterVersion: "v1.0", checkItemName: "寸法測定", measuredValue: "5.22 mm", judgement: "OK", inspectedAt: mkDate(11, 9), inspectedBy: INS[1], registeredAt: mkDate(11, 10), registeredBy: REG[1], isAdded: false, isUpdated: false },
  { id: 3, processCode: "P001", masterVersion: "v1.0", checkItemName: "重量測定", measuredValue: "5.33 mm", judgement: "NG", inspectedAt: mkDate(10, 8), inspectedBy: INS[2], registeredAt: mkDate(10, 9), registeredBy: REG[2], isAdded: false, isUpdated: false },
  { id: 4, processCode: "P001", masterVersion: "v1.0", checkItemName: "硬度測定", measuredValue: "5.44 mm", judgement: "OK", inspectedAt: mkDate(9, 10), inspectedBy: INS[3], registeredAt: mkDate(9, 11), registeredBy: REG[0], isAdded: false, isUpdated: false },
  { id: 5, processCode: "P001", masterVersion: "v1.0", checkItemName: "表面粗さ", measuredValue: "5.55 mm", judgement: "-", inspectedAt: mkDate(8, 8), inspectedBy: INS[0], registeredAt: mkDate(8, 9), registeredBy: REG[1], isAdded: false, isUpdated: false },
  // P001 v2.0 — 通常3件 + 追加2件
  { id: 6, processCode: "P001", masterVersion: "v2.0", checkItemName: "外観検査", measuredValue: "5.66 mm", judgement: "OK", inspectedAt: mkDate(7, 9), inspectedBy: INS[1], registeredAt: mkDate(7, 10), registeredBy: REG[2], isAdded: false, isUpdated: false },
  { id: 7, processCode: "P001", masterVersion: "v2.0", checkItemName: "重量測定", measuredValue: "5.77 mm", judgement: "OK", inspectedAt: mkDate(6, 8), inspectedBy: INS[2], registeredAt: mkDate(6, 9), registeredBy: REG[0], isAdded: false, isUpdated: false },
  { id: 8, processCode: "P001", masterVersion: "v2.0", checkItemName: "寸法測定", measuredValue: "5.88 mm", judgement: "OK", inspectedAt: mkDate(5, 10), inspectedBy: INS[3], registeredAt: mkDate(5, 11), registeredBy: REG[1], isAdded: false, isUpdated: false },
  { id: 9, processCode: "P001", masterVersion: "v2.0", checkItemName: "色彩検査", measuredValue: "5.99 mm", judgement: "OK", inspectedAt: mkDate(4, 9), inspectedBy: INS[0], registeredAt: mkDate(4, 10), registeredBy: REG[2], isAdded: true, isUpdated: false },
  { id: 10, processCode: "P001", masterVersion: "v2.0", checkItemName: "光沢測定", measuredValue: "6.10 mm", judgement: "OK", inspectedAt: mkDate(3, 8), inspectedBy: INS[1], registeredAt: mkDate(3, 9), registeredBy: REG[0], isAdded: true, isUpdated: false },
  // P001 v3.0 — 通常3件 + 修正1件
  { id: 11, processCode: "P001", masterVersion: "v3.0", checkItemName: "外観検査", measuredValue: "6.21 mm", judgement: "OK", inspectedAt: mkDate(7, 9), inspectedBy: INS[2], registeredAt: mkDate(7, 10), registeredBy: REG[1], isAdded: false, isUpdated: false },
  { id: 12, processCode: "P001", masterVersion: "v3.0", checkItemName: "寸法測定", measuredValue: "6.32 mm", judgement: "-", inspectedAt: mkDate(6, 10), inspectedBy: INS[3], registeredAt: mkDate(6, 11), registeredBy: REG[2], isAdded: false, isUpdated: false },
  { id: 13, processCode: "P001", masterVersion: "v3.0", checkItemName: "硬度測定", measuredValue: "6.43 mm", judgement: "OK", inspectedAt: mkDate(5, 8), inspectedBy: INS[0], registeredAt: mkDate(5, 9), registeredBy: REG[0], isAdded: false, isUpdated: false },
  { id: 14, processCode: "P001", masterVersion: "v3.0", checkItemName: "重量測定", measuredValue: "6.54 mm", judgement: "OK", inspectedAt: mkDate(4, 9), inspectedBy: INS[1], registeredAt: mkDate(4, 10), registeredBy: REG[1], isAdded: false, isUpdated: true },
  // P002 v1.0 — 通常4件 + 修正1件
  { id: 15, processCode: "P002", masterVersion: "v1.0", checkItemName: "強度試験", measuredValue: "6.65 mm", judgement: "OK", inspectedAt: mkDate(13, 8), inspectedBy: INS[2], registeredAt: mkDate(13, 9), registeredBy: REG[2], isAdded: false, isUpdated: false },
  { id: 16, processCode: "P002", masterVersion: "v1.0", checkItemName: "耐久性試験", measuredValue: "6.76 mm", judgement: "-", inspectedAt: mkDate(12, 9), inspectedBy: INS[3], registeredAt: mkDate(12, 10), registeredBy: REG[0], isAdded: false, isUpdated: false },
  { id: 17, processCode: "P002", masterVersion: "v1.0", checkItemName: "外観検査", measuredValue: "6.87 mm", judgement: "OK", inspectedAt: mkDate(11, 8), inspectedBy: INS[0], registeredAt: mkDate(11, 9), registeredBy: REG[1], isAdded: false, isUpdated: false },
  { id: 18, processCode: "P002", masterVersion: "v1.0", checkItemName: "重量測定", measuredValue: "6.98 mm", judgement: "NG", inspectedAt: mkDate(10, 10), inspectedBy: INS[1], registeredAt: mkDate(10, 11), registeredBy: REG[2], isAdded: false, isUpdated: false },
  { id: 19, processCode: "P002", masterVersion: "v1.0", checkItemName: "引張荷重", measuredValue: "7.09 mm", judgement: "OK", inspectedAt: mkDate(9, 8), inspectedBy: INS[2], registeredAt: mkDate(9, 9), registeredBy: REG[0], isAdded: false, isUpdated: true },
  // P002 v2.0 — 通常3件 + 追加2件
  { id: 20, processCode: "P002", masterVersion: "v2.0", checkItemName: "強度試験", measuredValue: "7.20 mm", judgement: "NG", inspectedAt: mkDate(8, 9), inspectedBy: INS[3], registeredAt: mkDate(8, 10), registeredBy: REG[1], isAdded: false, isUpdated: false },
  { id: 21, processCode: "P002", masterVersion: "v2.0", checkItemName: "外観検査", measuredValue: "7.31 mm", judgement: "OK", inspectedAt: mkDate(7, 8), inspectedBy: INS[0], registeredAt: mkDate(7, 9), registeredBy: REG[2], isAdded: false, isUpdated: false },
  { id: 22, processCode: "P002", masterVersion: "v2.0", checkItemName: "耐久性試験", measuredValue: "7.42 mm", judgement: "OK", inspectedAt: mkDate(6, 10), inspectedBy: INS[1], registeredAt: mkDate(6, 11), registeredBy: REG[0], isAdded: false, isUpdated: false },
  { id: 23, processCode: "P002", masterVersion: "v2.0", checkItemName: "硬度測定", measuredValue: "7.53 mm", judgement: "OK", inspectedAt: mkDate(5, 8), inspectedBy: INS[2], registeredAt: mkDate(5, 9), registeredBy: REG[1], isAdded: true, isUpdated: false },
  { id: 24, processCode: "P002", masterVersion: "v2.0", checkItemName: "表面粗さ", measuredValue: "7.64 mm", judgement: "NG", inspectedAt: mkDate(4, 9), inspectedBy: INS[3], registeredAt: mkDate(4, 10), registeredBy: REG[2], isAdded: true, isUpdated: false },
  // P003 v1.0 — 通常4件 + 修正2件
  { id: 25, processCode: "P003", masterVersion: "v1.0", checkItemName: "重量測定", measuredValue: "7.75 mm", judgement: "OK", inspectedAt: mkDate(14, 8), inspectedBy: INS[0], registeredAt: mkDate(14, 9), registeredBy: REG[0], isAdded: false, isUpdated: false },
  { id: 26, processCode: "P003", masterVersion: "v1.0", checkItemName: "外観検査", measuredValue: "7.86 mm", judgement: "NG", inspectedAt: mkDate(13, 9), inspectedBy: INS[1], registeredAt: mkDate(13, 10), registeredBy: REG[1], isAdded: false, isUpdated: false },
  { id: 27, processCode: "P003", masterVersion: "v1.0", checkItemName: "色彩検査", measuredValue: "7.97 mm", judgement: "OK", inspectedAt: mkDate(12, 8), inspectedBy: INS[2], registeredAt: mkDate(12, 9), registeredBy: REG[2], isAdded: false, isUpdated: false },
  { id: 28, processCode: "P003", masterVersion: "v1.0", checkItemName: "引張試験", measuredValue: "8.08 mm", judgement: "OK", inspectedAt: mkDate(11, 10), inspectedBy: INS[3], registeredAt: mkDate(11, 11), registeredBy: REG[0], isAdded: false, isUpdated: false },
  { id: 29, processCode: "P003", masterVersion: "v1.0", checkItemName: "寸法公差", measuredValue: "8.19 mm", judgement: "OK", inspectedAt: mkDate(10, 8), inspectedBy: INS[0], registeredAt: mkDate(10, 9), registeredBy: REG[1], isAdded: false, isUpdated: true },
  { id: 30, processCode: "P003", masterVersion: "v1.0", checkItemName: "防錆検査", measuredValue: "8.30 mm", judgement: "OK", inspectedAt: mkDate(9, 9), inspectedBy: INS[1], registeredAt: mkDate(9, 10), registeredBy: REG[2], isAdded: false, isUpdated: true },
  // P004 v1.0 — 通常5件
  { id: 31, processCode: "P004", masterVersion: "v1.0", checkItemName: "引張試験", measuredValue: "8.41 mm", judgement: "OK", inspectedAt: mkDate(8, 8), inspectedBy: INS[2], registeredAt: mkDate(8, 9), registeredBy: REG[0], isAdded: false, isUpdated: false },
  { id: 32, processCode: "P004", masterVersion: "v1.0", checkItemName: "外観検査", measuredValue: "8.52 mm", judgement: "OK", inspectedAt: mkDate(7, 10), inspectedBy: INS[3], registeredAt: mkDate(7, 11), registeredBy: REG[1], isAdded: false, isUpdated: false },
  { id: 33, processCode: "P004", masterVersion: "v1.0", checkItemName: "重量測定", measuredValue: "8.63 mm", judgement: "-", inspectedAt: mkDate(6, 8), inspectedBy: INS[0], registeredAt: mkDate(6, 9), registeredBy: REG[2], isAdded: false, isUpdated: false },
  { id: 34, processCode: "P004", masterVersion: "v1.0", checkItemName: "耐久性試験", measuredValue: "8.74 mm", judgement: "OK", inspectedAt: mkDate(5, 9), inspectedBy: INS[1], registeredAt: mkDate(5, 10), registeredBy: REG[0], isAdded: false, isUpdated: false },
  { id: 35, processCode: "P004", masterVersion: "v1.0", checkItemName: "寸法測定", measuredValue: "8.85 mm", judgement: "OK", inspectedAt: mkDate(4, 8), inspectedBy: INS[2], registeredAt: mkDate(4, 9), registeredBy: REG[1], isAdded: false, isUpdated: false },
  // P004 v2.0 — 通常3件 + 追加2件
  { id: 36, processCode: "P004", masterVersion: "v2.0", checkItemName: "引張試験", measuredValue: "8.96 mm", judgement: "OK", inspectedAt: mkDate(5, 10), inspectedBy: INS[3], registeredAt: mkDate(5, 11), registeredBy: REG[2], isAdded: false, isUpdated: false },
  { id: 37, processCode: "P004", masterVersion: "v2.0", checkItemName: "外観検査", measuredValue: "9.07 mm", judgement: "OK", inspectedAt: mkDate(4, 8), inspectedBy: INS[0], registeredAt: mkDate(4, 9), registeredBy: REG[0], isAdded: false, isUpdated: false },
  { id: 38, processCode: "P004", masterVersion: "v2.0", checkItemName: "重量測定", measuredValue: "9.18 mm", judgement: "NG", inspectedAt: mkDate(3, 9), inspectedBy: INS[1], registeredAt: mkDate(3, 10), registeredBy: REG[1], isAdded: false, isUpdated: false },
  { id: 39, processCode: "P004", masterVersion: "v2.0", checkItemName: "硬度測定", measuredValue: "9.29 mm", judgement: "OK", inspectedAt: mkDate(2, 8), inspectedBy: INS[2], registeredAt: mkDate(2, 9), registeredBy: REG[2], isAdded: true, isUpdated: false },
  { id: 40, processCode: "P004", masterVersion: "v2.0", checkItemName: "耐熱試験", measuredValue: "9.40 mm", judgement: "OK", inspectedAt: mkDate(1, 10), inspectedBy: INS[3], registeredAt: mkDate(1, 11), registeredBy: REG[0], isAdded: true, isUpdated: false },
  // P004 v2.1 — 修正2件
  { id: 41, processCode: "P004", masterVersion: "v2.1", checkItemName: "摩耗試験", measuredValue: "9.51 mm", judgement: "OK", inspectedAt: mkDate(3, 9), inspectedBy: INS[0], registeredAt: mkDate(3, 10), registeredBy: REG[1], isAdded: false, isUpdated: true },
  { id: 42, processCode: "P004", masterVersion: "v2.1", checkItemName: "表面粗さ", measuredValue: "9.62 mm", judgement: "NG", inspectedAt: mkDate(2, 8), inspectedBy: INS[1], registeredAt: mkDate(2, 9), registeredBy: REG[2], isAdded: false, isUpdated: true },
];

// ── 異常理由ダミーデータ ──────────────────────────────────
export const DUMMY_ANOMALIES: AnomalyInfo[] = [
  {
    rowId: "P001-v1.0-重量測定",
    reason: "規定値5.30mmに対して測定値5.33mmと上限を超過。測定機器の校正を確認済みだが再測定でも同値のため異常と判定。",
    detectedAt: "2026/02/10 08:30",
  },
  {
    rowId: "P001-v1.0-表面粗さ",
    reason: "測定データ未入力",
    detectedAt: "2026/02/12 08:30",
  },
  {
    rowId: "P001-v3.0-寸法測定",
    reason: "測定値6.32mmが規格下限6.50mmを下回った。ロット全数の再測定が必要。",
    detectedAt: "2026/02/14 10:15",
  },
  {
    rowId: "P002-v1.0-耐久性試験",
    reason: "試験実施中に装置エラーが発生し測定を中断。再試験待ち。",
    detectedAt: "2026/02/08 14:00",
  },
  {
    rowId: "P002-v1.0-重量測定",
    reason: "規定値6.80mmに対して測定値6.98mmと上限を超過。素材ロット番号L2024-112に起因する可能性あり。",
    detectedAt: "2026/02/10 11:45",
  },
  {
    rowId: "P002-v2.0-強度試験",
    reason: "引張強度が規格値320N/mm²に対して287N/mm²と下回った。熱処理工程の温度プロファイルを確認中。",
    detectedAt: "2026/02/12 09:00",
  },
  {
    rowId: "P002-v2.0-表面粗さ",
    reason: "Ra値が規格上限0.8μmに対して1.2μmと超過。切削条件（送り速度）の見直しが必要。",
    detectedAt: "2026/02/16 13:30",
  },
  {
    rowId: "P003-v1.0-外観検査",
    reason: "表面に微細なクラックを検出（長さ約0.3mm、2箇所）。目視確認済み。使用不可ロットとして隔離済み。",
    detectedAt: "2026/02/07 08:00",
  },
  {
    rowId: "P004-v1.0-重量測定",
    reason: "測定機器のキャリブレーション期限切れのため測定値の信頼性が確保できない状態。",
    detectedAt: "2026/02/14 16:00",
  },
  {
    rowId: "P004-v2.0-重量測定",
    reason: "規定値9.00mmに対して測定値9.18mmで上限超過。金型摩耗による寸法変化と推定。金型交換を検討中。",
    detectedAt: "2026/02/17 09:45",
  },
  {
    rowId: "P004-v2.1-表面粗さ",
    reason: "研磨工程後のRa値が規格値1.6μmに対して2.4μmと超過。研磨砥粒の粒度番号を見直し中。",
    detectedAt: "2026/02/18 11:00",
  },
];

// ── マスタダミーデータ ────────────────────────────────────
export const DUMMY_MASTERS: QcMasterItem[] = (() => {
  const rows: QcMasterItem[] = [];
  let id = 1;
  PROCESS_CODES.forEach((pc) => {
    (PROCESS_VERSION_MAP[pc] ?? []).forEach((ver) => {
      (ITEMS_PER_PROCESS[pc] ?? []).forEach((item, ii) => {
        const ul = parseFloat((10 + id * 0.1).toFixed(1));
        const ll = parseFloat((5 + id * 0.05).toFixed(1));
        rows.push({
          id: id++,
          processCode: pc,
          masterVersion: ver,
          checkItemName: item,
          checkMethodType: ["目視", "ノギス", "引張試験機", "電子天秤", "マイクロメータ"][ii % 5],
          nCount: [1, 3, 5, 10][ii % 4],
          judgementCriteria: ["合否基準A", "合否基準B", "規格値以内"][ii % 3],
          measurementMethod: ["直接測定", "比較測定", "間接測定"][ii % 3],
          specUpperLimit: ul,
          specLowerLimit: ll,
          specCenterValue: parseFloat(((ul + ll) / 2).toFixed(2)),
          referenceFile:
            ii % 3 === 0
              ? `QC_REF_${String(id).padStart(3, "0")}.pdf`
              : ii % 4 === 1
                ? `QC_IMG_${String(id).padStart(3, "0")}.png`
                : "",
          referenceFileData: null,
          updatedAt: mkDate(id % 30),
        });
      });
    });
  });
  return rows;
})();
