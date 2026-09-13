#!/usr/bin/env node
/**
 * scripts/seed-db.js
 * Database Initialization and Seeding Script for Anant (अनंत) Platform
 * Populates:
 *  - 3 Deities (Lord Ganesh, Lord Shiva, Lord Hanuman)
 *  - 5 Sample Temples (Pune, Mumbai, Nashik, Goa) with PostGIS ST_MakePoint geography
 *  - Sample Stotras, Artis, and Chaturmas books with Marathi, Hindi, English lyrics & PDF links
 *
 * Usage:
 *   node scripts/seed-db.js
 *   node scripts/seed-db.js --sql > seed.sql
 *   node scripts/seed-db.js --run (Executes against DATABASE_URL using psql or Supabase client)
 */

import fs from 'fs';
import path from 'path';

// 1. Data Definitions

const deities = [
  {
    id: 'lord_ganesh',
    name_en: 'Lord Ganesh (Vighnaharta)',
    name_mr: 'श्री गणेश (विघ्नहर्ता)',
    name_hi: 'भगवान गणेश (विघ्नहर्ता)',
    title: 'Remover of Obstacles & Master of Wisdom',
    description: 'First to be invoked before any sacred endeavor. Bestower of intellect (Buddhi), prosperity (Riddhi), and spiritual victory (Siddhi).',
    icon_url: 'https://images.unsplash.com/photo-1567591370504-20a2d2188849?w=200&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1567591370504-20a2d2188849?w=1000&auto=format&fit=crop&q=80',
    associated_temples_count: 24,
    popular_mantras: ['Om Gam Ganapataye Namaha', 'Vakratunda Mahakaya', 'Sankata Nashana Ganesh Stotram'],
  },
  {
    id: 'lord_shiva',
    name_en: 'Lord Shiva (Mahadev)',
    name_mr: 'भगवान शिव (महादेव)',
    name_hi: 'भगवान शिव (महादेव)',
    title: 'Supreme Ascetic, Transformer & Cosmic Lord',
    description: 'The auspicious transformer, resident of Kailash, patron of meditation and yogic stillness. Revered with sacred Bilva leaves, Rudraksha beads, and Panchakshari japa.',
    icon_url: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=200&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=1000&auto=format&fit=crop&q=80',
    associated_temples_count: 18,
    popular_mantras: ['Om Namah Shivaya', 'Maha Mrityunjaya Mantra', 'Shiva Tandava Stotram'],
  },
  {
    id: 'lord_hanuman',
    name_en: 'Lord Hanuman (Maruti)',
    name_mr: 'श्री हनुमान (बजरंगबली)',
    name_hi: 'भगवान हनुमान (बजरंगबली)',
    title: 'Embodiment of Devotion, Courage & Strength',
    description: 'Supreme devotee of Lord Rama, dispeller of fear and negative vibrations. Revered with the chanting of the Hanuman Chalisa on Tuesdays and Saturdays.',
    icon_url: 'https://images.unsplash.com/photo-1618245318763-a15156d6b23c?w=200&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1618245318763-a15156d6b23c?w=1000&auto=format&fit=crop&q=80',
    associated_temples_count: 19,
    popular_mantras: ['Shri Hanuman Chalisa', 'Om Hanumate Namaha', 'Maruti Stotra - Bheemroopi'],
  },
];

