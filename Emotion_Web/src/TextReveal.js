import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * 将文本分割成 span 元素
 * @param {HTMLElement} element - 要分割的元素
 */
const splitTextIntoSpans = (element) => {
  if (!element || element.dataset.split === "true") {
    return;
  }

  const walk = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      const fragment = document.createDocumentFragment();
      const tokens = text.match(/\S+|\s+/g) ?? [];

      tokens.forEach((token) => {
        if (/^\s+$/.test(token)) {
          fragment.appendChild(document.createTextNode(token));
          return;
        }

        const wordWrapper = document.createElement("span");
        wordWrapper.className = "text-reveal__word";

        [...token].forEach((char) => {
          const span = document.createElement("span");
          span.className = "text-reveal__char";
          span.textContent = char;
          wordWrapper.appendChild(span);
        });

        fragment.appendChild(wordWrapper);
      });

      node.replaceWith(fragment);
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(walk);
    }
  };

  walk(element);
  element.dataset.split = "true";
};

/**
 * TextReveal 组件 - 创建滚动时文本逐字显示的效果
 * @param {Object} options - 配置选项
 * @param {HTMLElement} options.element - 目标元素
 * @param {HTMLElement} [options.triggerElement] - 触发元素（默认为目标元素）
 * @param {string} [options.start="top 60%"] - 动画开始位置
 * @param {string} [options.end="top 10%"] - 动画结束位置
 * @param {number} [options.scrub=1.5] - 滚动跟随平滑度
 * @param {number} [options.stagger=0.06] - 字符间的延迟
 * @param {number} [options.steps=8] - 动画阶段数
 * @returns {Object} 控制对象，包含 destroy 方法
 */
export function TextReveal({
  element,
  triggerElement = null,
  start = "top 60%",
  end = "top 10%",
  scrub = 1.5,
  stagger = 0.06,
  steps = 8,
} = {}) {
  if (!element) {
    console.error("TextReveal: element is required");
    return { destroy: () => {} };
  }

  const trigger = triggerElement ?? element;
  let ctx = null;

  const init = () => {
    ctx = gsap.context(() => {
      splitTextIntoSpans(element);
      const chars = element.querySelectorAll(".text-reveal__char");

      if (!chars.length) {
        return;
      }

      const targetColor = getComputedStyle(element).color;

      gsap
        .timeline({
          scrollTrigger: {
            trigger,
            start,
            end,
            scrub,
            pin: true,
          },
        })
        .to(chars, {
          color: targetColor,
          ease: `steps(${steps})`,
          stagger,
        });
    }, element);
  };

  const destroy = () => {
    if (ctx) {
      ctx.revert();
      ctx = null;
    }
  };

  init();

  return {
    destroy,
    reinit: init,
  };
}

/**
 * 为多个元素创建 TextReveal 效果
 * @param {string|HTMLElement[]|NodeList} selector - CSS 选择器或元素数组
 * @param {Object} options - 配置选项
 * @returns {Object[]} TextReveal 实例数组
 */
export function createTextReveals(selector, options = {}) {
  const elements =
    typeof selector === "string"
      ? document.querySelectorAll(selector)
      : selector;

  return Array.from(elements).map((element) =>
    TextReveal({ element, ...options }),
  );
}
