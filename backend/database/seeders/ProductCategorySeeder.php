<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Beton Readymix',
                'slug' => 'beton-readymix',
                'description' => 'Beton cor siap pakai dengan berbagai mutu (K-175 hingga K-500) untuk kebutuhan konstruksi. Tersedia dalam berbagai jenis seperti standar, minimix, dan khusus dengan kualitas terjamin dari batching plant modern.',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Pompa Beton',
                'slug' => 'pompa-beton',
                'description' => 'Jasa sewa pompa beton untuk berbagai kebutuhan pengecoran. Tersedia dalam jenis standar, mini, longboom, dan super longboom dengan jangkauan dan kapasitas yang beragam sesuai kebutuhan proyek.',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Jasa Finishing',
                'slug' => 'jasa-finishing',
                'description' => 'Layanan jasa finishing beton untuk hasil pengecoran yang sempurna. Termasuk acian, plesteran, polishing, dan coating untuk berbagai kebutuhan finishing lantai, dinding, dan struktur bangunan.',
                'sort_order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            ProductCategory::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}