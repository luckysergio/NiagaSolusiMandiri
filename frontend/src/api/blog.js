/**
 * @fileoverview Mock API dan Data Statis untuk Blog & Informasi Harga
 * Mensimulasikan respons backend Laravel untuk kebutuhan development frontend.
 * Nanti dapat dengan mudah diganti dengan pemanggilan axiosInstance yang sebenarnya.
 */

import { 
  Shield, Truck, TrendingUp, Zap, Award, Clock,
  Users, Ruler, Gauge, Sparkles 
} from 'lucide-react';

export const HARGA_READYMIX = [
  { mutu: "K 125", minimix: "Rp 1.470.000", standar: "Rp 1.160.000" },
  { mutu: "K 175", minimix: "Rp 1.490.000", standar: "Rp 1.190.000" },
  { mutu: "K 225", minimix: "Rp 1.510.000", standar: "Rp 1.205.000" },
  { mutu: "K 250", minimix: "Rp 1.520.000", standar: "Rp 1.215.000" },
  { mutu: "K 275", minimix: "Rp 1.530.000", standar: "Rp 1.230.000" },
  { mutu: "K 300", minimix: "Rp 1.540.000", standar: "Rp 1.250.000" },
  { mutu: "K 350", minimix: "Rp 1.560.000", standar: "Rp 1.305.000" },
  { mutu: "K 400", minimix: "Rp 1.600.000", standar: "Rp 1.330.000" },
  { mutu: "K 450", minimix: "Rp 1.640.000", standar: "Rp 1.360.000" },
  { mutu: "K 500", minimix: "Rp 1.690.000", standar: "Rp 1.400.000" }
];

export const KEUNGGULAN_READYMIX = [
  { icon: Shield, title: "Kualitas Standar SNI", desc: "Material terjamin sesuai spesifikasi", gradient: "from-blue-600 to-cyan-600" },
  { icon: Truck, title: "Pengiriman Tepat Waktu", desc: "Armada terawat dan tepat jadwal", gradient: "from-emerald-600 to-teal-600" },
  { icon: TrendingUp, title: "Mutu Lengkap", desc: "K125 hingga K500 tersedia", gradient: "from-purple-600 to-pink-600" },
  { icon: Zap, title: "Pengerjaan Cepat", desc: "Tim profesional berpengalaman", gradient: "from-amber-600 to-orange-600" },
  { icon: Award, title: "Harga Kompetitif", desc: "Transparan dan bersaing", gradient: "from-rose-600 to-red-600" },
  { icon: Clock, title: "Konsultasi Gratis", desc: "Layanan konsultasi tanpa biaya", gradient: "from-indigo-600 to-purple-600" }
];

export const HARGA_POMPA = [
  { volume: "5 m³ s/d 25 m³", standar: "Rp 4.000.000", longboom: "Rp 5.000.000", superLongboom: "Rp 7.500.000" },
  { volume: "26 m³ s/d 50 m³", standar: "Rp 4.200.000", longboom: "Rp 5.250.000", superLongboom: "Rp 7.750.000" },
  { volume: "51 m³ s/d 75 m³", standar: "Rp 4.400.000", longboom: "Rp 5.500.000", superLongboom: "Rp 8.000.000" },
  { volume: "76 m³ s/d 100 m³", standar: "Rp 4.600.000", longboom: "Rp 5.750.000", superLongboom: "Rp 8.250.000" }
];

export const HARGA_PER_M3 = [
  { volume: "Di atas 100 m³", standar: "Rp 45.000/m³", longboom: "Rp 60.000/m³", superLongboom: "Rp 85.000/m³" }
];

export const JENIS_POMPA = [
  { name: "Pompa Standar / Mini", icon: Truck, desc: "Cocok untuk proyek dengan akses terbatas", jangkauan: "30-40 meter", gradient: "from-blue-600 to-cyan-600" },
  { name: "Pompa Longboom", icon: Ruler, desc: "Jangkauan lebih jauh untuk proyek besar", jangkauan: "47-50 meter", gradient: "from-purple-600 to-pink-600" },
  { name: "Pompa Super Longboom", icon: Gauge, desc: "Untuk proyek dengan jangkauan ekstra", jangkauan: "50+ meter", gradient: "from-emerald-600 to-teal-600" }
];

