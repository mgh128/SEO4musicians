/**
 * SEO4musicians - Free Schema.org Music & Band Linked Data PWA Generator
 * Hosted at https://mh1.eu/tools/SEO4musicians
 * Vue 3 Options API Application
 */

const { createApp } = Vue;

// =========================================================================
// VENUE TIMEZONE RESOLVER & IANA TIMEZONE DATABASE
// Ensures strict ISO 8601 timestamps with accurate venue-localized offsets
// =========================================================================
const US_STATE_TIMEZONES = {
  'WA': 'America/Los_Angeles', 'OR': 'America/Los_Angeles', 'CA': 'America/Los_Angeles', 'NV': 'America/Los_Angeles',
  'ID': 'America/Boise', 'MT': 'America/Denver', 'WY': 'America/Denver', 'UT': 'America/Denver', 'AZ': 'America/Phoenix', 'NM': 'America/Denver', 'CO': 'America/Denver',
  'ND': 'America/Chicago', 'SD': 'America/Chicago', 'NE': 'America/Chicago', 'KS': 'America/Chicago', 'OK': 'America/Chicago', 'TX': 'America/Chicago', 'MN': 'America/Chicago', 'IA': 'America/Chicago', 'MO': 'America/Chicago', 'AR': 'America/Chicago', 'LA': 'America/Chicago', 'WI': 'America/Chicago', 'IL': 'America/Chicago',
  'MI': 'America/Detroit', 'IN': 'America/Indiana/Indianapolis', 'KY': 'America/New_York', 'TN': 'America/Chicago', 'MS': 'America/Chicago', 'AL': 'America/Chicago',
  'OH': 'America/New_York', 'WV': 'America/New_York', 'VA': 'America/New_York', 'NC': 'America/New_York', 'SC': 'America/New_York', 'GA': 'America/New_York', 'FL': 'America/New_York',
  'PA': 'America/New_York', 'NY': 'America/New_York', 'NJ': 'America/New_York', 'CT': 'America/New_York', 'RI': 'America/New_York', 'MA': 'America/New_York', 'VT': 'America/New_York', 'NH': 'America/New_York', 'ME': 'America/New_York', 'DC': 'America/New_York',
  'HI': 'Pacific/Honolulu', 'AK': 'America/Anchorage'
};

const COUNTRY_TIMEZONES = {
  'GB': 'Europe/London', 'UK': 'Europe/London', 'IE': 'Europe/Dublin',
  'FR': 'Europe/Paris', 'DE': 'Europe/Berlin', 'NL': 'Europe/Amsterdam', 'BE': 'Europe/Brussels', 'ES': 'Europe/Madrid', 'IT': 'Europe/Rome', 'PT': 'Europe/Lisbon', 'CH': 'Europe/Zurich', 'AT': 'Europe/Vienna', 'SE': 'Europe/Stockholm', 'NO': 'Europe/Oslo', 'DK': 'Europe/Copenhagen', 'FI': 'Europe/Helsinki', 'PL': 'Europe/Warsaw', 'CZ': 'Europe/Prague',
  'JP': 'Asia/Tokyo', 'AU': 'Australia/Sydney', 'NZ': 'Pacific/Auckland', 'CA': 'America/Toronto', 'MX': 'America/Mexico_City', 'BR': 'America/Sao_Paulo', 'AR': 'America/Argentina/Buenos_Aires'
};

const COMMON_TIMEZONES_LIST = [
  { label: 'US Pacific (Los Angeles, Seattle, SF)', value: 'America/Los_Angeles' },
  { label: 'US Mountain (Denver, Salt Lake)', value: 'America/Denver' },
  { label: 'US Mountain - No DST (Phoenix/Arizona)', value: 'America/Phoenix' },
  { label: 'US Central (Chicago, Austin, Nashville)', value: 'America/Chicago' },
  { label: 'US Eastern (New York, Boston, Atlanta)', value: 'America/New_York' },
  { label: 'UK & Ireland (London, Dublin, Glasgow)', value: 'Europe/London' },
  { label: 'Central Europe (Berlin, Paris, Amsterdam, Rome)', value: 'Europe/Berlin' },
  { label: 'Eastern Europe (Athens, Helsinki, Bucharest)', value: 'Europe/Helsinki' },
  { label: 'Japan Standard (Tokyo, Osaka)', value: 'Asia/Tokyo' },
  { label: 'Australia Eastern (Sydney, Melbourne)', value: 'Australia/Sydney' },
  { label: 'Australia Western (Perth)', value: 'Australia/Perth' },
  { label: 'Canada Pacific (Vancouver)', value: 'America/Vancouver' },
  { label: 'Canada Eastern (Toronto, Montreal)', value: 'America/Toronto' },
  { label: 'Universal Time (UTC / GMT)', value: 'UTC' }
];

function getBlankArtistState() {
  return {
    name: '',
    legalName: '',
    alternateNames: [],
    url: '',
    foundingDate: '',
    dissolutionDate: '',
    foundingLocation: {
      name: '',
      city: '',
      region: '',
      country: ''
    },
    genres: [],
    genreInput: '',
    description: '',
    images: [],
    logoUrl: '',
    sameAs: {
      musicBrainz: '',
      wikidata: '',
      spotify: '',
      appleMusic: '',
      bandcamp: '',
      youtube: '',
      soundcloud: '',
      discogs: '',
      bandsintown: '',
      songkick: '',
      genius: '',
      musixmatch: '',
      facebook: '',
      instagram: '',
      twitter: '',
      tiktok: ''
    },
    members: [],
    albums: [],
    events: [],
    reviews: []
  };
}

const SAMPLE_DEMO_BAND = {
  name: "The Velvet Meridian",
  legalName: "Velvet Meridian Music LLC",
  alternateNames: ["Velvet Meridian", "TVM"],
  url: "https://thevelvetmeridian.com",
  foundingDate: "2019-04-12",
  dissolutionDate: "",
  foundingLocation: {
    name: "Sub Pop Rehearsal Studios",
    city: "Seattle",
    region: "WA",
    country: "US"
  },
  genres: ["Indie Rock", "Dream Pop", "Post-Punk", "Shoegaze"],
  genreInput: "",
  description: "The Velvet Meridian is a critically acclaimed 4-piece dream-pop and post-punk outfit from Seattle, WA, blending shimmering reverberant guitar textures with atmospheric synths and driving rhythmic basslines.",
  images: [
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80"
  ],
  logoUrl: "https://thevelvetmeridian.com/assets/logo.png",
  sameAs: {
    musicBrainz: "https://musicbrainz.org/artist/8f6bd1e4-fbe0-4f50-aa9b-7341cb19b5bf",
    wikidata: "https://www.wikidata.org/wiki/Q105684285",
    spotify: "https://open.spotify.com/artist/4Z8W4fKeB5YxbusRsdQVPb",
    appleMusic: "https://music.apple.com/us/artist/the-velvet-meridian/1472918471",
    bandcamp: "https://thevelvetmeridian.bandcamp.com",
    youtube: "https://www.youtube.com/@TheVelvetMeridian",
    soundcloud: "https://soundcloud.com/thevelvetmeridian",
    discogs: "https://www.discogs.com/artist/7382910-The-Velvet-Meridian",
    bandsintown: "https://www.bandsintown.com/a/15423891-the-velvet-meridian",
    songkick: "https://www.songkick.com/artists/10192842-the-velvet-meridian",
    genius: "https://genius.com/artists/The-velvet-meridian",
    musixmatch: "https://www.musixmatch.com/artist/The-Velvet-Meridian",
    facebook: "https://www.facebook.com/thevelvetmeridian",
    instagram: "https://www.instagram.com/thevelvetmeridian",
    twitter: "https://twitter.com/velvetmeridian",
    tiktok: "https://www.tiktok.com/@thevelvetmeridian"
  },
  members: [
    { name: "Elena Vance", role: "Lead Vocalist & Rhythm Guitar", instrument: "Vocals, Guitar", url: "https://thevelvetmeridian.com/band/elena", wikidata: "", mbid: "" },
    { name: "Julian Thorne", role: "Lead Guitarist & Synths", instrument: "Guitar, Synthesizer", url: "https://thevelvetmeridian.com/band/julian", wikidata: "", mbid: "" },
    { name: "Maya Lin", role: "Bassist & Backing Vocals", instrument: "Bass Guitar", url: "https://thevelvetmeridian.com/band/maya", wikidata: "", mbid: "" },
    { name: "Lucas Cole", role: "Drummer & Percussionist", instrument: "Drums, Sampler", url: "https://thevelvetmeridian.com/band/lucas", wikidata: "", mbid: "" }
  ],
  albums: [
    {
      id: "nocturne-horizons",
      title: "Nocturne Horizons",
      releaseType: "AlbumRelease",
      releaseDate: "2024-03-15",
      label: "Cascade Sound Recordings",
      catalogNumber: "CSR-2024-08",
      barcode: "019582910482",
      image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=800&q=80",
      url: "https://thevelvetmeridian.com/albums/nocturne-horizons",
      mbid: "b48c081e-1f7c-47ea-a841-76495b281f62",
      streamingLinks: {
        spotify: "https://open.spotify.com/album/3RQQN4w5ZqZ9N0ZtT3yQpL",
        bandcamp: "https://thevelvetmeridian.bandcamp.com/album/nocturne-horizons",
        appleMusic: "https://music.apple.com/us/album/nocturne-horizons/1728391024",
        youtubeMusic: "https://music.youtube.com/playlist?list=OLAK5uy_k9X8jQWz4"
      },
      tracks: [
        { position: 1, title: "Neon Aurora", duration: "04:12", isrc: "US-CSR-24-00101", composer: "Elena Vance, Julian Thorne", lyricsUrl: "https://genius.com/The-velvet-meridian-neon-aurora-lyrics", previewUrl: "" },
        { position: 2, title: "Cobalt Tides", duration: "03:48", isrc: "US-CSR-24-00102", composer: "Elena Vance", lyricsUrl: "https://genius.com/The-velvet-meridian-cobalt-tides-lyrics", previewUrl: "" },
        { position: 3, title: "Static Echoes", duration: "05:04", isrc: "US-CSR-24-00103", composer: "Julian Thorne, Maya Lin", lyricsUrl: "", previewUrl: "" }
      ]
    }
  ],
  events: [
    {
      name: "The Velvet Meridian at The Showbox",
      startDate: "2026-10-18T20:00:00-07:00",
      endDate: "2026-10-18T23:30:00-07:00",
      timezone: "America/Los_Angeles",
      status: "EventScheduled",
      attendanceMode: "OfflineEventAttendanceMode",
      venueName: "The Showbox",
      streetAddress: "1426 1st Ave",
      city: "Seattle",
      region: "WA",
      postalCode: "98101",
      country: "US",
      ticketUrl: "https://www.axs.com/events/592810/the-velvet-meridian-tickets",
      price: "32.50",
      currency: "USD",
      availability: "InStock"
    },
    {
      name: "The Velvet Meridian at O2 Academy Brixton",
      startDate: "2026-11-04T19:30:00+00:00",
      endDate: "2026-11-04T23:00:00+00:00",
      timezone: "Europe/London",
      status: "EventScheduled",
      attendanceMode: "OfflineEventAttendanceMode",
      venueName: "O2 Academy Brixton",
      streetAddress: "211 Stockwell Rd",
      city: "London",
      region: "",
      postalCode: "SW9 9SL",
      country: "GB",
      ticketUrl: "https://www.ticketmaster.co.uk/event/the-velvet-meridian",
      price: "28.00",
      currency: "GBP",
      availability: "InStock"
    }
  ],
  reviews: [
    {
      source: "Pitchfork",
      author: "Samantha Reed",
      url: "https://pitchfork.com/reviews/albums/the-velvet-meridian-nocturne-horizons",
      headline: "The Velvet Meridian craft a mesmerizing, widescreen dream-pop masterpiece.",
      snippet: "Nocturne Horizons balances shimmering melodic clarity with crushing reverb-drenched emotional weight.",
      rating: 8.4,
      bestRating: 10
    }
  ]
};

