import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as THREE from "three";

interface EditFacesPanelProps {
  scene: THREE.Group | null;
}

interface FaceInfo {
  id: string;
  meshName: string;
  faceIndex: number;
  mesh: THREE.Mesh;
  color: string;
}

export const EditFacesPanel = ({ scene }: EditFacesPanelProps) => {
  const [faces, setFaces] = useState<FaceInfo[]>([]);
  const [selectedFace, setSelectedFace] = useState<string | null>(null);

  useEffect(() => {
    if (!scene) return;

    const facesList: FaceInfo[] = [];
    let faceCounter = 0;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry) {
        const geometry = child.geometry;
        const material = child.material;

        // Get the number of faces
        let faceCount = 0;
        if (geometry.index) {
          faceCount = geometry.index.count / 3;
        } else if (geometry.attributes.position) {
          faceCount = geometry.attributes.position.count / 3;
        }

        // Get current color
        let currentColor = "#ffffff";
        if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshBasicMaterial) {
          currentColor = `#${material.color.getHexString()}`;
        }

        for (let i = 0; i < faceCount; i++) {
          facesList.push({
            id: `face-${faceCounter}`,
            meshName: child.name || `Mesh ${faceCounter}`,
            faceIndex: i,
            mesh: child,
            color: currentColor,
          });
          faceCounter++;
        }
      }
    });

    setFaces(facesList);
  }, [scene]);

  const handleColorChange = (faceId: string, newColor: string) => {
    const face = faces.find((f) => f.id === faceId);
    if (!face) return;

    const material = face.mesh.material;
    if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshBasicMaterial) {
      material.color.set(newColor);
      material.needsUpdate = true;
    }

    setFaces((prev) =>
      prev.map((f) => (f.id === faceId ? { ...f, color: newColor } : f))
    );
  };

  return (
    <Card className="absolute top-24 right-4 w-80 max-h-[70vh] z-30 bg-card/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Edit Faces in Model</CardTitle>
        <CardDescription>
          {faces.length} faces detected in the model
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[50vh]">
          <div className="space-y-2">
            {faces.map((face) => (
              <div
                key={face.id}
                className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                  selectedFace === face.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedFace(face.id)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {face.meshName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Face {face.faceIndex}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border border-border"
                      style={{ backgroundColor: face.color }}
                    />
                    <input
                      type="color"
                      value={face.color}
                      onChange={(e) => handleColorChange(face.id, e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
