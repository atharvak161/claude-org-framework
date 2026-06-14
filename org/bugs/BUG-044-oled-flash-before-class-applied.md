# BUG-044 — OLED Mode Flashes Non-OLED Content on Page Load

**Severity:** Medium
**File:** /Users/atharva/Downloads/organisation/src/projects/financial-dashboard/js/shared-layout.js (line 157–168)
**Symptom:** On pages where OLED mode is enabled, there is a brief flash of the normal (non-OLED) background before the OLED class is applied. Particularly noticeable on slower devices or when the CSS is not yet cached.
**Root cause:** `body.oled` is applied inside the OLED IIFE, which runs at the end of `renderSharedLayout()`, which is called from JavaScript after the page shell has already been painted by the browser. The HTML shell renders with default `--bg-*` variables first; the class override lands in a subsequent frame.
**Reproduction:**
1. Enable OLED mode on any page.
2. Hard-reload the page (Cmd+Shift+R) while watching the background colour.
3. Observe: brief white/grey flash before the black OLED background appears.
**Fix hint:** Apply `body.oled` (or inject an inline `<style>` override) in a `<script>` tag in the `<head>` of each HTML page, before any content renders — not inside the JS module that runs after layout.
