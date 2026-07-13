<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductType;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {

        $types = [
            'minimix'         => ProductType::where('slug', 'minimix')->first(),
            'standar'         => ProductType::where('slug', 'standar')->first(),
            'standarMini'     => ProductType::where('slug', 'standar-mini')->first(),
            'longboom'        => ProductType::where('slug', 'longboom')->first(),
            'superLongboom'   => ProductType::where('slug', 'super-longboom')->first(),
            'naturalLokal'    => ProductType::where('slug', 'natural-lokal')->first(),
            'warnaLokal'      => ProductType::where('slug', 'warna-lokal')->first(),
            'sikaNatural'     => ProductType::where('slug', 'sika-natural')->first(),
            'sikaWarna'       => ProductType::where('slug', 'sika-warna')->first(),
        ];

        foreach ($types as $name => $type) {
            if (!$type) {
                $this->command->error("❌ Product type '{$name}' not found. Please run ProductTypeSeeder first!");
                return;
            }
        }

        $hargaReadymix = [
            ['mutu' => 'K-125', 'minimix' => 1470000, 'standar' => 1160000],
            ['mutu' => 'K-175', 'minimix' => 1490000, 'standar' => 1190000],
            ['mutu' => 'K-225', 'minimix' => 1510000, 'standar' => 1205000],
            ['mutu' => 'K-250', 'minimix' => 1520000, 'standar' => 1215000],
            ['mutu' => 'K-275', 'minimix' => 1530000, 'standar' => 1230000],
            ['mutu' => 'K-300', 'minimix' => 1540000, 'standar' => 1250000],
            ['mutu' => 'K-350', 'minimix' => 1560000, 'standar' => 1305000],
            ['mutu' => 'K-400', 'minimix' => 1600000, 'standar' => 1330000],
            ['mutu' => 'K-450', 'minimix' => 1640000, 'standar' => 1360000],
            ['mutu' => 'K-500', 'minimix' => 1690000, 'standar' => 1400000],
        ];

        $sortOrder = 1;
        foreach ($hargaReadymix as $item) {
            $mutu = $item['mutu']; // K-125, K-175, dst

            Product::updateOrCreate(
                ['code' => 'BRT-' . $mutu . '-MIN'],
                [
                    'product_type_id' => $types['minimix']->id,
                    'name' => "Beton Readymix Minimix {$mutu}",
                    'description' => "Beton readymix mutu {$mutu} dalam volume kecil (1-3 m³). Cocok untuk proyek rumah tinggal, renovasi, dan area dengan akses terbatas. Truk mixer mini yang lincah dan praktis.",
                    'price' => $item['minimix'],
                    'unit' => 'm³',
                    'minimum_order' => 1,
                    'sort_order' => $sortOrder,
                    'featured' => $mutu === 'K-300',
                    'is_active' => true,
                ]
            );

            Product::updateOrCreate(
                ['code' => 'BRT-' . $mutu . '-STD'],
                [
                    'product_type_id' => $types['standar']->id,
                    'name' => "Beton Readymix Standar {$mutu}",
                    'description' => "Beton readymix mutu {$mutu} volume besar (4-10 m³). Ideal untuk proyek komersial, gedung, jalan, dan infrastruktur. Kualitas terjamin dari batching plant modern.",
                    'price' => $item['standar'],
                    'unit' => 'm³',
                    'minimum_order' => 1,
                    'sort_order' => $sortOrder,
                    'featured' => $mutu === 'K-300',
                    'is_active' => true,
                ]
            );

            $sortOrder++;
        }

        $hargaPompa = [
            ['volume' => '5 m³ - 25 m³', 'standar' => 4000000, 'longboom' => 5000000, 'superLongboom' => 7500000],
            ['volume' => '26 m³ - 50 m³', 'standar' => 4200000, 'longboom' => 5250000, 'superLongboom' => 7750000],
            ['volume' => '51 m³ - 75 m³', 'standar' => 4400000, 'longboom' => 5500000, 'superLongboom' => 8000000],
            ['volume' => '76 m³ - 100 m³', 'standar' => 4600000, 'longboom' => 5750000, 'superLongboom' => 8250000],
        ];

        $sortOrder = 1;
        foreach ($hargaPompa as $item) {
            $volume = $item['volume']; // "5 m³ - 25 m³"
            $volumeCode = $this->formatVolumeCode($volume); // "5-25"

            Product::updateOrCreate(
                ['code' => 'PMP-' . $volumeCode . '-SM'],
                [
                    'product_type_id' => $types['standarMini']->id,
                    'name' => "Pompa Beton Standar {$volume}",
                    'description' => "Pompa beton standar/mini untuk volume pengecoran {$volume}. Jangkauan 15-30 meter dengan kapasitas 30-60 m³/jam. Cocok untuk proyek rumah tinggal, ruko, dan bangunan 2-3 lantai.",
                    'price' => $item['standar'],
                    'unit' => 'unit',
                    'minimum_order' => 1,
                    'sort_order' => $sortOrder,
                    'featured' => false,
                    'is_active' => true,
                ]
            );

            Product::updateOrCreate(
                ['code' => 'PMP-' . $volumeCode . '-LB'],
                [
                    'product_type_id' => $types['longboom']->id,
                    'name' => "Pompa Beton Longboom {$volume}",
                    'description' => "Pompa beton longboom untuk volume pengecoran {$volume}. Jangkauan 32-42 meter dengan kapasitas 60-90 m³/jam. Ideal untuk proyek gedung bertingkat, jembatan, dan konstruksi skala menengah-besar.",
                    'price' => $item['longboom'],
                    'unit' => 'unit',
                    'minimum_order' => 1,
                    'sort_order' => $sortOrder,
                    'featured' => $volume === '26 m³ - 50 m³',
                    'is_active' => true,
                ]
            );

            Product::updateOrCreate(
                ['code' => 'PMP-' . $volumeCode . '-SLB'],
                [
                    'product_type_id' => $types['superLongboom']->id,
                    'name' => "Pompa Beton Super Longboom {$volume}",
                    'description' => "Pompa beton super longboom untuk volume pengecoran {$volume}. Jangkauan 45-60+ meter dengan kapasitas 90-150 m³/jam. Untuk proyek high-rise building, infrastruktur besar, dan area dengan ketinggian ekstrem.",
                    'price' => $item['superLongboom'],
                    'unit' => 'unit',
                    'minimum_order' => 1,
                    'sort_order' => $sortOrder,
                    'featured' => false,
                    'is_active' => true,
                ]
            );

            $sortOrder++;
        }

        $hargaFinishing = [
            ['dosis' => '3kg/m²', 'naturalLokal' => 30000, 'warnaLokal' => 40000, 'naturalSika' => 40000, 'warnaSika' => 50000],
            ['dosis' => '5kg/m²', 'naturalLokal' => 40000, 'warnaLokal' => 50000, 'naturalSika' => 50000, 'warnaSika' => 60000],
        ];

        $sortOrder = 1;
        foreach ($hargaFinishing as $item) {
            $dosis = $item['dosis']; // "3kg/m²"
            $dosisCode = strtoupper(str_replace(['kg/m²', '/'], ['KG', ''], $dosis)); // "3KG"

            Product::updateOrCreate(
                ['code' => 'FIN-' . $dosisCode . '-NL'],
                [
                    'product_type_id' => $types['naturalLokal']->id,
                    'name' => "Jasa Finishing Natural Lokal {$dosis}",
                    'description' => "Jasa finishing beton ekspos natural menggunakan material lokal dengan dosis {$dosis}. Memberikan tampilan alami beton dengan tekstur halus dan tampilan industrial yang estetik.",
                    'price' => $item['naturalLokal'],
                    'unit' => 'm²',
                    'minimum_order' => 1,
                    'sort_order' => $sortOrder,
                    'featured' => false,
                    'is_active' => true,
                ]
            );

            Product::updateOrCreate(
                ['code' => 'FIN-' . $dosisCode . '-WL'],
                [
                    'product_type_id' => $types['warnaLokal']->id,
                    'name' => "Jasa Finishing Warna Lokal {$dosis}",
                    'description' => "Jasa finishing beton ekspos berwarna menggunakan cat dan material lokal dengan dosis {$dosis}. Tersedia berbagai pilihan warna untuk tampilan dekoratif pada dinding, lantai, dan elemen arsitektur.",
                    'price' => $item['warnaLokal'],
                    'unit' => 'm²',
                    'minimum_order' => 1,
                    'sort_order' => $sortOrder,
                    'featured' => false,
                    'is_active' => true,
                ]
            );

            Product::updateOrCreate(
                ['code' => 'FIN-' . $dosisCode . '-SN'],
                [
                    'product_type_id' => $types['sikaNatural']->id,
                    'name' => "Jasa Finishing Sika Natural {$dosis}",
                    'description' => "Jasa finishing premium menggunakan produk Sika dengan dosis {$dosis} untuk hasil natural yang tahan lama. Termasuk waterproofing, anti-bocor, dan proteksi struktur dengan standar internasional.",
                    'price' => $item['naturalSika'],
                    'unit' => 'm²',
                    'minimum_order' => 1,
                    'sort_order' => $sortOrder,
                    'featured' => true,
                    'is_active' => true,
                ]
            );

            Product::updateOrCreate(
                ['code' => 'FIN-' . $dosisCode . '-SW'],
                [
                    'product_type_id' => $types['sikaWarna']->id,
                    'name' => "Jasa Finishing Sika Warna {$dosis}",
                    'description' => "Jasa finishing premium Sika dengan variasi warna dosis {$dosis}. Kombinasi proteksi struktur dan estetika warna untuk hasil akhir yang tahan cuaca, anti-jamur, dan tampilan modern.",
                    'price' => $item['warnaSika'],
                    'unit' => 'm²',
                    'minimum_order' => 1,
                    'sort_order' => $sortOrder,
                    'featured' => false,
                    'is_active' => true,
                ]
            );

            $sortOrder++;
        }
    }

    private function formatVolumeCode(string $volume): string
    {
        preg_match_all('/\d+/', $volume, $matches);
        return implode('-', $matches[0]);
    }
}