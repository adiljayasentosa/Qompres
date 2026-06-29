/**
 * =====================================================================
 * QOMPRES — Image Compressor
 * Main application script (js/app.js)
 * ---------------------------------------------------------------------
 * Table of contents:
 *   1. Theme Toggle (light / dark mode)
 *   2. Scroll Reveal Animation
 *   3. FAQ Accordion
 *   4. Image Compressor App
 *      4.1 State & DOM references
 *      4.2 Helpers (formatting, dimensions)
 *      4.3 File selection (input / drag & drop)
 *      4.4 Compression workflow
 *      4.5 Download handler
 *   5. Bootstrap
 *
 * Dependency: browser-image-compression (loaded via CDN in index.html,
 * exposes the global `imageCompression` function). Everything else in
 * this file is dependency-free vanilla JavaScript.
 * =====================================================================
 */

'use strict';

/* ---------------------------------------------------------------------
   1. Theme Toggle (light / dark mode)
   --------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  // Inline icon paths swapped depending on the active theme.
  const SUN_ICON_PATH =
    '<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/><circle cx="12" cy="12" r="5"/>';
  const MOON_ICON_PATH = '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';

  /**
   * Toggles the `dark` class on <body> and swaps the navbar icon.
   * @param {boolean} isDark
   */
  function applyTheme(isDark) {
    document.body.classList.toggle('dark', isDark);
    themeIcon.innerHTML = isDark ? SUN_ICON_PATH : MOON_ICON_PATH;
  }

  applyTheme(false); // Light mode is the default on first load.

  themeToggle.addEventListener('click', () => {
    applyTheme(!document.body.classList.contains('dark'));
  });
}

/* ---------------------------------------------------------------------
   2. Scroll Reveal Animation
   --------------------------------------------------------------------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------------------
   3. FAQ Accordion
   --------------------------------------------------------------------- */
