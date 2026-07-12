<?php

namespace App\Events;

use App\Models\SecurityAlert;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SecurityAlertCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public SecurityAlert $securityAlert;

    public function __construct(SecurityAlert $securityAlert)
    {
        $this->securityAlert = $securityAlert->load('user:id,name,email');
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('dashboard'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'security-alert.created';
    }
}