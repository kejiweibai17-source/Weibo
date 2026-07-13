<?php
/**
 * SMASMALL Frontend Revalidate（Code Snippets 專用）
 *
 * 用途：後台新增／更新「產品、文章」後，通知 Next.js 立刻刷新頁面與 sitemap.xml
 * （系列商品若已啟用 smasmall-series-products.php，本身已會打 /api/revalidate/series）
 *
 * ========== 設定 ==========
 * 下方兩行常數可直接放在本 Snippet（不必改 wp-config.php）
 * 請與 Vercel / .env.local 的 REVALIDATE_SECRET 保持相同
 *
 * Code Snippets：
 * - Title: SMASMALL Frontend Revalidate
 * - Run: Everywhere
 * - Active
 */

if (!defined('ABSPATH')) {
    exit;
}

/** 前端網址與密鑰（可改這裡；若 wp-config 已 define 則不會覆蓋） */
if (!defined('SMASMALL_FRONTEND_URL')) {
    define('SMASMALL_FRONTEND_URL', 'https://www.smasmall.com.tw');
}
if (!defined('SMASMALL_REVALIDATE_SECRET')) {
    define('SMASMALL_REVALIDATE_SECRET', 'ccf43d8827750ce3e2b1d2d48e80fca752411f2aee0846d228387cc627526750');
}

if (!function_exists('smasmall_frontend_revalidate')) {
    /**
     * 通知前端重新驗證快取
     *
     * @param string              $endpoint product | series | 空字串(= /api/revalidate)
     * @param array<string,mixed> $body
     */
    function smasmall_frontend_revalidate($endpoint, array $body = [])
    {
        if (!defined('SMASMALL_FRONTEND_URL') || !defined('SMASMALL_REVALIDATE_SECRET')) {
            return;
        }

        $frontend = rtrim((string) SMASMALL_FRONTEND_URL, '/');
        $secret   = (string) SMASMALL_REVALIDATE_SECRET;
        if ($frontend === '' || $secret === '') {
            return;
        }

        $path = ($endpoint === '' || $endpoint === null)
            ? '/api/revalidate'
            : '/api/revalidate/' . ltrim((string) $endpoint, '/');

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
}

if (!function_exists('smasmall_revalidate_product_frontend')) {
    /** 產品 → 刷新 /accessories、產品詳情、sitemap */
    function smasmall_revalidate_product_frontend($post_id)
    {
        $post_id = (int) $post_id;
        if ($post_id <= 0) {
            return;
        }
        if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
            return;
        }

        $post = get_post($post_id);
        if (!$post instanceof WP_Post || $post->post_type !== 'product') {
            return;
        }

        // 草稿首次儲存可略過；已發布／下架／刪除需刷新 sitemap
        $status = (string) $post->post_status;
        $should = in_array($status, ['publish', 'private', 'trash', 'draft'], true);
        if (!$should) {
            return;
        }

        $slug = (string) $post->post_name;
        smasmall_frontend_revalidate(
            'product',
            $slug !== '' ? ['slug' => $slug] : []
        );
    }
}

/** 避免重複掛 hook（snippet 重載時） */
if (!defined('SMASMALL_FRONTEND_REVALIDATE_HOOKED')) {
    define('SMASMALL_FRONTEND_REVALIDATE_HOOKED', true);

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
        if (
            in_array($new_status, ['publish', 'trash', 'draft', 'private'], true)
            || $old_status === 'publish'
        ) {
            smasmall_revalidate_product_frontend((int) $post->ID);
        }
    }, 80, 3);

    /** 文章 → 刷新 /blog、文章頁、sitemap */
    add_action('save_post_post', function ($post_id) {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        if (wp_is_post_revision($post_id)) {
            return;
        }

        $post = get_post($post_id);
        if (!$post instanceof WP_Post || $post->post_type !== 'post') {
            return;
        }

        // 僅處理會影響前台／sitemap 的狀態
        if (!in_array($post->post_status, ['publish', 'private', 'trash', 'draft'], true)) {
            return;
        }

        smasmall_frontend_revalidate('', [
            'type' => 'blog',
            'slug' => (string) $post->post_name,
        ]);
    }, 80, 1);

    /** 後台提示：常數未設定時提醒 */
    add_action('admin_notices', function () {
        if (!current_user_can('read')) {
            return;
        }
        $ok_url    = defined('SMASMALL_FRONTEND_URL') && SMASMALL_FRONTEND_URL;
        $ok_secret = defined('SMASMALL_REVALIDATE_SECRET') && SMASMALL_REVALIDATE_SECRET;
        if ($ok_url && $ok_secret) {
            return;
        }
        echo '<div class="notice notice-warning"><p><strong>SMASMALL Revalidate：</strong>請在 <code>wp-config.php</code> 設定 <code>SMASMALL_FRONTEND_URL</code> 與 <code>SMASMALL_REVALIDATE_SECRET</code>，否則產品／文章儲存後不會自動更新 sitemap。</p></div>';
    });
}