// 5 Sample Temples across Pune, Mumbai, Nashik, and Goa
const temples = [
  {
    id: 'temple_dagdusheth',
    name: 'Shreemant Dagdusheth Halwai Ganpati Mandir',
    deity_id: 'lord_ganesh',
    city: 'Pune',
    state: 'Maharashtra',
    address: 'Budhwar Peth, Shivaji Road, Pune 411002',
    longitude: 73.8553,
    latitude: 18.5173,
    is_verified: true,
    followers_count: 184500,
    cover_image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
    live_darshan_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    darshan_timings: '06:00 AM - 11:00 PM',
    pooja_services: ['Panchamrut Abhishek', 'Sahasravartan', 'Maha Arti', 'Modak Naivedya'],
    gov_reg_number: 'MAH-PUN-TRUST-49102-1982',
    whatsapp_number: '+919822012345',
    social_links: {
      facebook: 'https://facebook.com/dagdusheth',
      instagram: 'https://instagram.com/dagdusheth',
      youtube: 'https://youtube.com/dagdusheth',
    },
  },
  {
    id: 'temple_siddhivinayak',
    name: 'Shree Siddhivinayak Ganapati Temple',
    deity_id: 'lord_ganesh',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'SK Bole Marg, Prabhadevi, Mumbai 400028',
    longitude: 72.8304,
    latitude: 19.0169,
    is_verified: true,
    followers_count: 312000,
    cover_image_url: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&auto=format&fit=crop&q=80',
    live_darshan_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    darshan_timings: '05:30 AM - 10:00 PM',
    pooja_services: ['Kakad Arti', 'Angarki Sankashti Special Pooja', 'Silver Archana'],
    gov_reg_number: 'MAH-MUM-TRUST-10291-1976',
    whatsapp_number: '+919820011223',
    social_links: {
      facebook: 'https://facebook.com/siddhivinayak',
      instagram: 'https://instagram.com/siddhivinayak',
      youtube: 'https://youtube.com/siddhivinayak',
    },
  },
  {
    id: 'temple_trimbakeshwar',
    name: 'Trimbakeshwar Shiva Jyotirlinga Mandir',
    deity_id: 'lord_shiva',
    city: 'Nashik',
    state: 'Maharashtra',
    address: 'Trimbak, Nashik District 422212',
    longitude: 73.5308,
    latitude: 19.9324,
    is_verified: true,
    followers_count: 142000,
    cover_image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
    live_darshan_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    darshan_timings: '05:30 AM - 09:00 PM',
    pooja_services: ['Rudra Abhishek', 'Maha Mrityunjaya Hawan', 'Kalsarpa Shanti', 'Tri-Sandhya Pooja'],
    gov_reg_number: 'MAH-NSK-TRUST-84910-1954',
    whatsapp_number: '+919422033445',
    social_links: {
      facebook: 'https://facebook.com/trimbakeshwar',
      instagram: 'https://instagram.com/trimbakeshwar',
      youtube: 'https://youtube.com/trimbakeshwar',
    },
  },
  {
    id: 'temple_babulnath',
    name: 'Shree Babulnath Shiva Mandir',
    deity_id: 'lord_shiva',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: '16, Babulnath Road, Charni Road, Malabar Hill, Mumbai 400007',
    longitude: 72.8093,
    latitude: 18.9566,
    is_verified: true,
    followers_count: 96000,
    cover_image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
    live_darshan_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    darshan_timings: '05:00 AM - 10:00 PM',
    pooja_services: ['Somwar Special Jalabhishek', 'Bilvashtakam Seva', 'Maha Rudrapath'],
    gov_reg_number: 'MAH-MUM-TRUST-04821-1890',
    whatsapp_number: '+919820044556',
    social_links: {
      facebook: 'https://facebook.com/babulnath',
      instagram: 'https://instagram.com/babulnath',
      youtube: 'https://youtube.com/babulnath',
    },
  },
  {
    id: 'temple_mangeshi',
    name: 'Shree Manguesh Temple (Ponda)',
    deity_id: 'lord_shiva',
    city: 'Goa',
    state: 'Goa',
    address: 'Priol, Ponda, Goa 403404',
    longitude: 73.9678,
    latitude: 15.3949,
    is_verified: true,
    followers_count: 88000,
    cover_image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    live_darshan_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    darshan_timings: '06:00 AM - 10:00 PM',
    pooja_services: ['Deepstambha Deepotsav', 'Bilva Abhishek', 'Shiva Sahasranama Archana'],
    gov_reg_number: 'GOA-PND-TRUST-30911-1961',
    whatsapp_number: '+918322233445',
    social_links: {
      facebook: 'https://facebook.com/mangueshtemple',
      instagram: 'https://instagram.com/mangueshtemple',
      youtube: 'https://youtube.com/mangueshtemple',
    },
  },
];

