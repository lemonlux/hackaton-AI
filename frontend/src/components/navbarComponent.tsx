import { Button } from "@/components/ui/button";
import cls from "classnames";

export interface NavbarComponentProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isActive?: boolean;
}

export default function NavbarComponent(props: NavbarComponentProps) {
  const { children, onClick, isActive } = props;
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={cls(
        "w-full justify-start gap-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 rounded-xl transition-colors",
        {
          "bg-neutral-900": isActive,
          "text-neutral-100": isActive,
        }
      )}
    >
      {children}
    </Button>
  );
}
