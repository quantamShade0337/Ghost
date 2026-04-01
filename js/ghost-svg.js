<!DOCTYPE svg>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-labelledby="ghostTitle" role="img">
  <title id="ghostTitle">Ghost SVG Expressions</title>
  <desc>This SVG depicts a ghost with various expressions</desc>

  <!-- Happy Expression -->
  <g id="happy" transform="translate(10, 10) scale(1)">
    <circle cx="50" cy="50" r="40" fill="white" stroke="black" stroke-width="2"/>
    <circle cx="30" cy="40" r="5" fill="black"/>
    <circle cx="70" cy="40" r="5" fill="black"/> 
    <path d="M30,60 Q50,80 70,60" stroke="black" stroke-width="2" fill="none"/>
    <animateTransform attributeName="transform" attributeType="XML" type="translate" from="-5,0" to="5,0" dur="0.5s" repeatCount="indefinite"/>
  </g>

  <!-- Excited Expression -->
  <g id="excited" transform="translate(10, 10) scale(1)">
    <circle cx="50" cy="50" r="40" fill="white" stroke="black" stroke-width="2"/>
    <circle cx="30" cy="40" r="5" fill="black"/>
    <circle cx="70" cy="40" r="5" fill="black"/>
    <path d="M30,60 Q50,90 70,60" stroke="black" stroke-width="2" fill="none"/>
    <animate attributeName="d" values="M30,60 Q50,90 70,60; M30,60 Q50,80 70,60; M30,60 Q50,90 70,60" dur="1s" repeatCount="indefinite"/>
  </g>

  <!-- Focused Expression -->
  <g id="focused" transform="translate(10, 10) scale(1)">
    <circle cx="50" cy="50" r="40" fill="white" stroke="black" stroke-width="2"/>
    <rect x="25" y="35" width="10" height="5" fill="black"/>
    <rect x="65" y="35" width="10" height="5" fill="black"/>
    <path d="M30,60 Q50,70 70,60" stroke="black" stroke-width="2" fill="none"/>
    <animateTransform attributeName="transform" attributeType="XML" type="scale" from="1" to="1.1" dur="0.5s" repeatCount="indefinite"/>
  </g>

  <!-- Thinking Expression -->
  <g id="thinking" transform="translate(10, 10) scale(1)">
    <circle cx="50" cy="50" r="40" fill="white" stroke="black" stroke-width="2"/>
    <circle cx="30" cy="40" r="5" fill="black"/>
    <circle cx="70" cy="40" r="5" fill="black"/>
    <path d="M30,60 Q50,50 70,60" stroke="black" stroke-width="2" fill="none"/>
    <animateTransform attributeName="transform" attributeType="XML" type="translate" from="0,0" to="0,5" dur="1s" repeatCount="indefinite"/>
  </g>

  <!-- Celebrating Expression -->
  <g id="celebrating" transform="translate(10, 10) scale(1)">
    <circle cx="50" cy="50" r="40" fill="white" stroke="black" stroke-width="2"/>
    <circle cx="30" cy="40" r="5" fill="black"/>
    <circle cx="70" cy="40" r="5" fill="black"/>
    <path d="M30,60 Q50,70 70,60" stroke="black" stroke-width="2" fill="none"/>
    <animate attributeName="r" from="40" to="45" dur="0.5s" repeatCount="indefinite"/>
  </g>

  <!-- Sleepy Expression -->
  <g id="sleepy" transform="translate(10, 10) scale(1)">
    <circle cx="50" cy="50" r="40" fill="white" stroke="black" stroke-width="2"/>
    <circle cx="30" cy="45" r="5" fill="black"/>
    <circle cx="70" cy="45" r="5" fill="black"/>
    <path d="M30,60 Q50,40 70,60" stroke="black" stroke-width="2" fill="none"/>
    <animateTransform attributeName="transform" attributeType="XML" type="scale" from="1" to="0.95" dur="1s" repeatCount="indefinite"/>
  </g>

  <!-- Cautious Expression -->
  <g id="cautious" transform="translate(10, 10) scale(1)">
    <circle cx="50" cy="50" r="40" fill="white" stroke="black" stroke-width="2"/>
    <circle cx="30" cy="40" r="5" fill="black"/>
    <circle cx="70" cy="40" r="5" fill="black"/>
    <path d="M30,60 Q50,50 70,60" stroke="black" stroke-width="2" fill="none"/>
    <animate attributeName="transform" attributeType="XML" type="translate" from="0,0" to="2,0" dur="0.5s" repeatCount="indefinite"/>
  </g>

  <!-- Sad Expression -->
  <g id="sad" transform="translate(10, 10) scale(1)">
    <circle cx="50" cy="50" r="40" fill="white" stroke="black" stroke-width="2"/>
    <circle cx="30" cy="40" r="5" fill="black"/>
    <circle cx="70" cy="40" r="5" fill="black"/>
    <path d="M30,60 Q50,40 70,60" stroke="black" stroke-width="2" fill="none"/>
  </g>
</svg>