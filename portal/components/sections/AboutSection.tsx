import type { AboutData } from "@/data/types";
import { CloseButton } from "./ui/CloseButton";
import { SectionHeading_Clickable } from "./ui/SectionHeading_Clickable";

type AboutSectionProps = {
  data: AboutData;
  onExpand?: () => void;
  isExpanded?: boolean;
};

export function AboutSection({
  data,
  onExpand,
  isExpanded = false,
}: AboutSectionProps) {
  if (isExpanded) {
    return (
      <div className="relative h-full">
        <CloseButton onClick={onExpand} />

        {/* Mobile: stacked layout / Desktop: side-by-side */}
        <div className="flex h-full flex-col md:flex-row md:items-center md:gap-12 lg:gap-12 m-12">
          <div className="flex shrink-0 items-center justify-center py-6 md:w-2/5 md:py-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.image}
              alt={data.imageAlt}
              className="h-48 w-48 object-contain sm:h-56 sm:w-56 md:h-72 md:w-72 lg:h-80 lg:w-80"
            />
          </div>
          <div className="md:w-3/5">
            <SectionHeading_Clickable onClick={onExpand}>
              {`About Me`}
            </SectionHeading_Clickable>
            <p className="text-body leading-relaxed text-black md:text-lg md:leading-relaxed">
              {data.text}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between">
        <SectionHeading_Clickable onClick={onExpand}>
          {`About Me`}
        </SectionHeading_Clickable>
      </div>

      <div className="mt-3 flex items-start gap-3 sm:mt-4 sm:gap-4 xl:gap-6">
        <div className="relative h-24 w-24 shrink-0 sm:h-32 sm:w-32 md:h-40 md:w-40 xl:h-56 xl:w-56">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.image}
            alt={data.imageAlt}
            className="h-full w-full object-contain"
          />
        </div>
        <p className="flex-1 text-body text-black">{data.text}</p>
      </div>
    </div>
  );
}
