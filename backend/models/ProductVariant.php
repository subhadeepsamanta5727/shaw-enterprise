<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'size_label',
        'surface_type',
        'sku_extension',
        'price',
        'stock_quantity',
        'is_default',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock_quantity' => 'integer',
        'is_default' => 'boolean',
    ];

    /**
     * Parent product.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Helper to get full combined variant name.
     */
    public function getFullNameAttribute(): string
    {
        $parts = array_filter([$this->size_label, $this->surface_type]);
        return implode(' - ', $parts);
    }
}

