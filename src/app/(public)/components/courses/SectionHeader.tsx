import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  gradientColor: string;
}

export default function SectionHeader({ 
  title, 
  icon: Icon, 
  iconBgColor, 
  iconColor, 
  gradientColor 
}: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className={`text-3xl font-bold text-gray-900 flex items-center gap-3`}>
        <div className={`w-10 h-10 ${iconBgColor} rounded-xl flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        {title}
      </h2>
      <div className={`mt-2 h-1 w-20 bg-gradient-to-r ${gradientColor} rounded-full`}></div>
    </div>
  );
}