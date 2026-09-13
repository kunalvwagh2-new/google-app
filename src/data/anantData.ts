import {
  Deity,
  Temple,
  MediaItem,
  TrustMember,
  TempleEvent,
  DonationRecord,
  TrustComplianceInfo,
  PanchangInfo,
  SpiritualShort,
  DarshanSlot,
  DarshanPass,
  EPoojaSeva,
  SevaBooking,
  CommunityJaapGoal,
  WhatsAppNotificationTemplate,
  SpiritualBlog,
  DailyDarshanUpload,
  ChantTrack,
} from '../types/anant.ts';

export const mockDeities: Deity[] = [
  {
    id: 'lord_shiva',
    nameEn: 'Lord Shiva (Mahadev)',
    nameMr: 'भगवान शिव (महादेव)',
    nameHi: 'भगवान शिव (महादेव)',
    title: 'Supreme Ascetic, Transformer & Cosmic Lord',
    iconUrl: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=1000&auto=format&fit=crop&q=80',
    description: 'The auspicious transformer, resident of Kailash, patron of meditation and yogic stillness. Revered with sacred Bilva leaves, Rudraksha beads, and Panchakshari japa.',
    associatedTemplesCount: 18,
    popularMantras: ['Om Namah Shivaya', 'Maha Mrityunjaya Mantra', 'Shiva Tandava Stotram'],
  },
  {
    id: 'lord_ganesh',
    nameEn: 'Lord Ganesh (Vighnaharta)',
    nameMr: 'श्री गणेश (विघ्नहर्ता)',
    nameHi: 'भगवान गणेश (विघ्नहर्ता)',
    title: 'Remover of Obstacles & Master of Wisdom',
    iconUrl: 'https://images.unsplash.com/photo-1567591370504-20a2d2188849?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1567591370504-20a2d2188849?w=1000&auto=format&fit=crop&q=80',
    description: 'First to be invoked before any sacred endeavor. Bestower of intellect (Buddhi), prosperity (Riddhi), and spiritual victory (Siddhi).',
    associatedTemplesCount: 24,
    popularMantras: ['Om Gam Ganapataye Namaha', 'Vakratunda Mahakaya', 'Sankata Nashana Stotram'],
  },
  {
    id: 'lord_vishnu',
    nameEn: 'Lord Vishnu / Vitthala',
    nameMr: 'श्री विठ्ठल / भगवान विष्णू',
    nameHi: 'भगवान विष्णु / विट्ठल',
    title: 'Preserver of Dharma & Sanctuary of Bhakti',
    iconUrl: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=1000&auto=format&fit=crop&q=80',
    description: 'The upholder of the cosmos who descends in sacred avatars. In Maharashtra, manifested as Lord Vitthala of Pandharpur welcoming every devotee with open arms.',
    associatedTemplesCount: 16,
    popularMantras: ['Hare Krishna Hare Rama', 'Om Namo Bhagavate Vasudevaya', 'Vishnu Sahasranama'],
  },
  {
    id: 'lord_hanuman',
    nameEn: 'Lord Hanuman (Maruti)',
    nameMr: 'श्री हनुमान (बजरंगबली)',
    nameHi: 'भगवान हनुमान (बजरंगबली)',
    title: 'Embodiment of Devotion, Courage & Strength',
    iconUrl: 'https://images.unsplash.com/photo-1618245318763-a15156d6b23c?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1618245318763-a15156d6b23c?w=1000&auto=format&fit=crop&q=80',
    description: 'Supreme devotee of Lord Rama, dispeller of fear and negative vibrations. Revered with the chanting of the Hanuman Chalisa on Tuesdays and Saturdays.',
    associatedTemplesCount: 19,
    popularMantras: ['Shri Hanuman Chalisa', 'Om Hanumate Namaha', 'Maruti Stotra'],
  },
  {
    id: 'goddess_durga',
    nameEn: 'Goddess Durga / Bhavani',
    nameMr: 'आई तुळजाभवानी / महालक्ष्मी',
    nameHi: 'माँ दुर्गा / भवानी',
    title: 'Universal Mother & Supreme Shakti',
    iconUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    description: 'The primordial force (Adi Parashakti) riding the lion, protector of virtuous seekers and kuladevata of countless devotees across Maharashtra and India.',
    associatedTemplesCount: 14,
    popularMantras: ['Sarva Mangala Mangalye', 'Durga Saptashati', 'Mahishasura Mardini Stotram'],
  },
];

export const mockTemples: Temple[] = [
  {
    id: 'temple_dagdusheth',
    name: 'Shreemant Dagdusheth Halwai Ganpati Mandir',
    deityId: 'lord_ganesh',
    deityName: 'Lord Ganesh',
    city: 'Pune',
    state: 'Maharashtra',
    address: 'Budhwar Peth, Shivaji Road, Pune 411002',
    distanceKm: 2.4,
    followersCount: 184500,
    isVerified: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
    liveDarshanStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    darshanTimings: '06:00 AM - 11:00 PM',
    poojaServices: ['Panchamrut Abhishek', 'Sahasravartan', 'Maha Arti', 'Modak Naivedya'],
    govRegNumber: 'MAH-PUN-TRUST-49102-1982',
    whatsappNumber: '+919822012345',
    socialLinks: {
      facebook: 'https://facebook.com/dagdusheth',
      instagram: 'https://instagram.com/dagdusheth',
      youtube: 'https://youtube.com/dagdusheth',
    },
  },
  {
    id: 'temple_siddhivinayak',
    name: 'Shree Siddhivinayak Temple',
    deityId: 'lord_ganesh',
    deityName: 'Lord Ganesh',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'SK Bole Marg, Prabhadevi, Mumbai 400028',
    distanceKm: 148.0,
    followersCount: 312000,
    isVerified: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&auto=format&fit=crop&q=80',
    liveDarshanStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    darshanTimings: '05:30 AM - 10:00 PM',
    poojaServices: ['Kakad Arti', 'Angarki Sankashti Special Pooja', 'Silver Archana'],
    govRegNumber: 'MAH-MUM-TRUST-10291-1976',
    whatsappNumber: '+919820011223',
    socialLinks: {
      facebook: 'https://facebook.com/siddhivinayak',
      instagram: 'https://instagram.com/siddhivinayak',
      youtube: 'https://youtube.com/siddhivinayak',
    },
  },
  {
    id: 'temple_trimbakeshwar',
    name: 'Trimbakeshwar Shiva Jyotirlinga Mandir',
    deityId: 'lord_shiva',
    deityName: 'Lord Shiva',
    city: 'Nashik',
    state: 'Maharashtra',
    address: 'Trimbak, Nashik District 422212',
    distanceKm: 195.0,
    followersCount: 142000,
    isVerified: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
    liveDarshanStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    darshanTimings: '05:30 AM - 09:00 PM',
    poojaServices: ['Rudra Abhishek', 'Maha Mrityunjaya Hawan', 'Kalsarpa Shanti', 'Tri-Sandhya Pooja'],
    govRegNumber: 'MAH-NSK-TRUST-84910-1954',
    whatsappNumber: '+919422033445',
    socialLinks: {
      facebook: 'https://facebook.com/trimbakeshwar',
      instagram: 'https://instagram.com/trimbakeshwar',
      youtube: 'https://youtube.com/trimbakeshwar',
    },
  },
  {
    id: 'temple_pandharpur',
    name: 'Shree Vitthal Rukmini Mandir',
    deityId: 'lord_vishnu',
    deityName: 'Lord Vishnu / Vitthala',
    city: 'Pandharpur',
    state: 'Maharashtra',
    address: 'Main Temple Road, Pandharpur 413304',
    distanceKm: 210.0,
    followersCount: 265000,
    isVerified: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    liveDarshanStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    darshanTimings: '04:00 AM - 11:00 PM',
    poojaServices: ['Padya Pooja (Charan Sparsh)', 'Maha Pooja', 'Dhoop Arti', 'Shej Arti'],
    govRegNumber: 'MAH-SOL-TRUST-00122-1972',
    whatsappNumber: '+919422088990',
    socialLinks: {
      facebook: 'https://facebook.com/vitthalrukmini',
      instagram: 'https://instagram.com/vitthalrukmini',
      youtube: 'https://youtube.com/vitthalrukmini',
    },
  },
  {
    id: 'temple_mangeshi',
    name: 'Shree Manguesh Temple (Ponda)',
    deityId: 'lord_shiva',
    deityName: 'Lord Shiva',
    city: 'Goa',
    state: 'Goa',
    address: 'Priol, Ponda, Goa 403404',
    distanceKm: 420.0,
    followersCount: 88000,
    isVerified: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
    liveDarshanStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    darshanTimings: '06:00 AM - 10:00 PM',
    poojaServices: ['Deepstambha Deepotsav', 'Bilva Abhishek', 'Shiva Sahasranama Archana'],
    govRegNumber: 'GOA-PND-TRUST-30911-1961',
    whatsappNumber: '+918322233445',
    socialLinks: {
      facebook: 'https://facebook.com/mangueshtemple',
      instagram: 'https://instagram.com/mangueshtemple',
      youtube: 'https://youtube.com/mangueshtemple',
    },
  },
  {
    id: 'temple_tuljapur',
    name: 'Shri Tulja Bhavani Temple',
    deityId: 'goddess_durga',
    deityName: 'Goddess Durga / Bhavani',
    city: 'Tuljapur',
    state: 'Maharashtra',
    address: 'Tuljapur, Osmanabad District 413601',
    distanceKm: 280.0,
    followersCount: 198000,
    isVerified: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
    liveDarshanStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    darshanTimings: '05:00 AM - 10:30 PM',
    poojaServices: ['Kunkumarchana', 'Alankar Pooja', 'Chhabina Utsav', 'Gondhal Ritual'],
    govRegNumber: 'MAH-OSM-TRUST-19283-1968',
    whatsappNumber: '+919423011224',
    socialLinks: {
      facebook: 'https://facebook.com/tuljabhavani',
      instagram: 'https://instagram.com/tuljabhavani',
      youtube: 'https://youtube.com/tuljabhavani',
    },
  },
];

