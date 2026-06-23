<?php
/**
 * SMASMALL — 文章精選（Code Snippets）
 *
 * 文章編輯頁 meta box：勾選「設為精選文章」（全站最多 6 篇）
 * 文章列表新增「精選」欄位，可快速篩選
 * 公開 REST：GET /wp-json/smasmall/v1/featured-posts
 *
 * 貼到 WordPress「Code Snippets」→ Run everywhere → 啟用
 */

if (!defined('ABSPATH')) {
    exit;
}

if (defined('SMASMALL_FEATURED_POSTS_LOADED')) {
    return;
}
define('SMASMALL_FEATURED_POSTS_LOADED', true);

const SMASMALL_META_FEATURED       = 'smasmall_featured_post';
const SMASMALL_META_FEATURED_ORDER = 'smasmall_featured_order';
const SMASMALL_FEATURED_MAX        = 6;

/** ---------- 工具函式 ---------- */

function smasmall_featured_posts_is_featured(int $post_id): bool
{
    return get_post_meta($post_id, SMASMALL_META_FEATURED, true) === '1';
}

/**
 * 取得所有精選文章 ID（不含 trash，依精選排序）
 *
 * @return int[]
 */
function smasmall_featured_posts_get_ids(int $exclude_id = 0): array
{
    $query = new WP_Query([
        'post_type'              => 'post',
        'post_status'            => ['publish', 'draft', 'pending', 'future', 'private'],
        'posts_per_page'         => -1,
        'fields'                 => 'ids',
        'no_found_rows'          => true,
        'update_post_meta_cache' => false,
        'update_post_term_cache' => false,
        'meta_query'             => [
            [
                'key'     => SMASMALL_META_FEATURED,
                'value'   => '1',
                'compare' => '=',
            ],
        ],
        'meta_key'               => SMASMALL_META_FEATURED_ORDER,
        'orderby'                => [
            'meta_value_num' => 'ASC',
            'date'           => 'DESC',
        ],
    ]);

    $ids = array_map('intval', $query->posts);

    if ($exclude_id > 0) {
        $ids = array_values(array_filter($ids, static function ($id) use ($exclude_id) {
            return $id !== $exclude_id;
        }));
    }

    return $ids;
}

function smasmall_featured_posts_count(int $exclude_id = 0): int
{
    return count(smasmall_featured_posts_get_ids($exclude_id));
}

function smasmall_featured_posts_next_order(): int
{
    $ids = smasmall_featured_posts_get_ids();
    if (!$ids) {
        return 0;
    }

    $orders = [];
    foreach ($ids as $id) {
        $orders[] = (int) get_post_meta($id, SMASMALL_META_FEATURED_ORDER, true);
    }

    return max($orders) + 1;
}

/** ---------- 註冊 post meta（REST 可讀） ---------- */
add_action('init', function () {
    register_post_meta('post', SMASMALL_META_FEATURED, [
        'type'              => 'boolean',
        'single'            => true,
        'show_in_rest'      => true,
        'auth_callback'     => static function () {
            return current_user_can('edit_posts');
        },
        'sanitize_callback' => static function ($value) {
            return $value ? '1' : '';
        },
    ]);

    register_post_meta('post', SMASMALL_META_FEATURED_ORDER, [
        'type'              => 'integer',
        'single'            => true,
        'show_in_rest'      => true,
        'auth_callback'     => static function () {
            return current_user_can('edit_posts');
        },
        'sanitize_callback' => static function ($value) {
            return max(0, (int) $value);
        },
    ]);
});

/** ---------- Meta box ---------- */
add_action('add_meta_boxes', function () {
    add_meta_box(
        'smasmall-featured-post',
        'SMASMALL 精選文章',
        'smasmall_featured_posts_render_meta_box',
        'post',
        'side',
        'high'
    );
});

