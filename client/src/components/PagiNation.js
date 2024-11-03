import "./PagiNation.css";

export function PagiNation({
  currentPage,
  totalPages,
  pageGroup,
  onPageChange,
  onPrevGroup,
  onNextGroup,
}) {
  // 한 그룹(ex.1~5)의 첫 페이지와 끝 페이지 정의
  const startPage = pageGroup * 5 + 1;
  // 총 페이지 수가 마지막 페이지가 되도록 V
  const endPage = Math.min(startPage + 4, totalPages);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button onClick={onPrevGroup} disabled={pageGroup === 0}>
        &lt;
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? "active" : ""}
        >
          {page}
        </button>
      ))}
      <button
        onClick={onNextGroup}
        disabled={(pageGroup + 1) * 5 >= totalPages}
      >
        &gt;
      </button>
    </div>
  );
}