export const mockMediaLibrary: MediaItem[] = [
  {
    id: 'chant_om_namah_shivaya',
    category: 'CHANT',
    deityId: 'lord_shiva',
    deityName: 'Lord Shiva',
    titleEn: 'Om Namah Shivaya (Continuous Dhyan Chant)',
    titleMr: 'ॐ नमः शिवाय (अखंड ध्यान नामजप)',
    titleHi: 'ॐ नमः शिवाय (निरन्तर ध्यान जप)',
    viewsCount: 890000,
    duration: 'Continuous Loop',
    isBackgroundChant: true,
    audioFrequency: 432,
    chantLoopText: 'ॐ नमः शिवाय • ॐ नमः शिवाय • ॐ नमः शिवाय',
    chantLoopCount: 108,
    meaning: 'I bow to Lord Shiva, the inner auspiciousness and cosmic transformer of all realities.',
    lyrics: {
      mr: `ॐ नमः शिवाय ।
ॐ नमः शिवाय ।
ॐ नमः शिवाय ।
ॐ नमः शिवाय ।

कर्पूरगौरं करुणावतारं संसारसारं भुजगेन्द्रहारम् ।
सदा वसन्तं हृदयारविन्दे भवं भवानीसहितं नमामि ॥`,
      hi: `ॐ नमः शिवाय।
ॐ नमः शिवाय।
ॐ नमः शिवाय।

कर्पूरगौरं करुणावतारं संसारसारं भुजगेन्द्रहारम्।
सदा वसन्तं हृदयारविन्दे भवं भवानीसहितं नमामि॥`,
      en: `Om Namah Shivaya |
Om Namah Shivaya |
Om Namah Shivaya |

Karpuragauram Karunavataram Sansarasaram Bhujagendraharam |
Sada Vasantam Hridayaravinde Bhavam Bhavanisahitam Namami ||`,
    },
  },
  {
    id: 'chant_manojavam_maruta',
    category: 'CHANT',
    deityId: 'lord_hanuman',
    deityName: 'Lord Hanuman',
    titleEn: 'Manojavam Marutatulyavegam (Hanuman Stotra)',
    titleMr: 'मनोजवं मारुततुल्यवेगं (हनुमान स्तोत्र व जप)',
    titleHi: 'मनोजवं मारुततुल्यवेगं (श्री हनुमान स्तोत्र)',
    viewsCount: 654000,
    duration: 'Continuous Loop',
    isBackgroundChant: true,
    audioFrequency: 528,
    chantLoopText: 'मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम् । वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये ॥',
    chantLoopCount: 108,
    meaning: 'I surrender to Lord Hanuman, who is swift as thought, fast as the wind, master of the senses, supreme among the intelligent, son of the wind, leader of the monkey troop, and supreme messenger of Lord Rama.',
    lyrics: {
      mr: `मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम् ।
वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये ॥

अतुलितबलधामं हेमशैलाभदेहं
दनुजवनकृशानुं ज्ञानिनामग्रगण्यम् ।
सकलगुणनिधानं वानराणामधीशं
रघुपतिप्रियभक्तं वातजातं नमामि ॥`,
      hi: `मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम्।
वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये॥

अतुलितबलधामं हेमशैलाभदेहं
दनुजवनकृशानुं ज्ञानिनामग्रगण्यम्।
सकलगुणनिधानं वानराणामधीशं
रघुपतिप्रियभक्तं वातजातं नमामि॥`,
      en: `Manojavam Marutatulyavegam Jitendriyam Buddhimatam Varishtham |
Vatatmajam Vanarayuthamukhyam Shriramadutam Sharanam Prapadye ||

Atulitabaladhamam Hemashailabhadeham
Danujavanakrishanum Jnyaninamagraganyam |
Sakalagunanidhanam Vanaranamadhisham
Raghupatipriyabhaktam Vatajatam Namami ||`,
    },
  },
  {
    id: 'chant_hare_krishna',
    category: 'CHANT',
    deityId: 'lord_vishnu',
    deityName: 'Lord Vishnu / Vitthala',
    titleEn: 'Hare Krishna Mahamantra (108 Japa Chant)',
    titleMr: 'हरे कृष्ण महामंत्र (१०८ नामस्मरण जप)',
    titleHi: 'हरे कृष्ण महामंत्र (निरन्तर नाम जप)',
    viewsCount: 1200000,
    duration: 'Continuous Loop',
    isBackgroundChant: true,
    audioFrequency: 432,
    chantLoopText: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे । हरे राम हरे राम राम राम हरे हरे ॥',
    meaning: 'O Supreme Lord Krishna and Divine Energy Radha, please engage me in Your devotional service.',
    lyrics: {
      mr: `हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे ।
हरे राम हरे राम राम राम हरे हरे ॥

विठ्ठल विठ्ठल गजरी ।
प्रेम सुखाची ही शिदोरी ॥`,
      hi: `हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे।
हरे राम हरे राम राम राम हरे हरे॥`,
      en: `Hare Krishna Hare Krishna Krishna Krishna Hare Hare |
Hare Rama Hare Rama Rama Rama Hare Hare ||`,
    },
  },
  {
    id: 'chant_gayatri_mantra',
    category: 'CHANT',
    deityId: 'lord_shiva',
    deityName: 'Maa Gayatri / Surya',
    titleEn: 'Gayatri Mahamantra (Vedic Solar Chant)',
    titleMr: 'गायत्री महामंत्र (वेदमंत्र ध्यान जप)',
    titleHi: 'गायत्री महामन्त्र (सूर्य ध्यान जप)',
    viewsCount: 940000,
    duration: 'Continuous Loop',
    isBackgroundChant: true,
    audioFrequency: 528,
    chantLoopText: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥',
    meaning: 'We meditate on the supreme splendor of the Divine Sun, who illuminates everything. May that divine light awaken and guide our intellect.',
    lyrics: {
      mr: `ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं ।
भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥`,
      hi: `ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं।
भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥`,
      en: `Om Bhur Bhuvah Svaha Tat Savitur Varenyam |
Bhargo Devasya Dheemahi Dhiyo Yo Nah Prachodayat ||`,
    },
  },
  {
    id: 'chant_maha_mrityunjaya',
    category: 'CHANT',
    deityId: 'lord_shiva',
    deityName: 'Lord Shiva',
    titleEn: 'Maha Mrityunjaya Mantra (Healing Chant)',
    titleMr: 'महामृत्युंजय मंत्र (रोगमुक्ती व आरोग्य जप)',
    titleHi: 'महामृत्युंजय मन्त्र (आरोग्य एवं सुरक्षा जप)',
    viewsCount: 720000,
    duration: 'Continuous Loop',
    isBackgroundChant: true,
    audioFrequency: 432,
    chantLoopText: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥',
    meaning: 'We worship the three-eyed Lord Shiva who nourishes all beings. May He liberate us from death and bondages for the sake of immortality.',
    lyrics: {
      mr: `ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ।
उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥`,
      hi: `ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।
उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥`,
      en: `Om Tryambakam Yajamahe Sugandhim Pushtivardhanam |
Urvarukamiva Bandhanan Mrityor Mukshiya Mamritat ||`,
    },
  },
  {
    id: 'chant_ram_naam',
    category: 'CHANT',
    deityId: 'lord_hanuman',
    deityName: 'Lord Rama',
    titleEn: 'Shri Ram Jai Ram Jai Jai Ram (Taraka Mantra)',
    titleMr: 'श्री राम जय राम जय जय राम (तारक मंत्र जप)',
    titleHi: 'श्री राम जय राम जय जय राम (तारक मन्त्र)',
    viewsCount: 810000,
    duration: 'Continuous Loop',
    isBackgroundChant: true,
    audioFrequency: 432,
    chantLoopText: 'श्री राम जय राम जय जय राम • श्री राम जय राम जय जय राम',
    meaning: 'Victory to Lord Rama, the indwelling light of bliss and peace.',
    lyrics: {
      mr: `श्री राम जय राम जय जय राम ।
श्री राम जय राम जय जय राम ॥`,
      hi: `श्री राम जय राम जय जय राम।
श्री राम जय राम जय जय राम॥`,
      en: `Shri Ram Jai Ram Jai Jai Ram |
Shri Ram Jai Ram Jai Jai Ram ||`,
    },
  },
  {
    id: 'media_ganpati_arti',
    category: 'ARTI',
    deityId: 'lord_ganesh',
    deityName: 'Lord Ganesh',
    titleEn: 'Sukhkarta Dukhharta (Shri Ganesh Arti)',
    titleMr: 'सुखकर्ता दुखहर्ता (श्री गणपतीची आरती)',
    titleHi: 'सुखकर्ता दुखहर्ता (श्री गणपति आरती)',
    viewsCount: 342000,
    duration: '04:12',
    audioUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    pdfUrl: '/assets/docs/ganpati_arti.pdf',
    pdfPageCount: 3,
    lyrics: {
      mr: `सुखकर्ता दुखहर्ता वार्ता विघ्नाची ।
नुरवी पुरवी प्रेम कृपा जयाची ॥
सर्वांगी सुंदर उटी शेंदुराची ।
कंठी झळके माळ मुक्ताफळांची ॥ १ ॥

जय देव जय देव जय मंगलमूर्ती ।
दर्शनमात्रे मनकामना पुरती ॥ ध्रु० ॥

रत्नखचित फरा तूज गौरीकुमरा ।
चंदनाची उटी कुमकुमकेशरा ॥
हिरेजडित मुकुट शोभतो बरा ।
रुणझुणती नूपुरे चरणी घागरिया ॥ २ ॥`,
      hi: `सुखकर्ता दुखहर्ता वार्ता विघ्न की।
नुरवी पुरवी प्रेम कृपा जिसकी॥
सर्वांग सुन्दर उटी सिन्दूर की।
कंठ झलके माल मुक्ताफल की॥ १ ॥

जय देव जय देव जय मंगलमूर्ति।
दर्शनमात्र से मनकामना पूरती॥ ध्रु० ॥`,
      en: `Sukhkarta Dukhharta Varta Vighnachi |
Nurvi Purvi Prem Krupa Jayachi ||
Sarvangi Sundar Uti Shendurachi |
Kanthi Zalke Maal Muktaphallanchi || 1 ||

Jai Dev Jai Dev Jai Mangalmoorti |
Darshanmaatre Manakamana Purti || Dhrva ||`,
    },
  },
  {
    id: 'media_shiv_tandav',
    category: 'STOTRA',
    deityId: 'lord_shiva',
    deityName: 'Lord Shiva',
    titleEn: 'Shiva Tandava Stotram',
    titleMr: 'शिव तांडव स्तोत्रम् (रावणकृत)',
    titleHi: 'शिव ताण्डव स्तोत्रम् (रावणकृत)',
    viewsCount: 489000,
    duration: '09:20',
    audioUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    pdfUrl: '/assets/docs/shiva_tandav_stotra.pdf',
    pdfPageCount: 8,
    lyrics: {
      mr: `जटाटवीगलज्जलप्रवाहपावितस्थले
गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम् ।
डमड्डमड्डमड्डमन्निनादवड्डमर्वयं
चकार चण्डताण्डवं तनोतु नः शिवः शिवम् ॥ १ ॥

जटाकटाहसम्भ्रमभ्रमन्निलिम्पनिर्झरी-
विलोलवीचिवल्लरीविराजमानमूर्धनि ।
धगद्धगद्धगज्ज्वलल्ललाटपट्टपावके
किशोरचन्द्रशेखरे रतिः प्रतिक्षणं मम ॥ २ ॥`,
      hi: `जटाटवीगलज्जलप्रवाहपावितस्थले
गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम्।
डमड्डमड्डमड्डमन्निनादवड्डमर्वयं
चकार चण्डताण्डवं तनोतु नः शिवः शिवम्॥ १॥`,
      en: `Jatatavigalajjala pravahapavitasthale
Galeavalambya lambitam bhujangatungamalikam |
Damaddamaddamaddaman ninadavaddamarvayam
Chakara chandatandavam tanotu nah shivah shivam || 1 ||`,
    },
  },
  {
    id: 'media_hanuman_chalisa',
    category: 'STOTRA',
    deityId: 'lord_hanuman',
    deityName: 'Lord Hanuman',
    titleEn: 'Shri Hanuman Chalisa (Awadhi/Hindi)',
    titleMr: 'श्री हनुमान चालीसा (४० चौपाया)',
    titleHi: 'श्री हनुमान चालीसा (गोस्वामी तुलसीदास)',
    viewsCount: 780000,
    duration: '07:45',
    audioUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    pdfUrl: '/assets/docs/hanuman_chalisa_script.pdf',
    pdfPageCount: 6,
    lyrics: {
      mr: `श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि ।
बरनउं रघुबर बिमल जसु जो दायकु फल चारि ॥
बुद्धिहीन तनु जानिके सुमिरौं पवन-कुमार ।
बल बुद्धि बिद्या देहु मोहिं हरहु कलेस बिकार ॥

जय हनुमान ज्ञान गुन सागर ।
जय कपीस तिहुं लोक उजागर ॥
राम दूत अतुलित बल धामा ।
अंजनि-पुत्र पवनसुत नामा ॥`,
      hi: `श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि।
बरनउं रघुबर बिमल जसु जो दायकु फल चारि॥
बुद्धिहीन तनु जानिके सुमिरौं पवन-कुमार।
बल बुद्धि बिद्या देहु मोहिं हरहु कलेस बिकार॥

जय हनुमान ज्ञान गुन सागर।
जय कपीस तिहुं लोक उजागर॥
राम दूत अतुलित बल धामा।
अंजनि-पुत्र पवनसुत नामा॥`,
      en: `Shree Guru Charan Saroj Raj Nij Manu Mukuru Sudhari |
Barnau Raghubar Bimal Jasu Jo Dayaku Phal Chari ||
Buddhiheen Tanu Janike Sumirau Pavan Kumar |
Bal Buddhi Vidya Dehu Mohi Harahu Kalesh Bikar ||

Jai Hanuman Gyan Gun Sagar |
Jai Kapis Tihun Lok Ujagar ||`,
    },
  },
  {
    id: 'media_chaturmas_book',
    category: 'CHATURMAS_BOOK',
    deityId: 'lord_vishnu',
    deityName: 'Lord Vishnu / Vitthala',
    titleEn: 'Chaturmas Mahatmya & Vrat Kathasar',
    titleMr: 'चातुर्मास महात्म्य आणि व्रत कथासार',
    titleHi: 'चातुर्मास माहात्म्य एवं व्रत कथासार',
    viewsCount: 165000,
    duration: '32 Chapters',
    pdfUrl: '/assets/docs/chaturmas_vrat_katha.pdf',
    pdfPageCount: 144,
    lyrics: {
      mr: `चातुर्मास म्हणजे आषाढ शुद्ध एकादशी (शयनी एकादशी) ते कार्तिकी शुद्ध एकादशी (प्रबोधिनी एकादशी) पर्यंतचा चार महिन्यांचा पवित्र काळ.
या काळात भगवान श्रीविष्णू योगनिद्रेत असतात.
या पवित्र काळात जप, ध्यान, पुराण श्रवण, पारायण, आणि उपवास यांचे अनंत पटींनी फळ मिळते.
या ग्रंथात संपूर्ण ३२ अध्यायांचे मराठी निरूपण आणि दैनंदिन व्रतनियम समाविष्ट आहेत.`,
      hi: `चातुर्मास आषाढ़ शुक्ल एकादशी (देवशयनी) से कार्तिक शुक्ल एकादशी (देवउठनी) तक का परम पावन चतुर्मास काल है।
इस अवधि में प्रतिदिन नित्य नाम जप, गीता पाठ, और व्रत अनुष्ठान करने से साधक को मोक्ष एवं मानसिक शांति प्राप्त होती है।`,
      en: `Chaturmas represents the sacred four-month monsoon epoch from Ashadha Shukla Ekadashi to Kartika Ekadashi.
During this period, sacred sadhana, mantra jaap, and scripture study generate exponential spiritual merit.
This book contains daily chapters, vrat guidelines, and sacred stories.`,
    },
  },
  {
    id: 'media_vitthal_abhang',
    category: 'BHAJAN',
    deityId: 'lord_vishnu',
    deityName: 'Lord Vishnu / Vitthala',
    titleEn: 'Roop Pahata Lochani (Sant Dnyaneshwar)',
    titleMr: 'रूप पाहता लोचनी सुख झाले वो साजणी (अभंग)',
    titleHi: 'रूप पाहता लोचनी सुख झाले वो साजणी (अभंग)',
    viewsCount: 420000,
    duration: '05:30',
    audioUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    pdfUrl: '/assets/docs/roop_pahata_lochani.pdf',
    pdfPageCount: 2,
    lyrics: {
      mr: `रूप पाहता लोचनी । सुख झाले वो साजणी ॥ १ ॥
तो हा विठ्ठल बरवा । तो हा माधव बरवा ॥ २ ॥
बहुता सुकृताची जोडी । म्हणुनी विठ्ठली आवडी ॥ ३ ॥
सर्व सुखाचे आगर । बाप रखुमादेवीवरू ॥ ४ ॥`,
      hi: `रूप पाहता लोचनी। सुख झाले वो साजणी॥ १ ॥
तो हा विट्ठल बरवा। तो हा माधव बरवा॥ २ ॥`,
      en: `Roop Pahata Lochani | Sukh Zale Vo Sajani || 1 ||
To Ha Vitthal Barawa | To Ha Madhav Barawa || 2 ||
Bahuta Sukrutachi Jodi | Mhanuni Vitthali Aawadi || 3 ||
Sarva Sukhache Aagar | Baap Rakhumadevicaru || 4 ||`,
    },
  },
  {
    id: 'media_durga_arti',
    category: 'ARTI',
    deityId: 'goddess_durga',
    deityName: 'Goddess Durga / Bhavani',
    titleEn: 'Durge Durgat Bhaari (Shri Bhavani Arti)',
    titleMr: 'दुर्गे दुर्घट भारी तुजविण संसारी (आई भवानी आरती)',
    titleHi: 'दुर्गे दुर्घट भारी तुजविण संसारी (भवानी आरती)',
    viewsCount: 310000,
    duration: '04:45',
    audioUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    pdfUrl: '/assets/docs/durga_arti.pdf',
    pdfPageCount: 2,
    lyrics: {
      mr: `दुर्गे दुर्घट भारी तुजविण संसारी ।
अनाथनाथे अंबे करुणा विस्तारी ॥
वारी वारी जन्ममरणाते वारी ।
हारी पडलो आता संकट निवारी ॥ १ ॥

जय देवी जय देवी जय महिषासुरमर्दिनी ।
सुरवरईश्वरवरदे तारक संजीवनी ॥ ध्रु० ॥`,
      hi: `दुर्गे दुर्घट भारी तुजविण संसारी।
अनाथनाथे अंबे करुणा विस्तारी॥
जय देवी जय देवी जय महिषासुरमर्दिनी॥`,
      en: `Durge Durghat Bhaari Tujvin Sansari |
Anathanathe Ambe Karuna Vistari ||
Jai Devi Jai Devi Jai Mahishasuramardini ||`,
    },
  },
];

