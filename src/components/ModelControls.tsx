import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface ModelControlsProps {
  position: { x: number; y: number; z: number };
  scale: number;
  rotation: { x: number; y: number; z: number };
  onPositionChange: (axis: 'x' | 'y' | 'z', value: number) => void;
  onScaleChange: (value: number) => void;
  onRotationChange: (axis: 'x' | 'y' | 'z', value: number) => void;
}

export const ModelControls = ({
  position,
  scale,
  rotation,
  onPositionChange,
  onScaleChange,
  onRotationChange,
}: ModelControlsProps) => {
  return (
    <Card className="absolute top-20 right-4 p-4 w-80 bg-background/95 backdrop-blur z-20">
      <h3 className="text-lg font-semibold mb-4">Model Controls</h3>
      
      {/* Position Controls */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-medium text-muted-foreground">Position</h4>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>X</Label>
            <Input
              type="number"
              value={position.x.toFixed(2)}
              onChange={(e) => onPositionChange('x', parseFloat(e.target.value))}
              className="w-20 h-8"
            />
          </div>
          <Slider
            value={[position.x]}
            onValueChange={([value]) => onPositionChange('x', value)}
            min={-10}
            max={10}
            step={0.1}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Y</Label>
            <Input
              type="number"
              value={position.y.toFixed(2)}
              onChange={(e) => onPositionChange('y', parseFloat(e.target.value))}
              className="w-20 h-8"
            />
          </div>
          <Slider
            value={[position.y]}
            onValueChange={([value]) => onPositionChange('y', value)}
            min={-10}
            max={10}
            step={0.1}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Z</Label>
            <Input
              type="number"
              value={position.z.toFixed(2)}
              onChange={(e) => onPositionChange('z', parseFloat(e.target.value))}
              className="w-20 h-8"
            />
          </div>
          <Slider
            value={[position.z]}
            onValueChange={([value]) => onPositionChange('z', value)}
            min={-10}
            max={10}
            step={0.1}
          />
        </div>
      </div>

      {/* Scale Control */}
      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-medium text-muted-foreground">Scale</h4>
        <div className="flex items-center justify-between">
          <Label>Scale</Label>
          <Input
            type="number"
            value={scale.toFixed(0)}
            onChange={(e) => onScaleChange(parseFloat(e.target.value))}
            className="w-20 h-8"
          />
        </div>
        <Slider
          value={[scale]}
          onValueChange={([value]) => onScaleChange(value)}
          min={10}
          max={200}
          step={5}
        />
      </div>

      {/* Rotation Controls */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">Rotation (degrees)</h4>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>X</Label>
            <Input
              type="number"
              value={(rotation.x * 180 / Math.PI).toFixed(0)}
              onChange={(e) => onRotationChange('x', parseFloat(e.target.value) * Math.PI / 180)}
              className="w-20 h-8"
            />
          </div>
          <Slider
            value={[rotation.x * 180 / Math.PI]}
            onValueChange={([value]) => onRotationChange('x', value * Math.PI / 180)}
            min={-180}
            max={180}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Y</Label>
            <Input
              type="number"
              value={(rotation.y * 180 / Math.PI).toFixed(0)}
              onChange={(e) => onRotationChange('y', parseFloat(e.target.value) * Math.PI / 180)}
              className="w-20 h-8"
            />
          </div>
          <Slider
            value={[rotation.y * 180 / Math.PI]}
            onValueChange={([value]) => onRotationChange('y', value * Math.PI / 180)}
            min={-180}
            max={180}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Z</Label>
            <Input
              type="number"
              value={(rotation.z * 180 / Math.PI).toFixed(0)}
              onChange={(e) => onRotationChange('z', parseFloat(e.target.value) * Math.PI / 180)}
              className="w-20 h-8"
            />
          </div>
          <Slider
            value={[rotation.z * 180 / Math.PI]}
            onValueChange={([value]) => onRotationChange('z', value * Math.PI / 180)}
            min={-180}
            max={180}
            step={1}
          />
        </div>
      </div>
    </Card>
  );
};
