<?php

namespace App\Events;

use App\Models\ProductCategory;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProductCategoryDeleted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $categoryId;
    public string $categoryName;

    public function __construct(int $categoryId, string $categoryName)
    {
        $this->categoryId = $categoryId;
        $this->categoryName = $categoryName;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('product-categories'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'category.deleted';
    }
}