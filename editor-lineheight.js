/* ======================================================
   📏 editor-lineheight.js — LineHeightEngine v3.0
   Ha-Bin Studio · Constitution Edition
   ------------------------------------------------------
   원칙:
   - 줄간격은 "상태(state)"다
   - 적용 대상은 문단(block) 하나
   - selection ❌ / 숫자 ❌ / inline style ❌
   - 클래스 토글만 허용
   - 단독 사용 가능 (Core / Toolbar와 독립)
====================================================== */

window.LineHeightEngine = (function () {

  /* ==================================================
     고정 상수 (네이밍 헌법)
  ================================================== */
  const VARIANTS = [
    "lh-12",
    "lh-16",
    "lh-18",
    "lh-20"
  ];

  /* ==================================================
     내부 유틸
  ================================================== */

  function isBlock(node) {
    return (
      node &&
      node.nodeType === 1 &&
      node.hasAttribute("data-hb-block")
    );
  }

  function getBlockFromNode(node) {
    if (!node) return null;
    if (node.nodeType === 3) node = node.parentNode;
    return node.closest && node.closest("[data-hb-block]");
  }

  function clearVariants(block) {
    if (!block) return;
    VARIANTS.forEach(v => block.classList.remove(v));
  }

  /* ==================================================
     Public API
  ================================================== */

  /**
   * 문단에 줄간격 예외 적용
   * @param {HTMLElement} block - data-hb-block 문단
   * @param {string} variant - "lh-12" | "lh-16" | "lh-18" | "lh-20"
   */
  function applyVariant(block, variant) {
    if (!isBlock(block)) return;
    if (!VARIANTS.includes(variant)) return;

    clearVariants(block);
    block.classList.add(variant);
  }

  /**
   * 문단을 기본 줄간격으로 복귀
   * @param {HTMLElement} block - data-hb-block 문단
   */
  function clearVariant(block) {
    if (!isBlock(block)) return;
    clearVariants(block);
  }

  /* ==================================================
     Export
  ================================================== */
  return {
    applyVariant,
    clearVariant
  };

})();

