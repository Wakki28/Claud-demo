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

          <span className="srch-lbl" style={{ marginLeft: 6 }}>判定</span>
          <select
            className="srch-sel"
            value={rSrch.judgement}
            onChange={(e) => onRSrchChange({ ...rSrch, judgement: e.target.value })}
          >
            <option value="">すべて</option>
            <option value="OK">OK</option>
            <option value="NG">NG</option>
          </select>

          <span className="srch-lbl" style={{ marginLeft: 6 }}>変更種別</span>
          <select
            className="srch-sel"
            style={{ minWidth: 110 }}
            value={rSrch.changeType}
            onChange={(e) => onRSrchChange({ ...rSrch, changeType: e.target.value })}
          >
            <option value="">すべて</option>
            <option value="added">追加検査項目</option>
            <option value="updated">修正済み項目</option>
            <option value="normal">通常</option>
          </select>
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
