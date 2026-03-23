type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getPagerItems(currentPage: number, totalPages: number): (number | "...")[] {
  const pages: (number | "...")[] = [];
  const delta = 2;
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }
  return pages;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = getPagerItems(currentPage, totalPages);

  return (
    <div className="pgr">
      <button
        className="pg-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        前へ
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} style={{ padding: "0 3px", color: "#aaa", fontSize: 12 }}>
            …
          </span>
        ) : (
          <button
            key={p}
            className={`pg-btn${p === currentPage ? " act" : ""}`}
            onClick={() => onPageChange(p as number)}
          >
            {p}
          </button>
        ),
      )}

      <button
        className="pg-btn"
        disabled={currentPage === totalPages || totalPages === 0}
        onClick={() => onPageChange(currentPage + 1)}
      >
        次へ
      </button>
      <span className="pgr-info">
        {currentPage} / {Math.max(totalPages, 1)} ページ
      </span>
    </div>
  );
}
