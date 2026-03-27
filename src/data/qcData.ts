import type { QcResultItem, QcMasterItem, QcGroupOverall, AnomalyInfo, OriginalResultData } from "../types/qc";

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

const mkOrig = (
  measuredValue: string,
  judgement: "OK" | "NG" | "-",
  inspectedAgo: number,
  inspectedBy: string,
  registeredAgo: number,
  registeredBy: string,
  modifiedAgo: number,
  modifiedBy: string,
): OriginalResultData => ({
  measuredValue,
  judgement,
  inspectedAt: mkDate(inspectedAgo, 9),
  inspectedBy,
  registeredAt: mkDate(registeredAgo, 10),
  registeredBy,
  modifiedAt: mkDate(modifiedAgo, 11),
  modifiedBy,
});

// ── 実績ダミーデータ ──────────────────────────────────────
// 正しい階層構造：工程 > バージョン > 改版 > 検査項目 > 検査段階 > 検査結果(N数)
export const DUMMY_RESULTS: QcResultItem[] = (() => {
  const rows: QcResultItem[] = [];
  let nextId = 1;
  let daysAgo = 0;

  const add = (
    pc: string, ver: string, rev: number,
    item: string, stage: string, n: number,
    val: string, judge: "OK" | "NG" | "-",
    isAdded = false, isUpdated = false,
    orig?: OriginalResultData,
  ): void => {
    const id = nextId++;
    const r: QcResultItem = {
      id,
      processCode: pc,
      masterVersion: ver,
      revisionNumber: rev,
      checkItemName: item,
      inspectionStage: stage,
      nIndex: n,
      measuredValue: val,
      judgement: judge,
      inspectedAt: mkDate(daysAgo + 1, 8 + (n % 3)),
      inspectedBy: INS[(id + n) % 4],
      registeredAt: mkDate(daysAgo, 9 + (n % 2)),
      registeredBy: REG[id % 3],
      isAdded,
      isUpdated,
    };
    if (orig) r.originalData = orig;
    rows.push(r);
  };

  // ── P001 v1.0 改版0 ──────────────────────────────────
  daysAgo = 12;
  // 外観検査: 初×2, 終×2
  add("P001","v1.0",0,"外観検査","初",1,"5.11 mm","OK");
  add("P001","v1.0",0,"外観検査","初",2,"5.12 mm","OK");
  add("P001","v1.0",0,"外観検査","終",1,"5.13 mm","OK");
  add("P001","v1.0",0,"外観検査","終",2,"5.14 mm","OK");
  // 寸法測定: 初×2, 終×2
  daysAgo = 11;
  add("P001","v1.0",0,"寸法測定","初",1,"5.22 mm","OK");
  add("P001","v1.0",0,"寸法測定","初",2,"5.23 mm","OK");
  add("P001","v1.0",0,"寸法測定","終",1,"5.24 mm","OK");
  add("P001","v1.0",0,"寸法測定","終",2,"5.25 mm","OK");

  // ── P001 v2.0 改版0 ──────────────────────────────────
  daysAgo = 9;
  // 外観検査: 初×2, 終×2
  add("P001","v2.0",0,"外観検査","初",1,"5.33 mm","OK");
  add("P001","v2.0",0,"外観検査","初",2,"5.34 mm","OK");
  add("P001","v2.0",0,"外観検査","終",1,"5.35 mm","OK");
  add("P001","v2.0",0,"外観検査","終",2,"5.36 mm","OK");
  // 重量測定: 初×2, 終×2
  daysAgo = 8;
  add("P001","v2.0",0,"重量測定","初",1,"5.45 mm","OK");
  add("P001","v2.0",0,"重量測定","初",2,"5.46 mm","-");
  add("P001","v2.0",0,"重量測定","終",1,"5.47 mm","OK");
  add("P001","v2.0",0,"重量測定","終",2,"5.48 mm","OK");

  // ── P001 v2.0 改版1（追加） ───────────────────────────
  daysAgo = 4;
  // 色彩検査: 初×2, 終×2
  add("P001","v2.0",1,"色彩検査","初",1,"5.60 mm","OK",true);
  add("P001","v2.0",1,"色彩検査","初",2,"5.61 mm","OK",true);
  add("P001","v2.0",1,"色彩検査","終",1,"5.62 mm","NG",true);
  add("P001","v2.0",1,"色彩検査","終",2,"5.63 mm","OK",true);

  // ── P001 v3.0 改版0 ──────────────────────────────────
  daysAgo = 7;
  // 外観検査: 初×2, 中1×2, 終×2
  add("P001","v3.0",0,"外観検査","初",1,"6.01 mm","OK");
  add("P001","v3.0",0,"外観検査","初",2,"6.02 mm","OK");
  add("P001","v3.0",0,"外観検査","中1",1,"6.11 mm","OK");
  add("P001","v3.0",0,"外観検査","中1",2,"6.12 mm","OK");
  add("P001","v3.0",0,"外観検査","終",1,"6.21 mm","OK");
  add("P001","v3.0",0,"外観検査","終",2,"6.22 mm","OK");
  // 寸法測定: 初×2, 終×2（修正あり）
  daysAgo = 6;
  add("P001","v3.0",0,"寸法測定","初",1,"6.31 mm","-",false,true,
    mkOrig("6.20 mm","NG",9,INS[1],8,REG[1],5,REG[0]));
  add("P001","v3.0",0,"寸法測定","初",2,"6.32 mm","OK");
  add("P001","v3.0",0,"寸法測定","終",1,"6.33 mm","OK");
  add("P001","v3.0",0,"寸法測定","終",2,"6.34 mm","OK");

  // ── P002 v1.0 改版0 ──────────────────────────────────
  daysAgo = 14;
  // 強度試験: 初×2, 終×2
  add("P002","v1.0",0,"強度試験","初",1,"6.50 mm","OK");
  add("P002","v1.0",0,"強度試験","初",2,"6.51 mm","OK");
  add("P002","v1.0",0,"強度試験","終",1,"6.52 mm","OK");
  add("P002","v1.0",0,"強度試験","終",2,"6.53 mm","OK");
  // 耐久性試験: 初×2, 終×2（一部修正）
  daysAgo = 13;
  add("P002","v1.0",0,"耐久性試験","初",1,"6.60 mm","-");
  add("P002","v1.0",0,"耐久性試験","初",2,"6.61 mm","NG");
  add("P002","v1.0",0,"耐久性試験","終",1,"6.70 mm","NG",false,true,
    mkOrig("6.85 mm","OK",16,INS[2],15,REG[0],12,REG[1]));
  add("P002","v1.0",0,"耐久性試験","終",2,"6.71 mm","OK");

  // ── P002 v2.0 改版0 ──────────────────────────────────
  daysAgo = 8;
  // 強度試験: 初×2, 終×2
  add("P002","v2.0",0,"強度試験","初",1,"7.10 mm","NG");
  add("P002","v2.0",0,"強度試験","初",2,"7.11 mm","OK");
  add("P002","v2.0",0,"強度試験","終",1,"7.20 mm","OK");
  add("P002","v2.0",0,"強度試験","終",2,"7.21 mm","OK");
  // 外観検査: 初×2, 終×2
  daysAgo = 7;
  add("P002","v2.0",0,"外観検査","初",1,"7.30 mm","OK");
  add("P002","v2.0",0,"外観検査","初",2,"7.31 mm","OK");
  add("P002","v2.0",0,"外観検査","終",1,"7.40 mm","OK");
  add("P002","v2.0",0,"外観検査","終",2,"7.41 mm","OK");

  // ── P002 v2.0 改版1（追加） ───────────────────────────
  daysAgo = 5;
  // 硬度測定: 初×2, 終×2
  add("P002","v2.0",1,"硬度測定","初",1,"7.50 mm","OK",true);
  add("P002","v2.0",1,"硬度測定","初",2,"7.51 mm","OK",true);
  add("P002","v2.0",1,"硬度測定","終",1,"7.60 mm","NG",true);
  add("P002","v2.0",1,"硬度測定","終",2,"7.61 mm","OK",true);

  // ── P003 v1.0 改版0 ──────────────────────────────────
  daysAgo = 15;
  // 重量測定: 初×2, 中1×2, 終×2
  add("P003","v1.0",0,"重量測定","初",1,"7.70 mm","OK");
  add("P003","v1.0",0,"重量測定","初",2,"7.71 mm","OK");
  add("P003","v1.0",0,"重量測定","中1",1,"7.80 mm","OK");
  add("P003","v1.0",0,"重量測定","中1",2,"7.81 mm","OK");
  add("P003","v1.0",0,"重量測定","終",1,"7.90 mm","OK");
  add("P003","v1.0",0,"重量測定","終",2,"7.91 mm","OK");
  // 外観検査: 初×2, 中1×2, 終×2（一部修正）
  daysAgo = 13;
  add("P003","v1.0",0,"外観検査","初",1,"8.00 mm","NG");
  add("P003","v1.0",0,"外観検査","初",2,"8.01 mm","OK");
  add("P003","v1.0",0,"外観検査","中1",1,"8.10 mm","OK",false,true,
    mkOrig("8.45 mm","NG",16,INS[0],15,REG[1],12,REG[2]));
  add("P003","v1.0",0,"外観検査","中1",2,"8.11 mm","OK");
  add("P003","v1.0",0,"外観検査","終",1,"8.20 mm","OK",false,true,
    mkOrig("8.10 mm","-",14,INS[1],13,REG[2],10,REG[0]));
  add("P003","v1.0",0,"外観検査","終",2,"8.21 mm","OK");

  // ── P003 v1.0 改版1（追加） ───────────────────────────
  daysAgo = 10;
  // 色彩検査: 初×2, 終×2
  add("P003","v1.0",1,"色彩検査","初",1,"8.30 mm","OK",true);
  add("P003","v1.0",1,"色彩検査","初",2,"8.31 mm","OK",true);
  add("P003","v1.0",1,"色彩検査","終",1,"8.40 mm","OK",true);
  add("P003","v1.0",1,"色彩検査","終",2,"8.41 mm","OK",true);

  // ── P004 v1.0 改版0 ──────────────────────────────────
  daysAgo = 10;
  // 引張試験: 初×2, 終×2
  add("P004","v1.0",0,"引張試験","初",1,"8.50 mm","OK");
  add("P004","v1.0",0,"引張試験","初",2,"8.51 mm","OK");
  add("P004","v1.0",0,"引張試験","終",1,"8.60 mm","OK");
  add("P004","v1.0",0,"引張試験","終",2,"8.61 mm","OK");
  // 外観検査: 初×2, 終×2
  daysAgo = 9;
  add("P004","v1.0",0,"外観検査","初",1,"8.70 mm","OK");
  add("P004","v1.0",0,"外観検査","初",2,"8.71 mm","OK");
  add("P004","v1.0",0,"外観検査","終",1,"8.80 mm","-");
  add("P004","v1.0",0,"外観検査","終",2,"8.81 mm","OK");
  // 寸法測定: 初×2, 終×2
  daysAgo = 8;
  add("P004","v1.0",0,"寸法測定","初",1,"8.90 mm","OK");
  add("P004","v1.0",0,"寸法測定","初",2,"8.91 mm","OK");
  add("P004","v1.0",0,"寸法測定","終",1,"9.00 mm","OK");
  add("P004","v1.0",0,"寸法測定","終",2,"9.01 mm","OK");

  // ── P004 v2.0 改版0 ──────────────────────────────────
  daysAgo = 6;
  // 引張試験: 初×2, 終×2
  add("P004","v2.0",0,"引張試験","初",1,"9.10 mm","OK");
  add("P004","v2.0",0,"引張試験","初",2,"9.11 mm","OK");
  add("P004","v2.0",0,"引張試験","終",1,"9.20 mm","OK");
  add("P004","v2.0",0,"引張試験","終",2,"9.21 mm","OK");
  // 重量測定: 初×2, 終×2
  daysAgo = 5;
  add("P004","v2.0",0,"重量測定","初",1,"9.30 mm","NG");
  add("P004","v2.0",0,"重量測定","初",2,"9.31 mm","OK");
  add("P004","v2.0",0,"重量測定","終",1,"9.40 mm","NG");
  add("P004","v2.0",0,"重量測定","終",2,"9.41 mm","OK");

  // ── P004 v2.0 改版1（追加） ───────────────────────────
  daysAgo = 3;
  // 耐熱試験: 初×2, 終×2
  add("P004","v2.0",1,"耐熱試験","初",1,"9.50 mm","OK",true);
  add("P004","v2.0",1,"耐熱試験","初",2,"9.51 mm","OK",true);
  add("P004","v2.0",1,"耐熱試験","終",1,"9.60 mm","OK",true);
  add("P004","v2.0",1,"耐熱試験","終",2,"9.61 mm","OK",true);

  // ── P004 v2.1 改版0（修正） ───────────────────────────
  daysAgo = 4;
  // 摩耗試験: 初×2, 終×2（全行修正）
  add("P004","v2.1",0,"摩耗試験","初",1,"9.70 mm","OK",false,true,
    mkOrig("9.30 mm","OK",7,INS[0],6,REG[1],4,REG[2]));
  add("P004","v2.1",0,"摩耗試験","初",2,"9.71 mm","OK",false,true,
    mkOrig("9.31 mm","OK",6,INS[1],5,REG[2],3,REG[0]));
  add("P004","v2.1",0,"摩耗試験","終",1,"9.72 mm","OK",false,true,
    mkOrig("9.32 mm","OK",5,INS[2],4,REG[0],2,REG[1]));
  add("P004","v2.1",0,"摩耗試験","終",2,"9.73 mm","OK",false,true,
    mkOrig("9.33 mm","OK",4,INS[3],3,REG[1],1,REG[2]));
  // 表面粗さ: 初×2, 終×2（修正）
  daysAgo = 3;
  add("P004","v2.1",0,"表面粗さ","初",1,"9.80 mm","NG",false,true,
    mkOrig("9.60 mm","OK",6,INS[1],5,REG[2],3,REG[0]));
  add("P004","v2.1",0,"表面粗さ","初",2,"9.81 mm","OK",false,true,
    mkOrig("9.61 mm","OK",5,INS[2],4,REG[0],2,REG[1]));
  add("P004","v2.1",0,"表面粗さ","終",1,"9.82 mm","NG",false,true,
    mkOrig("9.62 mm","OK",4,INS[3],3,REG[1],1,REG[2]));
  add("P004","v2.1",0,"表面粗さ","終",2,"9.83 mm","OK");

  return rows;
})();

