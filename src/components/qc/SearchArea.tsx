import type { QcViewMode, ResultSearchState, MasterSearchState } from "../../types/qc";

type SearchAreaProps = {
  viewMode: QcViewMode;
  rSrch: ResultSearchState;
  mSrch: MasterSearchState;
  onRSrchChange: (val: ResultSearchState) => void;
  onMSrchChange: (val: MasterSearchState) => void;
  onSearch: () => void;
  onClear: () => void;
};

export default function SearchArea({
  viewMode,
  rSrch,
  mSrch,
  onRSrchChange,
  onMSrchChange,
  onSearch,
  onClear,
}: SearchAreaProps) {
  return (
    <div className="srch-wrap">
      {viewMode === "result" && (
        <div className="srch-grid">
          <span className="srch-lbl">工程コード</span>
          <input
            className="srch-inp"
            style={{ minWidth: 80 }}
            value={rSrch.processCode}
            onChange={(e) => onRSrchChange({ ...rSrch, processCode: e.target.value })}
          />

          <span className="srch-lbl" style={{ marginLeft: 6 }}>バージョン</span>
          <input
            className="srch-inp"
            style={{ minWidth: 80 }}
            value={rSrch.masterVersion}
            onChange={(e) => onRSrchChange({ ...rSrch, masterVersion: e.target.value })}
          />

          <span className="srch-lbl" style={{ marginLeft: 6 }}>検査項目名</span>
          <input
            className="srch-inp"
            style={{ width: 120 }}
            value={rSrch.checkItemName}
            onChange={(e) => onRSrchChange({ ...rSrch, checkItemName: e.target.value })}
          />

          <span className="srch-lbl" style={{ marginLeft: 6 }}>総合結果</span>
          <select
            className="srch-sel"
            value={rSrch.overallResult}
            onChange={(e) => onRSrchChange({ ...rSrch, overallResult: e.target.value })}
          >
            <option value="">すべて</option>
            <option value="OK">OK</option>
            <option value="NG">NG</option>
            <option value="未登録">未登録</option>
          </select>

          <span className="srch-lbl" style={{ marginLeft: 6 }}>検査段階</span>
          <select
            className="srch-sel"
            value={rSrch.inspectionStage}
            onChange={(e) => onRSrchChange({ ...rSrch, inspectionStage: e.target.value })}
          >
            <option value="">すべて</option>
            <option value="初">初</option>
            <option value="中">中</option>
            <option value="終">終</option>
          </select>

          <span className="srch-lbl" style={{ marginLeft: 6 }}>採用状態</span>
          <select
            className="srch-sel"
            value={rSrch.adoptionStatus}
            onChange={(e) => onRSrchChange({ ...rSrch, adoptionStatus: e.target.value })}
          >
            <option value="">すべて</option>
            <option value="adopted">採用のみ</option>
            <option value="notAdopted">不採用のみ</option>
          </select>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginLeft: 10,
              fontSize: 12,
              color: "#555",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <input
              type="checkbox"
              checked={rSrch.changedOnly}
              onChange={(e) => onRSrchChange({ ...rSrch, changedOnly: e.target.checked })}
              style={{ cursor: "pointer", accentColor: "#2d6db5" }}
            />
            変更ありのみ表示
          </label>
        </div>
      )}

      {viewMode === "master" && (
        <div className="srch-grid">
          <span className="srch-lbl">工程コード</span>
          <input
            className="srch-inp"
            style={{ minWidth: 80 }}
            value={mSrch.processCode}
            onChange={(e) => onMSrchChange({ ...mSrch, processCode: e.target.value })}
          />

          <span className="srch-lbl" style={{ marginLeft: 6 }}>バージョン</span>
          <input
            className="srch-inp"
            style={{ minWidth: 80 }}
            value={mSrch.masterVersion}
            onChange={(e) => onMSrchChange({ ...mSrch, masterVersion: e.target.value })}
          />

          <span className="srch-lbl" style={{ marginLeft: 6 }}>検査項目名</span>
          <input
            className="srch-inp"
            style={{ width: 140 }}
            value={mSrch.checkItemName}
            onChange={(e) => onMSrchChange({ ...mSrch, checkItemName: e.target.value })}
          />

          <span className="srch-lbl" style={{ marginLeft: 6 }}>検査方法</span>
          <select
            className="srch-sel"
            value={mSrch.checkMethodType}
            onChange={(e) => onMSrchChange({ ...mSrch, checkMethodType: e.target.value })}
          >
            <option value="">すべて</option>
            <option value="合否判定">合否判定</option>
            <option value="数値入力">数値入力</option>
          </select>
        </div>
      )}

      <div className="srch-acts">
        <button className="btn-clr" onClick={onClear}>
          クリア
        </button>
        <button className="btn-srch" onClick={onSearch}>
          検索
        </button>
      </div>
    </div>
  );
}
