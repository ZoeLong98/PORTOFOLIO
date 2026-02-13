import type { HeroData } from "@/data/types";
import RotatingText from "@/components/ReactBits/RotatingText";

type HeroSectionProps = {
  data: HeroData;
};

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <div className="flex h-full flex-col justify-center">
      <h1 className="heading-display">{data.greeting}</h1>
      <RotatingText
        texts={data.titles}
        mainClassName="heading-display"
        staggerFrom={"random"}
        initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 1.1, filter: "blur(4px)" }}
        staggerDuration={0.02}
        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
        transition={{ type: "tween", duration: 1.0, ease: "easeOut" }}
        rotationInterval={4000}
      />
    </div>
  );
}
