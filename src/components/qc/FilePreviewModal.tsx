import type { PreviewFile } from "../../types/qc";

type FilePreviewModalProps = {
  file: NonNullable<PreviewFile>;
  onClose: () => void;
};

const isImage = (n: string) => /\.(png|jpg|jpeg|gif|webp)$/i.test(n);
const isPdf = (n: string) => /\.pdf$/i.test(n);

export default function FilePreviewModal({ file, onClose }: FilePreviewModalProps) {
  return (
    <div className="ov" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="prev-modal">
        <div className="prev-hdr">
          {file.name}
          <button className="prev-cls" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="prev-body">
          {file.data && isImage(file.name) ? (
            <img src={file.data} alt={file.name} className="prev-img" />
          ) : file.data && isPdf(file.name) ? (
            <iframe src={file.data} className="prev-pdf" title={file.name} />
          ) : (
            <div className="prev-nodata">
              <div style={{ fontSize: 36, marginBottom: 8 }}>📄</div>
              <div>{file.name}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
