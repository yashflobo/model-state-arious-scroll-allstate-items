import { useState, useEffect, useRef } from "react";
import { Canvas3D } from "@/components/Canvas3D";
import { ModelControls } from "@/components/ModelControls";
import { EditFacesPanel } from "@/components/EditFacesPanel";
import { Button } from "@/components/ui/button";
import * as THREE from "three";

// State machine for scroll sequence
enum Stage {
  Initial = 0,   // reset
  State1  = 1,
  Reset1  = 2,   // reset after State1
  State2  = 3,
  Reset2  = 4,   // reset after State2
}
const MAX_STAGE = Stage.Reset2 as const;

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
  const [showState2Text, setShowState2Text] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFadingOut2, setIsFadingOut2] = useState(false);
  const [currentAnimatingState, setCurrentAnimatingState] = useState<'state1' | 'state2' | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [showEditFaces, setShowEditFaces] = useState(false);
  const [modelScene, setModelScene] = useState<THREE.Group | null>(null);
  const [scrollStage, setScrollStage] = useState<Stage>(Stage.Initial);
  const isTransitioningRef = useRef(false);
  
  // Check for reduced motion preference
  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Promise-based animators with direction awareness
  const animateToState1 = (opts?: { direction?: 'forward' | 'backward' }): Promise<void> => {
    return new Promise((resolve) => {
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
      
      // Hide State 2 text with fade-out
      if (showState2Text) {
        setIsFadingOut2(true);
        setTimeout(() => {
          setShowState2Text(false);
          setIsFadingOut2(false);
        }, 300);
      }
      
      // Resolve after animation completes (based on Scene3D's animation duration)
      setTimeout(resolve, prefersReduced ? 0 : 1500);
    });
  };

  const animateToState2 = (opts?: { direction?: 'forward' | 'backward' }): Promise<void> => {
    return new Promise((resolve) => {
      setPosition({ x: -0.7, y: -1.5, z: 6.6 });
      setScale(20000);
      setRotation({
        x: (-17 * Math.PI) / 180,
        y: (13 * Math.PI) / 180,
        z: (63 * Math.PI) / 180,
      });
      setCurrentAnimatingState('state2');
      setShowState2Text(false);
      setIsFadingOut2(false);
      
      // Hide State 1 text with fade-out
      if (showState1Text) {
        setIsFadingOut(true);
        setTimeout(() => {
          setShowState1Text(false);
          setIsFadingOut(false);
        }, 300);
      }
      
      // Resolve after animation completes
      setTimeout(resolve, prefersReduced ? 0 : 1500);
    });
  };

  const resetToDefault = (): Promise<void> => {
    return new Promise((resolve) => {
      setPosition({ x: 0, y: 0, z: 0 });
      setScale(20000);
      setRotation({ x: 0, y: 0, z: 0 });
      setCurrentAnimatingState(null);
      
      // Hide State 1 text with fade-out
      if (showState1Text) {
        setIsFadingOut(true);
        setTimeout(() => {
          setShowState1Text(false);
          setIsFadingOut(false);
        }, 300);
      }
      
      // Hide State 2 text with fade-out
      if (showState2Text) {
        setIsFadingOut2(true);
        setTimeout(() => {
          setShowState2Text(false);
          setIsFadingOut2(false);
        }, 300);
      }
      
      // Resolve after animation completes
      setTimeout(resolve, prefersReduced ? 0 : 1500);
    });
  };

  const handleAnimationProgress = (progress: number) => {
    if (currentAnimatingState === 'state1' && progress >= 0.8 && !showState1Text) {
      setShowState1Text(true);
    }
    if (currentAnimatingState === 'state2' && progress >= 0.8 && !showState2Text) {
      setShowState2Text(true);
    }
  };

  const handlePositionChange = (axis: "x" | "y" | "z", value: number) => {
    setPosition((prev) => ({ ...prev, [axis]: value }));
  };

  const handleRotationChange = (axis: "x" | "y" | "z", value: number) => {
    setRotation((prev) => ({ ...prev, [axis]: value }));
  };

  // Transition runner - maps stages to animations
  const runTransition = async (next: Stage, direction: 'forward' | 'backward') => {
    switch (next) {
      case Stage.State1:
        await animateToState1({ direction });
        break;
      case Stage.State2:
        await animateToState2({ direction });
        break;
      case Stage.Initial:
      case Stage.Reset1:
      case Stage.Reset2:
      default:
        await resetToDefault();
        break;
    }
  };

  // Advance to next/previous stage
  const advance = async (dir: 1 | -1) => {
    if (isTransitioningRef.current) return;
    
    const next = Math.max(0, Math.min(MAX_STAGE, scrollStage + dir)) as Stage;
    if (next === scrollStage) return; // Already at boundary
    
    isTransitioningRef.current = true;
    const direction = dir > 0 ? 'forward' : 'backward';
    await runTransition(next, direction);
    setScrollStage(next);
    isTransitioningRef.current = false;
  };

  // Multi-device input normalization
  useEffect(() => {
    const THRESHOLD = 80; // px of intent before we count a "step"
    let accumulator = 0;
    let touchStartY = 0;

    const normalizeDeltaY = (e: WheelEvent) => e.deltaY * (e.deltaMode === 1 ? 16 : 1);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dy = normalizeDeltaY(e);
      accumulator += dy;
      if (Math.abs(accumulator) >= THRESHOLD && !isTransitioningRef.current) {
        const dir = accumulator > 0 ? 1 : -1;
        accumulator = 0;
        advance(dir);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        advance(1);
      }
      if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        advance(-1);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const dy = touchStartY - e.touches[0].clientY;
      if (Math.abs(dy) >= THRESHOLD && !isTransitioningRef.current) {
        e.preventDefault();
        advance(dy > 0 ? 1 : -1);
        touchStartY = e.touches[0].clientY;
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    // Prevent page scroll during sequence
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('wheel', onWheel as any);
      window.removeEventListener('keydown', onKey as any);
      window.removeEventListener('touchstart', onTouchStart as any);
      window.removeEventListener('touchmove', onTouchMove as any);
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [scrollStage]);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black" data-stage={scrollStage}>
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />

      {/* Title */}
      <div className="absolute top-8 left-0 right-0 z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
          <span className="bg-gradient-primary bg-clip-text text-slate-50">ARious Logo</span> Model
        </h1>
        <p className="mt-2 text-muted-foreground text-sm md:text-base">Hover to interact with the model</p>
        <div className="flex gap-3 mt-4 justify-center">
          <Button onClick={() => animateToState1()}>State 1</Button>
          <Button onClick={() => animateToState2()}>State 2</Button>
          <Button onClick={() => resetToDefault()} variant="outline">
            Reset
          </Button>
          <Button onClick={() => setShowControls(!showControls)} variant="secondary">
            {showControls ? 'Hide' : 'Show'} Controls
          </Button>
          <Button onClick={() => setShowEditFaces(!showEditFaces)} variant="secondary">
            Edit Faces
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

      {/* Edit Faces Panel */}
      {showEditFaces && <EditFacesPanel scene={modelScene} />}

      {/* State 1 Text Display */}
      {showState1Text && (
        <div className={`absolute right-8 top-[40%] -translate-y-1/2 z-20 ${isFadingOut ? 'animate-fade-out' : 'animate-fade-in'}`}>
          <div className="p-6 max-w-md">
            <h2 className="text-2xl font-bold mb-3 text-foreground">State 1 Active</h2>
            <p className="text-muted-foreground">
              Sample text content that appears when State 1 animation is nearly complete.
            </p>
          </div>
        </div>
      )}

      {/* State 2 Text Display */}
      {showState2Text && (
        <div className={`absolute left-8 top-[40%] -translate-y-1/2 z-20 ${isFadingOut2 ? 'animate-fade-out' : 'animate-fade-in'}`}>
          <div className="p-6 max-w-md">
            <h2 className="text-2xl font-bold mb-3 text-foreground">State 2 Active</h2>
            <p className="text-muted-foreground">
              Sample text content that appears when State 2 animation is nearly complete.
            </p>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas3D 
        position={position} 
        scale={scale} 
        rotation={rotation} 
        sensitivity={sensitivity} 
        onAnimationProgress={handleAnimationProgress}
        onSceneReady={setModelScene}
      />

      {/* Subtle glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />
      </div>
    </main>
  );
};

export default Index;
