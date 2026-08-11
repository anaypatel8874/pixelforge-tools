export function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'PixelForge Tools',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
    description:
      'PixelForge Tools: a fast, free, privacy-first image toolkit. Resize, compress, convert, crop, and edit images directly in your browser.',
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}