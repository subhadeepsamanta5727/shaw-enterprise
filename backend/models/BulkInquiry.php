<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BulkInquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'variant_details',
        'client_name',
        'organization_name',
        'email',
        'phone',
        'quantity',
        'delivery_city',
        'message',
        'status',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    const STATUS_PENDING = 'pending';
    const STATUS_CONTACTED = 'contacted';
    const STATUS_QUOTED = 'quoted';
    const STATUS_CLOSED = 'closed';

    public static function getStatuses(): array
    {
        return [
            self::STATUS_PENDING => 'Pending Review',
            self::STATUS_CONTACTED => 'Contacted Client',
            self::STATUS_QUOTED => 'Quote Dispatched',
            self::STATUS_CLOSED => 'Closed / Won',
        ];
    }

    /**
     * Associated product.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Scope for pending inquiries.
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }
}

