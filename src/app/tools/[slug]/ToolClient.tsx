'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Construction, ArrowLeft } from 'lucide-react';
import type { Tool } from '@/lib/types';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { useToast } from '@/components/ui/Toaster';

import { RotateImage } from './tools/RotateImage';
import { FlipImage } from './tools/FlipImage';
import { SquareCrop } from './tools/SquareCrop';
import { CircleCrop } from './tools/CircleCrop';
import { RoundedCornerCrop } from './tools/RoundedCornerCrop';
import { AspectRatio } from './tools/AspectRatio';
import { Watermark } from './tools/Watermark';
import { MergePhotoSignature } from './tools/MergePhotoSignature';
import { JoinImages } from './tools/JoinImages';
import { ColorPicker } from './tools/ColorPicker';
import { ViewMetadata } from './tools/ViewMetadata';
import { RemoveMetadata } from './tools/RemoveMetadata';

import { BlurImage } from './tools/BlurImage';
import { PixelateImage } from './tools/PixelateImage';
import { Grayscale } from './tools/Grayscale';
import { Invert } from './tools/Invert';
import { AddBorder } from './tools/AddBorder';
import { AddText } from './tools/AddText';
import { AddLogo } from './tools/AddLogo';
import { Vignette } from './tools/Vignette';
import { Mirror } from './tools/Mirror';

import { Enhance } from './tools/Enhance';
import { Sharpen } from './tools/Sharpen';
import { Denoise } from './tools/Denoise';
import { BrightnessContrast } from './tools/BrightnessContrast';
import { Saturation } from './tools/Saturation';

import { ResizeByPixels } from './tools/ResizeByPixels';
import { ResizeByPercentage } from './tools/ResizeByPercentage';
import { ResizeByCm } from './tools/ResizeByCm';
import { ResizeByMm } from './tools/ResizeByMm';
import { ResizeByInches } from './tools/ResizeByInches';

import { PassportPhoto } from './tools/PassportPhoto';
import { Photo35x45 } from './tools/Photo35x45';
import { Photo50x50mm } from './tools/Photo50x50mm';
import { Photo600x600 } from './tools/Photo600x600';
import { PassportRedBg } from './tools/PassportRedBg';
import { PassportWhiteBg } from './tools/PassportWhiteBg';

import { InstagramPost } from './tools/InstagramPost';
import { InstagramStory } from './tools/InstagramStory';
import { YoutubeThumbnail } from './tools/YoutubeThumbnail';
import { WhatsappDp } from './tools/WhatsappDp';
import { FacebookCover } from './tools/FacebookCover';
import { TwitterPost } from './tools/TwitterPost';

import { JpgToPng } from './tools/JpgToPng';
import { PngToJpg } from './tools/PngToJpg';
import { WebpToJpg } from './tools/WebpToJpg';
import { JpgToWebp } from './tools/JpgToWebp';
import { PngToWebp } from './tools/PngToWebp';
import { PngToIco } from './tools/PngToIco';
import { ImageToText } from './tools/ImageToText';

import { ImagesToPdf } from './tools/ImagesToPdf';

import { ImageCompressor } from './tools/ImageCompressor';
import { CompressToTarget } from './tools/CompressToTarget';

import { IncreaseSizeKb } from './tools/IncreaseSizeKb';
import { CheckDpi } from './tools/CheckDpi';
import { SetDpi300 } from './tools/SetDpi300';

import { SignatureResizer } from './tools/SignatureResizer';
import { SignatureToKb } from './tools/SignatureToKb';

import { EditMetadata } from './tools/EditMetadata';
import { PhotoCollage } from './tools/PhotoCollage';

import { ColorPalette } from './tools/ColorPalette';
import { Noise } from './tools/Noise';
import { Temperature } from './tools/Temperature';

