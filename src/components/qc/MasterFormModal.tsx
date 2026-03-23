import { useRef, useState, useCallback } from "react";
import type { QcMasterItem, ModalState } from "../../types/qc";
import { PROCESS_CODES, PROCESS_VERSION_MAP, EMPTY_MASTER, mkDate } from "../../data/qcData";

type MasterFormModalProps = {
  modal: NonNullable<ModalState>;
  onClose: () => void;
  onSave: (item: QcMasterItem, mode: "create" | "edit") => void;
};

const calcCenter = (u: number | null, l: number | null): number | null =>
  u !== null && l !== null ? parseFloat(((u + l) / 2).toFixed(2)) : null;

const isImage = (n: string) => /\.(png|jpg|jpeg|gif|webp)$/i.test(n);
const isPdf = (n: string) => /\.pdf$/i.test(n);

export default function MasterFormModal({ modal, onClose, onSave }: MasterFormModalProps) {
  const [form, setForm] = useState<Omit<QcMasterItem, "id">>(
    modal.data ? { ...modal.data } : { ...EMPTY_MASTER, updatedAt: mkDate(0) },
  );
  const [centerManual, setCenterManual] = useState(modal.mode === "edit");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const availableVersions = form.processCode
    ? (PROCESS_VERSION_MAP[form.processCode] ?? [])
    : [];

  const sf = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSpecChange = (
    key: "specUpperLimit" | "specLowerLimit",
    val: number | null,
  ) => {
    setForm((prev) => {
      const next = { ...prev, [key]: val };
      if (!centerManual) next.specCenterValue = calcCenter(next.specUpperLimit, next.specLowerLimit);
      return next;
    });
  };

  const processFile = useCallback((f: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = ev.target?.result as string;
      setForm((p) => ({ ...p, referenceFile: f.name, referenceFileData: data }));
    };
    reader.readAsDataURL(f);
  }, []);

  const handleSave = () => {
    if (!form.processCode || !form.masterVersion || !form.checkItemName) {
      alert("工程コード・バージョン・検査項目名は必須です");
      return;
    }
    const id = modal.mode === "create" ? Date.now() : (modal.data?.id ?? Date.now());
    onSave({ ...form, id, updatedAt: mkDate(0) }, modal.mode);
  };

  return (
    <div className="ov" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="m-hdr">
          検査項目マスタ　{modal.mode === "create" ? "新登録" : "編集"}
        </div>

        <div className="m-body">
          {/* 基本情報 */}
          <div className="m-sec">
            <span className="m-sec-ico">◇</span>基本情報
          </div>
          <div className="m-row2">
            <div className="m-field">
              <div className="m-lbl">
                工程コード<span className="m-req">*</span>
              </div>
              <select
                className="m-sel"
                value={form.processCode}
                onChange={(e) => {
                  sf("processCode", e.target.value);
                  sf("masterVersion", "");
                }}
              >
                <option value="">－選択してください－</option>
                {PROCESS_CODES.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
            <div className="m-field">
              <div className="m-lbl">
                マスターバージョン<span className="m-req">*</span>
              </div>
              <select
                className="m-sel"
                value={form.masterVersion}
                onChange={(e) => sf("masterVersion", e.target.value)}
                disabled={!form.processCode}
              >
                <option value="">
                  {form.processCode ? "－選択してください－" : "工程コードを先に選択"}
                </option>
                {availableVersions.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 検査情報 */}
          <div className="m-sec">
            <span className="m-sec-ico">◇</span>検査情報
          </div>
          <div className="m-field">
            <div className="m-lbl">
              検査項目名<span className="m-req">*</span>
            </div>
            <input
              type="text"
              className="m-inp"
              value={form.checkItemName}
              placeholder="例：ローラー回転"
              onChange={(e) => sf("checkItemName", e.target.value)}
            />
          </div>
          <div className="m-row2">
            <div className="m-field">
              <div className="m-lbl">
                検査方法種類<span className="m-req">*</span>
              </div>
              <input
                type="text"
                className="m-inp"
                value={form.checkMethodType}
                placeholder="例：目視・ノギス"
                onChange={(e) => sf("checkMethodType", e.target.value)}
              />
            </div>
            <div className="m-field">
              <div className="m-lbl">
                N数<span className="m-req">*</span>
              </div>
              <input
                type="number"
                className="m-num"
                min={1}
                value={form.nCount}
                onChange={(e) => sf("nCount", Number(e.target.value))}
              />
            </div>
          </div>

          {/* 検査内容 */}
          <div className="m-sec">
            <span className="m-sec-ico">◇</span>検査内容
          </div>
          <div className="m-field">
            <div className="m-lbl">
              判定基準<span className="m-req">*</span>
            </div>
            <input
              type="text"
              className="m-inp"
              value={form.judgementCriteria}
              placeholder="例：合否基準A"
              onChange={(e) => sf("judgementCriteria", e.target.value)}
            />
          </div>
          <div className="m-field">
            <div className="m-lbl">
              測定方法<span className="m-req">*</span>
            </div>
            <input
              type="text"
              className="m-inp"
              value={form.measurementMethod}
              placeholder="例：直接測定"
              onChange={(e) => sf("measurementMethod", e.target.value)}
            />
          </div>

          {/* 規格設定 */}
          <div className="m-sec">
            <span className="m-sec-ico">◇</span>規格設定
          </div>
          <div className="m-row3">
            <div className="m-field">
              <div className="m-lbl">
                規格上限値<span className="m-req">*</span>
              </div>
              <input
                type="number"
                className="m-num"
                value={form.specUpperLimit ?? ""}
                placeholder="例：50.00"
                onChange={(e) =>
                  handleSpecChange(
                    "specUpperLimit",
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
              />
            </div>
            <div className="m-field">
              <div className="m-lbl">
                規格下限値<span className="m-req">*</span>
              </div>
              <input
                type="number"
                className="m-num"
                value={form.specLowerLimit ?? ""}
                placeholder="例：30.00"
                onChange={(e) =>
                  handleSpecChange(
                    "specLowerLimit",
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
              />
            </div>
            <div className="m-field">
              <div className="m-lbl">
                規格中央値
                {!centerManual &&
                  form.specUpperLimit !== null &&
                  form.specLowerLimit !== null && (
                    <span className="m-hint">自動計算</span>
                  )}
              </div>
              <div className="m-auto-val">
                <input
                  type="number"
                  className="m-num"
                  style={{ flex: 1 }}
                  value={form.specCenterValue ?? ""}
                  placeholder="例：40.00"
                  onChange={(e) => {
                    setCenterManual(true);
                    sf(
                      "specCenterValue",
                      e.target.value === "" ? null : Number(e.target.value),
                    );
                  }}
                />
                {centerManual && (
                  <button
                    style={{
                      background: "none",
                      border: "1px solid #afc0d2",
                      borderRadius: 3,
                      padding: "2px 6px",
                      fontSize: 11,
                      color: "#2d6db5",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => {
                      setCenterManual(false);
                      setForm((p) => ({
                        ...p,
                        specCenterValue: calcCenter(p.specUpperLimit, p.specLowerLimit),
                      }));
                    }}
                  >
                    再計算
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 添付ファイル */}
          <div className="m-sec">
            <span className="m-sec-ico">◇</span>添付ファイル
          </div>
          <div className="m-field">
            <div className="m-lbl">検査参照ファイル</div>
            <div
              className={`upload-area${dragOver ? " drag" : ""}${form.referenceFile ? " has-file" : ""}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const f = e.dataTransfer.files?.[0];
                if (f) processFile(f);
              }}
            >
              {form.referenceFile ? (
                <>
                  <div className="upload-icon">📎</div>
                  <div className="upload-fname">{form.referenceFile}</div>
                  <button
                    className="upload-clr"
                    onClick={(e) => {
                      e.stopPropagation();
                      sf("referenceFile", "");
                      sf("referenceFileData", null);
                    }}
                  >
                    ×
                  </button>
                </>
              ) : (
                <>
                  <div className="upload-icon">📂</div>
                  <div className="upload-txt">
                    <strong>クリックしてファイルを選択</strong>
                    <br />
                    またはここにドラッグ＆ドロップ
                  </div>
                  <div className="upload-sub">対応形式：画像（PNG / JPG）、PDF</div>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.pdf"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) processFile(f);
              }}
            />
            {form.referenceFileData && isImage(form.referenceFile) && (
              <img src={form.referenceFileData} alt="preview" className="prev-thumb" />
            )}
            {form.referenceFileData && isPdf(form.referenceFile) && (
              <button
                style={{
                  marginTop: 6,
                  background: "none",
                  border: "1px solid #afc0d2",
                  borderRadius: 3,
                  padding: "3px 10px",
                  fontSize: 12,
                  color: "#2d6db5",
                  cursor: "pointer",
                }}
              >
                📄 PDFをプレビュー
              </button>
            )}
          </div>
        </div>

        {/* フッター */}
        <div
          style={{
            padding: "12px 20px 16px",
            borderTop: "1px solid #e4e8f0",
            display: "flex",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <button
            style={{
              background: "#fff",
              color: "#555",
              border: "1px solid #afc0d2",
              borderRadius: 3,
              padding: "7px 28px",
              fontSize: 14,
              cursor: "pointer",
              minWidth: 110,
            }}
            onClick={onClose}
          >
            キャンセル
          </button>
          <button
            style={{
              background: "#2d6db5",
              color: "#fff",
              border: "none",
              borderRadius: 3,
              padding: "7px 28px",
              fontSize: 14,
              cursor: "pointer",
              fontWeight: 500,
              minWidth: 110,
            }}
            onClick={handleSave}
          >
            {modal.mode === "create" ? "登録" : "更新"}
          </button>
        </div>
      </div>
    </div>
  );
}
