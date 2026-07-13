<?php

namespace App\Events;

use App\Models\ProductType;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProductTypeUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public ProductType $productType;

    public function __construct(ProductType $productType)
    {
        $this->productType = $productType->load('category:id,name');
    }

    public function broadcastOn(): array
    {
        return [new Channel('product-types')];
    }

    public function broadcastAs(): string
    {
        return 'product-type.updated';
    }
}