export const mockTrustMembers: TrustMember[] = [
  {
    id: 'member_1',
    name: 'Pandit Rameshwar Joshi',
    email: 'rameshwar.joshi@dagdushethtrust.org',
    mobile: '+91 98220 11001',
    role: 'POOJARI_RITUALS',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2023-01-15',
    active: true,
  },
  {
    id: 'member_2',
    name: 'Anil Deshmukh (Trustee)',
    email: 'anil.deshmukh@dagdushethtrust.org',
    mobile: '+91 98220 11002',
    role: 'DONATIONS_FINANCE',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2022-06-10',
    active: true,
  },
  {
    id: 'member_3',
    name: 'Pooja Kulkarni',
    email: 'pooja.media@dagdushethtrust.org',
    mobile: '+91 98220 11003',
    role: 'MEDIA',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2024-03-01',
    active: true,
  },
  {
    id: 'member_4',
    name: 'Santosh Shinde',
    email: 'santosh.marketing@dagdushethtrust.org',
    mobile: '+91 98220 11004',
    role: 'MARKETING',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2023-11-20',
    active: true,
  },
  // Seat 5 is open (allows testing strict max 5 seats rule)
];

export const mockTempleEvents: TempleEvent[] = [
  {
    id: 'event_angarki',
    templeId: 'temple_dagdusheth',
    templeName: 'Shreemant Dagdusheth Halwai Mandir',
    title: 'Angarki Sankashti Chaturthi Maha Mahotsav',
    deityId: 'lord_ganesh',
    dateTime: 'Tuesday, Sep 15 • 04:00 AM - 11:59 PM',
    panchangTithi: 'Krishna Paksha Chaturthi',
    expectedDevotees: 150000,
    isLiveDarshanLinked: true,
    status: 'UPCOMING',
  },
  {
    id: 'event_rudra_abhishek',
    templeId: 'temple_trimbakeshwar',
    templeName: 'Trimbakeshwar Shiva Jyotirlinga',
    title: 'Maha Somwar Laghu Rudra Abhishek',
    deityId: 'lord_shiva',
    dateTime: 'Monday, Sep 21 • 06:00 AM - 12:00 PM',
    panchangTithi: 'Shukla Paksha Ashtami',
    expectedDevotees: 45000,
    isLiveDarshanLinked: true,
    status: 'UPCOMING',
  },
  {
    id: 'event_ekadashi',
    templeId: 'temple_pandharpur',
    templeName: 'Shree Vitthal Rukmini Mandir',
    title: 'Kartika Ekadashi Purva Maha Bhakti Melava',
    deityId: 'lord_vishnu',
    dateTime: 'Saturday, Sep 26 • 05:00 AM - 09:00 PM',
    panchangTithi: 'Shukla Paksha Ekadashi',
    expectedDevotees: 220000,
    isLiveDarshanLinked: true,
    status: 'UPCOMING',
  },
];