const REGISTRY: Record<string, React.ComponentType> = {
  // basic
  'rotate-image': RotateImage,
  'flip-image': FlipImage,
  'square-crop': SquareCrop,
  'circle-crop': CircleCrop,
  'rounded-corner-crop': RoundedCornerCrop,
  'aspect-ratio': AspectRatio,
  'watermark': Watermark,
  'merge-photo-signature': MergePhotoSignature,
  'join-images': JoinImages,
  'image-color-picker': ColorPicker,
  'view-metadata': ViewMetadata,
  'remove-metadata': RemoveMetadata,

  // effects
  'blur-image': BlurImage,
  'pixelate-image': PixelateImage,
  'grayscale': Grayscale,
  'invert-image': Invert,
  'add-border': AddBorder,
  'add-text': AddText,
  'add-logo': AddLogo,
  'vignette': Vignette,
  'mirror': Mirror,

  // ai
  'enhance': Enhance,
  'sharpen': Sharpen,
  'denoise': Denoise,
  'brightness-contrast': BrightnessContrast,
  'saturation': Saturation,

  // resize
  'resize-by-pixels': ResizeByPixels,
  'resize-by-percentage': ResizeByPercentage,
  'resize-by-cm': ResizeByCm,
  'resize-by-mm': ResizeByMm,
  'resize-by-inches': ResizeByInches,

  // gov
  'passport-photo': PassportPhoto,
  'photo-35x45': Photo35x45,
  'photo-50x50mm': Photo50x50mm,
  'photo-600x600': Photo600x600,
  'passport-red-bg': PassportRedBg,
  'passport-white-bg': PassportWhiteBg,

  // social
  'instagram-post': InstagramPost,
  'instagram-story': InstagramStory,
  'youtube-thumbnail': YoutubeThumbnail,
  'whatsapp-dp': WhatsappDp,
  'facebook-cover': FacebookCover,
  'twitter-post': TwitterPost,

  // convert
  'jpg-to-png': JpgToPng,
  'png-to-jpg': PngToJpg,
  'webp-to-jpg': WebpToJpg,
  'jpg-to-webp': JpgToWebp,
  'png-to-webp': PngToWebp,
  'png-to-ico': PngToIco,
  'image-to-text': ImageToText,

  // pdf
  'images-to-pdf': ImagesToPdf,

  // compress
  'image-compressor': ImageCompressor,
  'compress-to-50kb': () => <CompressToTarget target={50 * 1024} />,
  'compress-to-100kb': () => <CompressToTarget target={100 * 1024} />,
  'compress-to-200kb': () => <CompressToTarget target={200 * 1024} />,
  'compress-to-500kb': () => <CompressToTarget target={500 * 1024} />,

  // size
  'increase-size-kb': IncreaseSizeKb,

  // dpi
  'check-dpi': CheckDpi,
  'set-dpi-300': SetDpi300,

  // signature
  'signature-resizer': SignatureResizer,
  'signature-20kb': () => <SignatureToKb target={20 * 1024} suffix="20kb" />,
  'signature-50kb': () => <SignatureToKb target={50 * 1024} suffix="50kb" />,

  // metadata
  'edit-metadata': EditMetadata,

  // collage
  'photo-collage': PhotoCollage,

  // advanced
  'color-palette': ColorPalette,
  'noise': Noise,
  'temperature': Temperature,
};

export function ToolClient({
  tool,
  related,
}: {
  tool: Tool;
  related: { slug: string; title: string }[];
}) {
  const Comp = REGISTRY[tool.slug];
  const { push } = useToast();

  useEffect(() => {
    if (tool.status === 'coming-soon') {
      push('info', 'This tool is listed but not yet built — it will go live soon.');
    }
  }, [tool.slug, tool.status, push]);

  if (!Comp || tool.status === 'coming-soon') {
    return (
      <ToolLayout
        tool={tool}
        privacyNotice="client"
        related={related}
      >
        <div className="card flex flex-col items-center justify-center gap-3 p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600">
            <Construction className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold">Coming Soon</h2>
          <p className="max-w-md text-sm text-[rgb(var(--fg-muted))]">
            We've planned this tool and reserved its page, but the implementation isn't
            live yet. Browse <Link href="/tools" className="text-brand-600 underline">all ready tools</Link> in the meantime.
          </p>
          <Link href="/tools" className="btn-secondary">
            <ArrowLeft className="h-4 w-4" /> Back to tools
          </Link>
        </div>
      </ToolLayout>
    );
  }

  return <Comp />;
}