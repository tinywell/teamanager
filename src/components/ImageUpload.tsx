import React, { useRef, useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { set } from 'idb-keyval';

interface ImageUploadProps {
    onImageSelected: (blobId: string) => void;
    currentImageId?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, currentImageId }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Load initial image if provided
    useEffect(() => {
        if (currentImageId) {
            import('idb-keyval').then(({ get }) => {
                get(currentImageId).then((blob) => {
                    if (blob) {
                        setPreview(URL.createObjectURL(blob));
                    }
                });
            });
        }
    }, [currentImageId]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        // Create preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        try {
            // Compress/Resize image (simple canvas approach)
            const compressedBlob = await compressImage(file);

            // Generate unique ID
            const blobId = `tea-img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // Store in IndexedDB
            await set(blobId, compressedBlob);

            // Notify parent
            onImageSelected(blobId);
        } catch (error) {
            console.error('Image upload failed:', error);
            alert('Failed to save image');
        } finally {
            setIsUploading(false);
        }
    };

    const compressImage = (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 1024;
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;

                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Canvas to Blob failed'));
                }, 'image/jpeg', 0.8);
            };
            img.onerror = reject;
        });
    };

    const clearImage = () => {
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onImageSelected(''); // Notify parent of removal
    };

    return (
        <div className="w-full">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
            />

            {preview ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-stone-200 group">
                    <img src={preview} alt="Tea preview" className="w-full h-full object-cover" />
                    <button
                        onClick={clearImage}
                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                        type="button"
                    >
                        <X size={16} />
                    </button>
                    {isUploading && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>
            ) : (
                <button
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                    className="w-full h-32 border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center text-stone-400 hover:border-tea-400 hover:text-tea-500 transition-colors bg-stone-50"
                >
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mb-2">
                        <Upload size={20} />
                    </div>
                    <span className="text-sm font-medium">Upload Photo</span>
                </button>
            )}
        </div>
    );
};

export default ImageUpload;
