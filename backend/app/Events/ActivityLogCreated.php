<?php

namespace App\Events;

use App\Models\ActivityLog;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ActivityLogCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public ActivityLog $activityLog;

    public function __construct(ActivityLog $activityLog)
    {
        $this->activityLog = $activityLog->load('user:id,name,email');
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('dashboard'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'activity-log.created';
    }
}