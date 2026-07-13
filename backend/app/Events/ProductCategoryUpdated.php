<?php

namespace App\Events;

use App\Models\ProductCategory;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProductCategoryUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public ProductCategory $category;

    public function __construct(ProductCategory $category)
    {
        $this->category = $category;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('product-categories'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'category.updated';
    }
}