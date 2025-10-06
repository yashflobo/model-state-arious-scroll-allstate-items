import { Canvas3D } from "@/components/Canvas3D";

const Index = () => {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-gradient-bg">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />

      {/* Title */}
      <div className="absolute top-8 left-0 right-0 z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
          <span className="bg-gradient-primary bg-clip-text text-transparent">ARious</span>
          {" "}Logo Model
        </h1>
        <p className="mt-2 text-muted-foreground text-sm md:text-base">
          Hover to interact with the model
        </p>
      </div>

      {/* 3D Canvas */}
      <Canvas3D />

      {/* Subtle glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />
      </div>
    </main>
  );
};

export default Index;
