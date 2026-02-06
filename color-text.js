/* ======================================================
   🎨 color-text.js — Text Color Engine (MULTILINE SAFE)
   규칙:
   - 드래그된 텍스트만 적용
   - 여러 줄 드래그 가능
   - 각 줄별로 분리 적용
   - 커서만 있으면 아무것도 안 함
====================================================== */

window.ColorTextEngine = (function () {

  function apply(color) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    if (range.collapsed) return;

    const editor = document.getElementById("hb-editor");
    if (!editor) return;

    // 선택 영역 안의 텍스트 노드 수집
    const textNodes = [];

    const walker = document.createTreeWalker(
      editor,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          if (range.intersectsNode(node)) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        }
      }
    );

    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    // 각 텍스트 노드별로 실제 선택 범위만 처리
    textNodes.forEach(textNode => {
      const nodeRange = document.createRange();
      nodeRange.selectNodeContents(textNode);

      const start = Math.max(
        range.startContainer === textNode ? range.startOffset : 0,
        0
      );
      const end = Math.min(
        range.endContainer === textNode ? range.endOffset : textNode.length,
        textNode.length
      );

      if (start >= end) return;

      nodeRange.setStart(textNode, start);
      nodeRange.setEnd(textNode, end);

      const span = document.createElement("span");
      span.style.color = color;

      span.appendChild(nodeRange.extractContents());
      nodeRange.insertNode(span);
    });
    }
    
return { apply };
})();