const app = createApp({
  data() {
    return {
      // Primary Hero URL auto-discovery field
      heroUrlInput: '',
      
      // Auto-Discovery Lifecycle Status
      discovery: {
        running: false,
        step: '',
        progress: 0,
        logs: [],
        found: null
      },

      // Tour Importer State (Dedicated sub-tool in Tab 3)
      tourImporter: {
        query: '',
        loading: false,
        error: null,
        extractedEvents: [],
        sourceDetected: ''
      },

      // Bandcamp Importer State (Dedicated sub-tool in Tab 2)
      bandcampImporter: {
        url: '',
        loading: false,
        error: null,
        importedCount: 0
      },

      commonTimezones: COMMON_TIMEZONES_LIST,

      currentView: 'tool', // 'tool' | 'about'
      activePlayingVideo: null, // null | { id: 'why'|'how', title: string, src: string, description: string }

      activeTab: 'profile', // 'profile' | 'discography' | 'events' | 'reviews' | 'crawler' | 'preview'
      exportMode: 'consolidated', // 'consolidated' | 'multi-page'
      multiPageSubTab: 'home', // 'home' | 'discography' | 'album' | 'events'
      selectedAlbumIndex: 0,
      includeScriptTag: true,
      activeModal: null, // 'import' | 'embed' | 'bulkTracks' | 'resetConfirm' | 'disclaimer' | 'gettingStarted'
      embedCmsTab: 'wordpress',
      toasts: [],
      installPromptEvent: null,
      isOffline: !navigator.onLine,
      bulkTracksInput: '',
      bulkTargetAlbumIndex: 0,
      rawJsonImportInput: '',
      
      genreSuggestions: [
        'Alternative Rock', 'Indie Rock', 'Dream Pop', 'Shoegaze', 'Post-Punk',
        'Synthpop', 'Electronic', 'Metalcore', 'Hip-Hop', 'Folk',
        'Jazz', 'R&B', 'Ambient', 'Progressive Rock', 'Punk Rock'
      ],

      // Primary Artist / Band Reactive State - CLEAN / BLANK BY DEFAULT
      artist: getBlankArtistState(),

      // Dedicated Crawler & MusicBrainz Manual Sub-Tab State
      crawler: {
        url: '',
        loading: false,
        error: null,
        detectedLinks: [],
        siteTopology: null,
        mbQuery: '',
        mbLoading: false,
        mbError: null,
        mbResults: [],
        mbReleasesLoading: false
      }
    };
  },

  computed: {
    computedSameAsList() {
      const list = [];
      const sa = this.artist.sameAs || {};
      
      for (const [key, rawVal] of Object.entries(sa)) {
        if (!rawVal || typeof rawVal !== 'string') continue;
        const trimmed = rawVal.trim();
        if (!trimmed) continue;

        if (key === 'musicBrainz') {
          if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed)) {
            list.push(`https://musicbrainz.org/artist/${trimmed}`);
          } else {
            list.push(trimmed);
          }
        } else if (key === 'wikidata') {
          if (/^Q\d+$/i.test(trimmed)) {
            list.push(`https://www.wikidata.org/wiki/${trimmed.toUpperCase()}`);
          } else {
            list.push(trimmed);
          }
        } else {
          list.push(trimmed);
        }
      }

      return Array.from(new Set(list));
    },

    computedConsolidatedSchema() {
      const baseUrl = this.cleanUrl(this.artist.url) || 'https://example.com';
      const artistId = `${baseUrl}#artist`;

      const schema = {
        "@context": "https://schema.org",
        "@type": "MusicGroup",
        "@id": artistId,
        "name": this.artist.name || "Artist / Band Name",
        "url": baseUrl
      };

      if (this.artist.legalName) schema.legalName = this.artist.legalName;
      if (this.artist.alternateNames && this.artist.alternateNames.length > 0) {
        const alts = this.artist.alternateNames.filter(n => n && n.trim());
        if (alts.length > 0) schema.alternateName = alts;
      }
      if (this.artist.description) schema.description = this.artist.description;
      if (this.artist.logoUrl) schema.logo = this.artist.logoUrl;
      
      const validImages = (this.artist.images || []).filter(img => img && img.trim());
      if (validImages.length === 1) {
        schema.image = validImages[0];
      } else if (validImages.length > 1) {
        schema.image = validImages;
      }

      if (this.artist.genres && this.artist.genres.length > 0) {
        schema.genre = this.artist.genres;
      }
      if (this.artist.foundingDate) schema.foundingDate = this.artist.foundingDate;
      if (this.artist.dissolutionDate) schema.dissolutionDate = this.artist.dissolutionDate;

      if (this.artist.foundingLocation && (this.artist.foundingLocation.city || this.artist.foundingLocation.name)) {
        const loc = this.artist.foundingLocation;
        schema.foundingLocation = {
          "@type": "Place",
          "name": loc.name || `${loc.city}, ${loc.region || ''} ${loc.country || ''}`.trim(),
          "address": {
            "@type": "PostalAddress",
            "addressLocality": loc.city || undefined,
            "addressRegion": loc.region || undefined,
            "addressCountry": loc.country || undefined
          }
        };
      }

      const sameAs = this.computedSameAsList;
      if (sameAs.length > 0) {
        schema.sameAs = sameAs;
      }

      if (this.artist.members && this.artist.members.length > 0) {
        const membersList = this.artist.members
          .filter(m => m.name && m.name.trim())
          .map(m => {
            const memberNode = {
              "@type": "Person",
              "name": m.name.trim()
            };
            if (m.url) memberNode.url = m.url.trim();
            
            const memberSameAs = [];
            if (m.wikidata) {
              memberSameAs.push(/^Q\d+$/i.test(m.wikidata.trim()) ? `https://www.wikidata.org/wiki/${m.wikidata.trim().toUpperCase()}` : m.wikidata.trim());
            }
            if (m.mbid) {
              memberSameAs.push(/^[0-9a-f-]{36}$/i.test(m.mbid.trim()) ? `https://musicbrainz.org/artist/${m.mbid.trim()}` : m.mbid.trim());
            }
            if (memberSameAs.length > 0) memberNode.sameAs = memberSameAs;

            if (m.role || m.instrument) {
              memberNode.hasOccupation = {
                "@type": "Occupation",
                "name": m.role || m.instrument,
                "description": m.instrument ? `Instruments: ${m.instrument}` : undefined
              };
            }
            return memberNode;
          });

        if (membersList.length > 0) {
          schema.member = membersList;
        }
      }

      if (this.artist.albums && this.artist.albums.length > 0) {
        const albumsList = this.artist.albums
          .filter(alb => alb.title && alb.title.trim())
          .map((alb, index) => this.buildAlbumNode(alb, baseUrl, artistId, index));
        if (albumsList.length > 0) {
          schema.album = albumsList;
        }
      }

      if (this.artist.events && this.artist.events.length > 0) {
        const eventsList = this.artist.events
          .filter(evt => evt.name && evt.name.trim())
          .map((evt, index) => this.buildEventNode(evt, baseUrl, artistId, index));
        if (eventsList.length > 0) {
          schema.event = eventsList;
        }
      }

      if (this.artist.reviews && this.artist.reviews.length > 0) {
        const reviewsList = this.artist.reviews
          .filter(rev => (rev.headline || rev.snippet || rev.source))
          .map(rev => this.buildReviewNode(rev, artistId));
        if (reviewsList.length > 0) {
          schema.subjectOf = reviewsList;
        }
      }

      return schema;
    },

    computedMultiPageSchema() {
      const baseUrl = this.cleanUrl(this.artist.url) || 'https://example.com';
      const artistId = `${baseUrl}#artist`;

      if (this.multiPageSubTab === 'home') {
        const schema = {
          "@context": "https://schema.org",
          "@type": "MusicGroup",
          "@id": artistId,
          "name": this.artist.name || "Artist / Band Name",
          "url": baseUrl,
          "description": this.artist.description || undefined,
          "genre": this.artist.genres && this.artist.genres.length > 0 ? this.artist.genres : undefined,
          "sameAs": this.computedSameAsList.length > 0 ? this.computedSameAsList : undefined
        };
        if (this.artist.images && this.artist.images[0]) schema.image = this.artist.images[0];
        if (this.artist.foundingDate) schema.foundingDate = this.artist.foundingDate;
        
        if (this.artist.members && this.artist.members.length > 0) {
          schema.member = this.artist.members
            .filter(m => m.name && m.name.trim())
            .map(m => ({
              "@type": "Person",
              "name": m.name,
              "hasOccupation": m.role ? { "@type": "Occupation", "name": m.role } : undefined
            }));
        }

        if (this.artist.albums && this.artist.albums.length > 0) {
          schema.album = this.artist.albums.map((a, idx) => ({
            "@type": "MusicAlbum",
            "@id": a.url ? `${a.url}#album` : `${baseUrl}/albums/${this.slugify(a.title || `album-${idx + 1}`)}#album`,
            "name": a.title,
            "datePublished": a.releaseDate || undefined
          }));
        }

        return schema;
      } 
      
      else if (this.multiPageSubTab === 'discography') {
        return {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${baseUrl}/music#discography`,
          "name": `${this.artist.name || 'Artist'} - Discography & Releases`,
          "url": `${baseUrl}/music`,
          "about": {
            "@type": "MusicGroup",
            "@id": artistId,
            "name": this.artist.name || 'Artist'
          },
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": (this.artist.albums || []).map((alb, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": this.buildAlbumNode(alb, baseUrl, artistId, index)
            }))
          }
        };
      } 
      
      else if (this.multiPageSubTab === 'album') {
        const currentAlbum = (this.artist.albums && this.artist.albums[this.selectedAlbumIndex]) || this.artist.albums[0];
        if (!currentAlbum) return { "@context": "https://schema.org", "@type": "MusicAlbum", "name": "No Album Configured" };
        
        return {
          "@context": "https://schema.org",
          ...this.buildAlbumNode(currentAlbum, baseUrl, artistId, this.selectedAlbumIndex)
        };
      } 
      
      else if (this.multiPageSubTab === 'events') {
        return {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${baseUrl}/tour#events`,
          "name": `${this.artist.name || 'Artist'} - Tour Dates & Live Performances`,
          "url": `${baseUrl}/tour`,
          "about": {
            "@type": "MusicGroup",
            "@id": artistId,
            "name": this.artist.name || 'Artist'
          },
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": (this.artist.events || []).map((evt, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": this.buildEventNode(evt, baseUrl, artistId, index)
            }))
          }
        };
      }

      return this.computedConsolidatedSchema;
    },

    activeSchemaPayload() {
      return this.exportMode === 'consolidated' 
        ? this.computedConsolidatedSchema 
        : this.computedMultiPageSchema;
    },

    activeSchemaJson() {
      return JSON.stringify(this.activeSchemaPayload, null, 2);
    },

    activeSchemaScriptTag() {
      if (!this.includeScriptTag) {
        return this.activeSchemaJson;
      }
      return `<script type="application/ld+json">\n${this.activeSchemaJson}\n</script>`;
    },

    activeSchemaHighlightedHtml() {
      return this.syntaxHighlightJson(this.activeSchemaScriptTag);
    },

    seoQualityReport() {
      const issues = [];
      const passed = [];
      let score = 0;

      if (this.artist.name && this.artist.name.trim()) {
        score += 10;
        passed.push({ title: "Artist/Band Name Defined", desc: `Identified as "${this.artist.name}"` });
      } else {
        issues.push({ type: "critical", title: "Missing Artist Name", desc: "Artist or band name is mandatory for schema identification." });
      }

      if (this.artist.url && this.artist.url.trim()) {
        score += 5;
        passed.push({ title: "Official Homepage Linked", desc: this.artist.url });
      } else {
        issues.push({ type: "warning", title: "Missing Official Homepage URL", desc: "A canonical homepage URL provides the root entity @id for disambiguation." });
      }

      if (this.artist.description && this.artist.description.length > 50) {
        score += 5;
        passed.push({ title: "Rich Artist Bio/Description", desc: "Bio exceeds 50 characters, giving LLMs and search engines semantic context." });
      } else {
        issues.push({ type: "info", title: "Add Artist Description", desc: "Provide a detailed artist bio for Generative Engine Optimization (GEO)." });
      }

      if (this.artist.images && this.artist.images.filter(i => i && i.trim()).length > 0) {
        score += 5;
        passed.push({ title: "Promotional Images Attached", desc: "Visual assets enhance Google Search Knowledge Panels." });
      } else {
        issues.push({ type: "warning", title: "Missing Artist Imagery", desc: "Google Knowledge Panel algorithms favor entities with high-res photo URLs." });
      }

      if (this.artist.sameAs && this.artist.sameAs.musicBrainz && this.artist.sameAs.musicBrainz.trim()) {
        score += 10;
        passed.push({ title: "MusicBrainz MBID Grounded", desc: "Authoritative linked open data identifier attached." });
      } else {
        issues.push({ type: "warning", title: "Add MusicBrainz MBID", desc: "MusicBrainz is the primary semantic database used by Google, Apple, and Spotify for artist identity disambiguation." });
      }

      if (this.artist.sameAs && this.artist.sameAs.wikidata && this.artist.sameAs.wikidata.trim()) {
        score += 10;
        passed.push({ title: "Wikidata Entity Grounded", desc: "Direct link to Wikidata Knowledge Graph entry." });
      } else {
        issues.push({ type: "warning", title: "Add Wikidata URL / ID", desc: "Wikidata IDs directly trigger Google Knowledge Graph recognition." });
      }

      if (this.artist.sameAs && this.artist.sameAs.spotify && this.artist.sameAs.spotify.trim()) {
        score += 5;
        passed.push({ title: "Spotify Artist Link Verified", desc: "Streaming link registered in sameAs authority array." });
      } else {
        issues.push({ type: "info", title: "Add Spotify Artist Link", desc: "Connect Spotify to bridge music streaming data." });
      }

      const validAlbums = (this.artist.albums || []).filter(a => a.title && a.title.trim());
      if (validAlbums.length > 0) {
        score += 10;
        passed.push({ title: `${validAlbums.length} Release(s) Configured`, desc: `Albums: ${validAlbums.map(a => a.title).join(', ')}` });
        
        let hasTracks = false;
        let hasIsrc = false;
        validAlbums.forEach(alb => {
          if (alb.tracks && alb.tracks.length > 0) {
            hasTracks = true;
            if (alb.tracks.some(t => t.isrc && t.isrc.trim())) hasIsrc = true;
          }
        });

        if (hasTracks) {
          score += 10;
          passed.push({ title: "Tracklists with ISO 8601 Durations", desc: "Track-level MusicRecording schema allows direct rich snippet search." });
        } else {
          issues.push({ type: "warning", title: "Add Album Tracklists", desc: "Albums without tracks miss out on track-level Google search ranking." });
        }

        if (hasIsrc) {
          score += 5;
          passed.push({ title: "ISRC Codes Attached", desc: "International Standard Recording Codes uniquely disambiguate audio assets." });
        } else {
          issues.push({ type: "info", title: "Add ISRC Codes to Tracks", desc: "ISRC codes provide copyright and audio fingerprint authority." });
        }
      } else {
        issues.push({ type: "warning", title: "No Releases / Albums Added", desc: "Add your latest singles, EPs, or full albums." });
      }

      const validEvents = (this.artist.events || []).filter(e => e.name && e.name.trim() && e.startDate);
      if (validEvents.length > 0) {
        score += 10;
        passed.push({ title: `${validEvents.length} Live Event(s) Grounded`, desc: "MusicEvent schema with localized venue timezones attached." });
        
        const hasTickets = validEvents.some(e => e.ticketUrl && e.ticketUrl.trim());
        if (hasTickets) {
          score += 5;
          passed.push({ title: "Ticketing Offers Configured", desc: "Offer schema enables direct ticket purchase buttons in search results." });
        } else {
          issues.push({ type: "info", title: "Add Ticket Purchase URLs", desc: "Include ticket URLs to qualify for Google Event Action buttons." });
        }
      } else {
        issues.push({ type: "info", title: "Add Upcoming Tour Dates", desc: "Google Search displays live gig dates prominently when MusicEvent schema is present." });
      }

      const validReviews = (this.artist.reviews || []).filter(r => r.source || r.headline);
      if (validReviews.length > 0) {
        score += 10;
        passed.push({ title: `${validReviews.length} Press Review(s) Grounded`, desc: "subjectOf schema provides third-party E-E-A-T and LLM quote grounding." });
      } else {
        issues.push({ type: "info", title: "Add Press & Critical Reviews", desc: "subjectOf Review schema boosts entity authority for Google and ChatGPT/Perplexity citations." });
      }

      return {
        score: Math.min(100, score),
        passed,
        issues
      };
    }
  },

  mounted() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installPromptEvent = e;
    });

    window.addEventListener('online', () => {
      this.isOffline = false;
      this.showToast('Back online! Live MusicBrainz and Tour searches enabled.', 'success');
    });

    window.addEventListener('offline', () => {
      this.isOffline = true;
      this.showToast('You are offline. PWA local tools remain fully operational.', 'info');
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.activePlayingVideo) {
          this.closeVideoPlayer();
        } else if (this.activeModal) {
          this.activeModal = null;
        }
      }
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js')
        .then(() => console.log('[PWA] Service Worker registered successfully.'))
        .catch((err) => console.warn('[PWA] Service Worker registration failed:', err));
    }
  },

  methods: {
    // =========================================================================
    // VIEW ROUTING & VIDEO PRESENTATION CONTROLS
    // =========================================================================
    openAboutView() {
      this.currentView = 'about';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    closeAboutView() {
      this.currentView = 'tool';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    playVideo(videoKey) {
      if (videoKey === 'why') {
        this.activePlayingVideo = {
          id: 'why',
          title: 'Why use SEO4musicians? (Knowledge Graph, AI SEO & Entity Disambiguation)',
          src: './SEO4musicians-Why.mp4',
          description: 'Learn why Schema.org linked data, Knowledge Graph disambiguation, venue timezone accuracy, and direct Bandcamp links matter for musicians.'
        };
      } else if (videoKey === 'how') {
        this.activePlayingVideo = {
          id: 'how',
          title: 'How to use SEO4musicians? (Step-by-Step Auto-Discovery & CMS Integration)',
          src: './SEO4musicians-How.mp4',
          description: 'A step-by-step walkthrough showing how to enter your website or Bandcamp URL, auto-discover metadata, refine your schedule, and embed the JSON-LD.'
        };
      }
      this.$nextTick(() => {
        const vidEl = this.$refs.theaterVideo;
        if (vidEl) {
          vidEl.currentTime = 0;
          vidEl.play().catch(e => console.log('Autoplay deferred:', e));
        }
      });
    },

    closeVideoPlayer() {
      const vidEl = this.$refs.theaterVideo;
      if (vidEl) {
        vidEl.pause();
      }
      this.activePlayingVideo = null;
    },

    // =========================================================================
    // VENUE TIMEZONE & DATE-TIME NORMALIZATION ENGINE
    // =========================================================================
    resolveVenueTimezone(city, region, country) {
      const cUpper = (country || '').trim().toUpperCase();
      const rUpper = (region || '').trim().toUpperCase();
      const cityLower = (city || '').trim().toLowerCase();

      // 1. Check US state
      if (cUpper === 'US' || cUpper === 'USA' || cUpper === 'UNITED STATES' || (!cUpper && US_STATE_TIMEZONES[rUpper])) {
        if (US_STATE_TIMEZONES[rUpper]) return US_STATE_TIMEZONES[rUpper];
      }

      // 2. Check famous music hubs
      if (cityLower.includes('london') || cityLower.includes('manchester') || cityLower.includes('glasgow') || cityLower.includes('birmingham') || cityLower.includes('bristol') || cityLower.includes('leeds')) return 'Europe/London';
      if (cityLower.includes('paris') || cityLower.includes('lyon') || cityLower.includes('marseille')) return 'Europe/Paris';
      if (cityLower.includes('berlin') || cityLower.includes('hamburg') || cityLower.includes('cologne') || cityLower.includes('munich') || cityLower.includes('frankfurt')) return 'Europe/Berlin';
      if (cityLower.includes('amsterdam') || cityLower.includes('utrecht') || cityLower.includes('rotterdam')) return 'Europe/Amsterdam';
      if (cityLower.includes('tokyo') || cityLower.includes('osaka') || cityLower.includes('kyoto') || cityLower.includes('nagoya')) return 'Asia/Tokyo';
      if (cityLower.includes('sydney') || cityLower.includes('melbourne') || cityLower.includes('brisbane')) return 'Australia/Sydney';
      if (cityLower.includes('perth')) return 'Australia/Perth';
      if (cityLower.includes('toronto') || cityLower.includes('montreal') || cityLower.includes('ottawa')) return 'America/Toronto';
      if (cityLower.includes('vancouver')) return 'America/Vancouver';
      if (cityLower.includes('austin') || cityLower.includes('nashville') || cityLower.includes('chicago') || cityLower.includes('dallas') || cityLower.includes('houston') || cityLower.includes('new orleans')) return 'America/Chicago';
      if (cityLower.includes('seattle') || cityLower.includes('los angeles') || cityLower.includes('san francisco') || cityLower.includes('portland') || cityLower.includes('san diego') || cityLower.includes('las vegas')) return 'America/Los_Angeles';
      if (cityLower.includes('new york') || cityLower.includes('brooklyn') || cityLower.includes('boston') || cityLower.includes('philadelphia') || cityLower.includes('atlanta') || cityLower.includes('miami') || cityLower.includes('washington')) return 'America/New_York';
      if (cityLower.includes('denver') || cityLower.includes('phoenix') || cityLower.includes('salt lake')) return 'America/Denver';

      // 3. Check Country
      if (COUNTRY_TIMEZONES[cUpper]) return COUNTRY_TIMEZONES[cUpper];

      return 'UTC';
    },

    getTimezoneOffsetString(timeZone, dateObj) {
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: timeZone || 'UTC',
          timeZoneName: 'longOffset',
          year: 'numeric', month: 'numeric', day: 'numeric',
          hour: 'numeric', minute: 'numeric', second: 'numeric'
        });
        const parts = formatter.formatToParts(dateObj);
        const tzPart = parts.find(p => p.type === 'timeZoneName');
        if (tzPart && tzPart.value) {
          const m = tzPart.value.match(/GMT([+-]\d{2}:\d{2})/);
          if (m) return m[1];
          if (tzPart.value === 'GMT' || tzPart.value === 'UTC') return '+00:00';
        }
      } catch (e) {
        console.warn('Offset error:', e);
      }
      return '+00:00';
    },

    formatVenueDateTime(rawDateStr, rawTimeStr, timeZone) {
      if (!rawDateStr) return '';
      const cleanDate = rawDateStr.split('T')[0];
      let cleanTime = rawTimeStr ? (rawTimeStr.length === 5 ? `${rawTimeStr}:00` : rawTimeStr) : '20:00:00';
      if (rawDateStr.includes('T')) {
        const timePart = rawDateStr.split('T')[1].replace(/[Z+-].*$/, '');
        if (timePart) cleanTime = timePart.length === 5 ? `${timePart}:00` : timePart;
      }
      
      const dateObj = new Date(`${cleanDate}T12:00:00Z`);
      const offset = this.getTimezoneOffsetString(timeZone, isNaN(dateObj.getTime()) ? new Date() : dateObj);
      
      return `${cleanDate}T${cleanTime}${offset}`;
    },

    computeEndDateTime(startIso, timeZone, durationHours = 3.5) {
      if (!startIso) return '';
      const cleanDate = startIso.split('T')[0];
      let cleanTime = '20:00:00';
      if (startIso.includes('T')) {
        cleanTime = startIso.split('T')[1].replace(/[Z+-].*$/, '');
      }

      const [h, m] = cleanTime.split(':').map(Number);
      const totalMins = (h * 60 + (m || 0)) + Math.round(durationHours * 60);
      const endHour = Math.floor(totalMins / 60) % 24;
      const endMin = totalMins % 60;

      let endDate = cleanDate;
      if (Math.floor(totalMins / 60) >= 24) {
        const d = new Date(`${cleanDate}T12:00:00Z`);
        d.setUTCDate(d.getUTCDate() + 1);
        endDate = d.toISOString().split('T')[0];
      }

      const endTimeStr = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}:00`;
      const dateObj = new Date(`${endDate}T12:00:00Z`);
      const offset = this.getTimezoneOffsetString(timeZone, isNaN(dateObj.getTime()) ? new Date() : dateObj);

      return `${endDate}T${endTimeStr}${offset}`;
    },

    // Refresh ISO start/end strings on an event when user edits location or timezone
    syncEventDateTime(eIdx) {
      const evt = this.artist.events[eIdx];
      if (!evt) return;

      if (!evt.timezone) {
        evt.timezone = this.resolveVenueTimezone(evt.city, evt.region, evt.country);
      }

      if (evt.startDate) {
        evt.startDate = this.formatVenueDateTime(evt.startDate, null, evt.timezone);
        if (!evt.endDate || evt.endDate.split('T')[0] === evt.startDate.split('T')[0]) {
          evt.endDate = this.computeEndDateTime(evt.startDate, evt.timezone);
        }
      }
    },

    // =========================================================================
    // PRIMARY HERO AUTO-DISCOVERY ORCHESTRATOR
    // Crawls Website -> Extracts Info & Tour Subpages -> Queries Bandsintown & MB
    // =========================================================================
    async startAutoDiscovery() {
      if (!this.heroUrlInput || !this.heroUrlInput.trim()) {
        this.showToast('Please enter your band or artist website URL.', 'warning');
        return;
      }

      let targetUrl = this.heroUrlInput.trim();
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'https://' + targetUrl;
        this.heroUrlInput = targetUrl;
      }

      this.discovery.running = true;
      this.discovery.progress = 10;
      this.discovery.step = 'Connecting to website...';
      this.discovery.logs = [];
      this.discovery.found = {
        name: '',
        linksCount: 0,
        releasesCount: 0,
        eventsCount: 0,
        mbidMatched: false,
        location: ''
      };

      this.artist.url = targetUrl;
      this.addDiscoveryLog(`Target URL set to ${targetUrl}`, 'info');

      try {
        // Step 1: Fetch Homepage HTML
        this.discovery.progress = 20;
        this.discovery.step = 'Fetching webpage content & metadata...';
        let htmlText = '';

        try {
          const directRes = await fetch(targetUrl, { mode: 'cors' });
          if (directRes.ok) htmlText = await directRes.text();
        } catch (e) {
          try {
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
            const proxyRes = await fetch(proxyUrl);
            if (proxyRes.ok) htmlText = await proxyRes.text();
          } catch (e2) {
            const corsIo = `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`;
            const corsRes = await fetch(corsIo);
            if (corsRes.ok) htmlText = await corsRes.text();
          }
        }

        let discoveredTourSubpageUrl = null;

        if (htmlText) {
          this.discovery.progress = 35;
          this.discovery.step = 'Parsing HTML, metadata & streaming links...';
          
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlText, 'text/html');

          const ogSiteName = doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content') || '';
          const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
          const rawTitle = doc.querySelector('title')?.innerText || '';
          const h1Text = doc.querySelector('h1')?.innerText?.trim() || '';

          let candidateName = ogSiteName || '';
          if (!candidateName && ogTitle) {
            candidateName = ogTitle.split(/[-|–•]/)[0].trim();
          }
          if (!candidateName && rawTitle) {
            candidateName = rawTitle
              .replace(/\s*(?:\||-|–|•)\s*(?:Official Site|Home|Official Website|Music|Band|Bandcamp|Tour).*$/i, '')
              .trim();
          }
          if (!candidateName && h1Text && h1Text.length < 50) {
            candidateName = h1Text;
          }

          if (candidateName) {
            this.artist.name = candidateName;
            this.discovery.found.name = candidateName;
            this.addDiscoveryLog(`Extracted artist name: "${candidateName}"`, 'success');
          }

          const ogDesc = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
          const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
          const bioCandidate = ogDesc || metaDesc || '';
          if (bioCandidate && bioCandidate.length > 20) {
            this.artist.description = bioCandidate;
            this.addDiscoveryLog(`Extracted biography / description (${bioCandidate.length} characters)`, 'success');
          }

          const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
          const twitterImage = doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || '';
          const foundImages = [];
          if (ogImage) foundImages.push(ogImage.startsWith('http') ? ogImage : new URL(ogImage, targetUrl).href);
          if (twitterImage && twitterImage !== ogImage) foundImages.push(twitterImage.startsWith('http') ? twitterImage : new URL(twitterImage, targetUrl).href);
          
          if (foundImages.length > 0) {
            this.artist.images = foundImages;
            this.addDiscoveryLog(`Discovered ${foundImages.length} promo image(s)`, 'success');
          }

          // Extract Outbound Links & Tour subpages
          const anchors = Array.from(doc.querySelectorAll('a[href]'));
          const checkedSet = new Set();
          let linkCount = 0;

          const patterns = [
            { platform: 'Spotify', key: 'spotify', regex: /open\.spotify\.com\/artist\/([a-zA-Z0-9]+)/i },
            { platform: 'Apple Music', key: 'appleMusic', regex: /music\.apple\.com\/[a-z]{2}\/artist\/[^\/]+\/(\d+)/i },
            { platform: 'Bandcamp', key: 'bandcamp', regex: /([a-zA-Z0-9\-_]+)\.bandcamp\.com/i },
            { platform: 'SoundCloud', key: 'soundcloud', regex: /soundcloud\.com\/([a-zA-Z0-9\-_]+)/i },
            { platform: 'YouTube', key: 'youtube', regex: /youtube\.com\/(?:@|channel\/|c\/)([a-zA-Z0-9\-_]+)/i },
            { platform: 'MusicBrainz', key: 'musicBrainz', regex: /musicbrainz\.org\/artist\/([0-9a-f\-]{36})/i },
            { platform: 'Wikidata', key: 'wikidata', regex: /wikidata\.org\/wiki\/(Q\d+)/i },
            { platform: 'Discogs', key: 'discogs', regex: /discogs\.com\/artist\/([0-9]+)/i },
            { platform: 'Bandsintown', key: 'bandsintown', regex: /bandsintown\.com\/a\/([0-9]+)/i },
            { platform: 'Songkick', key: 'songkick', regex: /songkick\.com\/artists\/([0-9]+)/i },
            { platform: 'Genius', key: 'genius', regex: /genius\.com\/artists\/([a-zA-Z0-9\-_]+)/i },
            { platform: 'Musixmatch', key: 'musixmatch', regex: /musixmatch\.com\/artist\/([a-zA-Z0-9\-_]+)/i },
            { platform: 'Instagram', key: 'instagram', regex: /instagram\.com\/([a-zA-Z0-9\._]+)/i },
            { platform: 'Facebook', key: 'facebook', regex: /facebook\.com\/([a-zA-Z0-9\._\-]+)/i },
            { platform: 'X / Twitter', key: 'twitter', regex: /(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/i },
            { platform: 'TikTok', key: 'tiktok', regex: /tiktok\.com\/@([a-zA-Z0-9\._]+)/i }
          ];

          anchors.forEach(a => {
            const href = a.getAttribute('href');
            if (!href || checkedSet.has(href)) return;
            checkedSet.add(href);

            // Check if this anchor points to a tour subpage
            if (!discoveredTourSubpageUrl && /\/(tour|tour-dates|live|gigs|events|shows|concerts|schedule)/i.test(href)) {
              discoveredTourSubpageUrl = href.startsWith('http') ? href : new URL(href, targetUrl).href;
            }

            for (const p of patterns) {
              if (p.regex.test(href)) {
                const fullUrl = href.startsWith('http') ? href : new URL(href, targetUrl).href;
                if (this.artist.sameAs[p.key] !== undefined) {
                  this.artist.sameAs[p.key] = fullUrl;
                  linkCount++;
                  this.addDiscoveryLog(`Linked ${p.platform}: ${fullUrl}`, 'info');
                }
                break;
              }
            }
          });

          this.discovery.found.linksCount = linkCount;

          // Check if the home page itself has embedded Schema.org MusicEvent or events
          const homeEvents = this.extractEventsFromHtmlString(htmlText, targetUrl);
          if (homeEvents.length > 0) {
            this.artist.events = homeEvents;
            this.discovery.found.eventsCount = homeEvents.length;
            this.addDiscoveryLog(`Extracted ${homeEvents.length} live tour events directly from homepage markup`, 'success');
          }
        }

        // Step 2: Query MusicBrainz Open API
        this.discovery.progress = 55;
        this.discovery.step = 'Searching MusicBrainz & Wikidata Knowledge Graphs...';

        const queryName = this.artist.name || (new URL(targetUrl).hostname.replace(/^www\./, '').split('.')[0]);
        if (queryName) {
          try {
            const mbUrl = `https://musicbrainz.org/ws/2/artist/?query=artist:${encodeURIComponent(queryName)}&fmt=json`;
            const mbRes = await fetch(mbUrl, { headers: { 'Accept': 'application/json' } });
            
            if (mbRes.ok) {
              const mbData = await mbRes.json();
              if (mbData.artists && mbData.artists.length > 0) {
                const topArtist = mbData.artists[0];
                this.artist.sameAs.musicBrainz = `https://musicbrainz.org/artist/${topArtist.id}`;
                if (!this.artist.name) this.artist.name = topArtist.name;
                this.discovery.found.mbidMatched = true;
                this.addDiscoveryLog(`Matched MusicBrainz MBID: ${topArtist.id} (${topArtist.name})`, 'success');

                if (topArtist.country || (topArtist.area && topArtist.area.name)) {
                  this.artist.foundingLocation.country = topArtist.country || '';
                  this.artist.foundingLocation.city = topArtist.area ? topArtist.area.name : '';
                  this.discovery.found.location = `${this.artist.foundingLocation.city} ${this.artist.foundingLocation.country}`.trim();
                  this.addDiscoveryLog(`Founding origin: ${this.discovery.found.location}`, 'info');
                }

                if (topArtist['life-span'] && topArtist['life-span'].begin) {
                  this.artist.foundingDate = topArtist['life-span'].begin;
                  this.addDiscoveryLog(`Founding date: ${this.artist.foundingDate}`, 'info');
                }

                // Fetch Releases from MusicBrainz
                this.discovery.progress = 70;
                this.discovery.step = 'Retrieving official discography from MusicBrainz...';

                const relUrl = `https://musicbrainz.org/ws/2/release-group?artist=${topArtist.id}&fmt=json`;
                const relRes = await fetch(relUrl);
                if (relRes.ok) {
                  const relData = await relRes.json();
                  if (relData['release-groups'] && relData['release-groups'].length > 0) {
                    const mbReleases = relData['release-groups'].slice(0, 8).map((rg, i) => {
                      let rType = 'AlbumRelease';
                      const pType = rg['primary-type'] || '';
                      if (pType === 'Single') rType = 'SingleRelease';
                      else if (pType === 'EP') rType = 'EPRelease';
                      else if (pType === 'Broadcast') rType = 'BroadcastRelease';

                      return {
                        id: rg.id || `album-${i + 1}`,
                        title: rg.title || '',
                        releaseType: rType,
                        releaseDate: rg['first-release-date'] || '',
                        label: '',
                        catalogNumber: '',
                        barcode: '',
                        image: '',
                        url: '',
                        mbid: rg.id,
                        streamingLinks: { spotify: '', bandcamp: '', appleMusic: '', youtubeMusic: '' },
                        tracks: [{ position: 1, title: '', duration: '03:30', isrc: '', composer: '', lyricsUrl: '', previewUrl: '' }]
                      };
                    });

                    this.artist.albums = mbReleases;
                    this.discovery.found.releasesCount = mbReleases.length;
                    this.addDiscoveryLog(`Imported ${mbReleases.length} official releases from MusicBrainz`, 'success');
                  }
                }
              }
            }
          } catch (mbErr) {
            console.warn('MusicBrainz discovery lookup notice:', mbErr);
          }
        }

        // Step 3: Deep Tour Dates Extraction (Bandsintown, Songkick & /tour subpage)
        this.discovery.progress = 85;
        this.discovery.step = 'Scanning Bandsintown, Songkick & live tour schedules...';

        const extractedGigs = [];

        // 3a. Check dedicated Tour Subpage on website
        if (discoveredTourSubpageUrl) {
          try {
            this.addDiscoveryLog(`Fetching tour subpage: ${discoveredTourSubpageUrl}`, 'info');
            let tourHtml = '';
            const pRes = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(discoveredTourSubpageUrl)}`);
            if (pRes.ok) tourHtml = await pRes.text();
            
            if (tourHtml) {
              const subEvents = this.extractEventsFromHtmlString(tourHtml, discoveredTourSubpageUrl);
              if (subEvents.length > 0) {
                extractedGigs.push(...subEvents);
                this.addDiscoveryLog(`Parsed ${subEvents.length} shows from ${discoveredTourSubpageUrl}`, 'success');
              }
            }
          } catch (e) {
            console.warn('Tour subpage scrape notice:', e);
          }
        }

        // 3b. Query Bandsintown API / Widget
        const bitQuery = this.artist.name || queryName;
        if (bitQuery) {
          try {
            const bitUrl = `https://rest.bandsintown.com/artists/${encodeURIComponent(bitQuery)}/events?app_id=bandsintown`;
            let bitData = null;

            try {
              const bRes = await fetch(bitUrl);
              if (bRes.ok) bitData = await bRes.json();
            } catch (be) {
              const pRes = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(bitUrl)}`);
              if (pRes.ok) bitData = await pRes.json();
            }

            if (Array.isArray(bitData) && bitData.length > 0) {
              const bitEvents = bitData.slice(0, 15).map(evt => {
                const v = evt.venue || {};
                const tz = this.resolveVenueTimezone(v.city, v.region, v.country);
                const startIso = this.formatVenueDateTime(evt.datetime, null, tz);
                const endIso = this.computeEndDateTime(startIso, tz);

                return {
                  name: `${this.artist.name || 'Concert'} at ${v.name || 'Venue'}`,
                  startDate: startIso,
                  endDate: endIso,
                  timezone: tz,
                  status: (evt.status === 'cancelled') ? 'EventCancelled' : ((evt.status === 'postponed') ? 'EventPostponed' : 'EventScheduled'),
                  attendanceMode: 'OfflineEventAttendanceMode',
                  venueName: v.name || '',
                  streetAddress: v.street_address || '',
                  city: v.city || '',
                  region: v.region || '',
                  postalCode: v.postal_code || '',
                  country: v.country || 'US',
                  ticketUrl: (evt.offers && evt.offers[0] && evt.offers[0].url) || (evt.url || ''),
                  price: '',
                  currency: (v.country === 'United Kingdom' || v.country === 'GB') ? 'GBP' : (['DE','FR','ES','IT','NL','BE','AT','IE'].includes(v.country) ? 'EUR' : 'USD'),
                  availability: (evt.offers && evt.offers[0] && evt.offers[0].status === 'available') ? 'InStock' : 'SoldOut'
                };
              });

              extractedGigs.push(...bitEvents);
              this.addDiscoveryLog(`Imported ${bitEvents.length} gigs from Bandsintown with venue-localized timezones`, 'success');
            }
          } catch (bitErr) {
            console.warn('Bandsintown lookup notice:', bitErr);
          }
        }

        if (extractedGigs.length > 0) {
          // Deduplicate by name and startDate
          const seen = new Set();
          const uniqueEvents = [];
          for (const g of extractedGigs) {
            const key = `${g.venueName}-${g.startDate.split('T')[0]}`;
            if (!seen.has(key)) {
              seen.add(key);
              uniqueEvents.push(g);
            }
          }
          this.artist.events = uniqueEvents;
          this.discovery.found.eventsCount = uniqueEvents.length;
        }

        this.discovery.progress = 100;
        this.discovery.step = 'Auto-discovery complete!';
        this.addDiscoveryLog('All discovered data populated with localized timezones. Review and refine your profile below!', 'success');
        this.showToast('Profile populated with your real data & tour dates!', 'success');

      } catch (err) {
        console.error('Auto-discovery error:', err);
        this.addDiscoveryLog(`Discovery notice: ${err.message}`, 'warning');
        this.showToast(`Discovery completed with notices: ${err.message}`, 'info');
      } finally {
        this.discovery.running = false;
      }
    },

    async fetchWebpageHtml(targetUrl) {
      if (!targetUrl) return '';
      try {
        const directRes = await fetch(targetUrl, { mode: 'cors' });
        if (directRes.ok) return await directRes.text();
      } catch (e) {}

      try {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
        const pRes = await fetch(proxyUrl);
        if (pRes.ok) return await pRes.text();
      } catch (e) {}

      try {
        const corsIo = `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`;
        const cRes = await fetch(corsIo);
        if (cRes.ok) return await cRes.text();
      } catch (e) {}

      return '';
    },

    getMonthNumber(monStr) {
      const m = monStr.toLowerCase().slice(0, 3);
      const map = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
      return map[m] || '01';
    },

    // Helper: Parse events from raw HTML (JSON-LD, microdata, widget embeds, or DOM tables/cards)
    extractEventsFromHtmlString(html, pageUrl) {
      const events = [];
      const now = new Date();

      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // 1. Check embedded JSON-LD scripts
        const scripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
        for (const s of scripts) {
          try {
            const data = JSON.parse(s.innerText.trim());
            const items = Array.isArray(data) ? data : (data['@graph'] || [data]);
            for (const item of items) {
              if (item['@type'] === 'MusicEvent' || item['@type'] === 'Event') {
                const loc = item.location || {};
                const addr = loc.address || {};
                const offer = item.offers || {};
                const tz = this.resolveVenueTimezone(addr.addressLocality || loc.name, addr.addressRegion, addr.addressCountry);
                const startIso = this.formatVenueDateTime(item.startDate, null, tz);
                const endIso = item.endDate ? this.formatVenueDateTime(item.endDate, null, tz) : this.computeEndDateTime(startIso, tz);

                events.push({
                  name: item.name || `${this.artist.name || 'Concert'} at ${loc.name || 'Venue'}`,
                  startDate: startIso,
                  endDate: endIso,
                  timezone: tz,
                  status: (item.eventStatus || '').replace('https://schema.org/', '') || 'EventScheduled',
                  attendanceMode: (item.eventAttendanceMode || '').replace('https://schema.org/', '') || 'OfflineEventAttendanceMode',
                  venueName: loc.name || '',
                  streetAddress: addr.streetAddress || '',
                  city: addr.addressLocality || '',
                  region: addr.addressRegion || '',
                  postalCode: addr.postalCode || '',
                  country: addr.addressCountry || 'US',
                  ticketUrl: offer.url || item.url || '',
                  price: offer.price || '',
                  currency: offer.priceCurrency || 'USD',
                  availability: (offer.availability || '').replace('https://schema.org/', '') || 'InStock'
                });
              }
            }
          } catch (e) {}
        }

        // 2. Generic HTML Tour Table / Card / List Parser
        const candidateRows = doc.querySelectorAll('.gig-row, .tour-row, .event-item, tr, .show-item, .tour-item, article, li, .event, .show');
        const monthNames = "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";

        candidateRows.forEach(row => {
          const text = (row.textContent || '').trim();
          if (!text || text.length < 5 || text.length > 350) return;

          let parsedDateStr = null;
          let parsedTimeStr = '20:00';

          // Try matching ISO format YYYY-MM-DD
          const isoMatch = text.match(/\b(202[4-9]-\d{2}-\d{2})\b/);
          if (isoMatch) {
            parsedDateStr = isoMatch[1];
          } else {
            // Try matching "Oct 18, 2026" or "18 Oct 2026"
            const mMatch1 = text.match(new RegExp(`\\b(${monthNames})\\s+(\\d{1,2}),?\\s+(202[4-9])\\b`, 'i'));
            const mMatch2 = text.match(new RegExp(`\\b(\\d{1,2})\\s+(${monthNames})\\s+(202[4-9])\\b`, 'i'));

            if (mMatch1) {
              const monthNum = this.getMonthNumber(mMatch1[1]);
              const day = String(mMatch1[2]).padStart(2, '0');
              const year = mMatch1[3];
              parsedDateStr = `${year}-${monthNum}-${day}`;
            } else if (mMatch2) {
              const day = String(mMatch2[1]).padStart(2, '0');
              const monthNum = this.getMonthNumber(mMatch2[2]);
              const year = mMatch2[3];
              parsedDateStr = `${year}-${monthNum}-${day}`;
            }
          }

          if (!parsedDateStr) return;

          // Check if time is specified (e.g. 8:00 PM, 20:00, 7:30pm)
          const timeMatch = text.match(/\b(\d{1,2}):(\d{2})\s*(am|pm)?\b/i);
          if (timeMatch) {
            let h = parseInt(timeMatch[1], 10);
            const m = timeMatch[2];
            const ampm = (timeMatch[3] || '').toLowerCase();
            if (ampm === 'pm' && h < 12) h += 12;
            if (ampm === 'am' && h === 12) h = 0;
            parsedTimeStr = `${String(h).padStart(2, '0')}:${m}`;
          }

          // Extract venue and city candidates
          let venue = row.querySelector('.gig-venue, .venue, .location, .place, strong, b')?.textContent?.trim() || '';
          let city = row.querySelector('.gig-city, .city, .town')?.textContent?.trim() || '';

          if (!venue) {
            const cleanParts = text.replace(/Tickets|Buy Tickets|Sold Out|Passed|RSVP/gi, '').split(/[-–|•,\n\t]/).map(s => s.trim()).filter(s => s && s.length > 2);
            if (cleanParts.length >= 2) {
              venue = cleanParts[1];
              if (cleanParts.length >= 3) city = cleanParts[2];
            } else {
              venue = cleanParts[0] || 'Concert Venue';
            }
          }

          // Extract ticket link if available
          const ticketAnchor = row.querySelector('a[href*="ticket"], a[href*="axs"], a[href*="ticketmaster"], a[href*="dice"], a[href*="eventbrite"], a[href*="eventim"], a[href*="seetickets"], a.btn-tickets');
          let ticketUrl = '';
          if (ticketAnchor) {
            const rawHref = ticketAnchor.getAttribute('href');
            ticketUrl = rawHref.startsWith('http') ? rawHref : new URL(rawHref, pageUrl).href;
          }

          const tz = this.resolveVenueTimezone(city, '', '');
          const startIso = this.formatVenueDateTime(parsedDateStr, parsedTimeStr, tz);
          const endIso = this.computeEndDateTime(startIso, tz);

          events.push({
            name: `${this.artist.name || 'Concert'} at ${venue}`,
            startDate: startIso,
            endDate: endIso,
            timezone: tz,
            status: text.toLowerCase().includes('cancelled') ? 'EventCancelled' : (text.toLowerCase().includes('postponed') ? 'EventPostponed' : 'EventScheduled'),
            attendanceMode: 'OfflineEventAttendanceMode',
            venueName: venue,
            streetAddress: '',
            city: city,
            region: '',
            postalCode: '',
            country: 'US',
            ticketUrl: ticketUrl,
            price: '',
            currency: 'USD',
            availability: text.toLowerCase().includes('sold out') ? 'SoldOut' : 'InStock'
          });
        });

      } catch (err) {
        console.warn('HTML event extraction notice:', err);
      }
      return events;
    },

    // Dedicated Interactive Tour Dates Importer (Tab 3)
    async fetchTourDates() {
      const query = (this.tourImporter.query || this.artist.name || this.heroUrlInput || '').trim();
      if (!query) {
        this.showToast('Please enter an artist name, website URL, or Bandsintown/Songkick profile URL.', 'warning');
        return;
      }

      this.tourImporter.loading = true;
      this.tourImporter.error = null;
      this.tourImporter.extractedEvents = [];
      this.tourImporter.sourceDetected = '';

      try {
        const eventsFound = [];

        // Is it a direct URL?
        if (/^https?:\/\//i.test(query)) {
          this.tourImporter.sourceDetected = 'Webpage Tour Scanner';
          const html = await this.fetchWebpageHtml(query);
          if (html) {
            const parsed = this.extractEventsFromHtmlString(html, query);
            eventsFound.push(...parsed);
          }
        }

        // Also query Bandsintown REST API
        const cleanArtistName = query.replace(/^https?:\/\/[^\/]+\/(?:a\/)?/i, '').replace(/\.bandcamp\.com.*$/i, '').replace(/[-_]/g, ' ');
        if (cleanArtistName) {
          try {
            const bitUrl = `https://rest.bandsintown.com/artists/${encodeURIComponent(cleanArtistName)}/events?app_id=bandsintown`;
            let bitData = null;
            try {
              const bRes = await fetch(bitUrl);
              if (bRes.ok) bitData = await bRes.json();
            } catch (be) {
              const pRes = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(bitUrl)}`);
              if (pRes.ok) bitData = await pRes.json();
            }

            if (Array.isArray(bitData) && bitData.length > 0) {
              this.tourImporter.sourceDetected = 'Bandsintown & Web';
              const bitEvents = bitData.map(evt => {
                const v = evt.venue || {};
                const tz = this.resolveVenueTimezone(v.city, v.region, v.country);
                const startIso = this.formatVenueDateTime(evt.datetime, null, tz);
                const endIso = this.computeEndDateTime(startIso, tz);

                return {
                  name: `${this.artist.name || cleanArtistName} at ${v.name || 'Venue'}`,
                  startDate: startIso,
                  endDate: endIso,
                  timezone: tz,
                  status: (evt.status === 'cancelled') ? 'EventCancelled' : 'EventScheduled',
                  attendanceMode: 'OfflineEventAttendanceMode',
                  venueName: v.name || '',
                  streetAddress: v.street_address || '',
                  city: v.city || '',
                  region: v.region || '',
                  postalCode: v.postal_code || '',
                  country: v.country || 'US',
                  ticketUrl: (evt.offers && evt.offers[0] && evt.offers[0].url) || (evt.url || ''),
                  price: '',
                  currency: (v.country === 'United Kingdom' || v.country === 'GB') ? 'GBP' : 'USD',
                  availability: (evt.offers && evt.offers[0] && evt.offers[0].status === 'available') ? 'InStock' : 'SoldOut'
                };
              });
              eventsFound.push(...bitEvents);
            }
          } catch (e) {}
        }

        // Filter out past gigs & deduplicate
        const now = new Date();
        const seen = new Set();
        const unique = [];
        for (const ev of eventsFound) {
          if (this.isEventInPast(ev, now)) continue;
          const key = `${ev.venueName}-${ev.startDate.split('T')[0]}`;
          if (!seen.has(key)) {
            seen.add(key);
            unique.push(ev);
          }
        }

        this.tourImporter.extractedEvents = unique;

        if (unique.length > 0) {
          this.showToast(`Found ${unique.length} upcoming gigs with localized venue timezones!`, 'success');
        } else {
          this.showToast('No upcoming tour dates found for this artist or URL.', 'info');
        }
      } catch (err) {
        console.error('Tour fetch error:', err);
        this.tourImporter.error = err.message;
        this.showToast(`Tour fetch error: ${err.message}`, 'warning');
      } finally {
        this.tourImporter.loading = false;
      }
    },

    applyExtractedTourDates(mode = 'append') {
      if (this.tourImporter.extractedEvents.length === 0) return;

      if (mode === 'replace') {
        this.artist.events = JSON.parse(JSON.stringify(this.tourImporter.extractedEvents));
        this.showToast(`Replaced events with ${this.tourImporter.extractedEvents.length} extracted gigs!`, 'success');
      } else {
        if (!this.artist.events) this.artist.events = [];
        this.artist.events.push(...JSON.parse(JSON.stringify(this.tourImporter.extractedEvents)));
        this.showToast(`Appended ${this.tourImporter.extractedEvents.length} gigs to your tour list!`, 'success');
      }

      this.tourImporter.extractedEvents = [];
    },

    isEventInPast(eventObj, referenceDate = new Date()) {
      if (!eventObj || !eventObj.startDate) return false;
      try {
        const eventTime = new Date(eventObj.endDate || eventObj.startDate).getTime();
        if (isNaN(eventTime)) {
          const eventDateStr = eventObj.startDate.split('T')[0];
          const todayStr = referenceDate.toISOString().split('T')[0];
          return eventDateStr < todayStr;
        }
        return eventTime < referenceDate.getTime();
      } catch (e) {
        return false;
      }
    },

    removePastEvents() {
      if (!this.artist.events || this.artist.events.length === 0) {
        this.showToast('No tour events to clean.', 'info');
        return;
      }

      const initialCount = this.artist.events.length;
      const now = new Date();
      this.artist.events = this.artist.events.filter(e => !this.isEventInPast(e, now));
      const removedCount = initialCount - this.artist.events.length;

      if (removedCount > 0) {
        this.showToast(`Cleaned ${removedCount} past gig(s). ${this.artist.events.length} upcoming show(s) remaining.`, 'success');
      } else {
        this.showToast('All currently listed gigs are upcoming (none in the past).', 'info');
      }
    },

    async refreshLiveTourSchedule() {
      const artistName = this.artist.name || this.heroUrlInput;
      const bitLink = this.artist.sameAs.bandsintown;
      const songkickLink = this.artist.sameAs.songkick;
      const siteUrl = this.artist.url ? this.cleanUrl(this.artist.url) : null;

      const queryTarget = bitLink || songkickLink || siteUrl || artistName;
      if (!queryTarget) {
        this.showToast('Please enter a website URL, band name, or Bandsintown/Songkick link.', 'warning');
        return;
      }

      this.tourImporter.loading = true;
      this.showToast('Scanning your website (/tour, /live, /gigs) and online schedules...', 'info');

      try {
        const now = new Date();
        const extractedGigs = [];
        const checkedUrls = new Set();

        // 1. Proactive Crawl of the Musician's Website (/tour, /live, /gigs, /events, /shows, etc.)
        if (siteUrl) {
          const candidateTourUrls = [
            siteUrl,
            `${siteUrl}/tour`,
            `${siteUrl}/tour-dates`,
            `${siteUrl}/shows`,
            `${siteUrl}/live`,
            `${siteUrl}/gigs`,
            `${siteUrl}/events`,
            `${siteUrl}/concerts`,
            `${siteUrl}/schedule`
          ];

          // Fetch homepage first to also discover internal navigation links
          const homeHtml = await this.fetchWebpageHtml(siteUrl);
          checkedUrls.add(siteUrl);

          if (homeHtml) {
            const homeGigs = this.extractEventsFromHtmlString(homeHtml, siteUrl);
            extractedGigs.push(...homeGigs);

            // Find tour page links in navigation
            try {
              const parser = new DOMParser();
              const doc = parser.parseFromString(homeHtml, 'text/html');
              const anchors = Array.from(doc.querySelectorAll('a[href]'));
              anchors.forEach(a => {
                const href = a.getAttribute('href');
                const text = (a.textContent || '').toLowerCase();
                if (!href) return;

                if (/\/(tour|tour-dates|live|gigs|events|shows|concerts|schedule)/i.test(href) || /tour|live|gig|show|concert|dates/i.test(text)) {
                  const fullUrl = href.startsWith('http') ? href : new URL(href, siteUrl).href;
                  if (!candidateTourUrls.includes(fullUrl)) candidateTourUrls.push(fullUrl);
                }
              });
            } catch (e) {}
          }

          // Fetch candidate subpages (up to 3 most relevant)
          for (const tUrl of candidateTourUrls.slice(1, 4)) {
            if (checkedUrls.has(tUrl)) continue;
            checkedUrls.add(tUrl);

            try {
              const subHtml = await this.fetchWebpageHtml(tUrl);
              if (subHtml) {
                const subGigs = this.extractEventsFromHtmlString(subHtml, tUrl);
                if (subGigs.length > 0) {
                  extractedGigs.push(...subGigs);
                }
              }
            } catch (e) {}
          }
        }

        // 2. Fetch from Bandsintown REST API
        const cleanName = bitLink ? bitLink.replace(/^https?:\/\/[^\/]+\/(?:a\/)?/i, '').replace(/[-_]/g, ' ') : (artistName || '').replace(/^https?:\/\/[^\/]+\//i, '');
        if (cleanName) {
          try {
            const bitUrl = `https://rest.bandsintown.com/artists/${encodeURIComponent(cleanName)}/events?app_id=bandsintown`;
            let bitData = null;
            try {
              const bRes = await fetch(bitUrl);
              if (bRes.ok) bitData = await bRes.json();
            } catch (be) {
              const pRes = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(bitUrl)}`);
              if (pRes.ok) bitData = await pRes.json();
            }

            if (Array.isArray(bitData) && bitData.length > 0) {
              const bitEvents = bitData.map(evt => {
                const v = evt.venue || {};
                const tz = this.resolveVenueTimezone(v.city, v.region, v.country);
                const startIso = this.formatVenueDateTime(evt.datetime, null, tz);
                const endIso = this.computeEndDateTime(startIso, tz);

                return {
                  name: `${this.artist.name || cleanName} at ${v.name || 'Venue'}`,
                  startDate: startIso,
                  endDate: endIso,
                  timezone: tz,
                  status: (evt.status === 'cancelled') ? 'EventCancelled' : ((evt.status === 'postponed') ? 'EventPostponed' : 'EventScheduled'),
                  attendanceMode: 'OfflineEventAttendanceMode',
                  venueName: v.name || '',
                  streetAddress: v.street_address || '',
                  city: v.city || '',
                  region: v.region || '',
                  postalCode: v.postal_code || '',
                  country: v.country || 'US',
                  ticketUrl: (evt.offers && evt.offers[0] && evt.offers[0].url) || (evt.url || ''),
                  price: '',
                  currency: (v.country === 'United Kingdom' || v.country === 'GB') ? 'GBP' : (['DE','FR','ES','IT','NL','BE','AT','IE'].includes(v.country) ? 'EUR' : 'USD'),
                  availability: (evt.offers && evt.offers[0] && evt.offers[0].status === 'available') ? 'InStock' : 'SoldOut'
                };
              });
              extractedGigs.push(...bitEvents);
            }
          } catch (e) {
            console.warn('Refresh Bandsintown lookup notice:', e);
          }
        }

        // 3. Filter out past gigs, deduplicate, and localize timezones
        const seen = new Set();
        const freshUpcomingGigs = [];

        for (const gig of extractedGigs) {
          if (this.isEventInPast(gig, now)) continue;
          const key = `${(gig.venueName || '').toLowerCase().trim()}-${gig.startDate.split('T')[0]}`;
          if (!seen.has(key)) {
            seen.add(key);
            freshUpcomingGigs.push(gig);
          }
        }

        if (freshUpcomingGigs.length > 0) {
          this.artist.events = freshUpcomingGigs;
          this.showToast(`Refreshed! Synchronized ${freshUpcomingGigs.length} live upcoming gig(s) from website & platforms. Past gigs cleared.`, 'success');
        } else {
          this.removePastEvents();
          this.showToast('Checked website and platforms: No new upcoming tour dates found. Cleared any past dates.', 'info');
        }
      } catch (err) {
        console.error('Refresh tour schedule error:', err);
        this.showToast(`Refresh error: ${err.message}`, 'warning');
      } finally {
        this.tourImporter.loading = false;
      }
    },

    addDiscoveryLog(message, type = 'info') {
      this.discovery.logs.push({ message, type, time: new Date().toLocaleTimeString() });
    },

    cleanUrl(url) {
      if (!url) return '';
      return url.trim().replace(/\/+$/, '');
    },

    slugify(text) {
      if (!text) return 'item';
      return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
    },

    formatDurationToISO(val) {
      if (!val) return undefined;
      const str = val.toString().trim();
      
      if (/^PT(\d+H)?(\d+M)?(\d+S)?$/i.test(str)) {
        return str.toUpperCase();
      }

      if (/^\d{1,2}:\d{2}$/.test(str)) {
        const [m, s] = str.split(':').map(Number);
        return `PT${m}M${s}S`;
      }

      if (/^\d{1,2}:\d{2}:\d{2}$/.test(str)) {
        const [h, m, s] = str.split(':').map(Number);
        return `PT${h}H${m}M${s}S`;
      }

      if (/^\d+$/.test(str)) {
        const totalSeconds = parseInt(str, 10);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `PT${mins}M${secs}S`;
      }

      return str;
    },

    formatISOToDuration(iso) {
      if (!iso) return '03:30';
      if (/^\d{1,2}:\d{2}$/.test(iso)) return iso;
      
      const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i);
      if (!match) return iso;

      const hours = parseInt(match[1] || '0', 10);
      const minutes = parseInt(match[2] || '0', 10);
      const seconds = parseInt(match[3] || '0', 10);

      const sStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
      if (hours > 0) {
        const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
        return `${hours}:${mStr}:${sStr}`;
      }
      const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
      return `${mStr}:${sStr}`;
    },

    buildAlbumNode(alb, baseUrl, artistId, index) {
      const albumSlug = this.slugify(alb.title || `album-${index + 1}`);
      const albumUrl = alb.url ? this.cleanUrl(alb.url) : `${baseUrl}/albums/${albumSlug}`;
      const albumId = `${albumUrl}#album`;

      const node = {
        "@type": "MusicAlbum",
        "@id": albumId,
        "name": alb.title,
        "albumReleaseType": `https://schema.org/${alb.releaseType || 'AlbumRelease'}`,
        "url": albumUrl,
        "byArtist": {
          "@type": "MusicGroup",
          "@id": artistId,
          "name": this.artist.name || "Artist"
        }
      };

      if (alb.releaseDate) node.datePublished = alb.releaseDate;
      if (alb.label) {
        node.recordLabel = {
          "@type": "Organization",
          "name": alb.label
        };
      }
      if (alb.catalogNumber) node.catalogNumber = alb.catalogNumber;
      if (alb.barcode) {
        node.identifier = {
          "@type": "PropertyValue",
          "propertyID": "UPC/EAN",
          "value": alb.barcode
        };
      }
      if (alb.image) node.image = alb.image;

      // Direct Bandcamp Purchase Offer
      const bandcampAlbumUrl = (alb.streamingLinks && alb.streamingLinks.bandcamp) || (alb.url && alb.url.includes('bandcamp.com') ? alb.url : null);
      if (bandcampAlbumUrl && bandcampAlbumUrl.trim()) {
        node.offers = {
          "@type": "Offer",
          "name": "Buy on Bandcamp (Direct Artist Support)",
          "url": bandcampAlbumUrl.trim(),
          "availability": "https://schema.org/InStock",
          "priceCurrency": "USD",
          "seller": {
            "@type": "Organization",
            "name": "Bandcamp",
            "url": "https://bandcamp.com"
          }
        };
      }

      const albumSameAs = [];
      if (alb.mbid) {
        albumSameAs.push(/^[0-9a-f-]{36}$/i.test(alb.mbid.trim()) ? `https://musicbrainz.org/release-group/${alb.mbid.trim()}` : alb.mbid.trim());
      }
      if (alb.streamingLinks) {
        Object.values(alb.streamingLinks).forEach(link => {
          if (link && link.trim()) albumSameAs.push(link.trim());
        });
      }
      if (albumSameAs.length > 0) node.sameAs = albumSameAs;

      if (alb.tracks && alb.tracks.length > 0) {
        const validTracks = alb.tracks.filter(t => t.title && t.title.trim());
        if (validTracks.length > 0) {
          node.numTracks = validTracks.length;
          node.track = validTracks.map((trk, tIdx) => {
            const trackNode = {
              "@type": "MusicRecording",
              "@id": `${albumUrl}#track-${trk.position || tIdx + 1}`,
              "position": trk.position || tIdx + 1,
              "name": trk.title,
              "duration": this.formatDurationToISO(trk.duration) || "PT3M30S",
              "inAlbum": {
                "@id": albumId
              },
              "byArtist": {
                "@id": artistId,
                "name": this.artist.name || "Artist"
              }
            };

            if (trk.isrc) trackNode.isrcCode = trk.isrc.trim();
            if (trk.composer) {
              trackNode.composer = {
                "@type": "Person",
                "name": trk.composer.trim()
              };
            }
            if (trk.previewUrl) {
              trackNode.audio = {
                "@type": "AudioObject",
                "contentUrl": trk.previewUrl.trim()
              };
              if (trk.previewUrl.includes('bandcamp.com/track/')) {
                trackNode.url = trk.previewUrl.trim();
                trackNode.offers = {
                  "@type": "Offer",
                  "name": "Buy Track on Bandcamp",
                  "url": trk.previewUrl.trim(),
                  "availability": "https://schema.org/InStock",
                  "seller": {
                    "@type": "Organization",
                    "name": "Bandcamp",
                    "url": "https://bandcamp.com"
                  }
                };
              }
            }
            if (trk.lyricsUrl) {
              trackNode.lyrics = {
                "@type": "CreativeWork",
                "url": trk.lyricsUrl.trim()
              };
            }

            return trackNode;
          });
        }
      }

      return node;
    },

    detectTicketSellerName(ticketUrl) {
      if (!ticketUrl) return null;
      const u = ticketUrl.toLowerCase();
      if (u.includes('ticketmaster.')) return 'Ticketmaster';
      if (u.includes('axs.com')) return 'AXS';
      if (u.includes('dice.fm')) return 'DICE';
      if (u.includes('eventbrite.')) return 'Eventbrite';
      if (u.includes('seetickets.')) return 'See Tickets';
      if (u.includes('eventim.')) return 'Eventim';
      if (u.includes('bandsintown.com')) return 'Bandsintown';
      if (u.includes('songkick.com')) return 'Songkick';
      if (u.includes('skiddle.com')) return 'Skiddle';
      if (u.includes('residentadvisor.net') || u.includes('ra.co')) return 'Resident Advisor';
      if (u.includes('etix.com')) return 'Etix';
      if (u.includes('ticketweb.')) return 'TicketWeb';
      if (u.includes('livenation.')) return 'Live Nation';
      if (u.includes('stubhub.')) return 'StubHub';
      if (u.includes('brownpapertickets.com')) return 'Brown Paper Tickets';
      if (u.includes('universe.com')) return 'Universe';
      return 'Venue Box Office';
    },

    buildEventNode(evt, baseUrl, artistId, index) {
      const eventSlug = this.slugify(evt.name || `event-${index + 1}`);
      const eventId = `${baseUrl}/tour#event-${index + 1}`;

      const node = {
        "@type": "MusicEvent",
        "@id": eventId,
        "name": evt.name,
        "startDate": evt.startDate,
        "eventStatus": `https://schema.org/${evt.status || 'EventScheduled'}`,
        "eventAttendanceMode": `https://schema.org/${evt.attendanceMode || 'OfflineEventAttendanceMode'}`,
        "performer": {
          "@type": "MusicGroup",
          "@id": artistId,
          "name": this.artist.name || "Artist"
        }
      };

      if (evt.endDate) node.endDate = evt.endDate;

      if (evt.venueName || evt.city) {
        node.location = {
          "@type": "Place",
          "name": evt.venueName || "Concert Venue",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": evt.streetAddress || undefined,
            "addressLocality": evt.city || undefined,
            "addressRegion": evt.region || undefined,
            "postalCode": evt.postalCode || undefined,
            "addressCountry": evt.country || undefined
          }
        };
      }

      if (evt.ticketUrl || evt.price) {
        const offerNode = {
          "@type": "Offer",
          "url": evt.ticketUrl || undefined,
          "price": evt.price ? parseFloat(evt.price) : 0,
          "priceCurrency": evt.currency || 'USD',
          "availability": `https://schema.org/${evt.availability || 'InStock'}`,
          "validFrom": evt.startDate ? evt.startDate.split('T')[0] : undefined
        };

        const sellerName = this.detectTicketSellerName(evt.ticketUrl);
        if (sellerName) {
          offerNode.seller = {
            "@type": "Organization",
            "name": sellerName
          };
        }

        node.offers = offerNode;
      }

      return node;
    },

    async fetchBandcampDiscography(customUrl) {
      let target = (customUrl || this.bandcampImporter.url || this.artist.sameAs.bandcamp || this.artist.url || '').trim();
      if (!target) {
        this.showToast('Please enter your Bandcamp artist URL (e.g. https://yourband.bandcamp.com)', 'warning');
        return;
      }

      if (!/^https?:\/\//i.test(target)) {
        target = 'https://' + target;
      }

      this.bandcampImporter.loading = true;
      this.bandcampImporter.error = null;
      this.showToast('Fetching discography, tracklists & artwork from Bandcamp...', 'info');

      try {
        const uObj = new URL(target);
        const baseUrl = `${uObj.protocol}//${uObj.host}`;
        const musicUrl = `${baseUrl}/music`;

        this.artist.sameAs.bandcamp = baseUrl;

        let rootHtml = await this.fetchWebpageHtml(musicUrl);
        if (!rootHtml) {
          rootHtml = await this.fetchWebpageHtml(baseUrl);
        }

        if (!rootHtml) throw new Error('Could not fetch content from Bandcamp URL. Please check the URL or connectivity.');

        const parser = new DOMParser();
        const doc = parser.parseFromString(rootHtml, 'text/html');

        const artistHeader = doc.querySelector('#band-name-location .title, #band-name-location, .band-name')?.textContent?.trim();
        if (artistHeader && !this.artist.name) {
          this.artist.name = artistHeader;
        }

        const releaseLinks = [];
        const gridAnchors = Array.from(doc.querySelectorAll('ol#music-grid a[href*="/album/"], ol#music-grid a[href*="/track/"], .ip-html5-content a[href*="/album/"], .ip-html5-content a[href*="/track/"], a[href*="/album/"], a[href*="/track/"]'));

        const seenHrefs = new Set();
        gridAnchors.forEach(a => {
          const href = a.getAttribute('href');
          if (!href) return;
          const fullHref = href.startsWith('http') ? href : new URL(href, baseUrl).href;
          if (!seenHrefs.has(fullHref) && (fullHref.includes('/album/') || fullHref.includes('/track/'))) {
            seenHrefs.add(fullHref);
            releaseLinks.push(fullHref);
          }
        });

        if (releaseLinks.length === 0 && (target.includes('/album/') || target.includes('/track/'))) {
          releaseLinks.push(target);
        }

        const parsedAlbums = [];

        for (const relUrl of releaseLinks.slice(0, 10)) {
          try {
            const relHtml = await this.fetchWebpageHtml(relUrl);
            if (!relHtml) continue;

            const relDoc = parser.parseFromString(relHtml, 'text/html');
            let albumParsed = null;

            const jsonScripts = Array.from(relDoc.querySelectorAll('script[type="application/ld+json"]'));
            for (const s of jsonScripts) {
              try {
                const jData = JSON.parse(s.innerText.trim());
                if (jData['@type'] === 'MusicAlbum' || jData['@type'] === 'MusicRecording') {
                  const tracks = [];
                  const trackList = (jData.track && jData.track.itemListElement) || (Array.isArray(jData.track) ? jData.track : []);
                  
                  trackList.forEach((tWrap, idx) => {
                    const item = tWrap.item || tWrap;
                    if (!item.name) return;

                    let duration = '03:30';
                    if (item.duration) {
                      const match = item.duration.match(/P(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i) || item.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i);
                      if (match) {
                        const m = parseInt(match[2] || '0', 10);
                        const s = parseInt(match[3] || '0', 10);
                        duration = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
                      }
                    }

                    tracks.push({
                      position: tWrap.position || idx + 1,
                      title: item.name,
                      duration: duration,
                      isrc: '',
                      composer: '',
                      lyricsUrl: '',
                      previewUrl: item.url || ''
                    });
                  });

                  let relDate = '';
                  if (jData.datePublished) {
                    const d = new Date(jData.datePublished);
                    if (!isNaN(d.getTime())) relDate = d.toISOString().split('T')[0];
                  }

                  albumParsed = {
                    id: `bc-${Date.now()}-${parsedAlbums.length}`,
                    title: jData.name || 'Bandcamp Release',
                    releaseType: tracks.length <= 2 ? 'SingleRelease' : (tracks.length <= 6 ? 'EPRelease' : 'AlbumRelease'),
                    releaseDate: relDate,
                    label: '',
                    catalogNumber: '',
                    barcode: '',
                    image: jData.image || '',
                    url: relUrl,
                    mbid: '',
                    streamingLinks: {
                      spotify: '',
                      bandcamp: relUrl,
                      appleMusic: '',
                      youtubeMusic: ''
                    },
                    tracks: tracks.length > 0 ? tracks : [{ position: 1, title: jData.name, duration: '03:30', isrc: '', composer: '', lyricsUrl: '', previewUrl: relUrl }]
                  };
                  break;
                }
              } catch (je) {}
            }

            if (!albumParsed) {
              const albumTitle = relDoc.querySelector('#name-section .trackTitle, h2.trackTitle')?.textContent?.trim();
              const coverImg = relDoc.querySelector('#tralbumArt a.popupImage img, #tralbumArt img')?.getAttribute('src');
              const domTracks = [];

              const trackRows = Array.from(relDoc.querySelectorAll('table.track_list tr.track_row_view'));
              trackRows.forEach((tr, tIdx) => {
                const trTitle = tr.querySelector('.title-col .track-title')?.textContent?.trim();
                const trDur = tr.querySelector('.title-col .time')?.textContent?.trim() || '03:30';
                if (trTitle) {
                  domTracks.push({
                    position: tIdx + 1,
                    title: trTitle,
                    duration: trDur,
                    isrc: '',
                    composer: '',
                    lyricsUrl: '',
                    previewUrl: ''
                  });
                }
              });

              if (albumTitle) {
                albumParsed = {
                  id: `bc-${Date.now()}-${parsedAlbums.length}`,
                  title: albumTitle,
                  releaseType: domTracks.length <= 2 ? 'SingleRelease' : (domTracks.length <= 6 ? 'EPRelease' : 'AlbumRelease'),
                  releaseDate: new Date().toISOString().split('T')[0],
                  label: '',
                  catalogNumber: '',
                  barcode: '',
                  image: coverImg || '',
                  url: relUrl,
                  mbid: '',
                  streamingLinks: { spotify: '', bandcamp: relUrl, appleMusic: '', youtubeMusic: '' },
                  tracks: domTracks.length > 0 ? domTracks : [{ position: 1, title: albumTitle, duration: '03:30', isrc: '', composer: '', lyricsUrl: '', previewUrl: relUrl }]
                };
              }
            }

            if (albumParsed) {
              parsedAlbums.push(albumParsed);
            }
          } catch (relErr) {
            console.warn('Bandcamp release scrape error:', relUrl, relErr);
          }
        }

        if (parsedAlbums.length > 0) {
          if (this.artist.albums.length === 0 || (this.artist.albums.length === 1 && !this.artist.albums[0].title)) {
            this.artist.albums = parsedAlbums;
          } else {
            const seenTitles = new Set(this.artist.albums.map(a => (a.title || '').toLowerCase().trim()));
            for (const pa of parsedAlbums) {
              if (!seenTitles.has((pa.title || '').toLowerCase().trim())) {
                this.artist.albums.push(pa);
                seenTitles.add((pa.title || '').toLowerCase().trim());
              }
            }
          }

          let totalTracks = 0;
          parsedAlbums.forEach(a => totalTracks += (a.tracks ? a.tracks.length : 0));

          this.bandcampImporter.importedCount = parsedAlbums.length;
          this.showToast(`Imported ${parsedAlbums.length} releases and ${totalTracks} tracks from Bandcamp with direct purchase links!`, 'success');
        } else {
          this.showToast('Could not extract releases from Bandcamp page. Please ensure the Bandcamp URL is correct and public.', 'warning');
        }
      } catch (err) {
        console.error('Bandcamp fetch error:', err);
        this.bandcampImporter.error = err.message;
        this.showToast(`Bandcamp import notice: ${err.message}`, 'warning');
      } finally {
        this.bandcampImporter.loading = false;
      }
    },

    buildReviewNode(rev, artistId) {
      const node = {
        "@type": "Review",
        "itemReviewed": {
          "@type": "MusicGroup",
          "@id": artistId,
          "name": this.artist.name || "Artist"
        }
      };

      if (rev.headline) node.name = rev.headline;
      if (rev.snippet) node.reviewBody = rev.snippet;
      if (rev.url) {
        node.url = rev.url;
        node.sameAs = rev.url;
      }

      if (rev.author) {
        node.author = {
          "@type": "Person",
          "name": rev.author
        };
      }

      if (rev.source) {
        node.publisher = {
          "@type": "Organization",
          "name": rev.source
        };
      }

      if (rev.rating !== undefined && rev.rating !== null && rev.rating !== '') {
        node.reviewRating = {
          "@type": "Rating",
          "ratingValue": parseFloat(rev.rating),
          "bestRating": parseFloat(rev.bestRating || 5),
          "worstRating": 1
        };
      }

      return node;
    },

    syntaxHighlightJson(jsonStr) {
      if (!jsonStr) return '';
      
      let safe = jsonStr
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      safe = safe.replace(/(&lt;script[^&]*&gt;)/g, '<span style="color: #64748b;">$1</span>');
      safe = safe.replace(/(&lt;\/script&gt;)/g, '<span style="color: #64748b;">$1</span>');

      return safe.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        (match) => {
          let cls = 'json-number';
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              if (match.includes('@type')) return '<span class="json-type">' + match + '</span>';
              if (match.includes('@context')) return '<span class="json-context">' + match + '</span>';
              if (match.includes('@id')) return '<span class="json-id">' + match + '</span>';
              cls = 'json-key';
            } else {
              cls = 'json-string';
            }
          } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
          } else if (/null/.test(match)) {
            cls = 'json-null';
          }
          return `<span class="${cls}">${match}</span>`;
        }
      );
    },

    addGenre(genreName) {
      const g = (genreName || this.artist.genreInput || '').trim();
      if (g && !this.artist.genres.includes(g)) {
        this.artist.genres.push(g);
      }
      this.artist.genreInput = '';
    },

    removeGenre(index) {
      this.artist.genres.splice(index, 1);
    },

    addAlternateName(name) {
      if (!this.artist.alternateNames) this.artist.alternateNames = [];
      const trimmed = (name || '').trim();
      if (trimmed && !this.artist.alternateNames.includes(trimmed)) {
        this.artist.alternateNames.push(trimmed);
      }
    },

    removeAlternateName(index) {
      this.artist.alternateNames.splice(index, 1);
    },

    addImage() {
      if (!this.artist.images) this.artist.images = [];
      this.artist.images.push('');
    },

    removeImage(index) {
      this.artist.images.splice(index, 1);
    },

    addMember() {
      if (!this.artist.members) this.artist.members = [];
      this.artist.members.push({
        name: '',
        role: '',
        instrument: '',
        url: '',
        wikidata: '',
        mbid: ''
      });
    },

    removeMember(index) {
      this.artist.members.splice(index, 1);
    },

    addAlbum() {
      if (!this.artist.albums) this.artist.albums = [];
      const newIndex = this.artist.albums.length + 1;
      this.artist.albums.push({
        id: `album-${newIndex}`,
        title: '',
        releaseType: 'AlbumRelease',
        releaseDate: new Date().toISOString().split('T')[0],
        label: '',
        catalogNumber: '',
        barcode: '',
        image: '',
        url: '',
        mbid: '',
        streamingLinks: { spotify: '', bandcamp: '', appleMusic: '', youtubeMusic: '' },
        tracks: [
          { position: 1, title: '', duration: '03:30', isrc: '', composer: '', lyricsUrl: '', previewUrl: '' }
        ]
      });
      this.selectedAlbumIndex = this.artist.albums.length - 1;
    },

    removeAlbum(index) {
      this.artist.albums.splice(index, 1);
      if (this.selectedAlbumIndex >= this.artist.albums.length) {
        this.selectedAlbumIndex = Math.max(0, this.artist.albums.length - 1);
      }
    },

    addTrack(albumIndex) {
      const alb = this.artist.albums[albumIndex];
      if (!alb) return;
      if (!alb.tracks) alb.tracks = [];
      const nextPos = alb.tracks.length + 1;
      alb.tracks.push({
        position: nextPos,
        title: '',
        duration: '03:30',
        isrc: '',
        composer: '',
        lyricsUrl: '',
        previewUrl: ''
      });
    },

    removeTrack(albumIndex, trackIndex) {
      const alb = this.artist.albums[albumIndex];
      if (!alb || !alb.tracks) return;
      alb.tracks.splice(trackIndex, 1);
      alb.tracks.forEach((t, i) => t.position = i + 1);
    },

    openBulkTrackModal(albumIndex) {
      this.bulkTargetAlbumIndex = albumIndex;
      this.bulkTracksInput = '';
      this.activeModal = 'bulkTracks';
    },

    applyBulkTracks() {
      const alb = this.artist.albums[this.bulkTargetAlbumIndex];
      if (!alb) return;

      const lines = this.bulkTracksInput.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) return;

      const parsedTracks = [];
      lines.forEach((line, idx) => {
        let duration = '03:30';
        let cleanTitle = line;

        const durMatch = line.match(/(?:[\(\[\s-]|^)(\d{1,2}:\d{2})(?:[\)\]\s]|$)/);
        if (durMatch) {
          duration = durMatch[1];
          cleanTitle = line.replace(durMatch[0], ' ').trim();
        }

        cleanTitle = cleanTitle.replace(/^(\d+[\.\-\s]+)/, '').trim();

        if (cleanTitle) {
          parsedTracks.push({
            position: idx + 1,
            title: cleanTitle,
            duration: duration,
            isrc: '',
            composer: '',
            lyricsUrl: '',
            previewUrl: ''
          });
        }
      });

      if (parsedTracks.length > 0) {
        alb.tracks = parsedTracks;
        this.showToast(`Imported ${parsedTracks.length} tracks into "${alb.title || 'Album'}"`, 'success');
      }

      this.activeModal = null;
    },

    addEvent() {
      if (!this.artist.events) this.artist.events = [];
      const defaultTz = 'America/Los_Angeles';
      const today = new Date().toISOString().split('T')[0];
      const startIso = this.formatVenueDateTime(today, '20:00', defaultTz);
      const endIso = this.computeEndDateTime(startIso, defaultTz);

      this.artist.events.push({
        name: '',
        startDate: startIso,
        endDate: endIso,
        timezone: defaultTz,
        status: 'EventScheduled',
        attendanceMode: 'OfflineEventAttendanceMode',
        venueName: '',
        streetAddress: '',
        city: '',
        region: '',
        postalCode: '',
        country: 'US',
        ticketUrl: '',
        price: '',
        currency: 'USD',
        availability: 'InStock'
      });
    },

    removeEvent(index) {
      this.artist.events.splice(index, 1);
    },

    addReview() {
      if (!this.artist.reviews) this.artist.reviews = [];
      this.artist.reviews.push({
        source: '',
        author: '',
        url: '',
        headline: '',
        snippet: '',
        rating: 5,
        bestRating: 5
      });
    },

    removeReview(index) {
      this.artist.reviews.splice(index, 1);
    },

    showToast(message, type = 'success') {
      const id = Date.now() + Math.random();
      this.toasts.push({ id, message, type });
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== id);
      }, 4000);
    },

    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.activeSchemaScriptTag);
        this.showToast('Schema JSON-LD copied to clipboard!', 'success');
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = this.activeSchemaScriptTag;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.showToast('Schema JSON-LD copied to clipboard!', 'success');
      }
    },

    downloadSchema(fileType = 'jsonld') {
      const filename = `${this.slugify(this.artist.name || 'schema')}-${this.exportMode}.${fileType}`;
      const blob = new Blob([this.activeSchemaJson], { type: 'application/ld+json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      this.showToast(`Downloaded ${filename}`, 'success');
    },

    openGoogleRichResultsTest() {
      const payload = this.activeSchemaScriptTag;
      const testUrl = `https://search.google.com/test/rich-results?code=${encodeURIComponent(payload)}`;
      window.open(testUrl, '_blank', 'noopener,noreferrer');
    },

    openSchemaOrgValidator() {
      const testUrl = `https://validator.schema.org/`;
      this.copyToClipboard();
      this.showToast('Schema copied! Paste into Schema.org Validator window.', 'info');
      window.open(testUrl, '_blank', 'noopener,noreferrer');
    },

    verifyUrl(url) {
      if (!url) return;
      let clean = url.trim();
      if (!/^https?:\/\//i.test(clean)) {
        clean = 'https://' + clean;
      }
      window.open(clean, '_blank', 'noopener,noreferrer');
    },

    async triggerPwaInstall() {
      if (!this.installPromptEvent) {
        this.showToast('App is already installed or your browser does not support installation prompts.', 'info');
        return;
      }
      this.installPromptEvent.prompt();
      const choiceResult = await this.installPromptEvent.userChoice;
      if (choiceResult.outcome === 'accepted') {
        this.showToast('SEO4musicians installed successfully!', 'success');
      }
      this.installPromptEvent = null;
    },

    loadDemoExample() {
      this.artist = JSON.parse(JSON.stringify(SAMPLE_DEMO_BAND));
      this.heroUrlInput = this.artist.url;
      this.showToast('Loaded demo band dataset (The Velvet Meridian).', 'success');
    },

    resetForm() {
      this.artist = getBlankArtistState();
      this.heroUrlInput = '';
      this.discovery.found = null;
      this.discovery.logs = [];
      this.tourImporter.extractedEvents = [];
      this.activeModal = null;
      this.showToast('Form cleared to clean slate.', 'info');
    },

    handleFileUpload(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        this.parseAndApplyJsonLd(text);
      };
      reader.readAsText(file);
      event.target.value = '';
    },

    handlePasteImport() {
      if (!this.rawJsonImportInput.trim()) return;
      this.parseAndApplyJsonLd(this.rawJsonImportInput);
      this.rawJsonImportInput = '';
      this.activeModal = null;
    },

    parseAndApplyJsonLd(rawText) {
      try {
        let cleanText = rawText.trim();
        cleanText = cleanText.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim();

        const data = JSON.parse(cleanText);
        let root = data;

        if (data['@graph'] && Array.isArray(data['@graph'])) {
          root = data['@graph'].find(item => item['@type'] === 'MusicGroup') || data['@graph'][0];
        }

        if (root['@type'] === 'CollectionPage' && root.about) {
          root = root.about;
        }

        if (!root) {
          throw new Error('No valid Schema.org object found in payload.');
        }

        if (root.name) this.artist.name = root.name;
        if (root.legalName) this.artist.legalName = root.legalName;
        if (root.url) {
          this.artist.url = root.url;
          this.heroUrlInput = root.url;
        }
        if (root.description) this.artist.description = root.description;
        if (root.foundingDate) this.artist.foundingDate = root.foundingDate;
        if (root.dissolutionDate) this.artist.dissolutionDate = root.dissolutionDate;
        if (root.logo) this.artist.logoUrl = typeof root.logo === 'string' ? root.logo : root.logo.url || '';

        if (root.alternateName) {
          this.artist.alternateNames = Array.isArray(root.alternateName) ? root.alternateName : [root.alternateName];
        }

        if (root.image) {
          this.artist.images = Array.isArray(root.image) ? root.image : [root.image];
        }

        if (root.genre) {
          this.artist.genres = Array.isArray(root.genre) ? root.genre : [root.genre];
        }

        if (root.foundingLocation) {
          const loc = root.foundingLocation;
          this.artist.foundingLocation.name = loc.name || '';
          if (loc.address) {
            this.artist.foundingLocation.city = loc.address.addressLocality || '';
            this.artist.foundingLocation.region = loc.address.addressRegion || '';
            this.artist.foundingLocation.country = loc.address.addressCountry || 'US';
          }
        }

        if (root.sameAs && Array.isArray(root.sameAs)) {
          root.sameAs.forEach(url => {
            if (typeof url !== 'string') return;
            const u = url.toLowerCase();
            if (u.includes('musicbrainz.org')) this.artist.sameAs.musicBrainz = url;
            else if (u.includes('wikidata.org')) this.artist.sameAs.wikidata = url;
            else if (u.includes('spotify.com')) this.artist.sameAs.spotify = url;
            else if (u.includes('apple.com')) this.artist.sameAs.appleMusic = url;
            else if (u.includes('bandcamp.com')) this.artist.sameAs.bandcamp = url;
            else if (u.includes('youtube.com')) this.artist.sameAs.youtube = url;
            else if (u.includes('soundcloud.com')) this.artist.sameAs.soundcloud = url;
            else if (u.includes('discogs.com')) this.artist.sameAs.discogs = url;
            else if (u.includes('bandsintown.com')) this.artist.sameAs.bandsintown = url;
            else if (u.includes('songkick.com')) this.artist.sameAs.songkick = url;
            else if (u.includes('genius.com')) this.artist.sameAs.genius = url;
            else if (u.includes('musixmatch.com')) this.artist.sameAs.musixmatch = url;
            else if (u.includes('facebook.com')) this.artist.sameAs.facebook = url;
            else if (u.includes('instagram.com')) this.artist.sameAs.instagram = url;
            else if (u.includes('twitter.com') || u.includes('x.com')) this.artist.sameAs.twitter = url;
            else if (u.includes('tiktok.com')) this.artist.sameAs.tiktok = url;
          });
        }

        if (root.member && Array.isArray(root.member)) {
          this.artist.members = root.member.map(m => {
            const occupation = m.hasOccupation ? (m.hasOccupation.name || '') : (m.roleName || '');
            return {
              name: m.name || (m.member && m.member.name) || '',
              role: occupation,
              instrument: (m.hasOccupation && m.hasOccupation.description) ? m.hasOccupation.description.replace(/^Instruments:\s*/i, '') : '',
              url: m.url || (m.member && m.member.url) || '',
              wikidata: '',
              mbid: ''
            };
          });
        }

        const rawAlbums = root.album || (root['@type'] === 'MusicAlbum' ? [root] : []);
        if (Array.isArray(rawAlbums) && rawAlbums.length > 0) {
          this.artist.albums = rawAlbums.map((alb, idx) => {
            const releaseType = (alb.albumReleaseType || '').replace('https://schema.org/', '') || 'AlbumRelease';
            const tracks = [];
            
            if (alb.track && Array.isArray(alb.track)) {
              alb.track.forEach((t, tIdx) => {
                tracks.push({
                  position: t.position || tIdx + 1,
                  title: t.name || '',
                  duration: this.formatISOToDuration(t.duration),
                  isrc: t.isrcCode || '',
                  composer: t.composer ? (t.composer.name || t.composer) : '',
                  lyricsUrl: t.lyrics ? (t.lyrics.url || '') : '',
                  previewUrl: t.audio ? (t.audio.contentUrl || '') : ''
                });
              });
            }

            return {
              id: alb['@id'] || `album-${idx + 1}`,
              title: alb.name || '',
              releaseType: releaseType,
              releaseDate: alb.datePublished || '',
              label: alb.recordLabel ? (alb.recordLabel.name || alb.recordLabel) : '',
              catalogNumber: alb.catalogNumber || '',
              barcode: alb.identifier ? (alb.identifier.value || alb.identifier) : '',
              image: alb.image || '',
              url: alb.url || '',
              mbid: '',
              streamingLinks: { spotify: '', bandcamp: '', appleMusic: '', youtubeMusic: '' },
              tracks: tracks.length > 0 ? tracks : [{ position: 1, title: '', duration: '03:30', isrc: '', composer: '', lyricsUrl: '', previewUrl: '' }]
            };
          });
        }

        if (root.event && Array.isArray(root.event)) {
          this.artist.events = root.event.map(evt => {
            const loc = evt.location || {};
            const addr = loc.address || {};
            const offer = evt.offers || {};
            const tz = this.resolveVenueTimezone(addr.addressLocality || loc.name, addr.addressRegion, addr.addressCountry);
            const startIso = this.formatVenueDateTime(evt.startDate, null, tz);
            const endIso = evt.endDate ? this.formatVenueDateTime(evt.endDate, null, tz) : this.computeEndDateTime(startIso, tz);

            return {
              name: evt.name || '',
              startDate: startIso,
              endDate: endIso,
              timezone: tz,
              status: (evt.eventStatus || '').replace('https://schema.org/', '') || 'EventScheduled',
              attendanceMode: (evt.eventAttendanceMode || '').replace('https://schema.org/', '') || 'OfflineEventAttendanceMode',
              venueName: loc.name || '',
              streetAddress: addr.streetAddress || '',
              city: addr.addressLocality || '',
              region: addr.addressRegion || '',
              postalCode: addr.postalCode || '',
              country: addr.addressCountry || 'US',
              ticketUrl: offer.url || '',
              price: offer.price || '',
              currency: offer.priceCurrency || 'USD',
              availability: (offer.availability || '').replace('https://schema.org/', '') || 'InStock'
            };
          });
        }

        if (root.subjectOf && Array.isArray(root.subjectOf)) {
          this.artist.reviews = root.subjectOf.map(rev => ({
            source: rev.publisher ? (rev.publisher.name || rev.publisher) : '',
            author: rev.author ? (rev.author.name || rev.author) : '',
            url: rev.url || rev.sameAs || '',
            headline: rev.name || '',
            snippet: rev.reviewBody || '',
            rating: rev.reviewRating ? rev.reviewRating.ratingValue : 5,
            bestRating: rev.reviewRating ? rev.reviewRating.bestRating : 5
          }));
        }

        this.showToast('JSON-LD schema imported and mapped to state!', 'success');
      } catch (err) {
        console.error('Import error:', err);
        this.showToast(`Import failed: ${err.message}`, 'warning');
      }
    },

    async searchMusicBrainz() {
      const query = this.crawler.mbQuery || this.artist.name;
      if (!query || !query.trim()) {
        this.showToast('Please enter an artist or band name to search MusicBrainz.', 'warning');
        return;
      }

      this.crawler.mbLoading = true;
      this.crawler.mbError = null;
      this.crawler.mbResults = [];

      try {
        const url = `https://musicbrainz.org/ws/2/artist/?query=artist:${encodeURIComponent(query.trim())}&fmt=json`;
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });

        if (!res.ok) throw new Error(`MusicBrainz API returned HTTP ${res.status}`);

        const data = await res.json();
        if (data.artists && data.artists.length > 0) {
          this.crawler.mbResults = data.artists.slice(0, 8).map(art => ({
            id: art.id,
            name: art.name,
            disambiguation: art.disambiguation || 'No disambiguation comment',
            type: art.type || 'Group/Person',
            country: art.country || (art.area ? art.area.name : 'Unknown'),
            lifespan: art['life-span'] ? `${art['life-span'].begin || ''} to ${art['life-span'].ended ? (art['life-span'].end || 'Ended') : 'Present'}` : 'Unknown'
          }));
          this.showToast(`Found ${this.crawler.mbResults.length} MusicBrainz matches!`, 'success');
        } else {
          this.showToast('No matching artists found in MusicBrainz.', 'info');
        }
      } catch (err) {
        console.error('MusicBrainz API error:', err);
        this.crawler.mbError = err.message;
        this.showToast(`MusicBrainz query error: ${err.message}`, 'warning');
      } finally {
        this.crawler.mbLoading = false;
      }
    },

    async selectMusicBrainzArtist(mbArtist) {
      this.artist.sameAs.musicBrainz = `https://musicbrainz.org/artist/${mbArtist.id}`;
      if (!this.artist.name) this.artist.name = mbArtist.name;
      
      this.showToast(`Attached MusicBrainz MBID: ${mbArtist.id}`, 'success');

      this.crawler.mbReleasesLoading = true;
      try {
        const relUrl = `https://musicbrainz.org/ws/2/release-group?artist=${mbArtist.id}&fmt=json`;
        const res = await fetch(relUrl);
        if (relRes.ok) {
          const relData = await relRes.json();
          if (relData['release-groups'] && relData['release-groups'].length > 0) {
            const mbAlbums = relData['release-groups'].slice(0, 6).map((rg, i) => {
              let rType = 'AlbumRelease';
              const pType = rg['primary-type'] || '';
              if (pType === 'Single') rType = 'SingleRelease';
              else if (pType === 'EP') rType = 'EPRelease';
              else if (pType === 'Broadcast') rType = 'BroadcastRelease';

              return {
                id: rg.id || `album-${i + 1}`,
                title: rg.title || '',
                releaseType: rType,
                releaseDate: rg['first-release-date'] || '',
                label: '',
                catalogNumber: '',
                barcode: '',
                image: '',
                url: '',
                mbid: rg.id,
                streamingLinks: { spotify: '', bandcamp: '', appleMusic: '', youtubeMusic: '' },
                tracks: [{ position: 1, title: '', duration: '03:30', isrc: '', composer: '', lyricsUrl: '', previewUrl: '' }]
              };
            });

            if (this.artist.albums.length === 0 || (this.artist.albums.length === 1 && !this.artist.albums[0].title)) {
              this.artist.albums = mbAlbums;
            } else {
              this.artist.albums.push(...mbAlbums);
            }
            this.showToast(`Imported ${mbAlbums.length} releases from MusicBrainz!`, 'success');
          }
        }
      } catch (e) {
        console.warn('Could not auto-fetch MusicBrainz releases:', e);
      } finally {
        this.crawler.mbReleasesLoading = false;
      }
    }
  }
});

app.mount('#app');
