/**
 * Tool & category registry.
 *
 * This is the single source of truth for what tools exist on the site.
 * Tools marked `status: 'ready'` have a real page; `coming-soon` are listed
 * for SEO & navigation but the page explicitly says so and links elsewhere.
 */

import type { Category, Tool } from './types';

export const CATEGORIES: Category[] = [
  {
    slug: 'basic',
    title: 'Basic Editing',
    description: 'Crop, rotate, watermark, merge and edit images.',
    icon: 'Crop',
    accent: 'from-brand-500 to-brand-700',
  },
  {
    slug: 'effects',
    title: 'Blur, Pixelate & Effects',
    description: 'Blur faces, censor, pixel art, borders, filters.',
    icon: 'Sparkles',
    accent: 'from-fuchsia-500 to-purple-600',
  },
  {
    slug: 'ai',
    title: 'Image Quality & AI',
    description: 'Enhance, upscale, denoise and restore photos.',
    icon: 'Wand2',
    accent: 'from-cyan-500 to-sky-600',
  },
  {
    slug: 'resize',
    title: 'Resize',
    description: 'Resize by pixels, cm, mm, inches, percent or DPI.',
    icon: 'Maximize2',
    accent: 'from-emerald-500 to-teal-600',
  },
  {
    slug: 'gov',
    title: 'Government / Document',
    description: 'Passport, SSC, PAN, UPSC, PSC document photo presets.',
    icon: 'IdCard',
    accent: 'from-amber-500 to-orange-600',
  },
  {
    slug: 'social',
    title: 'Social Media',
    description: 'Instagram, WhatsApp, YouTube, X, LinkedIn presets.',
    icon: 'Share2',
    accent: 'from-pink-500 to-rose-600',
  },
  {
    slug: 'convert',
    title: 'Format Converters',
    description: 'JPG, PNG, WEBP, HEIC, ICO, OCR.',
    icon: 'Repeat',
    accent: 'from-indigo-500 to-violet-600',
  },
  {
    slug: 'pdf',
    title: 'Image to PDF',
    description: 'Combine images into print-ready PDFs.',
    icon: 'FileText',
    accent: 'from-red-500 to-rose-600',
  },
  {
    slug: 'compress',
    title: 'Image Compression',
    description: 'Hit exact KB targets — 5KB to 2MB.',
    icon: 'Minimize2',
    accent: 'from-lime-500 to-green-600',
  },
  {
    slug: 'size',
    title: 'Image Size (KB / MB)',
    description: 'Increase or convert KB / MB file sizes.',
    icon: 'Scaling',
    accent: 'from-sky-500 to-blue-600',
  },
  {
    slug: 'dpi',
    title: 'DPI Tools',
    description: 'Convert and check DPI for print photos.',
    icon: 'Printer',
    accent: 'from-orange-500 to-red-600',
  },
  {
    slug: 'signature',
    title: 'Signature Tools',
    description: 'Make, resize, compress and merge signatures.',
    icon: 'PenLine',
    accent: 'from-yellow-500 to-amber-600',
  },
  {
    slug: 'gif',
    title: 'GIF Tools',
    description: 'Make, compress, resize and edit GIFs.',
    icon: 'Film',
    accent: 'from-fuchsia-600 to-pink-600',
  },
  {
    slug: 'metadata',
    title: 'Metadata Tools',
    description: 'View, edit and remove EXIF / GPS data.',
    icon: 'Info',
    accent: 'from-slate-500 to-slate-700',
  },
  {
    slug: 'collage',
    title: 'Collage',
    description: 'Photo grid and freeform collages.',
    icon: 'LayoutGrid',
    accent: 'from-violet-500 to-purple-600',
  },
  {
    slug: 'advanced',
    title: 'Advanced Color & Light',
    description: 'Brightness, contrast, hue, vignette, noise.',
    icon: 'Sliders',
    accent: 'from-teal-500 to-cyan-600',
  },
];

/** Helpers used in `tips` arrays below. */
const TIPS = {
  privacy:
    'Your images are processed locally whenever possible. Tools that need a server make this clear on the page.',
  safeUpload:
    'Only image MIME types (image/png, image/jpeg, image/webp, image/gif) are accepted.',
  jpgKb:
    'For an exact KB target the optimizer tries JPEG/WebP quality first, then resizes dimensions as a last step.',
};

const FAQ_GENERAL = (toolName: string, what: string) => [
  {
    q: `Is ${toolName} free?`,
    a: 'Yes — every PixelForge tool is free to use and runs without an account.',
  },
  {
    q: `Are my images uploaded to a server?`,
    a: 'No. This tool runs entirely in your browser. Your image never leaves your device.',
  },
  {
    q: `Which formats are supported?`,
    a: 'You can upload JPG, PNG, WEBP and (where applicable) GIF. The output format is selectable below the preview.',
  },
  {
    q: 'What happens if I refresh the page?',
    a: 'The image is held only in your browser tab. Refreshing clears it.',
  },
];