function smasmall_featured_posts_render_meta_box(\WP_Post $post): void
{
    wp_nonce_field('smasmall_featured_post_save', 'smasmall_featured_post_nonce');

    $is_featured   = smasmall_featured_posts_is_featured($post->ID);
    $current_count = smasmall_featured_posts_count($is_featured ? $post->ID : 0);
    $at_limit      = !$is_featured && $current_count >= SMASMALL_FEATURED_MAX;
    $featured_ids  = smasmall_featured_posts_get_ids($post->ID);
    ?>
    <div class="smasmall-featured-post-box">
        <p style="margin-top:0;">
            <label>
                <input
                    type="checkbox"
                    name="smasmall_featured_post"
                    value="1"
                    <?php checked($is_featured); ?>
                    <?php disabled($at_limit); ?>
                />
                設為精選文章
            </label>
        </p>

        <p class="description" style="margin:8px 0 0;">
            精選文章會用於官網「理容，貫穿每個日常時刻」區塊。<br />
            目前：<strong><?php echo esc_html((string) $current_count); ?> / <?php echo esc_html((string) SMASMALL_FEATURED_MAX); ?></strong>
        </p>

        <?php if ($at_limit) : ?>
            <p class="description" style="color:#b32d2e;margin-top:8px;">
                已達上限，請先取消其他文章的精選設定。
            </p>
        <?php endif; ?>

        <?php if ($featured_ids) : ?>
            <div style="margin-top:12px;padding-top:10px;border-top:1px solid #dcdcde;">
                <p style="margin:0 0 6px;font-weight:600;">其他精選文章</p>
                <ul style="margin:0;padding-left:18px;">
                    <?php foreach ($featured_ids as $featured_id) : ?>
                        <?php
                        $title = get_the_title($featured_id);
                        if ($title === '') {
                            $title = '(無標題 #' . $featured_id . ')';
                        }
                        ?>
                        <li style="margin-bottom:4px;">
                            <a href="<?php echo esc_url(get_edit_post_link($featured_id, 'raw')); ?>">
                                <?php echo esc_html($title); ?>
                            </a>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>
    </div>
    <?php
}

