/**
 * @dotmatrix/dotm-square-8 Native Web Component for Beton Lighting
 * Replaces generic spinners with an 8x8 dot matrix wave animation with bloom glow.
 */
class DotmSquare8 extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const size = parseInt(this.getAttribute('size') || '32', 10);
    const color = this.getAttribute('color') || '#134095';
    const animated = this.getAttribute('animated') !== 'false';
    
    // Create 8x8 grid of dots (64 total)
    let dotsHtml = '';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        // Calculate distance from top-left for wave delay effect
        const dist = (r + c) / 14;
        const delay = (dist * 1.2).toFixed(2);
        dotsHtml += `<span class="dmx-dot" style="animation-delay: ${delay}s; background-color: ${color};"></span>`;
      }
    }

    this.innerHTML = `
      <style>
        dotm-square-8 {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .dmx-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          grid-template-rows: repeat(8, 1fr);
          gap: 3px;
          width: ${size}px;
          height: ${size}px;
        }
        .dmx-dot {
          width: 100%;
          height: 100%;
          border-radius: 2px;
          background-color: ${color};
          opacity: 0.15;
          ${animated ? 'animation: dmxPulse 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate;' : ''}
        }
        @keyframes dmxPulse {
          0% {
            opacity: 0.12;
            transform: scale(0.8);
            box-shadow: 0 0 0 rgba(19, 64, 149, 0);
          }
          50% {
            opacity: 0.6;
            transform: scale(1);
          }
          100% {
            opacity: 1;
            transform: scale(1.15);
            box-shadow: 0 0 6px ${color}, 0 0 10px ${color};
          }
        }
      </style>
      <div class="dmx-grid" role="status" aria-label="Loading">
        ${dotsHtml}
      </div>
    `;
  }
}

if (!customElements.get('dotm-square-8')) {
  customElements.define('dotm-square-8', DotmSquare8);
}