export const mockDonations: DonationRecord[] = [
  {
    id: 'don_901',
    donorName: 'Dr. Sudhir Ranade',
    donorEmail: 'sudhir.ranade@example.com',
    donorMobile: '+91 98230 45671',
    amount: 11000,
    currency: 'INR',
    purpose: 'Annadaan',
    paymentStatus: 'SUCCESS',
    date: '2026-09-11 09:14 AM',
    receiptNumber: 'RCPT-DAG-2026-0941',
  },
  {
    id: 'don_902',
    donorName: 'Smt. Radhika Apte',
    donorEmail: 'radhika.apte@example.com',
    donorMobile: '+91 98200 98123',
    amount: 5100,
    currency: 'INR',
    purpose: 'Special Pooja Archana',
    paymentStatus: 'SUCCESS',
    date: '2026-09-10 03:22 PM',
    receiptNumber: 'RCPT-DAG-2026-0942',
  },
  {
    id: 'don_903',
    donorName: 'Mahesh B. Kulkarni',
    donorEmail: 'mb.kulkarni@example.com',
    donorMobile: '+91 94220 33119',
    amount: 25000,
    currency: 'INR',
    purpose: 'Temple Construction',
    paymentStatus: 'SUCCESS',
    date: '2026-09-09 11:45 AM',
    receiptNumber: 'RCPT-DAG-2026-0943',
  },
  {
    id: 'don_904',
    donorName: 'Sunil G. Patil',
    donorEmail: 'sunil.patil@example.com',
    donorMobile: '+91 98900 12388',
    amount: 1001,
    currency: 'INR',
    purpose: 'General Seva',
    paymentStatus: 'SUCCESS',
    date: '2026-09-08 07:10 PM',
    receiptNumber: 'RCPT-DAG-2026-0944',
  },
];

export const mockCompliance: TrustComplianceInfo = {
  trustName: 'Shreemant Dagdusheth Halwai Ganpati Mandir Trust',
  govRegNumber: 'MAH-PUN-TRUST-49102-1982',
  registrationDate: '1982-04-18',
  expiryDate: '2028-12-31',
  status: 'ACTIVE',
  lastAttestationDate: '2026-08-15',
  nextMonthlyAttestationDate: '2026-09-15',
  trusteeNames: [
    'Shri Manikchand Halwai (President)',
    'Shri Ashok Godse (Secretary)',
    'Shri Mahesh Suryavanshi (Treasurer)',
    'Adv. Hemant Rasane (Legal Trustee)',
  ],
  isConfirmedThisMonth: true,
};

export const mockPanchang: PanchangInfo = {
  dateStr: 'Friday, 11 September 2026',
  hinduMonth: 'Bhadrapada (भाद्रपद शुक्ल पक्ष)',
  tithi: 'Shukla Dashami (दशमी)',
  paksha: 'Shukla Paksha (शुक्ल)',
  nakshatra: 'Uttara Phalguni (उत्तरा फाल्गुनी)',
  yoga: 'Siddhi Yoga (सिद्धि योग)',
  karana: 'Garaja Karana (गरज)',
  sunrise: '06:14 AM',
  sunset: '06:36 PM',
  rahuKaal: '10:48 AM - 12:19 PM (अशुभ काळ)',
  abhijitMuhurat: '11:58 AM - 12:47 PM (सर्वोत्तम मुहूर्त)',
  festival: 'Auspicious Ekadashi Purva Sandhya & Ganpati Utsav preparations',
};

export const mockShorts: SpiritualShort[] = [
  {
    id: 'short_1',
    authorName: 'Pandit Rajesh Sharma',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    templeName: 'Dagdusheth Ganpati Mandir',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1567591370504-20a2d2188849?w=600&auto=format&fit=crop&q=80',
    caption: 'Bappa divine morning abhishek and Pushpa vrushti! May your home be blessed with health & prosperity. 🌸🙏',
    likesCount: 14200,
    commentsCount: 384,
    sharesCount: 1200,
    deityTag: 'Lord Ganesh',
  },
  {
    id: 'short_2',
    authorName: 'Trimbakeshwar Sanctum',
    authorAvatar: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=150&auto=format&fit=crop&q=80',
    templeName: 'Trimbakeshwar Jyotirlinga',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=600&auto=format&fit=crop&q=80',
    caption: 'Maha Rudra Chanting reverberating in the holy sanctum of Brahmagiri. Feel the transcendental vibration.',
    likesCount: 22100,
    commentsCount: 650,
    sharesCount: 3400,
    deityTag: 'Lord Shiva',
  },
  {
    id: 'short_3',
    authorName: 'Pandharpur Bhakti Mandali',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    templeName: 'Vitthal Mandir, Pandharpur',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    caption: 'Varkari Bhajan: "रूप पाहता लोचनी, सुख झाले वो साजणी..." Pure divine ecstasy on the banks of Chandrabhaga.',
    likesCount: 31000,
    commentsCount: 910,
    sharesCount: 5200,
    deityTag: 'Lord Vishnu / Vitthala',
  },
];

export const mockTrustSubmissions: import('../types/anant.ts').TrustRegistrationSubmission[] = [
  {
    id: 'sub_alandi_dnyaneshwar',
    trustLegalName: 'Shri Sant Dnyaneshwar Maharaj Sansthan Committee',
    templeName: 'Alandi Devachi Temple Sanctum',
    deityId: 'lord_vishnu',
    city: 'Pune',
    state: 'Maharashtra',
    address: 'Indrayani River Bank, Alandi Devachi, Pune 412105',
    govRegNumber: 'MAH-PUN-TRUST-00109-1952',
    charityCommissionerDistrict: 'Pune Region Division 1',
    certificateFileName: 'Govt_Charity_Cert_Alandi_Sansthan_1952.pdf',
    certificateFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    expiryDate: '2028-12-31',
    tax80GNumber: 'AAATS1928DF20214',
    trustees: [
      {
        name: 'Adv. Vikas Chandrakant Dhage',
        designation: 'President / Trustee Chief',
        mobile: '+919822100200',
        panOrAadhaarRef: 'ABCDE1234F',
      },
      {
        name: 'Yogesh Vinayak Aradhye',
        designation: 'Secretary',
        mobile: '+919822100201',
        panOrAadhaarRef: 'FGHIJ5678K',
      },
      {
        name: 'Dr. Abhaykumar Kulkarni',
        designation: 'Treasurer',
        mobile: '+919822100202',
        panOrAadhaarRef: 'KLMNO9012P',
      },
    ],
    status: 'PENDING_VERIFICATION',
    submittedAt: '2026-09-08T10:30:00.000Z',
    applicantEmail: 'trustee.alandi@dnyaneshwar.org',
    applicantMobile: '+919822100200',
  },
  {
    id: 'sub_kolhapur_mahalakshmi',
    trustLegalName: 'Shri Karveer Nivasini Mahalakshmi Ambabai Devasthan Management Committee',
    templeName: 'Shri Ambabai Mahalakshmi Mandir',
    deityId: 'goddess_durga',
    city: 'Kolhapur',
    state: 'Maharashtra',
    address: 'Bhavani Mandap Road, Kolhapur 416012',
    govRegNumber: 'MAH-KOL-DEV-00482-1969',
    charityCommissionerDistrict: 'Kolhapur South District',
    certificateFileName: 'Charity_Commission_Registration_Ambabai_1969.pdf',
    certificateFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    expiryDate: '2029-06-30',
    tax80GNumber: 'AABTK4491GF20191',
    trustees: [
      {
        name: 'Shivraj R. Ghatge',
        designation: 'President / Trustee Chief',
        mobile: '+919422055667',
        panOrAadhaarRef: 'PQRS5678T',
      },
      {
        name: 'Hemant Shankarrao Patil',
        designation: 'Secretary',
        mobile: '+919422055668',
        panOrAadhaarRef: 'UVWX1234Y',
      },
    ],
    status: 'PENDING_VERIFICATION',
    submittedAt: '2026-09-10T14:15:00.000Z',
    applicantEmail: 'admin@mahalakshmikolhapur.org',
    applicantMobile: '+919422055667',
  },
  {
    id: 'sub_dagdusheth_approved',
    trustLegalName: 'Shreemant Dagdusheth Halwai Sarvajanik Ganpati Trust',
    templeName: 'Shreemant Dagdusheth Halwai Ganpati Mandir',
    deityId: 'lord_ganesh',
    city: 'Pune',
    state: 'Maharashtra',
    address: 'Budhwar Peth, Shivaji Road, Pune 411002',
    govRegNumber: 'MAH-PUN-TRUST-49102-1982',
    charityCommissionerDistrict: 'Pune Central Commissionerate',
    certificateFileName: 'Dagdusheth_Charity_Certificate_Renewed.pdf',
    certificateFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    expiryDate: '2030-03-31',
    tax80GNumber: 'AAATD4910EF20202',
    trustees: [
      {
        name: 'Sunil Rasane',
        designation: 'President / Trustee Chief',
        mobile: '+919822012345',
        panOrAadhaarRef: 'XYZD49102P',
      },
      {
        name: 'Mahesh Suryavanshi',
        designation: 'Treasurer',
        mobile: '+919822012346',
        panOrAadhaarRef: 'MNOD49102Q',
      },
    ],
    status: 'APPROVED',
    submittedAt: '2026-01-15T09:00:00.000Z',
    reviewedAt: '2026-01-18T16:00:00.000Z',
    reviewerNotes: 'Official government charity commissioner records authenticated. Golden trust seal issued.',
    applicantEmail: 'trust@dagdushethganpati.com',
    applicantMobile: '+919822012345',
  },
];

// =============================================================================
// Virtual Queue & Timed Darshan Slots Mock Data
// =============================================================================
export const mockDarshanSlots: DarshanSlot[] = [
  {
    id: 'slot_dag_morn_1',
    templeId: 'temple_dagdusheth',
    templeName: 'Shreemant Dagdusheth Halwai Ganpati Mandir, Pune',
    date: '2026-09-12',
    timeSlot: '06:00 AM - 07:30 AM',
    festivalName: 'Bhadrapada Ganesh Chaturthi Utsav',
    quotaType: 'GENERAL',
    maxCapacity: 450,
    bookedCount: 388,
    status: 'FILLING_FAST',
    gateNumber: 'Gate 1 (Shivaji Road)',
    reportingTimeMinutesBefore: 15,
  },
  {
    id: 'slot_dag_vip_2',
    templeId: 'temple_dagdusheth',
    templeName: 'Shreemant Dagdusheth Halwai Ganpati Mandir, Pune',
    date: '2026-09-12',
    timeSlot: '08:00 AM - 09:00 AM',
    festivalName: 'Morning Mahapooja & Aarti Darshan',
    quotaType: 'VIP',
    maxCapacity: 120,
    bookedCount: 118,
    status: 'FILLING_FAST',
    gateNumber: 'Gate 2 (VIP Pass Entry)',
    reportingTimeMinutesBefore: 10,
  },
  {
    id: 'slot_dag_senior_3',
    templeId: 'temple_dagdusheth',
    templeName: 'Shreemant Dagdusheth Halwai Ganpati Mandir, Pune',
    date: '2026-09-12',
    timeSlot: '10:00 AM - 11:30 AM',
    festivalName: 'Senior Citizens & Divyangjan Priority Queue',
    quotaType: 'SENIOR_DIVYANG',
    maxCapacity: 200,
    bookedCount: 84,
    status: 'OPEN',
    gateNumber: 'Gate 3 (Accessible Ramp Entry)',
    reportingTimeMinutesBefore: 15,
  },
  {
    id: 'slot_trim_shiva_1',
    templeId: 'temple_trimbakeshwar',
    templeName: 'Trimbakeshwar Jyotirlinga Mandir, Nashik',
    date: '2026-09-12',
    timeSlot: '05:30 AM - 07:00 AM',
    festivalName: 'Shravani Somvar / Mahashivratri Sanctum Darshan',
    quotaType: 'SPECIAL_UTSAV',
    maxCapacity: 600,
    bookedCount: 590,
    status: 'FILLING_FAST',
    gateNumber: 'East Mahadwar',
    reportingTimeMinutesBefore: 20,
  },
  {
    id: 'slot_siddhi_eve_1',
    templeId: 'temple_siddhivinayak',
    templeName: 'Shree Siddhivinayak Ganapati Mandir, Mumbai',
    date: '2026-09-12',
    timeSlot: '07:00 PM - 08:30 PM',
    festivalName: 'Evening Maha Mangal Aarti Darshan',
    quotaType: 'GENERAL',
    maxCapacity: 500,
    bookedCount: 500,
    status: 'FULL',
    gateNumber: 'Gate 4 (Prabhadevi)',
    reportingTimeMinutesBefore: 20,
  },
];

