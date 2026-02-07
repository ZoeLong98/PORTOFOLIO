/**
 * TextReveal 使用示例
 *
 * 在 script.js 或 animation.js 中导入并使用：
 */

import { TextReveal, createTextReveals } from "./TextReveal.js";

// ============================================
// 方法 1: 为单个元素创建 TextReveal 效果
// ============================================

const introElement = document.querySelector(".intro__text");
if (introElement) {
  const textReveal = TextReveal({
    element: introElement,
    start: "top 60%", // 动画开始：元素顶部距离视口顶部 60%
    end: "top 10%", // 动画结束：元素顶部距离视口顶部 10%
    scrub: 1.5, // 滚动跟随平滑度（0 = 无平滑，数值越大越平滑）
    stagger: 0.06, // 字符间的延迟时间（秒）
    steps: 8, // 动画阶段数（越大越平滑）
  });

  // 如果需要清理（如页面卸载时）
  // textReveal.destroy();
}

// ============================================
// 方法 2: 为多个元素同时创建 TextReveal 效果
// ============================================

// 使用 CSS 选择器
const reveals = createTextReveals(".text-reveal", {
  start: "top 70%",
  end: "top 20%",
  scrub: 1,
  stagger: 0.08,
  steps: 10,
});

// ============================================
// 方法 3: 在 HTML 中添加样式
// ============================================

// 在 index.html 的 .black 部分中，可以这样添加：
/*
<section class="black">
  <div class="emotion emotion__title--white" style="text-align: center">
    EMOTION
  </div>

  <div class="intro text-reveal">
    This text will reveal character by character as you scroll down the page.
    The animation follows your scroll position smoothly.
  </div>

  <div class="text-reveal" style="color: white; font-size: 24px; margin-top: 50vh; padding: 20px;">
    Another text that can have the reveal effect applied to it.
  </div>
</section>
*/

// ============================================
// 配置选项说明
// ============================================
/*
{
  element: HTMLElement,          // 必需：要应用效果的元素
  triggerElement: HTMLElement,   // 可选：触发动画的元素（默认为 element）
  start: "top 60%",              // ScrollTrigger 开始位置
  end: "top 10%",                // ScrollTrigger 结束位置
  scrub: 1.5,                    // 滚动跟随平滑度（推荐 1-2）
  stagger: 0.06,                 // 字符间延迟（秒，推荐 0.02-0.1）
  steps: 8,                       // 动画步数（推荐 6-12）
}
*/
