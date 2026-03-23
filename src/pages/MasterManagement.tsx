// マスタ管理画面（管理者専用）
import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import { mockWorkerMasters, mockLineMasters, mockClientMasters } from '../data/mockData';
import type { WorkerMaster, LineMaster, ClientMaster, ColumnMapping } from '../types';

// タブ種別
type TabType = 'worker' | 'line' | 'client';

// ---- 作業者マスタモーダル ----
type WorkerModalProps = {
  initial: WorkerMaster | null;
  existingNumbers: string[];
  onSave: (w: WorkerMaster) => void;
  onClose: () => void;
};

function WorkerModal({ initial, existingNumbers, onSave, onClose }: WorkerModalProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [employeeNumber, setEmployeeNumber] = useState(initial?.employeeNumber ?? '');
  const [department, setDepartment] = useState(initial?.department ?? '');
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [error, setError] = useState('');

  function handleSave() {
    if (!name.trim() || !employeeNumber.trim() || !department.trim()) {
      setError('すべての項目を入力してください');
      return;
    }
    const isDuplicate = existingNumbers
      .filter((n) => n !== initial?.employeeNumber)
      .includes(employeeNumber.trim());
    if (isDuplicate) {
      setError('この社員番号はすでに登録されています');
      return;
    }
    onSave({
      id: initial?.id ?? `w${Date.now()}`,
      name: name.trim(),
      employeeNumber: employeeNumber.trim(),
      department: department.trim(),
      isActive,
    });
  }

  return (
    <ModalWrapper title={initial ? '作業者を編集' : '作業者を登録'} onClose={onClose}>
      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
      <FormField label="社員番号">
        <input type="text" value={employeeNumber} onChange={(e) => setEmployeeNumber(e.target.value)} className={inputClass} />
      </FormField>
      <FormField label="氏名">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      </FormField>
      <FormField label="所属部門">
        <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} className={inputClass} />
      </FormField>
      <FormField label="状態">
        <select value={isActive ? 'active' : 'inactive'} onChange={(e) => setIsActive(e.target.value === 'active')} className={inputClass}>
          <option value="active">有効</option>
          <option value="inactive">無効</option>
        </select>
      </FormField>
      <ModalFooter onClose={onClose} onSave={handleSave} />
    </ModalWrapper>
  );
}

// ---- ラインマスタモーダル ----
type LineModalProps = {
  initial: LineMaster | null;
  onSave: (l: LineMaster) => void;
  onClose: () => void;
};

function LineModal({ initial, onSave, onClose }: LineModalProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [capacity, setCapacity] = useState(initial?.capacity ?? 0);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [error, setError] = useState('');

  function handleSave() {
    if (!name.trim()) {
      setError('ライン名を入力してください');
      return;
    }
    if (capacity <= 0) {
      setError('生産能力は1以上を入力してください');
      return;
    }
    onSave({
      id: initial?.id ?? `l${Date.now()}`,
      name: name.trim(),
      capacity,
      isActive,
    });
  }

  return (
    <ModalWrapper title={initial ? 'ラインを編集' : 'ラインを登録'} onClose={onClose}>
      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
      <FormField label="ライン名">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      </FormField>
      <FormField label="生産能力（個/日）">
        <input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className={inputClass} min={1} />
      </FormField>
      <FormField label="状態">
        <select value={isActive ? 'active' : 'inactive'} onChange={(e) => setIsActive(e.target.value === 'active')} className={inputClass}>
          <option value="active">有効</option>
          <option value="inactive">無効</option>
        </select>
      </FormField>
      <ModalFooter onClose={onClose} onSave={handleSave} />
    </ModalWrapper>
  );
}

// ---- 取引先マスタモーダル ----
type ClientModalProps = {
  initial: ClientMaster;
  onSave: (c: ClientMaster) => void;
  onClose: () => void;
};

