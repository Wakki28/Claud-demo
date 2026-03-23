import type { QcMasterItem, PreviewFile } from "../../types/qc";

type MasterTableProps = {
  rows: QcMasterItem[];
  newIds: Set<number>;
  editedIds: Set<number>;
  onEdit: (item: QcMasterItem) => void;
  onDelete: (item: QcMasterItem) => void;
  onPreview: (file: PreviewFile) => void;
};

export default function MasterTable({
  rows,
  newIds,
  editedIds,
  onEdit,
  onDelete,
  onPreview,
}: MasterTableProps) {
  return (
    <table>
      <thead>
        <tr>
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
          <th>操作</th>
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

            return (
              <tr
                key={m.id}
                className={`${isGFirst ? "group-first" : ""} ${isNew ? "row-new" : isEdited ? "row-edited" : ""}`.trim()}
              >
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
                      onClick={() =>
                        onPreview({ name: m.referenceFile, data: m.referenceFileData })
                      }
                    >
                      📎 {m.referenceFile}
                    </span>
                  ) : (
                    <span className="file-dash">-</span>
                  )}
                </td>
                <td style={{ color: "#888", fontSize: 11 }}>{m.updatedAt}</td>
                <td>
                  <button className="btn-edt" onClick={() => onEdit(m)}>
                    編集
                  </button>
                  <button className="btn-dlt" onClick={() => onDelete(m)}>
                    削除
                  </button>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
