"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { Trash2, GripVertical, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PhotoUploader from "./PhotoUploader";

interface Photo {
  storageId: Id<"_storage">;
  url: string | null;
  caption?: string;
  order: number;
}

interface GalleryTabProps {
  photos: Photo[];
  accessCode: string;
  ownerEmail: string;
  onUpdate: () => void;
}

export default function GalleryTab({
  photos,
  accessCode,
  ownerEmail,
  onUpdate,
}: GalleryTabProps) {
  const [deletingId, setDeletingId] = useState<Id<"_storage"> | null>(null);

  const removePhoto = useMutation(api.weddingInvitations.removePhoto);
  const updatePhotosOrder = useMutation(api.weddingInvitations.updatePhotosOrder);

  const sortedPhotos = [...photos].sort((a, b) => a.order - b.order);

  const handleDelete = async (storageId: Id<"_storage">) => {
    if (!confirm("¿Estas seguro de eliminar esta foto?")) return;

    setDeletingId(storageId);
    try {
      await removePhoto({
        accessCode,
        ownerEmail,
        storageId,
      });
      toast.success("Foto eliminada");
      onUpdate();
    } catch (error) {
      toast.error("Error al eliminar la foto");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const movePhoto = async (index: number, direction: "up" | "down") => {
    const newPhotos = [...sortedPhotos];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newPhotos.length) return;

    // Swap
    [newPhotos[index], newPhotos[targetIndex]] = [
      newPhotos[targetIndex],
      newPhotos[index],
    ];

    // Update order values
    const reorderedPhotos = newPhotos.map((photo, i) => ({
      storageId: photo.storageId,
      caption: photo.caption,
      order: i,
    }));

    try {
      await updatePhotosOrder({
        accessCode,
        ownerEmail,
        photos: reorderedPhotos,
      });
      onUpdate();
    } catch (error) {
      toast.error("Error al reordenar fotos");
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Info */}
      <div className="bg-[#4A7C59]/10 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <ImageIcon className="w-5 h-5 text-[#4A7C59] mt-0.5" />
          <div>
            <p className="font-medium text-[#2D5016]">Galeria de Fotos</p>
            <p className="text-sm text-gray-600">
              Sube hasta 6 fotos de ustedes como pareja. Estas fotos se mostraran
              en la seccion &quot;Retratos de Nuestro Amor&quot; de tu invitacion.
            </p>
          </div>
        </div>
      </div>

      {/* Upload */}
      <PhotoUploader
        accessCode={accessCode}
        ownerEmail={ownerEmail}
        currentPhotoCount={photos.length}
        onUploadComplete={onUpdate}
      />

      {/* Photos Grid */}
      {sortedPhotos.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-[#2D5016]">
            Fotos subidas ({sortedPhotos.length}/6)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {sortedPhotos.map((photo, index) => (
              <div
                key={photo.storageId}
                className="relative group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#4A7C59] transition-colors"
              >
                {/* Image */}
                <div className="aspect-square relative">
                  {photo.url ? (
                    <Image
                      src={photo.url}
                      alt={`Foto ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {/* Move buttons */}
                  <div className="flex flex-col gap-1">
                    {index > 0 && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => movePhoto(index, "up")}
                        className="h-8 px-2"
                      >
                        ←
                      </Button>
                    )}
                    {index < sortedPhotos.length - 1 && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => movePhoto(index, "down")}
                        className="h-8 px-2"
                      >
                        →
                      </Button>
                    )}
                  </div>

                  {/* Delete button */}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(photo.storageId)}
                    disabled={deletingId === photo.storageId}
                    className="h-8 w-8 p-0"
                  >
                    {deletingId === photo.storageId ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Order badge */}
                <div className="absolute top-2 left-2 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 text-center">
            Pasa el mouse sobre las fotos para ver las opciones de mover o eliminar
          </p>
        </div>
      )}

      {sortedPhotos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Aun no has subido fotos</p>
          <p className="text-sm">Usa el area de arriba para agregar fotos</p>
        </div>
      )}
    </div>
  );
}
