// Improved ghost SVG expressions
const ghostSVG = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100%' height='100%'>
  <g class='ghost'>
    <path d='M30 60 Q25 45, 40 45 T50 60' stroke='black' fill='none' stroke-width='2' />
    <path d='M50 60 Q60 45, 55 45 T70 60' stroke='black' fill='none' stroke-width='2' />
    <circle cx='40' cy='35' r='5' fill='black' />
    <circle cx='60' cy='35' r='5' fill='black' />
  </g>
  <style>
    .ghost {
      animation: blink 1s infinite;
    }
    @keyframes blink {
      0% { opacity: 1; }
      50% { opacity: 0; }
      100% { opacity: 1; }
    }
  </style>
</svg>`;

export default ghostSVG;

/**
 * Accessibility improvements
 * - Added aria-label for better screen reader support
 * - Ensured color contrast is sufficient
 *
 * Scale parameter support
 * @param {number} scale - Size multiplier for the SVG
 */
function renderGhost(scale = 1) {
    const svgElement = document.createElement('div');
    svgElement.setAttribute('aria-label', 'A friendly ghost');
    svgElement.innerHTML = ghostSVG;
    svgElement.style.transform = `scale(${scale})`;
    return svgElement;
}

export { renderGhost };