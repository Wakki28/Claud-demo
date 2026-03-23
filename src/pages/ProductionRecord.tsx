// 製造実績ページ（実績データ）
import { useState } from 'react';
import { Search, RotateCcw, Plus, Download, X } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable from '../components/ui/DataTable';
import { productionRecords as initialRecords, lines, workers, productNames } from '../data/mockData';
import type { ProductionRecord } from '../types';

// 達成率バッジvariantを決定
function getVariant(rate: number): 'success' | 'warning' | 'danger' {
  if (rate >= 100) return 'success';
  if (rate >= 90) return 'warning';
  return 'danger';
}

// CSVダウンロード
function downloadCsv(records: ProductionRecord[]) {
  const header = '日付,ライン,作業者,製品名,計画数,実績数,達成率,作業時間';
  const rows = records.map((r) => {
    const rate = Math.round((r.actualCount / r.plannedCount) * 100);
    return `${r.date},${r.lineName},${r.workerName},${r.productName},${r.plannedCount},${r.actualCount},${rate}%,${r.workHours}h`;
  });
  const csv = [header, ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'production_records.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// 新規登録フォームの初期値
const emptyForm = {
  date: '',
  lineId: '',
  workerId: '',
  productName: '',
  plannedCount: '',
  actualCount: '',
  workHours: '',
};

type FormData = typeof emptyForm;
type FormErrors = Partial<Record<keyof FormData, string>>;

export default function ProductionRecordPage() {
  const [records, setRecords] = useState<ProductionRecord[]>(initialRecords);
  const [filterStart, setFilterStart] = useState('');
  const [filterEnd, setFilterEnd] = useState('');
  const [filterLine, setFilterLine] = useState('');
  const [filterWorker, setFilterWorker] = useState('');
  const [filtered, setFiltered] = useState<ProductionRecord[]>(initialRecords);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const perPage = 10;
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // 検索実行
  function handleSearch() {
    let result = records;
    if (filterStart) result = result.filter((r) => r.date >= filterStart);
    if (filterEnd) result = result.filter((r) => r.date <= filterEnd);
    if (filterLine) result = result.filter((r) => r.lineId === filterLine);
    if (filterWorker) result = result.filter((r) => r.workerId === filterWorker);
    setFiltered(result);
    setPage(1);
  }

  // リセット
  function handleReset() {
    setFilterStart('');
    setFilterEnd('');
    setFilterLine('');
    setFilterWorker('');
    setFiltered(records);
    setPage(1);
  }

  // フォームバリデーション
  function validate(): boolean {
    const errs: FormErrors = {};
    if (!form.date) errs.date = '日付は必須です';
    if (!form.lineId) errs.lineId = 'ラインは必須です';
    if (!form.workerId) errs.workerId = '作業者は必須です';
    if (!form.productName) errs.productName = '製品名は必須です';
    if (!form.plannedCount || isNaN(Number(form.plannedCount)) || Number(form.plannedCount) <= 0)
      errs.plannedCount = '計画数は正の数値で入力してください';
    if (!form.actualCount || isNaN(Number(form.actualCount)) || Number(form.actualCount) < 0)
      errs.actualCount = '実績数は0以上の数値で入力してください';
    if (!form.workHours || isNaN(Number(form.workHours)) || Number(form.workHours) <= 0)
      errs.workHours = '作業時間は正の数値で入力してください';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // 登録処理
  function handleSubmit() {
    if (!validate()) return;
    const lineData = lines.find((l) => l.id === form.lineId)!;
    const workerData = workers.find((w) => w.id === form.workerId)!;
    const newRecord: ProductionRecord = {
      id: `PR${String(records.length + 1).padStart(3, '0')}`,
      date: form.date,
      lineId: lineData.id,
      lineName: lineData.name,
      workerId: workerData.id,
      workerName: workerData.name,
      productName: form.productName,
      plannedCount: Number(form.plannedCount),
      actualCount: Number(form.actualCount),
      workHours: Number(form.workHours),
      createdAt: new Date().toISOString(),
    };
    const updated = [newRecord, ...records];
    setRecords(updated);
    setFiltered(updated);
    setShowModal(false);
    setForm(emptyForm);
    setErrors({});
    setPage(1);
  }

  const columns = [
    { key: 'date',    header: '日付',   render: (r: ProductionRecord) => r.date },
    { key: 'line',    header: 'ライン', render: (r: ProductionRecord) => r.lineName },
    { key: 'worker',  header: '作業者', render: (r: ProductionRecord) => r.workerName },
    { key: 'product', header: '製品名', render: (r: ProductionRecord) => r.productName },
    { key: 'planned', header: '計画数', render: (r: ProductionRecord) => r.plannedCount.toLocaleString() },
    { key: 'actual',  header: '実績数', render: (r: ProductionRecord) => r.actualCount.toLocaleString() },
    {
      key: 'rate',
      header: '達成率',
      render: (r: ProductionRecord) => {
        const rate = Math.round((r.actualCount / r.plannedCount) * 100);
        return <StatusBadge label={`${rate}%`} variant={getVariant(rate)} />;
      },
    },
    { key: 'hours', header: '作業時間', render: (r: ProductionRecord) => `${r.workHours}h` },
  ];

  return (
    <div>
      <PageHeader
        title="製造実績"
        actions={
          <>
            <button
              onClick={() => downloadCsv(filtered)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border border-[#e8ecf0] rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
            >
              <Download size={15} />
              CSV出力
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm bg-[#4361ee] text-white rounded-lg hover:bg-[#3451d1] transition-colors"
            >
              <Plus size={15} />
              新規登録
            </button>
          </>
        }
      />

      {/* フィルター */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e8ecf0] mb-4">
        <div className="flex items-end gap-3 flex-wrap">
          <div>
            <label className="block text-xs text-gray-500 mb-1">開始日</label>
            <input
              type="date"
              value={filterStart}
              onChange={(e) => setFilterStart(e.target.value)}
              className="border border-[#e8ecf0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4361ee]"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">終了日</label>
            <input
              type="date"
              value={filterEnd}
              onChange={(e) => setFilterEnd(e.target.value)}
              className="border border-[#e8ecf0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4361ee]"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">ライン</label>
            <select
              value={filterLine}
              onChange={(e) => setFilterLine(e.target.value)}
              className="border border-[#e8ecf0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4361ee]"
            >
              <option value="">すべて</option>
              {lines.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">作業者</label>
            <select
              value={filterWorker}
              onChange={(e) => setFilterWorker(e.target.value)}
              className="border border-[#e8ecf0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4361ee]"
            >
              <option value="">すべて</option>
              {workers.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#4361ee] text-white rounded-lg hover:bg-[#3451d1] transition-colors"
          >
            <Search size={15} />
            検索
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 text-sm border border-[#e8ecf0] rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
          >
            <RotateCcw size={15} />
            リセット
          </button>
        </div>
      </div>

      {/* テーブル */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e8ecf0]">
        <DataTable columns={columns} data={paginated} />
        {/* ページネーション */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#e8ecf0]">
          <span className="text-sm text-gray-500">
            {filtered.length}件中 {(page - 1) * perPage + 1}〜{Math.min(page * perPage, filtered.length)}件表示
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm border border-[#e8ecf0] rounded hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              前へ
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 text-sm border rounded transition-colors ${
                  p === page
                    ? 'bg-[#4361ee] text-white border-[#4361ee]'
                    : 'border-[#e8ecf0] hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1 text-sm border border-[#e8ecf0] rounded hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              次へ
            </button>
          </div>
        </div>
      </div>

      {/* 新規登録モーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[480px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8ecf0]">
              <h3 className="text-base font-semibold text-gray-800">製造実績 新規登録</h3>
              <button onClick={() => { setShowModal(false); setErrors({}); setForm(emptyForm); }}>
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {/* 日付 */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">日付 <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-[#e8ecf0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4361ee]"
                />
                {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
              </div>
              {/* ライン */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">ライン <span className="text-red-500">*</span></label>
                <select
                  value={form.lineId}
                  onChange={(e) => setForm({ ...form, lineId: e.target.value })}
                  className="w-full border border-[#e8ecf0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4361ee]"
                >
                  <option value="">選択してください</option>
                  {lines.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
                {errors.lineId && <p className="text-xs text-red-500 mt-1">{errors.lineId}</p>}
              </div>
              {/* 作業者 */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">作業者 <span className="text-red-500">*</span></label>
                <select
                  value={form.workerId}
                  onChange={(e) => setForm({ ...form, workerId: e.target.value })}
                  className="w-full border border-[#e8ecf0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4361ee]"
                >
                  <option value="">選択してください</option>
                  {workers.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
                {errors.workerId && <p className="text-xs text-red-500 mt-1">{errors.workerId}</p>}
              </div>
              {/* 製品名 */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">製品名 <span className="text-red-500">*</span></label>
                <select
                  value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  className="w-full border border-[#e8ecf0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4361ee]"
                >
                  <option value="">選択してください</option>
                  {productNames.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {errors.productName && <p className="text-xs text-red-500 mt-1">{errors.productName}</p>}
              </div>
              {/* 計画数・実績数 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">計画数 <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={form.plannedCount}
                    onChange={(e) => setForm({ ...form, plannedCount: e.target.value })}
                    className="w-full border border-[#e8ecf0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4361ee]"
                    min="1"
                  />
                  {errors.plannedCount && <p className="text-xs text-red-500 mt-1">{errors.plannedCount}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">実績数 <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={form.actualCount}
                    onChange={(e) => setForm({ ...form, actualCount: e.target.value })}
                    className="w-full border border-[#e8ecf0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4361ee]"
                    min="0"
                  />
                  {errors.actualCount && <p className="text-xs text-red-500 mt-1">{errors.actualCount}</p>}
                </div>
              </div>
              {/* 作業時間 */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">作業時間（時間） <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={form.workHours}
                  onChange={(e) => setForm({ ...form, workHours: e.target.value })}
                  className="w-full border border-[#e8ecf0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4361ee]"
                  step="0.5"
                  min="0.5"
                />
                {errors.workHours && <p className="text-xs text-red-500 mt-1">{errors.workHours}</p>}
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-[#e8ecf0]">
              <button
                onClick={() => { setShowModal(false); setErrors({}); setForm(emptyForm); }}
                className="px-4 py-2 text-sm border border-[#e8ecf0] rounded-lg hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm bg-[#4361ee] text-white rounded-lg hover:bg-[#3451d1] transition-colors"
              >
                登録
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
