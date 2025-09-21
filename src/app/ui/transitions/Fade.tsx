import { ReactNode } from "react";
import "./css/component-fade.css";

type Props = {
  show: boolean;
  children: ReactNode;
  timeout?: number; // ms (default 300)
  unmountOnExit?: boolean; // default true
  className?: string; // wrapper (posicionamento opcional)
};

// No-op fallback wrapper — keeps same API but does not perform animated transitions.
// This allows rolling back transition behavior without changing callers.
export default function ComponentFade({
  children,
  className,
}: Props) {
  return <div className={className}>{children}</div>;
}
