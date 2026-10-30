<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Blog extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'thumbnail_image',
        'content',
        'video_url',
        'author_name',
        'published_at',
        'is_published',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_published' => 'boolean',
    ];

    protected $appends = [
        'reading_time',
        'youtube_embed_id',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($blog) {
            if (empty($blog->slug)) {
                $blog->slug = Str::slug($blog->title);
            }
            if (empty($blog->published_at) && $blog->is_published) {
                $blog->published_at = now();
            }
        });
    }

    /**
     * Scope for published blogs.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    /**
     * Scope for recent blogs.
     */
    public function scopeRecent($query, int $limit = 6)
    {
        return $query->published()->orderByDesc('published_at')->limit($limit);
    }

    /**
     * Estimated reading time attribute in minutes.
     */
    public function getReadingTimeAttribute(): int
    {
        $words = str_word_count(strip_tags($this->content ?? ''));
        return max(1, (int) ceil($words / 200));
    }

    /**
     * Extracted YouTube embed ID if applicable.
     */
    public function getYoutubeEmbedIdAttribute(): ?string
    {
        if (empty($this->video_url)) {
            return null;
        }

        // Handles https://www.youtube.com/watch?v=XXXX, https://youtu.be/XXXX, https://www.youtube.com/embed/XXXX
        if (preg_match('%(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/ ]{11})%i', $this->video_url, $match)) {
            return $match[1];
        }

        return null;
    }
}

