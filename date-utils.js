/* =================================================
   📅 날짜/시간 포맷 유틸
   Ha-Bin Studio 공통 규칙
   - 모든 시간 표시의 단일 진실 원천
================================================= */
function formatDate(dateStr) {
  if (!dateStr) return "";

  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}