function initFaqAccordion() {
  document.querySelectorAll('.faq-item').forEach((item) => {
    const question = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close any other open item (single-open accordion behaviour).
      document.querySelectorAll('.faq-item.open').forEach((openItem) => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-a').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });
}

/* ---------------------------------------------------------------------
   4. Image Compressor App
   --------------------------------------------------------------------- */
function initImageCompressor() {
  /* ---- 4.1 State & DOM references ------------------------------- */
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const pickBtn = document.getElementById('pickBtn');
  const heroPickBtn = document.getElementById('heroPickBtn');
  const thumbGrid = document.getElementById('thumbGrid');

  const qualitySlider = document.getElementById('qualitySlider');
  const qualityVal = document.getElementById('qualityVal');
  const resizeSelect = document.getElementById('resizeSelect');
  const formatBtns = document.querySelectorAll('.format-btn');
  const compressBtn = document.getElementById('compressBtn');

  const emptyResult = document.getElementById('emptyResult');
  const resultContent = document.getElementById('resultContent');
  const beforeImg = document.getElementById('beforeImg');
  const afterImg = document.getElementById('afterImg');
  const beforeSize = document.getElementById('beforeSize');
  const afterSize = document.getElementById('afterSize');
  const beforeDim = document.getElementById('beforeDim');
  const afterDim = document.getElementById('afterDim');
  const savingsNum = document.getElementById('savingsNum');
  const downloadBtn = document.getElementById('downloadBtn');
  const multiNote = document.getElementById('multiNote');

  // Markup re-used when (re)setting the "Kompres Gambar" button state.
  const COMPRESS_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h6v6M20 10h-6V4M10 14L3 21M14 10l7-7"/></svg> Kompres Gambar';
  const SPINNER_ICON =
    '<svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 12a9 9 0 11-9-9"/></svg> Mengompres...';

  const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB per file, per the UI copy.
  const ACCEPTED_TYPES = /image\/(jpeg|png|webp|svg\+xml)/;
  const MIME_BY_FORMAT = { jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

  let selectedFiles = [];
  let outputFormat = 'jpeg';
  let lastResults = []; // [{ blob, name }, ...] — populated after compression.

  /* ---- 4.2 Helpers -------------------------------------------------- */

  /**
   * Formats a byte count as a human-readable MB/KB string.
   * @param {number} bytes
   * @returns {string}
   */
  function formatFileSize(bytes) {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${Math.round(bytes / 1024)} KB`;
  }

  /**
   * Reads the natural width/height of an image from its object URL.
   * @param {string} url
   * @returns {Promise<{w: number, h: number}>}
   */
  function getImageDimensions(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.src = url;
    });
  }

  /* ---- 4.3 File selection (input / drag & drop) --------------------- */

  /**
   * Validates and stores the files chosen by the user, then renders
   * thumbnail previews and resets the result panel.
   * @param {FileList|File[]} files
   */
  function setSelectedFiles(files) {
    const validFiles = Array.from(files).filter(
      (file) => ACCEPTED_TYPES.test(file.type) && file.size <= MAX_FILE_SIZE_BYTES
    );
    if (!validFiles.length) return;

    selectedFiles = validFiles;

    thumbGrid.innerHTML = '';
    validFiles.forEach((file) => {
      const thumb = document.createElement('img');
      thumb.src = URL.createObjectURL(file);
      thumbGrid.appendChild(thumb);
    });

    compressBtn.disabled = false;
    resultContent.style.display = 'none';
    emptyResult.style.display = 'flex';
  }

  pickBtn.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent the dropzone's own click handler from firing twice.
    fileInput.click();
  });
  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (event) => setSelectedFiles(event.target.files));

  // The hero "Pilih Gambar" CTA scrolls to #app, then opens the file picker.
  heroPickBtn.addEventListener('click', () => {
    setTimeout(() => fileInput.click(), 400);
  });

  ['dragenter', 'dragover'].forEach((eventName) =>
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.add('drag');
    })
  );
  ['dragleave', 'drop'].forEach((eventName) =>
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.remove('drag');
    })
  );
  dropzone.addEventListener('drop', (event) => {
    if (event.dataTransfer.files.length) setSelectedFiles(event.dataTransfer.files);
  });

  qualitySlider.addEventListener('input', () => {
    qualityVal.textContent = `${qualitySlider.value}%`;
  });

  formatBtns.forEach((btn) =>
    btn.addEventListener('click', () => {
      formatBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      outputFormat = btn.dataset.format;
    })
  );

  /* ---- 4.4 Compression workflow -------------------------------------- */

  /**
   * Compresses a single file using browser-image-compression.
   * SVG files are passed through unchanged (raster compression
   * does not apply to vector graphics).
   * @param {File} file
   * @param {number} quality - 0–1
   * @param {number} maxDimension - 0 means "keep original size"
   * @returns {Promise<{blob: Blob, name: string}>}
   */
  async function compressSingleFile(file, quality, maxDimension) {
    if (file.type === 'image/svg+xml') {
      return { blob: file, name: file.name };
    }

    try {
      const options = {
        maxSizeMB: 20,
        useWebWorker: true,
        initialQuality: quality,
        fileType: MIME_BY_FORMAT[outputFormat],
      };
      if (maxDimension > 0) options.maxWidthOrHeight = maxDimension;

      const compressedBlob = await imageCompression(file, options);
      const extension = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
      const baseName = file.name.replace(/\.[^.]+$/, '');

      return { blob: compressedBlob, name: `${baseName}-qompres.${extension}` };
    } catch (error) {
      // Fail gracefully: fall back to the original file rather than
      // breaking the whole batch if one image fails to compress.
      console.error('Qompres: compression error for', file.name, error);
      return { blob: file, name: file.name };
    }
  }

  /**
   * Renders the before/after preview, file sizes, dimensions and the
   * total savings summary for the current batch of results.
   */
  async function renderCompressionResult(totalBefore, totalAfter, firstBeforeURL, firstAfterURL) {
    const [beforeDimensions, afterDimensions] = await Promise.all([
      getImageDimensions(firstBeforeURL),
      getImageDimensions(firstAfterURL || firstBeforeURL),
    ]);

    beforeImg.src = firstBeforeURL;
    afterImg.src = firstAfterURL;
    beforeSize.textContent = formatFileSize(selectedFiles[0].size);
    afterSize.textContent = formatFileSize(lastResults[0].blob.size);
    beforeDim.textContent = `${beforeDimensions.w} x ${beforeDimensions.h}`;
    afterDim.textContent = `${afterDimensions.w} x ${afterDimensions.h}`;

    const savedBytes = Math.max(totalBefore - totalAfter, 0);
    const savedPercent = totalBefore > 0 ? Math.round((savedBytes / totalBefore) * 100) : 0;
    savingsNum.textContent = `${formatFileSize(savedBytes)} (${savedPercent}%)`;

    if (selectedFiles.length > 1) {
      multiNote.style.display = 'block';
      multiNote.textContent = `Memproses ${selectedFiles.length} gambar. Tombol download akan mengunduh seluruh hasil satu per satu.`;
    } else {
      multiNote.style.display = 'none';
    }

    emptyResult.style.display = 'none';
    resultContent.style.display = 'block';
    downloadBtn.disabled = false;
  }

  compressBtn.addEventListener('click', async () => {
    if (!selectedFiles.length) return;

    compressBtn.disabled = true;
    compressBtn.innerHTML = SPINNER_ICON;

    const quality = Number(qualitySlider.value) / 100;
    const maxDimension = Number(resizeSelect.value);

    lastResults = [];
    let totalBeforeBytes = 0;
    let totalAfterBytes = 0;
    let firstBeforeURL = null;
    let firstAfterURL = null;

    for (const file of selectedFiles) {
      totalBeforeBytes += file.size;
      const beforeURL = URL.createObjectURL(file);
      if (!firstBeforeURL) firstBeforeURL = beforeURL;

      const result = await compressSingleFile(file, quality, maxDimension);
      lastResults.push(result);
      totalAfterBytes += result.blob.size;

      if (!firstAfterURL) {
        firstAfterURL = result.blob === file ? beforeURL : URL.createObjectURL(result.blob);
      }
    }

    await renderCompressionResult(totalBeforeBytes, totalAfterBytes, firstBeforeURL, firstAfterURL);

    compressBtn.disabled = false;
    compressBtn.innerHTML = COMPRESS_ICON;
  });

  /* ---- 4.5 Download handler ------------------------------------------ */
  downloadBtn.addEventListener('click', () => {
    // Stagger downloads slightly so browsers don't block multi-file saves.
    lastResults.forEach((result, index) => {
      setTimeout(() => {
        const url = URL.createObjectURL(result.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.name;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }, index * 250);
    });
  });
}

/* ---------------------------------------------------------------------
   5. Bootstrap
   --------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initScrollReveal();
  initFaqAccordion();
  initImageCompressor();
});
