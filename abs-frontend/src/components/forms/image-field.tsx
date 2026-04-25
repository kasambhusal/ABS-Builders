"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

export interface ImageFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  error?: string;
  existingUrl?: string | null;
  name?: string;
}

export function ImageField({
  label = "Image",
  error,
  existingUrl,
  className,
  name = "image",
  ...props
}: ImageFieldProps) {
  const [preview, setPreview] = useState<string | null>(existingUrl ?? null);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        setPreview(existingUrl ?? null);
        return;
      }
      setBusy(true);
      setProgress(0);
      const url = URL.createObjectURL(file);
      setPreview(url);
      const steps = [20, 45, 70, 100];
      let i = 0;
      const t = window.setInterval(() => {
        setProgress(steps[i] ?? 100);
        i += 1;
        if (i >= steps.length) {
          window.clearInterval(t);
          setBusy(false);
        }
      }, 120);
    },
    [existingUrl],
  );

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label ? (
        <span className="text-sm font-medium text-stone-700">{label}</span>
      ) : null}
      <div
        className={cn(
          "relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 bg-white px-4 py-6 text-center transition-colors hover:border-stone-400",
          error && "border-red-300",
        )}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Upload image"
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept="image/*"
          className="sr-only"
          onChange={onChange}
          {...props}
        />
        {preview ? (
          <div className="relative h-32 w-full max-w-xs overflow-hidden rounded-md">
            <Image
              src={preview}
              alt=""
              fill
              className="object-cover"
              sizes="320px"
              unoptimized={preview.startsWith("blob:")}
            />
          </div>
        ) : (
          <p className="text-sm text-stone-500">
            Click or drop an image (optional)
          </p>
        )}
        {busy ? (
          <div
            className="mt-3 h-1 w-full max-w-xs overflow-hidden rounded-full bg-stone-200"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-stone-600 transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : null}
      </div>
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