export const mockDarshanPasses: DarshanPass[] = [
  {
    id: 'pass_dag_2026_01',
    slotId: 'slot_dag_morn_1',
    tokenNumber: 'DAG-2026-Q042',
    devoteeName: 'Kunal V. Wagh',
    devoteeMobile: '+91 98220 11223',
    devoteeCount: 2,
    idProofNumber: 'Aadhaar: **** 4891',
    templeId: 'temple_dagdusheth',
    templeName: 'Shreemant Dagdusheth Halwai Ganpati Mandir',
    date: '2026-09-12',
    timeSlot: '06:00 AM - 07:30 AM',
    gateNumber: 'Gate 1 (Shivaji Road)',
    quotaType: 'GENERAL',
    verificationStatus: 'ISSUED',
    qrPayload: 'ANANT_PASS:DAG-2026-Q042:KUNAL_WAGH:COUNT2:GATE1:2026-09-12:06:00',
    issuedAt: '2026-09-11T20:15:00.000Z',
  },
];

// =============================================================================
// E-Pooja & Seva Booking with Live Stream Mock Data
// =============================================================================
export const mockEPoojaSevas: EPoojaSeva[] = [
  {
    id: 'seva_dag_atharvashirsha',
    templeId: 'temple_dagdusheth',
    templeName: 'Shreemant Dagdusheth Halwai Ganpati Mandir, Pune',
    deityId: 'lord_ganesh',
    titleEn: 'Ganpati Atharvashirsha Sahasravartan Abhishek (1,000 Chants)',
    titleMr: 'गणपती अथर्वशीर्ष सहस्रावर्तन अभिषेक व विशेष पूजा',
    priceInr: 2100,
    durationMinutes: 75,
    description: 'Special panchamrut abhishek accompanied by 1,000 collective recitations of the sacred Sri Ganapati Atharvashirsha by Veda Murti priests. Devotees participate via private live video stream.',
    priestName: 'Pandit Ravindra Guruji & 5 Vedic Shastris',
    includesPrasadCourier: true,
    liveStreamPlatform: 'YOUTUBE_PRIVATE',
    streamUrlTemplate: 'https://youtube.com/live/private_demo_atharvashirsha',
    itemsIncluded: [
      'Devotee Sankalp with Karta Name, Gotra & Nakshatra',
      'Panchamrut & Durva Abhishek to Lord Ganesh',
      'Modak Naivedya offering',
      'Consecrated Silver Ganesh Coin & Modak Prasad couriered to address',
      'Private High-Definition Live Stream Access',
    ],
    bannerImageUrl: 'https://images.unsplash.com/photo-1567591370504-20a2d2188849?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'seva_trim_rudrabhishek',
    templeId: 'temple_trimbakeshwar',
    templeName: 'Trimbakeshwar Jyotirlinga Mandir, Nashik',
    deityId: 'lord_shiva',
    titleEn: 'Maha Rudrabhishek with Bilva Archana & Ganga Jal',
    titleMr: 'महा रुद्राभिषेक, बिल्वार्चन व गंगाजल अर्पण सेवा',
    priceInr: 1500,
    durationMinutes: 60,
    description: 'Potent Vedic Rudrabhishekam performed directly at the sacred Jyotirlinga sanctum invoking cosmic peace, health and karmic cleansing.',
    priestName: 'Acharya Vidyadhar Joshi (Chief Archak)',
    includesPrasadCourier: true,
    liveStreamPlatform: 'JITSI_MEET',
    streamUrlTemplate: 'https://meet.jit.si/AnantSpiritual_Trimbak_Rudrabhishek',
    itemsIncluded: [
      'Sankalp in devotee family name with Gotra',
      'Continuous stream of sacred Godavari & Gangajal',
      '108 Bilva Patra Archana with Namakam & Chamakam',
      'Bhasma, Vibhuti & Rudraksha Prasad couriered to home',
      'Interactive 2-way Priest Blessing over Jitsi',
    ],
    bannerImageUrl: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'seva_siddhi_aarti',
    templeId: 'temple_siddhivinayak',
    templeName: 'Shree Siddhivinayak Ganapati Mandir, Mumbai',
    deityId: 'lord_ganesh',
    titleEn: 'Kasturi Arghya & Special Kakad Aarti Seva',
    titleMr: 'कस्तुरी अर्घ्य व विशेष काकड आरती दर्शन सेवा',
    priceInr: 1100,
    durationMinutes: 45,
    description: 'Dawn Kakad Aarti performed inside the sanctum sanctorum with sacred saffron, chandan paste and floral garlands dedicated to Gajanana.',
    priestName: 'Purohit Chandrashekhar Bhatt',
    includesPrasadCourier: true,
    liveStreamPlatform: 'YOUTUBE_PRIVATE',
    streamUrlTemplate: 'https://youtube.com/live/private_demo_siddhivinayak_aarti',
    itemsIncluded: [
      'Devotee Sankalp announcement during morning Aarti',
      'Garland and Peetham offering in devotee name',
      'Blessed Peda Prasad & Angavastra dispatched via speed post',
    ],
    bannerImageUrl: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'seva_navgrah_shanti',
    templeId: 'temple_dagdusheth',
    templeName: 'Shreemant Dagdusheth Halwai Ganpati Mandir, Pune',
    deityId: 'lord_ganesh',
    titleEn: 'Navgrah Shanti Havan & Nakshatra Dosha Nivaran',
    titleMr: 'नवग्रह शांती होम व नक्षत्र दोष निवारण अनुष्ठान',
    priceInr: 3500,
    durationMinutes: 90,
    description: 'Sacred fire ritual (Homam) harmonizing the nine celestial grahas for mental peace, professional success, and physical longevity.',
    priestName: 'Pandit Dinkar Shastri',
    includesPrasadCourier: true,
    liveStreamPlatform: 'YOUTUBE_PRIVATE',
    streamUrlTemplate: 'https://youtube.com/live/private_demo_navgrah_havan',
    itemsIncluded: [
      'Complete Navgrah Ahuti and Havan Sankalp',
      'Nine sacred Samidhas and consecrated Raksha (sacred thread)',
      'Dry fruit Prasad and energised Navgrah Yantra delivered home',
      'Full private HD livestream link sent to WhatsApp',
    ],
    bannerImageUrl: 'https://images.unsplash.com/photo-1618245318763-a15156d6b23c?w=600&auto=format&fit=crop&q=80',
  },
];

export const mockSevaBookings: SevaBooking[] = [
  {
    id: 'booking_seva_101',
    sevaId: 'seva_dag_atharvashirsha',
    sevaTitle: 'Ganpati Atharvashirsha Sahasravartan Abhishek',
    templeName: 'Shreemant Dagdusheth Halwai Ganpati Mandir',
    kartaName: 'Kunal V. Wagh',
    gotra: 'Kashyap',
    nakshatra: 'Rohini',
    sankalpPurpose: 'Family Health, Spiritual Well-being & Global Prosperity',
    bookingDate: '2026-09-15',
    timeSlot: '07:00 AM - 08:15 AM',
    amountPaid: 2100,
    currency: 'INR',
    transactionRef: 'UPI-ANANT-SEVA-891042',
    prasadAddress: 'Flat 402, Shiv Sadan, Model Colony, Pune 411016',
    privateStreamUrl: 'https://youtube.com/watch?v=live_demo_dagdusheth_puja_private',
    streamPasscode: 'DAG-PUJA-8910',
    status: 'CONFIRMED',
    bookedAt: '2026-09-11T18:30:00.000Z',
    whatsappConfirmationSent: true,
  },
];

