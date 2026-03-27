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

// 工程ごとの検査項目（5〜10件）
export const ITEMS_PER_PROCESS: Record<string, string[]> = {
  P001: ["外観検査", "寸法測定", "重量測定", "色彩検査", "表面粗さ", "形状検査", "塗膜厚さ"],
  P002: ["強度試験", "耐久性試験", "表面粗さ", "外観検査", "寸法測定", "重量測定", "硬度測定", "圧力試験"],
  P003: ["重量測定", "外観検査", "色彩検査", "寸法測定", "形状検査", "塗膜厚さ"],
  P004: ["引張試験", "硬度測定", "外観検査", "耐久性試験", "寸法測定", "表面粗さ", "重量測定", "耐熱試験", "摩耗試験"],
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

// ── 検査項目マスタダミーデータ ────────────────────────────
// DUMMY_RESULTSより前に定義（実績生成時にマスタ参照するため）
export const DUMMY_MASTERS: QcMasterItem[] = (() => {
  const rows: QcMasterItem[] = [];
  let id = 1;
  PROCESS_CODES.forEach((pc) => {
    (PROCESS_VERSION_MAP[pc] ?? []).forEach((ver) => {
      (ITEMS_PER_PROCESS[pc] ?? []).forEach((item, ii) => {
        // 奇数インデックス：数値入力、偶数インデックス：合否判定（約半数ずつ混在）
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
          // N数：1〜10のランダムな現実的な値
          nCount: [3, 7, 5, 2, 8, 4, 6, 10, 1][ii % 9],
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

// ── 実績ダミーデータ ──────────────────────────────────────
// 正しい階層構造：工程 > バージョン > 改版 > 検査項目 > 検査段階 > 検査結果(N数)
export const DUMMY_RESULTS: QcResultItem[] = (() => {
  const rows: QcResultItem[] = [];
  let nextId = 1;

  // 決定論的疑似乱数（ビルドごとに値が変わらないよう線形合同法を使用）
  let seed = 42;
  const rand = (): number => {
    seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  // 検査段階：itemIdx % 3 === 0 のアイテムは「初・中1・終」、それ以外は「初・終」
  const getStages = (itemIdx: number): string[] =>
    itemIdx % 3 === 0 ? ["初", "中1", "終"] : ["初", "終"];

  const addRow = (
    pc: string, ver: string, rev: number,
    item: string, stage: string, n: number,
    val: string, judge: "OK" | "NG" | "-",
    daysAgo: number,
    isAdded: boolean, isUpdated: boolean,
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

  // 検査項目グループを生成する共通関数
  // isUpdated=true の場合は全行に修正前データ（originalData）を付与
  const genItems = (
    pc: string, ver: string, rev: number,
    items: string[], baseDaysAgo: number,
    isAdded = false, isUpdated = false,
  ): void => {
    items.forEach((itemName, itemIdx) => {
      // マスタを参照して検査方法・N数・規格値を取得
      const master = DUMMY_MASTERS.find(
        (m) => m.processCode === pc && m.masterVersion === ver && m.checkItemName === itemName,
      );
      const isPassFail = !master || master.checkMethodType === "合否判定";
      const nCount = master?.nCount ?? 3;
      const ul = master?.specUpperLimit ?? 10.0;
      const ll = master?.specLowerLimit ?? 5.0;
      const center = master?.specCenterValue ?? 7.5;
      const range = ul - ll;

      const stages = getStages(itemIdx);
      const daysAgo = baseDaysAgo - (itemIdx % 3);

      stages.forEach((stage) => {
        for (let n = 1; n <= nCount; n++) {
          const r1 = rand();
          const r2 = rand();

          let val: string;
          let judge: "OK" | "NG" | "-";

          if (isPassFail) {
            // 合否判定パターン：測定値は「—」、判定はOK/NGを直接入力（約85%OK）
            val = "—";
            judge = r1 < 0.85 ? "OK" : "NG";
          } else {
            // 数値入力パターン：測定値を規格値と比較して自動判定
            if (r1 < 0.1) {
              // 約10%の確率でNG（規格外）
              const offset = range * (0.05 + r2 * 0.12);
              const raw = r2 > 0.5 ? ul + offset : ll - offset;
              val = `${raw.toFixed(2)} mm`;
              judge = "NG";
            } else {
              // 規格内（中央値付近に集中）
              const raw = parseFloat((center + (r1 - 0.5) * range * 0.7).toFixed(2));
              val = `${raw} mm`;
              judge = raw >= ll && raw <= ul ? "OK" : "NG";
            }
          }

          // isUpdated=true の行には修正前データを付与
          let orig: OriginalResultData | undefined;
          if (isUpdated) {
            const or = rand();
            let origVal: string;
            let origJudge: "OK" | "NG" | "-";
            if (isPassFail) {
              origVal = "—";
              origJudge = or < 0.45 ? "NG" : "OK";
            } else {
              const origRaw = parseFloat((center + (or - 0.5) * range * 0.9).toFixed(2));
              origVal = `${origRaw} mm`;
              origJudge = origRaw >= ll && origRaw <= ul ? "OK" : "NG";
            }
            orig = mkOrig(
              origVal, origJudge,
              daysAgo + 5, INS[(nextId + 1) % 4],
              daysAgo + 4, REG[nextId % 3],
              daysAgo + 3, REG[(nextId + 1) % 3],
            );
          }

          addRow(pc, ver, rev, itemName, stage, n, val, judge, daysAgo, isAdded, isUpdated, orig);
        }
      });
    });
  };

  // ── 改版0：工程の全検査項目を生成 ────────────────────────
  genItems("P001", "v1.0", 0, ITEMS_PER_PROCESS.P001, 12);
  genItems("P001", "v2.0", 0, ITEMS_PER_PROCESS.P001, 9);
  genItems("P001", "v3.0", 0, ITEMS_PER_PROCESS.P001, 7);
  genItems("P002", "v1.0", 0, ITEMS_PER_PROCESS.P002, 14);
  genItems("P002", "v2.0", 0, ITEMS_PER_PROCESS.P002, 8);
  genItems("P003", "v1.0", 0, ITEMS_PER_PROCESS.P003, 15);
  genItems("P004", "v1.0", 0, ITEMS_PER_PROCESS.P004, 10);
  genItems("P004", "v2.0", 0, ITEMS_PER_PROCESS.P004, 6);

  // ── 改版1：追加検査項目（isAdded=true） ──────────────────
  genItems("P001", "v2.0", 1, ["色彩検査", "形状検査"],  4,  true);
  genItems("P002", "v2.0", 1, ["硬度測定", "圧力試験"],  5,  true);
  genItems("P003", "v1.0", 1, ["色彩検査", "塗膜厚さ"],  10, true);
  genItems("P004", "v2.0", 1, ["耐熱試験", "摩耗試験"],  3,  true);

  // ── P004 v2.1 改版0：修正あり（isUpdated=true、originalData付き） ─
  genItems("P004", "v2.1", 0, ["摩耗試験", "表面粗さ"], 4, false, true);

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
