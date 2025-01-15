'use client';

import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useCallback } from 'react';

interface ImageUploadProps {
  onChange: (value: string) => void;
  value?: string;
  label: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value, label }) => {
  const handleUpload = useCallback((result: any) => {
    onChange(result.info.secure_url);
  }, [onChange]);

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col items-center">
        <label className="text-lg font-semibold mb-2">{label}</label>
        <CldUploadWidget
          onUpload={handleUpload}
          uploadPreset="marketz_preset"
          options={{
            maxFiles: 1,
            resourceType: "image",
          }}
        >
          {({ open }) => {
            return (
              <div className="flex flex-col items-center">
                <div
                  onClick={() => open?.()}
                  className="relative flex flex-col items-center justify-center gap-4 p-4 transition border-2 border-dashed cursor-pointer hover:opacity-70 border-neutral-300 text-neutral-600"
                >
                  <div className="text-lg font-semibold">Click to upload</div>
                  {value && (
                    <div className="absolute inset-0 w-full h-full">
                      <Image
                        fill
                        style={{ objectFit: 'cover' }}
                        src={value}
                        alt="Upload"
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          }}
        </CldUploadWidget>
      </div>
    </div>
  );
}

export default ImageUpload; 