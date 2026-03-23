import { useState, useMemo } from "react";
import type {
  QcViewMode,
  QcPageSize,
  QcMasterItem,
  ResultSearchState,
  MasterSearchState,
  ModalState,
  PreviewFile,
} from "../types/qc";
import {
  PROCESS_VERSION_MAP,
  ALL_VERSIONS,
  CAT_OPTIONS,
  NAME_MAP,
  DUMMY_RESULTS,
  DUMMY_MASTERS,
  DUMMY_ANOMALIES,
  mkDate,
} from "../data/qcData";
import { QC_CSS } from "../components/qc/QcStyles";
import AppHeader from "../components/qc/AppHeader";
import SelectorBar from "../components/qc/SelectorBar";
import EmptyState from "../components/qc/EmptyState";
import SearchArea from "../components/qc/SearchArea";
import ResultTable from "../components/qc/ResultTable";
import MasterTable from "../components/qc/MasterTable";
import Pagination from "../components/qc/Pagination";
import MasterFormModal from "../components/qc/MasterFormModal";
import FilePreviewModal from "../components/qc/FilePreviewModal";
import SuccessDialog from "../components/qc/SuccessDialog";

const EMPTY_R_SRCH: ResultSearchState = {
  processCode: "",
  masterVersion: "",
  checkItemName: "",
  judgement: "",
  changeType: "",
};
const EMPTY_M_SRCH: MasterSearchState = {
  processCode: "",
  masterVersion: "",
  checkItemName: "",
};

