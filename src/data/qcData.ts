import type { QcResultItem, QcMasterItem, QcGroupOverall, AnomalyInfo, OriginalResultData } from "../types/qc";

// ── マスタ定義 ───────────────────────────────────────────
export const PROCESS_VERSION_MAP: Record<string, string[]> = {
  P001: ["v1.0", "v2.0"],
  P002: ["v1.0"],
  P003: ["v2.0"],
  P004: ["v2.0"],
};

// 工程単位の機番マスタ（工程内の全検査で同一機番を使用）
export const MACHINE_NUMBER_MAP: Record<string, string> = {
  P001: "M001",
  P002: "M002",
  P003: "M003",
  P004: "M004",
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
export const mkDate = (daysAgo: number, hour = 9, minute = 30): string => {
  const d = new Date(2026, 1, 20 - daysAgo, hour, minute);
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

// 工程ごとの検査段階ルール
// P002 は終段階のみ（1回検査パターン）、それ以外はitemIdx % 3 === 0 → 初・中1・終、他 → 初・終
export const getExpectedStages = (pc: string, itemIdx: number): string[] => {
  if (pc === "P002") return ["終"];
  return itemIdx % 3 === 0 ? ["初", "中1", "終"] : ["初", "終"];
};

// ── 検査項目マスタダミーデータ ────────────────────────────
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
// 採用方針：全4工程のうち1工程（25%）に不採用バージョンを持たせる（20〜30%目標）
// 業務シナリオ：
//   P001 v1.0 rev0（不採用）: 初段階のみ、N数3件で中断（改版のため未完了）
//   P001 v2.0 rev0（採用）  : 全段階・全N数完了
//   P002 v1.0 rev0（採用）  : 終段階のみ（1回検査パターン）、全N数完了
//   P003 v2.0 rev0（採用）  : 全段階・全N数完了
//   P004 v2.0 rev0（採用）  : 全段階・全N数完了（一部修正履歴あり）
export const DUMMY_RESULTS: QcResultItem[] = (() => {
  const rows: QcResultItem[] = [];
  let nextId = 1;

  let seed = 42;
  const rand = (): number => {
    seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  const addRow = (
    pc: string, ver: string, rev: number,
    item: string, stage: string, n: number,
    val: string, judge: "OK" | "NG" | "-",
    daysAgo: number,
    insHour: number,
    inspectedBy: string,
    registeredBy: string,
    regMinute: number,
    machineNumber: string,
    checkMethodType: string,
    isAdded: boolean, isUpdated: boolean,
    orig?: OriginalResultData,
  ): void => {
    const id = nextId++;
    const r: QcResultItem = {
      id,
      processCode: pc,
      masterVersion: ver,
      revisionNumber: rev,
      machineNumber,
      checkItemName: item,
      inspectionStage: stage,
      checkMethodType,
      nIndex: n,
      measuredValue: val,
      judgement: judge,
      inspectedAt: mkDate(daysAgo + 1, insHour, (n - 1) * 3),
      inspectedBy,
      registeredAt: mkDate(daysAgo, 10, regMinute),
      registeredBy,
      isAdded,
      isUpdated,
    };
    if (orig) r.originalData = orig;
    rows.push(r);
  };

  const genValue = (
    isPassFail: boolean,
    ul: number, ll: number, center: number, range: number,
  ): { val: string; judge: "OK" | "NG" | "-" } => {
    const r1 = rand();
    const r2 = rand();
    if (isPassFail) {
      return { val: "—", judge: r1 < 0.85 ? "OK" : "NG" };
    }
    if (r1 < 0.1) {
      const offset = range * (0.05 + r2 * 0.12);
      const raw = r2 > 0.5 ? ul + offset : ll - offset;
      return { val: `${raw.toFixed(2)} mm`, judge: "NG" };
    }
    const raw = parseFloat((center + (r1 - 0.5) * range * 0.7).toFixed(2));
    return { val: `${raw} mm`, judge: raw >= ll && raw <= ul ? "OK" : "NG" };
  };

  // 指定した段階・N数上限でデータを生成する汎用関数
  const genItemsStaged = (
    pc: string, ver: string, rev: number,
    items: string[], baseDaysAgo: number,
    filterStages?: string[],  // 省略時は全段階
    maxN?: number,            // 省略時は全N数
    isAdded = false, isUpdated = false,
  ): void => {
    items.forEach((itemName, itemIdx) => {
      const master = DUMMY_MASTERS.find(
        (m) => m.processCode === pc && m.masterVersion === ver && m.checkItemName === itemName,
      );
      const isPassFail = !master || master.checkMethodType === "合否判定";
      const nCount = master?.nCount ?? 3;
      const ul = master?.specUpperLimit ?? 10.0;
      const ll = master?.specLowerLimit ?? 5.0;
      const center = master?.specCenterValue ?? 7.5;
      const range = ul - ll;

      const allStages = getExpectedStages(pc, itemIdx);
      const stages = filterStages
        ? allStages.filter((s) => filterStages.includes(s))
        : allStages;
      const daysAgo = baseDaysAgo - (itemIdx % 3);
      const effectiveN = maxN != null ? Math.min(nCount, maxN) : nCount;

      // 工程単位の機番・検査方法を確定
      const machineNumber = MACHINE_NUMBER_MAP[pc] ?? "";
      const checkMethodType = isPassFail ? "合否判定" : "数値入力";

      stages.forEach((stage, stageIdx) => {
        // 検査項目×検査段階の単位で検査者・登録者を1人に固定する
        const inspector = INS[(itemIdx * 7 + stageIdx * 3) % INS.length];
        const registrant = REG[(itemIdx * 5 + stageIdx * 2) % REG.length];
        // 登録日時のステップ（1〜5分）も検査項目×段階で固定
        const regMinuteStep = (itemIdx * 3 + stageIdx * 2) % 5 + 1;
        // 検査時刻の基準時（段階ごとに8・9・10時台）
        const insHour = 8 + stageIdx % 3;
        // 修正履歴用の元担当者も固定
        const origInspector = INS[(itemIdx * 11 + stageIdx * 5 + 1) % INS.length];
        const origRegistrant = REG[(itemIdx * 7 + stageIdx * 3 + 1) % REG.length];

        for (let n = 1; n <= effectiveN; n++) {
          const { val, judge } = genValue(isPassFail, ul, ll, center, range);
          // N1が基準時刻、N2以降は数分ずつ加算
          const regMinute = (n - 1) * regMinuteStep;

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
              daysAgo + 5, origInspector,
              daysAgo + 4, origRegistrant,
              daysAgo + 3, origRegistrant,
            );
          }

          addRow(pc, ver, rev, itemName, stage, n, val, judge, daysAgo, insHour, inspector, registrant, regMinute, machineNumber, checkMethodType, isAdded, isUpdated, orig);
        }
      });
    });
  };

  // 全段階・全N数を生成するショートハンド
  const genItems = (
    pc: string, ver: string, rev: number,
    items: string[], baseDaysAgo: number,
    isAdded = false, isUpdated = false,
  ): void => genItemsStaged(pc, ver, rev, items, baseDaysAgo, undefined, undefined, isAdded, isUpdated);

  // ── P001: v1.0 rev0（不採用）→ 初段階のみ N数3件で中断 ──
  genItemsStaged("P001", "v1.0", 0, ITEMS_PER_PROCESS.P001, 18, ["初"], 3);

  // ── P001: v2.0 rev0（採用）→ 先頭1件を「追加」、残りは通常 ──────
  genItems("P001", "v2.0", 0, ITEMS_PER_PROCESS.P001.slice(0, 1), 8, true, false);
  genItems("P001", "v2.0", 0, ITEMS_PER_PROCESS.P001.slice(1), 8, false, false);

  // ── P002: v1.0 rev0（採用）→ 先頭2件を「修正」、残りは通常 ──
  genItems("P002", "v1.0", 0, ITEMS_PER_PROCESS.P002.slice(0, 2), 12, false, true);
  genItems("P002", "v1.0", 0, ITEMS_PER_PROCESS.P002.slice(2), 12, false, false);

  // ── P003: v2.0 rev0（採用）→ 先頭1件を「追加」、残りは通常 ──────
  genItems("P003", "v2.0", 0, ITEMS_PER_PROCESS.P003.slice(0, 1), 6, true, false);
  genItems("P003", "v2.0", 0, ITEMS_PER_PROCESS.P003.slice(1), 6, false, false);

  // ── P004: v2.0 rev0（採用）→ 先頭2件を「修正」、残りは通常 ──
  genItems("P004", "v2.0", 0, ITEMS_PER_PROCESS.P004.slice(0, 2), 5, false, true);
  genItems("P004", "v2.0", 0, ITEMS_PER_PROCESS.P004.slice(2), 5, false, false);

  return rows;
})();

// ── 総合結果グループ情報（採用状態のみ管理・overallResultは自動計算）────
// 採用状態グループ定義
// P001のみ不採用バージョンあり（4工程中1工程 = 25%）
export const DUMMY_OVERALL_RESULTS: QcGroupOverall[] = [
  { processCode: "P001", masterVersion: "v1.0", revisionNumber: 0, isAdopted: false },
  { processCode: "P001", masterVersion: "v2.0", revisionNumber: 0, isAdopted: true  },
  { processCode: "P002", masterVersion: "v1.0", revisionNumber: 0, isAdopted: true  },
  { processCode: "P003", masterVersion: "v2.0", revisionNumber: 0, isAdopted: true  },
  { processCode: "P004", masterVersion: "v2.0", revisionNumber: 0, isAdopted: true  },
];

// ── 異常理由ダミーデータ ──────────────────────────────────
export const DUMMY_ANOMALIES: AnomalyInfo[] = [
  {
    rowId: "P001-v2.0-rev0-寸法測定",
    reason: "規格値に対して測定値が上限を超過。測定機器の校正を確認済みだが再測定でも同値のため異常と判定。",
    detectedAt: "2026/02/12 08:30",
  },
  {
    rowId: "P001-v2.0-rev0-重量測定",
    reason: "N数2のうち1件が未入力（測定不能）。測定環境の再確認が必要。",
    detectedAt: "2026/02/13 10:00",
  },
  {
    rowId: "P002-v1.0-rev0-耐久性試験",
    reason: "試験実施中に装置エラーが発生し測定を中断。再試験待ち。",
    detectedAt: "2026/02/08 14:00",
  },
  {
    rowId: "P002-v1.0-rev0-強度試験",
    reason: "引張強度が規格値320N/mm²に対して下回った。熱処理工程の温度プロファイルを確認中。",
    detectedAt: "2026/02/09 09:00",
  },
  {
    rowId: "P003-v2.0-rev0-色彩検査",
    reason: "色彩検査で終段階N数1がNG判定。許容範囲との乖離を確認中。",
    detectedAt: "2026/02/14 11:00",
  },
  {
    rowId: "P004-v2.0-rev0-重量測定",
    reason: "規定値に対して測定値が上限超過。金型摩耗による寸法変化と推定。金型交換を検討中。",
    detectedAt: "2026/02/17 09:45",
  },
  {
    rowId: "P004-v2.0-rev0-表面粗さ",
    reason: "研磨工程後のRa値が規格値1.6μmに対して超過。研磨砥粒の粒度番号を見直し中。",
    detectedAt: "2026/02/18 11:00",
  },
];
