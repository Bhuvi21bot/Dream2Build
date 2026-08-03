import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { usePlannerStore } from "../store";
import { FloorPlan2D } from "./FloorPlan2D";
import { FloorPlan3D } from "./FloorPlan3D";
import { GripVertical } from "lucide-react";

export function SplitView() {
  const view = usePlannerStore((state) => state.view);

  if (view === '2d') {
    return <FloorPlan2D />;
  }

  if (view === '3d') {
    return <FloorPlan3D />;
  }

  return (
    <PanelGroup direction="horizontal" className="h-full w-full">
      <Panel defaultSize={50} minSize={20}>
        <FloorPlan2D />
      </Panel>
      
      <PanelResizeHandle className="w-1 bg-[#2a1a0e] hover:bg-amber-500/50 transition-colors flex flex-col items-center justify-center relative cursor-col-resize z-20 group">
        <div className="h-8 w-4 bg-[#120b05] border border-[#2a1a0e] rounded flex items-center justify-center shadow-md absolute z-10 group-hover:border-amber-500/50">
          <GripVertical className="w-3 h-3 text-foreground/40 group-hover:text-amber-500" />
        </div>
      </PanelResizeHandle>
      
      <Panel defaultSize={50} minSize={20}>
        <FloorPlan3D />
      </Panel>
    </PanelGroup>
  );
}
