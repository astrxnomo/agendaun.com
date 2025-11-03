"use client"

import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { formatBytes, useFileUpload } from "@/hooks/use-file-upload"

interface ScheduleEventImageUploadProps {
  currentImage?: string | null
  onFileChange: (file: File | null) => void
  onRemoveExisting?: () => void
}

export function EventImageUpload({
  currentImage: currentImageId,
  onFileChange,
  onRemoveExisting,
}: ScheduleEventImageUploadProps) {
  const maxSizeMB = 5
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
      clearFiles,
    },
  ] = useFileUpload({
    accept: "image/png,image/jpeg,image/jpg,image/gif,image/webp",
    maxSize: maxSizeBytes,
    maxFiles: 1,
  })

  // Load existing image from database
  useEffect(() => {
    if (currentImageId && files.length === 0) {
      setExistingImageUrl(currentImageId)
    } else {
      setExistingImageUrl(null)
    }
  }, [currentImageId, files.length])

  // Mostrar preview del archivo seleccionado o la imagen existente de la DB
  const previewUrl = files[0]?.preview || existingImageUrl

  const handleRemoveImage = () => {
    clearFiles()
    onFileChange(null)
    if (onRemoveExisting) onRemoveExisting()
  }

  // Notificar al padre cuando se selecciona un archivo
  useEffect(() => {
    if (files.length > 0 && files[0]?.file instanceof File) {
      onFileChange(files[0].file as File)
    }
  }, [files, onFileChange])

  return (
    <div className="mt-1 flex flex-col gap-2">
      <div className="relative">
        {/* Drop area */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="border-input has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-[input:focus]:ring-[3px]"
        >
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Subir imagen"
          />
          {previewUrl ? (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img
                src={previewUrl}
                alt="Imagen del evento"
                className="mx-auto max-h-full rounded object-contain"
              />
              {files[0] && (
                <div className="absolute bottom-4 left-4 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
                  {(() => {
                    const f = files[0].file as File
                    const size =
                      f instanceof File
                        ? f.size
                        : ((files[0].file as any)?.size ?? 0)
                    return `Tamaño: ${formatBytes(size)} / ${maxSizeMB}MB`
                  })()}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <ImageIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 text-sm font-medium">
                Arrastra tu imagen aquí
              </p>
              <p className="text-muted-foreground text-xs">
                PNG, JPG, WebP o GIF (máx. {maxSizeMB}MB)
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={openFileDialog}
              >
                <UploadIcon
                  className="-ms-1 size-4 opacity-60"
                  aria-hidden="true"
                />
                Seleccionar imagen
              </Button>
            </div>
          )}
        </div>

        {previewUrl && (
          <div className="absolute top-4 right-4">
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={handleRemoveImage}
              aria-label="Eliminar imagen"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  )
}