const BASE_TOOL = (
  slug: string,
  title: string,
  category: Tool['category'],
  description: string,
  short: string = description,
  options: Partial<Tool> = {}
): Tool => ({
  slug,
  title,
  shortDescription: short,
  longDescription: description,
  category,
  icon: 'Wand2',
  keywords: [],
  status: 'ready',
  acceptsBatch: false,
  tips: [TIPS.privacy, TIPS.safeUpload],
  faq: FAQ_GENERAL(title, 'process'),
  ...options,
});

export const TOOLS: Tool[] = [
  // ------------------------ BASIC ------------------------
  BASE_TOOL('rotate-image', 'Rotate Image', 'basic',
    'Rotate an image by any angle using a precision slider.',
    'Rotate images by 90° / 180° / custom angle.', {
    icon: 'RotateCw',
    keywords: ['rotate', 'flip', 'angle'],
  }),
  BASE_TOOL('flip-image', 'Flip Image', 'basic',
    'Mirror an image vertically or horizontally.',
    'Mirror an image.', { icon: 'FlipHorizontal2', keywords: ['mirror', 'reflect'] }),
  BASE_TOOL('square-crop', 'Square Crop', 'basic',
    'Crop an image to a square (1:1) with adjustable position.',
    '1:1 crop.', { icon: 'Square', keywords: ['square', 'crop', '1:1'] }),
  BASE_TOOL('circle-crop', 'Circle Crop', 'basic',
    'Crop an image into a perfect circle with optional outline.',
    'Circular avatar.', { icon: 'Circle', keywords: ['circle', 'crop', 'avatar', 'dp'] }),
  BASE_TOOL('rounded-corner-crop', 'Rounded Corner Crop', 'basic',
    'Crop an image with rounded corners.',
    'Rounded corners.', {
    icon: 'SquareDashedBottom',
    keywords: ['round', 'corner', 'radius'],
  }),
  BASE_TOOL('aspect-ratio', 'Change Aspect Ratio', 'basic',
    'Resize an image to a target aspect ratio (4:3, 16:9, etc.).',
    'Change aspect ratio.', {
    icon: 'Ratio',
    keywords: ['aspect', 'ratio', '16:9', '4:3'],
  }),
  BASE_TOOL('watermark', 'Watermark Image', 'basic',
    'Add a text watermark to one or many images.',
    'Text watermark.', {
    icon: 'Type',
    keywords: ['watermark', 'text', 'overlay'],
    acceptsBatch: true,
  }),
  BASE_TOOL('merge-photo-signature', 'Merge Photo + Signature', 'basic',
    'Place a signature on a passport-style photo.',
    'Photo + signature.', {
    icon: 'Combine',
    keywords: ['signature', 'merge', 'photo'],
  }),
  BASE_TOOL('join-images', 'Join Multiple Images', 'basic',
    'Combine images side-by-side or stacked into one picture.',
    'Join images.', {
    icon: 'PlusSquare',
    keywords: ['join', 'combine', 'side by side'],
    acceptsBatch: true,
  }),
  BASE_TOOL('image-color-picker', 'Image Color Picker', 'basic',
    'Pick any pixel color from an image and copy HEX / RGB.',
    'Color picker.', {
    icon: 'Pipette',
    keywords: ['color picker', 'hex', 'rgb'],
  }),
  BASE_TOOL('view-metadata', 'View Metadata', 'basic',
    'Inspect EXIF, GPS and other embedded metadata.',
    'EXIF viewer.', {
    icon: 'Info',
    keywords: ['exif', 'metadata', 'gps', 'camera'],
    serverSide: true,
  }),
  BASE_TOOL('remove-metadata', 'Remove Metadata', 'basic',
    'Strip EXIF, GPS and software metadata from images.',
    'Strip EXIF.', {
    icon: 'Eraser',
    keywords: ['exif', 'strip', 'gps', 'remove'],
  }),

  // ------------------------ EFFECTS ------------------------
  BASE_TOOL('blur-image', 'Blur Image', 'effects',
    'Gaussian blur with adjustable intensity.',
    'Gaussian blur.', {
    icon: 'EyeOff',
    keywords: ['blur', 'gaussian', 'soft', 'background'],
  }),
  BASE_TOOL('pixelate-image', 'Pixelate Image', 'effects',
    'Pixelate the whole image by block size.',
    'Mosaic effect.', {
    icon: 'Grid3x3',
    keywords: ['pixelate', 'mosaic', 'censor'],
  }),
  BASE_TOOL('grayscale', 'Grayscale Image', 'effects',
    'Convert an image to grayscale.',
    'Black & white.', { icon: 'Contrast', keywords: ['grayscale', 'bw', 'mono'] }),
  BASE_TOOL('invert-image', 'Invert Image', 'effects',
    'Invert image colors into a photographic negative.',
    'Negative photo.', { icon: 'Repeat', keywords: ['invert', 'negative'] }),
  BASE_TOOL('add-border', 'Add Border', 'effects',
    'Add a solid color border with adjustable width.',
    'Add a border.', {
    icon: 'Square',
    keywords: ['border', 'frame', 'padding'],
  }),
  BASE_TOOL('add-text', 'Add Text to Image', 'effects',
    'Add custom text with font / color / rotation / position.',
    'Text overlay.', {
    icon: 'Type',
    keywords: ['text', 'caption', 'overlay', 'font'],
    acceptsBatch: true,
  }),
  BASE_TOOL('add-logo', 'Add Logo to Image', 'effects',
    'Overlay a logo PNG onto one or many images.',
    'Watermark with logo.', {
    icon: 'Stamp',
    keywords: ['logo', 'watermark', 'brand'],
    acceptsBatch: true,
  }),
  BASE_TOOL('vignette', 'Vignette Effect', 'effects',
    'Apply a soft vignette (corner darkening).',
    'Vignette.', { icon: 'CircleOff', keywords: ['vignette', 'dark corner'] }),
  BASE_TOOL('mirror', 'Mirror Image', 'effects',
    'Mirror left / right or top / bottom.',
    'Mirror.', {
    icon: 'FlipHorizontal',
    keywords: ['mirror', 'flip', 'reflect'],
  }),

  // ------------------------ AI ------------------------
  BASE_TOOL('enhance', 'AI Image Enhancer', 'ai',
    'Improve contrast and clarity with an algorithm-based enhancer. Connect a real model any time via env var.',
    'Enhance image.', {
    icon: 'Wand2',
    keywords: ['enhance', 'ai', 'upscale', 'clarity'],
    popular: true,
  }),
  BASE_TOOL('sharpen', 'Sharpen Image', 'ai',
    'Apply an unsharp-mask sharpen filter.',
    'Sharpen.', { icon: 'Aperture', keywords: ['sharpen', 'detail'] }),
  BASE_TOOL('denoise', 'Noise Reduction', 'ai',
    'Reduce image noise via bilateral-style smoothing.',
    'Denoise.', {
    icon: 'Sparkles',
    keywords: ['denoise', 'noise reduction', 'grain'],
  }),
  BASE_TOOL('brightness-contrast', 'Brightness & Contrast', 'advanced',
    'Adjust brightness and contrast with live preview.',
    'Brightness / contrast.', {
    icon: 'Sun',
    keywords: ['brightness', 'contrast', 'exposure'],
  }),
  BASE_TOOL('saturation', 'Saturation & Hue', 'advanced',
    'Adjust saturation, hue and vibrance.',
    'Saturation / hue.', {
    icon: 'Palette',
    keywords: ['saturation', 'hue', 'vibrance'],
  }),

  // ------------------------ RESIZE ------------------------
  BASE_TOOL('resize-by-pixels', 'Resize by Pixels', 'resize',
    'Resize an image to exact pixel width / height.',
    'Resize to pixels.', {
    icon: 'Maximize2',
    keywords: ['resize', 'pixels', 'width', 'height'],
    popular: true,
    acceptsBatch: true,
  }),
  BASE_TOOL('resize-by-percentage', 'Resize by Percentage', 'resize',
    'Scale an image by % (e.g. 50% smaller).',
    'Resize by %.', {
    icon: 'Percent',
    keywords: ['percent', 'scale'],
  }),
  BASE_TOOL('resize-by-cm', 'Resize by Centimeters', 'resize',
    'Convert cm dimensions to pixels at a chosen DPI.',
    'Resize to cm.', {
    icon: 'Ruler',
    keywords: ['cm', 'centimeter', 'print'],
  }),
  BASE_TOOL('resize-by-mm', 'Resize by Millimeters', 'resize',
    'Convert mm dimensions to pixels at a chosen DPI.',
    'Resize to mm.', {
    icon: 'Ruler',
    keywords: ['mm', 'millimeter', 'print'],
  }),
  BASE_TOOL('resize-by-inches', 'Resize by Inches', 'resize',
    'Resize images by physical inches at a chosen DPI.',
    'Resize to inches.', {
    icon: 'Ruler',
    keywords: ['inches', 'inch', 'print', 'dpi'],
  }),

  // ------------------------ GOV / DOCUMENT ------------------------
  BASE_TOOL('passport-photo', 'Passport Photo Maker', 'gov',
    'Crop a photo to a common passport size and pick a background color.',
    'Passport size.', {
    icon: 'IdCard',
    keywords: ['passport', 'photo', 'id', 'document'],
    popular: true,
  }),
  BASE_TOOL('photo-35x45', '35 × 45 mm Photo', 'gov',
    'Crop photo to 35×45 mm at 300 DPI.',
    '35×45 mm.', {
    icon: 'IdCard',
    keywords: ['35x45', 'passport', 'mm'],
  }),
  BASE_TOOL('photo-50x50mm', '50 × 50 mm Photo', 'gov',
    'Crop photo to 50×50 mm at 300 DPI.',
    '50×50 mm.', {
    icon: 'IdCard',
    keywords: ['50x50', 'passport'],
  }),
  BASE_TOOL('photo-600x600', '600 × 600 Photo', 'gov',
    'Crop photo to 600×600 px (US visa style).',
    '600×600 px.', {
    icon: 'IdCard',
    keywords: ['600x600', 'px', 'visa'],
  }),
  BASE_TOOL('passport-red-bg', 'Red Background Passport Photo', 'gov',
    'Passport-style photo with a red background.',
    'Red background.', {
    icon: 'IdCard',
    keywords: ['red', 'background', 'passport'],
  }),
  BASE_TOOL('passport-white-bg', 'White Background Passport Photo', 'gov',
    'Passport-style photo with a clean white background.',
    'White background.', {
    icon: 'IdCard',
    keywords: ['white', 'background', 'passport'],
  }),

  // ------------------------ SOCIAL ------------------------
  BASE_TOOL('instagram-post', 'Instagram Post (1080×1080)', 'social',
    'Resize to the square Instagram format.',
    'IG post.', {
    icon: 'Instagram',
    keywords: ['instagram', 'post', 'social'],
  }),
  BASE_TOOL('instagram-story', 'Instagram Story (1080×1920)', 'social',
    'Vertical 9:16 story size.',
    'IG story.', {
    icon: 'Instagram',
    keywords: ['instagram', 'story', 'reels'],
  }),
  BASE_TOOL('youtube-thumbnail', 'YouTube Thumbnail (1280×720)', 'social',
    'Resize to the YouTube thumbnail ratio.',
    'YT thumbnail.', {
    icon: 'Youtube',
    keywords: ['youtube', 'thumbnail', 'video'],
  }),
  BASE_TOOL('whatsapp-dp', 'WhatsApp DP', 'social',
    'Crop a profile picture with optional circle mask.',
    'WhatsApp DP.', {
    icon: 'MessageCircle',
    keywords: ['whatsapp', 'dp', 'profile'],
  }),
  BASE_TOOL('facebook-cover', 'Facebook Cover', 'social',
    'Resize to a Facebook cover image ratio.',
    'FB cover.', {
    icon: 'Facebook',
    keywords: ['facebook', 'cover'],
  }),
  BASE_TOOL('twitter-post', 'X / Twitter Post (1600×900)', 'social',
    'Resize for X / Twitter posts.',
    'X post.', {
    icon: 'Twitter',
    keywords: ['twitter', 'x', 'post'],
  }),

  // ------------------------ CONVERT ------------------------
  BASE_TOOL('jpg-to-png', 'JPG to PNG', 'convert',
    'Convert JPG images to PNG (with transparency support).',
    'JPG → PNG.', {
    icon: 'ArrowRightLeft',
    keywords: ['jpg', 'png', 'convert'],
    popular: true,
    acceptsBatch: true,
  }),
  BASE_TOOL('png-to-jpg', 'PNG to JPG', 'convert',
    'Convert PNG images to JPG.',
    'PNG → JPG.', {
    icon: 'ArrowRightLeft',
    keywords: ['png', 'jpg', 'convert'],
    acceptsBatch: true,
  }),
  BASE_TOOL('webp-to-jpg', 'WEBP to JPG', 'convert',
    'Convert WEBP images to JPG.',
    'WEBP → JPG.', {
    icon: 'ArrowRightLeft',
    keywords: ['webp', 'jpg', 'convert'],
    acceptsBatch: true,
  }),
  BASE_TOOL('jpg-to-webp', 'JPG to WEBP', 'convert',
    'Convert JPG images to WEBP for smaller file sizes.',
    'JPG → WEBP.', {
    icon: 'ArrowRightLeft',
    keywords: ['webp', 'jpg', 'convert'],
    acceptsBatch: true,
  }),
  BASE_TOOL('png-to-webp', 'PNG to WEBP', 'convert',
    'Convert PNG images to WEBP.',
    'PNG → WEBP.', {
    icon: 'ArrowRightLeft',
    keywords: ['webp', 'png', 'convert'],
    acceptsBatch: true,
  }),
  BASE_TOOL('png-to-ico', 'PNG to ICO', 'convert',
    'Generate a multi-size favicon ICO.',
    'PNG → ICO.', {
    icon: 'AppWindow',
    keywords: ['ico', 'favicon'],
  }),
  BASE_TOOL('image-to-text', 'Image to Text (OCR)', 'convert',
    'Runs OCR client-side with a small built-in model. Connect a stronger provider via env var to use a heavier engine.',
    'OCR.', {
    icon: 'FileScan',
    keywords: ['ocr', 'text', 'extract'],
    popular: true,
    serverSide: true,
    tips: [
      TIPS.privacy,
      'OCR runs locally in your browser. For best results use a high-contrast, well-lit scan.',
    ],
  }),

  // ------------------------ PDF ------------------------
  BASE_TOOL('images-to-pdf', 'Images to PDF', 'pdf',
    'Combine images into a single PDF document.',
    'Combine into PDF.', {
    icon: 'FileText',
    keywords: ['pdf', 'images', 'combine'],
    popular: true,
    acceptsBatch: true,
  }),

  // ------------------------ COMPRESS ------------------------
  BASE_TOOL('image-compressor', 'Image Compressor', 'compress',
    'Reduce image file size with adjustable quality.',
    'Compress image.', {
    icon: 'Minimize2',
    keywords: ['compress', 'optimize', 'reduce'],
    popular: true,
    acceptsBatch: true,
    tips: [TIPS.privacy, TIPS.safeUpload, TIPS.jpgKb],
  }),
  BASE_TOOL('compress-to-50kb', 'Compress to 50 KB', 'compress',
    'Iterative compressor targeting exactly 50 KB.',
    '≤ 50 KB.', {
    icon: 'Target',
    keywords: ['50', 'kb', 'exact', 'target'],
    acceptsBatch: true,
  }),
  BASE_TOOL('compress-to-100kb', 'Compress to 100 KB', 'compress',
    'Iterative compressor targeting exactly 100 KB.',
    '≤ 100 KB.', {
    icon: 'Target',
    keywords: ['100', 'kb'],
    acceptsBatch: true,
  }),
  BASE_TOOL('compress-to-200kb', 'Compress to 200 KB', 'compress',
    'Iterative compressor targeting exactly 200 KB.',
    '≤ 200 KB.', {
    icon: 'Target',
    keywords: ['200', 'kb'],
    acceptsBatch: true,
  }),
  BASE_TOOL('compress-to-500kb', 'Compress to 500 KB', 'compress',
    'Iterative compressor targeting exactly 500 KB.',
    '≤ 500 KB.', {
    icon: 'Target',
    keywords: ['500', 'kb'],
    acceptsBatch: true,
  }),

  // ------------------------ SIZE / KB-MB ------------------------
  BASE_TOOL('increase-size-kb', 'Increase Image Size (KB)', 'size',
    'Add a controlled amount of bytes (metadata + tiny upsize) to nudge a file above a target.',
    'Increase size.', {
    icon: 'PlusCircle',
    keywords: ['increase', 'kb', 'upscale size'],
  }),

  // ------------------------ DPI ------------------------
  BASE_TOOL('check-dpi', 'Check Image DPI', 'dpi',
    'Inspect image dimensions and any embedded DPI metadata.',
    'Check DPI.', {
    icon: 'Printer',
    keywords: ['dpi', 'print', 'resolution'],
    serverSide: true,
  }),
  BASE_TOOL('set-dpi-300', 'Set Image DPI to 300', 'dpi',
    'Tag an image with a 300 DPI header (no resampling of pixels).',
    'Set DPI = 300.', {
    icon: 'Printer',
    keywords: ['dpi', '300', 'print'],
  }),

  // ------------------------ SIGNATURE ------------------------
  BASE_TOOL('signature-resizer', 'Signature Resizer', 'signature',
    'Resize a signature to common form dimensions with optional white background.',
    'Resize signature.', {
    icon: 'PenLine',
    keywords: ['signature', 'resize', 'form'],
    popular: true,
  }),
  BASE_TOOL('signature-20kb', 'Signature to 20KB', 'signature',
    'Compress a signature scan to ≤ 20 KB for form upload.',
    '≤ 20 KB signature.', {
    icon: 'Target',
    keywords: ['signature', '20kb', 'form'],
  }),
  BASE_TOOL('signature-50kb', 'Signature to 50KB', 'signature',
    'Compress a signature scan to ≤ 50 KB.',
    '≤ 50 KB signature.', {
    icon: 'Target',
    keywords: ['signature', '50kb', 'form'],
  }),

  // ------------------------ METADATA ------------------------
  BASE_TOOL('edit-metadata', 'Edit Metadata', 'metadata',
    'Edit EXIF tags exposed by your image.',
    'Edit EXIF.', {
    icon: 'FileEdit',
    keywords: ['metadata', 'exif', 'edit'],
  }),

  // ------------------------ COLLAGE ------------------------
  BASE_TOOL('photo-collage', 'Photo Collage Maker', 'collage',
    'Combine up to 6 images into a clean grid collage.',
    'Photo collage.', {
    icon: 'LayoutGrid',
    keywords: ['collage', 'grid', 'layout'],
    popular: true,
    acceptsBatch: true,
  }),

  // ------------------------ ADVANCED / COLOR ------------------------
  BASE_TOOL('color-palette', 'Color Palette Generator', 'advanced',
    'Generate a color palette from the dominant colors in an image.',
    'Color palette.', {
    icon: 'Palette',
    keywords: ['palette', 'colors', 'extract'],
  }),
  BASE_TOOL('noise', 'Add Film Grain', 'advanced',
    'Apply a controlled noise / film grain effect.',
    'Film grain.', { icon: 'Sparkles', keywords: ['noise', 'grain', 'film'] }),
  BASE_TOOL('temperature', 'Adjust Temperature', 'advanced',
    'Warm / cool an image with a temperature slider.',
    'Temperature.', { icon: 'Thermometer', keywords: ['temperature', 'warm', 'cool'] }),
];

