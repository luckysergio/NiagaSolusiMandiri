<?php

namespace App\Events;

use App\Models\LoginLog;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LoginLogCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public LoginLog $loginLog;

    public function __construct(LoginLog $loginLog)
    {
        $this->loginLog = $loginLog->load('user:id,name,email');
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('dashboard'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'login-log.created';
    }
}