// =============================================================================
// Community Jaap Target (Global Leaderboard) Mock Data
// =============================================================================
export const mockCommunityJaapGoals: CommunityJaapGoal[] = [
  {
    id: 'goal_pune_mahadev_1m',
    templeId: 'temple_trimbakeshwar',
    templeName: 'Pune & Trimbakeshwar Mahadev Trust',
    deityId: 'lord_shiva',
    deityName: 'Lord Shiva (Mahadev)',
    mantraName: 'Om Namah Shivaya',
    mantraDevanagari: 'ॐ नमः शिवाय',
    targetCount: 1000000,
    currentCount: 842108,
    activeDevoteesCount: 3120,
    deadlineDate: '2026-09-30 (Anant Chaturdashi)',
    description: 'Collective Akhand Maha Mantra chanting for world peace, spiritual upliftment and divine grace during holy Chaturmas.',
    topContributors: [
      {
        id: 'user_contributor_1',
        devoteeName: 'Anil S. Kulkarni',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        city: 'Pune',
        malasCount: 450,
        totalBeads: 48600,
        rank: 1,
        badge: 'Shiv Bhakt Ratna',
        lastChantedAt: '12 mins ago',
      },
      {
        id: 'user_contributor_2',
        devoteeName: 'Sadhvi Gayatri Devi',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        city: 'Nashik',
        malasCount: 380,
        totalBeads: 41040,
        rank: 2,
        badge: 'Sadhana Shiromani',
        lastChantedAt: '45 mins ago',
      },
      {
        id: 'user_contributor_3',
        devoteeName: 'Kunal V. Wagh (You)',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        city: 'Pune',
        malasCount: 160,
        totalBeads: 17280,
        rank: 7,
        badge: 'Nitya Japa Sadhu',
        lastChantedAt: 'Just now',
      },
      {
        id: 'user_contributor_4',
        devoteeName: 'Rameshwar Pathak',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        city: 'Mumbai',
        malasCount: 125,
        totalBeads: 13500,
        rank: 12,
        badge: 'Devotee Sevak',
        lastChantedAt: '2 hours ago',
      },
    ],
  },
  {
    id: 'goal_dagdusheth_ganesh_500k',
    templeId: 'temple_dagdusheth',
    templeName: 'Shreemant Dagdusheth Halwai Ganpati Trust',
    deityId: 'lord_ganesh',
    deityName: 'Lord Ganesh',
    mantraName: 'Om Gam Ganapataye Namaha',
    mantraDevanagari: 'ॐ गं गणपतये नमः',
    targetCount: 500000,
    currentCount: 389450,
    activeDevoteesCount: 1840,
    deadlineDate: '2026-09-22 (Ganesh Visarjan)',
    description: 'Sahasranama group offering dedicated to Lord Ganesh for removing all hurdles and bringing harmony.',
    topContributors: [
      {
        id: 'user_g1',
        devoteeName: 'Sunita Joshi',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        city: 'Pune',
        malasCount: 220,
        totalBeads: 23760,
        rank: 1,
        badge: 'Ganesh Bhakti Ratna',
        lastChantedAt: '30 mins ago',
      },
      {
        id: 'user_g2',
        devoteeName: 'Kunal V. Wagh (You)',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        city: 'Pune',
        malasCount: 108,
        totalBeads: 11664,
        rank: 4,
        badge: 'Vighnaharta Sevak',
        lastChantedAt: '1 hour ago',
      },
    ],
  },
  {
    id: 'goal_hanuman_1m',
    templeId: 'temple_maruti_pune',
    templeName: 'Pasodya Maruti Mandir & Sankat Mochan Sansthan',
    deityId: 'lord_hanuman',
    deityName: 'Lord Hanuman',
    mantraName: 'Om Hanumate Namaha / Hanuman Chalisa',
    mantraDevanagari: 'ॐ हनुमते नमः',
    targetCount: 1000000,
    currentCount: 654200,
    activeDevoteesCount: 2490,
    deadlineDate: '2026-10-15 (Sharad Purnima)',
    description: 'Global chanting effort for mental strength, fortitude and protection against adverse planetary forces.',
    topContributors: [
      {
        id: 'user_h1',
        devoteeName: 'Major Vinod Deshmukh (Retd)',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        city: 'Pune',
        malasCount: 310,
        totalBeads: 33480,
        rank: 1,
        badge: 'Veer Maruti Bhakt',
        lastChantedAt: '15 mins ago',
      },
    ],
  },
];

// =============================================================================
// WhatsApp Notification Integration Templates (Twilio / Interakt API)
// =============================================================================
export const mockWhatsAppTemplates: WhatsAppNotificationTemplate[] = [
  {
    id: 'tpl_suprabhatam',
    type: 'SUPRABHATAM',
    title: 'Daily Suprabhatam & Vedic Panchang',
    description: 'Sent every morning at 06:00 AM with today’s Tithi, Nakshatra, Shubh Muhurat, and Darshan image.',
    triggerEvent: 'Scheduled Daily at 06:00 AM IST via Cron',
    previewMessage: `🌅 *सुप्रभातम् | Daily Suprabhatam from Anant* 🕉️\n\n*आजचे पंचांग (Panchang - 12 Sept 2026)*:\n• *तिथि*: भाद्रपद शुक्ल एकादशी\n• *नक्षत्र*: रोहिणी\n• *शुभ मुहूर्त (Abhijit)*: 11:45 AM - 12:35 PM\n• *राहु काळ*: 09:15 AM - 10:45 AM\n\n🌸 *आजचा विचार / Daily Thought*:\n"ईश्वर सर्वव्यापी आहे. निर्मळ भक्तीने केलेली नामसाधना जीवनाला आनंद देते."\n\n▶️ *आजची आरती व स्तोत्र ऐका*: https://anant.org/play/sukhkarta\n\n_जय श्री गणेश! ॐ नमः शिवाय!_`,
    ctaButtonText: 'Listen to Daily Aarti',
    samplePayload: {
      recipientMobile: '+919822011223',
      devoteeName: 'Kunal Wagh',
      hinduDate: 'Bhadrapada Shukla Ekadashi',
      muhuratTime: '11:45 AM - 12:35 PM',
    },
  },
  {
    id: 'tpl_darshan_pass',
    type: 'DARSHAN_PASS',
    title: 'Virtual Queue Darshan E-Pass Confirmation',
    description: 'Instant WhatsApp message sent upon booking with digital QR token, slot time, gate instructions.',
    triggerEvent: 'Real-time on Darshan Pass generation',
    previewMessage: `🎫 *श्री दगडूशेठ गणपती मंदिर | Digital Darshan Pass*\n\nप्रिय *Kunal V. Wagh* जी,\nआपला दर्शन पास यशस्वीरित्या जारी करण्यात आला आहे.\n\n• *टोकन क्रमांक*: *DAG-2026-Q042*\n• *दर्शन तारीख*: 12 सप्टेंबर 2026\n• *वेळ स्लॉट*: *06:00 AM - 07:30 AM*\n• *प्रवेश द्वार*: *Gate 1 (Shivaji Road)*\n• *भाविकांची संख्या*: 2 व्यक्ती\n\n📲 *आपला डिजिटल QR कोड पास येथे उघडा*:\nhttps://anant.org/pass/DAG-2026-Q042\n\n⚠️ *सूचना*: कृपया वेळेच्या 15 मिनिटे आधी उपस्थित राहा. मोबाईलवर QR कोड स्कॅन करून प्रवेश मिळवा.\n\n_आपली यात्रा सुखकर व मंगलमय होवो!_`,
    ctaButtonText: 'View Digital Pass QR',
    samplePayload: {
      tokenNumber: 'DAG-2026-Q042',
      devoteeName: 'Kunal V. Wagh',
      slotTime: '06:00 AM - 07:30 AM',
      gateNumber: 'Gate 1',
    },
  },
  {
    id: 'tpl_80g_receipt',
    type: 'DONATION_80G_RECEIPT',
    title: '80G Tax-Deductible Donation E-Receipt',
    description: 'Sent immediately when devotee donates via UPI/Razorpay with 80G tax certificate URN and PDF receipt link.',
    triggerEvent: 'Real-time on UPI / Payment completion',
    previewMessage: `🙏 *दान पावती व 80G कर सवलत प्रमाणपत्र | E-Receipt*\n\nश्रीमंत दगडूशेठ हलवाई गणपती मंदिर ट्रस्ट\n*Govt Reg*: MAH-PUN-TRUST-49102-1982\n*80G URN*: AAATD4910EF20202\n\nप्रिय *Kunal V. Wagh* जी,\nआपल्या पवित्र दानाबद्दल ट्रस्ट आपले मनःपूर्वक आभार मानत आहे.\n\n• *पावती क्रमांक*: *REC-2026-80G-09412*\n• *देणगी रक्कम*: *₹ 2,100/-*\n• *हेतू (Purpose)*: अन्नदान व प्रसाद सेवा\n• *दाता PAN*: *ABCDE1234F*\n• *व्यवहार आयडी*: UPI/2026/09/894120\n\n📄 *अधिकृत 80G कर सूट पावती (PDF) डाउनलोड करा*:\nhttps://anant.org/receipt/REC-2026-80G-09412.pdf\n\n_हे दान प्राप्तिकर कायदा कलम 80G अंतर्गत 50% कर सवलतीस पात्र आहे._\n\n_गणपती बाप्पा मोरया!_`,
    ctaButtonText: 'Download 80G Receipt PDF',
    samplePayload: {
      receiptNumber: 'REC-2026-80G-09412',
      amount: '₹ 2,100',
      donorPan: 'ABCDE1234F',
      trust80G: 'AAATD4910EF20202',
    },
  },
  {
    id: 'tpl_event_alert',
    type: 'EVENT_ALERT',
    title: 'Temple Festival & Live Darshan Broadcast Alert',
    description: 'Broadcast to all opt-in devotees prior to major temple festivals and live sanctum darshans.',
    triggerEvent: 'Manual Admin Broadcast or 1 hour prior to Event',
    previewMessage: `🔔 *विशेष मंदिर उत्सव सूचना | Trimbakeshwar Jyotirlinga*\n\nआज सायंकाळी *07:00 PM* वाजता:\n*महाशिवरात्री विशेष रुद्राभिषेक व दीपमाळ आरती* आयोजित करण्यात आली आहे.\n\n🎥 *थेट दर्शन (Live Stream)*:\nhttps://anant.org/live/trimbakeshwar\n\nघरी बसून थेट ज्योतिर्लिंगाचे दिव्य दर्शन घ्या व महादेवाची कृपा संपादन करा.\n\n_हर हर महादेव!_`,
    ctaButtonText: 'Join Live Stream',
    samplePayload: {
      templeName: 'Trimbakeshwar Jyotirlinga',
      eventTitle: 'Maha Rudrabhishek & Deepmala',
      time: '07:00 PM Today',
    },
  },
];

