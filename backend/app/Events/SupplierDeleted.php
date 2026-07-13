<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SupplierDeleted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $supplierId;
    public string $supplierName;

    public function __construct(int $supplierId, string $supplierName)
    {
        $this->supplierId = $supplierId;
        $this->supplierName = $supplierName;
    }

    public function broadcastOn(): array
    {
        return [new Channel('suppliers')];
    }

    public function broadcastAs(): string
    {
        return 'supplier.deleted';
    }
}