export const KEUNGGULAN_POMPA = [
  { icon: Users, title: "Operator Berpengalaman", desc: "Tim tersertifikasi dan profesional", gradient: "from-blue-600 to-cyan-600" },
  { icon: Shield, title: "Unit Terawat", desc: "Pompa dalam kondisi prima", gradient: "from-emerald-600 to-teal-600" },
  { icon: Clock, title: "Mobilisasi Cepat", desc: "Tepat waktu sesuai jadwal", gradient: "from-purple-600 to-pink-600" },
  { icon: Zap, title: "Harga Kompetitif", desc: "Sewa dengan harga terbaik", gradient: "from-amber-600 to-orange-600" }
];

export const HARGA_FINISHING = [
  { dosis: "3 Kg/m²", naturalLokal: "Rp 30.000/m²", warnaLokal: "Rp 40.000/m²", naturalSika: "Rp 40.000/m²", warnaSika: "Rp 50.000/m²" },
  { dosis: "5 Kg/m²", naturalLokal: "Rp 40.000/m²", warnaLokal: "Rp 50.000/m²", naturalSika: "Rp 50.000/m²", warnaSika: "Rp 60.000/m²" }
];

export const JASA_TROWEL = { jasa: "Jasa Trowel", harga: "Rp 12.000/m²" };

export const KEUNGGULAN_FINISHING = [
  { icon: Sparkles, title: "Hasil Premium", desc: "Rata, halus, dan tahan lama", gradient: "from-blue-600 to-cyan-600" },
  { icon: Shield, title: "Bahan Berkualitas", desc: "Menggunakan Sika/Fosroc", gradient: "from-emerald-600 to-teal-600" },
  { icon: Award, title: "Tenaga Profesional", desc: "Berpengalaman dan terlatih", gradient: "from-purple-600 to-pink-600" },
  { icon: Zap, title: "Pengerjaan Cepat", desc: "Rapi dan tepat waktu", gradient: "from-amber-600 to-orange-600" },
  { icon: Clock, title: "Garansi Kepuasan", desc: "Hasil kerja terjamin", gradient: "from-rose-600 to-red-600" },
  { icon: Ruler, title: "Harga Kompetitif", desc: "Bersaing dan transparan", gradient: "from-indigo-600 to-purple-600" }
];

