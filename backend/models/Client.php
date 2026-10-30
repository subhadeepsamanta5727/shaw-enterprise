<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'location',
        'project_details',
        'established',
        'is_featured',
        'display_order',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'display_order' => 'integer',
    ];

    /**
     * Categories allowed: university_colleges, schools, corporate_banks, others
     */
    public const CATEGORIES = [
        'university_colleges' => 'University & Colleges',
        'schools' => 'Schools',
        'corporate_banks' => 'Corporate Office / Bank',
        'others' => 'Others',
    ];

    public function scopeByCategory($query, ?string $category)
    {
        if ($category && $category !== 'all') {
            return $query->where('category', $category);
        }
        return $query;
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}

