import { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface FeatureIconProps {
    icon: React.ElementType;
    className?: string;
}

export function FeatureIcon({ icon: Icon, className }: FeatureIconProps) {
    return (
        <div
            className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-black transition-all duration-300 group-hover:scale-110",
                className
            )}
        >
            <Icon className="h-6 w-6 text-white" />
        </div>
    );
}
