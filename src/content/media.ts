/**
 * Website photography. All images are free-licence photos from Unsplash
 * (https://unsplash.com/license: commercial use allowed, no attribution required).
 * Credits are kept here and shown on /credits. Replace any slot with Lumen-owned
 * photography by overwriting the file in /public/media and updating its credit.
 */
export interface Photo { src: string; alt: string; credit: string; sourceUrl: string }

export const media = {
  "hero": { src: "/media/hero.jpg", alt: "Dubai skyline with Burj Khalifa at sunset, seen across the water", credit: "Karen Dalton", sourceUrl: "https://unsplash.com/photos/nk7rQ24o0v8" },
  "community-downtown-dubai": { src: "/media/community-downtown-dubai.jpg", alt: "Downtown Dubai and Burj Khalifa illuminated at night", credit: "ZQ Lee", sourceUrl: "https://unsplash.com/photos/DcyL0IoCY0A" },
  "community-palm-jumeirah": { src: "/media/community-palm-jumeirah.jpg", alt: "Aerial view of Palm Jumeirah's trunk and fronds", credit: "Jhonwayne Pumaras", sourceUrl: "https://unsplash.com/photos/GrM3kKeH6zU" },
  "community-dubai-marina": { src: "/media/community-dubai-marina.jpg", alt: "Dubai Marina towers at golden hour, seen from the water", credit: "Emma Harrisova", sourceUrl: "https://unsplash.com/photos/UDsO83Ts6tQ" },
  "community-dubai-hills-estate": { src: "/media/community-dubai-hills-estate.jpg", alt: "A quiet residential street of townhouses with the Dubai skyline beyond", credit: "Ben Koorengevel", sourceUrl: "https://unsplash.com/photos/R9Dc1pwBTjY" },
  "community-business-bay": { src: "/media/community-business-bay.jpg", alt: "Aerial view of Business Bay towers along the Dubai Water Canal", credit: "Nelemson Guevarra", sourceUrl: "https://unsplash.com/photos/cxtmm36ItkQ" },
  "community-dubai-creek-harbour": { src: "/media/community-dubai-creek-harbour.jpg", alt: "Sunset over Dubai Creek with the skyline in the distance", credit: "Hongbin", sourceUrl: "https://unsplash.com/photos/xWHZPHuGrCA" },
  "community-emaar-beachfront": { src: "/media/community-emaar-beachfront.jpg", alt: "Waterfront residential towers and promenade in Dubai", credit: "Joel Ambass", sourceUrl: "https://unsplash.com/photos/9ewh3s3guV8" },
  "community-jumeirah-village-circle": { src: "/media/community-jumeirah-village-circle.jpg", alt: "Aerial view of a circular residential community in Dubai", credit: "Sajimon Sahadevan", sourceUrl: "https://unsplash.com/photos/MK5Qg8xVFJM" },
  "service-buy": { src: "/media/service-buy.jpg", alt: "A private villa courtyard with a plunge pool and tropical planting", credit: "Shawn", sourceUrl: "https://unsplash.com/photos/A7Z5U6LyacA" },
  "service-sell": { src: "/media/service-sell.jpg", alt: "A bright, contemporary living room in a Dubai apartment", credit: "Aalo Lens", sourceUrl: "https://unsplash.com/photos/yxO8YG082v8" },
  "service-rent": { src: "/media/service-rent.jpg", alt: "A furnished, light-filled apartment living space", credit: "Francesca Tosolini", sourceUrl: "https://unsplash.com/photos/tHkJAMcO3QE" },
  "service-off-plan": { src: "/media/service-off-plan.jpg", alt: "Downtown Dubai towers rising above Sheikh Zayed Road interchanges", credit: "Leonard von Bibra", sourceUrl: "https://unsplash.com/photos/hep72i867oI" },
  "intro": { src: "/media/intro.jpg", alt: "Burj Khalifa framed by palm fronds against a clear sky", credit: "Timur Gibadullin", sourceUrl: "https://unsplash.com/photos/ibffGy0gtK4" },
  "intro-detail": { src: "/media/intro-detail.jpg", alt: "Burj Al Arab seen beyond Madinat Jumeirah", credit: "AlaDin Habboubi", sourceUrl: "https://unsplash.com/photos/pJz6jbXpoiE" },
  "about": { src: "/media/about.jpg", alt: "Burj Khalifa and Downtown Dubai under a bright sky", credit: "Wael Hneini", sourceUrl: "https://unsplash.com/photos/QJKEa9n3yN8" },
  "article-dubai-property-buying-costs": { src: "/media/article-dubai-property-buying-costs.jpg", alt: "Museum of the Future and Emirates Towers on Sheikh Zayed Road", credit: "Darcey Beau", sourceUrl: "https://unsplash.com/photos/q8D7WZc40eA" },
  "article-off-plan-vs-ready-property": { src: "/media/article-off-plan-vs-ready-property.jpg", alt: "Glass office towers in Dubai's financial district", credit: "Cpt Burah", sourceUrl: "https://unsplash.com/photos/z01PDy9SGeY" },
  "article-golden-visa-property-overview": { src: "/media/article-golden-visa-property-overview.jpg", alt: "Burj Al Arab on Dubai's coastline", credit: "Darcey Beau", sourceUrl: "https://unsplash.com/photos/vtK31JoeAFk" },
  "collection-properties": { src: "/media/collection-properties.jpg", alt: "A villa terrace with sun loungers beside the pool", credit: "Sanju Pandita", sourceUrl: "https://unsplash.com/photos/IPusH_J_C3I" },
  "collection-developments": { src: "/media/collection-developments.jpg", alt: "Waterfront towers and new construction along a Dubai canal", credit: "Andy Bridge", sourceUrl: "https://unsplash.com/photos/y6rEPwcGokw" },
} satisfies Record<string, Photo>;

export type MediaKey = keyof typeof media;
