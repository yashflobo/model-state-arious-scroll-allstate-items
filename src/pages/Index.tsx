import { useState } from "react";
import { Canvas3D } from "@/components/Canvas3D";
import { ModelControls } from "@/components/ModelControls";
import { Button } from "@/components/ui/button";

const Index = () => {
  // Initial default position
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [scale, setScale] = useState(20000);
  const [rotation, setRotation] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const animateToState1 = () => {
    setPosition({ x: 0.8, y: -1.9, z: 9.7 });
    setScale(22000);
    setRotation({
      x: (51 * Math.PI) / 180,
      y: (117 * Math.PI) / 180,
      z: (13 * Math.PI) / 180,
    });
  };

  const animateToState2 = () => {
    setPosition({ x: -0.70, y: -1.50, z: 6.60 });
    setScale(20000);
    setRotation({
      x: (-17 * Math.PI) / 180,
      y: (13 * Math.PI) / 180,
      z: (63 * Math.PI) / 180,
    });
  };

  const resetToDefault = () => {
    setPosition({ x: 0, y: 0, z: 0 });
    setScale(20000);
    setRotation({ x: 0, y: 0, z: 0 });
  };

  const handlePositionChange = (axis: "x" | "y" | "z", value: number) => {
    setPosition((prev) => ({ ...prev, [axis]: value }));
  };

  const handleRotationChange = (axis: "x" | "y" | "z", value: number) => {
    setRotation((prev) => ({ ...prev, [axis]: value }));
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-gradient-bg">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />

      {/* Title */}
      <div className="absolute top-8 left-0 right-0 z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
          <span className="bg-gradient-primary bg-clip-text text-slate-50">ARious Logo</span> Model
        </h1>
        <p className="mt-2 text-muted-foreground text-sm md:text-base">Hover to interact with the model</p>
        <div className="flex gap-3 mt-4 justify-center">
          <Button onClick={animateToState1}>
            State 1
          </Button>
          <Button onClick={animateToState2}>
            State 2
          </Button>
          <Button onClick={resetToDefault} variant="outline">
            Reset
          </Button>
        </div>
      </div>

      {/* Model Controls */}
      <ModelControls
        position={position}
        scale={scale}
        rotation={rotation}
        onPositionChange={handlePositionChange}
        onScaleChange={setScale}
        onRotationChange={handleRotationChange}
      />

      {/* 3D Canvas */}
      <Canvas3D position={position} scale={scale} rotation={rotation} />

      {/* Subtle glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />
      </div>
    </main>
  );
};

export default Index;
