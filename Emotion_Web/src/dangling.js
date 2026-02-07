/**
 * Canvas 2D Character Network Visualizer
 * Renders connecting lines from characters to top of viewport with responsive layout
 */
export class CharacterNetworkVisualizer {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.characters = [];
    this.isActive = false;
    this.isVisible = false;
    this.animationFrame = null;
    this.opacity = 0; // For fade in/out effect
    this.targetOpacity = 0;
    this.resizeObserver = null;
  }

  init() {
    this.canvas = document.createElement("canvas");
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      pointer-events: none;
      z-index: 5;
      opacity: 0;
    `;
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d", { alpha: true });
    this.resizeCanvas();

    // Responsive resize with debounce
    this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
    this.resizeObserver.observe(document.documentElement);

    window.addEventListener("resize", () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    // Immediately redraw on resize to keep lines aligned with text
    this.draw();
  }

  /**
   * Get responsive line properties based on viewport width
   */
  getResponsiveStyles() {
    const width = window.innerWidth;

    if (width < 640) {
      // Mobile
      return {
        lineWidth: 1,
        strokeStyle: "rgba(255, 255, 255, 0.4)",
      };
    } else if (width < 1024) {
      // Tablet
      return {
        lineWidth: 1.2,
        strokeStyle: "rgba(255, 255, 255, 0.5)",
      };
    } else {
      // Desktop
      return {
        lineWidth: 1.5,
        strokeStyle: "rgba(255, 255, 255, 0.6)",
      };
    }
  }

  updateCharacterPositions(splitTextChars) {
    this.characters = splitTextChars.map((char) => {
      const rect = char.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 6,
        y: rect.top + rect.height / 2,
      };
    });
  }

  draw() {
    // Smooth opacity transitions
    const opacityDelta = this.targetOpacity - this.opacity;
    if (Math.abs(opacityDelta) > 0.01) {
      this.opacity += opacityDelta * 0.1;
    } else {
      this.opacity = this.targetOpacity;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const styles = this.getResponsiveStyles();
    this.ctx.strokeStyle = styles.strokeStyle.replace(
      "0.6)",
      `${this.opacity})`,
    );
    this.ctx.lineWidth = styles.lineWidth;

    this.characters.forEach((char) => {
      this.ctx.beginPath();
      this.ctx.moveTo(char.x, char.y);
      this.ctx.lineTo(char.x, 0); // Line to top
      this.ctx.stroke();
    });

    // Update canvas opacity
    this.canvas.style.opacity = this.opacity;
  }

  /**
   * Show with fade in effect
   */
  show(duration = 0.5) {
    this.isVisible = true;
    this.canvas.style.display = "block";
    this.targetOpacity = 1;
    this.startAnimation();
  }

  /**
   * Hide with fade out effect
   */
  hide(duration = 0.5) {
    this.isVisible = false;
    this.targetOpacity = 0;

    // Stop animation after fade out completes
    setTimeout(() => {
      if (!this.isVisible && this.opacity < 0.01) {
        this.canvas.style.display = "none";
        this.stopAnimation();
      }
    }, duration * 1000);
  }

  startAnimation() {
    this.isActive = true;
    this.animate();
  }

  stopAnimation() {
    this.isActive = false;
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
  }

  animate = () => {
    this.draw();
    if (this.isActive) {
      this.animationFrame = requestAnimationFrame(this.animate);
    }
  };

  /**
   * Cleanup resources
   */
  destroy() {
    this.stopAnimation();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}