const BLOG_POSTS = [
  {
    id: 1,
    title: "Apa Itu Pompa Beton dan Bagaimana Cara Kerjanya?",
    slug: "apa-itu-pompa-beton-dan-bagaimana-cara-kerjanya",
    excerpt: "Pompa beton adalah alat yang digunakan untuk memindahkan beton cair dari truk mixer ke lokasi pengecoran. Pelajari cara kerja dan jenis-jenisnya di sini.",
    content: "Pompa beton (concrete pump) merupakan armada penyelamat sekaligus inovasi krusial dalam industri proyek konstruksi modern saat ini. Secara fungsional, alat berat ini dirancang khusus untuk memindahkan beton cair yang baru saja diolah dari truk mixer (molen) secara langsung menuju ke titik pusat pengecoran dengan memanfaatkan sistem hidrolik bertekanan tinggi...",
    category: "Pengetahuan Dasar",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-06-15",
    readTime: 5,
    image: "/images/blog/pompa-beton.png",
    tags: ["Pompa Beton", "Konstruksi", "Pengecoran"],
    featured: true,
  },
  {
    id: 2,
    title: "Beton Readymix vs Beton Cor Manual: Mana yang Lebih Baik?",
    slug: "beton-readymix-vs-beton-cor-manual-mana-yang-lebih-baik",
    excerpt: "Perbandingan antara beton readymix dan beton cor manual dari segi kualitas, efisiensi, dan biaya. Temukan jawabannya di sini.",
    content: "Menentukan pilihan antara menggunakan beton readymix atau mengandalkan metode beton cor manual merupakan keputusan strategis yang akan sangat memengaruhi masa depan dan kekuatan struktur proyek konstruksi Anda. Beton readymix diproduksi secara terpusat di dalam batching plant khusus dengan pengawasan kontrol kualitas (quality control) yang sangat ketat...",
    category: "Panduan",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-06-12",
    readTime: 7,
    image: "/images/blog/beton-readymix.png",
    tags: ["Beton Readymix", "Beton Cor", "Konstruksi"],
    featured: true,
  },
  {
    id: 3,
    title: "Panduan Memilih Mutu Beton (K-125 hingga K-500) untuk Proyek Anda",
    slug: "panduan-memilih-mutu-beton-k-125-hingga-k-500",
    excerpt: "Panduan lengkap memilih mutu beton yang tepat sesuai kebutuhan proyek konstruksi Anda. Dari K-125 untuk pondasi hingga K-500 untuk infrastruktur berat.",
    content: "Mutu beton merupakan faktor kunci yang paling menentukan dalam mengukur tingkat kekuatan tekan, kapasitas beban, serta ketahanan struktural sebuah bangunan terhadap waktu. Huruf 'K' (Karakteristik) yang tertera pada klasifikasi beton cor merujuk pada standar pengukuran kuat tekan beban beton per sentimeter persegi...",
    category: "Pengetahuan Dasar",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-06-10",
    readTime: 6,
    image: "/images/blog/mutu-beton.png",
    tags: ["Mutu Beton", "K-125", "K-500", "Konstruksi"],
    featured: false,
  },
  {
    id: 4,
    title: "Kapan Saya Membutuhkan Sewa Pompa Beton?",
    slug: "kapan-saya-membutuhkan-sewa-pompa-beton",
    excerpt: "Identifikasi situasi-situasi umum yang membutuhkan sewa pompa beton, seperti pengecoran area sulit, proyek bertingkat, dan akses terbatas.",
    content: "Memutuskan untuk menggunakan jasa sewa pompa beton menjadi sebuah langkah solusi yang sangat mendesak ketika kondisi geografis atau tata letak lokasi pengecoran tidak memungkinkan untuk dijangkau secara langsung oleh truk mixer standar. Terdapat beberapa situasi krusial di lapangan yang membuat keberadaan pompa beton ini menjadi wajib...",
    category: "Panduan Praktis",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-06-08",
    readTime: 5,
    image: "/images/blog/sewa-pompa.png",
    tags: ["Sewa Pompa", "Pompa Beton", "Konstruksi"],
    featured: false,
  },
  {
    id: 5,
    title: "5 Hal yang Harus Diperhatikan Sebelum Menyewa Pompa Beton",
    slug: "5-hal-yang-harus-diperhatikan-sebelum-menyewa-pompa-beton",
    excerpt: "Checklist penting sebelum menyewa pompa beton: ukuran proyek, jenis pompa yang tepat, biaya sewa, dan lainnya.",
    content: "Menyewa armada pompa beton membutuhkan tahapan perencanaan dan kalkulasi yang matang di awal agar seluruh proses operasional di lapangan dapat berjalan dengan lancar tanpa hambatan teknis yang merugikan. Langkah pertama yang wajib Anda lakukan adalah menentukan total volume beton serta jenis struktur proyek...",
    category: "Tips & Trik",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-06-05",
    readTime: 4,
    image: "/images/blog/tips-pompa.png",
    tags: ["Tips", "Sewa Pompa", "Konstruksi"],
    featured: false,
  },
  {
    id: 6,
    title: "Apa Itu Finishing Trowel dan Mengapa Penting untuk Lantai Beton?",
    slug: "apa-itu-finishing-trowel-dan-mengapa-penting",
    excerpt: "Finishing trowel adalah proses menghaluskan lantai beton. Pelajari manfaatnya untuk hasil lantai yang rata, halus, dan tahan lama.",
    content: "Finishing trowel merupakan salah satu tahapan krusial dalam rangkaian pengerjaan lantai beton (slab) yang idealnya diaplikasikan sekitar 3 hingga 4 jam setelah proses penuangan adonan beton selesai dilakukan, tepatnya saat beton memasuki fase setengah mengeras...",
    category: "Pengetahuan Dasar",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-06-03",
    readTime: 5,
    image: "/images/blog/finishing-trowel.png",
    tags: ["Finishing Trowel", "Lantai Beton", "Konstruksi"],
    featured: false,
  },
  {
    id: 7,
    title: "Tips Memilih Supplier Beton Cor yang Tepat",
    slug: "tips-memilih-supplier-beton-cor-yang-tepat",
    excerpt: "Kriteria supplier beton cor yang kredibel: pengalaman, kualitas material standar SNI, dan ketepatan waktu pengiriman.",
    content: "Memilih mitra supplier beton cor yang memiliki reputasi tinggi dan kredibel merupakan langkah awal yang paling menentukan untuk membawa proyek konstruksi Anda menuju gerbang keberhasilan. Kriteria utama yang harus dipastikan adalah rekam jejak pengalaman sang supplier...",
    category: "Tips & Trik",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-06-01",
    readTime: 6,
    image: "/images/blog/supplier-beton.png",
    tags: ["Supplier Beton", "Beton Cor", "Konstruksi"],
    featured: false,
  },
  {
    id: 8,
    title: "Cara Menghemat Biaya pada Proyek Pengecoran",
    slug: "cara-menghemat-biaya-pada-proyek-pengecoran",
    excerpt: "Tips menghemat biaya pengecoran dengan menggunakan pompa beton, memilih mutu tepat, dan mengurangi pemborosan material.",
    content: "Proyek pengecoran struktural sering kali memakan porsi anggaran biaya yang sangat besar dalam rencana anggaran biaya (RAB) konstruksi, namun sebenarnya terdapat beberapa strategi cerdas yang dapat diterapkan untuk menghemat pengeluaran tanpa harus menurunkan standar kualitas bangunan...",
    category: "Tips & Trik",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-05-28",
    readTime: 4,
    image: "/images/blog/hemat-biaya.png",
    tags: ["Hemat Biaya", "Pengecoran", "Konstruksi"],
    featured: false,
  },
  {
    id: 9,
    title: "Tren Konstruksi di Indonesia 2026: Peluang untuk Kontraktor",
    slug: "tren-konstruksi-indonesia-2026-peluang-kontraktor",
    excerpt: "Perkembangan industri konstruksi Indonesia di 2026, peluang untuk kontraktor dan supplier material bangunan.",
    content: "Laju pergerakan industri konstruksi domestik di Indonesia sepanjang tahun 2026 ini terus memperlihatkan tren pertumbuhan yang sangat masif seiring dengan akselerasi penyelesaian berbagai mega proyek infrastruktur nasional...",
    category: "Tren & Industri",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-05-25",
    readTime: 8,
    image: "/images/blog/tren-konstruksi.png",
    tags: ["Tren Konstruksi", "2026", "Industri"],
    featured: false,
  },
  {
    id: 10,
    title: "Dampak Teknologi Digital pada Industri Konstruksi",
    slug: "dampak-teknologi-digital-pada-industri-konstruksi",
    excerpt: "Bagaimana teknologi digital seperti BIM, drone, dan software manajemen proyek mengubah industri konstruksi.",
    content: "Penetrasi arus teknologi digital di era modern ini telah berhasil mengubah cara kerja, budaya eksekusi, serta pola manajemen di dalam industri konstruksi global secara fundamental dan menyeluruh...",
    category: "Tren & Industri",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-05-22",
    readTime: 7,
    image: "/images/blog/teknologi-konstruksi.png",
    tags: ["Teknologi", "Digital", "Konstruksi"],
    featured: false,
  },
  {
    id: 11,
    title: "Solusi Pengecoran di Gang Sempit: Pakai Truk Minimix & Pompa Mini",
    slug: "solusi-pengecoran-di-gang-sempit-pakai-truk-minimix-dan-pompa-mini",
    excerpt: "Punya proyek di area padat penduduk Tangerang? Ini kombinasi cerdas menggunakan truk beton Minimix dan pompa kodok/mini.",
    content: "Salah satu tantangan teknis paling pelik yang sering kali dihadapi saat mengeksekusi proyek konstruksi atau renovasi bangunan di wilayah perkotaan padat penduduk seperti area Ciledug, Ciputat, maupun kawasan Tangerang lainnya adalah akses jalan atau gang yang sangat sempit...",
    category: "Tips & Solusi",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-05-20",
    readTime: 5,
    image: "/images/blog/solusi-gang-sempit.png",
    tags: ["Minimix", "Pompa Beton Mini", "Tangerang"],
    featured: false,
  },
  {
    id: 12,
    title: "Mengenal Jenis Pompa Beton: Standar, Long Boom, dan Mini",
    slug: "mengenal-jenis-pompa-beton-standar-long-boom-dan-mini",
    excerpt: "Jangan salah sewa! Kenali perbedaan fungsi pompa beton standar, long boom, dan mini berdasarkan kebutuhan proyek dan akses jalan Anda.",
    content: "Setiap jenis proyek konstruksi di lapangan selalu memiliki karakteristik tersendiri serta tantangan aksesibilitas geografis lokasi yang berbeda-beda, sehingga pemilihan jenis alat pembantu pengecoran harus dilakukan secara cermat...",
    category: "Panduan Alat",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-05-18",
    readTime: 6,
    image: "/images/blog/jenis-pompa-beton.png",
    tags: ["Sewa Pompa Beton", "Concrete Pump", "Jenis Alat"],
    featured: false,
  },
  {
    id: 13,
    title: "Pentingnya Mengetahui Slump Test Beton Sebelum Pengecoran",
    slug: "pentingnya-mengetahui-slump-test-beton-sebelum-pengecoran",
    excerpt: "Apa itu nilai slump test beton? Ketahui metode pengujian kekentalan beton ini untuk memastikan struktur bangunan Anda kokoh.",
    content: "Pengujian slump test merupakan sebuah metode pengujian standarisasi teknis yang wajib dilakukan secara langsung di lokasi proyek (on-site) untuk mengukur tingkat konsistensi, kekentalan, workability (kemudahan pengerjaan)...",
    category: "Edukasi Beton",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-05-15",
    readTime: 4,
    image: "/images/blog/slump-test-beton.png",
    tags: ["Slump Test", "Kualitas Beton", "Uji Laboratorium"],
    featured: false,
  },
  {
    id: 14,
    title: "Cara Menghitung Kebutuhan Beton Cor Dak Lantai Rumah",
    slug: "cara-menghitung-kebutuhan-beton-cor-dak-lantai-rumah",
    excerpt: "Ingin memesan ready mix tapi bingung berapa kubik yang dibutuhkan? Ini rumus mudah menghitung volume beton cor agar pas dan hemat.",
    content: "Melakukan perhitungan estimasi kebutuhan volume beton cor untuk pengerjaan dak lantai sebenarnya merupakan hal yang mudah dan dapat dipelajari secara praktis oleh siapa saja tanpa harus berlatar belakang teknik sipil...",
    category: "Tips & Solusi",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-05-12",
    readTime: 4,
    image: "/images/blog/hitung-volume-beton.png",
    tags: ["Tips Konstruksi", "Rumus Beton", "Dak Rumah"],
    featured: false,
  },
  {
    id: 15,
    title: "Penyebab Beton Retak setelah Dicor dan Cara Mengatasinya",
    slug: "penyebab-beton-retak-setelah-dicor-dan-cara-mengatasinya",
    excerpt: "Retak rambut pada beton cor baru sering membuat panik. Kenali penyebab sementaranya dan cara merawat beton agar tidak retak.",
    content: "Munculnya indikasi gejala retak rambut (hairline cracks) pada permukaan struktur beton cor yang baru saja selesai dituangkan sering kali menimbulkan kepanikan bagi pemilik bangunan, namun fenomena ini umumnya dipicu oleh proses penguapan kadar air semen yang berlangsung terlampau cepat...",
    category: "Tips & Solusi",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-05-10",
    readTime: 5,
    image: "/images/blog/beton-retak.png",
    tags: ["Perawatan Beton", "Curing Beton", "Solusi Retak"],
    featured: false,
  },
  {
    id: 16,
    title: "Tips Sukses Pengecoran Rumah 2 Lantai agar Hemat Biaya",
    slug: "tips-sukses-pengecoran-rumah-2-lantai-agar-hemat-biaya",
    excerpt: "Merencanakan peningkatan rumah menjadi 2 lantai? Simak tips koordinasi waktu pengecoran dan alat agar tidak boncos.",
    content: "Melaksanakan proyek peningkatan konstruksi rumah tinggal menjadi bangunan berlantai 2 menuntut kesiapan teknis yang sangat matang, terutama pada aspek kekuatan struktur fondasi bawah, kolom penunjang, serta kekuatan susunan perancah (scaffolding)...",
    category: "Tips & Solusi",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-05-08",
    readTime: 5,
    image: "/images/blog/cor-rumah-dua-lantai.png",
    tags: ["Rumah Minimalis", "Dak Lantai 2", "Renovasi Rumah"],
    featured: false,
  },
  {
    id: 17,
    title: "Jasa Sewa Concrete Pump Murah di Tangerang Selatan",
    slug: "jasa-sewa-concrete-pump-murah-di-tangerang-selatan",
    excerpt: "Butuh sewa pompa beton untuk area BSD, Bintaro, Pamulang, atau Ciputat? Temukan layanan profesional dengan armada terlengkap di sini.",
    content: "Laju pertumbuhan dan roda perkembangan sektor properti komersial maupun hunian tapak di wilayah administrasi Tangerang Selatan (Tangsel) saat ini tercatat bergerak dengan sangat masif dan agresif dari waktu ke waktu...",
    category: "Info Harga",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-05-05",
    readTime: 4,
    image: "/images/blog/sewa-pompa-tangsel.png",
    tags: ["Sewa Pompa Beton", "Tangerang Selatan", "BSD Properti"],
    featured: false,
  },
  {
    id: 18,
    title: "Panduan Proyek Rigid Pavement Jalan Perumahan dengan Beton Mutu Tinggi",
    slug: "panduan-proyek-rigid-pavement-jalan-perumahan-beton-mutu-tinggi",
    excerpt: "Panduan lengkap pelaksanaan proyek rigid pavement jalan perumahan dengan beton mutu tinggi K-350 dan pompa beton untuk hasil maksimal.",
    content: `# Panduan Proyek Rigid Pavement Jalan Perumahan dengan Beton Mutu Tinggi\n\n## Pendahuluan\nPembangunan infrastruktur jalan merupakan elemen vital dalam pengembangan kawasan perumahan yang berkualitas. **Rigid pavement** atau perkerasan kaku menjadi pilihan utama karena menawarkan ketahanan luar biasa terhadap beban berat dan perubahan cuaca ekstrem.\n\nDalam pelaksanaan proyek rigid pavement, pemilihan material beton dengan mutu yang tepat menjadi faktor kunci keberhasilan. Beton ready mix mutu **K-350** menjadi standar ideal untuk jalan utama perumahan karena memiliki kekuatan tekan ≥ 350 kg/cm² yang mampu menahan beban kendaraan berat sekalipun.`,
    category: "Proyek Terkini",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-05-02",
    readTime: 7,
    image: "/images/blog/rigid-pavement-guide.png",
    tags: ["Rigid Pavement", "Beton K-350", "Proyek Perumahan", "Konstruksi Jalan"],
    featured: true,
  },
  {
    id: 19,
    title: "Mengapa Beton Cor Ready Mix Lebih Unggul dari Adukan Manual?",
    slug: "mengapa-beton-cor-ready-mix-lebih-unggul-dari-adukan-manual",
    excerpt: "Masih ragu memilih ready mix atau ngecor manual? Ketahui 5 alasan mengapa ready mix jauh lebih hemat waktu, tenaga, dan jaminan mutu.",
    content: "Meskipun dari kalkulasi sekilas di atas kertas opsi mengolah beton secara konvensional menggunakan tenaga manual manusia (site mix) terlihat menawarkan efisiensi pengeluaran biaya yang lebih hemat, namun pada kenyataannya metode ini sangat rawan menghasilkan kualitas beton yang rapuh dan tidak konsisten...",
    category: "Edukasi Beton",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-04-28",
    readTime: 4,
    image: "/images/blog/ready-mix-vs-manual.png",
    tags: ["Ready Mix", "Beton Berkualitas", "Tips Bangun Rumah"],
    featured: false,
  },
  {
    id: 20,
    title: "Daftar Harga Beton Cor Ready Mix Tangerang Terbaru 2026",
    slug: "daftar-harga-beton-cor-ready-mix-tangerang-terbaru-2026",
    excerpt: "Cek estimasi biaya dan daftar harga beton cor ready mix terlengkap untuk wilayah Kota Tangerang, Tangerang Selatan, dan Kabupaten Tangerang.",
    content: `# 💰 Daftar Harga Beton Cor Ready Mix Tangerang Terbaru 2026\n\nMelaksanakan agenda pembangunan infrastruktur, gedung, ruko, maupun hunian pribadi di wilayah strategis Tangerang tentu menuntut ketelitian perencanaan anggaran biaya yang matang dan akurat di awal. Guna membantu kelancaran penyusunan anggaran Anda, berikut kami sajikan rangkuman informasi resmi mengenai daftar harga beton cor ready mix...\n\n*(Data harga akan di-render secara dinamis oleh komponen frontend)*`,
    category: "Info Harga",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-04-25",
    readTime: 8,
    image: "/images/blog/harga-ready-mix-tangerang.png",
    tags: ["Harga Beton Cor", "Ready Mix Tangerang", "Biaya Konstruksi", "Sewa Pompa", "Finishing Lantai"],
    featured: true,
  }
];