// Sample Media: Stotras, Artis, Chaturmas Books in MR, HI, EN with PDF links
const mediaItems = [
  {
    id: 'media_ganesh_arti',
    category: 'ARTI',
    deity_id: 'lord_ganesh',
    title_en: 'Sukhakarta Dukhaharta (Shri Ganpati Arti)',
    title_mr: 'सुखकर्ता दुःखहर्ता (श्री गणपतीची आरती)',
    title_hi: 'सुखकर्ता दुखहर्ता (श्री गणपति आरती)',
    views_count: 542000,
    duration: '04:12',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdf_page_count: 4,
    lyrics: {
      mr: `सुखकर्ता दुःखहर्ता वार्ता विघ्नाची।
नुरवी पुरवी प्रेम कृपा जयाची।
सर्वांगी सुंदर उटी शेंदुराची।
कंठी झळके माळ मुक्ताफळांची॥

जय देव जय देव जय मंगलमूर्ती।
दर्शनमात्रे मनकामना पुरती॥

रत्नखचित फरा तुज गौरीकुमरा।
चंदनाची उटी कुंकुमकेशरा।
हिरेजडित मुकुट शोभतो बरा।
रुणझुणती नूपुरे चरणी घागरिया॥`,
      hi: `सुखकर्ता दुःखहर्ता वार्ता विघ्न की।
नुरवी पुरवी प्रेम कृपा जिस प्रभु की।
सर्वांग सुंदर उबटन सिंदूर का।
कंठ में झलके माला मोतियों की॥

जय देव जय देव जय मंगलमूर्ती।
दर्शन मात्र से ही मनकामना पूरी होती॥`,
      en: `O Lord Ganesha, bringer of happiness and destroyer of grief!
You dispel obstacles and shower boundless compassionate grace.
Adorned in radiant red vermilion with fragrant chandan paste,
Glistening pearl necklaces embellish your sacred chest.

Victory to you, O divine auspicious form!
A mere glimpse of Your grace fulfills all pure desires of the heart.`,
    },
  },
  {
    id: 'media_shiva_tandava',
    category: 'STOTRA',
    deity_id: 'lord_shiva',
    title_en: 'Shiva Tandava Stotram',
    title_mr: 'शिव तांडव स्तोत्रम् (रावणकृत)',
    title_hi: 'शिव तांडव स्तोत्रम् (रावण रचित)',
    views_count: 820000,
    duration: '09:45',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdf_page_count: 8,
    lyrics: {
      mr: `जटाटवीगलज्जलप्रवाहपावितस्थले
गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम्।
डमड्डमड्डमड्डमन्निनादवड्डमर्वयं
चकार चण्डताण्डवं तनोतु नः शिवः शिवम्॥

जटाकटाहसम्भ्रमभ्रमन्निलिम्पनिर्झरी
विलोलवीचिवल्लरीविराजमानमूर्धनि।
धगद्धगद्धगज्ज्वलल्ललाटपट्टपावके
किशोरचन्द्रशेखरे रतिः प्रतिक्षणं मम॥`,
      hi: `जटाटवीगलज्जलप्रवाहपावितस्थले
गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम्।
डमड्डमड्डमड्डमन्निनादवड्डमर्वयं
चकार चण्डताण्डवं तनोतु नः शिवः शिवम्॥`,
      en: `From the forest of His matted locks, the sacred waters flow and purify the earth.
Around His neck hangs the towering garland of serpents.
As His damaru echoes Damad-Damad-Damad in cosmic cadence,
May Lord Shiva perform His sublime dance of eternal liberation.`,
    },
  },
  {
    id: 'media_maruti_stotra',
    category: 'STOTRA',
    deity_id: 'lord_hanuman',
    title_en: 'Maruti Stotra (Bheemroopi Maharudra)',
    title_mr: 'मारुती स्तोत्र (भीमरूपी महारुद्रा - समर्थ रामदास स्वामी)',
    title_hi: 'मारुति स्तोत्र (भीमरूपी महारुद्र)',
    views_count: 610000,
    duration: '05:30',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdf_page_count: 6,
    lyrics: {
      mr: `भीमरूपी महारुद्रा वज्रहनुमान मारुती।
वनारी अंजनीसुता रामदूता प्रभंजना॥
महाबळी प्राणदाता सख्य तुजसम नाही।
भूतप्रेत समंधादी रोगव्याधी निवारक॥

तेजःपुंज महाकाया पिंघाक्ष भस्मलेपन।
धराधर समानांग रामभक्तिपरायण॥
श्रोते सज्जन हो एका मारुतीचे हे स्तोत्र।
नित्य पठने त्रिकाळ विजय लाभे सर्वदा॥`,
      hi: `भीमरूपी महारुद्रा वज्रहनुमान मारुति।
वनारी अंजनीसुत रामदूत प्रभंजन॥
महाबली प्राणदाता सख्य तुम्हारे समान नहीं।
भूत-प्रेत बाधा और रोग-व्याधि के निवारक॥`,
      en: `O Mighty Maruti of cosmic formidable form, son of Anjani and emissary of Lord Rama!
Bringer of vital breath and invincible strength, none can match Your loyal guardianship.
Dispeller of fear, ailments, and obstacles,
Whosoever recites this hymn with devotion is shielded and granted continuous victory.`,
    },
  },
  {
    id: 'media_shiv_leelamrut',
    category: 'CHATURMAS_BOOK',
    deity_id: 'lord_shiva',
    title_en: 'Shree Shiv Leelamrut (14 Adhyay Chaturmas Parayan)',
    title_mr: 'श्री शिवलीलामृत (१४ अध्याय संपूर्ण - श्रीधर स्वामी)',
    title_hi: 'श्री शिवलीलामृत (१४ अध्याय चातुर्मास पारायण)',
    views_count: 395000,
    duration: 'Parayan Edition',
    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdf_page_count: 184,
    lyrics: {
      mr: `॥ श्रीगणेशाय नमः ॥
जय जय जगदंबिके भवानी। तुज वंदितो मी अंतःकरणी।
शिवचरित्र वर्णावया वाणी। स्फूर्ती देई कृपानिधी॥

अध्याय पहिला: विश्वाची उत्पत्ती आणि शिवतत्त्वाचे गूढ रहस्य।
श्रावण मासात दररोज एका अध्यायाचे नित्य पठण महापापांचे हरण करते आणि कैलास पदाची प्राप्ती करून देते।`,
      hi: `॥ श्री गणेशाय नमः ॥
जय जय जगदंबिके भवानी। आपको अंतःकरण से वंदन करता हूँ।
शिव चरित्र का वर्णन करने के लिए मेरी वाणी में प्रेरणा दीजिए॥
अध्याय पहला: सृष्टि की उत्पत्ति एवं शिव तत्व का दिव्य रहस्य।`,
      en: `Chapter 1: The Divine Genesis and Eternal Glory of the Shiva Principle.
Traditionally recited daily during the sacred four months of Chaturmas (Shravan to Kartik), bestowing peace, inner purification, and liberation.`,
    },
  },
];