function ClientModal({ initial, onSave, onClose }: ClientModalProps) {
  const [name, setName] = useState(initial.name);
  const [formatType, setFormatType] = useState(initial.formatType);
  const [isActive, setIsActive] = useState(initial.isActive);
  const [mapping, setMapping] = useState<ColumnMapping>({ ...initial.columnMapping });
  const [error, setError] = useState('');

  function updateMapping(key: keyof ColumnMapping, value: string) {
    setMapping((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    if (!name.trim() || !formatType.trim()) {
      setError('取引先名とフォーマット種別を入力してください');
      return;
    }
    onSave({ ...initial, name: name.trim(), formatType: formatType.trim(), isActive, columnMapping: mapping });
  }

  const mappingFields: { key: keyof ColumnMapping; label: string }[] = [
    { key: 'orderNumber',  label: '注文番号の列名' },
    { key: 'productCode',  label: '品番の列名' },
    { key: 'quantity',     label: '数量の列名' },
    { key: 'deliveryDate', label: '納期の列名' },
    { key: 'clientCode',   label: '取引先コードの列名' },
  ];

  return (
    <ModalWrapper title="取引先フォーマット設定" onClose={onClose}>
      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
      <FormField label="取引先名">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      </FormField>
      <FormField label="フォーマット種別">
        <input type="text" value={formatType} onChange={(e) => setFormatType(e.target.value)} className={inputClass} />
      </FormField>
      <FormField label="状態">
        <select value={isActive ? 'active' : 'inactive'} onChange={(e) => setIsActive(e.target.value === 'active')} className={inputClass}>
          <option value="active">有効</option>
          <option value="inactive">無効</option>
        </select>
      </FormField>
      <div className="mt-4 pt-4 border-t border-[#e8ecf0]">
        <p className="text-xs font-semibold text-gray-500 mb-3">列マッピング設定</p>
        {mappingFields.map(({ key, label }) => (
          <FormField key={key} label={label}>
            <input type="text" value={mapping[key]} onChange={(e) => updateMapping(key, e.target.value)} className={inputClass} />
          </FormField>
        ))}
      </div>
      <ModalFooter onClose={onClose} onSave={handleSave} />
    </ModalWrapper>
  );
}

// ---- 共通モーダルラッパー ----
type ModalWrapperProps = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

function ModalWrapper({ title, onClose, children }: ModalWrapperProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[480px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8ecf0]">
          <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ---- 共通フォームフィールド ----
type FormFieldProps = {
  label: string;
  children: React.ReactNode;
};

function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

// ---- モーダルフッター ----
type ModalFooterProps = {
  onClose: () => void;
  onSave: () => void;
};

function ModalFooter({ onClose, onSave }: ModalFooterProps) {
  return (
    <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-[#e8ecf0]">
      <button
        onClick={onClose}
        className="px-4 py-2 text-sm border border-[#e8ecf0] rounded-lg hover:bg-gray-50 transition-colors"
      >
        キャンセル
      </button>
      <button
        onClick={onSave}
        className="px-5 py-2 text-sm bg-[#4361ee] text-white rounded-lg hover:bg-[#3451d1] transition-colors"
      >
        保存
      </button>
    </div>
  );
}

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#4361ee] focus:ring-2 focus:ring-[#4361ee]/20 transition-all';

// ---- メインページ ----
export default function MasterManagement() {
  const [activeTab, setActiveTab] = useState<TabType>('worker');

  // 作業者マスタの状態
  const [workers, setWorkers] = useState<WorkerMaster[]>(mockWorkerMasters);
  const [workerModal, setWorkerModal] = useState<{ open: boolean; target: WorkerMaster | null }>({ open: false, target: null });

  // ラインマスタの状態
  const [lineMasters, setLineMasters] = useState<LineMaster[]>(mockLineMasters);
  const [lineModal, setLineModal] = useState<{ open: boolean; target: LineMaster | null }>({ open: false, target: null });

  // 取引先マスタの状態
  const [clients, setClients] = useState<ClientMaster[]>(mockClientMasters);
  const [clientModal, setClientModal] = useState<{ open: boolean; target: ClientMaster | null }>({ open: false, target: null });

  // ---- 作業者操作 ----
  function saveWorker(w: WorkerMaster) {
    setWorkers((prev) => {
      const exists = prev.find((x) => x.id === w.id);
      return exists ? prev.map((x) => (x.id === w.id ? w : x)) : [...prev, w];
    });
    setWorkerModal({ open: false, target: null });
  }

  function deleteWorker(id: string) {
    setWorkers((prev) => prev.filter((x) => x.id !== id));
  }

  // ---- ライン操作 ----
  function saveLine(l: LineMaster) {
    setLineMasters((prev) => {
      const exists = prev.find((x) => x.id === l.id);
      return exists ? prev.map((x) => (x.id === l.id ? l : x)) : [...prev, l];
    });
    setLineModal({ open: false, target: null });
  }

  function deleteLine(id: string) {
    setLineMasters((prev) => prev.filter((x) => x.id !== id));
  }

  // ---- 取引先操作 ----
  function saveClient(c: ClientMaster) {
    setClients((prev) => prev.map((x) => (x.id === c.id ? c : x)));
    setClientModal({ open: false, target: null });
  }

  const tabs: { key: TabType; label: string }[] = [
    { key: 'worker', label: '作業者マスタ' },
    { key: 'line',   label: 'ラインマスタ' },
    { key: 'client', label: '取引先マスタ' },
  ];

  return (
    <div>
      <PageHeader title="マスタ管理" />

      {/* タブ */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e8ecf0] mb-6">
        <div className="flex border-b border-[#e8ecf0]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-[#4361ee] border-b-2 border-[#4361ee] -mb-px'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* ---- 作業者マスタ ---- */}
          {activeTab === 'worker' && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setWorkerModal({ open: true, target: null })}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#4361ee] text-white rounded-lg hover:bg-[#3451d1] transition-colors"
                >
                  <Plus size={15} />
                  新規登録
                </button>
              </div>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-[#e8ecf0]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">社員番号</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">氏名</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">所属部門</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">状態</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((w) => (
                    <tr key={w.id} className="border-b border-[#e8ecf0] hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">{w.employeeNumber}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{w.name}</td>
                      <td className="px-4 py-3 text-gray-600">{w.department}</td>
                      <td className="px-4 py-3">
                        <StatusBadge label={w.isActive ? '有効' : '無効'} variant={w.isActive ? 'success' : 'default'} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setWorkerModal({ open: true, target: w })}
                            className="flex items-center gap-1 text-xs text-[#4361ee] hover:underline"
                          >
                            <Pencil size={13} />
                            編集
                          </button>
                          <button
                            onClick={() => deleteWorker(w.id)}
                            className="flex items-center gap-1 text-xs text-red-500 hover:underline"
                          >
                            <Trash2 size={13} />
                            削除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ---- ラインマスタ ---- */}
          {activeTab === 'line' && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setLineModal({ open: true, target: null })}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#4361ee] text-white rounded-lg hover:bg-[#3451d1] transition-colors"
                >
                  <Plus size={15} />
                  新規登録
                </button>
              </div>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-[#e8ecf0]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">ライン名</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">生産能力（個/日）</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">状態</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {lineMasters.map((l) => (
                    <tr key={l.id} className="border-b border-[#e8ecf0] hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{l.name}</td>
                      <td className="px-4 py-3 text-gray-600">{l.capacity.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <StatusBadge label={l.isActive ? '有効' : '無効'} variant={l.isActive ? 'success' : 'default'} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setLineModal({ open: true, target: l })}
                            className="flex items-center gap-1 text-xs text-[#4361ee] hover:underline"
                          >
                            <Pencil size={13} />
                            編集
                          </button>
                          <button
                            onClick={() => deleteLine(l.id)}
                            className="flex items-center gap-1 text-xs text-red-500 hover:underline"
                          >
                            <Trash2 size={13} />
                            削除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ---- 取引先マスタ ---- */}
          {activeTab === 'client' && (
            <div>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-[#e8ecf0]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">取引先名</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">フォーマット種別</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">状態</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c.id} className="border-b border-[#e8ecf0] hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                      <td className="px-4 py-3 text-gray-600">{c.formatType}</td>
                      <td className="px-4 py-3">
                        <StatusBadge label={c.isActive ? '有効' : '無効'} variant={c.isActive ? 'success' : 'default'} />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setClientModal({ open: true, target: c })}
                          className="flex items-center gap-1 text-xs text-[#4361ee] hover:underline"
                        >
                          <Pencil size={13} />
                          編集
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* モーダル */}
      {workerModal.open && (
        <WorkerModal
          initial={workerModal.target}
          existingNumbers={workers.map((w) => w.employeeNumber)}
          onSave={saveWorker}
          onClose={() => setWorkerModal({ open: false, target: null })}
        />
      )}
      {lineModal.open && (
        <LineModal
          initial={lineModal.target}
          onSave={saveLine}
          onClose={() => setLineModal({ open: false, target: null })}
        />
      )}
      {clientModal.open && clientModal.target && (
        <ClientModal
          initial={clientModal.target}
          onSave={saveClient}
          onClose={() => setClientModal({ open: false, target: null })}
        />
      )}
    </div>
  );
}
