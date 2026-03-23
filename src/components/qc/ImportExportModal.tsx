import { useState, useRef } from "react";
import type { QcViewMode, QcMasterItem, QcResultItem } from "../../types/qc";

type Tab = "import" | "export";

type Props = {
  viewMode: QcViewMode;
  initialTab: Tab;
  masterData: QcMasterItem[];
  resultData: QcResultItem[];
  onClose: () => void;
  onImport: (file: File) => void;
};

// マスタ列定義
const MASTER_COLS: { key: keyof QcMasterItem; label: string }[] = [
  { key: "processCode", label: "工程コード" },
  { key: "masterVersion", label: "バージョン" },
  { key: "checkItemName", label: "検査項目名" },
  { key: "checkMethodType", label: "検査方法種類" },
  { key: "nCount", label: "N数" },
  { key: "judgementCriteria", label: "判定基準" },
  { key: "measurementMethod", label: "測定方法" },
  { key: "specUpperLimit", label: "規格上限値" },
  { key: "specLowerLimit", label: "規格下限値" },
  { key: "specCenterValue", label: "規格中央値" },
  { key: "referenceFile", label: "参照ファイル名" },
  { key: "updatedAt", label: "更新日時" },
];

// 実績列定義
const RESULT_COLS: { key: keyof QcResultItem; label: string }[] = [
  { key: "processCode", label: "工程コード" },
  { key: "masterVersion", label: "バージョン" },
  { key: "checkItemName", label: "検査項目名" },
  { key: "measuredValue", label: "測定値" },
  { key: "judgement", label: "判定" },
  { key: "inspectedAt", label: "検査日時" },
  { key: "inspectedBy", label: "検査者" },
  { key: "registeredAt", label: "登録日時" },
  { key: "registeredBy", label: "登録者" },
];

function toCsv(headers: string[], rows: string[][]): string {
  const escape = (v: string) => (v.includes(",") || v.includes('"') || v.includes("\n") ? `"${v.replace(/"/g, '""')}"` : v);
  return [headers, ...rows].map((r) => r.map(escape).join(",")).join("\r\n");
}

function downloadCsv(filename: string, csv: string) {
  const bom = "\uFEFF";
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ImportExportModal({ viewMode, initialTab, masterData, resultData, onClose, onImport }: Props) {
  const [tab, setTab] = useState<Tab>(viewMode === "result" ? "export" : initialTab);

  // インポート
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // エクスポート
  const isMaster = viewMode === "master";
  const cols = isMaster ? MASTER_COLS : RESULT_COLS;
  const [selectedCols, setSelectedCols] = useState<Set<string>>(new Set(cols.map((c) => c.key)));
  const [exported, setExported] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleImportExec = () => {
    if (!selectedFile) return;
    onImport(selectedFile);
    onClose();
  };

  const toggleCol = (key: string) => {
    setSelectedCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedCols.size === cols.length) setSelectedCols(new Set());
    else setSelectedCols(new Set(cols.map((c) => c.key)));
  };

  const handleExport = () => {
    const activeCols = cols.filter((c) => selectedCols.has(c.key));
    const headers = activeCols.map((c) => c.label);
    let rows: string[][];
    if (isMaster) {
      rows = masterData.map((item) =>
        activeCols.map((c) => {
          const v = item[c.key as keyof QcMasterItem];
          return v == null ? "" : String(v);
        }),
      );
    } else {
      rows = resultData.map((item) =>
        activeCols.map((c) => {
          const v = item[c.key as keyof QcResultItem];
          return v == null ? "" : String(v);
        }),
      );
    }
    const now = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const name = isMaster ? `検査項目マスタ_${now}.csv` : `実績データ_${now}.csv`;
    downloadCsv(name, toCsv(headers, rows));
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  return (
    <div className="ov" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ie-modal">
        {/* ヘッダー */}
        <div className="ie-hdr">
          <span>{isMaster ? "検査項目マスタ" : "実績データ"} — インポート / エクスポート</span>
          <button className="ie-cls" onClick={onClose}>✕</button>
        </div>

        {/* タブ */}
        <div className="ie-tabs">
          {viewMode === "master" && (
            <button
              className={`ie-tab${tab === "import" ? " ie-tab-act" : ""}`}
              onClick={() => setTab("import")}
            >
              ⬆ インポート
            </button>
          )}
          <button
            className={`ie-tab${tab === "export" ? " ie-tab-act" : ""}`}
            onClick={() => setTab("export")}
          >
            ⬇ エクスポート
          </button>
        </div>

        {/* インポートタブ */}
        {tab === "import" && (
          <div className="ie-body">
            <p className="ie-desc">CSV ファイルを選択してインポートします。</p>
            <div
              className={`ie-drop${dragOver ? " ie-drop-over" : ""}${selectedFile ? " ie-drop-has" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                style={{ display: "none" }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
              />
              {selectedFile ? (
                <>
                  <span className="ie-drop-ico">📄</span>
                  <span className="ie-drop-fname">{selectedFile.name}</span>
                  <span className="ie-drop-sub">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                  <button
                    className="ie-drop-clr"
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  >
                    ✕ クリア
                  </button>
                </>
              ) : (
                <>
                  <span className="ie-drop-ico">📂</span>
                  <span className="ie-drop-txt">クリックまたはドラッグ＆ドロップでファイルを選択</span>
                  <span className="ie-drop-sub">対応形式：CSV / Excel (.csv, .xlsx, .xls)</span>
                </>
              )}
            </div>
            <div className="ie-foot">
              <button className="ie-btn-cancel" onClick={onClose}>キャンセル</button>
              <button
                className="ie-btn-exec"
                disabled={!selectedFile}
                onClick={handleImportExec}
              >
                インポート実行
              </button>
            </div>
          </div>
        )}

        {/* エクスポートタブ */}
        {tab === "export" && (
          <div className="ie-body">
            <p className="ie-desc">エクスポートする列を選択してください。</p>
            <div className="ie-col-head">
              <label className="ie-chk-lbl">
                <input type="checkbox" checked={selectedCols.size === cols.length} onChange={toggleAll} />
                すべて選択
              </label>
              <span className="ie-col-cnt">{selectedCols.size} / {cols.length} 列選択中</span>
            </div>
            <div className="ie-col-grid">
              {cols.map((c) => (
                <label key={c.key} className="ie-chk-lbl">
                  <input
                    type="checkbox"
                    checked={selectedCols.has(c.key)}
                    onChange={() => toggleCol(c.key)}
                  />
                  {c.label}
                </label>
              ))}
            </div>
            <div className="ie-foot">
              <button className="ie-btn-cancel" onClick={onClose}>キャンセル</button>
              <button
                className={`ie-btn-exec${exported ? " ie-btn-done" : ""}`}
                disabled={selectedCols.size === 0}
                onClick={handleExport}
              >
                {exported ? "✓ エクスポート完了" : "CSVエクスポート"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
