<?php

namespace App\Events;

use App\Models\BlockedIp;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BlockedIpCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public BlockedIp $blockedIp;

    public function __construct(BlockedIp $blockedIp)
    {
        $this->blockedIp = $blockedIp;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('dashboard'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'blocked-ip.created';
    }
}