"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Upload, X, Loader2, ImagePlus } from "lucide-react";
import { toast } from "sonner";

interface PhotoUploaderProps {
  accessCode: string;
  ownerEmail: string;
  currentPhotoCount: number;
  onUploadComplete: () => void;
}

export default function PhotoUploader({
  accessCode,
  ownerEmail,
  currentPhotoCount,
  onUploadComplete,
}: PhotoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const generateUploadUrl = useMutation(api.weddingInvitationStorage.generateUploadUrl);
  const addPhoto = useMutation(api.weddingInvitations.addPhoto);

  const maxPhotos = 6;
  const remainingSlots = maxPhotos - currentPhotoCount;

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    if (filesToUpload.length === 0) {
      toast.error(`Ya tienes el maximo de ${maxPhotos} fotos`);
      return;
    }

    if (files.length > remainingSlots) {
      toast.warning(`Solo se subiran ${remainingSlots} foto(s) (maximo ${maxPhotos})`);
    }

    setIsUploading(true);

    try {
      for (const file of filesToUpload) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} no es una imagen valida`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} es muy grande (max 5MB)`);
          continue;
        }

        // Get upload URL
        const uploadUrl = await generateUploadUrl();

        // Upload to Convex storage
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!response.ok) {
          throw new Error("Error al subir imagen");
        }

        const { storageId } = await response.json();

        // Add photo to invitation
        await addPhoto({
          accessCode,
          ownerEmail,
          storageId,
        });
      }

      toast.success(
        filesToUpload.length === 1
          ? "Foto subida correctamente"
          : `${filesToUpload.length} fotos subidas correctamente`
      );
      onUploadComplete();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error al subir las fotos");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleUpload(e.dataTransfer.files);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accessCode, ownerEmail, remainingSlots]
  );

  if (remainingSlots <= 0) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <ImagePlus className="w-10 h-10 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500">
          Has alcanzado el maximo de {maxPhotos} fotos
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Elimina alguna foto para subir mas
        </p>
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
        ${
          dragActive
            ? "border-[#4A7C59] bg-[#4A7C59]/10"
            : "border-gray-300 hover:border-[#4A7C59]/50"
        }
        ${isUploading ? "opacity-50 pointer-events-none" : ""}
      `}
    >
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleUpload(e.target.files)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isUploading}
      />

      {isUploading ? (
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-[#4A7C59] animate-spin mb-3" />
          <p className="text-gray-600">Subiendo fotos...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Upload className="w-10 h-10 text-[#4A7C59] mb-3" />
          <p className="text-gray-700 font-medium">
            Arrastra fotos aqui o haz click para seleccionar
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Puedes subir hasta {remainingSlots} foto(s) mas
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Formatos: JPG, PNG, WEBP (max 5MB)
          </p>
        </div>
      )}
    </div>
  );
}