// ── 総合結果ダミーデータ（工程 × バージョン × 改版 単位） ────────
export const DUMMY_OVERALL_RESULTS: QcGroupOverall[] = [
  { processCode: "P001", masterVersion: "v1.0", revisionNumber: 0, overallResult: "OK",  overallResultAt: mkDate(10), overallResultBy: "高宮 織太" },
  { processCode: "P001", masterVersion: "v2.0", revisionNumber: 0, overallResult: null },
  { processCode: "P001", masterVersion: "v2.0", revisionNumber: 1, overallResult: "NG",  overallResultAt: mkDate(3),  overallResultBy: "高宮 織太" },
  { processCode: "P001", masterVersion: "v3.0", revisionNumber: 0, overallResult: null },
  { processCode: "P002", masterVersion: "v1.0", revisionNumber: 0, overallResult: "OK",  overallResultAt: mkDate(11), overallResultBy: "高宮 織太" },
  { processCode: "P002", masterVersion: "v2.0", revisionNumber: 0, overallResult: "NG",  overallResultAt: mkDate(6),  overallResultBy: "高宮 織太" },
  { processCode: "P002", masterVersion: "v2.0", revisionNumber: 1, overallResult: null },
  { processCode: "P003", masterVersion: "v1.0", revisionNumber: 0, overallResult: "OK",  overallResultAt: mkDate(12), overallResultBy: "高宮 織太" },
  { processCode: "P003", masterVersion: "v1.0", revisionNumber: 1, overallResult: null },
  { processCode: "P004", masterVersion: "v1.0", revisionNumber: 0, overallResult: "OK",  overallResultAt: mkDate(7),  overallResultBy: "高宮 織太" },
  { processCode: "P004", masterVersion: "v2.0", revisionNumber: 0, overallResult: "NG",  overallResultAt: mkDate(4),  overallResultBy: "高宮 織太" },
  { processCode: "P004", masterVersion: "v2.0", revisionNumber: 1, overallResult: null },
  { processCode: "P004", masterVersion: "v2.1", revisionNumber: 0, overallResult: null },
];

