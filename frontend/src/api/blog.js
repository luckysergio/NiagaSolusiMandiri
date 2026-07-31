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
    excerpt: "Panduan lengkap tentang pompa beton, alat vital untuk proyek beton cor terdekat di Tangerang. Pelajari cara kerja, jenis, dan keuntungannya.",
    content: `## Apa Itu Pompa Beton?
Pompa beton (*concrete pump*) adalah alat berat yang dirancang khusus untuk memindahkan adonan beton cair dari truk mixer ke lokasi pengecoran yang sulit dijangkau. Bagi Anda yang mencari **beton cor terdekat** di wilayah Tangerang, penggunaan pompa beton adalah solusi paling efisien untuk memastikan beton sampai ke titik tuang dengan kualitas yang tetap terjaga.

## Bagaimana Cara Kerjanya?
Sistem kerja pompa beton mengandalkan tenaga hidrolik bertekanan tinggi. Adonan beton dari truk mixer akan dituang ke dalam *hopper* (corong penampung), kemudian didorong melalui pipa baja (*pipeline*) oleh piston hidrolik hingga mencapai lokasi pengecoran. 

### Jenis Pompa Beton untuk Proyek di Tangerang:
1. **Pompa Mini (Kodok)**: Sangat ideal untuk proyek di gang sempit atau perumahan padat di Tangerang.
2. **Pompa Standar**: Cocok untuk bangunan bertingkat rendah hingga menengah.
3. **Pompa Long Boom**: Solusi terbaik untuk proyek skala besar dengan jangkauan hingga 50 meter.

Memilih penyedia **sewa pompa beton terdekat** yang berpengalaman seperti Niaga Solusi Mandiri menjamin operasional yang lancar, aman, dan tepat waktu.`,
    category: "Pengetahuan Dasar",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-06-15",
    readTime: 5,
    image: "/images/blog/pompa-beton.webp",
    imageAlt: "Truk pompa beton sedang melakukan pengecoran di lokasi proyek konstruksi",
    tags: ["Pompa Beton", "Beton Cor Tangerang", "Konstruksi"],
    featured: true,
  },
  {
    id: 2,
    title: "Beton Readymix vs Beton Cor Manual: Mana yang Lebih Baik?",
    slug: "beton-readymix-vs-beton-cor-manual-mana-yang-lebih-baik",
    excerpt: "Perbandingan mendalam antara beton readymix dan cor manual. Temukan mengapa beton cor terdekat dari supplier terpercaya lebih unggul.",
    content: `## Perbandingan Kualitas dan Efisiensi
Memilih antara beton readymix dan beton cor manual adalah keputusan strategis. Bagi pemilik proyek di Tangerang, menggunakan layanan **beton cor terdekat** yang menyediakan readymix menawarkan keunggulan yang signifikan.

### 1. Konsistensi Kualitas (Mutu SNI)
Beton readymix diproduksi di batching plant dengan kontrol kualitas komputerisasi yang ketat. Setiap batch diuji *slump test* untuk memastikan kekentalan dan mutu (K-125 hingga K-500) sesuai standar SNI. Berbeda dengan cor manual yang sangat bergantung pada keterampilan tukang dan takaran yang seringkali tidak presisi.

### 2. Kecepatan Pengerjaan
Dengan menggunakan truk mixer dari supplier **beton cor Tangerang**, proses pengecoran menjadi jauh lebih cepat. Hal ini mengurangi risiko *cold joint* (sambungan dingin) yang dapat melemahkan struktur bangunan.

### 3. Efisiensi Biaya dan Tenaga
Meskipun terlihat lebih mahal di awal, readymix sebenarnya lebih hemat. Anda tidak perlu membeli material terpisah (pasir, semen, kerikil), menyewa molen, atau membayar banyak tenaga kerja. Pemborosan material (*waste*) juga dapat ditekan hingga hampir 0%.

Kesimpulannya, untuk proyek yang mengutamakan kekuatan struktur dan efisiensi, memilih **jual beton cor Tangerang** dari supplier profesional adalah investasi terbaik.`,
    category: "Panduan",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-06-12",
    readTime: 7,
    image: "/images/blog/beton-readymix.webp",
    imageAlt: "Perbandingan beton readymix dari truk mixer dengan beton cor manual menggunakan molen",
    tags: ["Beton Readymix", "Beton Cor Tangerang", "Konstruksi"],
    featured: true,
  },
  {
    id: 3,
    title: "Panduan Memilih Mutu Beton (K-125 hingga K-500) untuk Proyek Anda",
    slug: "panduan-memilih-mutu-beton-k-125-hingga-k-500",
    excerpt: "Panduan lengkap memilih mutu beton yang tepat. Dari K-125 untuk non-struktural hingga K-500 untuk infrastruktur berat di Tangerang.",
    content: `## Memahami Mutu Beton (K)
Huruf 'K' pada beton menandakan *Karakteristik* kuat tekan beton tersebut dalam satuan kg/cm² pada umur 28 hari. Memilih mutu yang tepat sangat krusial untuk keamanan dan anggaran proyek Anda. Saat memesan **beton cor terdekat**, pastikan Anda menyebutkan mutu yang sesuai dengan perhitungan struktur.

### Panduan Penggunaan Mutu Beton:
- **K-125 hingga K-175**: Ideal untuk pekerjaan non-struktural seperti lantai kerja (*lean concrete*), jalan setapak, atau pasangan bata.
- **K-225 hingga K-250**: Standar emas untuk struktur rumah tinggal 1-2 lantai, seperti sloof, kolom, balok, dan dak lantai. Ini adalah mutu yang paling banyak dipesan saat **jual beton cor Tangerang**.
- **K-300 hingga K-350**: Digunakan untuk struktur yang menahan beban lebih berat, seperti gedung bertingkat, jembatan, atau jalan raya dengan lalu lintas padat.
- **K-400 hingga K-500**: Diperuntukkan bagi infrastruktur berat seperti tiang pancang, bendungan, atau gedung pencakar langit.

### Tips Memesan:
Selalu konsultasikan dengan tim teknis dari penyedia **beton cor Tangerang** terpercaya untuk memverifikasi kebutuhan mutu proyek Anda, sehingga Anda mendapatkan kualitas terbaik tanpa pemborosan anggaran.`,
    category: "Pengetahuan Dasar",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-06-10",
    readTime: 6,
    image: "/images/blog/mutu-beton.webp",
    imageAlt: "Tabel perbandingan mutu beton K-125 sampai K-500 untuk berbagai jenis konstruksi",
    tags: ["Mutu Beton", "Beton Cor Tangerang", "Konstruksi"],
    featured: false,
  },
  {
    id: 4,
    title: "Kapan Saya Membutuhkan Sewa Pompa Beton?",
    slug: "kapan-saya-membutuhkan-sewa-pompa-beton",
    excerpt: "Identifikasi situasi yang membutuhkan sewa pompa beton terdekat, seperti akses gang sempit, proyek bertingkat, dan volume besar.",
    content: `## Mengapa Sewa Pompa Beton Sangat Penting?
Tidak semua lokasi proyek dapat diakses dengan mudah oleh truk mixer. Di sinilah peran vital dari layanan **sewa pompa beton terdekat**. Berikut adalah kondisi di mana Anda sangat disarankan untuk menggunakan jasa ini:

### 1. Akses Jalan yang Sempit
Banyak kawasan perumahan di Tangerang (seperti BSD, Bintaro, atau Pamulang) memiliki jalan masuk yang sempit. Truk mixer standar tidak bisa masuk, sehingga diperlukan kombinasi truk *minimix* dan pompa beton mini (*kodok*) untuk menjangkau lokasi.

### 2. Proyek Bertingkat (Gedung atau Ruko)
Menaikkan adonan beton ke lantai 2, 3, atau lebih menggunakan crane dan ember adalah metode yang lambat dan berisiko tinggi. Pompa beton dengan *boom* dapat menjangkau ketinggian hingga 50 meter dengan cepat dan aman.

### 3. Volume Pengecoran yang Besar
Untuk proyek seperti dak lantai luas atau jalan raya, kecepatan pengecoran sangat penting untuk mencegah terjadinya *cold joint*. Pompa beton mampu mengalirkan material dalam volume besar secara kontinu.

Memilih mitra **sewa pompa beton terdekat** yang memiliki armada lengkap dan operator bersertifikat akan menjamin kelancaran proyek Anda dari awal hingga akhir.`,
    category: "Panduan Praktis",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-06-08",
    readTime: 5,
    image: "/images/blog/sewa-pompa.webp",
    imageAlt: "Pompa beton mini untuk area sempit dengan akses terbatas",
    tags: ["Sewa Pompa Beton", "Beton Cor Tangerang", "Konstruksi"],
    featured: false,
  },
  {
    id: 5,
    title: "5 Hal yang Harus Diperhatikan Sebelum Menyewa Pompa Beton",
    slug: "5-hal-yang-harus-diperhatikan-sebelum-menyewa-pompa-beton",
    excerpt: "Checklist penting sebelum menyewa pompa beton terdekat: jenis pompa, akses lokasi, reputasi supplier, dan transparansi harga.",
    content: `## Checklist Sewa Pompa Beton agar Proyek Lancar
Menyewa alat berat bukanlah keputusan yang bisa diambil secara sembarangan. Agar proyek **beton cor Tangerang** Anda berjalan lancar, perhatikan 5 hal krusial berikut:

1. **Analisis Akses Lokasi**: Ukur lebar jalan, tinggi penghalang (kabel listrik/pohon), dan kondisi tanah. Ini akan menentukan apakah Anda membutuhkan pompa mini, standar, atau *long boom*.
2. **Estimasi Volume dan Kecepatan**: Pastikan kapasitas pompa (*m³/jam*) sesuai dengan volume total yang akan dicor dan kecepatan suplai dari truk mixer agar tidak terjadi penumpukan atau kekosongan.
3. **Reputasi dan Pengalaman Supplier**: Pilihlah penyedia **sewa pompa beton terdekat** yang memiliki rekam jejak baik, armada yang terawat, dan operator yang bersertifikat untuk menghindari kecelakaan kerja.
4. **Transparansi Biaya**: Pastikan harga yang ditawarkan sudah *all-in* (termasuk biaya mobilisasi, bahan bakar, dan operator) untuk menghindari biaya tersembunyi.
5. **Ketersediaan Armada**: Pastikan penyedia memiliki cadangan unit. Jika terjadi kerusakan mendadak pada hari-H, mereka bisa segera menggantinya tanpa menunda jadwal pengecoran Anda.`,
    category: "Tips & Trik",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-06-05",
    readTime: 4,
    image: "/images/blog/tips-pompa.webp",
    imageAlt: "Checklist persiapan sebelum menyewa pompa beton untuk proyek",
    tags: ["Tips", "Sewa Pompa Beton", "Beton Cor Tangerang"],
    featured: false,
  },
  {
    id: 6,
    title: "Apa Itu Finishing Trowel dan Mengapa Penting untuk Lantai Beton?",
    slug: "apa-itu-finishing-trowel-dan-mengapa-penting",
    excerpt: "Finishing trowel adalah proses menghaluskan lantai beton. Pelajari manfaatnya untuk hasil lantai yang rata, anti-slip, dan tahan lama.",
    content: `## Mengenal Finishing Trowel
*Finishing trowel* adalah tahap akhir dalam proses pengecoran lantai beton, di mana permukaan beton yang masih setengah kering dihaluskan menggunakan mesin *power trowel*. Bagi pemilik gudang atau pabrik di Tangerang, ini adalah langkah wajib untuk mendapatkan lantai yang berkualitas.

### Mengapa Finishing Trowel Sangat Penting?
1. **Permukaan Rata dan Halus**: Menghilangkan ketidakteraturan permukaan, membuat lantai terlihat estetis dan mudah dibersihkan.
2. **Meningkatkan Kepadatan Permukaan**: Proses pemutaran bilah *trowel* menekan partikel beton, membuatnya lebih padat, kedap air, dan tahan terhadap pengelupasan (*dusting*).
3. **Tahan Benturan dan Gesekan**: Sangat ideal untuk area dengan lalu lintas forklift atau kendaraan berat, seperti di kawasan industri Tangerang.
4. **Anti-Slip**: Meski halus, permukaan yang difinishing dengan benar memiliki tekstur mikro yang mencegah tergelincir.

Untuk hasil maksimal, pastikan Anda menggunakan jasa **beton cor terdekat** yang menyediakan paket lengkap dari pengecoran hingga *finishing trowel* oleh tenaga ahli berpengalaman.`,
    category: "Pengetahuan Dasar",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-06-03",
    readTime: 5,
    image: "/images/blog/finishing-trowel.webp",
    imageAlt: "Proses finishing trowel lantai beton menggunakan mesin trowel",
    tags: ["Finishing Trowel", "Beton Cor Tangerang", "Konstruksi"],
    featured: false,
  },
  {
    id: 7,
    title: "Tips Memilih Supplier Beton Cor yang Tepat",
    slug: "tips-memilih-supplier-beton-cor-yang-tepat",
    excerpt: "Kriteria memilih supplier beton cor terdekat: sertifikasi SNI, kondisi armada, transparansi harga, dan layanan purna jual.",
    content: `## Kunci Kesuksesan Proyek: Memilih Supplier yang Tepat
Kualitas struktur bangunan Anda sangat bergantung pada kualitas material yang digunakan. Memilih supplier **beton cor terdekat** yang salah bisa berakibat fatal, mulai dari keterlambatan proyek hingga kegagalan struktur.

### Kriteria Supplier Beton Cor Terpercaya:
1. **Kualitas Terstandarisasi (SNI)**: Pastikan batching plant mereka memiliki sertifikasi dan rutin melakukan uji tekan serta *slump test* di depan pelanggan.
2. **Armada Lengkap dan Terawat**: Supplier yang baik memiliki armada truk mixer dan pompa beton yang rutin diservis, meminimalkan risiko *breakdown* di tengah jalan.
3. **Layanan Konsultasi Teknis**: Supplier terbaik tidak hanya menjual, tetapi juga membantu menghitung kebutuhan volume dan merekomendasikan mutu yang tepat.
4. **Transparansi Harga**: Tidak ada biaya tersembunyi. Harga yang ditawarkan sudah mencakup mobilisasi dan pajak.
5. **Lokasi Strategis**: Memilih **jual beton cor Tangerang** yang berbasis di wilayah setempat (seperti Serpong atau BSD) akan memangkas biaya transportasi dan menjamin ketepatan waktu pengiriman.`,
    category: "Tips & Trik",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-06-01",
    readTime: 6,
    image: "/images/blog/supplier-beton.webp",
    imageAlt: "Supplier beton cor profesional dengan armada ready mix",
    tags: ["Supplier Beton", "Beton Cor Tangerang", "Konstruksi"],
    featured: false,
  },
  {
    id: 8,
    title: "Cara Menghemat Biaya pada Proyek Pengecoran",
    slug: "cara-menghemat-biaya-pada-proyek-pengecoran",
    excerpt: "Tips menghemat biaya pengecoran: hitung volume akurat, pilih mutu tepat, dan gunakan jasa beton cor terdekat untuk efisiensi logistik.",
    content: `## Strategi Efisiensi Anggaran Pengecoran
Pengecoran adalah salah satu pos pengeluaran terbesar dalam RAB (Rencana Anggaran Biaya). Namun, ada beberapa cara cerdas untuk menghemat biaya tanpa mengorbankan kualitas struktur.

### 1. Hitung Volume dengan Akurat
Kesalahan perhitungan adalah penyebab utama pemborosan. Gunakan rumus (Panjang x Lebar x Tinggi) dengan teliti, dan tambahkan *safety factor* sekitar 5-10% untuk mengantisipasi *waste* atau ketidakrataan lahan.

### 2. Pilih Mutu Beton Sesuai Kebutuhan
Jangan *over-spec*. Menggunakan mutu K-350 untuk lantai kerja non-struktural adalah pemborosan. Konsultasikan dengan ahli **beton cor terdekat** untuk menentukan mutu yang paling efisien dan aman.

### 3. Optimalkan Logistik
Memilih supplier **jual beton cor Tangerang** yang berlokasi dekat dengan proyek Anda akan secara signifikan memotong biaya transportasi dan mengurangi risiko beton mengeras di dalam truk akibat kemacetan.

### 4. Koordinasi yang Matang
Pastikan akses jalan, tenaga kerja, dan peralatan sudah siap sebelum truk tiba. Menunggu truk mixer berputar (*waiting time*) akan dikenakan biaya tambahan yang dapat dihindari dengan perencanaan yang baik.`,
    category: "Tips & Trik",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-05-28",
    readTime: 4,
    image: "/images/blog/hemat-biaya.webp",
    imageAlt: "Tips menghemat biaya pengecoran beton untuk proyek konstruksi",
    tags: ["Hemat Biaya", "Beton Cor Tangerang", "Konstruksi"],
    featured: false,
  },
  {
    id: 9,
    title: "Tren Konstruksi di Indonesia 2026: Peluang untuk Kontraktor",
    slug: "tren-konstruksi-indonesia-2026-peluang-kontraktor",
    excerpt: "Perkembangan industri konstruksi 2026, fokus pada keberlanjutan, efisiensi, dan tingginya permintaan beton cor berkualitas di wilayah penyangga ibukota.",
    content: `## Masa Depan Industri Konstruksi
Memasuki tahun 2026, industri konstruksi di Indonesia, khususnya di wilayah penyangga ibukota seperti Tangerang, terus menunjukkan pertumbuhan yang pesat. Didorong oleh pembangunan infrastruktur pemerintah dan sektor properti swasta, permintaan akan material berkualitas tinggi semakin meningkat.

### Tren Utama yang Perlu Diketahui:
1. **Efisiensi dan Kecepatan**: Kontraktor semakin beralih ke metode pracetak dan penggunaan **beton cor terdekat** (readymix) untuk mempercepat durasi proyek dan mengurangi ketergantungan pada tenaga kerja manual yang fluktuatif.
2. **Konstruksi Berkelanjutan**: Ada dorongan kuat untuk menggunakan material yang ramah lingkungan dan proses yang meminimalkan limbah (*zero waste*), di mana batching plant modern memiliki keunggulan dibanding pencampuran manual di lokasi.
3. **Kualitas Terstandarisasi**: Regulasi yang semakin ketat menuntut penggunaan beton yang telah teruji SNI, membuat peran supplier **beton cor Tangerang** yang profesional menjadi semakin krusial.

Bagi kontraktor dan pengembang, bermitra dengan penyedia layanan konstruksi yang adaptif terhadap tren ini adalah kunci untuk memenangkan kompetisi di pasar yang semakin ketat.`,
    category: "Tren & Industri",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-05-25",
    readTime: 8,
    image: "/images/blog/teknologi-konstruksi.webp",
    imageAlt: "Grafik tren industri konstruksi Indonesia tahun 2026",
    tags: ["Tren Konstruksi", "Beton Cor Tangerang", "Industri"],
    featured: false,
  },
  {
    id: 10,
    title: "Dampak Teknologi Digital pada Industri Konstruksi",
    slug: "dampak-teknologi-digital-pada-industri-konstruksi",
    excerpt: "Bagaimana teknologi digital meningkatkan efisiensi pemesanan beton cor terdekat, pelacakan armada, dan kontrol kualitas di lapangan.",
    content: `## Revolusi Digital di Dunia Konstruksi
Teknologi digital tidak hanya mengubah cara kita berkomunikasi, tetapi juga merevolusi cara proyek konstruksi dijalankan, terutama dalam hal logistik material.

### 1. Pemesanan dan Pelacakan Real-Time
Dulu, memesan **beton cor terdekat** adalah proses manual yang rentan salah komunikasi. Kini, dengan sistem digital, pelanggan dapat memesan, melacak posisi truk mixer secara *real-time* melalui GPS, dan memastikan beton tiba tepat waktu, menghindari risiko beton mengeras di jalan.

### 2. Kontrol Kualitas yang Terdata
Supplier modern menggunakan perangkat lunak untuk mencatat setiap hasil uji *slump* dan uji tekan dari setiap *batch* produksi. Data ini dapat diakses oleh klien sebagai jaminan transparansi dan kualitas **jual beton cor Tangerang** yang mereka beli.

### 3. Efisiensi Manajemen Proyek
Integrasi antara tim lapangan dan kantor pusat memungkinkan penyesuaian jadwal pengiriman yang dinamis, memastikan kelancaran proses pengecoran tanpa hambatan logistik.`,
    category: "Tren & Industri",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-05-22",
    readTime: 7,
    image: "/images/blog/teknologi-konstruksi.webp",
    imageAlt: "Teknologi digital untuk manajemen proyek konstruksi dan logistik",
    tags: ["Teknologi", "Digital", "Beton Cor Tangerang"],
    featured: false,
  },
  {
    id: 11,
    title: "Solusi Pengecoran di Gang Sempit: Pakai Truk Minimix & Pompa Mini",
    slug: "solusi-pengecoran-di-gang-sempit-pakai-truk-minimix-dan-pompa-mini",
    excerpt: "Solusi cerdas untuk proyek di area padat: kombinasi truk minimix dan pompa mini dari supplier beton cor terdekat.",
    content: `## Mengatasi Tantangan Akses Sempit
Salah satu tantangan terbesar dalam renovasi atau pembangunan di kawasan padat penduduk seperti Bintaro, Pamulang, atau BSD adalah akses jalan yang sempit. Truk mixer standar (berkapasitas 7-8 m³) seringkali tidak bisa masuk.

### Solusi Sinergis: Minimix + Pompa Mini
1. **Truk Minimix**: Dengan kapasitas 3-4 m³ dan dimensi yang lebih ramping, truk ini mampu menavigasi gang dengan lebar minimal 2.5 - 3 meter.
2. **Pompa Beton Mini (Kodok)**: Dipasang di belakang truk atau dioperasikan secara stasioner, pompa ini memiliki jangkauan vertikal dan horizontal yang cukup untuk menjangkau titik cor di dalam rumah atau gedung bertingkat rendah.

### Keunggulan Menggunakan Layanan Ini:
- **Aksesibilitas Maksimal**: Menjangkau lokasi yang sebelumnya dianggap "tidak mungkin" dicor.
- **Efisiensi Biaya**: Anda hanya membayar volume yang diangkut oleh minimix, tanpa biaya *waste* dari truk besar yang tertahan.
- **Kecepatan**: Proses tetap cepat dibandingkan dengan metode manual (molen).

Pastikan Anda berkonsultasi dengan penyedia **beton cor terdekat** untuk survei lokasi terlebih dahulu, memastikan kombinasi armada ini adalah solusi terbaik untuk proyek Anda.`,
    category: "Tips & Solusi",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-05-20",
    readTime: 5,
    image: "/images/blog/solusi-gang-sempit.webp",
    imageAlt: "Solusi pengecoran di gang sempit menggunakan truk minimix dan pompa mini",
    tags: ["Minimix", "Pompa Mini", "Beton Cor Tangerang"],
    featured: false,
  },
  {
    id: 12,
    title: "Mengenal Jenis Pompa Beton: Standar, Long Boom, dan Mini",
    slug: "mengenal-jenis-pompa-beton-standar-long-boom-dan-mini",
    excerpt: "Panduan memilih jenis pompa beton yang tepat: mini, standar, atau long boom, dari penyedia sewa pompa beton terdekat.",
    content: `## Memilih Pompa Beton yang Sesuai Kebutuhan
Tidak ada satu jenis pompa beton yang cocok untuk semua proyek. Memilih jenis yang salah dapat menyebabkan inefisiensi biaya atau bahkan kegagalan operasional di lapangan. Berikut adalah panduan memilih dari ahlinya:

### 1. Pompa Beton Mini (Kodok)
- **Jangkauan**: Vertikal hingga 20m, Horizontal hingga 30m.
- **Kelebihan**: Ukuran kompak, bisa masuk gang sempit, biaya sewa lebih ekonomis.
- **Penggunaan Ideal**: Renovasi rumah, ruko, atau proyek di perumahan padat dengan akses terbatas.

### 2. Pompa Beton Standar
- **Jangkauan**: Vertikal hingga 30-40m.
- **Kelebihan**: Kapasitas pompa lebih besar daripada mini, lebih stabil.
- **Penggunaan Ideal**: Pembangunan ruko 2-3 lantai, gedung perkantoran rendah, dan proyek dengan akses jalan yang cukup untuk truk standar.

### 3. Pompa Long Boom / Super Long Boom
- **Jangkauan**: Vertikal 40m hingga 50m+.
- **Kelebihan**: Jangkauan sangat jauh, mengurangi kebutuhan untuk memindahkan posisi truk.
- **Penggunaan Ideal**: Proyek gedung bertingkat tinggi, jembatan, atau area luas di mana truk hanya bisa parkir di satu titik.

Konsultasikan denah dan kondisi lokasi Anda dengan tim **sewa pompa beton terdekat** untuk mendapatkan rekomendasi armada yang paling efisien dan aman.`,
    category: "Panduan Alat",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-05-18",
    readTime: 6,
    image: "/images/blog/jenis-pompa-beton.webp",
    imageAlt: "Perbedaan pompa beton standar, long boom, dan mini concrete pump",
    tags: ["Sewa Pompa Beton", "Jenis Alat", "Beton Cor Tangerang"],
    featured: false,
  },
  {
    id: 13,
    title: "Pentingnya Mengetahui Slump Test Beton Sebelum Pengecoran",
    slug: "pentingnya-mengetahui-slump-test-beton-sebelum-pengecoran",
    excerpt: "Apa itu slump test? Pastikan kualitas beton cor terdekat Anda dengan memahami metode pengujian kekentalan ini.",
    content: `## Apa Itu Slump Test?
*Slump test* adalah metode pengujian sederhana namun krusial yang dilakukan di lokasi proyek untuk mengukur konsistensi atau kekentalan adonan beton segar sebelum dituang. Ini adalah indikator awal yang vital untuk menjamin kualitas **beton cor terdekat** yang Anda terima.

## Mengapa Slump Test Sangat Penting?
1. **Menjamin Workability**: Beton yang terlalu kaku sulit dipompa dan diratakan, sementara beton yang terlalu encer akan mudah mengalami segregasi (pemisahan agregat dan pasta semen), yang melemahkan struktur.
2. **Indikator Konsistensi**: Nilai slump yang sesuai dengan pesanan (biasanya 12±2 cm untuk pengecoran umum) menandakan bahwa batching plant telah mencampur material dengan proporsi yang tepat.
3. **Mencegah Penolakan di Lapangan**: Dengan melakukan uji slump di depan truk, Anda memiliki bukti objektif jika terjadi ketidaksesuaian mutu, melindungi investasi proyek Anda.

Supplier **jual beton cor Tangerang** yang profesional dan terpercaya akan selalu melakukan dan mendokumentasikan uji slump di hadapan perwakilan klien sebelum proses pengecoran dimulai.`,
    category: "Edukasi Beton",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-05-15",
    readTime: 4,
    image: "/images/blog/slump-test-beton.webp",
    imageAlt: "Alat slump test untuk mengukur kekentalan beton segar",
    tags: ["Slump Test", "Kualitas Beton", "Beton Cor Tangerang"],
    featured: false,
  },
  {
    id: 14,
    title: "Cara Menghitung Kebutuhan Beton Cor Dak Lantai Rumah",
    slug: "cara-menghitung-kebutuhan-beton-cor-dak-lantai-rumah",
    excerpt: "Rumus mudah menghitung volume beton cor untuk dak lantai. Hindari pemborosan dengan memesan dari supplier beton cor terdekat.",
    content: `## Panduan Menghitung Volume Beton Dak
Salah satu kekhawatiran utama dalam proyek rumah adalah kelebihan atau kekurangan material. Menghitung volume dengan tepat adalah kunci efisiensi.

### Rumus Dasar:
**Volume (m³) = Panjang (m) x Lebar (m) x Tinggi/Tebal (m)**

**Contoh Kasus:**
Anda akan mengecor dak lantai dengan ukuran 10 meter x 10 meter, dengan tebal dak 0.12 meter (12 cm).
- Volume = 10 m x 10 m x 0.12 m = **12 m³**

### Tips Penting Saat Memesan:
1. **Tambahkan Faktor Keamanan**: Selalu tambahkan 5% hingga 10% dari total volume perhitungan untuk mengantisipasi tumpahan, ketidakrataan bekisting, atau sisa di dalam selang pompa. Dari contoh di atas, pesanlah sekitar 12.6 m³ hingga 13.2 m³.
2. **Pilih Mutu yang Tepat**: Untuk dak lantai rumah tinggal, mutu K-225 atau K-250 umumnya sudah sangat memadai dan ekonomis.
3. **Gunakan Jasa Terpercaya**: Pastikan Anda memesan dari penyedia **beton cor terdekat** yang dapat menjamin ketepatan waktu pengiriman, karena keterlambatan dapat menyebabkan beton mengeras di dalam truk.`,
    category: "Tips & Solusi",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-05-12",
    readTime: 4,
    image: "/images/blog/hitung-volume-beton.webp",
    imageAlt: "Rumus menghitung volume beton cor untuk dak lantai rumah",
    tags: ["Tips Konstruksi", "Hitung Beton", "Beton Cor Tangerang"],
    featured: false,
  },
  {
    id: 15,
    title: "Penyebab Beton Retak setelah Dicor dan Cara Mengatasinya",
    slug: "penyebab-beton-retak-setelah-dicor-dan-cara-mengatasinya",
    excerpt: "Retak rambut pada beton? Kenali penyebabnya dan cara mencegahnya dengan memilih campuran beton cor terdekat yang berkualitas.",
    content: `## Memahami Retak pada Beton
Munculnya retak rambut (*hairline cracks*) pada permukaan beton yang baru dicor adalah masalah umum yang sering menimbulkan kekhawatiran. Meskipun sebagian kecil retak rambut bersifat normal akibat penyusutan plastik, retak yang berlebihan dapat mengindikasikan masalah pada kualitas atau perawatan.

### Penyebab Utama:
1. **Penguapan Terlalu Cepat**: Cuaca panas atau angin kencang di lokasi proyek (umum di Tangerang) menyebabkan air di permukaan beton menguap terlalu cepat sebelum beton sempat mengeras, menyebabkan retak susut plastik.
2. **Rasio Air yang Tidak Tepat**: Menambahkan air secara sembarangan di lapangan untuk memudahkan pengerjaan akan melemahkan campuran dan meningkatkan risiko retak.
3. **Perawatan (Curing) yang Buruk**: Beton membutuhkan kelembapan untuk proses hidrasi semen yang sempurna.

### Solusi dan Pencegahan:
- **Gunakan Beton Berkualitas**: Pastikan Anda memesan dari supplier **beton cor terdekat** yang menjamin konsistensi campuran dan slump yang tepat.
- **Lakukan Curing dengan Benar**: Segera setelah beton mulai mengeras, lakukan *curing* dengan menyiram air secara berkala atau menggunakan *curing compound* selama minimal 7 hari.
- **Hindari Beban Dini**: Jangan memberikan beban atau melakukan aktivitas di atas dak sebelum beton mencapai kekuatan yang cukup (biasanya 14-28 hari).`,
    category: "Tips & Solusi",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-05-10",
    readTime: 5,
    image: "/images/blog/beton-retak.webp",
    imageAlt: "Contoh retak rambut pada beton cor dan cara perbaikannya",
    tags: ["Perawatan Beton", "Curing", "Beton Cor Tangerang"],
    featured: false,
  },
  {
    id: 16,
    title: "Tips Sukses Pengecoran Rumah 2 Lantai agar Hemat Biaya",
    slug: "tips-sukses-pengecoran-rumah-2-lantai-agar-hemat-biaya",
    excerpt: "Rencanakan pengecoran rumah 2 lantai dengan tepat: pilih mutu yang pas, gunakan pompa mini, dan koordinasi dengan supplier beton cor terdekat.",
    content: `## Strategi Pengecoran Lantai 2 yang Efisien
Membangun rumah 2 lantai memerlukan perencanaan struktur dan logistik yang matang, terutama saat proses pengecoran dak. Kesalahan kecil bisa berakibat pada pemborosan biaya atau masalah struktural.

### 1. Pilih Mutu Beton yang Tepat
Untuk struktur dak lantai 2 rumah tinggal, mutu **K-225 atau K-250** umumnya sudah sangat memadai secara struktural dan lebih ekonomis dibandingkan menggunakan mutu yang lebih tinggi (seperti K-300) yang tidak diperlukan.

### 2. Manfaatkan Pompa Beton Mini
Untuk lantai 2, menggunakan *tower crane* atau *hoist* manual sangat lambat dan berisiko. Menggunakan **sewa pompa beton terdekat** (terutama jenis mini atau standar) akan mempercepat proses pengecoran secara drastis, mengurangi jumlah tenaga kerja, dan memastikan kualitas beton tetap prima karena tidak ada jeda waktu yang lama.

### 3. Koordinasi Logistik yang Ketat
Pastikan akses jalan ke lokasi sudah jelas. Koordinasikan dengan penyedia **beton cor Tangerang** Anda mengenai jadwal pengiriman yang presisi agar truk tidak antre di jalan, yang dapat menyebabkan beton mengeras di dalam drum mixer dan menimbulkan biaya tambahan.`,
    category: "Tips & Solusi",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-05-08",
    readTime: 5,
    image: "/images/blog/cor-rumah-dua-lantai.webp",
    imageAlt: "Proses pengecoran dak lantai 2 rumah bertingkat",
    tags: ["Rumah Minimalis", "Dak Lantai 2", "Beton Cor Tangerang"],
    featured: false,
  },
  {
    id: 17,
    title: "Jasa Sewa Concrete Pump Murah di Tangerang Selatan",
    slug: "jasa-sewa-concrete-pump-murah-di-tangerang-selatan",
    excerpt: "Butuh sewa pompa beton di BSD, Bintaro, atau Pamulang? Temukan layanan sewa pompa beton terdekat dengan harga transparan dan armada lengkap.",
    content: `## Mengapa Memilih Layanan Lokal di Tangerang Selatan?
Tangerang Selatan (Tangsel) adalah salah satu pusat pertumbuhan properti terpesat di Banten. Dari kawasan premium seperti BSD City dan Bintaro Jaya, hingga area berkembang seperti Pamulang dan Ciputat, kebutuhan akan material konstruksi berkualitas sangat tinggi.

### Keuntungan Menggunakan Jasa Lokal:
1. **Biaya Mobilisasi Lebih Rendah**: Memilih penyedia **sewa pompa beton terdekat** yang berbasis di Tangsel secara otomatis memangkas biaya transportasi yang signifikan dibandingkan mendatangkan unit dari luar kota.
2. **Respon Waktu yang Cepat**: Dalam proyek konstruksi, waktu adalah uang. Supplier lokal dapat lebih mudah menyesuaikan jadwal atau mengirimkan unit cadangan jika terjadi kendala teknis mendadak.
3. **Pemahaman Kondisi Lokal**: Operator yang familiar dengan kondisi jalan dan peraturan lalu lintas di wilayah Tangsel (seperti aturan ganjil-genap atau jam operasional truk) akan memastikan pengiriman berjalan lancar tanpa hambatan.

Pastikan Anda memilih mitra yang tidak hanya menawarkan harga murah, tetapi juga menjamin kualitas armada, keselamatan kerja, dan transparansi harga tanpa biaya tersembunyi.`,
    category: "Info Harga",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-05-05",
    readTime: 4,
    image: "/images/blog/sewa-pompa-tangsel.webp",
    imageAlt: "Armada pompa beton siap sewa untuk area Tangerang Selatan BSD Bintaro",
    tags: ["Sewa Pompa Beton", "Tangerang Selatan", "Beton Cor Tangerang"],
    featured: false,
  },
  {
    id: 18,
    title: "Panduan Proyek Rigid Pavement Jalan Perumahan dengan Beton Mutu Tinggi",
    slug: "panduan-proyek-rigid-pavement-jalan-perumahan-beton-mutu-tinggi",
    excerpt: "Panduan lengkap rigid pavement jalan perumahan menggunakan beton mutu tinggi. Solusi terbaik dari penyedia beton cor terdekat.",
    content: `## Keunggulan Rigid Pavement untuk Perumahan
*Rigid pavement* (perkerasan kaku) menggunakan plat beton sebagai struktur utama penahan beban. Dibandingkan dengan jalan aspal (*flexible pavement*), jalan beton menawarkan umur pakai yang jauh lebih panjang, biaya perawatan yang minimal, dan ketahanan yang luar biasa terhadap genangan air dan beban kendaraan berat.

### Spesifikasi Kunci untuk Keberhasilan:
1. **Mutu Beton yang Tepat**: Untuk jalan perumahan yang akan dilalui kendaraan ringan hingga sedang, mutu beton minimal **K-300 atau K-350** sangat direkomendasikan untuk menjamin ketahanan retak dan daya dukung.
2. **Konsistensi Campuran**: Kualitas rigid pavement sangat bergantung pada konsistensi beton. Menggunakan layanan **jual beton cor Tangerang** dari batching plant terpercaya menjamin setiap *batch* memiliki kuat tekan yang seragam, berbeda dengan adukan manual di lokasi.
3. **Pengecoran Kontinu**: Proses pengecoran harus dilakukan secara terus-menerus untuk menghindari *cold joint* yang dapat menjadi titik lemah pada plat jalan. Penggunaan pompa beton dapat sangat membantu dalam mendistribusikan beton secara merata dan cepat.

Investasi pada material berkualitas dan eksekusi yang tepat sejak awal akan menghemat biaya perawatan jalan perumahan secara signifikan dalam jangka panjang.`,
    category: "Proyek Terkini",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-05-02",
    readTime: 7,
    image: "/images/blog/rigid-pavement-guide.webp",
    imageAlt: "Proyek rigid pavement jalan perumahan dengan beton mutu K-350",
    tags: ["Rigid Pavement", "Beton K-350", "Beton Cor Tangerang"],
    featured: true,
  },
  {
    id: 19,
    title: "Mengapa Beton Cor Ready Mix Lebih Unggul dari Adukan Manual?",
    slug: "mengapa-beton-cor-ready-mix-lebih-unggul-dari-adukan-manual",
    excerpt: "5 alasan kuat mengapa ready mix lebih unggul dari adukan manual: kualitas SNI, kecepatan, dan efisiensi dari supplier beton cor terdekat.",
    content: `## Mengubah Pola Pikir: Beralih ke Ready Mix
Banyak yang masih beranggapan bahwa mencampur beton secara manual di lokasi (*site mix*) lebih murah. Namun, jika dihitung secara menyeluruh, **beton cor readymix** menawarkan nilai yang jauh lebih unggul.

### 5 Keunggulan Utama Ready Mix:
1. **Jaminan Mutu SNI**: Beton diproduksi di batching plant dengan timbangan komputerisasi, memastikan proporsi semen, air, dan agregat selalu presisi. Hal ini mustahil dicapai dengan takaran manual.
2. **Kecepatan Pengerjaan**: Truk mixer dapat menuang volume besar dalam waktu singkat, mempercepat durasi proyek secara signifikan.
3. **Nol Pemborosan Material**: Anda hanya membayar volume yang Anda pesan. Tidak ada sisa pasir atau semen yang terbuang atau dicuri di lokasi proyek.
4. **Lingkungan Kerja Lebih Bersih**: Mengurangi debu, kebisingan dari molen, dan tumpukan material di lahan yang sempit.
5. **Efisiensi Tenaga Kerja**: Mengurangi ketergantungan pada jumlah tukang yang besar, yang saat ini biayanya semakin tinggi dan sulit didapat.

Memilih **jual beton cor Tangerang** dari supplier profesional adalah langkah cerdas untuk menjamin kualitas struktur dan efisiensi anggaran proyek Anda secara keseluruhan.`,
    category: "Edukasi Beton",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-04-28",
    readTime: 4,
    image: "/images/blog/ready-mix-vs-manual.webp",
    imageAlt: "Perbandingan kualitas beton ready mix versus adukan manual",
    tags: ["Ready Mix", "Beton Berkualitas", "Beton Cor Tangerang"],
    featured: false,
  },
  {
    id: 20,
    title: "Daftar Harga Beton Cor Ready Mix Tangerang Terbaru 2026",
    slug: "daftar-harga-beton-cor-ready-mix-tangerang-terbaru-2026",
    excerpt: "Update harga beton cor readymix terbaru di Tangerang. Transparan, kompetitif, dan langsung dari supplier beton cor terdekat terpercaya.",
    content: `## Transparansi Harga untuk Proyek Anda
Perencanaan anggaran yang akurat adalah kunci sukses proyek konstruksi. Berikut adalah estimasi **harga beton cor Tangerang** terbaru yang dapat Anda jadikan acuan. 

> **Catatan Penting:** Harga di bawah adalah estimasi dasar. Harga final dapat bervariasi tergantung pada volume pemesanan, jarak lokasi proyek, dan kondisi akses jalan. Selalu konfirmasi ke tim marketing kami untuk penawaran terbaik.

### Daftar Harga Beton Cor Readymix (Per m³)
| Mutu Beton | Minimix / m³ | Standar / m³ |
| :--- | :---: | :---: |
| **K 125** | Rp 1.470.000 | Rp 1.160.000 |
| **K 175** | Rp 1.490.000 | Rp 1.190.000 |
| **K 225** | Rp 1.510.000 | Rp 1.205.000 |
| **K 250** | Rp 1.520.000 | Rp 1.215.000 |
| **K 300** | Rp 1.540.000 | Rp 1.250.000 |
| **K 350** | Rp 1.560.000 | Rp 1.305.000 |

### Harga Sewa Pompa Beton
| Volume Pengecoran | Standar / Mini | Longboom | Super Longboom |
| :--- | :---: | :---: | :---: |
| **5 m³ s/d 25 m³** | Rp 4.000.000 | Rp 5.000.000 | Rp 7.500.000 |
| **26 m³ s/d 50 m³** | Rp 4.200.000 | Rp 5.250.000 | Rp 7.750.000 |

### Mengapa Memilih Kami?
Sebagai **beton cor terdekat** yang berbasis di Tangerang, kami menawarkan:
- **Harga Langsung Pabrik**: Tanpa perantara yang menaikkan harga.
- **Armada Lengkap**: Dari minimix untuk gang sempit hingga long boom untuk proyek besar.
- **Layanan Teknis**: Konsultasi gratis untuk menghitung kebutuhan dan menentukan mutu yang tepat.

Hubungi kami hari ini untuk mendapatkan penawaran harga khusus yang disesuaikan dengan kebutuhan spesifik proyek Anda.`,
    category: "Info Harga",
    author: "Tim Niaga Solusi Mandiri",
    date: "2026-04-25",
    readTime: 8,
    image: "/images/blog/harga-ready-mix-tangerang.webp",
    imageAlt: "Daftar harga beton cor readymix dan sewa pompa beton Tangerang 2026",
    tags: ["Harga Beton Cor", "Ready Mix Tangerang", "Beton Cor Tangerang"],
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