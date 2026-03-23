import { CAT_OPTIONS, NAME_MAP } from "../../data/qcData";

type SelectorBarProps = {
  category: string;
  masterName: string;
  onCategoryChange: (value: string) => void;
  onMasterNameChange: (value: string) => void;
  onShow: () => void;
};

export default function SelectorBar({
  category,
  masterName,
  onCategoryChange,
  onMasterNameChange,
  onShow,
}: SelectorBarProps) {
  return (
    <div className="sel-bar">
      <div className="sel-grp">
        <div className="sel-lbl">
          マスタカテゴリ<em>*</em>
        </div>
        <select
          className="sel-select"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {CAT_OPTIONS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <div className="sel-grp">
        <div className="sel-lbl">
          マスタ名<em>*</em>
        </div>
        <select
          className="sel-select"
          value={masterName}
          onChange={(e) => onMasterNameChange(e.target.value)}
        >
          {(NAME_MAP[category] ?? []).map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <button className="btn-disp" onClick={onShow}>
        表示
      </button>
    </div>
  );
}
