type SuccessDialogProps = {
  message: string;
  onClose: () => void;
};

export default function SuccessDialog({ message, onClose }: SuccessDialogProps) {
  return (
    <div className="dlg-ov">
      <div className="dlg">
        <div className="dlg-body">
          <div className="dlg-msg">{message}</div>
          <button className="dlg-ok" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
