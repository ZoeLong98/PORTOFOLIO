import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CharacterNetworkVisualizer } from "./dangling.js";
import { TextReveal } from "./TextReveal.js";
import { initEmotionCloud } from "./emotionCloud.js";
initEmotionCloud();
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

// Scroll animation
const scrollAnimation = () => {
  const emotion = document.querySelector(".emotion__title--black");
  const emotionWhite = document.querySelector(".emotion__title--white");
  const canvas = document.querySelector("canvas.webgl");
  const eyes = document.querySelectorAll(".eye"); // Select all eyes
  const black = document.querySelector(".intro__container");
  const hero = document.querySelector(".hero__container");
  const wordlist = document.querySelector(".wordlist");
  const wordlist2 = document.querySelector(".wordlist2");
  const word = document.querySelector(".word");
  const transparent = document.querySelector(".transparent");
  const emotionCloud = document.querySelector(".emotion-cloud");

  emotionCloud.style.opacity = 0;
  wordlist.style.opacity = 0;
  wordlist2.style.opacity = 0;
  const networkVisualizer = new CharacterNetworkVisualizer();
  networkVisualizer.init();

  // Get emotion height and calculate offset
  const emotionHeight = emotion.offsetHeight;
  const emotionOffset = Math.ceil(emotionHeight / 2);

  /**
   * Eye Blur Animation
   * */
  gsap.to(eyes, {
    opacity: 0,
    filter: "blur(8px)",
    scrollTrigger: {
      trigger: black,
      start: "top bottom",
      end: `top center-=${emotionOffset}`,
      scrub: 2,
      pin: hero,
      pinSpacing: false,
    },
  });

  /**
   * Black and White Transition
   * */
  // letter spacing animation for both emotion titles
  gsap.to([emotion, emotionWhite], {
    letterSpacing: "1.5em",
    scrollTrigger: {
      trigger: black,
      start: `top center+=${emotionOffset}`,
      end: `top center-=${emotionOffset}`,
      scrub: 2,
    },
  });
  // Clip-path animation for white emotion title
  gsap.to(".emotion__title--white", {
    clipPath: "inset(0% 0 0 0)",
    ease: "none",
    scrollTrigger: {
      trigger: black,
      start: `top center+=${emotionOffset}`,
      end: `top center-=${emotionOffset}`,
      scrub: true,
      onLeave: () => {
        black.style.position = "relative";
        emotionWhite.style.position = "absolute";
        emotionWhite.style.top = "1%";
      },
      onEnterBack: () => {
        emotionWhite.style.position = "fixed";
        emotionWhite.style.left = "50%";
        emotionWhite.style.top = "50%";
        emotionWhite.style.transform = "translate(-50%, -50%)";
      },
    },
  });

  ScrollTrigger.create({
    trigger: ".intro__container",
    start: "top top",
    onEnter: () => {
      emotionWhite.style.position = "fixed";
      emotionWhite.style.height = "50vh";
      emotionWhite.style.top = "0";
      emotionWhite.style.left = "50%";
      emotionWhite.style.transform = "translateX(-50%)";
      console.log("EMOTION pinned to top");
    },
    onLeaveBack: () => {
      emotionWhite.style.position = "absolute";
      emotionWhite.style.height = "auto";
      emotionWhite.style.left = "50%";
      emotionWhite.style.transform = "translateX(-50%)";
      console.log("EMOTION back to absolute");
    },
  });

  /**
   * Char Animation
   * */
  const split = new SplitText(".emotion__title--white", {
    type: "chars",
  });
  split.chars.forEach((char) => {
    const wrapper = document.createElement("span");
    wrapper.className = "char-wrap";
    char.parentNode.replaceChild(wrapper, char);
    wrapper.appendChild(char);
  });

  // Character animation with network visualization
  let charAnimationTrigger = null;

  const handleCharResize = () => {
    // Update character positions on resize
    if (networkVisualizer.isVisible) {
      networkVisualizer.updateCharacterPositions(split.chars);
    }
  };

  charAnimationTrigger = ScrollTrigger.create({
    trigger: ".intro__container",
    start: "10% top",
    onEnter: () => {
      // Show network visualization with fade in
      networkVisualizer.show(0.5);

      gsap.fromTo(
        split.chars,
        { y: 0 },
        {
          y: () => {
            const baseDistance = 20;
            const randomOffset = Math.random() * 10 - 5;
            return baseDistance + randomOffset + "vh";
          },
          duration: 3,
          ease: "elastic.out(1, 0.4)",
          stagger: 0.1,
          onUpdate: () => {
            // Update network visualizer with current character positions
            networkVisualizer.updateCharacterPositions(split.chars);
          },
        },
      );

      // Listen for resize during animation
      window.addEventListener("resize", handleCharResize);
    },
    onLeaveBack: () => {
      // Hide network visualization with fade out
      networkVisualizer.hide(0.5);

      // Remove resize listener
      window.removeEventListener("resize", handleCharResize);

      // Kill any ongoing animations and immediately reset to y: 0
      gsap.killTweensOf(split.chars);
      gsap.to(split.chars, {
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
      });
    },
  });

  /**
   * TextReveal Animation
   * */
  const introElement = document.querySelector(".intro__text");
  if (introElement) {
    TextReveal({
      element: introElement,
      start: "top center",
      end: "bottom center",
      scrub: true,
      stagger: 0.06,
      steps: 8,
    });
  }
  // fade out
  gsap.to(".intro__text", {
    opacity: 0,
    scrollTrigger: {
      trigger: ".intro__text",
      start: "center center",
      end: "bottom center",
      scrub: 1,
      markers: false,
    },
  });

  /**
   * Transition Animate compress page into sphere
   * */
  gsap.fromTo(
    ".transition--black",
    { clipPath: "circle(100% at 50% 50%)" },
    {
      clipPath: "circle(0% at 50% 50%)",
      scrollTrigger: {
        trigger: ".transition--black",
        start: "top top",
        end: "top+=200 top",
        scrub: true,
        pin: true,
        pinSpacing: false,
      },
    },
  );
  // Fade out emotion text
  gsap.to(".intro__container", {
    opacity: 0,
    scrollTrigger: {
      trigger: ".transition--black",
      start: "top top",
      end: "top+=200 top",
      scrub: 1,
      markers: false,
    },
  });

  /**
   * Word switching animation
   *  */
  const words = ["HAPPY", "SAD", "ANGRY", "EXCITED", "TENDER", "SCARED"];
  let currentWordIndex = 0;
  let wordSwitchTimeline = null;

  const stopWordSwitching = () => {
    if (wordSwitchTimeline) {
      clearInterval(wordSwitchTimeline);
      wordSwitchTimeline = null;
      currentWordIndex = 0;
    }
  };

  const startWordSwitching = () => {
    if (!wordSwitchTimeline) {
      wordSwitchTimeline = setInterval(() => {
        currentWordIndex = (currentWordIndex + 1) % words.length;
        if (word) {
          word.textContent = words[currentWordIndex];
        }
      }, 2000); // Switch word every 2 seconds
    }
  };

  const ExpandWord = () => {
    const wordlist = document.querySelector(".wordlist2");
    const emotion = document.querySelector(".emotion-cloud");
    // Toggle between two sizes
    gsap.to(wordlist, {
      width: wordlist.dataset.toggled === "true" ? "4vw" : "100vw",
      height: wordlist.dataset.toggled === "true" ? "auto" : "100vh",
      opacity: emotion.style.opacity === "0" ? 1 : 0,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        wordlist.dataset.toggled =
          wordlist.dataset.toggled === "true" ? "false" : "true";
      },
    });
    if (emotion.style.opacity === "0") {
      gsap.to(emotion, {
        opacity: 1,
        delay: 0.5,
      });
    } else {
      gsap.to(emotion, {
        opacity: 0,
      });
    }

    currentWordIndex = (currentWordIndex + 1) % words.length;
  };

  // Add click event to wordlist
  if (word) {
    word.addEventListener("click", ExpandWord);
    word.style.cursor = "pointer"; // Change cursor to indicate clickability
  }

  ScrollTrigger.create({
    trigger: ".transition--black",
    start: "bottom+=50% bottom",
    end: "bottom top",
    onEnter: () => {
      gsap.to(".wordlist", {
        opacity: 1,
        duration: 0.8,
        pin: true,
        ease: "power2.out",
      });
      startWordSwitching();
    },
    onLeaveBack: () => {
      stopWordSwitching();
      gsap.to(".wordlist", {
        opacity: 0,
        duration: 0.8,
        pin: true,
        ease: "power2.in",
      });
    },
  });
};

scrollAnimation();
