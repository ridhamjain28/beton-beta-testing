/**
 * BETON Price List & Catalogue - Fast 3D PDF Flipbook Engine
 * Features instant initial page display, background page streaming, 
 * device-adaptive scaling, StPageFlip 3D physics, and zero-lag fallback.
 */

(function () {
    'use strict';

    // Parse target PDF file from URL query string (default: beton-price-list.pdf)
    const urlParams = new URLSearchParams(window.location.search);
    const pdfPath = urlParams.get('file') || 'assets/docs/beton-price-list.pdf';
    const isCatalogueDoc = pdfPath.toLowerCase().includes('catalogue');

    // State Variables
    let pdfDoc = null;
    let pageFlip = null;
    let pageNum = 1;
    let totalPages = 0;
    let renderedCanvasMap = new Map();
    let isSoundEnabled = true;
    let currentMode = 'flip'; // 'flip' or 'scroll'
    let currentZoom = 1.0;
    let audioCtx = null;

    // DOM Elements
    const elements = {
        appContainer: document.getElementById('app-container'),
        bookContainer: document.getElementById('book-container'),
        bookElement: document.getElementById('book'),
        scrollContainer: document.getElementById('scroll-container'),
        loadingOverlay: document.getElementById('loading-overlay'),
        loadingBar: document.getElementById('loading-bar'),
        loadingText: document.getElementById('loading-text'),
        docTitle: document.getElementById('doc-title'),
        btnDownloadHeader: document.getElementById('btn-download-header'),
        currentPageInput: document.getElementById('current-page-input'),
        totalPagesSpan: document.getElementById('total-pages'),
        btnPrev: document.getElementById('btn-prev'),
        btnNext: document.getElementById('btn-next'),
        btnFirst: document.getElementById('btn-first'),
        btnLast: document.getElementById('btn-last'),
        btnZoomIn: document.getElementById('btn-zoom-in'),
        btnZoomOut: document.getElementById('btn-zoom-out'),
        btnZoomReset: document.getElementById('btn-zoom-reset'),
        btnToggleMode: document.getElementById('btn-toggle-mode'),
        btnToggleSound: document.getElementById('btn-toggle-sound'),
        btnToggleThumbnails: document.getElementById('btn-toggle-thumbnails'),
        btnFullscreen: document.getElementById('btn-fullscreen'),
        btnDownload: document.getElementById('btn-download'),
        btnPrint: document.getElementById('btn-print'),
        thumbnailsDrawer: document.getElementById('thumbnails-drawer'),
        thumbnailsList: document.getElementById('thumbnails-list'),
        closeThumbnails: document.getElementById('close-thumbnails'),
        soundIcon: document.getElementById('sound-icon'),
        modeText: document.getElementById('mode-text')
    };

    // Device performance assessment
    const isLowEndDevice = (function () {
        const cores = navigator.hardwareConcurrency || 4;
        const memory = navigator.deviceMemory || 4;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        return cores <= 2 || memory <= 2 || (isMobile && window.innerWidth < 640);
    })();

    // Device Pixel Ratio scaling (lower on low-spec hardware for sub-second speed)
    const renderScale = isLowEndDevice ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.75);

    // Fast Web Audio Paper Turn Sound
    function playPaperTurnSound() {
        if (!isSoundEnabled) return;
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const bufferSize = audioCtx.sampleRate * 0.12;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
            }

            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(700, audioCtx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(180, audioCtx.currentTime + 0.12);

            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            noise.start();
        } catch (e) {}
    }

    // Configure PDF.js worker
    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    // Set document title in header
    if (elements.docTitle) {
        elements.docTitle.textContent = isCatalogueDoc ? 'BETON - PRODUCT CATALOGUE' : 'BETON - PRICE LIST CATALOG';
    }
    if (elements.btnDownloadHeader) {
        elements.btnDownloadHeader.href = pdfPath;
    }

    // Initialize PDF document with fast progressive rendering
    async function initPDF() {
        try {
            updateLoadingProgress(20, 'Opening document...');

            const loadingTask = pdfjsLib.getDocument({
                url: pdfPath,
                cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
                cMapPacked: true,
                rangeChunkSize: 65536
            });

            pdfDoc = await loadingTask.promise;
            totalPages = pdfDoc.numPages;
            elements.totalPagesSpan.textContent = totalPages;

            updateLoadingProgress(50, 'Rendering page 1...');

            // Get base dimensions from page 1
            const firstPage = await pdfDoc.getPage(1);
            const viewport = firstPage.getViewport({ scale: 1.0 });
            const pageWidth = Math.round(viewport.width);
            const pageHeight = Math.round(viewport.height);

            // Create page DOM containers
            setupPageStructure(pageWidth, pageHeight);

            // Render Page 1 & 2 IMMEDIATELY so user gets instant access
            await Promise.all([
                loadAndRenderPage(1, pageWidth, pageHeight),
                totalPages >= 2 ? loadAndRenderPage(2, pageWidth, pageHeight) : Promise.resolve()
            ]);

            // Initialize StPageFlip engine
            if (typeof St !== 'undefined' && St.PageFlip) {
                initPageFlip(pageWidth, pageHeight);
            } else {
                enableScrollMode();
            }

            // Hide loading overlay immediately - INSTANT RESPONSE!
            updateLoadingProgress(100, 'Done');
            hideLoadingOverlay();

            // Background load remaining pages & thumbnails asynchronously
            streamRemainingPages(pageWidth, pageHeight);

        } catch (err) {
            console.error('PDF loading error:', err);
            if (elements.loadingText) {
                elements.loadingText.innerHTML = `<span class="text-red-400 font-bold">Failed to load PDF. <a href="${pdfPath}" class="underline" download>Download Directly</a></span>`;
            }
        }
    }

    function updateLoadingProgress(percent, text) {
        if (elements.loadingBar) elements.loadingBar.style.width = `${percent}%`;
        if (elements.loadingText) elements.loadingText.textContent = text;
    }

    function hideLoadingOverlay() {
        if (elements.loadingOverlay) {
            elements.loadingOverlay.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => {
                elements.loadingOverlay.style.display = 'none';
            }, 250);
        }
    }

    // Render single canvas image quickly
    async function loadAndRenderPage(pgNum, targetWidth, targetHeight) {
        if (renderedCanvasMap.has(pgNum)) return renderedCanvasMap.get(pgNum);

        try {
            const page = await pdfDoc.getPage(pgNum);
            const unscaledViewport = page.getViewport({ scale: 1.0 });
            const scale = (targetWidth / unscaledViewport.width) * renderScale;
            const viewport = page.getViewport({ scale: scale });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d', { alpha: false });
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            const imgUrl = canvas.toDataURL('image/jpeg', isLowEndDevice ? 0.8 : 0.9);
            renderedCanvasMap.set(pgNum, imgUrl);

            // Apply to DOM page image
            const flipImg = document.querySelector(`#page-node-${pgNum} img`);
            if (flipImg) flipImg.src = imgUrl;

            const scrollImg = document.querySelector(`#scroll-node-${pgNum} img`);
            if (scrollImg) scrollImg.src = imgUrl;

            return imgUrl;
        } catch (e) {
            console.warn(`Failed to render page ${pgNum}:`, e);
            return '';
        }
    }

    // Create Page Skeleton HTML structure
    function setupPageStructure(pageWidth, pageHeight) {
        elements.bookElement.innerHTML = '';
        elements.scrollContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            // Flipbook Page Wrapper
            const pageDiv = document.createElement('div');
            pageDiv.className = 'my-page bg-white shadow-md relative overflow-hidden flex items-center justify-center';
            pageDiv.id = `page-node-${i}`;
            pageDiv.setAttribute('data-density', i === 1 || i === totalPages ? 'hard' : 'soft');

            const img = document.createElement('img');
            img.className = 'w-full h-full object-contain pointer-events-none select-none';
            img.alt = `Page ${i}`;
            pageDiv.appendChild(img);
            elements.bookElement.appendChild(pageDiv);

            // Scroll Mode Wrapper
            const scrollItem = document.createElement('div');
            scrollItem.className = 'scroll-page bg-white shadow-lg my-3 rounded border border-slate-700 max-w-4xl mx-auto overflow-hidden';
            scrollItem.id = `scroll-node-${i}`;

            const scrollImg = document.createElement('img');
            scrollImg.className = 'w-full h-auto block';
            scrollImg.alt = `Page ${i}`;
            scrollItem.appendChild(scrollImg);
            elements.scrollContainer.appendChild(scrollItem);
        }
    }

    // Stream remaining pages in background to preserve zero latency
    async function streamRemainingPages(pageWidth, pageHeight) {
        for (let i = 3; i <= totalPages; i++) {
            await loadAndRenderPage(i, pageWidth, pageHeight);
        }
        buildThumbnails();
    }

    // Build sidebar thumbnails
    function buildThumbnails() {
        if (!elements.thumbnailsList) return;
        elements.thumbnailsList.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const item = document.createElement('div');
            item.className = 'thumbnail-item cursor-pointer p-1.5 rounded transition-all hover:bg-slate-800 flex flex-col items-center group';
            item.setAttribute('data-page', i);

            const box = document.createElement('div');
            box.className = 'w-20 h-28 bg-slate-800 rounded border border-slate-700 overflow-hidden flex items-center justify-center shadow group-hover:border-amber-500';

            const img = document.createElement('img');
            img.className = 'w-full h-full object-cover';
            img.alt = `Thumb ${i}`;

            const url = renderedCanvasMap.get(i);
            if (url) img.src = url;

            box.appendChild(img);

            const label = document.createElement('span');
            label.className = 'text-[10px] text-slate-400 mt-1 font-mono group-hover:text-white';
            label.textContent = `Page ${i}`;

            item.appendChild(box);
            item.appendChild(label);

            item.addEventListener('click', () => {
                goToPage(i);
                elements.thumbnailsDrawer?.classList.add('-translate-x-full');
            });

            elements.thumbnailsList.appendChild(item);
        }
    }

    // Initialize StPageFlip
    function initPageFlip(pageWidth, pageHeight) {
        pageFlip = new St.PageFlip(elements.bookElement, {
            width: pageWidth,
            height: pageHeight,
            size: 'stretch',
            minWidth: 280,
            maxWidth: 900,
            minHeight: 400,
            maxHeight: 1200,
            drawShadow: !isLowEndDevice,
            flippingTime: isLowEndDevice ? 400 : 700,
            usePortrait: true,
            startZIndex: 1,
            startPage: 0,
            autoSize: true,
            maxShadowOpacity: 0.4,
            showCover: true,
            mobileScrollSupport: true,
            swipeDistance: 25,
            clickEventForward: true,
            useMouseEvents: true,
            disableFlipByClick: false
        });

        pageFlip.loadFromHTML(elements.bookElement.querySelectorAll('.my-page'));

        pageFlip.on('flip', (e) => {
            pageNum = e.data + 1;
            updateUI();
            playPaperTurnSound();
        });

        pageFlip.on('changeState', (e) => {
            if (e.data === 'flipping') playPaperTurnSound();
        });
    }

    // Page Navigation
    function goToPage(targetPg) {
        const pg = Math.max(1, Math.min(totalPages, targetPg));
        pageNum = pg;

        if (currentMode === 'flip' && pageFlip) {
            pageFlip.turnToPage(pg - 1);
        } else {
            const node = document.getElementById(`scroll-node-${pg}`);
            if (node) node.scrollIntoView({ behavior: 'smooth' });
        }
        updateUI();
    }

    function updateUI() {
        if (elements.currentPageInput) elements.currentPageInput.value = pageNum;
        if (elements.btnPrev) elements.btnPrev.disabled = pageNum <= 1;
        if (elements.btnNext) elements.btnNext.disabled = pageNum >= totalPages;
        if (elements.btnFirst) elements.btnFirst.disabled = pageNum <= 1;
        if (elements.btnLast) elements.btnLast.disabled = pageNum >= totalPages;

        const thumbs = elements.thumbnailsList?.querySelectorAll('.thumbnail-item');
        thumbs?.forEach(t => {
            const p = parseInt(t.getAttribute('data-page'));
            if (p === pageNum) {
                t.classList.add('ring-2', 'ring-amber-500', 'bg-slate-800');
            } else {
                t.classList.remove('ring-2', 'ring-amber-500', 'bg-slate-800');
            }
        });
    }

    // Toggle Modes
    function enableScrollMode() {
        currentMode = 'scroll';
        elements.bookContainer?.classList.add('hidden');
        elements.scrollContainer?.classList.remove('hidden');
        if (elements.modeText) elements.modeText.textContent = '3D Flip View';
    }

    function enableFlipMode() {
        currentMode = 'flip';
        elements.scrollContainer?.classList.add('hidden');
        elements.bookContainer?.classList.remove('hidden');
        if (elements.modeText) elements.modeText.textContent = 'Scroll View';
    }

    function toggleMode() {
        if (currentMode === 'flip') enableScrollMode();
        else enableFlipMode();
    }

    // Zoom Controls
    function applyZoom(delta) {
        currentZoom = Math.max(0.75, Math.min(2.5, currentZoom + delta));
        const target = currentMode === 'flip' ? elements.bookElement : elements.scrollContainer;
        if (target) {
            target.style.transform = `scale(${currentZoom})`;
            target.style.transformOrigin = 'center top';
            target.style.transition = 'transform 0.15s ease-out';
        }
    }

    function resetZoom() {
        currentZoom = 1.0;
        const target = currentMode === 'flip' ? elements.bookElement : elements.scrollContainer;
        if (target) target.style.transform = 'scale(1.0)';
    }

    // Bind Event Listeners
    function bindEvents() {
        elements.btnPrev?.addEventListener('click', () => {
            if (currentMode === 'flip' && pageFlip) pageFlip.flipPrev();
            else goToPage(pageNum - 1);
        });

        elements.btnNext?.addEventListener('click', () => {
            if (currentMode === 'flip' && pageFlip) pageFlip.flipNext();
            else goToPage(pageNum + 1);
        });

        elements.btnFirst?.addEventListener('click', () => goToPage(1));
        elements.btnLast?.addEventListener('click', () => goToPage(totalPages));

        elements.currentPageInput?.addEventListener('change', (e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val)) goToPage(val);
        });

        elements.btnZoomIn?.addEventListener('click', () => applyZoom(0.2));
        elements.btnZoomOut?.addEventListener('click', () => applyZoom(-0.2));
        elements.btnZoomReset?.addEventListener('click', () => resetZoom());

        elements.btnToggleMode?.addEventListener('click', () => toggleMode());

        elements.btnToggleSound?.addEventListener('click', () => {
            isSoundEnabled = !isSoundEnabled;
            if (elements.soundIcon) elements.soundIcon.textContent = isSoundEnabled ? 'volume_up' : 'volume_off';
            elements.btnToggleSound.classList.toggle('text-amber-500', isSoundEnabled);
            elements.btnToggleSound.classList.toggle('text-slate-500', !isSoundEnabled);
        });

        elements.btnToggleThumbnails?.addEventListener('click', () => {
            elements.thumbnailsDrawer?.classList.toggle('-translate-x-full');
        });
        elements.closeThumbnails?.addEventListener('click', () => {
            elements.thumbnailsDrawer?.classList.add('-translate-x-full');
        });

        elements.btnFullscreen?.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                elements.appContainer?.requestFullscreen().catch(err => console.error(err));
            } else {
                document.exitFullscreen();
            }
        });

        elements.btnDownload?.addEventListener('click', () => {
            const a = document.createElement('a');
            a.href = pdfPath;
            a.download = pdfPath.split('/').pop();
            a.click();
        });

        elements.btnPrint?.addEventListener('click', () => {
            const printWin = window.open(pdfPath, '_blank');
            if (printWin) printWin.print();
        });

        // Keyboard Shortcuts
        window.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;
            switch (e.key) {
                case 'ArrowLeft':
                case 'PageUp':
                    if (currentMode === 'flip' && pageFlip) pageFlip.flipPrev();
                    else goToPage(pageNum - 1);
                    break;
                case 'ArrowRight':
                case 'PageDown':
                case ' ':
                    if (currentMode === 'flip' && pageFlip) pageFlip.flipNext();
                    else goToPage(pageNum + 1);
                    break;
                case 'Home':
                    goToPage(1);
                    break;
                case 'End':
                    goToPage(totalPages);
                    break;
                case 'f':
                case 'F':
                    elements.btnFullscreen?.click();
                    break;
                case 's':
                case 'S':
                    toggleMode();
                    break;
                case 'm':
                case 'M':
                    elements.btnToggleSound?.click();
                    break;
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        bindEvents();
        initPDF();
    });

})();
