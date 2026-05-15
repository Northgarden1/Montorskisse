(function () {
  const PADDING = 9;
  const MIN_WIDTH = 80;
  const MIN_HEIGHT = 42;
  const LINE_HEIGHT_RATIO = 1.18;

  function font(annotation) {
    return `800 ${annotation.size || 28}px system-ui, sans-serif`;
  }

  function breakLongToken(context, token, maxWidth) {
    const chunks = [];
    let current = "";
    Array.from(token).forEach((character) => {
      const next = current + character;
      if (current && context.measureText(next).width > maxWidth) {
        chunks.push(current);
        current = character;
      } else {
        current = next;
      }
    });
    if (current) chunks.push(current);
    return chunks.length ? chunks : [token];
  }

  function wrapLines(context, text, maxWidth) {
    const paragraphs = String(text || "").split(/\r?\n/);
    const lines = [];
    paragraphs.forEach((paragraph) => {
      const words = paragraph.trim().split(/\s+/).filter(Boolean);
      if (!words.length) {
        lines.push("");
        return;
      }
      let line = "";
      words.forEach((word) => {
        const candidate = line ? `${line} ${word}` : word;
        if (context.measureText(candidate).width <= maxWidth) {
          line = candidate;
          return;
        }
        if (line) lines.push(line);
        if (context.measureText(word).width > maxWidth) {
          const chunks = breakLongToken(context, word, maxWidth);
          lines.push(...chunks.slice(0, -1));
          line = chunks[chunks.length - 1] || "";
        } else {
          line = word;
        }
      });
      if (line) lines.push(line);
    });
    return lines.length ? lines : [""];
  }

  function naturalWidth(context, annotation) {
    const rawLines = String(annotation.text || "").split(/\r?\n/);
    const contentWidth = rawLines.reduce((max, line) => Math.max(max, context.measureText(line).width), 0);
    return Math.max(MIN_WIDTH, contentWidth + PADDING * 2);
  }

  function layout(context, annotation) {
    context.save();
    context.font = font(annotation);
    const requestedWidth = Number(annotation.width);
    const width = Math.max(
      MIN_WIDTH,
      Number.isFinite(requestedWidth) ? requestedWidth : naturalWidth(context, annotation)
    );
    const contentWidth = Math.max(1, width - PADDING * 2);
    const lines = wrapLines(context, annotation.text || "", contentWidth);
    const lineHeight = Math.ceil((annotation.size || 28) * LINE_HEIGHT_RATIO);
    const naturalHeight = Math.max(MIN_HEIGHT, lines.length * lineHeight + PADDING * 2);
    const requestedHeight = Number(annotation.height);
    const height = Math.max(
      MIN_HEIGHT,
      naturalHeight,
      Number.isFinite(requestedHeight) ? requestedHeight : naturalHeight
    );
    context.restore();
    return {
      x: annotation.x,
      y: annotation.y,
      w: width,
      h: height,
      padding: PADDING,
      lineHeight,
      lines
    };
  }

  window.MontorTextBox = {
    MIN_WIDTH,
    MIN_HEIGHT,
    font,
    layout
  };
})();