// =============================================================================
// Spiritual & Religious Blogs Data
// =============================================================================
export const mockSpiritualBlogs: SpiritualBlog[] = [
  {
    id: 'blog_kedarnath_secrets',
    titleEn: 'Sacred Geometries & Hidden Mysteries of Kedarnath Temple',
    titleMr: 'तीर्थक्षेत्र: श्री केदारनाथ ज्योतिर्लिंगाचे आध्यात्मिक रहस्य आणि गूढ ऊर्जा',
    titleHi: 'तीर्थक्षेत्र: श्री केदारनाथ ज्योतिर्लिंग का आध्यात्मिक रहस्य एवं दिव्य ऊर्जा',
    authorName: 'Acharya Vidyadhar Shastri',
    authorRole: 'TEMPLE_TRUST',
    authorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
    category: 'TEMPLES_PILGRIMAGE',
    categoryLabel: {
      en: 'Temples & Pilgrimage',
      mr: 'तीर्थक्षेत्र व मंदिरे',
      hi: 'तीर्थक्षेत्र एवं मंदिर',
    },
    tags: ['Kedarnath', 'Jyotirlinga', 'Lord Shiva', 'Himalayas', 'Sacred Architecture'],
    summary: 'Explore the architectural wonders of Kedarnath mandir, survived under snow for 400 years, and understand the magnetic energy grid of the 12 Jyotirlingas.',
    content: `Kedarnath Temple, situated at 3,583 meters in the Garhwal Himalayas, is not merely a stone structure—it is an epicenter of planetary cosmic resonance.

1. The 400-Year Ice Age Survival:
Geologists and historical researchers from Wadia Institute discovered that between the 13th and 17th centuries (the Little Ice Age), the entire Kedarnath temple was completely submerged under deep glaciers. When the ice finally receded, the sanctum was found entirely intact without structural fracture, owing to its interlocking granite masonry without mortar.

2. Straight Line Longitude Phenomenon:
Remarkably, five supreme Shiva temples across the Indian subcontinent lie on almost the identical longitudinal axis (approx 79° E):
- Kedarnath (Uttarakhand) - 79.0669° E
- Kaleshwaram (Telangana) - 79.9067° E
- Srikalahasti (Andhra Pradesh) - 79.6984° E
- Ekambareswarar (Tamil Nadu) - 79.7036° E
- Chidambaram Nataraja (Tamil Nadu) - 79.6935° E

These temples represent the Pancha Bhoota Sthalas (Five Elements of Nature), aligned hundreds of years before modern satellite GPS technology existed.

3. Sacred Sadhana at the Sanctum:
Devotees chanting "Om Namah Shivaya" while performing the pradakshina around the swayambhu conical rock lingam experience an immediate lowering of mental fluctuations (Chitta Vritti Nirodha). Let every breath in the snow-clad peaks be a surrender to Mahadev.`,
    bannerImageUrl: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=1200&auto=format&fit=crop&q=80',
    publishedAt: '2026-09-11',
    readTimeMinutes: 5,
    likesCount: 1420,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoTitle: 'Kedarnath Sanctum Walkthrough & Himalayan Aarti',
    videoDuration: '04:15',
    associatedTempleId: 'temple_trimbak',
    associatedTempleName: 'Shri Kedarnath Sansthan Trust',
  },
  {
    id: 'blog_sant_tukaram_japa',
    titleEn: 'Sant Tukaram Maharaj: The Supreme Science of Continuous Naam Japa',
    titleMr: 'संत तुकाराम महाराज: अखंड नामस्मरणाचे सामर्थ्य व वारकरी भक्तीमार्ग',
    titleHi: 'संत तुकाराम महाराज: अनवरत नामस्मरण का सामर्थ्य एवं वारकरी भक्ति',
    authorName: 'Pravachankar Dnyaneshwar Maharaj Patil',
    authorRole: 'SPIRITUAL_GURU',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    category: 'SPIRITUAL_GURUS',
    categoryLabel: {
      en: 'Spiritual Gurus & Saints',
      mr: 'संत, गुरु व तत्त्वज्ञान',
      hi: 'संत, गुरु एवं दर्शन',
    },
    tags: ['Sant Tukaram', 'Vitthal', 'Naam Japa', 'Varkari', 'Pandharpur', 'Bhakti'],
    summary: 'How simple repetition of God\'s holy name transforms subconscious impressions (samskaras) and dissolves emotional turmoil in the Kali Yuga.',
    content: `Sant Tukaram Maharaj declared in his immortal abhang:
"नामसंकीर्तन साधन पै सोपे । जळतील पापे जन्मांतरींची ॥"
(Chanting the Divine Name is the easiest spiritual discipline; it burns away sins accumulated over lifetimes.)

The Path of Simple Devotion:
In complex philosophical treatises, seekers often lose themselves in intellectual dialectics. Jagadguru Tukaram brought spirituality to the common person working in fields, weaving fabrics, and tending family hearths. He taught that spiritual liberation (Moksha) is not reserved for forest hermitages; it blooms in the heart through unceasing remembrance.

How to Practice Continuous Background Chanting:
1. Breath Synchronization (श्वास-स्मरण): On every inhalation, mentally vibrate "राम" or "विठ्ठल"; on exhalation, vibrate "कृष्ण" or "शिव".
2. Mental Repetition during Daily Tasks: Let the hands work in the soil or office while the subconscious mind acts like a gentle stream continuously repeating the mantra.
3. Feeling over Ritual: A single heartfelt tear for the Lord outweighs thousands of dry recitations.

Tukaram Maharaj's entire life proved that love and continuous japa dissolve the boundary between the devotee (Bhakta) and God (Bhagavanta).`,
    bannerImageUrl: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=1200&auto=format&fit=crop&q=80',
    publishedAt: '2026-09-10',
    readTimeMinutes: 4,
    likesCount: 2310,
    associatedTempleId: 'temple_pandharpur',
    associatedTempleName: 'Pandharpur Vitthal Mandir',
  },
  {
    id: 'blog_gita_sthitaprajna',
    titleEn: 'Bhagavad Gita Chapter 2: The Art of Sthitaprajna in Modern Fast-Paced Life',
    titleMr: 'श्रीमद्भगवद्गीता द्वितीय अध्याय: आधुनिक धकाधकीत स्थितप्रज्ञतेचे आचरण',
    titleHi: 'श्रीमद्भगवद्गीता अध्याय २: आधुनिक जीवन में स्थितप्रज्ञ की कला',
    authorName: 'Swami Atmapriyananda',
    authorRole: 'SCHOLAR_WRITER',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    category: 'SACRED_SCRIPTURES',
    categoryLabel: {
      en: 'Sacred Scriptures & Vedas',
      mr: 'शास्त्र, वेद व उपनिषद',
      hi: 'शास्त्र, वेद एवं उपनिषद्',
    },
    tags: ['Bhagavad Gita', 'Lord Krishna', 'Sthitaprajna', 'Mindfulness', 'Karma Yoga', 'Meditation'],
    summary: 'Lord Krishna reveals to Arjuna the exact psychological traits of a master who remains undisturbed in victory and defeat, joy and sorrow.',
    content: `When Arjuna asks Lord Krishna in Shloka 54:
"स्थितप्रज्ञस्य का भाषा समाधिस्थस्य केशव ।
स्थितधीः किं प्रभाषेत किमासीत व्रजेत किम् ॥"
(What are the signs of one whose wisdom is firmly established in transcendence? How does he speak, sit, and walk?)

Lord Krishna answers with profound psychological depth:
"प्रजहाति यदा कामान् सर्वान् पार्थ मनोगतान् ।
आत्मन्येवात्मना तुष्टः स्थितप्रज्ञस्तदोच्यते ॥" (2.55)
(When a person renounces all selfish cravings of the mind, and finds complete fulfillment within the Self by the Self, he is called a Sthitaprajna.)

Three Practical Lessons for Devotees:
1. Ocean Metaphor (समुद्रोपमा): Rivers of experiences constantly pour into the ocean, yet the ocean remains brimming and undisturbed. Do not fight life's external events; deepen your internal ocean of consciousness.
2. The Tortoise Response (कूर्मोऽङ्गानीव): Learn to withdraw senses inward during stress through a 2-minute Jaap Mala session or prayer pause.
3. Detached Excellence (निष्काम कर्म): Give 100% effort to your family and work, offering all results to the Divine without anxiety about outcomes.`,
    bannerImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200&auto=format&fit=crop&q=80',
    publishedAt: '2026-09-08',
    readTimeMinutes: 6,
    likesCount: 3100,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoTitle: 'Gita Discourse: Finding Inner Peace in Daily Turmoil',
    videoDuration: '06:30',
  },
  {
    id: 'blog_mahashivratri_science',
    titleEn: 'The Cosmic Science of Mahashivratri: Night of Awakening & Consciousness',
    titleMr: 'महाशिवरात्रीचे आध्यात्मिक व वैज्ञानिक रहस्य: जागरण, उपवास व ऊर्जा संक्रमण',
    titleHi: 'महाशिवरात्रि का आध्यात्मिक एवं वैज्ञानिक रहस्य: जागरण एवं साधना',
    authorName: 'Pt. Ramakant Joshi',
    authorRole: 'TEMPLE_TRUST',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    category: 'FESTIVALS_UTSAV',
    categoryLabel: {
      en: 'Festivals & Utsavs',
      mr: 'सण, उत्सव व विधी',
      hi: 'पर्व, उत्सव एवं अनुष्ठान',
    },
    tags: ['Mahashivratri', 'Lord Shiva', 'Fasting', 'Bilva Patra', 'Rudrabhishek', 'Night Vigil'],
    summary: 'Why staying awake with an erect spine on the 14th night of Phalguna facilitates a natural upward surge of cosmic life energy (Kundalini).',
    content: `On the night before the new moon in Phalguna/Magha, planetary positions in the northern hemisphere cause a natural upsurge of subtle energy in the human biological system.

The Purpose of Jagarana (Night Vigil):
Ancient sages designed Mahashivratri to harness this natural upward flow. By keeping the spine erect and engaging in continuous chanting of "Om Namah Shivaya" or "Maha Mrityunjaya Mantra", seekers experience deep meditative stillness that would normally require months of practice.

The Sacred Triad of Offering:
- Bilva Patra (Trifoliate Leaf): Represents the three Gunas (Sattva, Rajas, Tamas) offered at Shiva's feet, surrendering duality into singularity.
- Milk & Water Abhishek: Calms the internal agni and balances neurochemical activity.
- Bhasma (Sacred Ash): A solemn reminder of impermanence, centering the soul in eternity.`,
    bannerImageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
    publishedAt: '2026-09-07',
    readTimeMinutes: 5,
    likesCount: 1890,
    associatedTempleId: 'temple_trimbak',
    associatedTempleName: 'Trimbakeshwar Jyotirlinga Sansthan',
  },
  {
    id: 'blog_108_japa_resonance',
    titleEn: 'Why 108? The Sacred Mathematics, Astronomy & Acoustics of Japa Sadhana',
    titleMr: '१०८ संख्येचे गूढ विज्ञान: खगोलशास्त्र, शरीरशास्त्र आणि अखंड मंत्राचे स्पंदन',
    titleHi: '१०८ संख्या का गूढ विज्ञान: खगोल, शरीर और मन्त्र जप का रहस्य',
    authorName: 'Dr. Arvind Kulkarni',
    authorRole: 'CONTENT_CREATOR',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    category: 'SADHANA_DHYAN',
    categoryLabel: {
      en: 'Sadhana & Meditation',
      mr: 'साधना, ध्यान व नामजप',
      hi: 'साधना, ध्यान एवं जप',
    },
    tags: ['108 Beads', 'Jaap Mala', 'Mantra Science', 'Rudraksha', 'Sound Therapy', 'Anahata Chakra'],
    summary: 'Discover the cosmic link between the Sun, Moon, Earth distances, the 108 sacred energy nadis, and the sound resonance of Sanskrit shlokas.',
    content: `Why do all Vedic traditions, Buddhists, and yogic lineages use 108 beads on a Mala?

1. Astronomical Proportions:
- The distance between Earth and the Sun is approximately 108 times the Sun's diameter.
- The distance between Earth and the Moon is approximately 108 times the Moon's diameter.
- The Sun's diameter is roughly 108 times Earth's diameter.
When our ancient rishis chose 108, they connected the human microcosm directly with the celestial macrocosm.

2. Subtle Anatomy (The 108 Nadis):
The human heart chakra (Anahata) is the junction of 108 subtle energy channels (Nadis). When a devotee chants a mantra 108 times with focused breath, each nadi receives the energetic resonance, harmonizing heart-rate variability and brainwave coherence.

3. The Sumeru Bead (गुरु मणी):
The 109th bead on the rosary is the Sumeru. We never cross the Sumeru; we touch it with devotion, turn the mala, and begin the next cycle. This grounds the sadhana in humility and unbroken awareness.`,
    bannerImageUrl: 'https://images.unsplash.com/photo-1618245318763-a15156d6b23c?w=1200&auto=format&fit=crop&q=80',
    publishedAt: '2026-09-05',
    readTimeMinutes: 5,
    likesCount: 2750,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoTitle: 'Sound Physics of 432 Hz and 108 Japa Cycles',
    videoDuration: '05:12',
  },
  {
    id: 'blog_daily_aarti_creator',
    titleEn: 'Creating a Peaceful Sacred Space: How Modern Devotees Practice Nitya Niyam',
    titleMr: 'घरात पवित्र शांतता निर्माण करणे: दैनंदिन नित्य नियम व सात्विक जीवनशैली',
    titleHi: 'घर में सात्त्विक वातावरण: नित्य नियम एवं दैनिक आरती साधना',
    authorName: 'Radhika Kulkarni',
    authorRole: 'CONTENT_CREATOR',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    category: 'CONTENT_CREATORS',
    categoryLabel: {
      en: 'Devotee Creators & Writers',
      mr: 'आध्यात्मिक लेखक व रचनाकार',
      hi: 'भक्त लेखक एवं रचनाकार',
    },
    tags: ['Nitya Niyam', 'Home Puja', 'Aarti', 'Diya', 'Incense', 'Peace of Mind'],
    summary: 'Simple steps to establish an authentic 15-minute daily prayer routine at home with brass diya, pure ghee, dhyan chants, and peaceful gratitude.',
    content: `Living in noisy cities often drains our mental batteries. Creating a dedicated sanctuary at home—even a small wooden shelf or clean corner—anchors the family in peace.

The 4 Elements of Home Nitya Niyam:
1. Deepa Jyoti (दीप प्रज्वलन): Lighting a pure sesame or cow ghee lamp in the morning and evening clears electrostatic fields and elevates focus.
2. Dhyan Chant Audio: Keeping a gentle mantra like "Om Namah Shivaya" or "Manojavam Marutatulyavegam" playing in the background sets a tranquil atmospheric frequency.
3. Daily Shloka Reading: Reading even one shloka of Bhagavad Gita or Hanuman Chalisa chaupai every day nourishes inner resilience.
4. Gratitude & Surrender (समर्पण): Closing the day with hands joined, thanking God for life and placing all worries at His lotus feet.`,
    bannerImageUrl: 'https://images.unsplash.com/photo-1567591370504-20a2d2188849?w=1200&auto=format&fit=crop&q=80',
    publishedAt: '2026-09-02',
    readTimeMinutes: 4,
    likesCount: 1680,
  },
];

