/* ======================================================
   🎨 color-bg.js — Background Color Engine (MULTILINE SAFE)
====================================================== */

window.ColorBgEngine = (function () {

  function apply(color) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    if (range.collapsed) return;

    const editor = document.getElementById("hb-editor");
    if (!editor) return;

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
      span.style.backgroundColor = color;

      span.appendChild(nodeRange.extractContents());
      nodeRange.insertNode(span);
    });
    }
     
  return { apply };
})();

