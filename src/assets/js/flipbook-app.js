/**
 * BETON Price List - Interactive PDF Flipbook Engine
 * Supports high-DPI rendering, 3D physics StPageFlip page turns,
 * progressive memory management, touch gestures, and a legacy fallback scroll mode.
 */

(function () {
    'use strict';

    // PDF Configuration
    const PDF_URL = 'assets/docs/beton-price-list.pdf';

    // State Variables
    let pdfDoc = null;
    let pageFlip = null;
    let pageNum = 1;
    let totalPages = 0;
    let renderedPages = new Map();
    let isRendering = false;
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

    // Device Pixel Ratio scaling for crisp text vs low RAM tuning
    const renderScale = isLowEndDevice ? 1.25 : Math.min(window.devicePixelRatio || 1, 2.0);

    // Initialize Web Audio Paper Flip Sound
    function playPaperTurnSound() {
        if (!isSoundEnabled) return;
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const bufferSize = audioCtx.sampleRate * 0.15;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);

            // Generate white noise with soft exponential decay for realistic paper rustle
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
            }

            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;

            // Low-pass filter to sound like soft paper
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, audioCtx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.15);

            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            noise.start();
        } catch (e) {
            // Audio context failed or blocked by browser policy
        }
    }

    // Configure PDF.js worker
    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    // Load PDF Document
    async function initPDF() {
        try {
            updateLoadingProgress(10, 'Fetching PDF catalog...');
            
            const loadingTask = pdfjsLib.getDocument({
                url: PDF_URL,
                cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
                cMapPacked: true
            });

            loadingTask.onProgress = function (progress) {
                if (progress.total > 0) {
                    const percent = Math.round((progress.loaded / progress.total) * 60);
                    updateLoadingProgress(10 + percent, `Downloading PDF... (${Math.round(progress.loaded / 1024 / 1024 * 10) / 10} MB)`);
                }
            };

            pdfDoc = await loadingTask.promise;
            totalPages = pdfDoc.numPages;
            elements.totalPagesSpan.textContent = totalPages;

            updateLoadingProgress(70, 'Rendering document pages...');

            // Determine dimensions from first page
            const firstPage = await pdfDoc.getPage(1);
            const viewport = firstPage.getViewport({ scale: 1.0 });
            const pageWidth = Math.round(viewport.width);
            const pageHeight = Math.round(viewport.height);

            // Render pages into container
            await renderAllPages(pageWidth, pageHeight);

            updateLoadingProgress(90, 'Initializing 3D flipbook engine...');

            if (typeof St !== 'undefined' && St.PageFlip) {
                initPageFlip(pageWidth, pageHeight);
            } else {
                console.warn('StPageFlip library not detected, switching to fallback scroll mode');
                enableScrollMode();
            }

            // Build page thumbnails
            generateThumbnails();

            updateLoadingProgress(100, 'Ready');
            setTimeout(() => {
                elements.loadingOverlay.classList.add('opacity-0', 'pointer-events-none');
                setTimeout(() => elements.loadingOverlay.style.display = 'none', 300);
            }, 400);

        } catch (err) {
            console.error('PDF initialization error:', err);
            elements.loadingText.innerHTML = `<span class="text-red-400">Failed to load PDF. <button id="btn-retry" class="underline font-bold">Retry</button> or <a href="${PDF_URL}" class="underline font-bold" download>Download Directly</a></span>`;
            document.getElementById('btn-retry')?.addEventListener('click', () => location.reload());
        }
    }

    function updateLoadingProgress(percent, statusText) {
        if (elements.loadingBar) elements.loadingBar.style.width = `${percent}%`;
        if (elements.loadingText) elements.loadingText.textContent = statusText;
    }

    // Render individual page canvas to data URL or DOM node
    async function renderPageCanvas(pageNumToRender, targetWidth, targetHeight) {
        if (renderedPages.has(pageNumToRender)) {
            return renderedPages.get(pageNumToRender);
        }

        const page = await pdfDoc.getPage(pageNumToRender);
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const scale = (targetWidth / unscaledViewport.width) * renderScale;
        const viewport = page.getViewport({ scale: scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d', { alpha: false });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;

        const imgUrl = canvas.toDataURL('image/jpeg', isLowEndDevice ? 0.85 : 0.95);
        renderedPages.set(pageNumToRender, imgUrl);
        return imgUrl;
    }

    // Build DOM elements for StPageFlip
    async function renderAllPages(pageWidth, pageHeight) {
        elements.bookElement.innerHTML = '';
        elements.scrollContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            // Page wrapper for 3D flipbook
            const pageDiv = document.createElement('div');
            pageDiv.className = 'my-page bg-white shadow-md relative overflow-hidden flex items-center justify-center';
            pageDiv.setAttribute('data-density', i === 1 || i === totalPages ? 'hard' : 'soft');

            // Page image canvas element
            const img = document.createElement('img');
            img.className = 'w-full h-full object-contain pointer-events-none select-none';
            img.alt = `Page ${i}`;
            img.loading = i <= 4 ? 'eager' : 'lazy';

            pageDiv.appendChild(img);
            elements.bookElement.appendChild(pageDiv);

            // Scroll container wrapper for fallback view
            const scrollItem = document.createElement('div');
            scrollItem.className = 'scroll-page bg-white shadow-xl my-4 rounded border border-gray-700 max-w-4xl mx-auto overflow-hidden';
            scrollItem.id = `scroll-page-${i}`;
            
            const scrollImg = document.createElement('img');
            scrollImg.className = 'w-full h-auto block';
            scrollImg.alt = `Page ${i}`;
            scrollItem.appendChild(scrollImg);
            
            elements.scrollContainer.appendChild(scrollItem);

            // Render page 1 to 4 immediately, remainder lazily
            if (i <= 4) {
                renderPageCanvas(i, pageWidth, pageHeight).then(url => {
                    img.src = url;
                    scrollImg.src = url;
                });
            }
        }
    }

    // Initialize StPageFlip
    function initPageFlip(pageWidth, pageHeight) {
        const isPortrait = window.innerWidth < 768;

        pageFlip = new St.PageFlip(elements.bookElement, {
            width: pageWidth,
            height: pageHeight,
            size: 'stretch',
            minWidth: 280,
            maxWidth: 900,
            minHeight: 400,
            maxHeight: 1200,
            drawShadow: !isLowEndDevice,
            flippingTime: isLowEndDevice ? 500 : 800,
            usePortrait: true,
            startZIndex: 1,
            startPage: 0,
            autoSize: true,
            maxShadowOpacity: 0.5,
            showCover: true,
            mobileScrollSupport: true,
            swipeDistance: 25,
            clickEventForward: true,
            useMouseEvents: true,
            disableFlipByClick: false
        });

        const pages = elements.bookElement.querySelectorAll('.my-page');
        pageFlip.loadFromHTML(pages);

        // Event Listeners for StPageFlip
        pageFlip.on('flip', (e) => {
            const newIdx = e.data + 1;
            pageNum = newIdx;
            updateUI();
            playPaperTurnSound();
            preloadAdjacentPages(pageNum, pageWidth, pageHeight);
        });

        pageFlip.on('changeState', (e) => {
            if (e.data === 'flipping') {
                playPaperTurnSound();
            }
        });

        // Preload first neighbor pages
        preloadAdjacentPages(1, pageWidth, pageHeight);
    }

    // Preload neighbor pages into RAM dynamically
    async function preloadAdjacentPages(currentPg, width, height) {
        const range = isLowEndDevice ? 1 : 2;
        const pagesToLoad = [];
        for (let p = Math.max(1, currentPg - range); p <= Math.min(totalPages, currentPg + range); p++) {
            pagesToLoad.push(p);
        }

        for (const p of pagesToLoad) {
            const url = await renderPageCanvas(p, width, height);
            const pageDivs = elements.bookElement.querySelectorAll('.my-page');
            if (pageDivs[p - 1]) {
                const img = pageDivs[p - 1].querySelector('img');
                if (img && !img.src) img.src = url;
            }
            const scrollImg = document.querySelector(`#scroll-page-${p} img`);
            if (scrollImg && !scrollImg.src) scrollImg.src = url;
        }
    }

    // Thumbnail Generation
    async function generateThumbnails() {
        elements.thumbnailsList.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const thumbItem = document.createElement('div');
            thumbItem.className = 'thumbnail-item cursor-pointer p-2 rounded transition-all hover:bg-gray-800 flex flex-col items-center group';
            thumbItem.setAttribute('data-page', i);

            const thumbBox = document.createElement('div');
            thumbBox.className = 'w-24 h-32 bg-gray-700 rounded border border-gray-600 overflow-hidden flex items-center justify-center shadow group-hover:border-secondary';

            const thumbImg = document.createElement('img');
            thumbImg.className = 'w-full h-full object-cover';
            thumbImg.alt = `Thumb ${i}`;

            thumbBox.appendChild(thumbImg);

            const label = document.createElement('span');
            label.className = 'text-xs text-gray-400 mt-1 font-mono group-hover:text-white';
            label.textContent = `Page ${i}`;

            thumbItem.appendChild(thumbBox);
            thumbItem.appendChild(label);

            thumbItem.addEventListener('click', () => {
                goToPage(i);
                elements.thumbnailsDrawer.classList.add('-translate-x-full');
            });

            elements.thumbnailsList.appendChild(thumbItem);

            // Lazy render thumbnails when drawer opens or in background
            renderPageCanvas(i, 150, 200).then(url => {
                thumbImg.src = url;
            });
        }
    }

    // Page Navigation Methods
    function goToPage(targetPage) {
        const validPage = Math.max(1, Math.min(totalPages, targetPage));
        pageNum = validPage;

        if (currentMode === 'flip' && pageFlip) {
            pageFlip.turnToPage(validPage - 1);
        } else {
            const targetEl = document.getElementById(`scroll-page-${validPage}`);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        }
        updateUI();
    }

    function updateUI() {
        elements.currentPageInput.value = pageNum;
        elements.btnPrev.disabled = pageNum <= 1;
        elements.btnNext.disabled = pageNum >= totalPages;
        elements.btnFirst.disabled = pageNum <= 1;
        elements.btnLast.disabled = pageNum >= totalPages;

        // Highlight active thumbnail
        const thumbs = elements.thumbnailsList.querySelectorAll('.thumbnail-item');
        thumbs.forEach(t => {
            const p = parseInt(t.getAttribute('data-page'));
            if (p === pageNum) {
                t.classList.add('ring-2', 'ring-secondary', 'bg-gray-800');
            } else {
                t.classList.remove('ring-2', 'ring-secondary', 'bg-gray-800');
            }
        });
    }

    // Toggle Modes (3D Flipbook vs Scroll Mode)
    function enableScrollMode() {
        currentMode = 'scroll';
        elements.bookContainer.classList.add('hidden');
        elements.scrollContainer.classList.remove('hidden');
        elements.modeText.textContent = '3D Flip View';
        
        // Ensure all pages are rendered for scroll mode
        for (let i = 1; i <= totalPages; i++) {
            renderPageCanvas(i, 800, 1100).then(url => {
                const img = document.querySelector(`#scroll-page-${i} img`);
                if (img) img.src = url;
            });
        }
    }

    function enableFlipMode() {
        currentMode = 'flip';
        elements.scrollContainer.classList.add('hidden');
        elements.bookContainer.classList.remove('hidden');
        elements.modeText.textContent = 'Scroll View';
        if (pageFlip) {
            pageFlip.updateFromHTML(elements.bookElement.querySelectorAll('.my-page'));
        }
    }

    function toggleMode() {
        if (currentMode === 'flip') {
            enableScrollMode();
        } else {
            enableFlipMode();
        }
    }

    // Zoom Handling
    function applyZoom(delta) {
        currentZoom = Math.max(0.75, Math.min(2.5, currentZoom + delta));
        const targetContainer = currentMode === 'flip' ? elements.bookElement : elements.scrollContainer;
        targetContainer.style.transform = `scale(${currentZoom})`;
        targetContainer.style.transformOrigin = 'center top';
        targetContainer.style.transition = 'transform 0.2s ease-out';
    }

    function resetZoom() {
        currentZoom = 1.0;
        const targetContainer = currentMode === 'flip' ? elements.bookElement : elements.scrollContainer;
        targetContainer.style.transform = 'scale(1.0)';
    }

    // Event Bindings
    function bindEvents() {
        // Prev / Next Buttons
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

        // Jump Page Input
        elements.currentPageInput?.addEventListener('change', (e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val)) goToPage(val);
        });

        // Zoom Controls
        elements.btnZoomIn?.addEventListener('click', () => applyZoom(0.25));
        elements.btnZoomOut?.addEventListener('click', () => applyZoom(-0.25));
        elements.btnZoomReset?.addEventListener('click', () => resetZoom());

        // Mode Toggle
        elements.btnToggleMode?.addEventListener('click', () => toggleMode());

        // Sound Toggle
        elements.btnToggleSound?.addEventListener('click', () => {
            isSoundEnabled = !isSoundEnabled;
            elements.soundIcon.textContent = isSoundEnabled ? 'volume_up' : 'volume_off';
            elements.btnToggleSound.classList.toggle('text-secondary', isSoundEnabled);
            elements.btnToggleSound.classList.toggle('text-gray-500', !isSoundEnabled);
        });

        // Sidebar Thumbnails
        elements.btnToggleThumbnails?.addEventListener('click', () => {
            elements.thumbnailsDrawer.classList.toggle('-translate-x-full');
        });
        elements.closeThumbnails?.addEventListener('click', () => {
            elements.thumbnailsDrawer.classList.add('-translate-x-full');
        });

        // Fullscreen
        elements.btnFullscreen?.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                elements.appContainer.requestFullscreen().catch(err => console.error(err));
            } else {
                document.exitFullscreen();
            }
        });

        // Download & Print
        elements.btnDownload?.addEventListener('click', () => {
            const a = document.createElement('a');
            a.href = PDF_URL;
            a.download = 'BETON - PRICE LIST.pdf';
            a.click();
        });

        elements.btnPrint?.addEventListener('click', () => {
            const printWin = window.open(PDF_URL, '_blank');
            if (printWin) printWin.print();
        });

        // Keyboard Navigation Shortcuts
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
                case '+':
                case '=':
                    applyZoom(0.2);
                    break;
                case '-':
                    applyZoom(-0.2);
                    break;
                case '0':
                    resetZoom();
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

        // Auto-switch orientation on window resize
        window.addEventListener('resize', () => {
            if (currentMode === 'flip' && pageFlip) {
                // StPageFlip handles responsive auto-resizing internally
            }
        });
    }

    // Start App on DOM Ready
    document.addEventListener('DOMContentLoaded', () => {
        bindEvents();
        initPDF();
    });

})();
