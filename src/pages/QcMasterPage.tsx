import { useState, useMemo } from "react";
import type {
  QcViewMode,
  QcPageSize,
  QcMasterItem,
  QcResultItem,
  QcGroupOverall,
  ResultSearchState,
  MasterSearchState,
  ModalState,
  PreviewFile,
} from "../types/qc";
import {
  CAT_OPTIONS,
  NAME_MAP,
  DUMMY_RESULTS,
  DUMMY_MASTERS,
  DUMMY_ANOMALIES,
  DUMMY_OVERALL_RESULTS,
  ITEMS_PER_PROCESS,
  getExpectedStages,
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
import ImportExportModal from "../components/qc/ImportExportModal";

const EMPTY_R_SRCH: ResultSearchState = {
  processCode: "",
  masterVersion: "",
  checkItemName: "",
  machineNumber: "",
  overallResult: "",
  inspectionStage: "",
  checkMethodType: "",
  adoptionStatus: "adopted",
  changeType: "",
};
const EMPTY_M_SRCH: MasterSearchState = {
  processCode: "",
  masterVersion: "",
  checkItemName: "",
  checkMethodType: "",
};

// 検査段階のソート順（初→中1〜中N→終）
const stageOrder = (s: string): number => {
  if (s === "初") return 0;
  if (s === "終") return 9999;
  const m = s.match(/^中(\d+)$/);
  return m ? parseInt(m[1], 10) : 1;
};

export default function QcMasterPage() {
  // セレクタ
  const [category, setCategory] = useState(CAT_OPTIONS[0]);
  const [masterName, setMasterName] = useState(NAME_MAP[CAT_OPTIONS[0]]?.[0] ?? "");
  const [shown, setShown] = useState(false);

  const isQc = category === "品質管理" && masterName === "検査項目マスタ";

  // タブ・ページング
  const [viewMode, setViewMode] = useState<QcViewMode>("master");
  const [pageSize, setPageSize] = useState<QcPageSize>(50);
  const [currentPage, setCurrentPage] = useState(1);

  // 検索（入力中 / 確定済み）
  const [rSrch, setRSrch] = useState<ResultSearchState>(EMPTY_R_SRCH);
  const [rApp, setRApp] = useState<ResultSearchState>(EMPTY_R_SRCH);
  const [mSrch, setMSrch] = useState<MasterSearchState>(EMPTY_M_SRCH);
  const [mApp, setMApp] = useState<MasterSearchState>(EMPTY_M_SRCH);

  // 実績データ
  const [results] = useState<QcResultItem[]>(DUMMY_RESULTS);

  // マスタデータ（computedOverallResults より先に宣言）
  const [masters, setMasters] = useState<QcMasterItem[]>(DUMMY_MASTERS);

  // 総合結果：全検査項目・全検査段階・全N数の判定から自動計算
  const computedOverallResults = useMemo((): QcGroupOverall[] => {
    return DUMMY_OVERALL_RESULTS.map((group) => {
      if (!group.isAdopted) return { ...group, overallResult: null };

      const { processCode: pc, masterVersion: ver, revisionNumber: rev } = group;
      const groupResults = results.filter(
        (r) => r.processCode === pc && r.masterVersion === ver && r.revisionNumber === rev,
      );

      if (groupResults.length === 0) return { ...group, overallResult: null };
      if (groupResults.some((r) => r.judgement === "NG")) return { ...group, overallResult: "NG" };

      // 全検査項目・全段階・全N数が揃っているか確認
      const items = ITEMS_PER_PROCESS[pc] ?? [];
      const groupMasters = masters.filter((m) => m.processCode === pc && m.masterVersion === ver);
      for (const master of groupMasters) {
        const itemIdx = items.indexOf(master.checkItemName);
        if (itemIdx < 0) continue;
        const stages = getExpectedStages(pc, itemIdx);
        for (const stage of stages) {
          for (let n = 1; n <= master.nCount; n++) {
            if (
              !groupResults.some(
                (r) =>
                  r.checkItemName === master.checkItemName &&
                  r.inspectionStage === stage &&
                  r.nIndex === n,
              )
            ) {
              return { ...group, overallResult: null }; // 検査中（未完了）
            }
          }
        }
      }
      return { ...group, overallResult: "OK" };
    });
  }, [results, masters]);

  const [newIds, setNewIds] = useState<Set<number>>(new Set());
  const [editedIds, setEditedIds] = useState<Set<number>>(new Set());

  // チェックボックス選択
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // モーダル・ダイアログ
  const [modal, setModal] = useState<ModalState>(null);
  const [dlgMsg, setDlgMsg] = useState<string | null>(null);
  const [prevFile, setPrevFile] = useState<PreviewFile>(null);
  const [ieModal, setIeModal] = useState<{ tab: "import" | "export" } | null>(null);

  // フィルタ済みデータ
  const filtR = useMemo(() => {
    // 総合結果・採用状態のグループマップ（計算済み）
    const groupMap = new Map<string, QcGroupOverall>();
    computedOverallResults.forEach((o) => {
      groupMap.set(`${o.processCode}-${o.masterVersion}-${o.revisionNumber}`, o);
    });

    // 変更種別グループのキーセット
    const addedGroupKeys = new Set<string>();
    const updatedGroupKeys = new Set<string>();
    results.forEach((r) => {
      const gk = `${r.processCode}-${r.masterVersion}-${r.revisionNumber}`;
      if (r.isAdded) addedGroupKeys.add(gk);
      if (r.isUpdated) updatedGroupKeys.add(gk);
    });

    return results.filter((r) => {
      if (rApp.processCode && r.processCode !== rApp.processCode) return false;
      if (rApp.masterVersion && r.masterVersion !== rApp.masterVersion) return false;
      if (rApp.checkItemName && !r.checkItemName.includes(rApp.checkItemName)) return false;

      const gk = `${r.processCode}-${r.masterVersion}-${r.revisionNumber}`;
      const group = groupMap.get(gk);

      // 採用状態フィルター
      if (rApp.adoptionStatus === "adopted" && group?.isAdopted === false) return false;
      if (rApp.adoptionStatus === "notAdopted" && group?.isAdopted !== false) return false;

      // 機番フィルター（部分一致）
      if (rApp.machineNumber && !r.machineNumber.includes(rApp.machineNumber)) return false;

      // 総合結果フィルター（自動計算値で判定・工程×バージョン×改版 単位）
      if (rApp.overallResult === "OK" && group?.overallResult !== "OK") return false;
      if (rApp.overallResult === "NG" && group?.overallResult !== "NG") return false;

      // 検査段階フィルター
      if (rApp.inspectionStage === "初" && r.inspectionStage !== "初") return false;
      if (rApp.inspectionStage === "中" && !r.inspectionStage.startsWith("中")) return false;
      if (rApp.inspectionStage === "終" && r.inspectionStage !== "終") return false;

      // 検査方法フィルター（完全一致）
      if (rApp.checkMethodType && r.checkMethodType !== rApp.checkMethodType) return false;

      // 変更種別フィルター（グループ単位）
      if (rApp.changeType === "added" && !addedGroupKeys.has(gk)) return false;
      if (rApp.changeType === "updated" && !updatedGroupKeys.has(gk)) return false;
      if (rApp.changeType === "none" && (addedGroupKeys.has(gk) || updatedGroupKeys.has(gk))) return false;

      return true;
    });
  }, [results, computedOverallResults, rApp]);

  // ソート順：工程 → バージョン → 改版 → 検査段階（初→中→終）→ 検査項目 → N数
  const sortedR = useMemo(
    () =>
      [...filtR].sort((a, b) => {
        const pc = a.processCode.localeCompare(b.processCode);
        if (pc !== 0) return pc;
        const ver = a.masterVersion.localeCompare(b.masterVersion);
        if (ver !== 0) return ver;
        const rev = a.revisionNumber - b.revisionNumber;
        if (rev !== 0) return rev;
        const item = a.checkItemName.localeCompare(b.checkItemName, "ja");
        if (item !== 0) return item;
        const stg = stageOrder(a.inspectionStage) - stageOrder(b.inspectionStage);
        if (stg !== 0) return stg;
        return a.nIndex - b.nIndex;
      }),
    [filtR],
  );

  const filtM = useMemo(
    () =>
      masters.filter((m) => {
        if (mApp.processCode && m.processCode !== mApp.processCode) return false;
        if (mApp.masterVersion && m.masterVersion !== mApp.masterVersion) return false;
        if (mApp.checkItemName && !m.checkItemName.includes(mApp.checkItemName)) return false;
        if (mApp.checkMethodType && m.checkMethodType !== mApp.checkMethodType) return false;
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

  const data = viewMode === "result" ? sortedR : sortedM;
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
    setSelectedIds(new Set());
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

  const handleEditSelected = () => {
    if (selectedIds.size !== 1) return;
    const id = [...selectedIds][0];
    const item = masters.find((m) => m.id === id);
    if (item) setModal({ mode: "edit", data: item });
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`選択した ${selectedIds.size} 件を削除しますか？`)) return;
    setMasters((p) => p.filter((m) => !selectedIds.has(m.id)));
    setSelectedIds(new Set());
    setDlgMsg("削除完了しました。");
  };

  const handleImport = (_file: File) => {
    setDlgMsg("インポートが完了しました。");
  };


  // 実績サマリー件数
  const totalAdded = results.filter((r) => r.isAdded).length;
  const totalUpdated = results.filter((r) => r.isUpdated).length;

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
                      {[10, 50, 100].map((n) => (
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
                      <button
                        className="btn-new"
                        onClick={() => setModal({ mode: "create", data: null })}
                      >
                        ＋ 追加
                      </button>
                      <button
                        className="btn-imp"
                        disabled={selectedIds.size !== 1}
                        onClick={handleEditSelected}
                      >
                        ✏ 編集
                      </button>
                      <button
                        className="btn-imp"
                        disabled={selectedIds.size === 0}
                        onClick={handleDeleteSelected}
                      >
                        🗑 削除（{selectedIds.size}）
                      </button>
                      <button
                        className="btn-imp"
                        onClick={() => setIeModal({ tab: "import" })}
                      >
                        ↓ インポート
                      </button>
                    </>
                  )}
                  <button
                    className="btn-exp"
                    onClick={() => setIeModal({ tab: "export" })}
                  >
                    ↑ エクスポート
                  </button>
                </div>
              </div>

              {/* テーブル */}
              <div className="tbl-outer">
                <div className="tbl-wrap">
                  {viewMode === "result" && (
                    <ResultTable
                      rows={paged as Parameters<typeof ResultTable>[0]["rows"]}
                      anomalies={DUMMY_ANOMALIES}
                      overallResults={computedOverallResults}
                      masters={masters}
                    />
                  )}
                  {viewMode === "master" && (
                    <MasterTable
                      rows={paged as Parameters<typeof MasterTable>[0]["rows"]}
                      newIds={newIds}
                      editedIds={editedIds}
                      selectedIds={selectedIds}
                      onSelectionChange={setSelectedIds}
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

        {/* インポート/エクスポート */}
        {ieModal && (
          <ImportExportModal
            viewMode={viewMode}
            initialTab={ieModal.tab}
            masterData={masters}
            resultData={results}
            overallResults={computedOverallResults}
            onClose={() => setIeModal(null)}
            onImport={handleImport}
          />
        )}

        {/* 成功ダイアログ */}
        {dlgMsg && <SuccessDialog message={dlgMsg} onClose={() => setDlgMsg(null)} />}
      </div>
    </>
  );
}
