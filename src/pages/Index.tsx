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
  const [sensitivity, setSensitivity] = useState(1.0);
  const [showState1Text, setShowState1Text] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [currentAnimatingState, setCurrentAnimatingState] = useState<'state1' | 'state2' | null>(null);
  const [showControls, setShowControls] = useState(true);

  const animateToState1 = () => {
    setPosition({ x: 0.7, y: -1.5, z: 6.6 });
    setScale(20000);
    setRotation({
      x: (-17 * Math.PI) / 180,
      y: (-13 * Math.PI) / 180,
      z: (-63 * Math.PI) / 180,
    });
    setCurrentAnimatingState('state1');
    setShowState1Text(false);
    setIsFadingOut(false);
  };

  const animateToState2 = () => {
    setPosition({ x: -0.7, y: -1.5, z: 6.6 });
    setScale(20000);
    setRotation({
      x: (-17 * Math.PI) / 180,
      y: (13 * Math.PI) / 180,
      z: (63 * Math.PI) / 180,
    });
    setCurrentAnimatingState('state2');
    // Hide text with fade-out
    if (showState1Text) {
      setIsFadingOut(true);
      setTimeout(() => {
        setShowState1Text(false);
        setIsFadingOut(false);
      }, 300);
    }
  };

  const resetToDefault = () => {
    setPosition({ x: 0, y: 0, z: 0 });
    setScale(20000);
    setRotation({ x: 0, y: 0, z: 0 });
    setCurrentAnimatingState(null);
    // Hide text with fade-out
    if (showState1Text) {
      setIsFadingOut(true);
      setTimeout(() => {
        setShowState1Text(false);
        setIsFadingOut(false);
      }, 300);
    }
  };

  const handleAnimationProgress = (progress: number) => {
    if (currentAnimatingState === 'state1' && progress >= 0.8 && !showState1Text) {
      setShowState1Text(true);
    }
  };

  const handlePositionChange = (axis: "x" | "y" | "z", value: number) => {
    setPosition((prev) => ({ ...prev, [axis]: value }));
  };

  const handleRotationChange = (axis: "x" | "y" | "z", value: number) => {
    setRotation((prev) => ({ ...prev, [axis]: value }));
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />

      {/* Title */}
      <div className="absolute top-8 left-0 right-0 z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
          <span className="bg-gradient-primary bg-clip-text text-slate-50">ARious Logo</span> Model
        </h1>
        <p className="mt-2 text-muted-foreground text-sm md:text-base">Hover to interact with the model</p>
        <div className="flex gap-3 mt-4 justify-center">
          <Button onClick={animateToState1}>State 1</Button>
          <Button onClick={animateToState2}>State 2</Button>
          <Button onClick={resetToDefault} variant="outline">
            Reset
          </Button>
          <Button onClick={() => setShowControls(!showControls)} variant="secondary">
            {showControls ? 'Hide' : 'Show'} Controls
          </Button>
        </div>
      </div>

      {/* Model Controls */}
      {showControls && (
        <ModelControls
          position={position}
          scale={scale}
          rotation={rotation}
          sensitivity={sensitivity}
          onPositionChange={handlePositionChange}
          onScaleChange={setScale}
          onRotationChange={handleRotationChange}
          onSensitivityChange={setSensitivity}
        />
      )}

      {/* State 1 Text Display */}
      {showState1Text && (
        <div className={`absolute right-8 top-1/2 -translate-y-1/2 z-20 ${isFadingOut ? 'animate-fade-out' : 'animate-fade-in'}`}>
          <div className="p-6 max-w-md">
            <h2 className="text-2xl font-bold mb-3 text-foreground">State 1 Active</h2>
            <p className="text-muted-foreground">
              Sample text content that appears when State 1 animation is nearly complete.
            </p>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas3D position={position} scale={scale} rotation={rotation} sensitivity={sensitivity} onAnimationProgress={handleAnimationProgress} />

      {/* Subtle glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />
      </div>
    </main>
  );
};

export default Index;
