import { useState, useMemo, useEffect } from "react";
import type { QcResultItem, QcGroupOverall, AnomalyInfo, QcMasterItem } from "../../types/qc";

type ResultTableProps = {
  rows: QcResultItem[];
  anomalies?: AnomalyInfo[];
  overallResults: QcGroupOverall[];
  masters?: QcMasterItem[];
};

interface RowRenderInfo {
  row: QcResultItem;
  groupKey: string;
  stageKey: string;       // processCode-masterVersion-revisionNumber-checkItemName-stage
  groupSpan: number | null;       // for process-group border detection only
  itemGroupSpan: number | null;   // rowSpan for 工程, 検査項目名, 測定方法, 規格値
  stageSpan: number | null;       // rowSpan for 総合結果, 検査段階, 検査方法
}

function toAnomalyKey(r: QcResultItem) {
  return `${r.processCode}-${r.masterVersion}-rev${r.revisionNumber}-${r.checkItemName}`;
}

export default function ResultTable({
  rows,
  anomalies = [],
  overallResults,
  masters = [],
}: ResultTableProps) {
  const [hoveredAnomalyId, setHoveredAnomalyId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [modPopupId, setModPopupId] = useState<string | null>(null);

  const anomalyMap = useMemo(
    () => new Map(anomalies.map((a) => [a.rowId, a])),
    [anomalies],
  );

  const overallMap = useMemo(() => {
    const m = new Map<string, QcGroupOverall>();
    overallResults.forEach((o) => {
      m.set(`${o.processCode}-${o.masterVersion}-${o.revisionNumber}`, o);
    });
    return m;
  }, [overallResults]);

  const masterMap = useMemo(() => {
    const m = new Map<string, QcMasterItem>();
    masters.forEach((master) => {
      m.set(`${master.processCode}-${master.masterVersion}-${master.checkItemName}`, master);
    });
    return m;
  }, [masters]);

  // 検査項目×段階グループ別総合結果（工程×バージョン×改版×検査項目×検査段階 単位）
  const itemStageOverallMap = useMemo(() => {
    const m = new Map<string, "OK" | "NG" | "notAdopted">();
    const stageGroups = new Map<string, { rowList: QcResultItem[]; gk: string }>();
    rows.forEach((r) => {
      const gk = `${r.processCode}-${r.masterVersion}-${r.revisionNumber}`;
      const sk = `${gk}-${r.checkItemName}-${r.inspectionStage}`;
      if (!stageGroups.has(sk)) stageGroups.set(sk, { rowList: [], gk });
      stageGroups.get(sk)!.rowList.push(r);
    });
    stageGroups.forEach(({ rowList, gk }, sk) => {
      const group = overallMap.get(gk);
      if (group?.isAdopted === false) {
        m.set(sk, "notAdopted");
      } else if (rowList.some((r) => r.judgement === "NG")) {
        m.set(sk, "NG");
      } else {
        m.set(sk, "OK");
      }
    });
    return m;
  }, [rows, overallMap]);

  useEffect(() => {
    const handleOutsideClick = () => setModPopupId(null);
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // rowSpan情報：工程グループ → 検査項目 → 段階 → N数
  const renderInfos = useMemo((): RowRenderInfo[] => {
    const groupCounts = new Map<string, number>();
    const itemGroupCounts = new Map<string, number>();
    const stageCounts = new Map<string, number>();

    rows.forEach((r) => {
      const gk = `${r.processCode}-${r.masterVersion}-${r.revisionNumber}`;
      const ik = `${gk}-${r.checkItemName}`;
      const sk = `${ik}-${r.inspectionStage}`;
      groupCounts.set(gk, (groupCounts.get(gk) || 0) + 1);
      itemGroupCounts.set(ik, (itemGroupCounts.get(ik) || 0) + 1);
      stageCounts.set(sk, (stageCounts.get(sk) || 0) + 1);
    });

    const seenGroups = new Set<string>();
    const seenItemGroups = new Set<string>();
    const seenStages = new Set<string>();

    return rows.map((r) => {
      const gk = `${r.processCode}-${r.masterVersion}-${r.revisionNumber}`;
      const ik = `${gk}-${r.checkItemName}`;
      const sk = `${ik}-${r.inspectionStage}`;

      const isFirstGroup = !seenGroups.has(gk);
      const isFirstItemGroup = !seenItemGroups.has(ik);
      const isFirstStage = !seenStages.has(sk);

      seenGroups.add(gk);
      seenItemGroups.add(ik);
      seenStages.add(sk);

      return {
        row: r,
        groupKey: gk,
        stageKey: sk,
        groupSpan: isFirstGroup ? (groupCounts.get(gk) ?? 1) : null,
        itemGroupSpan: isFirstItemGroup ? (itemGroupCounts.get(ik) ?? 1) : null,
        stageSpan: isFirstStage ? (stageCounts.get(sk) ?? 1) : null,
      };
    });
  }, [rows]);

  return (
    <table>
      <thead>
        <tr>
          <th rowSpan={2} style={{ verticalAlign: "middle" }}>
            工程 / バージョン / 改版
          </th>
          <th rowSpan={2} style={{ verticalAlign: "middle", textAlign: "center", minWidth: 72 }}>
            総合結果
          </th>
          <th rowSpan={2} style={{ verticalAlign: "middle", textAlign: "center", minWidth: 60 }}>
            機番
          </th>
          <th rowSpan={2} style={{ verticalAlign: "middle" }}>
            検査項目名
          </th>
          <th rowSpan={2} style={{ verticalAlign: "middle", textAlign: "center", minWidth: 56 }}>
            検査段階
          </th>
          <th rowSpan={2} style={{ verticalAlign: "middle", textAlign: "center", minWidth: 56 }}>
            検査方法
          </th>
          <th rowSpan={2} style={{ verticalAlign: "middle", textAlign: "center", minWidth: 80 }}>
            測定方法
          </th>
          <th rowSpan={2} style={{ verticalAlign: "middle", textAlign: "center", minWidth: 64 }}>
            規格上限
          </th>
          <th rowSpan={2} style={{ verticalAlign: "middle", textAlign: "center", minWidth: 64 }}>
            規格下限
          </th>
          <th rowSpan={2} style={{ verticalAlign: "middle", textAlign: "center", minWidth: 44 }}>
            N数
          </th>
          <th rowSpan={2} style={{ verticalAlign: "middle", minWidth: 80, textAlign: "center" }}>
            変更種別
          </th>
          <th rowSpan={2} style={{ verticalAlign: "middle", textAlign: "center", minWidth: 80 }}>
            測定値
          </th>
          <th rowSpan={2} style={{ verticalAlign: "middle", textAlign: "center", width: 64, minWidth: 64 }}>
            判定
          </th>
          <th
            colSpan={2}
            className="th-inspect"
            style={{ textAlign: "center", borderBottom: "1px solid #c4d3e8" }}
          >
            検査
          </th>
          <th
            colSpan={2}
            className="th-reg"
            style={{ textAlign: "center", borderBottom: "1px solid #c4d3e8" }}
          >
            登録
          </th>
        </tr>
        <tr>
          <th className="th-inspect">検査日</th>
          <th className="th-inspect">検査者</th>
          <th className="th-reg">登録日</th>
          <th className="th-reg">登録者</th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={17} className="no-data">
              データがありません
            </td>
          </tr>
        ) : (
          renderInfos.map(({ row: r, stageKey, groupSpan, itemGroupSpan, stageSpan }, rowIdx) => {
            const rowId = String(r.id);
            const anomalyKey = toAnomalyKey(r);
            const anomaly = anomalyMap.get(anomalyKey);
            const hasAnomaly = r.judgement === "NG" && !!anomaly;
            const isModPopupOpen = modPopupId === rowId;
            const stageOverall = itemStageOverallMap.get(stageKey);
            const showGroupBorder = groupSpan !== null && rowIdx > 0;
            const masterItem = masterMap.get(`${r.processCode}-${r.masterVersion}-${r.checkItemName}`);

            return (
              <tr
                key={r.id}
                className={`${r.isAdded ? "row-added" : r.isUpdated ? "row-updated" : "row-normal"}${showGroupBorder ? " group-separator" : ""}`}
              >
                {/* 工程 / バージョン / 改版 — 検査項目 rowSpan */}
                {itemGroupSpan !== null && (
                  <td rowSpan={itemGroupSpan} className="group-cell">
                    <span style={{ fontWeight: "bold" }}>{r.processCode}</span>
                    {" "}<span style={{ fontWeight: "normal" }}>{r.masterVersion}</span>
                    {" "}<span style={{ fontWeight: "normal" }}>改版{r.revisionNumber}</span>
                  </td>
                )}

                {/* 総合結果 — 検査項目×段階 rowSpan */}
                {stageSpan !== null && (
                  <td rowSpan={stageSpan} className="overall-cell">
                    {stageOverall === "notAdopted" ? (
                      <span style={{ color: "#999", fontSize: 11 }}>対象外</span>
                    ) : stageOverall === "OK" ? (
                      <span className="bdg-ok">OK</span>
                    ) : stageOverall === "NG" ? (
                      <span className="bdg-ng">NG</span>
                    ) : (
                      <span style={{ color: "#999" }}>—</span>
                    )}
                  </td>
                )}

                {/* 機番 — 検査項目×段階グループの先頭行のみ表示 */}
                {stageSpan !== null && (
                  <td rowSpan={stageSpan} style={{ textAlign: "center", fontSize: 12, color: "#333", verticalAlign: "top", paddingTop: 6 }}>
                    {r.machineNumber}
                  </td>
                )}

                {/* 検査項目名 — 検査項目 rowSpan */}
                {itemGroupSpan !== null && (
                  <td rowSpan={itemGroupSpan} className="item-cell">
                    {r.checkItemName}
                  </td>
                )}

                {/* 検査段階 — 検査項目×段階 rowSpan */}
                {stageSpan !== null && (
                  <td rowSpan={stageSpan} className="stage-cell">
                    {r.inspectionStage}
                  </td>
                )}

                {/* 検査方法 — 検査項目×段階 rowSpan */}
                {stageSpan !== null && (
                  <td rowSpan={stageSpan} className="stage-cell" style={{ textAlign: "center" }}>
                    {r.checkMethodType === "数値入力" ? "数値" : "合否"}
                  </td>
                )}

                {/* 測定方法 — 検査項目 rowSpan */}
                {itemGroupSpan !== null && (
                  <td rowSpan={itemGroupSpan} style={{ textAlign: "center", fontSize: 12, color: "#555", minWidth: 80, verticalAlign: "middle" }}>
                    {masterItem?.measurementMethod || "—"}
                  </td>
                )}

                {/* 規格上限 — 検査項目 rowSpan */}
                {itemGroupSpan !== null && (
                  <td rowSpan={itemGroupSpan} style={{ textAlign: "center", fontSize: 12, color: "#555", minWidth: 64, verticalAlign: "middle" }}>
                    {masterItem?.specUpperLimit != null ? `${masterItem.specUpperLimit} mm` : "—"}
                  </td>
                )}

                {/* 規格下限 — 検査項目 rowSpan */}
                {itemGroupSpan !== null && (
                  <td rowSpan={itemGroupSpan} style={{ textAlign: "center", fontSize: 12, color: "#555", minWidth: 64, verticalAlign: "middle" }}>
                    {masterItem?.specLowerLimit != null ? `${masterItem.specLowerLimit} mm` : "—"}
                  </td>
                )}

                {/* N数 */}
                <td className="n-idx-cell">N{r.nIndex}</td>

                {/* 変更種別 */}
                <td
                  style={{ textAlign: "center" }}
                  className={
                    r.isUpdated
                      ? `change-type-cell${isModPopupOpen ? " mod-badge-btn-active" : ""}`
                      : undefined
                  }
                  title={r.isUpdated ? "クリックして修正前の情報を確認" : undefined}
                  onClick={
                    r.isUpdated
                      ? (e) => {
                          e.stopPropagation();
                          setModPopupId(isModPopupOpen ? null : rowId);
                        }
                      : undefined
                  }
                >
                  {r.isAdded && <span className="badge-added">追加</span>}
                  {r.isUpdated && (
                    <>
                      <span className="badge-updated">修正</span>
                      {isModPopupOpen && r.originalData && (
                        <div
                          className="mod-history-popup"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="mod-history-hdr">📋 修正前の情報</div>

                          {/* 修正情報 */}
                          <div className="mod-history-section">修正情報</div>
                          <table className="mod-history-tbl">
                            <tbody>
                              <tr>
                                <th>修正日時</th>
                                <td>{r.originalData.modifiedAt}</td>
                              </tr>
                              <tr>
                                <th>修正者</th>
                                <td>{r.originalData.modifiedBy}</td>
                              </tr>
                            </tbody>
                          </table>

                          {/* 修正前の検査項目情報 */}
                          <div className="mod-history-section">修正前の検査項目情報</div>
                          <table className="mod-history-tbl">
                            <tbody>
                              <tr>
                                <th>検査項目名</th>
                                <td>{r.checkItemName}</td>
                              </tr>
                              <tr>
                                <th>検査方法</th>
                                <td>{r.checkMethodType}</td>
                              </tr>
                              <tr>
                                <th>測定方法</th>
                                <td>{masterItem?.measurementMethod || "—"}</td>
                              </tr>
                              <tr>
                                <th>規格上限</th>
                                <td>{masterItem?.specUpperLimit != null ? `${masterItem.specUpperLimit} mm` : "—"}</td>
                              </tr>
                              <tr>
                                <th>規格下限</th>
                                <td>{masterItem?.specLowerLimit != null ? `${masterItem.specLowerLimit} mm` : "—"}</td>
                              </tr>
                            </tbody>
                          </table>

                          {/* 修正前の検査結果 */}
                          <div className="mod-history-section">修正前の検査結果</div>
                          <table className="mod-history-tbl">
                            <tbody>
                              <tr>
                                <th>測定値</th>
                                <td>{r.originalData.measuredValue}</td>
                              </tr>
                              <tr>
                                <th>判定</th>
                                <td>
                                  <span
                                    className={
                                      r.originalData.judgement === "OK"
                                        ? "bdg-ok"
                                        : r.originalData.judgement === "NG"
                                          ? "bdg-ng"
                                          : "bdg-na"
                                    }
                                  >
                                    {r.originalData.judgement}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <th>検査日</th>
                                <td>{r.originalData.inspectedAt}</td>
                              </tr>
                              <tr>
                                <th>検査者</th>
                                <td>{r.originalData.inspectedBy}</td>
                              </tr>
                              <tr>
                                <th>登録日</th>
                                <td>{r.originalData.registeredAt}</td>
                              </tr>
                              <tr>
                                <th>登録者</th>
                                <td>{r.originalData.registeredBy}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  )}
                  {!r.isAdded && !r.isUpdated && <span style={{ color: "#ccc" }}>—</span>}
                </td>

                {/* 測定値 */}
                <td style={{ textAlign: "center" }}>
                  {r.measuredValue === "—" ? (
                    <span style={{ color: "#ccc" }}>—</span>
                  ) : (
                    r.measuredValue
                  )}
                </td>

                {/* 判定（異常インジケーター付き） */}
                <td style={{ textAlign: "center", width: 64, minWidth: 64 }}>
                  <span
                    className={
                      r.judgement === "OK"
                        ? "bdg-ok"
                        : r.judgement === "NG"
                          ? "bdg-ng"
                          : "bdg-na"
                    }
                  >
                    {r.judgement}
                  </span>
                  {hasAnomaly && (
                    <span
                      className="anomaly-trigger"
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltipPos({ top: rect.bottom + 6, left: rect.left });
                        setHoveredAnomalyId(rowId);
                      }}
                      onMouseLeave={() => setHoveredAnomalyId(null)}
                    >
                      !
                      {hoveredAnomalyId === rowId && (
                        <div
                          className="anomaly-popup"
                          style={{ top: tooltipPos.top, left: tooltipPos.left }}
                        >
                          <div className="anomaly-popup-hdr">⚠ 異常理由</div>
                          <div className="anomaly-popup-reason">{anomaly!.reason}</div>
                          {anomaly!.detectedAt && (
                            <div className="anomaly-popup-time">
                              検知日時：{anomaly!.detectedAt}
                            </div>
                          )}
                        </div>
                      )}
                    </span>
                  )}
                </td>

                {/* 検査日・検査者 */}
                <td style={{ color: "#555" }}>{r.inspectedAt}</td>
                <td>{r.inspectedBy}</td>

                {/* 登録日・登録者 */}
                <td style={{ color: "#555" }}>{r.registeredAt}</td>
                <td>{r.registeredBy}</td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
