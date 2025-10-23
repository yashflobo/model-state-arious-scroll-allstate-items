import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface State1_5ControlsProps {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  onPositionChange: (axis: "x" | "y" | "z", value: number) => void;
  onRotationChange: (axis: "x" | "y" | "z", value: number) => void;
}

export const State1_5Controls = ({
  position,
  rotation,
  onPositionChange,
  onRotationChange,
}: State1_5ControlsProps) => {
  return (
    <Card className="absolute left-4 top-32 z-20 p-4 w-80 max-h-[calc(100vh-150px)] overflow-y-auto bg-background/95 backdrop-blur">
      <h3 className="text-lg font-semibold mb-4 text-foreground">State 1.5 Controls</h3>
      
      {/* Position Controls */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-medium text-muted-foreground">Position</h4>
        
        {(["x", "y", "z"] as const).map((axis) => (
          <div key={`pos-${axis}`} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground uppercase">{axis}</Label>
              <Input
                type="number"
                value={position[axis].toFixed(2)}
                onChange={(e) => onPositionChange(axis, parseFloat(e.target.value) || 0)}
                className="w-20 h-7 text-xs"
                step="0.1"
              />
            </div>
            <Slider
              value={[position[axis]]}
              onValueChange={([value]) => onPositionChange(axis, value)}
              min={-10}
              max={10}
              step={0.1}
              className="w-full"
            />
          </div>
        ))}
      </div>

      {/* Rotation Controls */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">Rotation (degrees)</h4>
        
        {(["x", "y", "z"] as const).map((axis) => (
          <div key={`rot-${axis}`} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground uppercase">{axis}</Label>
              <Input
                type="number"
                value={((rotation[axis] * 180) / Math.PI).toFixed(1)}
                onChange={(e) =>
                  onRotationChange(axis, ((parseFloat(e.target.value) || 0) * Math.PI) / 180)
                }
                className="w-20 h-7 text-xs"
                step="1"
              />
            </div>
            <Slider
              value={[(rotation[axis] * 180) / Math.PI]}
              onValueChange={([value]) => onRotationChange(axis, (value * Math.PI) / 180)}
              min={-180}
              max={180}
              step={1}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </Card>
  );
};
