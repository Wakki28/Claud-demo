// QC マスタ管理画面専用 CSS（<style> タグ注入用）
export const QC_CSS = `
*{box-sizing:border-box;margin:0;padding:0;}
.qc-app{display:flex;flex-direction:column;min-height:100vh;font-family:"Meiryo","MS PGothic","Yu Gothic",sans-serif;font-size:13px;background:#f0f2f5;color:#333;}
.hdr{background:#1975D0;color:#fff;height:46px;display:flex;align-items:center;padding:0 16px;gap:10px;border-bottom:1px solid #1562b0;flex-shrink:0;}
.hdr-ham{display:flex;flex-direction:column;gap:4px;cursor:pointer;}
.hdr-ham span{display:block;width:16px;height:2px;background:#fff;border-radius:1px;}
.hdr-ml{font-size:10px;color:#cde;text-align:center;margin-top:1px;}
.hdr-sep{display:flex;flex-direction:column;align-items:center;gap:1px;margin-right:4px;}
.hdr-title{font-size:17px;font-weight:700;flex:1;letter-spacing:.02em;}
.hdr-user{font-size:11px;text-align:right;line-height:1.8;color:#ddeeff;}
.sel-bar{background:#fff;padding:10px 20px 12px;border-bottom:1px solid #dde2ea;display:flex;align-items:flex-end;gap:20px;}
.sel-grp{display:flex;flex-direction:column;gap:4px;}
.sel-lbl{font-size:12px;color:#444;display:flex;align-items:center;gap:2px;}
.sel-lbl em{color:#d32f2f;font-style:normal;}
.sel-select{border:1px solid #9ab0c8;border-radius:3px;padding:5px 30px 5px 10px;font-size:13px;height:36px;min-width:230px;background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23666'/%3E%3C/svg%3E") no-repeat right 10px center;appearance:none;}
.btn-disp{background:#2d6db5;color:#fff;border:none;border-radius:3px;padding:0 22px;height:36px;font-size:13px;cursor:pointer;font-weight:500;}
.btn-disp:hover{background:#245fa0;}
.content{flex:1;padding:16px 20px;}
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:420px;gap:14px;background:#fff;border:1px solid #dde2ea;border-radius:3px;}
.empty-ico{font-size:52px;color:#b8c4d0;}
.empty-ttl{font-size:15px;color:#555;font-weight:600;}
.empty-dsc{font-size:12px;color:#999;}
.tab-row{display:flex;align-items:flex-end;border-bottom:2px solid #dde2ea;margin-bottom:12px;}
.tab-btn{padding:7px 22px 8px;font-size:13px;border:none;background:transparent;color:#888;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;white-space:nowrap;}
.tab-btn:hover{color:#2d6db5;}
.tab-btn.act{color:#2d6db5;font-weight:600;border-bottom:2px solid #2d6db5;}
.srch-wrap{background:#fff;border:1px solid #dde2ea;border-radius:3px;padding:12px 16px 10px;margin-bottom:10px;}
.srch-grid{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;}
.srch-lbl{font-size:12px;color:#555;white-space:nowrap;}
.srch-inp{border:1px solid #afc0d2;border-radius:3px;padding:4px 8px;font-size:12px;height:28px;background:#fff;}
.srch-inp::placeholder{color:#bbb;}
.srch-inp:focus{outline:none;border-color:#2d6db5;}
.srch-sel{border:1px solid #afc0d2;border-radius:3px;padding:3px 5px;font-size:12px;height:28px;background:#fff;}
.srch-acts{display:flex;gap:6px;justify-content:flex-end;}
.btn-clr{background:#fff;color:#555;border:1px solid #afc0d2;border-radius:3px;padding:0 14px;height:28px;font-size:12px;cursor:pointer;}
.btn-clr:hover{background:#f4f6f9;}
.btn-srch{background:#2d6db5;color:#fff;border:none;border-radius:3px;padding:0 16px;height:28px;font-size:12px;cursor:pointer;}
.btn-srch:hover{background:#245fa0;}
.tbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;flex-wrap:wrap;gap:6px;}
.tbar-l{display:flex;align-items:center;gap:10px;}
.tbar-r{display:flex;align-items:center;gap:5px;}
.total-lbl{font-size:13px;color:#555;}
.ps-area{display:flex;align-items:center;gap:4px;font-size:13px;color:#555;}
.ps-sel{border:1px solid #afc0d2;border-radius:3px;padding:3px 18px 3px 6px;font-size:12px;height:26px;background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%23888'/%3E%3C/svg%3E") no-repeat right 5px center;appearance:none;min-width:56px;}
.btn-new{background:#29a745;color:#fff;border:none;border-radius:3px;padding:0 12px;height:28px;font-size:12px;cursor:pointer;white-space:nowrap;}
.btn-new:hover:not(:disabled){background:#228a3a;}
.btn-new:disabled{opacity:0.45;cursor:not-allowed;}
.btn-imp,.btn-exp{background:#fff;color:#444;border:1px solid #afc0d2;border-radius:3px;padding:0 10px;height:28px;font-size:12px;cursor:pointer;white-space:nowrap;}
.btn-imp:hover:not(:disabled),.btn-exp:hover:not(:disabled){background:#f4f6f9;}
.btn-imp:disabled,.btn-exp:disabled{opacity:0.45;cursor:not-allowed;}
.tbl-cb{width:32px;text-align:center;padding:4px 2px;}
.tbl-outer{border:1px solid #dde2ea;border-radius:3px;background:#fff;overflow:hidden;}
.tbl-wrap{overflow-x:auto;}
table{width:100%;border-collapse:collapse;font-size:12px;}
th{background:#1975D0;color:#fff;font-weight:600;padding:7px 8px;border-bottom:2px solid #9ca3af;border-right:1px solid #1562b0;text-align:left;white-space:nowrap;}
th:last-child{border-right:none;}
td{padding:6px 8px;border-bottom:1px solid #d1d5db;border-right:1px solid #e5e7eb;vertical-align:middle;white-space:nowrap;font-size:12px;}
td:last-child{border-right:none;}
tr:last-child td{border-bottom:none;}
.no-data{text-align:center;color:#aaa;padding:32px 0;}
.bdg-ok{font-size:11px;font-weight:700;color:#22c55e;}
.bdg-ng{font-size:11px;font-weight:700;color:#ef4444;}
.bdg-na{font-size:11px;font-weight:700;color:#9ca3af;}
.bdg-unregistered{display:inline-block;padding:1px 6px;border-radius:2px;font-size:11px;font-weight:700;background:#fff3e0;color:#e65100;border:1px solid #ffb74d;white-space:nowrap;}
.badge-added{font-size:11px;font-weight:700;color:#1d4ed8;}
.badge-updated{font-size:11px;font-weight:700;color:#c2410c;}
tr.row-added   td{background:#eff6ff !important;}
tr.row-updated td{background:#fff7ed !important;}
tr td.group-cell,tr td.overall-cell{background:#fff !important;}
.th-inspect{background:#1975D0;}
.th-reg{background:#1975D0;}
.btn-edt{background:#fff;color:#2d6db5;border:1px solid #2d6db5;border-radius:2px;padding:2px 8px;font-size:11px;cursor:pointer;margin-right:3px;}
.btn-edt:hover{background:#e8f0fb;}
.btn-dlt{background:#fff;color:#c62828;border:1px solid #c62828;border-radius:2px;padding:2px 8px;font-size:11px;cursor:pointer;}
.btn-dlt:hover{background:#fdecea;}
.file-link{color:#2d6db5;cursor:pointer;font-size:12px;}
.file-link:hover{text-decoration:underline;}
.file-dash{color:#aaa;}
.pgr{display:flex;align-items:center;justify-content:center;padding:9px 14px;border-top:1px solid #edf0f5;gap:3px;}
.pgr-info{font-size:12px;color:#777;margin-left:8px;}
.pg-btn{min-width:28px;height:26px;border:1px solid #c8d4e4;border-radius:3px;background:#fff;color:#444;font-size:12px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0 6px;white-space:nowrap;}
.pg-btn.act{background:#2d6db5;color:#fff;border-color:#2d6db5;font-weight:600;}
.pg-btn:disabled{color:#bbb;cursor:default;background:#f8f8f8;}
.pg-btn:hover:not(:disabled):not(.act){background:#f0f4fa;}
.ov{position:fixed;inset:0;background:rgba(60,60,80,.55);display:flex;align-items:center;justify-content:center;z-index:1000;}
.modal{background:#fff;border:2px solid #2d6db5;border-radius:4px;width:560px;max-width:96vw;max-height:92vh;display:flex;flex-direction:column;}
.m-hdr{background:#fff;padding:14px 20px 11px;font-size:15px;font-weight:600;color:#222;border-bottom:1px solid #e0e6f0;}
.m-body{padding:14px 20px;overflow-y:auto;flex:1;}
.m-sec{display:flex;align-items:center;gap:4px;font-size:12px;color:#555;margin:13px 0 9px;padding-bottom:4px;border-bottom:1px solid #e4e8f0;}
.m-sec:first-child{margin-top:0;}
.m-sec-ico{color:#2d6db5;}
.m-row2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:9px;}
.m-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:9px;}
.m-field{display:flex;flex-direction:column;gap:4px;margin-bottom:9px;}
.m-lbl{font-size:12px;color:#444;display:flex;align-items:center;gap:3px;}
.m-req{color:#d32f2f;}
.m-hint{font-size:11px;color:#2d6db5;margin-left:4px;}
.m-inp{border:1px solid #afc0d2;border-radius:3px;padding:5px 8px;font-size:13px;height:34px;width:100%;}
.m-inp::placeholder{color:#bbb;}
.m-inp:focus{outline:none;border-color:#2d6db5;box-shadow:0 0 0 2px rgba(45,109,181,.12);}
.m-num{border:1px solid #afc0d2;border-radius:3px;padding:5px 8px;font-size:13px;height:34px;width:100%;}
.m-num:focus{outline:none;border-color:#2d6db5;box-shadow:0 0 0 2px rgba(45,109,181,.12);}
.m-sel{border:1px solid #afc0d2;border-radius:3px;padding:5px 8px;font-size:13px;height:34px;width:100%;background:#fff;}
.m-sel:focus{outline:none;border-color:#2d6db5;}
.m-sel:disabled{background:#f4f6f9;color:#999;cursor:default;}
.m-auto-val{display:flex;align-items:center;gap:6px;}
.upload-area{border:2px dashed #a8bfd4;border-radius:6px;padding:20px 16px;background:#f7fafd;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;min-height:90px;}
.upload-area:hover,.upload-area.drag{border-color:#2d6db5;background:#eef4fb;}
.upload-area.has-file{border-style:solid;border-color:#2d6db5;background:#eef4fb;}
.upload-icon{font-size:28px;color:#7aa8d4;line-height:1;}
.upload-txt{font-size:12px;color:#666;text-align:center;line-height:1.6;}
.upload-sub{font-size:11px;color:#aaa;}
.upload-fname{font-size:12px;color:#2d6db5;font-weight:600;word-break:break-all;text-align:center;}
.upload-clr{background:none;border:none;color:#999;font-size:18px;cursor:pointer;line-height:1;margin-top:-4px;}
.prev-thumb{margin-top:8px;max-height:60px;max-width:100%;object-fit:contain;border:1px solid #dde2ea;border-radius:2px;}
.dlg-ov{position:fixed;inset:0;background:rgba(60,60,80,.55);display:flex;align-items:center;justify-content:center;z-index:2000;}
.dlg{background:#fff;border:2px solid #43a047;border-radius:4px;width:280px;}
.dlg-body{padding:24px 20px 18px;text-align:center;}
.dlg-msg{font-size:14px;color:#222;margin-bottom:18px;}
.dlg-ok{background:#2d6db5;color:#fff;border:none;border-radius:3px;padding:6px 40px;font-size:13px;cursor:pointer;font-weight:500;}
.dlg-ok:hover{background:#245fa0;}
.prev-modal{background:#fff;border-radius:4px;width:680px;max-width:95vw;max-height:88vh;display:flex;flex-direction:column;border:1px solid #dde2ea;}
.prev-hdr{background:#2d6db5;color:#fff;padding:9px 14px;font-size:13px;font-weight:600;display:flex;justify-content:space-between;align-items:center;}
.prev-cls{background:none;border:none;color:#fff;font-size:20px;cursor:pointer;}
.prev-body{flex:1;overflow:auto;padding:16px;display:flex;align-items:center;justify-content:center;min-height:200px;}
.prev-img{max-width:100%;max-height:60vh;object-fit:contain;}
.prev-pdf{width:100%;height:60vh;border:none;}
.prev-nodata{color:#aaa;font-size:13px;text-align:center;}
.tag-new{display:inline-block;padding:1px 6px;border-radius:2px;font-size:10px;background:#fff8e1;color:#b36200;border:1px solid #ffd08a;margin-left:4px;vertical-align:middle;white-space:nowrap;}
.tag-edited{display:inline-block;padding:1px 6px;border-radius:2px;font-size:10px;background:#e8f0fb;color:#1a4f9c;border:1px solid #9db8e8;margin-left:4px;vertical-align:middle;white-space:nowrap;}
tr.row-new td{background:#fffde7;}
tr.row-new:hover td{background:#fff8cc;}
tr.row-edited td{background:#f0f5fc;}
tr.row-edited:hover td{background:#e4eefb;}
.anomaly-trigger{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;margin-left:5px;background:#fff3cd;border:1px solid #ffc107;border-radius:50%;color:#856404;font-size:10px;font-weight:700;cursor:pointer;vertical-align:middle;flex-shrink:0;user-select:none;}
.anomaly-trigger:hover{background:#ffe69c;border-color:#e0a800;}
.anomaly-popup{background:#fff;border:1px solid #dde2ea;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,.18),0 1px 6px rgba(0,0,0,.1);max-width:320px;min-width:180px;z-index:9999;padding:12px 14px;font-size:12px;color:#333;white-space:normal;word-break:break-word;line-height:1.6;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);}
@supports(anchor-name:--test){.anomaly-trigger-active{anchor-name:--active-anomaly;}.anomaly-popup{position:fixed;position-anchor:--active-anomaly;top:anchor(bottom);left:anchor(left);transform:none;margin-top:6px;position-try-fallbacks:flip-block,flip-inline,flip-block flip-inline;}}
.anomaly-popup::before{content:'';position:absolute;top:-6px;left:10px;width:10px;height:10px;background:#fff;border-top:1px solid #dde2ea;border-left:1px solid #dde2ea;transform:rotate(45deg);}
.anomaly-popup-hdr{font-size:11px;font-weight:700;color:#c62828;display:flex;align-items:center;gap:4px;margin-bottom:6px;padding-bottom:5px;border-bottom:1px solid #f5dada;}
.anomaly-popup-reason{color:#333;font-size:12px;line-height:1.6;}
.anomaly-popup-time{font-size:11px;color:#888;margin-top:6px;padding-top:5px;border-top:1px solid #edf0f5;}
.mod-badge-btn{cursor:pointer;position:relative;user-select:none;}
.mod-badge-btn:hover{background:#fed7aa;border-color:#f97316;}
.mod-badge-btn-active{background:#fed7aa;border-color:#f97316;}
.mod-history-popup{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border:1px solid #dde2ea;border-radius:8px;box-shadow:0 4px 24px rgba(0,0,0,.22),0 1px 6px rgba(0,0,0,.1);min-width:300px;max-width:380px;z-index:9999;padding:14px 16px;font-size:12px;color:#333;white-space:normal;word-break:break-word;line-height:1.6;text-align:left;}
@supports(anchor-name:--test){.mod-badge-btn-active{anchor-name:--active-mod;}.mod-history-popup{position:fixed;position-anchor:--active-mod;top:anchor(bottom);left:anchor(left);transform:none;margin-top:6px;position-try-fallbacks:flip-block,flip-inline,flip-block flip-inline;}}
.mod-history-hdr{font-size:12px;font-weight:700;color:#c2410c;display:flex;align-items:center;gap:4px;margin-bottom:10px;padding-bottom:7px;border-bottom:2px solid #fed7aa;}
.mod-history-section{font-size:11px;font-weight:600;color:#555;margin:10px 0 5px;padding-top:8px;border-top:1px solid #edf0f5;}
.mod-history-tbl{width:100%;border-collapse:collapse;}
.mod-history-tbl th{font-size:11px;color:#888;font-weight:500;text-align:left;padding:3px 6px 3px 0;white-space:nowrap;width:60px;background:transparent;border:none;}
.change-type-cell{position:relative;cursor:pointer;}
.mod-history-tbl td{font-size:12px;color:#333;padding:3px 0;}
.ie-modal{background:#fff;border:2px solid #2d6db5;border-radius:4px;width:520px;max-width:96vw;max-height:90vh;display:flex;flex-direction:column;}
.ie-hdr{background:#2d6db5;color:#fff;padding:11px 16px;font-size:14px;font-weight:600;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;}
.ie-cls{background:none;border:none;color:#fff;font-size:18px;cursor:pointer;line-height:1;padding:0 2px;}
.ie-tabs{display:flex;border-bottom:2px solid #dde2ea;flex-shrink:0;}
.ie-tab{padding:8px 24px 9px;font-size:13px;border:none;background:transparent;color:#888;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;}
.ie-tab:hover{color:#2d6db5;}
.ie-tab.ie-tab-act{color:#2d6db5;font-weight:600;border-bottom:2px solid #2d6db5;}
.ie-body{padding:16px 20px;overflow-y:auto;flex:1;}
.ie-desc{font-size:12px;color:#666;margin-bottom:12px;}
.ie-drop{border:2px dashed #a8bfd4;border-radius:6px;padding:28px 20px;background:#f7fafd;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;min-height:120px;text-align:center;}
.ie-drop:hover,.ie-drop.ie-drop-over{border-color:#2d6db5;background:#eef4fb;}
.ie-drop.ie-drop-has{border-style:solid;border-color:#2d6db5;background:#eef4fb;}
.ie-drop-ico{font-size:32px;line-height:1;}
.ie-drop-txt{font-size:13px;color:#555;}
.ie-drop-sub{font-size:11px;color:#aaa;}
.ie-drop-fname{font-size:13px;color:#2d6db5;font-weight:600;word-break:break-all;}
.ie-drop-clr{background:none;border:1px solid #aaa;border-radius:3px;color:#888;font-size:12px;cursor:pointer;padding:2px 10px;margin-top:4px;}
.ie-drop-clr:hover{background:#f0f0f0;}
.ie-col-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.ie-col-cnt{font-size:12px;color:#888;}
.ie-col-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px 12px;margin-bottom:16px;padding:12px;background:#f7f9fc;border:1px solid #e4eaf3;border-radius:4px;}
.ie-chk-lbl{display:flex;align-items:center;gap:5px;font-size:12px;color:#333;cursor:pointer;white-space:nowrap;}
.ie-chk-lbl input{cursor:pointer;accent-color:#2d6db5;}
.ie-foot{display:flex;justify-content:flex-end;gap:8px;padding-top:12px;border-top:1px solid #edf0f5;margin-top:4px;}
.ie-btn-cancel{background:#fff;color:#555;border:1px solid #afc0d2;border-radius:3px;padding:6px 20px;font-size:13px;cursor:pointer;}
.ie-btn-cancel:hover{background:#f4f6f9;}
.ie-btn-exec{background:#2d6db5;color:#fff;border:none;border-radius:3px;padding:6px 22px;font-size:13px;cursor:pointer;font-weight:500;}
.ie-btn-exec:hover:not(:disabled){background:#245fa0;}
.ie-btn-exec:disabled{background:#a0b8d4;cursor:default;}
.ie-btn-exec.ie-btn-done{background:#29a745;}
.group-cell{vertical-align:top;padding:6px 8px;min-width:160px;white-space:nowrap;}
tr.group-separator td{border-top:2px solid #9ca3af !important;}
.item-cell{vertical-align:top;padding-top:6px;}
.stage-cell{text-align:center;font-size:12px;font-weight:normal;color:#333;min-width:48px;vertical-align:middle;}
.n-idx-cell{text-align:center;font-size:11px;color:#888;min-width:36px;}
.overall-cell{text-align:center;min-width:72px;cursor:default;position:relative;vertical-align:middle;}
.overall-cell:hover{background:#fff !important;}
.overall-cell-readonly{cursor:default !important;}
.overall-cell-readonly:hover{background:inherit !important;}
.overall-edit-wrap{display:inline-flex;gap:4px;justify-content:center;align-items:center;}
.btn-overall-ok{background:#dcfce7;color:#16a34a;border:1px solid #86efac;border-radius:3px;padding:2px 8px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;}
.btn-overall-ok:hover{background:#bbf7d0;}
.btn-overall-ng{background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;border-radius:3px;padding:2px 8px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;}
.btn-overall-ng:hover{background:#fecaca;}
.btn-overall-cancel{background:#fff;color:#888;border:1px solid #d1d5db;border-radius:3px;padding:2px 6px;font-size:11px;cursor:pointer;}
.btn-overall-cancel:hover{background:#f9fafb;}
`;