/**
 * Tools listed in the UI / sitemap / search but not yet built.
 * Each links to a "coming soon" page so no dead buttons exist.
 */
export const COMING_SOON: Tool[] = [
  { ...BASE_TOOL('remove-background', 'Remove Background', 'effects', '', 'AI background removal.', {
    icon: 'Eraser', keywords: ['remove', 'background'], popular: true }),
    status: 'coming-soon' },
  { ...BASE_TOOL('remove-object', 'Remove Object', 'effects', '', 'Object removal.', {
    icon: 'Eraser', keywords: ['object', 'remove'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('beautify', 'Beautify Image', 'effects', '', 'One-tap beautify.', {
    icon: 'Sparkles', keywords: ['beautify', 'glow'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('pixelate-face', 'Pixelate Face', 'effects', '', 'Auto pixelate faces.', {
    icon: 'UserX', keywords: ['face', 'pixelate'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('motion-blur', 'Motion Blur', 'effects', '', 'Directional motion blur.', {
    icon: 'Wind', keywords: ['motion', 'blur'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('pixel-art', 'Picture to Pixel Art', 'effects', '', 'Convert image to pixel art.', {
    icon: 'Grid3x3', keywords: ['pixel art', 'retro'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('super-res', 'AI Upscaler', 'ai', '', 'Upscale via AI.', {
    icon: 'Wand2', keywords: ['upscale', 'super', 'resolution'], popular: true }),
    status: 'coming-soon' },
  { ...BASE_TOOL('old-restore', 'Old Photo Restoration', 'ai', '', 'Restore old photos.', {
    icon: 'Sparkles', keywords: ['restore', 'old'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('deblur', 'Deblur Image', 'ai', '', 'Deblur via AI.', {
    icon: 'Focus', keywords: ['deblur'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('heic-to-jpg', 'HEIC to JPG', 'convert', '', 'HEIC → JPG.', {
    icon: 'ArrowRightLeft', keywords: ['heic', 'jpg'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('favicon-generator', 'Favicon Generator', 'convert', '', 'Make a favicon set.', {
    icon: 'AppWindow', keywords: ['favicon', 'ico'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('gif-maker', 'GIF Maker', 'gif', '', 'Build GIF from images.', {
    icon: 'Film', keywords: ['gif', 'make'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('gif-compressor', 'GIF Compressor', 'gif', '', 'Shrink GIFs.', {
    icon: 'Minimize2', keywords: ['gif', 'compress'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('video-to-gif', 'Video to GIF', 'gif', '', 'MP4 → GIF.', {
    icon: 'Film', keywords: ['video', 'gif'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('gif-speed', 'GIF Speed Controller', 'gif', '', 'Speed up / down.', {
    icon: 'Gauge', keywords: ['gif', 'speed'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('bulk-resize', 'Bulk Image Resizer', 'resize', '', 'Resize many images.', {
    icon: 'Maximize2', keywords: ['bulk', 'batch', 'resize'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('instagram-grid', 'Instagram Grid Maker', 'social', '', 'Split image into IG grid.', {
    icon: 'Instagram', keywords: ['instagram', 'grid'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('linkedin-banner', 'LinkedIn Banner', 'social', '', 'LinkedIn cover.', {
    icon: 'Linkedin', keywords: ['linkedin'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('youtube-banner', 'YouTube Banner', 'social', '', 'YouTube cover.', {
    icon: 'Youtube', keywords: ['youtube', 'banner'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('ssc', 'SSC Photo Resize', 'gov', '', 'SSC size.', {
    icon: 'IdCard', keywords: ['ssc'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('pan', 'PAN Card Photo', 'gov', '', 'PAN size.', {
    icon: 'IdCard', keywords: ['pan'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('upsc', 'UPSC Photo', 'gov', '', 'UPSC size.', {
    icon: 'IdCard', keywords: ['upsc'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('psc', 'PSC Photo', 'gov', '', 'PSC size.', {
    icon: 'IdCard', keywords: ['psc'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('a4-photo', 'A4 Image', 'gov', '', 'A4 size image.', {
    icon: 'FileText', keywords: ['a4'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('kb-mb-convert', 'KB to MB / MB to KB', 'size', '', 'KB ↔ MB convert.', {
    icon: 'Repeat', keywords: ['kb', 'mb'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('dpi-200', 'Convert DPI to 200', 'dpi', '', 'DPI 200.', {
    icon: 'Printer', keywords: ['dpi', '200'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('dpi-600', 'Convert DPI to 600', 'dpi', '', 'DPI 600.', {
    icon: 'Printer', keywords: ['dpi', '600'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('increase-dpi', 'Increase DPI', 'dpi', '', 'Bump DPI.', {
    icon: 'Printer', keywords: ['dpi', 'increase'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('signature-maker', 'Signature Maker', 'signature', '', 'Draw a signature.', {
    icon: 'PenLine', keywords: ['signature', 'make'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('signature-merge', 'Signature Merge Tool', 'signature', '', 'Merge signature into form.', {
    icon: 'Combine', keywords: ['signature', 'merge'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('signature-bg-remove', 'Signature Background Remover', 'signature', '', 'White sign bg.', {
    icon: 'Eraser', keywords: ['signature', 'background'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('add-name-dob', 'Add Name & DOB', 'basic', '', 'Stamp a name.', {
    icon: 'Type', keywords: ['name', 'dob'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('freehand-crop', 'Freehand Crop', 'basic', '', 'Custom crop.', {
    icon: 'Crop', keywords: ['freehand', 'crop'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('split-image', 'Split Image', 'basic', '', 'Slice image.', {
    icon: 'SplitSquareHorizontal', keywords: ['split'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('png-cropper', 'PNG Cropper', 'basic', '', 'Crop PNG with alpha.', {
    icon: 'Crop', keywords: ['png', 'crop'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('edit-metadata-basic', 'Edit Metadata (Basic)', 'metadata', '', 'Edit EXIF.', {
    icon: 'FileEdit', keywords: ['metadata'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('blur-face', 'Blur Face', 'effects', '', 'Auto blur faces.', {
    icon: 'UserX', keywords: ['face', 'blur'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('unblur-face', 'Unblur Face', 'effects', '', 'AI face deblur.', {
    icon: 'UserCheck', keywords: ['face', 'unblur'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('censor', 'Censor Photo', 'effects', '', 'Censor region.', {
    icon: 'EyeOff', keywords: ['censor'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('black-white', 'Black & White', 'effects', '', 'Pure B&W.', {
    icon: 'Contrast', keywords: ['bw', 'black white'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('blemish', 'Blemish Remover', 'effects', '', 'Remove blemishes.', {
    icon: 'Sparkles', keywords: ['blemish', 'skin'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('retouch', 'Photo Retouch', 'effects', '', 'Retouch photo.', {
    icon: 'Wand2', keywords: ['retouch'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('white-border', 'White Border Generator', 'effects', '', 'Add white border.', {
    icon: 'Square', keywords: ['border', 'white'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('deep-fry', 'Deep Fry Photo', 'effects', '', 'Overcooked effect.', {
    icon: 'Flame', keywords: ['deep fry', 'meme'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('unblur-image', 'Unblur Image', 'ai', '', 'Deblur via AI.', {
    icon: 'Focus', keywords: ['unblur'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('low-light', 'Low-Light Enhancement', 'ai', '', 'Brighten dark photos.', {
    icon: 'Sun', keywords: ['low light', 'bright'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('face-enhance', 'Face Enhancement', 'ai', '', 'AI face enhance.', {
    icon: 'UserCheck', keywords: ['face', 'enhance'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('ai-beautify', 'AI Beautify', 'ai', '', 'AI beautify.', {
    icon: 'Sparkles', keywords: ['beautify', 'ai'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('blur-background', 'Blur Background', 'effects', '', 'Portrait mode.', {
    icon: 'Aperture', keywords: ['background', 'blur'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('image-to-jpg', 'Image to JPG', 'convert', '', 'Image → JPG.', {
    icon: 'ArrowRightLeft', keywords: ['jpg'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('image-to-jpeg', 'Image to JPEG', 'convert', '', 'Image → JPEG.', {
    icon: 'ArrowRightLeft', keywords: ['jpeg'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('jpg-to-jpeg', 'JPG to JPEG', 'convert', '', 'JPG → JPEG.', {
    icon: 'ArrowRightLeft', keywords: ['jpeg'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('png-to-jpeg', 'PNG to JPEG', 'convert', '', 'PNG → JPEG.', {
    icon: 'ArrowRightLeft', keywords: ['jpeg', 'png'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('jpeg-to-png', 'JPEG to PNG', 'convert', '', 'JPEG → PNG.', {
    icon: 'ArrowRightLeft', keywords: ['png', 'jpeg'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('jpg-to-text', 'JPG to Text', 'convert', '', 'JPG OCR.', {
    icon: 'FileScan', keywords: ['jpg', 'ocr'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('png-to-text', 'PNG to Text', 'convert', '', 'PNG OCR.', {
    icon: 'FileScan', keywords: ['png', 'ocr'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('jpg-to-pdf', 'JPG to PDF', 'pdf', '', 'JPG → PDF.', {
    icon: 'FileText', keywords: ['pdf', 'jpg'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('jpg-to-pdf-50kb', 'JPG to PDF (≤ 50 KB)', 'pdf', '', '≤ 50 KB PDF.', {
    icon: 'FileText', keywords: ['pdf', '50kb'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('jpg-to-pdf-100kb', 'JPG to PDF (≤ 100 KB)', 'pdf', '', '≤ 100 KB PDF.', {
    icon: 'FileText', keywords: ['pdf', '100kb'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('jpg-to-pdf-200kb', 'JPG to PDF (≤ 200 KB)', 'pdf', '', '≤ 200 KB PDF.', {
    icon: 'FileText', keywords: ['pdf', '200kb'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('jpg-to-pdf-300kb', 'JPG to PDF (≤ 300 KB)', 'pdf', '', '≤ 300 KB PDF.', {
    icon: 'FileText', keywords: ['pdf', '300kb'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('jpg-to-pdf-500kb', 'JPG to PDF (≤ 500 KB)', 'pdf', '', '≤ 500 KB PDF.', {
    icon: 'FileText', keywords: ['pdf', '500kb'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('compress-to-5kb', 'Compress to 5 KB', 'compress', '', '≤ 5 KB.', {
    icon: 'Target', keywords: ['5kb'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('compress-to-10kb', 'Compress to 10 KB', 'compress', '', '≤ 10 KB.', {
    icon: 'Target', keywords: ['10kb'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('compress-to-15kb', 'Compress to 15 KB', 'compress', '', '≤ 15 KB.', {
    icon: 'Target', keywords: ['15kb'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('compress-to-20kb', 'Compress to 20 KB', 'compress', '', '≤ 20 KB.', {
    icon: 'Target', keywords: ['20kb'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('compress-to-25kb', 'Compress to 25 KB', 'compress', '', '≤ 25 KB.', {
    icon: 'Target', keywords: ['25kb'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('compress-to-30kb', 'Compress to 30 KB', 'compress', '', '≤ 30 KB.', {
    icon: 'Target', keywords: ['30kb'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('compress-to-40kb', 'Compress to 40 KB', 'compress', '', '≤ 40 KB.', {
    icon: 'Target', keywords: ['40kb'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('compress-to-150kb', 'Compress to 150 KB', 'compress', '', '≤ 150 KB.', {
    icon: 'Target', keywords: ['150kb'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('compress-to-300kb', 'Compress to 300 KB', 'compress', '', '≤ 300 KB.', {
    icon: 'Target', keywords: ['300kb'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('compress-to-1mb', 'Compress to 1 MB', 'compress', '', '≤ 1 MB.', {
    icon: 'Target', keywords: ['1mb'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('compress-to-2mb', 'Compress to 2 MB', 'compress', '', '≤ 2 MB.', {
    icon: 'Target', keywords: ['2mb'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('mb-to-kb', 'MB to KB', 'size', '', 'MB → KB.', {
    icon: 'Repeat', keywords: ['mb', 'kb'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('kb-to-mb', 'KB to MB', 'size', '', 'KB → MB.', {
    icon: 'Repeat', keywords: ['kb', 'mb'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('increase-size-mb', 'Increase Image Size (MB)', 'size', '', 'Increase MB.', {
    icon: 'PlusCircle', keywords: ['increase', 'mb'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('gif-resize', 'GIF Resize', 'gif', '', 'Resize GIF.', {
    icon: 'Maximize2', keywords: ['gif', 'resize'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('gif-crop', 'GIF Crop', 'gif', '', 'Crop GIF.', {
    icon: 'Crop', keywords: ['gif', 'crop'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('gif-text', 'Add Text to GIF', 'gif', '', 'GIF text overlay.', {
    icon: 'Type', keywords: ['gif', 'text'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('gif-frame-extract', 'GIF Frame Extractor', 'gif', '', 'Extract frames.', {
    icon: 'Layers', keywords: ['gif', 'frames'] }),
    status: 'coming-soon' },
  { ...BASE_TOOL('freeform-collage', 'Freeform Collage', 'collage', '', 'Freeform layout.', {
    icon: 'LayoutGrid', keywords: ['freeform'] }),
    status: 'coming-soon' },
];

export const ALL_TOOLS: Tool[] = [...TOOLS, ...COMING_SOON];

export function getTool(slug: string): Tool | undefined {
  return ALL_TOOLS.find((t) => t.slug === slug);
}

export function toolsByCategory(slug: string): Tool[] {
  return ALL_TOOLS.filter((t) => t.category === slug);
}

export function readyToolsByCategory(slug: string): Tool[] {
  return TOOLS.filter((t) => t.category === slug);
}

export function searchTools(q: string): Tool[] {
  if (!q) return [];
  const needle = q.toLowerCase().trim();
  return ALL_TOOLS.filter((t) => {
    const hay = [
      t.title,
      t.shortDescription,
      t.category,
      ...(t.keywords || []),
      t.slug,
    ]
      .join(' ')
      .toLowerCase();
    return hay.includes(needle);
  });
}
