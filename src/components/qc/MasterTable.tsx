import type { QcMasterItem, PreviewFile } from "../../types/qc";

type MasterTableProps = {
  rows: QcMasterItem[];
  newIds: Set<number>;
  editedIds: Set<number>;
  selectedIds: Set<number>;
  onSelectionChange: (ids: Set<number>) => void;
  onPreview: (file: PreviewFile) => void;
};

export default function MasterTable({
  rows,
  newIds,
  editedIds,
  selectedIds,
  onSelectionChange,
  onPreview,
}: MasterTableProps) {
  const handleRowCheck = (id: number, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) next.add(id);
    else next.delete(id);
    onSelectionChange(next);
  };

  const allChecked = rows.length > 0 && rows.every((r) => selectedIds.has(r.id));
  const someChecked = rows.some((r) => selectedIds.has(r.id));

  const handleHeaderCheck = (checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) rows.forEach((r) => next.add(r.id));
    else rows.forEach((r) => next.delete(r.id));
    onSelectionChange(next);
  };

  return (
    <table>
      <thead>
        <tr>
          <th className="tbl-cb">
            <input
              type="checkbox"
              checked={allChecked}
              ref={(el) => { if (el) el.indeterminate = !allChecked && someChecked; }}
              onChange={(e) => handleHeaderCheck(e.target.checked)}
            />
          </th>
          <th>工程CD</th>
          <th>バージョン</th>
          <th>検査項目名</th>
          <th>検査方法</th>
          <th>N数</th>
          <th>判定基準</th>
          <th>測定方法</th>
          <th>規格上限</th>
          <th>規格下限</th>
          <th>規格中央値</th>
          <th>参照ファイル</th>
          <th>更新日時</th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={13} className="no-data">
              データがありません
            </td>
          </tr>
        ) : (
          rows.map((m, idx) => {
            const isNew = newIds.has(m.id);
            const isEdited = !isNew && editedIds.has(m.id);
            const isGFirst =
              idx === 0 ||
              rows[idx - 1].processCode !== m.processCode ||
              rows[idx - 1].masterVersion !== m.masterVersion;
            const isSelected = selectedIds.has(m.id);

            return (
              <tr
                key={m.id}
                className={`${isGFirst ? "group-first" : ""} ${isNew ? "row-new" : isEdited ? "row-edited" : ""}`.trim()}
                onClick={() => handleRowCheck(m.id, !isSelected)}
                style={{ cursor: "pointer" }}
              >
                <td className="tbl-cb" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleRowCheck(m.id, e.target.checked)}
                  />
                </td>
                <td>
                  {m.processCode}
                  {isNew && <span className="tag-new">NEW</span>}
                  {isEdited && <span className="tag-edited">編集済</span>}
                </td>
                <td>{m.masterVersion}</td>
                <td>{m.checkItemName}</td>
                <td>{m.checkMethodType}</td>
                <td style={{ textAlign: "center" }}>{m.nCount}</td>
                <td>{m.judgementCriteria}</td>
                <td>{m.measurementMethod}</td>
                <td style={{ textAlign: "right" }}>{m.specUpperLimit ?? "-"}</td>
                <td style={{ textAlign: "right" }}>{m.specLowerLimit ?? "-"}</td>
                <td style={{ textAlign: "right" }}>{m.specCenterValue ?? "-"}</td>
                <td>
                  {m.referenceFile ? (
                    <span
                      className="file-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreview({ name: m.referenceFile, data: m.referenceFileData });
                      }}
                    >
                      📎 {m.referenceFile}
                    </span>
                  ) : (
                    <span className="file-dash">-</span>
                  )}
                </td>
                <td style={{ color: "#888", fontSize: 11 }}>{m.updatedAt}</td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
