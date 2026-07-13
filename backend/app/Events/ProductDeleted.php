<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProductDeleted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $productId;
    public string $productName;
    public string $productCode;

    public function __construct(int $productId, string $productName, string $productCode)
    {
        $this->productId = $productId;
        $this->productName = $productName;
        $this->productCode = $productCode;
    }

    public function broadcastOn(): array
    {
        return [new Channel('products')];
    }

    public function broadcastAs(): string
    {
        return 'product.deleted';
    }
}