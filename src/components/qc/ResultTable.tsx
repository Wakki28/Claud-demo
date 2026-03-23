import type { QcResultItem } from "../../types/qc";

type ResultTableProps = {
  rows: QcResultItem[];
};

export default function ResultTable({ rows }: ResultTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th rowSpan={2} style={{ verticalAlign: "middle" }}>
            工程 / バージョン
          </th>
          <th rowSpan={2} style={{ verticalAlign: "middle" }}>
            検査項目名
          </th>
          <th rowSpan={2} style={{ verticalAlign: "middle", minWidth: 80, textAlign: "center" }}>
            変更種別
          </th>
          <th rowSpan={2} style={{ verticalAlign: "middle" }}>
            測定値
          </th>
          <th rowSpan={2} style={{ verticalAlign: "middle" }}>
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
          <th className="th-reg">検査項目登録日</th>
          <th className="th-reg">登録者</th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={9} className="no-data">
              データがありません
            </td>
          </tr>
        ) : (
          rows.map((r) => (
            <tr
              key={r.id}
              className={r.isAdded ? "row-added" : r.isUpdated ? "row-updated" : "row-normal"}
            >
              <td>
                <span className="ver-badge">
                  {r.processCode}-{r.masterVersion}
                </span>
              </td>
              <td>{r.checkItemName}</td>
              <td style={{ textAlign: "center" }}>
                {r.isAdded && <span className="badge-added">追加</span>}
                {r.isUpdated && <span className="badge-updated">修正</span>}
                {!r.isAdded && !r.isUpdated && <span style={{ color: "#ccc" }}>—</span>}
              </td>
              <td>{r.measuredValue}</td>
              <td>
                <span
                  className={
                    r.judgement === "OK" ? "bdg-ok" : r.judgement === "NG" ? "bdg-ng" : "bdg-na"
                  }
                >
                  {r.judgement}
                </span>
              </td>
              <td style={{ color: "#555" }}>{r.inspectedAt}</td>
              <td>{r.inspectedBy}</td>
              <td style={{ color: "#555" }}>{r.registeredAt}</td>
              <td>{r.registeredBy}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
