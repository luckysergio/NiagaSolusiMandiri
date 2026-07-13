<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TransactionDeleted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $transactionId;
    public string $invoice;

    public function __construct(int $transactionId, string $invoice)
    {
        $this->transactionId = $transactionId;
        $this->invoice = $invoice;
    }

    public function broadcastOn(): array
    {
        return [new Channel('transactions')];
    }

    public function broadcastAs(): string
    {
        return 'transaction.deleted';
    }
}