import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CTMachineControlsProps {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
  onPositionChange: (axis: "x" | "y" | "z", value: number) => void;
  onRotationChange: (axis: "x" | "y" | "z", value: number) => void;
  onScaleChange: (value: number) => void;
  onReset?: () => void;
}

export const CTMachineControls = ({
  position,
  rotation,
  scale,
  onPositionChange,
  onRotationChange,
  onScaleChange,
  onReset,
}: CTMachineControlsProps) => {
  const radToDeg = (rad: number) => (rad * 180) / Math.PI;
  const degToRad = (deg: number) => (deg * Math.PI) / 180;

  return (
    <Card className="absolute left-4 top-[45%] -translate-y-1/2 z-10 p-4 max-w-xs bg-background/95 backdrop-blur">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">CT Machine Controls</h3>
          {onReset && (
            <Button onClick={onReset} variant="outline" size="sm">
              Reset
            </Button>
          )}
        </div>

        {/* Position Controls */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground">Position</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ct-pos-x" className="text-xs">X</Label>
              <Input
                id="ct-pos-x"
                type="number"
                value={position.x.toFixed(2)}
                onChange={(e) => onPositionChange("x", parseFloat(e.target.value))}
                className="w-20 h-7 text-xs"
                step="0.1"
              />
            </div>
            <Slider
              value={[position.x]}
              onValueChange={(v) => onPositionChange("x", v[0])}
              min={-5}
              max={5}
              step={0.1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ct-pos-y" className="text-xs">Y</Label>
              <Input
                id="ct-pos-y"
                type="number"
                value={position.y.toFixed(2)}
                onChange={(e) => onPositionChange("y", parseFloat(e.target.value))}
                className="w-20 h-7 text-xs"
                step="0.1"
              />
            </div>
            <Slider
              value={[position.y]}
              onValueChange={(v) => onPositionChange("y", v[0])}
              min={-5}
              max={5}
              step={0.1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ct-pos-z" className="text-xs">Z</Label>
              <Input
                id="ct-pos-z"
                type="number"
                value={position.z.toFixed(2)}
                onChange={(e) => onPositionChange("z", parseFloat(e.target.value))}
                className="w-20 h-7 text-xs"
                step="0.1"
              />
            </div>
            <Slider
              value={[position.z]}
              onValueChange={(v) => onPositionChange("z", v[0])}
              min={-2}
              max={15}
              step={0.1}
            />
          </div>
        </div>

        {/* Rotation Controls */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground">Rotation (degrees)</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ct-rot-x" className="text-xs">X</Label>
              <Input
                id="ct-rot-x"
                type="number"
                value={radToDeg(rotation.x).toFixed(1)}
                onChange={(e) => onRotationChange("x", degToRad(parseFloat(e.target.value)))}
                className="w-20 h-7 text-xs"
                step="1"
              />
            </div>
            <Slider
              value={[radToDeg(rotation.x)]}
              onValueChange={(v) => onRotationChange("x", degToRad(v[0]))}
              min={-180}
              max={180}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ct-rot-y" className="text-xs">Y</Label>
              <Input
                id="ct-rot-y"
                type="number"
                value={radToDeg(rotation.y).toFixed(1)}
                onChange={(e) => onRotationChange("y", degToRad(parseFloat(e.target.value)))}
                className="w-20 h-7 text-xs"
                step="1"
              />
            </div>
            <Slider
              value={[radToDeg(rotation.y)]}
              onValueChange={(v) => onRotationChange("y", degToRad(v[0]))}
              min={-180}
              max={180}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ct-rot-z" className="text-xs">Z</Label>
              <Input
                id="ct-rot-z"
                type="number"
                value={radToDeg(rotation.z).toFixed(1)}
                onChange={(e) => onRotationChange("z", degToRad(parseFloat(e.target.value)))}
                className="w-20 h-7 text-xs"
                step="1"
              />
            </div>
            <Slider
              value={[radToDeg(rotation.z)]}
              onValueChange={(v) => onRotationChange("z", degToRad(v[0]))}
              min={-180}
              max={180}
              step={1}
            />
          </div>
        </div>

        {/* Scale Control */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground">Scale</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ct-scale" className="text-xs">Uniform</Label>
              <Input
                id="ct-scale"
                type="number"
                value={scale.toFixed(2)}
                onChange={(e) => onScaleChange(parseFloat(e.target.value))}
                className="w-20 h-7 text-xs"
                step="0.1"
              />
            </div>
            <Slider
              value={[scale]}
              onValueChange={(v) => onScaleChange(v[0])}
              min={0.1}
              max={5}
              step={0.1}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