export const blogApi = {
  getPosts: async (page = 1, limit = 6, category = '') => {

    let filtered = [...BLOG_POSTS];
    
    if (category) {
      filtered = filtered.filter(post => post.category === category);
    }

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    const total = filtered.length;
    const lastPage = Math.ceil(total / limit) || 1;
    const currentPage = Math.min(Math.max(1, page), lastPage);
    
    const start = (currentPage - 1) * limit;
    const end = start + limit;
    const data = filtered.slice(start, end);

    return Promise.resolve({
      success: true,
      data: {
        data,
        current_page: currentPage,
        last_page: lastPage,
        total,
        per_page: limit,
      }
    });
  },

  getPostBySlug: async (slug) => {
    const post = BLOG_POSTS.find(p => p.slug === slug);
    return Promise.resolve({
      success: true,
      data: post || null,
    });
  },

  getCategories: async () => {
    const categories = [...new Set(BLOG_POSTS.map(p => p.category))].sort();
    return Promise.resolve({
      success: true,
      data: categories,
    });
  },

  getFeaturedPosts: async () => {
    const featured = BLOG_POSTS.filter(p => p.featured);
    return Promise.resolve({
      success: true,
      data: featured,
    });
  },

  getAllImages: () => {
    return BLOG_POSTS
      .filter(post => post.image)
      .map(post => post.image);
  },

  getTotalPosts: () => {
    return BLOG_POSTS.length;
  },

  getRecentPosts: (limit = 3) => {
    const sorted = [...BLOG_POSTS].sort((a, b) => new Date(b.date) - new Date(a.date));
    return sorted.slice(0, limit);
  },

  getRelatedPosts: (slug, limit = 3) => {
    const currentPost = BLOG_POSTS.find(p => p.slug === slug);
    if (!currentPost) return [];
    
    const related = BLOG_POSTS
      .filter(p => p.slug !== slug && p.category === currentPost.category)
      .slice(0, limit);
      
    return related;
  },

  searchPosts: (query) => {
    const searchLower = query.toLowerCase();
    return BLOG_POSTS.filter(post =>
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  },

  getHargaData: () => {
    return {
      readymix: HARGA_READYMIX,
      keunggulanReadymix: KEUNGGULAN_READYMIX,
      pompa: HARGA_POMPA,
      perM3: HARGA_PER_M3,
      jenisPompa: JENIS_POMPA,
      keunggulanPompa: KEUNGGULAN_POMPA,
      finishing: HARGA_FINISHING,
      trowel: JASA_TROWEL,
      keunggulanFinishing: KEUNGGULAN_FINISHING
    };
  }
};