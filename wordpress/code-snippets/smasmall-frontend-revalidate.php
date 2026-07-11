<?php
/**
 * Plugin Name: SMASMALL Frontend Revalidate (ISR / Sitemap)
 * Description: 後台儲存產品、系列、文章後，通知 Next.js 刷新頁面與 sitemap.xml（SSG + ISR on-demand）
 *
 * 環境變數（wp-config.php）：
 *   define('SMASMALL_FRONTEND_URL', 'https://www.smasmall.com.tw');
 *   define('SMASMALL_REVALIDATE_SECRET', '與 Next.js REVALIDATE_SECRET 相同');
 *
 * Next.js endpoints：
 *   POST /api/revalidate/product   { "slug": "..." }
 *   POST /api/revalidate/series    { "slug": "..." }
 *   POST /api/revalidate           { "type": "blog"|"all"|"sitemap", "slug": "..." }
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * 通知前端重新驗證快取
 *
 * @param string               $endpoint 例如 product / series / （空字串 = /api/revalidate）
 * @param array<string,mixed>  $body
 */
function smasmall_frontend_revalidate(string $endpoint, array $body = []): void
{
    if (!defined('SMASMALL_FRONTEND_URL') || !defined('SMASMALL_REVALIDATE_SECRET')) {
        return;
    }

    $frontend = rtrim((string) SMASMALL_FRONTEND_URL, '/');
    $secret = (string) SMASMALL_REVALIDATE_SECRET;
    if ($frontend === '' || $secret === '') {
        return;
    }

    $path = $endpoint === ''
        ? '/api/revalidate'
        : '/api/revalidate/' . ltrim($endpoint, '/');

    wp_remote_post(
        $frontend . $path,
        [
            'timeout'  => 8,
            'blocking' => false,
            'headers'  => [
                'Content-Type'        => 'application/json',
                'x-revalidate-secret' => $secret,
            ],
            'body'     => wp_json_encode($body),
        ]
    );
}

/** 產品（WooCommerce）→ 刷新產品頁、列表、sitemap */
function smasmall_revalidate_product_frontend(int $post_id): void
{
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
        return;
    }

    $post = get_post($post_id);
    if (!$post instanceof WP_Post || $post->post_type !== 'product') {
        return;
    }

    // 僅已發布／更新已發布商品時刷新（草稿不進 sitemap）
    if (!in_array($post->post_status, ['publish', 'private'], true)) {
        // 從發布改為非發布時仍需刷新 sitemap 移除舊網址
        if ($post->post_status !== 'trash' && $post->post_status !== 'draft') {
            return;
        }
    }

    $slug = $post->post_name;
    if ($slug === '') {
        smasmall_frontend_revalidate('product', []);
        return;
    }

    smasmall_frontend_revalidate('product', ['slug' => $slug]);
}

add_action('save_post_product', 'smasmall_revalidate_product_frontend', 80, 1);
add_action('woocommerce_update_product', 'smasmall_revalidate_product_frontend', 80, 1);
add_action('woocommerce_new_product', 'smasmall_revalidate_product_frontend', 80, 1);

add_action('transition_post_status', function ($new_status, $old_status, $post) {
    if (!$post instanceof WP_Post || $post->post_type !== 'product') {
        return;
    }
    if ($new_status === $old_status) {
        return;
    }
    // 發布狀態變更（上架／下架）→ 更新 sitemap
    if (in_array($new_status, ['publish', 'trash', 'draft', 'private'], true)
        || in_array($old_status, ['publish'], true)
    ) {
        smasmall_revalidate_product_frontend((int) $post->ID);
    }
}, 80, 3);

/** 文章 → 刷新 blog + sitemap */
add_action('save_post_post', function ($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (wp_is_post_revision($post_id)) {
        return;
    }

    $post = get_post($post_id);
    if (!$post instanceof WP_Post) {
        return;
    }

    $slug = $post->post_name;
    smasmall_frontend_revalidate('', [
        'type' => 'blog',
        'slug' => $slug,
    ]);
}, 80, 1);
