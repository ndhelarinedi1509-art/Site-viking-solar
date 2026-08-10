// Résout un lien Google Maps (y compris les liens courts maps.app.goo.gl)
// vers une URL d'embed utilisable dans un <iframe>.
// Ex. https://maps.app.goo.gl/voTqLWVc3Qxdw2sa7
//   -> https://maps.google.com/maps?q=-4.4013038,15.3227446&z=12&output=embed

export async function resolveMapsEmbedUrl(mapUrl: string): Promise<string> {
  const trimmed = mapUrl.trim();
  if (!trimmed) return '';

  // Déjà une URL d'embed Google Maps
  if (trimmed.includes('/maps/embed')) return trimmed;

  // Contient déjà des coordonnées exploitables (3d..!4d.. ou @lat,lng)
  const coords = extractCoords(trimmed);
  if (coords) return buildEmbed(coords);

  // Lien court : on suit la redirection pour récupérer l'URL complète
  try {
    const res = await fetch(trimmed, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store',
    });
    const finalUrl = res.url || trimmed;
    const finalCoords = extractCoords(finalUrl);
    if (finalCoords) return buildEmbed(finalCoords);
    if (finalUrl.includes('/maps/embed')) return finalUrl;
  } catch {
    // offline ou erreur réseau : on garde le lien original en secours
  }

  return trimmed;
}

interface Coords {
  lat: string;
  lng: string;
  zoom: string;
}

function extractCoords(url: string): Coords | null {
  // https://www.google.com/maps/place/Kinshasa/@-4.4013038,15.3227446,12z/...
  const at = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?),(\d+(?:\.\d+)?)z/);
  if (at) return { lat: at[1], lng: at[2], zoom: at[3] };

  // https://www.google.com/maps/place/...!3d-4.3032527!4d15.310528
  const pb = url.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (pb) return { lat: pb[1], lng: pb[2], zoom: '15' };

  // ?q=lat,lng ou q=lat,lng
  const q = url.match(/[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (q) return { lat: q[1], lng: q[2], zoom: '15' };

  return null;
}

function buildEmbed(coords: Coords): string {
  const zoom = coords.zoom && Number(coords.zoom) > 2 && Number(coords.zoom) <= 21 ? coords.zoom : '15';
  return `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=${zoom}&output=embed`;
}