export default function QcMasterPage() {
  // セレクタ
  const [category, setCategory] = useState(CAT_OPTIONS[0]);
  const [masterName, setMasterName] = useState(NAME_MAP[CAT_OPTIONS[0]]?.[0] ?? "");
  const [shown, setShown] = useState(false);

  const isQc = category === "品質管理" && masterName === "検査項目マスタ";

  // タブ・ページング
  const [viewMode, setViewMode] = useState<QcViewMode>("master");
  const [pageSize, setPageSize] = useState<QcPageSize>(10);
  const [currentPage, setCurrentPage] = useState(1);

  // 検索（入力中 / 確定済み）
  const [rSrch, setRSrch] = useState<ResultSearchState>(EMPTY_R_SRCH);
  const [rApp, setRApp] = useState<ResultSearchState>(EMPTY_R_SRCH);
  const [mSrch, setMSrch] = useState<MasterSearchState>(EMPTY_M_SRCH);
  const [mApp, setMApp] = useState<MasterSearchState>(EMPTY_M_SRCH);

  // マスタデータ
  const [masters, setMasters] = useState<QcMasterItem[]>(DUMMY_MASTERS);
  const [newIds, setNewIds] = useState<Set<number>>(new Set());
  const [editedIds, setEditedIds] = useState<Set<number>>(new Set());

  // モーダル・ダイアログ
  const [modal, setModal] = useState<ModalState>(null);
  const [dlgMsg, setDlgMsg] = useState<string | null>(null);
  const [prevFile, setPrevFile] = useState<PreviewFile>(null);

  // バージョン候補
  const rSrchVersions = rSrch.processCode
    ? (PROCESS_VERSION_MAP[rSrch.processCode] ?? [])
    : ALL_VERSIONS;
  const mSrchVersions = mSrch.processCode
    ? (PROCESS_VERSION_MAP[mSrch.processCode] ?? [])
    : ALL_VERSIONS;

  // フィルタ済みデータ
  const filtR = useMemo(
    () =>
      DUMMY_RESULTS.filter((r) => {
        if (rApp.processCode && r.processCode !== rApp.processCode) return false;
        if (rApp.masterVersion && r.masterVersion !== rApp.masterVersion) return false;
        if (rApp.checkItemName && !r.checkItemName.includes(rApp.checkItemName)) return false;
        if (rApp.judgement && r.judgement !== rApp.judgement) return false;
        if (rApp.changeType === "added") return r.isAdded;
        if (rApp.changeType === "updated") return r.isUpdated;
        if (rApp.changeType === "normal") return !r.isAdded && !r.isUpdated;
        return true;
      }),
    [rApp],
  );

  const filtM = useMemo(
    () =>
      masters.filter((m) => {
        if (mApp.processCode && m.processCode !== mApp.processCode) return false;
        if (mApp.masterVersion && m.masterVersion !== mApp.masterVersion) return false;
        if (mApp.checkItemName && !m.checkItemName.includes(mApp.checkItemName)) return false;
        return true;
      }),
    [masters, mApp],
  );

  const sortedM = useMemo(
    () =>
      [...filtM].sort((a, b) => {
        const p = a.processCode.localeCompare(b.processCode);
        return p !== 0 ? p : a.masterVersion.localeCompare(b.masterVersion);
      }),
    [filtM],
  );

  const data = viewMode === "result" ? filtR : sortedM;
  const totalPages = Math.ceil(data.length / pageSize);
  const paged = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // ハンドラ
  const handleShow = () => {
    setShown(true);
    setCurrentPage(1);
  };

  const handleCategoryChange = (v: string) => {
    setCategory(v);
    setMasterName(NAME_MAP[v]?.[0] ?? "");
    setShown(false);
  };

  const handleMasterNameChange = (v: string) => {
    setMasterName(v);
    setShown(false);
  };

  const handleTabChange = (m: QcViewMode) => {
    setViewMode(m);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (v: number) => {
    setPageSize(v as QcPageSize);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    if (viewMode === "result") setRApp({ ...rSrch });
    else setMApp({ ...mSrch });
    setCurrentPage(1);
  };

  const handleClear = () => {
    if (viewMode === "result") {
      setRSrch(EMPTY_R_SRCH);
      setRApp(EMPTY_R_SRCH);
    } else {
      setMSrch(EMPTY_M_SRCH);
      setMApp(EMPTY_M_SRCH);
    }
    setCurrentPage(1);
  };

  const handleSaveMaster = (item: QcMasterItem, mode: "create" | "edit") => {
    const now = mkDate(0);
    if (mode === "create") {
      setMasters((p) => [...p, { ...item, updatedAt: now }]);
      setNewIds((p) => new Set(p).add(item.id));
      setDlgMsg("登録完了しました。");
    } else {
      setMasters((p) => p.map((m) => (m.id === item.id ? { ...item, updatedAt: now } : m)));
      setEditedIds((p) => new Set(p).add(item.id));
      setDlgMsg("更新完了しました。");
    }
    setModal(null);
  };

  const handleDeleteMaster = (item: QcMasterItem) => {
    if (!window.confirm(`「${item.processCode} / ${item.checkItemName}」を削除しますか？`)) return;
    setMasters((p) => p.filter((m) => m.id !== item.id));
    setDlgMsg("削除完了しました。");
  };

  // 実績サマリー件数
  const totalAdded = DUMMY_RESULTS.filter((r) => r.isAdded).length;
  const totalUpdated = DUMMY_RESULTS.filter((r) => r.isUpdated).length;

  return (
    <>
      <style>{QC_CSS}</style>
      <div className="qc-app">
        {/* ヘッダー */}
        <AppHeader title="マスタ管理" userId="U00001" userName="高宮 織太" />

        {/* セレクタバー */}
        <SelectorBar
          category={category}
          masterName={masterName}
          onCategoryChange={handleCategoryChange}
          onMasterNameChange={handleMasterNameChange}
          onShow={handleShow}
        />

        {/* コンテンツ */}
        <div className="content">
          {!shown && (
            <EmptyState
              icon="🗄"
              title="マスタデータの表示"
              description="上記の「マスタカテゴリ」と「マスタ名」を設定して「表示」ボタンをクリックしてください。"
            />
          )}

          {shown && !isQc && (
            <EmptyState
              icon="📋"
              title={masterName}
              description={`通常のマスタ管理画面で表示されます（ページサイズ：500件固定）`}
            />
          )}

          {shown && isQc && (
            <>
              {/* タブ */}
              <div className="tab-row">
                <button
                  className={`tab-btn${viewMode === "result" ? " act" : ""}`}
                  onClick={() => handleTabChange("result")}
                >
                  実績データ
                </button>
                <button
                  className={`tab-btn${viewMode === "master" ? " act" : ""}`}
                  onClick={() => handleTabChange("master")}
                >
                  検査項目マスタ
                </button>
              </div>

              {/* 検索エリア */}
              <SearchArea
                viewMode={viewMode}
                rSrch={rSrch}
                mSrch={mSrch}
                rSrchVersions={rSrchVersions}
                mSrchVersions={mSrchVersions}
                onRSrchChange={setRSrch}
                onMSrchChange={setMSrch}
                onSearch={handleSearch}
                onClear={handleClear}
              />

              {/* ツールバー */}
              <div className="tbar">
                <div className="tbar-l">
                  <span className="total-lbl">
                    全 <strong>{data.length}</strong> 件
                  </span>
                  <div className="ps-area">
                    表示件数
                    <select
                      className="ps-sel"
                      value={pageSize}
                      onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    >
                      {[10, 20, 50].map((n) => (
                        <option key={n} value={n}>
                          {n}件
                        </option>
                      ))}
                    </select>
                  </div>
                  {viewMode === "result" && (
                    <span
                      style={{
                        fontSize: 12,
                        color: "#666",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span>
                        <span className="badge-added">追加</span>{" "}
                        <strong style={{ color: "#1d4ed8" }}>{totalAdded}</strong>件
                      </span>
                      <span>
                        <span className="badge-updated">修正</span>{" "}
                        <strong style={{ color: "#c2410c" }}>{totalUpdated}</strong>件
                      </span>
                    </span>
                  )}
                </div>
                <div className="tbar-r">
                  {viewMode === "master" && (
                    <>
                      <button className="btn-imp">インポート</button>
                      <button className="btn-exp">エクスポート</button>
                      <button
                        className="btn-new"
                        onClick={() => setModal({ mode: "create", data: null })}
                      >
                        ＋ 新規登録
                      </button>
                    </>
                  )}
                  {viewMode === "result" && <button className="btn-exp">エクスポート</button>}
                </div>
              </div>

              {/* テーブル */}
              <div className="tbl-outer">
                <div className="tbl-wrap">
                  {viewMode === "result" && (
                    <ResultTable
                      rows={paged as Parameters<typeof ResultTable>[0]["rows"]}
                      anomalies={DUMMY_ANOMALIES}
                    />
                  )}
                  {viewMode === "master" && (
                    <MasterTable
                      rows={paged as Parameters<typeof MasterTable>[0]["rows"]}
                      newIds={newIds}
                      editedIds={editedIds}
                      onEdit={(item) => setModal({ mode: "edit", data: item })}
                      onDelete={handleDeleteMaster}
                      onPreview={setPrevFile}
                    />
                  )}
                </div>

                {/* ページネーション */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>

        {/* モーダル：登録・編集 */}
        {modal && (
          <MasterFormModal
            modal={modal}
            onClose={() => setModal(null)}
            onSave={handleSaveMaster}
          />
        )}

        {/* ファイルプレビュー */}
        {prevFile && (
          <FilePreviewModal file={prevFile} onClose={() => setPrevFile(null)} />
        )}

        {/* 成功ダイアログ */}
        {dlgMsg && <SuccessDialog message={dlgMsg} onClose={() => setDlgMsg(null)} />}
      </div>
    </>
  );
}
