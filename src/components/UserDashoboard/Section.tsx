import React from "react";

interface SectionProps {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  icon: Icon,
  children,
  className = "",
}) => {
  return (
    <div className={`bg-white rounded-xl p-6 ${className}`}>
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <h3 className="text-lg font-semibold text-[#484848]">{title}</h3>
        </div>
        {/* Horizontal line */}
        <div className="mt-2 h-px bg-[#C5C5C5]" />
      </div>
      {children}
    </div>
  );
};

export default Section;