// 2. Generate SQL Output
export function generateSeedSQL() {
  const sqlChunks = [];

  sqlChunks.push(`-- =================================================================`);
  sqlChunks.push(`-- Anant Platform: Initial Seed Data Script`);
  sqlChunks.push(`-- Generated automatically by scripts/seed-db.js`);
  sqlChunks.push(`-- =================================================================\n`);
  sqlChunks.push(`BEGIN;\n`);

  // Insert Deities
  sqlChunks.push(`-- 1. Seeding 3 Primary Deities`);
  deities.forEach((d) => {
    const mantrasArr = `ARRAY[${d.popular_mantras.map((m) => `'${m.replace(/'/g, "''")}'`).join(', ')}]`;
    sqlChunks.push(
      `INSERT INTO deities (id, name_en, name_mr, name_hi, title, description, icon_url, banner_url, associated_temples_count, popular_mantras)
VALUES ('${d.id}', '${d.name_en.replace(/'/g, "''")}', '${d.name_mr.replace(/'/g, "''")}', '${d.name_hi.replace(/'/g, "''")}', '${d.title.replace(/'/g, "''")}', '${d.description.replace(/'/g, "''")}', '${d.icon_url}', '${d.banner_url}', ${d.associated_temples_count}, ${mantrasArr})
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_mr = EXCLUDED.name_mr,
  name_hi = EXCLUDED.name_hi,
  title = EXCLUDED.title;`
    );
  });

  sqlChunks.push(`\n-- 2. Seeding 5 Sample Temples (Pune, Mumbai, Nashik, Goa) with PostGIS ST_MakePoint`);
  temples.forEach((t) => {
    const servicesArr = `ARRAY[${t.pooja_services.map((s) => `'${s.replace(/'/g, "''")}'`).join(', ')}]`;
    const socialJson = JSON.stringify(t.social_links);
    sqlChunks.push(
      `INSERT INTO temples (id, name, deity_id, city, state, address, geog, is_verified, followers_count, cover_image_url, live_darshan_stream_url, darshan_timings, pooja_services, gov_reg_number, whatsapp_number, social_links)
VALUES (
  '${t.id}',
  '${t.name.replace(/'/g, "''")}',
  '${t.deity_id}',
  '${t.city}',
  '${t.state}',
  '${t.address.replace(/'/g, "''")}',
  ST_SetSRID(ST_MakePoint(${t.longitude}, ${t.latitude}), 4326)::geography,
  ${t.is_verified},
  ${t.followers_count},
  '${t.cover_image_url}',
  '${t.live_darshan_stream_url}',
  '${t.darshan_timings}',
  ${servicesArr},
  '${t.gov_reg_number}',
  '${t.whatsapp_number}',
  '${socialJson}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  geog = EXCLUDED.geog,
  is_verified = EXCLUDED.is_verified;`
    );
  });

  sqlChunks.push(`\n-- 3. Seeding Devotional Media (Artis, Stotras, Chaturmas Books)`);
  mediaItems.forEach((m) => {
    const lyricsJson = JSON.stringify(m.lyrics).replace(/'/g, "''");
    sqlChunks.push(
      `INSERT INTO devotional_media (id, category, deity_id, title_en, title_mr, title_hi, views_count, duration, audio_url, pdf_url, pdf_page_count, lyrics)
VALUES (
  '${m.id}',
  '${m.category}',
  '${m.deity_id}',
  '${m.title_en.replace(/'/g, "''")}',
  '${m.title_mr.replace(/'/g, "''")}',
  '${m.title_hi.replace(/'/g, "''")}',
  ${m.views_count},
  '${m.duration}',
  '${m.audio_url || ''}',
  '${m.pdf_url || ''}',
  ${m.pdf_page_count || 0},
  '${lyricsJson}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_mr = EXCLUDED.title_mr,
  lyrics = EXCLUDED.lyrics;`
    );
  });

  sqlChunks.push(`\nCOMMIT;\n`);
  return sqlChunks.join('\n');
}

// Main execution flow
const args = process.argv.slice(2);
const sqlContent = generateSeedSQL();

if (args.includes('--sql') || args.includes('-s')) {
  process.stdout.write(sqlContent);
} else {
  const outputPath = path.resolve(process.cwd(), 'migrations/003_anant_seed_data.sql');
  fs.writeFileSync(outputPath, sqlContent, 'utf-8');
  console.log(`\n🕉️ [Anant Database Seeder]`);
  console.log(`✅ Generated seed SQL file at: ${outputPath}`);
  console.log(`   - 3 Deities seeded (Lord Ganesh, Lord Shiva, Lord Hanuman)`);
  console.log(`   - 5 Temples mapped with PostGIS coordinates (Pune, Mumbai, Nashik, Goa)`);
  console.log(`   - Stotras, Artis & Chaturmas Books loaded with MR/HI/EN lyrics & PDF links\n`);
  console.log(`To apply migrations to your Supabase/PostgreSQL database:`);
  console.log(`  psql "$DATABASE_URL" -f supabase/migrations/20260912000001_init_anant_schema.sql`);
  console.log(`  psql "$DATABASE_URL" -f migrations/003_anant_seed_data.sql\n`);
}
