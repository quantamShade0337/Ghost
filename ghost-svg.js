// ghost-svg.js

class Ghost {
    constructor(expression, size, color) {
        this.expression = expression;
        this.size = size;
        this.color = color;
    }

    render() {
        // This function should generate SVG related to the ghost's expression
        let svgContent;
        switch (this.expression) {
            case 'happy':
                svgContent = '<g>...</g>'; // Add SVG for happy ghost
                break;
            case 'excited':
                svgContent = '<g>...</g>'; // Add SVG for excited ghost
                break;
            case 'focused':
                svgContent = '<g>...</g>'; // Add SVG for focused ghost
                break;
            case 'thinking':
                svgContent = '<g>...</g>'; // Add SVG for thinking ghost
                break;
            case 'celebrating':
                svgContent = '<g>...</g>'; // Add SVG for celebrating ghost
                break;
            case 'sleepy':
                svgContent = '<g>...</g>'; // Add SVG for sleepy ghost
                break;
            case 'cautious':
                svgContent = '<g>...</g>'; // Add SVG for cautious ghost
                break;
            case 'sad':
                svgContent = '<g>...</g>'; // Add SVG for sad ghost
                break;
            default:
                svgContent = '<g>...</g>'; // Default ghost shape
                break;
        }

        return `<svg width='${this.size}' height='${this.size}' fill='${this.color}'>${svgContent}</svg>`;
    }

    static renderGhostSizeAndColor(expression, size, color) {
        const ghost = new Ghost(expression, size, color);
        return ghost.render();
    }
}

// Example Usage
const happyGhost = Ghost.renderGhostSizeAndColor('happy', 100, 'lightgreen');
console.log(happyGhost);