// ── 異常理由ダミーデータ ──────────────────────────────────
// rowId 形式: "${processCode}-${masterVersion}-rev${revisionNumber}-${checkItemName}"
export const DUMMY_ANOMALIES: AnomalyInfo[] = [
  {
    rowId: "P001-v1.0-rev0-寸法測定",
    reason: "規格値に対して測定値が上限を超過。測定機器の校正を確認済みだが再測定でも同値のため異常と判定。",
    detectedAt: "2026/02/10 08:30",
  },
  {
    rowId: "P001-v2.0-rev0-重量測定",
    reason: "N数2のうち1件が未入力（測定不能）。測定環境の再確認が必要。",
    detectedAt: "2026/02/12 08:30",
  },
  {
    rowId: "P001-v2.0-rev1-色彩検査",
    reason: "追加改版の色彩検査で終段階N数1がNG判定。許容範囲との乖離を確認中。",
    detectedAt: "2026/02/16 11:00",
  },
  {
    rowId: "P001-v3.0-rev0-寸法測定",
    reason: "修正前の測定値が規格下限を下回った。ロット全数の再測定が必要。",
    detectedAt: "2026/02/14 10:15",
  },
  {
    rowId: "P002-v1.0-rev0-耐久性試験",
    reason: "試験実施中に装置エラーが発生し測定を中断。再試験待ち。N数2のうち1件がNG。",
    detectedAt: "2026/02/08 14:00",
  },
  {
    rowId: "P002-v2.0-rev0-強度試験",
    reason: "引張強度が規格値320N/mm²に対して287N/mm²と下回った。熱処理工程の温度プロファイルを確認中。",
    detectedAt: "2026/02/12 09:00",
  },
  {
    rowId: "P002-v2.0-rev1-硬度測定",
    reason: "追加検査項目（硬度測定）でNG判定。規格値との乖離を確認中。",
    detectedAt: "2026/02/16 13:30",
  },
  {
    rowId: "P003-v1.0-rev0-外観検査",
    reason: "表面に微細なクラックを検出（長さ約0.3mm、2箇所）。目視確認済み。使用不可ロットとして隔離済み。",
    detectedAt: "2026/02/07 08:00",
  },
  {
    rowId: "P004-v2.0-rev0-重量測定",
    reason: "規定値に対して測定値が上限超過（初段階N1・終段階N1でNG）。金型摩耗による寸法変化と推定。金型交換を検討中。",
    detectedAt: "2026/02/17 09:45",
  },
  {
    rowId: "P004-v2.1-rev0-表面粗さ",
    reason: "研磨工程後のRa値が規格値1.6μmに対して超過。研磨砥粒の粒度番号を見直し中。",
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
        const checkMethodType = ii % 2 === 0 ? "合否判定" : "数値入力";
        const isPassFail = checkMethodType === "合否判定";
        const ul = parseFloat((10 + id * 0.1).toFixed(1));
        const ll = parseFloat((5 + id * 0.05).toFixed(1));
        rows.push({
          id: id++,
          processCode: pc,
          masterVersion: ver,
          checkItemName: item,
          checkMethodType,
          nCount: [1, 3, 5, 10][ii % 4],
          judgementCriteria: isPassFail
            ? ["図面（外観基準）", "限度見本", "検査基準書A", "外観検査規格書"][ii % 4]
            : ["寸法一覧表", "図面（公差表示）", "製品仕様書", "検査基準書B"][ii % 4],
          measurementMethod: isPassFail
            ? ["目視", "ゲージ", "投影機", "限度見本"][ii % 4]
            : ["ノギス", "マイクロメータ", "測長機", "引張試験機", "電子天秤", "硬度計"][ii % 6],
          specUpperLimit: isPassFail ? null : ul,
          specLowerLimit: isPassFail ? null : ll,
          specCenterValue: isPassFail ? null : parseFloat(((ul + ll) / 2).toFixed(2)),
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
