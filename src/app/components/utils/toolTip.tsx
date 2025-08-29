import * as Tooltip from "@radix-ui/react-tooltip";

interface ToolTipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

export function ToolTip({ content, children }: ToolTipProps) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            className="px-3 py-2 bg-black text-white rounded shadow-lg text-xs"
          >
            {content}
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}