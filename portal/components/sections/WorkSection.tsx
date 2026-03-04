import type { ProjectCategory } from "@/data/types";
import { CloseButton } from "./ui/CloseButton";
import { ProjectCard } from "./ui/ProjectCard";
import { SectionHeading_Clickable } from "./ui/SectionHeading_Clickable";

type WorkSectionProps = {
  data: ProjectCategory[];
  onExpand?: () => void;
  isExpanded?: boolean;
};

export function WorkSection({
  data,
  onExpand,
  isExpanded = false,
}: WorkSectionProps) {
  return (
    <div className="relative h-full">
      <div className="flex items-center justify-between">
        <SectionHeading_Clickable onClick={onExpand}>
          Work
        </SectionHeading_Clickable>
      </div>
      {isExpanded && <CloseButton onClick={onExpand} />}
      {[...data].sort((a, b) =>
        a.category.toLowerCase() === "figma" ? 1 : b.category.toLowerCase() === "figma" ? -1 : 0
      ).map((group) => (
        <div key={group.category} className="mb-12 mt-8">
          <p className="my-8 text-lg underline">{group.category}</p>
          <div
            className={`mt-2 ${isExpanded ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}`}
          >
            {group.projects.map((project) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                image={project.image}
                techStack={project.techStack}
                href={project.href}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
