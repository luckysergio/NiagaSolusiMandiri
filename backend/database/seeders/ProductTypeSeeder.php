<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use App\Models\ProductType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductTypeSeeder extends Seeder
{
    public function run(): void
    {
        $betonReadymix = ProductCategory::where('slug', 'beton-readymix')->first();
        $pompaBeton = ProductCategory::where('slug', 'pompa-beton')->first();
        $jasaFinishing = ProductCategory::where('slug', 'jasa-finishing')->first();

        if (!$betonReadymix || !$pompaBeton || !$jasaFinishing) {
            $this->command->error('❌ Product categories not found. Please run ProductCategorySeeder first!');
            return;
        }

        $types = [
            [
                'category_id' => $betonReadymix->id,
                'name' => 'Minimix',
                'slug' => 'minimix',
                'description' => 'Beton readymix dalam volume kecil (1-3 m³) ideal untuk proyek rumah tinggal, renovasi, dan area dengan akses terbatas. Menggunakan truk mixer mini yang lincah dan praktis.',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'category_id' => $betonReadymix->id,
                'name' => 'Standar',
                'slug' => 'standar',
                'description' => 'Beton readymix volume besar (4-10 m³) untuk proyek komersial, gedung, jalan, dan infrastruktur. Tersedia dalam berbagai mutu (K-175, K-225, K-250, K-300, K-350, K-400, K-450, K-500).',
                'sort_order' => 2,
                'is_active' => true,
            ],

            [
                'category_id' => $pompaBeton->id,
                'name' => 'Standar/Mini',
                'slug' => 'standar-mini',
                'description' => 'Pompa beton standar dan mini dengan jangkauan 15-30 meter dan kapasitas 30-60 m³/jam. Cocok untuk proyek rumah tinggal, ruko, dan bangunan 2-3 lantai dengan akses terbatas.',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'category_id' => $pompaBeton->id,
                'name' => 'Longboom',
                'slug' => 'longboom',
                'description' => 'Pompa beton longboom dengan jangkauan 32-42 meter dan kapasitas 60-90 m³/jam. Ideal untuk proyek gedung bertingkat, jembatan, dan konstruksi skala menengah hingga besar.',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'category_id' => $pompaBeton->id,
                'name' => 'Super Longboom',
                'slug' => 'super-longboom',
                'description' => 'Pompa beton super longboom dengan jangkauan 45-60+ meter dan kapasitas 90-150 m³/jam. Untuk proyek high-rise building, infrastruktur besar, dan area dengan ketinggian ekstrem.',
                'sort_order' => 3,
                'is_active' => true,
            ],

            [
                'category_id' => $jasaFinishing->id,
                'name' => 'Natural Lokal',
                'slug' => 'natural-lokal',
                'description' => 'Finishing beton ekspos natural menggunakan material lokal. Memberikan tampilan alami beton dengan tekstur halus dan tampilan industrial yang estetik untuk dinding dan lantai.',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'category_id' => $jasaFinishing->id,
                'name' => 'Warna Lokal',
                'slug' => 'warna-lokal',
                'description' => 'Finishing beton ekspos berwarna menggunakan cat dan material lokal berkualitas. Tersedia berbagai pilihan warna untuk tampilan dekoratif pada dinding, lantai, dan elemen arsitektur.',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'category_id' => $jasaFinishing->id,
                'name' => 'Sika Natural',
                'slug' => 'sika-natural',
                'description' => 'Finishing premium menggunakan produk Sika untuk hasil natural yang tahan lama. Termasuk waterproofing, anti-bocor, dan proteksi struktur dengan standar internasional.',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'category_id' => $jasaFinishing->id,
                'name' => 'Sika Warna',
                'slug' => 'sika-warna',
                'description' => 'Finishing premium Sika dengan variasi warna. Kombinasi proteksi struktur dan estetika warna untuk hasil akhir yang tahan cuaca, anti-jamur, dan tampilan modern.',
                'sort_order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($types as $type) {
            ProductType::updateOrCreate(
                [
                    'category_id' => $type['category_id'],
                    'slug' => $type['slug'],
                ],
                $type
            );
        }
    }
}