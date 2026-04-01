const ghostExpressions = {
    happy: `<svg>...<animate>...</animate>...</svg>`,
    sad: `<svg>...<animate>...</animate>...</svg>`,
    surprised: `<svg>...<animate>...</animate>...</svg>`,
    angry: `<svg>...<animate>...</animate>...</svg>`,
    confused: `<svg>...<animate>...</animate>...</svg>`,
    sleepy: `<svg>...<animate>...</animate>...</svg>`,
    playful: `<svg>...<animate>...</animate>...</svg>`,
    mischievous: `<svg>...<animate>...</animate>...</svg>`,
};

function getGhostSVG(expression) {
    return ghostExpressions[expression] || ghostExpressions.happy;
}