/** ---------- 儲存 ---------- */
add_action('save_post_post', function ($post_id, $post, $update) {
    unset($update);

    if (!isset($_POST['smasmall_featured_post_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['smasmall_featured_post_nonce'])), 'smasmall_featured_post_save')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (wp_is_post_revision($post_id)) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $want_featured = !empty($_POST['smasmall_featured_post']);
    $was_featured  = smasmall_featured_posts_is_featured($post_id);

    if ($want_featured && !$was_featured) {
        if (smasmall_featured_posts_count() >= SMASMALL_FEATURED_MAX) {
            set_transient(
                'smasmall_featured_post_limit_' . get_current_user_id(),
                $post_id,
                30
            );
            return;
        }

        update_post_meta($post_id, SMASMALL_META_FEATURED, '1');
        update_post_meta($post_id, SMASMALL_META_FEATURED_ORDER, smasmall_featured_posts_next_order());
        return;
    }

    if (!$want_featured && $was_featured) {
        delete_post_meta($post_id, SMASMALL_META_FEATURED);
        delete_post_meta($post_id, SMASMALL_META_FEATURED_ORDER);
        return;
    }

    if ($want_featured && $was_featured) {
        update_post_meta($post_id, SMASMALL_META_FEATURED, '1');
        if (get_post_meta($post_id, SMASMALL_META_FEATURED_ORDER, true) === '') {
            update_post_meta($post_id, SMASMALL_META_FEATURED_ORDER, smasmall_featured_posts_next_order());
        }
    }
}, 10, 3);

add_action('admin_notices', function () {
    if (!function_exists('get_current_screen')) {
        return;
    }

    $screen = get_current_screen();
    if (!$screen || $screen->base !== 'post' || $screen->post_type !== 'post') {
        return;
    }

    $post_id = isset($_GET['post']) ? (int) $_GET['post'] : 0;
    if ($post_id <= 0) {
        return;
    }

    $blocked_id = get_transient('smasmall_featured_post_limit_' . get_current_user_id());
    if (!$blocked_id || (int) $blocked_id !== $post_id) {
        return;
    }

    delete_transient('smasmall_featured_post_limit_' . get_current_user_id());
    ?>
    <div class="notice notice-error is-dismissible">
        <p>精選文章已達 <?php echo esc_html((string) SMASMALL_FEATURED_MAX); ?> 篇上限，無法再新增。請先取消其他文章的精選設定。</p>
    </div>
    <?php
});

/** ---------- 文章列表欄位 ---------- */
add_filter('manage_post_posts_columns', function ($columns) {
    $new = [];
    foreach ($columns as $key => $label) {
        $new[$key] = $label;
        if ($key === 'title') {
            $new['smasmall_featured'] = '精選';
        }
    }
    return $new;
});

add_action('manage_post_posts_custom_column', function ($column, $post_id) {
    if ($column !== 'smasmall_featured') {
        return;
    }

    if (smasmall_featured_posts_is_featured((int) $post_id)) {
        echo '<span style="display:inline-block;padding:2px 8px;border-radius:999px;background:#2271b1;color:#fff;font-size:12px;line-height:1.4;">精選</span>';
        return;
    }

    echo '<span aria-hidden="true">—</span><span class="screen-reader-text">非精選</span>';
}, 10, 2);

add_filter('manage_edit-post_sortable_columns', function ($columns) {
    $columns['smasmall_featured'] = 'smasmall_featured';
    return $columns;
});

add_action('pre_get_posts', function ($query) {
    if (!is_admin() || !$query->is_main_query()) {
        return;
    }

    if (($query->get('orderby') ?? '') === 'smasmall_featured') {
        $query->set('meta_key', SMASMALL_META_FEATURED);
        $query->set('orderby', 'meta_value');
    }

    if (($query->get('smasmall_featured_only') ?? '') === '1') {
        $query->set('meta_query', [
            [
                'key'     => SMASMALL_META_FEATURED,
                'value'   => '1',
                'compare' => '=',
            ],
        ]);
    }
});

add_action('restrict_manage_posts', function ($post_type) {
    if ($post_type !== 'post') {
        return;
    }

    $selected = isset($_GET['smasmall_featured_only']) ? sanitize_text_field(wp_unslash($_GET['smasmall_featured_only'])) : '';
    ?>
    <select name="smasmall_featured_only">
        <option value="">全部精選狀態</option>
        <option value="1" <?php selected($selected, '1'); ?>>僅顯示精選文章</option>
    </select>
    <?php
});

/** ---------- REST API（供官網之後串接） ---------- */
add_action('rest_api_init', function () {
    register_rest_route('smasmall/v1', '/featured-posts', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => 'smasmall_featured_posts_rest_callback',
    ]);
});

function smasmall_featured_posts_rest_callback(\WP_REST_Request $request)
{
    $limit = min(SMASMALL_FEATURED_MAX, max(1, (int) ($request->get_param('limit') ?? SMASMALL_FEATURED_MAX)));

    $query = new WP_Query([
        'post_type'      => 'post',
        'post_status'    => 'publish',
        'posts_per_page' => $limit,
        'meta_query'     => [
            [
                'key'     => SMASMALL_META_FEATURED,
                'value'   => '1',
                'compare' => '=',
            ],
        ],
        'meta_key'       => SMASMALL_META_FEATURED_ORDER,
        'orderby'        => [
            'meta_value_num' => 'ASC',
            'date'           => 'DESC',
        ],
    ]);

    $posts = [];
    foreach ($query->posts as $post) {
        $posts[] = smasmall_featured_posts_format_item($post);
    }

    return rest_ensure_response([
        'max'   => SMASMALL_FEATURED_MAX,
        'count' => count($posts),
        'posts' => $posts,
    ]);
}

function smasmall_featured_posts_format_item(\WP_Post $post): array
{
    $excerpt = $post->post_excerpt;
    if ($excerpt === '') {
        $excerpt = wp_trim_words(wp_strip_all_tags($post->post_content), 40, '…');
    }

    $image = get_the_post_thumbnail_url($post, 'large');
    if (!$image) {
        $image = get_the_post_thumbnail_url($post, 'full');
    }

    return [
        'id'      => $post->ID,
        'slug'    => $post->post_name,
        'title'   => get_the_title($post),
        'excerpt' => wp_strip_all_tags($excerpt),
        'date'    => get_the_date('c', $post),
        'image'   => $image ?: '',
        'link'    => get_permalink($post),
        'order'   => (int) get_post_meta($post->ID, SMASMALL_META_FEATURED_ORDER, true),
    ];
}
