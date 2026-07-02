import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const indonesianHotels = [
        // ─── JAKARTA (5) ────────────────────────────────────────────────────────────
        {
            name: 'Hotel Indonesia Kempinski Jakarta',
            location: 'Jakarta, Indonesia',
            description:
                'Ikon mewah di jantung ibu kota, berhadapan langsung dengan Bundaran HI. Menggabungkan kemewahan kelas dunia dengan keramahan khas Indonesia.',
            price: 3200000,
            rating: 4.9,
            image:
                'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Free Wi-Fi',
                'Pool',
                'Fitness Center',
                'Spa',
                'Fine Dining',
                'Ballroom',
                'Concierge 24h',
            ],
        },
        {
            name: 'The Sultan Hotel & Residence Jakarta',
            location: 'Jakarta, Indonesia',
            description:
                'Hotel megah di kawasan Senayan dengan taman luas dan kolam renang outdoor terbesar di Jakarta. Pilihan utama konferensi dan pernikahan mewah.',
            price: 2800000,
            rating: 4.8,
            image:
                'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Outdoor Pool',
                'Tennis Court',
                'Spa',
                'Business Center',
                'Free Parking',
                'Kids Club',
            ],
        },
        {
            name: 'Fairmont Jakarta',
            location: 'Jakarta, Indonesia',
            description:
                'Hotel bintang 5 di kawasan SCBD Sudirman, menawarkan kamar dengan pemandangan cakrawala kota yang memukau dan layanan butir kelas premier.',
            price: 3500000,
            rating: 4.9,
            image:
                'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Rooftop Pool',
                'Fitness Center',
                'Spa',
                'Multiple Restaurant',
                'Butler Service',
                'Airport Transfer',
            ],
        },
        {
            name: 'Akmani Hotel Jakarta',
            location: 'Jakarta, Indonesia',
            description:
                'Boutique hotel modern di pusat kota Jakarta dengan desain kontemporer, dekat pusat perbelanjaan dan distrik bisnis Menteng yang ikonik.',
            price: 980000,
            rating: 4.5,
            image:
                'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: ['Free Wi-Fi', 'Pool', 'Restaurant', 'Meeting Room', 'Laundry Service'],
        },
        {
            name: 'JW Marriott Hotel Jakarta',
            location: 'Jakarta, Indonesia',
            description:
                'Hotel premium di kawasan bisnis Mega Kuningan dengan interior elegan, 331 kamar bergaya modern dan koleksi seni Indonesia yang menawan.',
            price: 2500000,
            rating: 4.8,
            image:
                'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Free Wi-Fi',
                'Pool',
                'Fitness Center',
                'Spa',
                'Japanese Restaurant',
                'Business Lounge',
            ],
        },

        // ─── BANDUNG (10) ────────────────────────────────────────────────────────────
        {
            name: 'Grand Hotel Preanger Bandung',
            location: 'Bandung, Indonesia',
            description:
                'Hotel bersejarah Art Deco peninggalan kolonial Belanda di jantung Kota Bandung. Dibangun tahun 1929, menjadi saksi bisu perjalanan sejarah bangsa.',
            price: 1200000,
            rating: 4.7,
            image:
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Free Wi-Fi',
                'Heritage Pool',
                'Fine Dining',
                'Ballroom',
                'Meeting Room',
                'City View',
            ],
        },
        {
            name: 'Trans Luxury Hotel Bandung',
            location: 'Bandung, Indonesia',
            description:
                'Hotel ultra-mewah bintang 6 terintegrasi dengan Trans Studio Mall dan Trans Studio Theme Park. Destinasi entertainment terlengkap di Bandung.',
            price: 2800000,
            rating: 4.9,
            image:
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Theme Park Access',
                'Indoor Pool',
                'Spa',
                'Sky Lounge',
                'Fitness Center',
                'Kids Club',
                'Mall Access',
            ],
        },
        {
            name: 'Padma Hotel Bandung',
            location: 'Bandung, Indonesia',
            description:
                'Resort eksklusif di perbukitan Ciumbuleuit dengan pemandangan lembah hijau Bandung yang dramatis. Infinity pool legendaris dengan panorama 180 derajat.',
            price: 2200000,
            rating: 4.9,
            image:
                'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Infinity Pool',
                'Spa',
                'Fitness Center',
                'Valley View',
                'Outdoor Jacuzzi',
                'Yoga Class',
                'Restaurant',
            ],
        },
        {
            name: 'The Papandayan Hotel Bandung',
            location: 'Bandung, Indonesia',
            description:
                'Hotel premium di kawasan Dago dengan koleksi karya seni lokal yang dikurasi apik, coffee shop terkenal, dan taman dalam ruangan yang asri.',
            price: 1500000,
            rating: 4.7,
            image:
                'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Free Wi-Fi',
                'Pool',
                'Art Gallery',
                'Rooftop Bar',
                'Fitness Center',
                'Garden',
            ],
        },
        {
            name: 'Hilton Bandung',
            location: 'Bandung, Indonesia',
            description:
                'Hotel bisnis modern di pusat kota Bandung, berdekatan dengan pusat perbelanjaan dan fasilitas MICE terlengkap di kota kembang.',
            price: 1800000,
            rating: 4.6,
            image:
                'https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Free Wi-Fi',
                'Pool',
                'Executive Lounge',
                'Fitness Center',
                'Business Center',
                'Multiple Restaurant',
            ],
        },
        {
            name: 'De Lamar Hotel Bandung',
            location: 'Bandung, Indonesia',
            description:
                'Hotel butik bergaya Eropa klasik yang memesona di kawasan Braga, distrik seni dan kuliner paling hits di Bandung dengan suasana vintage yang otentik.',
            price: 850000,
            rating: 4.5,
            image:
                'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: ['Free Wi-Fi', 'Rooftop Café', 'Library', 'Artisan Breakfast', 'City Tour'],
        },
        {
            name: 'D Hotel Braga Bandung',
            location: 'Bandung, Indonesia',
            description:
                'Hotel kontemporer di kawasan Braga bersejarah dengan desain industrial chic, perpustakaan vinly, dan kafe spesialti yang instagramable.',
            price: 750000,
            rating: 4.4,
            image:
                'https://images.unsplash.com/photo-1618245318763-a15156d6b23c?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Free Wi-Fi',
                'Specialty Coffee',
                'Vinyl Library',
                'Rooftop',
                'Laundry Service',
            ],
        },
        {
            name: 'Aryaduta Bandung',
            location: 'Bandung, Indonesia',
            description:
                'Hotel bintang 4 di kawasan bisnis Bandung, ideal untuk perjalanan korporat maupun liburan keluarga dengan fasilitas lengkap dan harga terjangkau.',
            price: 900000,
            rating: 4.4,
            image:
                'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: ['Free Wi-Fi', 'Pool', 'Fitness Center', 'All-Day Dining', 'Business Center'],
        },
        {
            name: 'Lembang Asri Resort Bandung',
            location: 'Bandung, Indonesia',
            description:
                'Resort keluarga di dataran tinggi Lembang dengan udara sejuk pegunungan, taman bunga yang luas, dan berbagai aktivitas outdoor seru.',
            price: 1100000,
            rating: 4.6,
            image:
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Mountain Air',
                'Flower Garden',
                'Cycling',
                'ATV Track',
                'Free Parking',
                'Kids Playground',
            ],
        },
        {
            name: 'Sensa Hotel Bandung',
            location: 'Bandung, Indonesia',
            description:
                'Hotel desain unik berintegrasi dengan Cihampelas Walk Mall. Setiap lantai memiliki tema berbeda yang terinspirasi alam dan budaya Indonesia.',
            price: 950000,
            rating: 4.5,
            image:
                'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: ['Free Wi-Fi', 'Themed Rooms', 'Pool', 'Mall Access', 'Restaurant', 'Café'],
        },

        // ─── YOGYAKARTA (10) ─────────────────────────────────────────────────────────
        {
            name: 'Royal Ambarrukmo Yogyakarta',
            location: 'Yogyakarta, Indonesia',
            description:
                'Hotel bintang 5 premium di tepi jalan Laksda Adisucipto dengan taman keraton yang megah, koleksi batik antik, dan sentuhan budaya Jawa yang otentik.',
            price: 2500000,
            rating: 4.9,
            image:
                'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Free Wi-Fi',
                'Heritage Pool',
                'Batik Workshop',
                'Spa',
                'Fine Dining',
                'Cultural Show',
                'Keraton Garden',
            ],
        },
        {
            name: 'Hyatt Regency Yogyakarta',
            location: 'Yogyakarta, Indonesia',
            description:
                'Resort megah di kawasan hijau Jalan Palagan dengan pemandangan Gunung Merapi yang memukau, kolam renang luas, dan fasilitas golf kelas internasional.',
            price: 2200000,
            rating: 4.8,
            image:
                'https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Golf Course',
                'Large Pool',
                'Mountain View',
                'Spa',
                'Fitness Center',
                'Tennis Court',
                'Kids Club',
            ],
        },
        {
            name: 'Tentrem Hotel Yogyakarta',
            location: 'Yogyakarta, Indonesia',
            description:
                'Hotel mewah di pusat Kota Jogja yang memadukan estetika modern dengan ornamen budaya Jawa. Interior dihiasi karya seni kontemporer seniman lokal.',
            price: 1800000,
            rating: 4.8,
            image:
                'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Free Wi-Fi',
                'Rooftop Pool',
                'Spa',
                'Art Gallery',
                'Javanese Restaurant',
                'Concierge',
            ],
        },
        {
            name: 'Sheraton Mustika Yogyakarta Resort & Spa',
            location: 'Yogyakarta, Indonesia',
            description:
                'Resort premium di tepi Sungai Code dengan desain yang terinspirasi arsitektur keraton Jawa. Spa dengan perawatan tradisional Jawa yang eksklusif.',
            price: 2000000,
            rating: 4.7,
            image:
                'https://images.unsplash.com/photo-1506059612708-99d6128a0a45?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'River View',
                'Javanese Spa',
                'Pool',
                'Fitness Center',
                'Cultural Experience',
                'Fine Dining',
            ],
        },
        {
            name: 'Phnom Jogja Hotel',
            location: 'Yogyakarta, Indonesia',
            description:
                'Hotel butik di kawasan Prawirotaman, pusat seni dan budaya Yogyakarta. Dikelilingi galeri seni, restoran boho, dan toko kerajinan lokal yang autentik.',
            price: 680000,
            rating: 4.5,
            image:
                'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Free Wi-Fi',
                'Pool',
                'Art District',
                'Bicycle Rental',
                'Rooftop Lounge',
                'Local Breakfast',
            ],
        },
        {
            name: 'Phoenix Hotel Yogyakarta',
            location: 'Yogyakarta, Indonesia',
            description:
                'Hotel klasik bergaya colonial Belanda yang berdiri sejak 1918 di Jalan Jenderal Sudirman. Heritage property dengan charm vintage yang tak lekang waktu.',
            price: 980000,
            rating: 4.6,
            image:
                'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Free Wi-Fi',
                'Heritage Pool',
                'Colonial Architecture',
                'Restaurant',
                'Meeting Room',
            ],
        },
        {
            name: 'The Alana Yogyakarta Hotel & Convention Center',
            location: 'Yogyakarta, Indonesia',
            description:
                'Hotel konvensi modern terbesar di Yogyakarta dengan grand ballroom berkapasitas 5.000 pax, dekat Malioboro dan pusat kota Yogyakarta.',
            price: 1200000,
            rating: 4.6,
            image:
                'https://images.unsplash.com/photo-1601918774516-b49eff16a0c2?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Free Wi-Fi',
                'Convention Center',
                'Pool',
                'Fitness Center',
                'MICE Facilities',
                'Business Lounge',
            ],
        },
        {
            name: 'Indigo Yogyakarta Hotel',
            location: 'Yogyakarta, Indonesia',
            description:
                'Boutique hotel IHG berkonsep "neighborhood story" di Wirobrajan yang menceritakan kisah budaya lokal melalui desain interior, kuliner, dan program wisata.',
            price: 1100000,
            rating: 4.7,
            image:
                'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Free Wi-Fi',
                'Pool',
                'Local Cultural Program',
                'Neighborhood Map',
                'Specialty Restaurant',
            ],
        },
        {
            name: 'Greenhost Boutique Hotel Yogyakarta',
            location: 'Yogyakarta, Indonesia',
            description:
                'Hotel ramah lingkungan di kawasan Prawirotaman dengan konsep green living, taman vertikal, dan menu restoran berbahan baku organik lokal.',
            price: 780000,
            rating: 4.5,
            image:
                'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Eco-Friendly',
                'Organic Restaurant',
                'Free Wi-Fi',
                'Vertical Garden',
                'Bike Loan',
                'Rooftop',
            ],
        },
        {
            name: 'Novotel Yogyakarta',
            location: 'Yogyakarta, Indonesia',
            description:
                'Hotel modern bintang 4 di seberang pusat perbelanjaan Malioboro Mall, memberikan akses mudah ke destinasi wisata ikonik Yogyakarta termasuk Keraton dan Prambanan.',
            price: 1050000,
            rating: 4.5,
            image:
                'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Free Wi-Fi',
                'Pool',
                'Fitness Center',
                'Restaurant',
                'Malioboro Access',
                'Tour Desk',
            ],
        },

        // ─── BALI (5) ────────────────────────────────────────────────────────────────
        {
            name: 'Four Seasons Resort Bali at Sayan',
            location: 'Bali, Indonesia',
            description:
                'Resort ikonik di atas lembah Sungai Ayung, Ubud. Didirikan pada 1998 dan masuk daftar "One of the Best Hotels in the World". Villa pribadi dengan kolam renang tepi hutan.',
            price: 15000000,
            rating: 5.0,
            image:
                'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Private Pool Villa',
                'Jungle View',
                'Balinese Spa',
                'Yoga Pavilion',
                'River Rafting',
                'Butler Service',
                'Cooking Class',
            ],
        },
        {
            name: 'COMO Uma Canggu Bali',
            location: 'Bali, Indonesia',
            description:
                'Resort butik surf chic di kawasan Canggu yang trendi. Beachfront dengan kolam renang di tepi pantai, restoran farm-to-table, dan akses ke break surfing terbaik.',
            price: 5500000,
            rating: 4.9,
            image:
                'https://images.unsplash.com/photo-1573052905904-34ad8c27f0cc?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Beachfront',
                'Surf Access',
                'Infinity Pool',
                'Farm-to-Table',
                'Wellness Center',
                'Yoga',
                'Beach Club',
            ],
        },
        {
            name: 'The Mulia Bali',
            location: 'Bali, Indonesia',
            description:
                'Resort mewah di tepi pantai Nusa Dua dengan 526 suite dan villa. Grand ballroom terbesar di Bali, pantai privat, dan spa award-winning seluas 2.800 m².',
            price: 8500000,
            rating: 4.9,
            image:
                'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Private Beach',
                'Multiple Pools',
                'Award-Winning Spa',
                'Grand Ballroom',
                'Snorkeling',
                'Water Sports',
                'Fine Dining',
            ],
        },
        {
            name: 'Katamama Hotel Seminyak Bali',
            location: 'Bali, Indonesia',
            description:
                'Boutique hotel premium di Seminyak dengan hanya 58 suite yang semuanya dibuat tangan menggunakan bahan tradisional Bali. Setiap detail mencerminkan keahlian pengrajin lokal.',
            price: 6000000,
            rating: 4.8,
            image:
                'https://images.unsplash.com/photo-1543622748-5ee7237e8565?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Handcrafted Interiors',
                'Pool',
                'Artisan Bar',
                'Access to Potato Head',
                'Butler Service',
                'Spa',
            ],
        },
        {
            name: 'Alaya Resort Ubud Bali',
            location: 'Bali, Indonesia',
            description:
                'Resort butik tersembunyi di hutan Ubud dengan villa tepi sungai, program memasak masakan Bali, dan pengalaman budaya dari membuat canang hingga melukis.',
            price: 3200000,
            rating: 4.8,
            image:
                'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80',
            status: 'OPERATIONAL',
            amenities: [
                'Jungle Villa',
                'River View',
                'Cooking Class',
                'Cultural Experience',
                'Spa',
                'Infinity Pool',
                'Organic Garden',
            ],
        },
    ];

    let created = 0;
    let skipped = 0;

    for (const hotel of indonesianHotels) {
        const existing = await prisma.hotel.findFirst({ where: { name: hotel.name } });
        if (!existing) {
            await prisma.hotel.create({ data: hotel });
            created++;
            console.log(`  ✅ Created: ${hotel.name}`);
        } else {
            skipped++;
            console.log(`  ⏭️  Skipped (already exists): ${hotel.name}`);
        }
    }

    console.log('\n──────────────────────────────────────────');
    console.log(`🏨 Indonesia Hotels Seeder completed!`);
    console.log(`   ✅ Created : ${created} hotels`);
    console.log(`   ⏭️  Skipped : ${skipped} hotels`);
    console.log(`   📍 Jakarta  : 5 hotels`);
    console.log(`   📍 Bandung  : 10 hotels`);
    console.log(`   📍 Jogja    : 10 hotels`);
    console.log(`   📍 Bali     : 5 hotels`);
    console.log('──────────────────────────────────────────\n');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
