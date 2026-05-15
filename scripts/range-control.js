(function () {
  let activeRange = null;

  function numericAttribute(input, name, fallback) {
    const value = Number(input.getAttribute(name));
    return Number.isFinite(value) ? value : fallback;
  }

  function decimalPlaces(value) {
    const text = String(value);
    const exponent = text.match(/e-(\d+)$/i);
    if (exponent) return Number(exponent[1]);
    const decimal = text.split(".")[1];
    return decimal ? decimal.length : 0;
  }

  function normalizeRangeValue(input, rawValue) {
    const min = numericAttribute(input, "min", 0);
    const max = numericAttribute(input, "max", 100);
    const stepAttr = input.getAttribute("step");
    const clamped = Math.min(max, Math.max(min, rawValue));
    if (stepAttr === "any") return String(clamped);

    const step = Number(stepAttr || 1);
    if (!Number.isFinite(step) || step <= 0) return String(clamped);

    const stepped = min + Math.round((clamped - min) / step) * step;
    const precision = Math.max(decimalPlaces(step), decimalPlaces(min), 2);
    return String(Number(Math.min(max, Math.max(min, stepped)).toFixed(precision)));
  }

  function valueFromPointer(input, clientX) {
    const rect = input.getBoundingClientRect();
    if (!rect.width) return input.value;
    const min = numericAttribute(input, "min", 0);
    const max = numericAttribute(input, "max", 100);
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return normalizeRangeValue(input, min + (max - min) * ratio);
  }

  function dispatchRangeEvent(input, type) {
    input.dispatchEvent(new Event(type, { bubbles: true }));
  }

  function updateRangeFromPointer(input, event) {
    const nextValue = valueFromPointer(input, event.clientX);
    if (input.value === nextValue) return false;
    input.value = nextValue;
    dispatchRangeEvent(input, "input");
    return true;
  }

  function finishRangeDrag(event) {
    if (!activeRange || event.pointerId !== activeRange.pointerId) return;
    const { input, changed } = activeRange;
    input.releasePointerCapture?.(event.pointerId);
    input.removeEventListener("pointermove", handleRangeMove);
    input.removeEventListener("pointerup", finishRangeDrag);
    input.removeEventListener("pointercancel", finishRangeDrag);
    activeRange = null;
    if (changed) dispatchRangeEvent(input, "change");
  }

  function handleRangeMove(event) {
    if (!activeRange || event.pointerId !== activeRange.pointerId) return;
    event.preventDefault();
    if (updateRangeFromPointer(activeRange.input, event)) {
      activeRange.changed = true;
    }
  }

  document.addEventListener("pointerdown", (event) => {
    const input = event.target?.closest?.('input[type="range"]');
    if (!input || input.disabled) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    activeRange = {
      input,
      pointerId: event.pointerId,
      changed: false
    };
    input.setPointerCapture?.(event.pointerId);
    input.addEventListener("pointermove", handleRangeMove);
    input.addEventListener("pointerup", finishRangeDrag);
    input.addEventListener("pointercancel", finishRangeDrag);
    event.preventDefault();
    input.focus({ preventScroll: true });
    if (updateRangeFromPointer(input, event)) activeRange.changed = true;
  }, true);
})();
