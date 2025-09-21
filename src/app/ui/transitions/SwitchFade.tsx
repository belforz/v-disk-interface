import { ReactNode } from "react";

type Props = {
  activeKey: string; // muda -> dispara a transição
  children: ReactNode; // o componente atual
  timeout?: number; // default 300
  className?: string; // wrapper (use relative se quiser sobrepor)
  mode?: "out-in" | "in-out"; // default "out-in"
};

// No-op SwitchFade: keeps API but simply renders children. Useful for rollback.
export default function SwitchFade({ children, className }: Props) {
  return <div className={className}>{children}</div>;
}
