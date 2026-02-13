import type { ContactEntry } from "@/data/types";

type ContactSectionProps = {
  data: ContactEntry[];
};

export function ContactSection({ data }: ContactSectionProps) {
  return (
    <div className="h-full">
      <h3 className="heading-section-sm">Contact Me</h3>
      <div className="mt-4 space-y-2">
        {data.map((entry) => (
          <a
            key={entry.value}
            href={entry.href}
            className="flex items-baseline gap-2 text-gray-600 hover:text-black"
          >
            <span>{entry.value}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
