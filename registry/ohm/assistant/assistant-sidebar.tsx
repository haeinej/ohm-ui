import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/ohm/ui/resizable";
import type { FC, PropsWithChildren } from "react";

import { Thread } from "@/registry/ohm/assistant/thread";

export const AssistantSidebar: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ResizablePanelGroup orientation="horizontal">
      <ResizablePanel>{children}</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <Thread />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
