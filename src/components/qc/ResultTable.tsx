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
  stageGroupKey: string;
  groupSpan: number | null;
  stageGroupSpan: number | null;
  itemSpan: number | null;
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
  const [pinnedId, setPinnedId] = useState<string | null>(null);
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

  // 段階グループ別総合結果（工程×バージョン×改版×検査段階 単位）
  const stageOverallMap = useMemo(() => {
    const m = new Map<string, "OK" | "NG" | "notAdopted">();
    const stageGroups = new Map<string, { rowList: QcResultItem[]; gk: string }>();
    rows.forEach((r) => {
      const gk = `${r.processCode}-${r.masterVersion}-${r.revisionNumber}`;
      const sgk = `${gk}-${r.inspectionStage}`;
      if (!stageGroups.has(sgk)) stageGroups.set(sgk, { rowList: [], gk });
      stageGroups.get(sgk)!.rowList.push(r);
    });
    stageGroups.forEach(({ rowList, gk }, sgk) => {
      const group = overallMap.get(gk);
      if (group?.isAdopted === false) {
        m.set(sgk, "notAdopted");
      } else if (rowList.some((r) => r.judgement === "NG")) {
        m.set(sgk, "NG");
      } else {
        m.set(sgk, "OK");
      }
    });
    return m;
  }, [rows, overallMap]);

  useEffect(() => {
    const handleOutsideClick = () => {
      setPinnedId(null);
      setModPopupId(null);
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // rowSpan情報：工程グループ → 段階グループ → 検査項目 → N数
  const renderInfos = useMemo((): RowRenderInfo[] => {
    const groupCounts = new Map<string, number>();
    const stageGroupCounts = new Map<string, number>();
    const itemCounts = new Map<string, number>();

    rows.forEach((r) => {
      const gk = `${r.processCode}-${r.masterVersion}-${r.revisionNumber}`;
      const sgk = `${gk}-${r.inspectionStage}`;
      const ik = `${sgk}-${r.checkItemName}`;
      groupCounts.set(gk, (groupCounts.get(gk) || 0) + 1);
      stageGroupCounts.set(sgk, (stageGroupCounts.get(sgk) || 0) + 1);
      itemCounts.set(ik, (itemCounts.get(ik) || 0) + 1);
    });

    const seenGroups = new Set<string>();
    const seenStageGroups = new Set<string>();
    const seenItems = new Set<string>();

    return rows.map((r) => {
      const gk = `${r.processCode}-${r.masterVersion}-${r.revisionNumber}`;
      const sgk = `${gk}-${r.inspectionStage}`;
      const ik = `${sgk}-${r.checkItemName}`;

      const isFirstGroup = !seenGroups.has(gk);
      const isFirstStageGroup = !seenStageGroups.has(sgk);
      const isFirstItem = !seenItems.has(ik);

      seenGroups.add(gk);
      seenStageGroups.add(sgk);
      seenItems.add(ik);

      return {
        row: r,
        groupKey: gk,
        stageGroupKey: sgk,
        groupSpan: isFirstGroup ? (groupCounts.get(gk) ?? 1) : null,
        stageGroupSpan: isFirstStageGroup ? (stageGroupCounts.get(sgk) ?? 1) : null,
        itemSpan: isFirstItem ? (itemCounts.get(ik) ?? 1) : null,
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
          renderInfos.map(({ row: r, stageGroupKey, groupSpan, stageGroupSpan, itemSpan }, rowIdx) => {
            const rowId = String(r.id);
            const anomalyKey = toAnomalyKey(r);
            const anomaly = anomalyMap.get(anomalyKey);
            const hasAnomaly = r.judgement === "NG" && !!anomaly;
            const isActive = pinnedId === rowId;
            const isModPopupOpen = modPopupId === rowId;
            const stageOverall = stageOverallMap.get(stageGroupKey);
            const showGroupBorder = groupSpan !== null && rowIdx > 0;
            const showStageBorder = stageGroupSpan !== null && !showGroupBorder && rowIdx > 0;
            const masterItem = masterMap.get(`${r.processCode}-${r.masterVersion}-${r.checkItemName}`);

            return (
              <tr
                key={r.id}
                className={`${r.isAdded ? "row-added" : r.isUpdated ? "row-updated" : "row-normal"}${showGroupBorder ? " group-separator" : showStageBorder ? " stage-separator" : ""}`}
              >
                {/* 工程 / バージョン / 改版 — グループ rowSpan・横並び表示 */}
                {groupSpan !== null && (
                  <td rowSpan={groupSpan} className="group-cell">
                    <span style={{ fontWeight: "bold" }}>{r.processCode}</span>
                    {" "}<span style={{ fontWeight: "normal" }}>{r.masterVersion}</span>
                    {" "}<span style={{ fontWeight: "normal" }}>改版{r.revisionNumber}</span>
                  </td>
                )}

                {/* 総合結果 — 段階グループ rowSpan */}
                {stageGroupSpan !== null && (
                  <td rowSpan={stageGroupSpan} className="overall-cell">
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

                {/* 機番 — 全行に表示 */}
                <td style={{ textAlign: "center", fontSize: 12, color: "#333" }}>
                  {r.machineNumber}
                </td>

                {/* 検査項目名 — 段階グループ内の項目 rowSpan */}
                {itemSpan !== null && (
                  <td rowSpan={itemSpan} className="item-cell">
                    {r.checkItemName}
                  </td>
                )}

                {/* 検査段階 — 段階グループ rowSpan */}
                {stageGroupSpan !== null && (
                  <td rowSpan={stageGroupSpan} className="stage-cell">
                    {r.inspectionStage}
                  </td>
                )}

                {/* 検査方法 — 項目 rowSpan（色分け・太字なし） */}
                {itemSpan !== null && (
                  <td rowSpan={itemSpan} className="stage-cell" style={{ textAlign: "center" }}>
                    {r.checkMethodType === "数値入力" ? "数値" : "合否"}
                  </td>
                )}

                {/* 測定方法 — 項目 rowSpan */}
                {itemSpan !== null && (
                  <td rowSpan={itemSpan} style={{ textAlign: "center", fontSize: 12, color: "#555", minWidth: 80, verticalAlign: "middle" }}>
                    {masterItem?.measurementMethod || "—"}
                  </td>
                )}

                {/* 規格上限 — 項目 rowSpan */}
                {itemSpan !== null && (
                  <td rowSpan={itemSpan} style={{ textAlign: "center", fontSize: 12, color: "#555", minWidth: 64, verticalAlign: "middle" }}>
                    {masterItem?.specUpperLimit != null ? masterItem.specUpperLimit : "—"}
                  </td>
                )}

                {/* 規格下限 — 項目 rowSpan */}
                {itemSpan !== null && (
                  <td rowSpan={itemSpan} style={{ textAlign: "center", fontSize: 12, color: "#555", minWidth: 64, verticalAlign: "middle" }}>
                    {masterItem?.specLowerLimit != null ? masterItem.specLowerLimit : "—"}
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
                          <div className="mod-history-section">修正前の検査情報</div>
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
                      className={`anomaly-trigger${isActive ? " anomaly-trigger-active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPinnedId(pinnedId === rowId ? null : rowId);
                      }}
                    >
                      !
                      {isActive && (
                        <div
                          className="anomaly-popup"
                          onClick={(e) => e.stopPropagation()}
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
