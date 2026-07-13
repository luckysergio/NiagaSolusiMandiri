<?php

namespace App\Exports;

use App\Models\Transaction;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Carbon\Carbon;

class TransactionsReportExport implements FromQuery, WithHeadings, WithMapping, WithStyles, WithColumnFormatting, ShouldAutoSize
{
    protected array $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = Transaction::query()
            ->with(['details.product', 'details.supplier', 'user:id,name'])
            ->ordered();

        if (!empty($this->filters['search'])) {
            $query->search($this->filters['search']);
        }
        
        if (!empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }
        
        if (!empty($this->filters['start_date']) && !empty($this->filters['end_date'])) {
            $query->whereBetween('transaction_date', [$this->filters['start_date'], $this->filters['end_date']]);
        }

        return $query;
    }

    public function headings(): array
    {
        return [
            'No',
            'Invoice',
            'Tanggal Transaksi',
            'Pelanggan',
            'Nama Proyek',
            'Alamat Proyek',
            'Status',
            'Nama Produk',
            'Supplier',
            'Qty',
            'Satuan',
            'Harga Satuan',
            'Subtotal',
            'Pengeluaran',
            'Dibuat Oleh',
        ];
    }

    public function map($transaction): array
    {
        $rows = [];
        $no = 1;

        if ($transaction->details->isEmpty()) {
            $rows[] = [
                $no++,
                $transaction->invoice,
                $transaction->transaction_date ? Carbon::parse($transaction->transaction_date)->format('d/m/Y') : '-',
                $transaction->customer_name,
                $transaction->project_name ?? '-',
                $transaction->project_address ?? '-',
                $transaction->status->label(), 
                '-', 
                '-',
                0,   
                '-', 
                0,   
                0,   
                0,   
                $transaction->user->name ?? 'System',
            ];
        } else {
            foreach ($transaction->details as $detail) {
                $rows[] = [
                    $no++,
                    $transaction->invoice,
                    $transaction->transaction_date ? Carbon::parse($transaction->transaction_date)->format('d/m/Y') : '-',
                    $transaction->customer_name,
                    $transaction->project_name ?? '-',
                    $transaction->project_address ?? '-',
                    $transaction->status->label(),
                    $detail->product->name ?? 'Produk Dihapus',
                    $detail->supplier->name ?? '-',
                    $detail->qty,
                    $detail->unit,
                    $detail->product_price,
                    $detail->total_price,
                    $detail->expense,
                    $transaction->user->name ?? 'System',
                ];
            }
        }

        return $rows;
    }

    public function columnFormats(): array
    {
        return [
            'L' => '"Rp" #,##0',
            'M' => '"Rp" #,##0',
            'N' => '"Rp" #,##0',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['argb' => 'FFFFFFFF'],
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['argb' => 'FF2563EB'],
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ],
        ];
    }
}