"use client";

import { useState } from "react";
import { Loader2, Upload, X } from "lucide-react";

const MAX_BYTES = 8 * 1024 * 1024;

async function uploadOne(file: File): Promise<string> {
  const presignRes = await fetch("/api/uploads/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType: file.type, fileSize: file.size }),
  });
  const presignData = await presignRes.json();
  if (!presignRes.ok) throw new Error(presignData.error ?? "Could not start upload");

  const putRes = await fetch(presignData.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!putRes.ok) throw new Error("Upload to storage failed");

  return presignData.publicUrl as string;
}

export function ImageUploader({
  label,
  multiple = false,
  urls,
  onChange,
}: {
  label: string;
  multiple?: boolean;
  urls: string[];
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    for (const file of files) {
      if (file.size > MAX_BYTES) {
        setError(`${file.name} is over 8MB.`);
        return;
      }
    }
    setUploading(true);
    setError("");
    try {
      const uploaded = await Promise.all(files.map(uploadOne));
      onChange(multiple ? [...urls, ...uploaded] : [uploaded[0]]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function removeAt(index: number) {
    onChange(urls.filter((_, i) => i !== index));
  }

  return (
    <div className="grid gap-2">
      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:border-accent hover:text-accent">
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {label}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple={multiple}
          className="hidden"
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
      {error && <p className="text-xs text-rose-600">{error}</p>}
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {urls.map((url, index) => (
            <div key={url} className="group relative h-20 w-20 overflow-hidden rounded-md border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
