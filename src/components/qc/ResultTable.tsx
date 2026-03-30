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
  groupSpan: number | null;
  itemSpan: number | null;
  stageSpan: number | null;
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

  useEffect(() => {
    const handleOutsideClick = () => {
      setPinnedId(null);
      setModPopupId(null);
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // rowSpan情報を事前計算（ページ内の rows に基づく）
  const renderInfos = useMemo((): RowRenderInfo[] => {
    const groupCounts = new Map<string, number>();
    const itemCounts = new Map<string, number>();
    const stageCounts = new Map<string, number>();

    rows.forEach((r) => {
      const gk = `${r.processCode}-${r.masterVersion}-${r.revisionNumber}`;
      const ik = `${gk}-${r.checkItemName}`;
      const sk = `${ik}-${r.inspectionStage}`;
      groupCounts.set(gk, (groupCounts.get(gk) || 0) + 1);
      itemCounts.set(ik, (itemCounts.get(ik) || 0) + 1);
      stageCounts.set(sk, (stageCounts.get(sk) || 0) + 1);
    });

    const seenGroups = new Set<string>();
    const seenItems = new Set<string>();
    const seenStages = new Set<string>();

    return rows.map((r) => {
      const gk = `${r.processCode}-${r.masterVersion}-${r.revisionNumber}`;
      const ik = `${gk}-${r.checkItemName}`;
      const sk = `${ik}-${r.inspectionStage}`;

      const isFirstGroup = !seenGroups.has(gk);
      const isFirstItem = !seenItems.has(ik);
      const isFirstStage = !seenStages.has(sk);

      seenGroups.add(gk);
      seenItems.add(ik);
      seenStages.add(sk);

      return {
        row: r,
        groupKey: gk,
        groupSpan: isFirstGroup ? (groupCounts.get(gk) ?? 1) : null,
        itemSpan: isFirstItem ? (itemCounts.get(ik) ?? 1) : null,
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
          <th rowSpan={2} style={{ verticalAlign: "middle" }}>
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
          renderInfos.map(({ row: r, groupKey, groupSpan, itemSpan, stageSpan }, rowIdx) => {
            const rowId = String(r.id);
            const anomalyKey = toAnomalyKey(r);
            const anomaly = anomalyMap.get(anomalyKey);
            const hasAnomaly = r.judgement === "NG" && !!anomaly;
            const isActive = pinnedId === rowId;
            const isModPopupOpen = modPopupId === rowId;
            const overall = overallMap.get(groupKey);
            const showGroupBorder = groupSpan !== null && rowIdx > 0;
            const masterItem = masterMap.get(`${r.processCode}-${r.masterVersion}-${r.checkItemName}`);

            return (
              <tr
                key={r.id}
                className={`${r.isAdded ? "row-added" : r.isUpdated ? "row-updated" : "row-normal"}${showGroupBorder ? " group-separator" : ""}`}
              >
                {/* 工程 / バージョン / 改版 — グループ rowSpan */}
                {groupSpan !== null && (
                  <td rowSpan={groupSpan} className="group-cell">
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: "bold", color: "#111" }}>{r.processCode}</span>
                      <span style={{ fontSize: 14, fontWeight: "normal", color: "#333" }}>{r.masterVersion}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>改版{r.revisionNumber}</div>
                  </td>
                )}

                {/* 総合結果 — グループ rowSpan（自動判定・編集不可） */}
                {groupSpan !== null && (
                  <td rowSpan={groupSpan} className="overall-cell">
                    {overall?.isAdopted === false ? (
                      <span style={{ color: "#999", fontSize: 11 }}>対象外</span>
                    ) : overall?.overallResult === "OK" ? (
                      <span className="bdg-ok">OK</span>
                    ) : overall?.overallResult === "NG" ? (
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

                {/* 検査項目名 — 項目 rowSpan */}
                {itemSpan !== null && (
                  <td rowSpan={itemSpan} className="item-cell">
                    {r.checkItemName}
                  </td>
                )}

                {/* 検査段階 — 段階 rowSpan */}
                {stageSpan !== null && (
                  <td rowSpan={stageSpan} className="stage-cell">
                    {r.inspectionStage}
                  </td>
                )}

                {/* 検査方法 — 段階 rowSpan */}
                {stageSpan !== null && (
                  <td rowSpan={stageSpan} className="stage-cell" style={{ textAlign: "center" }}>
                    {r.checkMethodType === "数値入力" ? (
                      <span style={{ color: "#2d6db5", fontSize: 11, fontWeight: 600 }}>数値</span>
                    ) : (
                      <span style={{ color: "#888", fontSize: 11, fontWeight: 600 }}>合否</span>
                    )}
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
                <td>{r.measuredValue}</td>

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