// =============================================================================
// Temple Trusts Daily Darshan Uploads
// =============================================================================
export const mockDailyDarshanUploads: DailyDarshanUpload[] = [
  {
    id: 'darshan_dagdusheth_today',
    templeId: 'temple_dagdusheth',
    templeName: 'Shreemant Dagdusheth Halwai Ganpati Mandir',
    deityName: 'Lord Ganesh',
    date: '2026-09-12',
    timeSlot: '06:15 AM',
    title: 'Suprabhatam Shringar Darshan - Pure Gold Mukut & Modak Alankar',
    description: 'Today’s auspicious morning shringar darshan of Bappa adorned with 11kg gold mukut and fresh fragrant marigold and lotus garland.',
    photoUrl: 'https://images.unsplash.com/photo-1567591370504-20a2d2188849?w=1000&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    alankarType: 'MORNING_SHRINGAR',
    uploadedBy: 'Chief Archaka, Shreemant Dagdusheth Trust',
    uploadedAt: '15 mins ago',
    likesCount: 3840,
    blessingsCount: 1240,
  },
  {
    id: 'darshan_pandharpur_today',
    templeId: 'temple_pandharpur',
    templeName: 'Shri Vitthal Rukmini Mandir, Pandharpur',
    deityName: 'Lord Vitthala & Rakhumai',
    date: '2026-09-12',
    timeSlot: '05:45 AM',
    title: 'Kakad Aarti & Pavitra Tulsi Mala Alankar Darshan',
    description: 'Divine morning Kakad Aarti darshan of Lord Panduranga standing gracefully on the sacred brick, adorned with fresh Tulsi manjari.',
    photoUrl: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=1000&auto=format&fit=crop&q=80',
    alankarType: 'MORNING_SHRINGAR',
    uploadedBy: 'Mandir Samiti Official',
    uploadedAt: '1 hour ago',
    likesCount: 4920,
    blessingsCount: 2100,
  },
  {
    id: 'darshan_trimbak_today',
    templeId: 'temple_trimbak',
    templeName: 'Shri Trimbakeshwar Jyotirlinga Mandir',
    deityName: 'Lord Shiva',
    date: '2026-09-12',
    timeSlot: '07:00 AM',
    title: 'Panchamrut Mahabhishek & Suvarna Mukhavata Darshan',
    description: 'Sacred Trimbakeshwar Jyotirlinga decorated with golden tridev crown representing Brahma, Vishnu, and Maheshwar with fragrant Bilva leaves.',
    photoUrl: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=1000&auto=format&fit=crop&q=80',
    alankarType: 'MAHAPOOJA',
    uploadedBy: 'Purohit Sansthan Trimbak',
    uploadedAt: '2 hours ago',
    likesCount: 3150,
    blessingsCount: 980,
  },
  {
    id: 'darshan_tuljapur_today',
    templeId: 'temple_tuljapur',
    templeName: 'Shri Tulja Bhavani Temple, Tuljapur',
    deityName: 'Goddess Durga / Bhavani',
    date: '2026-09-12',
    timeSlot: '08:30 AM',
    title: 'Chhabina Utsav & Navratna Alankar Darshan',
    description: 'Auspicious Alankar pooja of Kulswamini Aai Tulja Bhavani dressed in traditional Paithani saree with divine weapons and golden Trishul.',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    alankarType: 'SPECIAL_UTSAV',
    uploadedBy: 'Tuljapur Devasthan Admin',
    uploadedAt: '3 hours ago',
    likesCount: 2890,
    blessingsCount: 1420,
  },
  {
    id: 'darshan_mangueshi_today',
    templeId: 'temple_manguesh',
    templeName: 'Shri Manguesh Temple, Goa',
    deityName: 'Lord Shiva (Manguesh)',
    date: '2026-09-12',
    timeSlot: '06:30 AM',
    title: 'Morning Sandhya Deepotsav & Silver Linga Darshan',
    description: 'Peaceful dawn darshan of Lord Manguesh with illuminated silver Deepastambha and sandalwood tilak.',
    photoUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80',
    alankarType: 'MORNING_SHRINGAR',
    uploadedBy: 'Mangueshi Trust Media Cell',
    uploadedAt: '4 hours ago',
    likesCount: 1670,
    blessingsCount: 540,
  },
];

// =============================================================================
// Specialized Chant Tracks for Continuous Background Playing
// =============================================================================
export const mockChantTracks: ChantTrack[] = [
  {
    id: 'track_om_namah_shivaya',
    titleEn: 'Om Namah Shivaya (Continuous Dhyan Chant)',
    titleMr: 'ॐ नमः शिवाय (अखंड ध्यान जप)',
    titleHi: 'ॐ नमः शिवाय (अनवरत ध्यान मन्त्र)',
    deityName: 'Lord Shiva',
    mantraDevanagari: 'ॐ नमः शिवाय',
    meaningEn: 'I bow to Lord Shiva, the inner auspiciousness and cosmic transformer of all realities.',
    durationSec: 108,
    tempoBpm: 60,
    frequencyHz: 432,
    category: 'MANTRA',
    isContinuousLoop: true,
  },
  {
    id: 'track_manojavam_maruta',
    titleEn: 'Manojavam Marutatulyavegam (Hanuman Stotra)',
    titleMr: 'मनोजवं मारुततुल्यवेगं (श्री हनुमान स्तोत्र)',
    titleHi: 'मनोजवं मारुततुल्यवेगं (हनुमान स्तोत्र जप)',
    deityName: 'Lord Hanuman',
    mantraDevanagari: 'मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम् । वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये ॥',
    meaningEn: 'I surrender to Lord Hanuman, who is swift as thought, fast as the wind, master of senses, supreme in wisdom, son of the wind, and messenger of Rama.',
    durationSec: 36,
    tempoBpm: 64,
    frequencyHz: 528,
    category: 'STOTRA',
    isContinuousLoop: true,
  },
  {
    id: 'track_hare_krishna',
    titleEn: 'Hare Krishna Mahamantra (108 Japa)',
    titleMr: 'हरे कृष्ण महामंत्र (१०८ नामजप)',
    titleHi: 'हरे कृष्ण महामन्त्र (अखंड नाम स्मरण)',
    deityName: 'Lord Krishna / Vitthala',
    mantraDevanagari: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे । हरे राम हरे राम राम राम हरे हरे ॥',
    meaningEn: 'O Supreme Lord Krishna and Divine Energy Radha, please engage me in Your transcendental loving service.',
    durationSec: 48,
    tempoBpm: 72,
    frequencyHz: 432,
    category: 'NAAM_JAPA',
    isContinuousLoop: true,
  },
  {
    id: 'track_gayatri_mantra',
    titleEn: 'Gayatri Mahamantra (Solar Awakening)',
    titleMr: 'गायत्री महामंत्र (वेदमंत्र साधना)',
    titleHi: 'गायत्री महामन्त्र (सूर्य ध्यान जप)',
    deityName: 'Maa Gayatri',
    mantraDevanagari: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥',
    meaningEn: 'We meditate on the divine light of the Sun of Consciousness; may it illuminate our intellect.',
    durationSec: 32,
    tempoBpm: 56,
    frequencyHz: 528,
    category: 'MANTRA',
    isContinuousLoop: true,
  },
  {
    id: 'track_maha_mrityunjaya',
    titleEn: 'Maha Mrityunjaya Healing Mantra',
    titleMr: 'महामृत्युंजय मंत्र (आरोग्य व संरक्षणात्मक जप)',
    titleHi: 'महामृत्युंजय मन्त्र (आरोग्य एवं मोक्ष जप)',
    deityName: 'Lord Shiva',
    mantraDevanagari: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥',
    meaningEn: 'We worship the fragrant three-eyed Lord Shiva who nourishes all beings. Liberate us from mortal bonds.',
    durationSec: 40,
    tempoBpm: 58,
    frequencyHz: 432,
    category: 'MANTRA',
    isContinuousLoop: true,
  },
  {
    id: 'track_ram_naam',
    titleEn: 'Shri Ram Jai Ram Jai Jai Ram',
    titleMr: 'श्री राम जय राम जय जय राम (तारक मंत्र)',
    titleHi: 'श्री राम जय राम जय जय राम (तारक मन्त्र जप)',
    deityName: 'Lord Rama',
    mantraDevanagari: 'श्री राम जय राम जय जय राम',
    meaningEn: 'Victory to Lord Rama, the divine protector and indwelling bliss.',
    durationSec: 24,
    tempoBpm: 68,
    frequencyHz: 432,
    category: 'NAAM_JAPA',
    isContinuousLoop: true,
  },
];


