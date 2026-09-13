-- =================================================================
-- Anant Platform: Initial Seed Data Script
-- Generated automatically by scripts/seed-db.js
-- =================================================================

BEGIN;

-- 1. Seeding 3 Primary Deities
INSERT INTO deities (id, name_en, name_mr, name_hi, title, description, icon_url, banner_url, associated_temples_count, popular_mantras)
VALUES ('lord_ganesh', 'Lord Ganesh (Vighnaharta)', 'श्री गणेश (विघ्नहर्ता)', 'भगवान गणेश (विघ्नहर्ता)', 'Remover of Obstacles & Master of Wisdom', 'First to be invoked before any sacred endeavor. Bestower of intellect (Buddhi), prosperity (Riddhi), and spiritual victory (Siddhi).', 'https://images.unsplash.com/photo-1567591370504-20a2d2188849?w=200&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1567591370504-20a2d2188849?w=1000&auto=format&fit=crop&q=80', 24, ARRAY['Om Gam Ganapataye Namaha', 'Vakratunda Mahakaya', 'Sankata Nashana Ganesh Stotram'])
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_mr = EXCLUDED.name_mr,
  name_hi = EXCLUDED.name_hi,
  title = EXCLUDED.title;
INSERT INTO deities (id, name_en, name_mr, name_hi, title, description, icon_url, banner_url, associated_temples_count, popular_mantras)
VALUES ('lord_shiva', 'Lord Shiva (Mahadev)', 'भगवान शिव (महादेव)', 'भगवान शिव (महादेव)', 'Supreme Ascetic, Transformer & Cosmic Lord', 'The auspicious transformer, resident of Kailash, patron of meditation and yogic stillness. Revered with sacred Bilva leaves, Rudraksha beads, and Panchakshari japa.', 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=200&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=1000&auto=format&fit=crop&q=80', 18, ARRAY['Om Namah Shivaya', 'Maha Mrityunjaya Mantra', 'Shiva Tandava Stotram'])
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_mr = EXCLUDED.name_mr,
  name_hi = EXCLUDED.name_hi,
  title = EXCLUDED.title;
INSERT INTO deities (id, name_en, name_mr, name_hi, title, description, icon_url, banner_url, associated_temples_count, popular_mantras)
VALUES ('lord_hanuman', 'Lord Hanuman (Maruti)', 'श्री हनुमान (बजरंगबली)', 'भगवान हनुमान (बजरंगबली)', 'Embodiment of Devotion, Courage & Strength', 'Supreme devotee of Lord Rama, dispeller of fear and negative vibrations. Revered with the chanting of the Hanuman Chalisa on Tuesdays and Saturdays.', 'https://images.unsplash.com/photo-1618245318763-a15156d6b23c?w=200&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1618245318763-a15156d6b23c?w=1000&auto=format&fit=crop&q=80', 19, ARRAY['Shri Hanuman Chalisa', 'Om Hanumate Namaha', 'Maruti Stotra - Bheemroopi'])
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_mr = EXCLUDED.name_mr,
  name_hi = EXCLUDED.name_hi,
  title = EXCLUDED.title;

-- 2. Seeding 5 Sample Temples (Pune, Mumbai, Nashik, Goa) with PostGIS ST_MakePoint
INSERT INTO temples (id, name, deity_id, city, state, address, geog, is_verified, followers_count, cover_image_url, live_darshan_stream_url, darshan_timings, pooja_services, gov_reg_number, whatsapp_number, social_links)
VALUES (
  'temple_dagdusheth',
  'Shreemant Dagdusheth Halwai Ganpati Mandir',
  'lord_ganesh',
  'Pune',
  'Maharashtra',
  'Budhwar Peth, Shivaji Road, Pune 411002',
  ST_SetSRID(ST_MakePoint(73.8553, 18.5173), 4326)::geography,
  true,
  184500,
  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  '06:00 AM - 11:00 PM',
  ARRAY['Panchamrut Abhishek', 'Sahasravartan', 'Maha Arti', 'Modak Naivedya'],
  'MAH-PUN-TRUST-49102-1982',
  '+919822012345',
  '{"facebook":"https://facebook.com/dagdusheth","instagram":"https://instagram.com/dagdusheth","youtube":"https://youtube.com/dagdusheth"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  geog = EXCLUDED.geog,
  is_verified = EXCLUDED.is_verified;
INSERT INTO temples (id, name, deity_id, city, state, address, geog, is_verified, followers_count, cover_image_url, live_darshan_stream_url, darshan_timings, pooja_services, gov_reg_number, whatsapp_number, social_links)
VALUES (
  'temple_siddhivinayak',
  'Shree Siddhivinayak Ganapati Temple',
  'lord_ganesh',
  'Mumbai',
  'Maharashtra',
  'SK Bole Marg, Prabhadevi, Mumbai 400028',
  ST_SetSRID(ST_MakePoint(72.8304, 19.0169), 4326)::geography,
  true,
  312000,
  'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&auto=format&fit=crop&q=80',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  '05:30 AM - 10:00 PM',
  ARRAY['Kakad Arti', 'Angarki Sankashti Special Pooja', 'Silver Archana'],
  'MAH-MUM-TRUST-10291-1976',
  '+919820011223',
  '{"facebook":"https://facebook.com/siddhivinayak","instagram":"https://instagram.com/siddhivinayak","youtube":"https://youtube.com/siddhivinayak"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  geog = EXCLUDED.geog,
  is_verified = EXCLUDED.is_verified;
INSERT INTO temples (id, name, deity_id, city, state, address, geog, is_verified, followers_count, cover_image_url, live_darshan_stream_url, darshan_timings, pooja_services, gov_reg_number, whatsapp_number, social_links)
VALUES (
  'temple_trimbakeshwar',
  'Trimbakeshwar Shiva Jyotirlinga Mandir',
  'lord_shiva',
  'Nashik',
  'Maharashtra',
  'Trimbak, Nashik District 422212',
  ST_SetSRID(ST_MakePoint(73.5308, 19.9324), 4326)::geography,
  true,
  142000,
  'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  '05:30 AM - 09:00 PM',
  ARRAY['Rudra Abhishek', 'Maha Mrityunjaya Hawan', 'Kalsarpa Shanti', 'Tri-Sandhya Pooja'],
  'MAH-NSK-TRUST-84910-1954',
  '+919422033445',
  '{"facebook":"https://facebook.com/trimbakeshwar","instagram":"https://instagram.com/trimbakeshwar","youtube":"https://youtube.com/trimbakeshwar"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  geog = EXCLUDED.geog,
  is_verified = EXCLUDED.is_verified;
INSERT INTO temples (id, name, deity_id, city, state, address, geog, is_verified, followers_count, cover_image_url, live_darshan_stream_url, darshan_timings, pooja_services, gov_reg_number, whatsapp_number, social_links)
VALUES (
  'temple_babulnath',
  'Shree Babulnath Shiva Mandir',
  'lord_shiva',
  'Mumbai',
  'Maharashtra',
  '16, Babulnath Road, Charni Road, Malabar Hill, Mumbai 400007',
  ST_SetSRID(ST_MakePoint(72.8093, 18.9566), 4326)::geography,
  true,
  96000,
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  '05:00 AM - 10:00 PM',
  ARRAY['Somwar Special Jalabhishek', 'Bilvashtakam Seva', 'Maha Rudrapath'],
  'MAH-MUM-TRUST-04821-1890',
  '+919820044556',
  '{"facebook":"https://facebook.com/babulnath","instagram":"https://instagram.com/babulnath","youtube":"https://youtube.com/babulnath"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  geog = EXCLUDED.geog,
  is_verified = EXCLUDED.is_verified;
INSERT INTO temples (id, name, deity_id, city, state, address, geog, is_verified, followers_count, cover_image_url, live_darshan_stream_url, darshan_timings, pooja_services, gov_reg_number, whatsapp_number, social_links)
VALUES (
  'temple_mangeshi',
  'Shree Manguesh Temple (Ponda)',
  'lord_shiva',
  'Goa',
  'Goa',
  'Priol, Ponda, Goa 403404',
  ST_SetSRID(ST_MakePoint(73.9678, 15.3949), 4326)::geography,
  true,
  88000,
  'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
  '06:00 AM - 10:00 PM',
  ARRAY['Deepstambha Deepotsav', 'Bilva Abhishek', 'Shiva Sahasranama Archana'],
  'GOA-PND-TRUST-30911-1961',
  '+918322233445',
  '{"facebook":"https://facebook.com/mangueshtemple","instagram":"https://instagram.com/mangueshtemple","youtube":"https://youtube.com/mangueshtemple"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  geog = EXCLUDED.geog,
  is_verified = EXCLUDED.is_verified;

-- 3. Seeding Devotional Media (Artis, Stotras, Chaturmas Books)
INSERT INTO devotional_media (id, category, deity_id, title_en, title_mr, title_hi, views_count, duration, audio_url, pdf_url, pdf_page_count, lyrics)
VALUES (
  'media_ganesh_arti',
  'ARTI',
  'lord_ganesh',
  'Sukhakarta Dukhaharta (Shri Ganpati Arti)',
  'सुखकर्ता दुःखहर्ता (श्री गणपतीची आरती)',
  'सुखकर्ता दुखहर्ता (श्री गणपति आरती)',
  542000,
  '04:12',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  4,
  '{"mr":"सुखकर्ता दुःखहर्ता वार्ता विघ्नाची।\nनुरवी पुरवी प्रेम कृपा जयाची।\nसर्वांगी सुंदर उटी शेंदुराची।\nकंठी झळके माळ मुक्ताफळांची॥\n\nजय देव जय देव जय मंगलमूर्ती।\nदर्शनमात्रे मनकामना पुरती॥\n\nरत्नखचित फरा तुज गौरीकुमरा।\nचंदनाची उटी कुंकुमकेशरा।\nहिरेजडित मुकुट शोभतो बरा।\nरुणझुणती नूपुरे चरणी घागरिया॥","hi":"सुखकर्ता दुःखहर्ता वार्ता विघ्न की।\nनुरवी पुरवी प्रेम कृपा जिस प्रभु की।\nसर्वांग सुंदर उबटन सिंदूर का।\nकंठ में झलके माला मोतियों की॥\n\nजय देव जय देव जय मंगलमूर्ती।\nदर्शन मात्र से ही मनकामना पूरी होती॥","en":"O Lord Ganesha, bringer of happiness and destroyer of grief!\nYou dispel obstacles and shower boundless compassionate grace.\nAdorned in radiant red vermilion with fragrant chandan paste,\nGlistening pearl necklaces embellish your sacred chest.\n\nVictory to you, O divine auspicious form!\nA mere glimpse of Your grace fulfills all pure desires of the heart."}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_mr = EXCLUDED.title_mr,
  lyrics = EXCLUDED.lyrics;
INSERT INTO devotional_media (id, category, deity_id, title_en, title_mr, title_hi, views_count, duration, audio_url, pdf_url, pdf_page_count, lyrics)
VALUES (
  'media_shiva_tandava',
  'STOTRA',
  'lord_shiva',
  'Shiva Tandava Stotram',
  'शिव तांडव स्तोत्रम् (रावणकृत)',
  'शिव तांडव स्तोत्रम् (रावण रचित)',
  820000,
  '09:45',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  8,
  '{"mr":"जटाटवीगलज्जलप्रवाहपावितस्थले\nगलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम्।\nडमड्डमड्डमड्डमन्निनादवड्डमर्वयं\nचकार चण्डताण्डवं तनोतु नः शिवः शिवम्॥\n\nजटाकटाहसम्भ्रमभ्रमन्निलिम्पनिर्झरी\nविलोलवीचिवल्लरीविराजमानमूर्धनि।\nधगद्धगद्धगज्ज्वलल्ललाटपट्टपावके\nकिशोरचन्द्रशेखरे रतिः प्रतिक्षणं मम॥","hi":"जटाटवीगलज्जलप्रवाहपावितस्थले\nगलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम्।\nडमड्डमड्डमड्डमन्निनादवड्डमर्वयं\nचकार चण्डताण्डवं तनोतु नः शिवः शिवम्॥","en":"From the forest of His matted locks, the sacred waters flow and purify the earth.\nAround His neck hangs the towering garland of serpents.\nAs His damaru echoes Damad-Damad-Damad in cosmic cadence,\nMay Lord Shiva perform His sublime dance of eternal liberation."}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_mr = EXCLUDED.title_mr,
  lyrics = EXCLUDED.lyrics;
INSERT INTO devotional_media (id, category, deity_id, title_en, title_mr, title_hi, views_count, duration, audio_url, pdf_url, pdf_page_count, lyrics)
VALUES (
  'media_maruti_stotra',
  'STOTRA',
  'lord_hanuman',
  'Maruti Stotra (Bheemroopi Maharudra)',
  'मारुती स्तोत्र (भीमरूपी महारुद्रा - समर्थ रामदास स्वामी)',
  'मारुति स्तोत्र (भीमरूपी महारुद्र)',
  610000,
  '05:30',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  6,
  '{"mr":"भीमरूपी महारुद्रा वज्रहनुमान मारुती।\nवनारी अंजनीसुता रामदूता प्रभंजना॥\nमहाबळी प्राणदाता सख्य तुजसम नाही।\nभूतप्रेत समंधादी रोगव्याधी निवारक॥\n\nतेजःपुंज महाकाया पिंघाक्ष भस्मलेपन।\nधराधर समानांग रामभक्तिपरायण॥\nश्रोते सज्जन हो एका मारुतीचे हे स्तोत्र।\nनित्य पठने त्रिकाळ विजय लाभे सर्वदा॥","hi":"भीमरूपी महारुद्रा वज्रहनुमान मारुति।\nवनारी अंजनीसुत रामदूत प्रभंजन॥\nमहाबली प्राणदाता सख्य तुम्हारे समान नहीं।\nभूत-प्रेत बाधा और रोग-व्याधि के निवारक॥","en":"O Mighty Maruti of cosmic formidable form, son of Anjani and emissary of Lord Rama!\nBringer of vital breath and invincible strength, none can match Your loyal guardianship.\nDispeller of fear, ailments, and obstacles,\nWhosoever recites this hymn with devotion is shielded and granted continuous victory."}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_mr = EXCLUDED.title_mr,
  lyrics = EXCLUDED.lyrics;
INSERT INTO devotional_media (id, category, deity_id, title_en, title_mr, title_hi, views_count, duration, audio_url, pdf_url, pdf_page_count, lyrics)
VALUES (
  'media_shiv_leelamrut',
  'CHATURMAS_BOOK',
  'lord_shiva',
  'Shree Shiv Leelamrut (14 Adhyay Chaturmas Parayan)',
  'श्री शिवलीलामृत (१४ अध्याय संपूर्ण - श्रीधर स्वामी)',
  'श्री शिवलीलामृत (१४ अध्याय चातुर्मास पारायण)',
  395000,
  'Parayan Edition',
  '',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  184,
  '{"mr":"॥ श्रीगणेशाय नमः ॥\nजय जय जगदंबिके भवानी। तुज वंदितो मी अंतःकरणी।\nशिवचरित्र वर्णावया वाणी। स्फूर्ती देई कृपानिधी॥\n\nअध्याय पहिला: विश्वाची उत्पत्ती आणि शिवतत्त्वाचे गूढ रहस्य।\nश्रावण मासात दररोज एका अध्यायाचे नित्य पठण महापापांचे हरण करते आणि कैलास पदाची प्राप्ती करून देते।","hi":"॥ श्री गणेशाय नमः ॥\nजय जय जगदंबिके भवानी। आपको अंतःकरण से वंदन करता हूँ।\nशिव चरित्र का वर्णन करने के लिए मेरी वाणी में प्रेरणा दीजिए॥\nअध्याय पहला: सृष्टि की उत्पत्ति एवं शिव तत्व का दिव्य रहस्य।","en":"Chapter 1: The Divine Genesis and Eternal Glory of the Shiva Principle.\nTraditionally recited daily during the sacred four months of Chaturmas (Shravan to Kartik), bestowing peace, inner purification, and liberation."}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_mr = EXCLUDED.title_mr,
  lyrics = EXCLUDED.lyrics;

COMMIT;
