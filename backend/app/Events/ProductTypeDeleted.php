<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProductTypeDeleted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $productTypeId;
    public string $productTypeName;
    public ?string $categoryName;

    public function __construct(int $productTypeId, string $productTypeName, ?string $categoryName = null)
    {
        $this->productTypeId = $productTypeId;
        $this->productTypeName = $productTypeName;
        $this->categoryName = $categoryName;
    }

    public function broadcastOn(): array
    {
        return [new Channel('product-types')];
    }

    public function broadcastAs(): string
    {
        return 'product-type.deleted';
    }
}