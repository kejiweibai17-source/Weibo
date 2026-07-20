<?php
/**
 * SMASMALL — 系列產品（Code Snippets）
 *
 * 自訂 Post Type「系列產品」：後台新增、自訂 slug、區塊式詳細頁
 * 公開 REST：
 *   GET /wp-json/smasmall/v1/series
 *   GET /wp-json/smasmall/v1/series/{slug}
 *
 * 貼到 WordPress「Code Snippets」→ Run everywhere → 啟用
 *
 * 版本：1.5.0
 * - 列表查詢不再用 meta_key，避免新系列被排除
 * - REST items 回傳 image / description（供 /series 列表主圖）
 * - 列表也回傳 featuredImage（不需 include_blocks）
 * - find_by_slug 支援無自訂 slug meta 時退回比對
 * - 儲存後觸發 Next.js ISR revalidate
 */

if (!defined('ABSPATH')) {
    exit;
}

if (defined('SMASMALL_SERIES_PRODUCTS_LOADED')) {
    return;
}
define('SMASMALL_SERIES_PRODUCTS_LOADED', true);

const SMASMALL_SERIES_POST_TYPE = 'smasmall_series';

const SMASMALL_SERIES_META_SLUG          = 'smasmall_series_slug';
const SMASMALL_SERIES_META_ORDER         = 'smasmall_series_order';
const SMASMALL_SERIES_META_ENABLED       = 'smasmall_series_enabled';
const SMASMALL_SERIES_META_SEO_TITLE     = 'smasmall_series_seo_title';
const SMASMALL_SERIES_META_SEO_DESC      = 'smasmall_series_seo_description';
const SMASMALL_SERIES_META_OG_IMAGE      = 'smasmall_series_og_image';
const SMASMALL_SERIES_META_WC_PRODUCT_ID = 'smasmall_series_wc_product_id';
const SMASMALL_SERIES_META_BLOCKS        = 'smasmall_series_blocks';
const SMASMALL_SERIES_META_FEATURED      = 'smasmall_series_featured_image';

const SMASMALL_SERIES_BLOCK_TYPES = [
    'feature_slider'    => '① 產品特色滑塊',
    'product_showcase'  => '② 產品配件展示',
    'specs_panel'       => '③ 產品規格',
    'parallax_hero'     => '④ 視覺差滾動區塊',
    'text_banner'       => '⑤ 背景文字區塊',
    'product_video'     => '⑥ 產品影片',
];

/** 固定六區塊順序（與 product01 詳細頁一致） */
const SMASMALL_SERIES_FIXED_BLOCK_ORDER = [
    'feature_slider',
    'product_showcase',
    'specs_panel',
    'parallax_hero',
    'text_banner',
    'product_video',
];

/** ---------- 工具函式 ---------- */

function smasmall_series_sanitize_slug(string $slug, int $exclude_post_id = 0): string
{
    $slug = trim($slug);
    $slug = preg_replace('/\s+/u', '-', $slug);
    $slug = preg_replace('/[^a-zA-Z0-9\x{4e00}-\x{9fff}\-_]/u', '', $slug);
    $slug = trim($slug, '-');

    if ($slug === '') {
        return '';
    }

    if (smasmall_series_slug_exists($slug, $exclude_post_id)) {
        return '';
    }

    return $slug;
}

function smasmall_series_slug_exists(string $slug, int $exclude_post_id = 0): bool
{
    $query = new WP_Query([
        'post_type'              => SMASMALL_SERIES_POST_TYPE,
        'post_status'            => 'any',
        'posts_per_page'         => 1,
        'fields'                 => 'ids',
        'no_found_rows'          => true,
        'update_post_meta_cache' => false,
        'update_post_term_cache' => false,
        'post__not_in'           => $exclude_post_id > 0 ? [$exclude_post_id] : [],
        'meta_query'             => [
            [
                'key'     => SMASMALL_SERIES_META_SLUG,
                'value'   => $slug,
                'compare' => '=',
            ],
        ],
    ]);

    return !empty($query->posts);
}

function smasmall_series_get_slug(int $post_id): string
{
    $slug = (string) get_post_meta($post_id, SMASMALL_SERIES_META_SLUG, true);
    if ($slug !== '') {
        return $slug;
    }

    $post = get_post($post_id);
    return $post instanceof WP_Post ? (string) $post->post_name : '';
}

function smasmall_series_is_enabled(int $post_id): bool
{
    return get_post_meta($post_id, SMASMALL_SERIES_META_ENABLED, true) !== '0';
}

function smasmall_series_default_block(string $type): array
{
    switch ($type) {
        case 'product_showcase':
            return [
                'type'  => 'product_showcase',
                'items' => [[
                    'badge'    => '配件 1',
                    'name'     => '',
                    'tags'     => '',
                    'thumbUrl' => '',
                    'mainUrl'  => '',
                    'features' => [['title' => '', 'bullets' => '', 'boxPosition' => 'top_left']],
                ]],
            ];
        case 'specs_panel':
            return [
                'type'       => 'specs_panel',
                'title'      => '產品規格',
                'note'       => '',
                'leftImage'  => '',
                'rightImage' => '',
            ];
        case 'parallax_hero':
            return [
                'type'            => 'parallax_hero',
                'title'           => '',
                'subtitle'        => '',
                'backgroundImage' => '',
            ];
        case 'text_banner':
            return [
                'type'            => 'text_banner',
                'backgroundColor' => '#ea580c',
                'heading'         => '',
                'body'            => '',
            ];
        case 'product_video':
            return [
                'type'             => 'product_video',
                'sectionTitle'     => 'CALIBRE AMB+',
                'sectionSubtitle'  => '',
                'productImage'     => '',
                'cableImage'       => '',
                'markerLabel'      => 'A',
                'videoUrl'         => '',
                'coverImage'       => '',
            ];
        case 'feature_slider':
        default:
            return [
                'type'              => 'feature_slider',
                'sectionEyebrow'    => 'FEATURES',
                'sectionTitle'      => '',
                'sectionTitleBold'  => '',
                'items'             => [['number' => '01', 'title' => '', 'description' => '', 'image' => '']],
            ];
    }
}

function smasmall_series_merge_fixed_blocks(array $saved): array
{
    $by_type = [];
    foreach ($saved as $block) {
        if (!is_array($block)) {
            continue;
        }
        $type = smasmall_series_normalize_block_type((string) ($block['type'] ?? ''));
        if ($type === '' || isset($by_type[$type])) {
            continue;
        }
        $by_type[$type] = array_merge(smasmall_series_default_block($type), $block);
    }

    $out = [];
    foreach (SMASMALL_SERIES_FIXED_BLOCK_ORDER as $type) {
        $out[] = $by_type[$type] ?? smasmall_series_default_block($type);
    }

    return $out;
}

function smasmall_series_get_admin_blocks(int $post_id): array
{
    $raw = get_post_meta($post_id, SMASMALL_SERIES_META_BLOCKS, true);
    if (!is_array($raw)) {
        $raw = [];
    }

    return smasmall_series_sanitize_blocks(smasmall_series_merge_fixed_blocks($raw), true);
}

function smasmall_series_get_blocks(int $post_id): array
{
    $raw = get_post_meta($post_id, SMASMALL_SERIES_META_BLOCKS, true);
    if (!is_array($raw)) {
        $raw = [];
    }

    return smasmall_series_sanitize_blocks(smasmall_series_merge_fixed_blocks($raw), false);
}

function smasmall_series_normalize_block_type(string $type): string
{
    $type = sanitize_key($type);
    if ($type === 'timeline_carousel') {
        return 'feature_slider';
    }
    if ($type === 'youtube_embed') {
        return 'product_video';
    }
    if ($type === 'hero_slider') {
        return '';
    }
    return isset(SMASMALL_SERIES_BLOCK_TYPES[$type]) ? $type : '';
}

function smasmall_series_parse_video_id(string $raw): string
{
    $raw = trim($raw);
    if ($raw === '') {
        return '';
    }

    if (preg_match('/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_\-]+)/', $raw, $m)) {
        return sanitize_text_field($m[1]);
    }

    return sanitize_text_field(preg_replace('/[^a-zA-Z0-9_\-]/', '', $raw));
}

function smasmall_series_sanitize_text_lines($value): array
{
    if (is_array($value)) {
        $lines = $value;
    } else {
        $lines = preg_split('/\r\n|\r|\n/', (string) $value) ?: [];
    }

    $out = [];
    foreach ($lines as $line) {
        $line = sanitize_text_field((string) $line);
        if ($line !== '') {
            $out[] = $line;
        }
    }
    return $out;
}

function smasmall_series_sanitize_blocks($input, bool $allow_empty = false): array
{
    if (!is_array($input)) {
        return $allow_empty ? smasmall_series_merge_fixed_blocks([]) : [];
    }

    $merged = smasmall_series_merge_fixed_blocks($input);
    $out = [];

    foreach ($merged as $block) {
        if (!is_array($block)) {
            continue;
        }

        $type = smasmall_series_normalize_block_type((string) ($block['type'] ?? ''));
        if ($type === '') {
            continue;
        }

        $item = ['type' => $type];

        switch ($type) {
            case 'feature_slider':
                $item['sectionEyebrow'] = sanitize_text_field($block['sectionEyebrow'] ?? 'FEATURES');
                $item['sectionTitle'] = sanitize_text_field($block['sectionTitle'] ?? '');
                $item['sectionTitleBold'] = sanitize_text_field($block['sectionTitleBold'] ?? '');
                $item['items'] = [];
                if (!empty($block['items']) && is_array($block['items'])) {
                    foreach ($block['items'] as $row) {
                        if (!is_array($row)) {
                            continue;
                        }
                        $image = esc_url_raw($row['image'] ?? '');
                        $title = sanitize_text_field($row['title'] ?? '');
                        if (!$allow_empty && ($image === '' || $title === '')) {
                            continue;
                        }
                        if ($allow_empty || ($image !== '' && $title !== '')) {
                            $item['items'][] = [
                                'number'      => sanitize_text_field($row['number'] ?? ''),
                                'title'       => $title,
                                'description' => sanitize_textarea_field($row['description'] ?? ''),
                                'image'       => $image,
                            ];
                        }
                    }
                }
                if (empty($item['items'])) {
                    if (!$allow_empty) {
                        continue 2;
                    }
                    $item['items'][] = [
                        'number'      => '01',
                        'title'       => '',
                        'description' => '',
                        'image'       => '',
                    ];
                }
                break;

            case 'product_showcase':
                $item['items'] = [];
                if (!empty($block['items']) && is_array($block['items'])) {
                    foreach ($block['items'] as $row) {
                        if (!is_array($row)) {
                            continue;
                        }
                        $main_url = esc_url_raw($row['mainUrl'] ?? ($row['thumbUrl'] ?? ''));
                        $name = sanitize_text_field($row['name'] ?? '');
                        if (!$allow_empty && ($main_url === '' || $name === '')) {
                            continue;
                        }
                        if ($allow_empty || ($main_url !== '' && $name !== '')) {
                            $tags = smasmall_series_sanitize_text_lines($row['tags'] ?? '');
                            $features = [];
                            if (!empty($row['features']) && is_array($row['features'])) {
                                foreach ($row['features'] as $feature) {
                                    if (!is_array($feature)) {
                                        continue;
                                    }
                                    $ftitle = sanitize_text_field($feature['title'] ?? '');
                                    $bullets = smasmall_series_sanitize_text_lines($feature['bullets'] ?? '');
                                    if (!$allow_empty && $ftitle === '' && empty($bullets)) {
                                        continue;
                                    }
                                    if ($allow_empty || $ftitle !== '' || !empty($bullets)) {
                                        $pos = sanitize_key($feature['boxPosition'] ?? 'top_left');
                                        if (!in_array($pos, ['top_left', 'bottom_left', 'bottom_right', 'top_right'], true)) {
                                            $pos = 'top_left';
                                        }
                                        $features[] = [
                                            'title'       => $ftitle,
                                            'bullets'     => $bullets,
                                            'boxPosition' => $pos,
                                        ];
                                    }
                                }
                            }
                            if ($allow_empty && empty($features)) {
                                $features[] = ['title' => '', 'bullets' => [], 'boxPosition' => 'top_left'];
                            }
                            $item['items'][] = [
                                'badge'    => sanitize_text_field($row['badge'] ?? ''),
                                'name'     => $name,
                                'tags'     => $tags,
                                'thumbUrl' => esc_url_raw($row['thumbUrl'] ?? $main_url),
                                'mainUrl'  => $main_url,
                                'features' => $features,
                            ];
                        }
                    }
                }
                if (empty($item['items'])) {
                    if (!$allow_empty) {
                        continue 2;
                    }
                    $item['items'] = smasmall_series_default_block('product_showcase')['items'];
                }
                break;

            case 'specs_panel':
                $left = esc_url_raw($block['leftImage'] ?? '');
                $right = esc_url_raw($block['rightImage'] ?? '');
                if (!$allow_empty && $left === '' && $right === '') {
                    continue 2;
                }
                $item['title'] = sanitize_text_field($block['title'] ?? '產品規格');
                $item['note'] = sanitize_textarea_field($block['note'] ?? '');
                $item['leftImage'] = $left;
                $item['rightImage'] = $right;
                break;

            case 'parallax_hero':
                $bg = esc_url_raw($block['backgroundImage'] ?? '');
                $title = sanitize_text_field($block['title'] ?? '');
                if (!$allow_empty && ($bg === '' || $title === '')) {
                    continue 2;
                }
                $item['title'] = $title;
                $item['subtitle'] = sanitize_textarea_field($block['subtitle'] ?? '');
                $item['backgroundImage'] = $bg;
                break;

            case 'text_banner':
                $body = sanitize_textarea_field($block['body'] ?? '');
                if (!$allow_empty && $body === '') {
                    continue 2;
                }
                $item['backgroundColor'] = sanitize_hex_color($block['backgroundColor'] ?? '') ?: '#ea580c';
                $item['heading'] = sanitize_text_field($block['heading'] ?? '');
                $item['body'] = $body;
                break;

            case 'product_video':
                $product_image = esc_url_raw($block['productImage'] ?? '');
                $video_raw = (string) ($block['videoUrl'] ?? ($block['youtubeId'] ?? ''));
                $video_id = smasmall_series_parse_video_id($video_raw);
                if (!$allow_empty && ($product_image === '' || $video_id === '')) {
                    continue 2;
                }
                $item['sectionTitle'] = sanitize_text_field($block['sectionTitle'] ?? 'CALIBRE AMB+');
                $item['sectionSubtitle'] = sanitize_text_field($block['sectionSubtitle'] ?? '');
                $item['productImage'] = $product_image;
                $item['cableImage'] = esc_url_raw($block['cableImage'] ?? '');
                $item['markerLabel'] = sanitize_text_field($block['markerLabel'] ?? 'A');
                $item['videoUrl'] = $video_raw;
                $item['youtubeId'] = $video_id;
                $item['coverImage'] = esc_url_raw($block['coverImage'] ?? $product_image);
                break;
        }

        $out[] = $item;
    }

    return $out;
}

function smasmall_series_sanitize_featured_urls($input): array
{
    if (!is_array($input)) {
        return [];
    }

    $out = [];
    foreach ($input as $url) {
        $url = esc_url_raw((string) $url);
        if ($url !== '') {
            $out[] = $url;
        }
    }

    return array_values(array_unique($out));
}

function smasmall_series_get_featured_images(int $post_id): array
{
    $raw = get_post_meta($post_id, SMASMALL_SERIES_META_FEATURED, true);

    if (is_array($raw)) {
        return smasmall_series_sanitize_featured_urls($raw);
    }

    if (is_string($raw) && $raw !== '') {
        if ($raw[0] === '[') {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                return smasmall_series_sanitize_featured_urls($decoded);
            }
        }

        return smasmall_series_sanitize_featured_urls([$raw]);
    }

    if (has_post_thumbnail($post_id)) {
        $thumb = (string) get_the_post_thumbnail_url($post_id, 'full');
        if ($thumb !== '') {
            return [$thumb];
        }
    }

    return [];
}

function smasmall_series_get_featured_image(int $post_id): string
{
    $images = smasmall_series_get_featured_images($post_id);

    return $images[0] ?? '';
}

function smasmall_series_save_featured_images(int $post_id, array $urls): void
{
    $urls = smasmall_series_sanitize_featured_urls($urls);
    if (empty($urls)) {
        delete_post_meta($post_id, SMASMALL_SERIES_META_FEATURED);
        delete_post_thumbnail($post_id);
        return;
    }

    update_post_meta($post_id, SMASMALL_SERIES_META_FEATURED, wp_json_encode($urls));
}

/**
 * 將精選圖片注入 hero_slider 第一張 slide（REST 輸出與儲存時共用）
 */
function smasmall_series_apply_featured_to_blocks(array $blocks, string $featured_url, string $post_title = ''): array
{
    if ($featured_url === '') {
        return $blocks;
    }

    foreach ($blocks as $index => $block) {
        if (($block['type'] ?? '') !== 'hero_slider') {
            continue;
        }

        if (empty($block['slides']) || !is_array($block['slides'])) {
            $blocks[$index]['slides'] = [[
                'image'    => $featured_url,
                'eyebrow'  => 'SMASMALL',
                'title'    => $post_title,
                'subtitle' => '',
            ]];
            return $blocks;
        }

        $blocks[$index]['slides'][0]['image'] = $featured_url;
        if ($post_title !== '' && empty($blocks[$index]['slides'][0]['title'])) {
            $blocks[$index]['slides'][0]['title'] = $post_title;
        }

        return $blocks;
    }

    array_unshift($blocks, [
        'type'            => 'hero_slider',
        'autoplaySeconds' => 4,
        'slides'          => [[
            'image'    => $featured_url,
            'eyebrow'  => 'SMASMALL',
            'title'    => $post_title,
            'subtitle' => '',
        ]],
    ]);

    return $blocks;
}

function smasmall_series_sync_featured_to_hero(int $post_id, string $featured_url): void
{
    if ($featured_url === '') {
        return;
    }

    $blocks = smasmall_series_get_blocks($post_id);
    $blocks = smasmall_series_apply_featured_to_blocks($blocks, $featured_url, get_the_title($post_id));
    update_post_meta($post_id, SMASMALL_SERIES_META_BLOCKS, $blocks);
}

function smasmall_series_process_upload_file(array $file, ?string &$error = null): string
{
    $error = '';
    if (empty($file['name'])) {
        $error = '未選擇檔案';
        return '';
    }

    $upload_error = (int) ($file['error'] ?? UPLOAD_ERR_NO_FILE);
    if ($upload_error !== UPLOAD_ERR_OK) {
        $error = '檔案上傳失敗（錯誤代碼 ' . $upload_error . '）';
        return '';
    }

    if (!function_exists('wp_handle_upload')) {
        require_once ABSPATH . 'wp-admin/includes/file.php';
    }

    $upload = wp_handle_upload($file, ['test_form' => false]);

    if (!empty($upload['error'])) {
        $error = (string) $upload['error'];
        return '';
    }
    if (empty($upload['url'])) {
        $error = '無法取得上傳後的網址';
        return '';
    }

    return esc_url_raw($upload['url']);
}

function smasmall_series_restructure_files_array(array $files): array
{
    if (empty($files['name']) || !is_array($files['name'])) {
        return [];
    }

    return smasmall_series_restructure_files_node(
        $files['name'],
        is_array($files['type'] ?? null) ? $files['type'] : [],
        is_array($files['tmp_name'] ?? null) ? $files['tmp_name'] : [],
        is_array($files['error'] ?? null) ? $files['error'] : [],
        is_array($files['size'] ?? null) ? $files['size'] : []
    );
}

function smasmall_series_restructure_files_node($names, $types, $tmp_names, $errors, $sizes): array
{
    $out = [];
    foreach ($names as $key => $name) {
        if (is_array($name)) {
            $out[$key] = smasmall_series_restructure_files_node(
                $name,
                is_array($types[$key] ?? null) ? $types[$key] : [],
                is_array($tmp_names[$key] ?? null) ? $tmp_names[$key] : [],
                is_array($errors[$key] ?? null) ? $errors[$key] : [],
                is_array($sizes[$key] ?? null) ? $sizes[$key] : []
            );
            continue;
        }

        $out[$key] = [
            'name'     => $name,
            'type'     => $types[$key] ?? '',
            'tmp_name' => $tmp_names[$key] ?? '',
            'error'    => $errors[$key] ?? UPLOAD_ERR_NO_FILE,
            'size'     => $sizes[$key] ?? 0,
        ];
    }

    return $out;
}

function smasmall_series_merge_block_uploads(array $post_data, array $file_data): array
{
    $image_keys = [
        'image',
        'thumbUrl',
        'mainUrl',
        'leftImage',
        'rightImage',
        'backgroundImage',
        'productImage',
        'cableImage',
        'coverImage',
    ];

    foreach ($image_keys as $img_key) {
        if (!array_key_exists($img_key, $post_data)) {
            continue;
        }
        $upload_key = $img_key . '_upload';
        if (empty($file_data[$upload_key]) || !is_array($file_data[$upload_key])) {
            continue;
        }
        $url = smasmall_series_process_upload_file($file_data[$upload_key]);
        if ($url !== '') {
            $post_data[$img_key] = $url;
        }
    }

    foreach ($post_data as $key => $value) {
        if (!is_array($value)) {
            continue;
        }
        $child_files = is_array($file_data[$key] ?? null) ? $file_data[$key] : [];
        $post_data[$key] = smasmall_series_merge_block_uploads($value, $child_files);
    }

    return $post_data;
}

function smasmall_series_render_upload_status_html(): void
{
    ?>
    <div class="sms-upload-status" hidden>
        <div class="sms-upload-progress-wrap" aria-hidden="true">
            <div class="sms-upload-progress-bar" style="width:0%"></div>
        </div>
        <span class="sms-upload-text">上傳中 0%</span>
    </div>
    <?php
}

function smasmall_series_render_image_field(string $name, string $value, string $label, bool $required = false): void
{
    ?>
    <div class="sms-image-field">
        <p class="sms-image-label">
            <label><?php echo esc_html($label); ?><?php if ($required) : ?> <span class="sms-required">*</span><?php endif; ?></label>
        </p>
        <input type="hidden" class="sms-image-value" name="<?php echo esc_attr($name); ?>" value="<?php echo esc_attr($value); ?>" />
        <?php smasmall_series_render_upload_status_html(); ?>
        <?php if ($value !== '') : ?>
            <img src="<?php echo esc_url($value); ?>" alt="" class="sms-image-preview" />
        <?php else : ?>
            <div class="sms-image-empty">尚未設定圖片</div>
        <?php endif; ?>
        <div class="sms-image-tabs" role="tablist">
            <button type="button" class="sms-image-tab is-active" data-tab="device">從個人裝置</button>
            <button type="button" class="sms-image-tab" data-tab="url">從網址</button>
        </div>
        <div class="sms-image-panel is-active" data-panel="device">
            <input type="file" accept="image/*" class="sms-image-file" />
            <p class="sms-help">選擇後會<strong>立即上傳</strong>，請等進度條到 100% 再按更新</p>
        </div>
        <div class="sms-image-panel" data-panel="url">
            <input type="url" class="large-text sms-image-url"
                   value="<?php echo esc_attr($value); ?>" placeholder="https://..." />
        </div>
        <p><button type="button" class="button-link-delete sms-image-clear">清除圖片</button></p>
    </div>
    <?php
}

add_action('wp_ajax_smasmall_series_upload_image', function () {
    check_ajax_referer('smasmall_series_upload', 'nonce');

    if (!current_user_can('upload_files')) {
        wp_send_json_error(['message' => '您沒有上傳圖片的權限'], 403);
    }

    if (empty($_FILES['file']) || !is_array($_FILES['file'])) {
        wp_send_json_error(['message' => '未選擇檔案'], 400);
    }

    $error = '';
    $url = smasmall_series_process_upload_file($_FILES['file'], $error);
    if ($url === '') {
        wp_send_json_error(['message' => $error !== '' ? $error : '上傳失敗'], 500);
    }

    wp_send_json_success(['url' => $url]);
});

function smasmall_series_format_post(int $post_id, bool $include_blocks = true): ?array
{
    $post = get_post($post_id);
    if (!$post instanceof WP_Post || $post->post_type !== SMASMALL_SERIES_POST_TYPE) {
        return null;
    }

    if (!smasmall_series_is_enabled($post_id) || $post->post_status !== 'publish') {
        return null;
    }

    $slug = smasmall_series_get_slug($post_id);
    if ($slug === '') {
        return null;
    }

    $og_image = esc_url_raw((string) get_post_meta($post_id, SMASMALL_SERIES_META_OG_IMAGE, true));
    if ($og_image === '') {
        $og_image = smasmall_series_get_featured_image($post_id);
    }

    $data = [
        'id'          => $post_id,
        'title'       => get_the_title($post_id),
        'slug'        => $slug,
        'order'       => (int) get_post_meta($post_id, SMASMALL_SERIES_META_ORDER, true),
        'seoTitle'    => sanitize_text_field((string) get_post_meta($post_id, SMASMALL_SERIES_META_SEO_TITLE, true)),
        'seoDescription' => sanitize_textarea_field((string) get_post_meta($post_id, SMASMALL_SERIES_META_SEO_DESC, true)),
        'ogImage'     => $og_image,
        'wcProductId' => max(0, (int) get_post_meta($post_id, SMASMALL_SERIES_META_WC_PRODUCT_ID, true)),
        'updatedAt'   => get_post_modified_time('c', true, $post_id),
    ];

    if ($data['seoTitle'] === '') {
        $data['seoTitle'] = $data['title'];
    }

    $featured_images = smasmall_series_get_featured_images($post_id);
    if (!empty($featured_images)) {
        $data['featuredImages'] = $featured_images;
        $data['featuredImage'] = $featured_images[0];
        if (($data['ogImage'] ?? '') === '') {
            $data['ogImage'] = $featured_images[0];
        }
    }

    if ($include_blocks) {
        $data['blocks'] = smasmall_series_get_blocks($post_id);
    }

    if ($data['wcProductId'] <= 0) {
        unset($data['wcProductId']);
    }
    if (($data['ogImage'] ?? '') === '') {
        unset($data['ogImage']);
    }

    return $data;
}

function smasmall_series_get_all_published(bool $include_blocks = false): array
{
    // 勿用 meta_key 當查詢條件：沒填「選單排序」的新系列會被整筆排除，Navbar 就不會出現
    $query = new WP_Query([
        'post_type'              => SMASMALL_SERIES_POST_TYPE,
        'post_status'            => 'publish',
        'posts_per_page'         => -1,
        'no_found_rows'          => true,
        'update_post_term_cache' => false,
        'orderby'                => 'title',
        'order'                  => 'ASC',
    ]);

    $items = [];
    foreach ($query->posts as $post) {
        $formatted = smasmall_series_format_post($post->ID, $include_blocks);
        if ($formatted) {
            $items[] = $formatted;
        }
    }

    usort($items, static function (array $a, array $b): int {
        $order_cmp = ((int) ($a['order'] ?? 0)) <=> ((int) ($b['order'] ?? 0));
        if ($order_cmp !== 0) {
            return $order_cmp;
        }
        return strnatcasecmp((string) ($a['title'] ?? ''), (string) ($b['title'] ?? ''));
    });

    return $items;
}

function smasmall_series_find_by_slug(string $slug): ?array
{
    $slug = trim(rawurldecode($slug));
    if ($slug === '') {
        return null;
    }

    $query = new WP_Query([
        'post_type'              => SMASMALL_SERIES_POST_TYPE,
        'post_status'            => 'publish',
        'posts_per_page'         => 1,
        'no_found_rows'          => true,
        'update_post_term_cache' => false,
        'meta_query'             => [
            [
                'key'     => SMASMALL_SERIES_META_SLUG,
                'value'   => $slug,
                'compare' => '=',
            ],
        ],
    ]);

    if (!empty($query->posts)) {
        return smasmall_series_format_post($query->posts[0]->ID, true);
    }

    // 尚未填自訂 slug 時，退回比對 post_name / 標題產生的 slug
    foreach (smasmall_series_get_all_published(true) as $item) {
        if (($item['slug'] ?? '') === $slug) {
            return $item;
        }
    }

    return null;
}

/** ---------- 註冊 CPT ---------- */
add_action('init', function () {
    register_post_type(SMASMALL_SERIES_POST_TYPE, [
        'labels' => [
            'name'               => '系列產品',
            'singular_name'      => '系列產品',
            'add_new'            => '新增系列產品',
            'add_new_item'       => '新增系列產品',
            'edit_item'          => '編輯系列產品',
            'new_item'           => '新系列產品',
            'view_item'          => '檢視系列產品',
            'search_items'       => '搜尋系列產品',
            'not_found'          => '找不到系列產品',
            'not_found_in_trash' => '回收桶中沒有系列產品',
            'menu_name'          => '系列產品',
        ],
        'public'              => false,
        'publicly_queryable'  => false,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_admin_bar'   => true,
        'menu_icon'           => 'dashicons-products',
        'menu_position'       => 26,
        'supports'            => ['title'],
        'has_archive'         => false,
        'rewrite'             => false,
        'show_in_rest'        => false,
        'capability_type'     => 'post',
        'map_meta_cap'        => true,
        'can_export'          => true,
    ]);

    $meta_args = [
        'type'              => 'string',
        'single'            => true,
        'show_in_rest'      => false,
        'auth_callback'     => static function () {
            return current_user_can('edit_posts');
        },
    ];

    register_post_meta(SMASMALL_SERIES_POST_TYPE, SMASMALL_SERIES_META_SLUG, $meta_args);
    register_post_meta(SMASMALL_SERIES_POST_TYPE, SMASMALL_SERIES_META_SEO_TITLE, $meta_args);
    register_post_meta(SMASMALL_SERIES_POST_TYPE, SMASMALL_SERIES_META_SEO_DESC, $meta_args);
    register_post_meta(SMASMALL_SERIES_POST_TYPE, SMASMALL_SERIES_META_OG_IMAGE, $meta_args);
    register_post_meta(SMASMALL_SERIES_POST_TYPE, SMASMALL_SERIES_META_FEATURED, $meta_args);

    register_post_meta(SMASMALL_SERIES_POST_TYPE, SMASMALL_SERIES_META_ORDER, [
        'type'              => 'integer',
        'single'            => true,
        'show_in_rest'      => false,
        'auth_callback'     => static function () {
            return current_user_can('edit_posts');
        },
    ]);

    register_post_meta(SMASMALL_SERIES_POST_TYPE, SMASMALL_SERIES_META_ENABLED, [
        'type'              => 'string',
        'single'            => true,
        'show_in_rest'      => false,
        'auth_callback'     => static function () {
            return current_user_can('edit_posts');
        },
    ]);

    register_post_meta(SMASMALL_SERIES_POST_TYPE, SMASMALL_SERIES_META_WC_PRODUCT_ID, [
        'type'              => 'integer',
        'single'            => true,
        'show_in_rest'      => false,
        'auth_callback'     => static function () {
            return current_user_can('edit_posts');
        },
    ]);
});

/** ---------- 首次啟用：建立範例資料 ---------- */
add_action('admin_init', function () {
    if (get_option('smasmall_series_seeded') === '1') {
        return;
    }

    $existing = get_posts([
        'post_type'      => SMASMALL_SERIES_POST_TYPE,
        'post_status'    => 'any',
        'posts_per_page' => 1,
        'fields'         => 'ids',
    ]);

    if (!empty($existing)) {
        update_option('smasmall_series_seeded', '1', false);
        return;
    }

    $post_id = wp_insert_post([
        'post_type'   => SMASMALL_SERIES_POST_TYPE,
        'post_status' => 'publish',
        'post_title'  => '捍衛者套裝',
    ], true);

    if (is_wp_error($post_id)) {
        return;
    }

    update_post_meta($post_id, SMASMALL_SERIES_META_SLUG, 'defender-set');
    update_post_meta($post_id, SMASMALL_SERIES_META_ORDER, 0);
    update_post_meta($post_id, SMASMALL_SERIES_META_ENABLED, '1');
    update_post_meta($post_id, SMASMALL_SERIES_META_SEO_TITLE, '昔馬 SMASMALL 捍衛者+ 全合金電動刮鬍刀｜戰損塗裝、磁吸快拆');
    update_post_meta($post_id, SMASMALL_SERIES_META_SEO_DESC, '昔馬 SMASMALL 捍衛者+ 全合金戰損刮鬍刀。獨創硬派戰損塗裝，搭載雙環開放式浮動圓刀頭與德國進口自銳刀片。');
    update_post_meta($post_id, SMASMALL_SERIES_META_BLOCKS, smasmall_series_sanitize_blocks([
        [
            'type'             => 'feature_slider',
            'sectionEyebrow'   => 'FEATURES',
            'sectionTitle'     => '昔馬電動刮鬍刀-捍衛者',
            'sectionTitleBold' => '產品特色',
            'items'            => [
                [
                    'number'      => '01',
                    'title'       => '禮盒內容 全面武裝',
                    'description' => '14項豪華配件一次擁有，送禮自用兩相宜。',
                    'image'       => '',
                ],
            ],
        ],
    ]));

    update_option('smasmall_series_seeded', '1', false);
});

/** ---------- 列表欄位 ---------- */
add_filter('manage_' . SMASMALL_SERIES_POST_TYPE . '_posts_columns', function ($columns) {
    $new = [];
    foreach ($columns as $key => $label) {
        $new[$key] = $label;
        if ($key === 'title') {
            $new['smasmall_series_slug'] = 'Slug';
            $new['smasmall_series_order'] = '排序';
            $new['smasmall_series_enabled'] = '狀態';
        }
    }
    return $new;
});

add_action('manage_' . SMASMALL_SERIES_POST_TYPE . '_posts_custom_column', function ($column, $post_id) {
    if ($column === 'smasmall_series_slug') {
        $slug = smasmall_series_get_slug((int) $post_id);
        echo $slug !== '' ? esc_html($slug) : '<span style="color:#dc2626;">未設定</span>';
        return;
    }
    if ($column === 'smasmall_series_order') {
        echo esc_html((string) (int) get_post_meta($post_id, SMASMALL_SERIES_META_ORDER, true));
        return;
    }
    if ($column === 'smasmall_series_enabled') {
        echo smasmall_series_is_enabled((int) $post_id)
            ? '<span style="color:#15803d;">顯示</span>'
            : '<span style="color:#64748b;">隱藏</span>';
    }
}, 10, 2);

/** ---------- Meta boxes ---------- */
add_action('edit_form_after_title', function ($post) {
    if (!$post instanceof WP_Post || $post->post_type !== SMASMALL_SERIES_POST_TYPE) {
        return;
    }
    wp_nonce_field('smasmall_series_save', 'smasmall_series_nonce');
});

add_action('add_meta_boxes', function () {
    remove_meta_box('postimagediv', SMASMALL_SERIES_POST_TYPE, 'side');

    add_meta_box(
        'smasmall-series-featured',
        '精選圖片',
        'smasmall_series_render_featured_meta_box',
        SMASMALL_SERIES_POST_TYPE,
        'side',
        'high'
    );

    add_meta_box(
        'smasmall-series-settings',
        'SMASMALL 系列產品設定',
        'smasmall_series_render_settings_meta_box',
        SMASMALL_SERIES_POST_TYPE,
        'normal',
        'high'
    );

    $index = 0;
    foreach (SMASMALL_SERIES_BLOCK_TYPES as $type => $label) {
        add_meta_box(
            'smasmall-series-block-' . $type,
            $label,
            static function (WP_Post $post) use ($type, $index) {
                smasmall_series_render_fixed_block_meta_box($post, $type, $index);
            },
            SMASMALL_SERIES_POST_TYPE,
            'normal',
            'default'
        );
        $index++;
    }
});

function smasmall_series_admin_template(string $html, array $replacements): string
{
    if (!$replacements) {
        return $html;
    }
    return str_replace(array_keys($replacements), array_values($replacements), $html);
}

function smasmall_series_print_admin_image_styles(): void
{
    static $printed = false;
    if ($printed) {
        return;
    }
    $printed = true;
    ?>
    <style>
        .sms-fixed-block .sms-sub-row { margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #eef2f7; }
        .sms-fixed-block .sms-repeater > p:first-child { margin-top: 0; }
        .sms-required { color: #dc2626; }
        .sms-help { color: #64748b; font-size: 12px; margin: 6px 0 0; }
        .sms-image-field { margin: 12px 0 16px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; }
        .sms-image-label { margin: 0 0 8px; font-weight: 600; }
        .sms-image-preview {
            display: block; max-width: 100%; max-height: 180px; margin-bottom: 10px;
            border-radius: 6px; border: 1px solid #dcdcde; object-fit: contain; background: #fff;
        }
        .sms-image-empty {
            margin-bottom: 10px; padding: 24px 12px; border: 1px dashed #c3c4c7; border-radius: 6px;
            background: #fff; color: #787c82; font-size: 12px; text-align: center;
        }
        .sms-image-tabs, .sms-featured-tabs {
            display: flex; gap: 0; margin-bottom: 10px; border: 1px solid #c3c4c7; border-radius: 4px; overflow: hidden;
        }
        .sms-image-tab, .sms-featured-tab {
            flex: 1; padding: 8px 10px; border: 0; background: #f0f0f1; cursor: pointer; font-size: 12px;
        }
        .sms-image-tab.is-active, .sms-featured-tab.is-active { background: #fff; box-shadow: inset 0 -2px 0 #2271b1; }
        .sms-image-panel, .sms-featured-panel { display: none; }
        .sms-image-panel.is-active, .sms-featured-panel.is-active { display: block; }
        .sms-upload-status {
            flex-direction: column; align-items: stretch; gap: 6px;
            margin: 0 0 10px; padding: 10px 12px; border-radius: 6px;
            background: #fff; border: 1px solid #c3c4c7; color: #1d2327; font-size: 12px;
        }
        .sms-upload-status[hidden] { display: none !important; }
        .sms-upload-status.is-visible { display: flex; }
        .sms-upload-progress-wrap {
            height: 8px; border-radius: 999px; background: #e2e8f0; overflow: hidden;
        }
        .sms-upload-progress-bar {
            height: 100%; width: 0; background: #2271b1; border-radius: 999px;
            transition: width 0.12s ease;
        }
        .sms-upload-text { font-weight: 600; line-height: 1.4; }
        .sms-upload-status.is-success { border-color: #46b450; background: #edfaef; color: #1e4620; }
        .sms-upload-status.is-success .sms-upload-progress-bar { background: #46b450; }
        .sms-upload-status.is-error { border-color: #dc3232; background: #fcf0f1; color: #8a1f1f; }
        .sms-upload-status.is-error .sms-upload-progress-bar { background: #dc3232; }
        .sms-image-field.is-uploading .sms-image-file { pointer-events: none; opacity: 0.6; }
        .sms-featured-box.is-uploading .sms-featured-file { pointer-events: none; opacity: 0.6; }
        .sms-featured-gallery { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-bottom: 4px; }
        .sms-featured-gallery.is-single { grid-template-columns: 1fr; }
        .sms-featured-gallery.is-empty { display: block; }
        .sms-featured-item { position: relative; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; background: #fff; }
        .sms-featured-item img { display: block; width: 100%; aspect-ratio: 1; object-fit: cover; }
        .sms-featured-gallery.is-single .sms-featured-item img { aspect-ratio: 16 / 10; }
        .sms-featured-remove {
            position: absolute; top: 4px; right: 4px; z-index: 2;
            width: 22px; height: 22px; padding: 0; border: 0; border-radius: 50%;
            background: rgba(15, 23, 42, 0.72); color: #fff; font-size: 14px; line-height: 22px;
            cursor: pointer; text-align: center;
        }
        .sms-featured-remove:hover { background: rgba(220, 38, 38, 0.92); }
        .sms-featured-url-row { display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: center; margin-top: 8px; }
        .sms-color-picker.wp-color-picker { max-width: 260px; }
    </style>
    <?php
}

add_action('admin_head', function () {
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || $screen->post_type !== SMASMALL_SERIES_POST_TYPE) {
        return;
    }
    smasmall_series_print_admin_image_styles();
});

function smasmall_series_block_help_text(string $type): string
{
    switch ($type) {
        case 'feature_slider':
            return '對應詳細頁「產品特色」橫向滑塊。可新增多張特色卡片。';
        case 'product_showcase':
            return '對應詳細頁配件展示與賣點標註。每個配件可設定縮圖、主圖與標籤。';
        case 'specs_panel':
            return '對應詳細頁產品規格圖。左、右各上傳一張規格圖。';
        case 'parallax_hero':
            return '對應詳細頁視覺差滾動首段。需主標題與背景圖。';
        case 'text_banner':
            return '對應詳細頁橘色背景文字區塊。';
        case 'product_video':
            return '對應詳細頁產品展示與影片彈窗。需產品主圖與 YouTube 網址。';
        default:
            return '';
    }
}

function smasmall_series_render_fixed_block_meta_box(WP_Post $post, string $type, int $index): void
{
    static $styles_printed = false;
    $blocks = smasmall_series_get_admin_blocks($post->ID);
    $block = $blocks[$index] ?? smasmall_series_default_block($type);
    $block['type'] = $type;

    if (!$styles_printed) {
        $styles_printed = true;
        smasmall_series_print_admin_image_styles();
    }
    ?>
    <div class="sms-fixed-block" data-index="<?php echo esc_attr((string) $index); ?>" data-block-type="<?php echo esc_attr($type); ?>">
        <p class="description"><?php echo esc_html(smasmall_series_block_help_text($type)); ?></p>
        <input type="hidden" name="blocks[<?php echo esc_attr((string) $index); ?>][type]" value="<?php echo esc_attr($type); ?>" />
        <?php smasmall_series_render_block_body($type, $block, $index); ?>
    </div>
    <?php
}

function smasmall_series_render_admin_block_templates(): void
{
    ?>
    <script type="text/html" id="tmpl-sms-timeline-row">
        <?php echo smasmall_series_timeline_row_template_html(); ?>
    </script>
    <script type="text/html" id="tmpl-sms-showcase-row">
        <?php echo smasmall_series_showcase_row_template_html(); ?>
    </script>
    <script type="text/html" id="tmpl-sms-showcase-feature">
        <?php echo smasmall_series_showcase_feature_template_html(); ?>
    </script>
    <?php
}

function smasmall_series_showcase_row_template_html(): string
{
    ob_start();
    smasmall_series_render_showcase_row('blocks[0]', 0, ['badge' => '配件 1', 'name' => '', 'tags' => '', 'thumbUrl' => '', 'mainUrl' => '', 'features' => []]);
    $html = ob_get_clean();

    return smasmall_series_admin_template($html, [
        'blocks[0][items][0]' => 'blocks[__INDEX__][items][__PIDX__]',
        'data-product-index="0"' => 'data-product-index="__PIDX__"',
    ]);
}

function smasmall_series_showcase_feature_template_html(): string
{
    ob_start();
    smasmall_series_render_showcase_feature_row('blocks[0]', 0, 0, ['title' => '', 'bullets' => '', 'boxPosition' => 'top_left']);
    $html = ob_get_clean();

    return smasmall_series_admin_template($html, [
        'blocks[0][items][0][features][0]' => 'blocks[__INDEX__][items][__PIDX__][features][__FIDX__]',
    ]);
}

function smasmall_series_slide_row_template_html(): string
{
    ob_start();
    smasmall_series_render_slide_row(
        'blocks[0]',
        0,
        ['image' => '', 'eyebrow' => '', 'title' => '', 'subtitle' => '']
    );
    $html = ob_get_clean();

    return smasmall_series_admin_template($html, [
        'blocks[0][slides][0]' => 'blocks[__INDEX__][slides][__SIDX__]',
    ]);
}

function smasmall_series_timeline_row_template_html(): string
{
    ob_start();
    smasmall_series_render_timeline_row(
        'blocks[0]',
        0,
        ['number' => '01', 'title' => '', 'description' => '', 'image' => '']
    );
    $html = ob_get_clean();

    return smasmall_series_admin_template($html, [
        'blocks[0][items][0]' => 'blocks[__INDEX__][items][__IIDX__]',
    ]);
}

function smasmall_series_render_featured_meta_box(WP_Post $post): void
{
    $featured_images = smasmall_series_get_featured_images($post->ID);
    $featured_json = wp_json_encode($featured_images);
    ?>
    <style>
        .sms-featured-box { display: flex; flex-direction: column; gap: 12px; }
        .sms-featured-tabs { display: flex; gap: 0; border: 1px solid #c3c4c7; border-radius: 4px; overflow: hidden; }
        .sms-featured-tab {
            flex: 1; padding: 8px 6px; text-align: center; font-size: 12px; font-weight: 600;
            background: #f6f7f7; border: 0; cursor: pointer; color: #1d2327;
        }
        .sms-featured-tab.is-active { background: #fff; box-shadow: inset 0 -2px 0 #2271b1; }
        .sms-featured-panel { display: none; }
        .sms-featured-panel.is-active { display: block; }
        .sms-featured-empty-inline {
            border: 2px dashed #cbd5e1; border-radius: 6px; padding: 20px 12px; text-align: center;
            color: #64748b; font-size: 12px; background: #f8fafc;
        }
    </style>
    <div class="sms-featured-box" data-featured-json="<?php echo esc_attr($featured_json); ?>">
        <p class="description" style="margin-top:0;">
            對應前台 Hero 輪播。可新增多張，順序即輪播順序。選圖後立即上傳，請等進度條到 100% 再按更新。
        </p>

        <?php smasmall_series_render_upload_status_html(); ?>

        <div id="sms-featured-gallery" class="sms-featured-gallery<?php echo empty($featured_images) ? ' is-empty' : (count($featured_images) === 1 ? ' is-single' : ''); ?>">
            <?php if (empty($featured_images)) : ?>
                <div class="sms-featured-empty-inline">尚未設定精選圖片</div>
            <?php else : ?>
                <?php foreach ($featured_images as $index => $url) : ?>
                    <div class="sms-featured-item" data-index="<?php echo esc_attr((string) $index); ?>">
                        <img src="<?php echo esc_url($url); ?>" alt="" />
                        <button type="button" class="sms-featured-remove" aria-label="移除此圖">×</button>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>

        <input type="hidden" id="smasmall_series_featured_json" name="smasmall_series_featured_json"
               value="<?php echo esc_attr($featured_json); ?>" />

        <div class="sms-featured-tabs" role="tablist">
            <button type="button" class="sms-featured-tab is-active" data-tab="device">從個人裝置</button>
            <button type="button" class="sms-featured-tab" data-tab="url">從網址</button>
        </div>

        <div class="sms-featured-panel is-active" data-panel="device">
            <input type="file" accept="image/*" class="sms-featured-file" />
            <p class="description">每次選擇會<strong>新增</strong>一張到輪播。</p>
        </div>

        <div class="sms-featured-panel" data-panel="url">
            <div class="sms-featured-url-row">
                <input type="url" class="large-text" id="sms-featured-url-input" placeholder="https://..." />
                <button type="button" class="button" id="sms-featured-add-url">加入</button>
            </div>
        </div>
    </div>
    <?php
}

function smasmall_series_render_settings_meta_box(WP_Post $post): void
{
    $slug = smasmall_series_get_slug($post->ID);
    $order = (int) get_post_meta($post->ID, SMASMALL_SERIES_META_ORDER, true);
    $enabled = smasmall_series_is_enabled($post->ID);
    $seo_title = (string) get_post_meta($post->ID, SMASMALL_SERIES_META_SEO_TITLE, true);
    $seo_desc = (string) get_post_meta($post->ID, SMASMALL_SERIES_META_SEO_DESC, true);
    $og_image = (string) get_post_meta($post->ID, SMASMALL_SERIES_META_OG_IMAGE, true);
    $wc_id = (int) get_post_meta($post->ID, SMASMALL_SERIES_META_WC_PRODUCT_ID, true);

    $frontend_base = apply_filters('smasmall_series_frontend_base', 'https://your-next-site.com/series/');
    ?>
    <style>
        .sms-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 20px; }
        .sms-field-full { grid-column: 1 / -1; }
        .sms-label { display: block; font-weight: 600; margin-bottom: 6px; }
        .sms-help { color: #64748b; font-size: 12px; margin-top: 6px; }
        @media (max-width: 782px) { .sms-grid { grid-template-columns: 1fr; } }
    </style>
    <p class="description" style="margin-bottom:16px;">Hero 首屏請用右側「精選圖片」設定（可多張輪播）。下方固定有六個獨立區塊（①～⑥），依序對應詳細頁各段落；未填完的區塊不會顯示在前台。</p>
    <div class="sms-grid">
        <div>
            <label class="sms-label" for="smasmall_series_slug">自訂 Slug <span style="color:#dc2626;">*</span></label>
            <input type="text" class="regular-text" id="smasmall_series_slug" name="smasmall_series_slug"
                   value="<?php echo esc_attr($slug); ?>" placeholder="defender-set 或 捍衛者套裝" />
            <p class="sms-help">前端網址：<?php echo esc_html(rtrim($frontend_base, '/') . '/'); ?><strong>{slug}</strong></p>
        </div>
        <div>
            <label class="sms-label" for="smasmall_series_order">選單排序</label>
            <input type="number" class="small-text" id="smasmall_series_order" name="smasmall_series_order"
                   value="<?php echo esc_attr((string) $order); ?>" min="0" step="1" />
            <p class="sms-help">數字越小越前面（Navbar「系列商品」下拉選單）</p>
        </div>
        <div>
            <label class="sms-label" for="smasmall_series_enabled">顯示狀態</label>
            <label><input type="checkbox" name="smasmall_series_enabled" value="1" <?php checked($enabled); ?> /> 在前台與 REST API 顯示</label>
        </div>
        <div>
            <label class="sms-label" for="smasmall_series_wc_product_id">關聯 WooCommerce 商品 ID</label>
            <input type="number" class="small-text" id="smasmall_series_wc_product_id" name="smasmall_series_wc_product_id"
                   value="<?php echo esc_attr($wc_id > 0 ? (string) $wc_id : ''); ?>" min="0" step="1" />
            <p class="sms-help">選填，供「前往購買」按鈕使用</p>
        </div>
        <div class="sms-field-full">
            <label class="sms-label" for="smasmall_series_seo_title">SEO 標題</label>
            <input type="text" class="large-text" id="smasmall_series_seo_title" name="smasmall_series_seo_title"
                   value="<?php echo esc_attr($seo_title); ?>" />
        </div>
        <div class="sms-field-full">
            <label class="sms-label" for="smasmall_series_seo_description">SEO 描述</label>
            <textarea class="large-text" rows="3" id="smasmall_series_seo_description" name="smasmall_series_seo_description"><?php echo esc_textarea($seo_desc); ?></textarea>
        </div>
        <div class="sms-field-full">
            <?php smasmall_series_render_image_field('smasmall_series_og_image', $og_image, 'OG 分享圖'); ?>
            <p class="sms-help">留空則使用「精選圖片」（Hero 首屏）</p>
        </div>
    </div>
    <?php
}

function smasmall_series_render_block_body(string $type, array $block, int $index): void
{
    $prefix = 'blocks[' . $index . ']';

    if ($type === 'feature_slider') {
        ?>
        <p><label>區塊小標</label><br />
            <input type="text" class="regular-text" name="<?php echo esc_attr($prefix); ?>[sectionEyebrow]" value="<?php echo esc_attr($block['sectionEyebrow'] ?? 'FEATURES'); ?>" /></p>
        <p><label>標題（一般）</label><br />
            <input type="text" class="large-text" name="<?php echo esc_attr($prefix); ?>[sectionTitle]" value="<?php echo esc_attr($block['sectionTitle'] ?? ''); ?>" /></p>
        <p><label>標題（粗體）</label><br />
            <input type="text" class="regular-text" name="<?php echo esc_attr($prefix); ?>[sectionTitleBold]" value="<?php echo esc_attr($block['sectionTitleBold'] ?? ''); ?>" /></p>
        <div class="sms-repeater sms-timeline-items" data-kind="timeline">
            <p><strong>特色卡片</strong></p>
            <?php
            $items = is_array($block['items'] ?? null) ? $block['items'] : [['number' => '01', 'title' => '', 'description' => '', 'image' => '']];
            foreach ($items as $iidx => $item) {
                smasmall_series_render_timeline_row($prefix, (int) $iidx, is_array($item) ? $item : []);
            }
            ?>
            <p><button type="button" class="button sms-add-timeline">+ 新增卡片</button></p>
        </div>
        <?php
        return;
    }

    if ($type === 'product_showcase') {
        ?>
        <div class="sms-repeater sms-showcase-items" data-kind="showcase">
            <p><strong>配件 / 產品項目</strong></p>
            <?php
            $items = is_array($block['items'] ?? null) ? $block['items'] : [['badge' => '配件 1', 'name' => '', 'tags' => '', 'thumbUrl' => '', 'mainUrl' => '', 'features' => []]];
            foreach ($items as $pidx => $item) {
                smasmall_series_render_showcase_row($prefix, (int) $pidx, is_array($item) ? $item : []);
            }
            ?>
            <p><button type="button" class="button sms-add-showcase">+ 新增配件</button></p>
        </div>
        <?php
        return;
    }

    if ($type === 'specs_panel') {
        ?>
        <p><label>區塊標題</label><br />
            <input type="text" class="regular-text" name="<?php echo esc_attr($prefix); ?>[title]" value="<?php echo esc_attr($block['title'] ?? '產品規格'); ?>" /></p>
        <p><label>備註（選填）</label><br />
            <input type="text" class="large-text" name="<?php echo esc_attr($prefix); ?>[note]" value="<?php echo esc_attr($block['note'] ?? ''); ?>" placeholder="註：尺寸手工測量及渲染模型，請以產品實物為準。" /></p>
        <p><label>左欄規格圖</label></p>
        <?php smasmall_series_render_image_field($prefix . '[leftImage]', (string) ($block['leftImage'] ?? ''), '左欄規格圖'); ?>
        <p><label>右欄規格圖</label></p>
        <?php smasmall_series_render_image_field($prefix . '[rightImage]', (string) ($block['rightImage'] ?? ''), '右欄規格圖'); ?>
        <?php
        return;
    }

    if ($type === 'parallax_hero') {
        ?>
        <p><label>主標題 <span style="color:#dc2626;">*</span></label><br />
            <input type="text" class="large-text" name="<?php echo esc_attr($prefix); ?>[title]" value="<?php echo esc_attr($block['title'] ?? ''); ?>" /></p>
        <p><label>副標</label><br />
            <textarea class="large-text" rows="2" name="<?php echo esc_attr($prefix); ?>[subtitle]"><?php echo esc_textarea($block['subtitle'] ?? ''); ?></textarea></p>
        <p><label>背景圖 <span style="color:#dc2626;">*</span></label></p>
        <?php smasmall_series_render_image_field($prefix . '[backgroundImage]', (string) ($block['backgroundImage'] ?? ''), '背景圖', true); ?>
        <?php
        return;
    }

    if ($type === 'text_banner') {
        ?>
        <p><label>背景色</label><br />
            <input type="text"
                   class="sms-color-picker"
                   name="<?php echo esc_attr($prefix); ?>[backgroundColor]"
                   value="<?php echo esc_attr(sanitize_hex_color($block['backgroundColor'] ?? '') ?: '#ea580c'); ?>"
                   data-default-color="#ea580c" /></p>
        <p><label>上方標題（選填）</label><br />
            <input type="text" class="large-text" name="<?php echo esc_attr($prefix); ?>[heading]" value="<?php echo esc_attr($block['heading'] ?? ''); ?>" placeholder="Design & Strategy for the" /></p>
        <p><label>主要文字 <span style="color:#dc2626;">*</span></label><br />
            <textarea class="large-text" rows="4" name="<?php echo esc_attr($prefix); ?>[body]"><?php echo esc_textarea($block['body'] ?? ''); ?></textarea></p>
        <?php
        return;
    }

    if ($type === 'product_video') {
        ?>
        <p><label>區塊標題</label><br />
            <input type="text" class="regular-text" name="<?php echo esc_attr($prefix); ?>[sectionTitle]" value="<?php echo esc_attr($block['sectionTitle'] ?? 'CALIBRE AMB+'); ?>" /></p>
        <p><label>區塊副標</label><br />
            <input type="text" class="large-text" name="<?php echo esc_attr($prefix); ?>[sectionSubtitle]" value="<?php echo esc_attr($block['sectionSubtitle'] ?? ''); ?>" placeholder="Developed by Weibo Technology" /></p>
        <p><label>產品主圖 <span style="color:#dc2626;">*</span></label></p>
        <?php smasmall_series_render_image_field($prefix . '[productImage]', (string) ($block['productImage'] ?? ''), '產品主圖', true); ?>
        <p><label>充電線圖（選填）</label></p>
        <?php smasmall_series_render_image_field($prefix . '[cableImage]', (string) ($block['cableImage'] ?? ''), '充電線圖'); ?>
        <p><label>標記文字</label><br />
            <input type="text" class="small-text" name="<?php echo esc_attr($prefix); ?>[markerLabel]" value="<?php echo esc_attr($block['markerLabel'] ?? 'A'); ?>" /></p>
        <p><label>影片網址或 YouTube ID <span style="color:#dc2626;">*</span></label><br />
            <input type="url" class="large-text" name="<?php echo esc_attr($prefix); ?>[videoUrl]" value="<?php echo esc_attr($block['videoUrl'] ?? ($block['youtubeId'] ?? '')); ?>" placeholder="https://www.youtube.com/watch?v=..." /></p>
        <p><label>影片封面圖（選填，留空用產品主圖）</label></p>
        <?php smasmall_series_render_image_field($prefix . '[coverImage]', (string) ($block['coverImage'] ?? ''), '影片封面圖'); ?>
        <?php
    }
}

function smasmall_series_render_showcase_feature_row(string $prefix, int $pidx, int $fidx, array $feature): void
{
    $pos = sanitize_key($feature['boxPosition'] ?? 'top_left');
    if (!in_array($pos, ['top_left', 'bottom_left', 'bottom_right', 'top_right'], true)) {
        $pos = 'top_left';
    }
    ?>
    <div class="sms-sub-row sms-feature-row">
        <p><label>賣點標題</label><br />
            <input type="text" class="regular-text" name="<?php echo esc_attr($prefix); ?>[items][<?php echo esc_attr((string) $pidx); ?>][features][<?php echo esc_attr((string) $fidx); ?>][title]" value="<?php echo esc_attr($feature['title'] ?? ''); ?>" /></p>
        <p><label>賣點條列（每行一項）</label><br />
            <textarea class="large-text" rows="3" name="<?php echo esc_attr($prefix); ?>[items][<?php echo esc_attr((string) $pidx); ?>][features][<?php echo esc_attr((string) $fidx); ?>][bullets]"><?php echo esc_textarea(is_array($feature['bullets'] ?? null) ? implode("\n", $feature['bullets']) : ($feature['bullets'] ?? '')); ?></textarea></p>
        <p><label>方塊位置</label><br />
            <select class="sms-box-position" name="<?php echo esc_attr($prefix); ?>[items][<?php echo esc_attr((string) $pidx); ?>][features][<?php echo esc_attr((string) $fidx); ?>][boxPosition]">
                <option value="top_left" <?php selected($pos, 'top_left'); ?>>左上</option>
                <option value="top_right" <?php selected($pos, 'top_right'); ?>>右上</option>
                <option value="bottom_left" <?php selected($pos, 'bottom_left'); ?>>左下</option>
                <option value="bottom_right" <?php selected($pos, 'bottom_right'); ?>>右下</option>
            </select>
            <span class="description">同一配件內，每個賣點請選不同角落，否則前台會重疊。</span>
        </p>
        <p><button type="button" class="button-link-delete sms-remove-sub">移除此賣點</button></p>
        <hr />
    </div>
    <?php
}

function smasmall_series_render_showcase_row(string $prefix, int $pidx, array $item): void
{
    $tags = is_array($item['tags'] ?? null) ? implode("\n", $item['tags']) : ($item['tags'] ?? '');
    $features = is_array($item['features'] ?? null) ? $item['features'] : [['title' => '', 'bullets' => '', 'boxPosition' => 'top_left']];
    ?>
    <div class="sms-sub-row sms-showcase-row">
        <p><label>配件標籤</label><br />
            <input type="text" class="regular-text" name="<?php echo esc_attr($prefix); ?>[items][<?php echo esc_attr((string) $pidx); ?>][badge]" value="<?php echo esc_attr($item['badge'] ?? ''); ?>" placeholder="配件 1" /></p>
        <p><label>名稱</label><br />
            <input type="text" class="large-text" name="<?php echo esc_attr($prefix); ?>[items][<?php echo esc_attr((string) $pidx); ?>][name]" value="<?php echo esc_attr($item['name'] ?? ''); ?>" /></p>
        <p><label>標籤（每行一個）</label><br />
            <textarea class="large-text" rows="2" name="<?php echo esc_attr($prefix); ?>[items][<?php echo esc_attr((string) $pidx); ?>][tags]"><?php echo esc_textarea($tags); ?></textarea></p>
        <?php smasmall_series_render_image_field($prefix . '[items][' . $pidx . '][thumbUrl]', (string) ($item['thumbUrl'] ?? ''), '縮圖'); ?>
        <?php smasmall_series_render_image_field($prefix . '[items][' . $pidx . '][mainUrl]', (string) ($item['mainUrl'] ?? ''), '主圖', true); ?>
        <div class="sms-showcase-features">
            <p><strong>賣點標註</strong></p>
            <p class="description" style="margin:0 0 10px;">
                前台會依「方塊位置」把資訊匡固定在產品四周四個角落（左上／右上／左下／右下）。
                <strong>同一配件最多 4 個賣點，且每個位置只能用一次</strong>；選到重複位置時，資訊匡會互相堆疊。
            </p>
            <div class="sms-box-dup-warn" style="display:none;margin:0 0 10px;padding:8px 10px;border-left:3px solid #d63638;background:#fcf0f1;color:#b32d2e;font-size:12px;">
                偵測到重複的方塊位置，請改成四個不同角落再儲存。
            </div>
            <?php foreach ($features as $fidx => $feature) : ?>
                <?php smasmall_series_render_showcase_feature_row($prefix, $pidx, (int) $fidx, is_array($feature) ? $feature : []); ?>
            <?php endforeach; ?>
            <p><button type="button" class="button sms-add-showcase-feature" data-product-index="<?php echo esc_attr((string) $pidx); ?>">+ 新增賣點</button></p>
        </div>
        <p><button type="button" class="button-link-delete sms-remove-sub">移除此配件</button></p>
        <hr />
    </div>
    <?php
}

function smasmall_series_render_slide_row(string $prefix, int $sidx, array $slide): void
{
    ?>
    <div class="sms-sub-row">
        <p><label>圖片 URL</label><br />
            <input type="url" class="large-text" name="<?php echo esc_attr($prefix); ?>[slides][<?php echo esc_attr((string) $sidx); ?>][image]" value="<?php echo esc_attr($slide['image'] ?? ''); ?>" /></p>
        <p><label>小標</label><br />
            <input type="text" class="regular-text" name="<?php echo esc_attr($prefix); ?>[slides][<?php echo esc_attr((string) $sidx); ?>][eyebrow]" value="<?php echo esc_attr($slide['eyebrow'] ?? ''); ?>" /></p>
        <p><label>標題</label><br />
            <input type="text" class="regular-text" name="<?php echo esc_attr($prefix); ?>[slides][<?php echo esc_attr((string) $sidx); ?>][title]" value="<?php echo esc_attr($slide['title'] ?? ''); ?>" /></p>
        <p><label>副標</label><br />
            <input type="text" class="regular-text" name="<?php echo esc_attr($prefix); ?>[slides][<?php echo esc_attr((string) $sidx); ?>][subtitle]" value="<?php echo esc_attr($slide['subtitle'] ?? ''); ?>" /></p>
        <p><button type="button" class="button-link-delete sms-remove-sub">移除此 Slide</button></p>
        <hr />
    </div>
    <?php
}

function smasmall_series_render_timeline_row(string $prefix, int $iidx, array $item): void
{
    ?>
    <div class="sms-sub-row">
        <p><label>編號</label><br />
            <input type="text" class="small-text" name="<?php echo esc_attr($prefix); ?>[items][<?php echo esc_attr((string) $iidx); ?>][number]" value="<?php echo esc_attr($item['number'] ?? ''); ?>" /></p>
        <p><label>標題</label><br />
            <input type="text" class="regular-text" name="<?php echo esc_attr($prefix); ?>[items][<?php echo esc_attr((string) $iidx); ?>][title]" value="<?php echo esc_attr($item['title'] ?? ''); ?>" /></p>
        <p><label>描述</label><br />
            <textarea class="large-text" rows="2" name="<?php echo esc_attr($prefix); ?>[items][<?php echo esc_attr((string) $iidx); ?>][description]"><?php echo esc_textarea($item['description'] ?? ''); ?></textarea></p>
        <?php smasmall_series_render_image_field($prefix . '[items][' . $iidx . '][image]', (string) ($item['image'] ?? ''), '特色圖片', true); ?>
        <p><button type="button" class="button-link-delete sms-remove-sub">移除此卡片</button></p>
        <hr />
    </div>
    <?php
}

/**
 * 儲存系列產品後，通知 Next.js 重新產生靜態頁與 sitemap（ISR on-demand）。
 * 需在 wp-config.php 或主機環境設定：
 *   define('SMASMALL_FRONTEND_URL', 'https://www.smasmall.com.tw');
 *   define('SMASMALL_REVALIDATE_SECRET', 'your-secret');
 */
function smasmall_series_revalidate_frontend(int $post_id): void
{
    if (!defined('SMASMALL_FRONTEND_URL') || !defined('SMASMALL_REVALIDATE_SECRET')) {
        return;
    }

    $frontend = rtrim((string) SMASMALL_FRONTEND_URL, '/');
    $secret = (string) SMASMALL_REVALIDATE_SECRET;
    if ($frontend === '' || $secret === '') {
        return;
    }

    $slug = smasmall_series_get_slug($post_id);
    if ($slug === '') {
        return;
    }

    // 系列頁 + /series 總覽 + /sitemap.xml
    wp_remote_post(
        $frontend . '/api/revalidate/series',
        [
            'timeout'   => 8,
            'blocking'  => false,
            'headers'   => [
                'Content-Type'        => 'application/json',
                'x-revalidate-secret' => $secret,
            ],
            'body'      => wp_json_encode(['slug' => $slug]),
        ]
    );
}

add_action('save_post_' . SMASMALL_SERIES_POST_TYPE, function ($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!isset($_POST['smasmall_series_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['smasmall_series_nonce'])), 'smasmall_series_save')) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $raw_slug = isset($_POST['smasmall_series_slug']) ? sanitize_text_field(wp_unslash($_POST['smasmall_series_slug'])) : '';
    $slug = smasmall_series_sanitize_slug($raw_slug, (int) $post_id);
    if ($slug === '' && $raw_slug !== '') {
        set_transient('smasmall_series_slug_error_' . $post_id, '1', 60);
    } elseif ($slug !== '') {
        update_post_meta($post_id, SMASMALL_SERIES_META_SLUG, $slug);
    }

    update_post_meta($post_id, SMASMALL_SERIES_META_ORDER, max(0, (int) ($_POST['smasmall_series_order'] ?? 0)));
    update_post_meta($post_id, SMASMALL_SERIES_META_ENABLED, !empty($_POST['smasmall_series_enabled']) ? '1' : '0');
    update_post_meta($post_id, SMASMALL_SERIES_META_SEO_TITLE, sanitize_text_field(wp_unslash($_POST['smasmall_series_seo_title'] ?? '')));
    update_post_meta($post_id, SMASMALL_SERIES_META_SEO_DESC, sanitize_textarea_field(wp_unslash($_POST['smasmall_series_seo_description'] ?? '')));
    update_post_meta($post_id, SMASMALL_SERIES_META_OG_IMAGE, esc_url_raw(wp_unslash($_POST['smasmall_series_og_image'] ?? '')));
    update_post_meta($post_id, SMASMALL_SERIES_META_WC_PRODUCT_ID, max(0, (int) ($_POST['smasmall_series_wc_product_id'] ?? 0)));

    $blocks_raw = isset($_POST['blocks']) && is_array($_POST['blocks']) ? wp_unslash($_POST['blocks']) : [];
    if (!empty($_FILES['blocks']) && is_array($_FILES['blocks'])) {
        $blocks_raw = smasmall_series_merge_block_uploads($blocks_raw, $_FILES['blocks']);
    }
    $blocks = smasmall_series_sanitize_blocks($blocks_raw, true);
    update_post_meta($post_id, SMASMALL_SERIES_META_BLOCKS, $blocks);

    $featured_json = wp_unslash($_POST['smasmall_series_featured_json'] ?? '[]');
    $decoded = json_decode((string) $featured_json, true);
    smasmall_series_save_featured_images($post_id, is_array($decoded) ? $decoded : []);

    smasmall_series_revalidate_frontend((int) $post_id);
});

add_filter('redirect_post_location', function ($location, $post_id) {
    $post = get_post((int) $post_id);
    if (!$post instanceof WP_Post || $post->post_type !== SMASMALL_SERIES_POST_TYPE) {
        return $location;
    }

    $message = 1;
    if (preg_match('/message=(\d+)/', $location, $matches)) {
        $message = $matches[1];
    }

    return admin_url('post.php?post=' . (int) $post_id . '&action=edit&message=' . $message);
}, 10, 2);

add_action('admin_notices', function () {
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || $screen->post_type !== SMASMALL_SERIES_POST_TYPE) {
        return;
    }

    if (!empty($_GET['smasmall_series_slug_error'])) {
        echo '<div class="notice notice-error is-dismissible"><p>Slug 無效或與其他系列產品重複，請重新填寫。</p></div>';
        return;
    }

    if (!empty($_GET['post'])) {
        $post_id = (int) $_GET['post'];
        if (get_transient('smasmall_series_slug_error_' . $post_id)) {
            delete_transient('smasmall_series_slug_error_' . $post_id);
            echo '<div class="notice notice-error is-dismissible"><p>Slug 無效或與其他系列產品重複，請重新填寫。</p></div>';
        }
    }
});

add_action('post_edit_form_tag', function () {
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if ($screen && $screen->post_type === SMASMALL_SERIES_POST_TYPE) {
        echo ' enctype="multipart/form-data"';
    }
});

/** ---------- Admin JS ---------- */
add_action('admin_enqueue_scripts', function ($hook) {
    if (!in_array($hook, ['post.php', 'post-new.php'], true)) {
        return;
    }
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || $screen->post_type !== SMASMALL_SERIES_POST_TYPE) {
        return;
    }
    wp_enqueue_style('wp-color-picker');
    wp_enqueue_script('wp-color-picker');
});

add_action('admin_footer', function () {
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || $screen->post_type !== SMASMALL_SERIES_POST_TYPE) {
        return;
    }
    smasmall_series_render_admin_block_templates();
    $upload_nonce = wp_create_nonce('smasmall_series_upload');
    ?>
    <script>
    var smasmallSeriesUpload = <?php echo wp_json_encode([
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce'   => $upload_nonce,
    ]); ?>;
    jQuery(function ($) {
        var pendingUploads = 0;

        function setImagePreview($field, url) {
            $field.find('.sms-image-preview, .sms-image-empty').remove();
            if (url) {
                $field.prepend($('<img>', { src: url, alt: '', class: 'sms-image-preview' }));
            } else {
                $field.prepend($('<div>', { class: 'sms-image-empty', text: '尚未設定圖片' }));
            }
        }

        var featuredUrls = [];
        try {
            featuredUrls = JSON.parse($('#smasmall_series_featured_json').val() || '[]');
            if (!Array.isArray(featuredUrls)) {
                featuredUrls = [];
            }
        } catch (e) {
            featuredUrls = [];
        }

        function renderFeaturedGallery() {
            var $gallery = $('#sms-featured-gallery');
            $gallery.empty();
            $gallery.removeClass('is-single is-empty');

            if (!featuredUrls.length) {
                $gallery.addClass('is-empty');
                $gallery.append($('<div>', {
                    class: 'sms-featured-empty-inline',
                    text: '尚未設定精選圖片'
                }));
                return;
            }

            if (featuredUrls.length === 1) {
                $gallery.addClass('is-single');
            }

            featuredUrls.forEach(function (url, index) {
                var $item = $('<div>', { class: 'sms-featured-item', 'data-index': index });
                $item.append($('<img>', { src: url, alt: '' }));
                $item.append($('<button>', {
                    type: 'button',
                    class: 'sms-featured-remove',
                    'aria-label': '移除此圖',
                    text: '×'
                }));
                $gallery.append($item);
            });
        }

        function syncFeaturedJson() {
            $('#smasmall_series_featured_json').val(JSON.stringify(featuredUrls));
            renderFeaturedGallery();
        }

        function addFeaturedUrl(url) {
            url = (url || '').trim();
            if (!url) {
                return false;
            }
            if (featuredUrls.indexOf(url) !== -1) {
                return false;
            }
            featuredUrls.push(url);
            syncFeaturedJson();
            return true;
        }

        renderFeaturedGallery();

        function hideUploadStatus($status) {
            $status.prop('hidden', true).removeClass('is-success is-error is-visible');
            $status.find('.sms-upload-progress-bar').css('width', '0%');
            $status.find('.sms-upload-text').text('上傳中 0%');
            $status.closest('.sms-image-field, .sms-featured-box').removeClass('is-uploading');
        }

        function showUploadStatus($status) {
            $status.prop('hidden', false).addClass('is-visible');
        }

        function setUploadProgress($wrap, percent, message) {
            var $status = $wrap.find('.sms-upload-status').first();
            if (!$status.length) {
                return;
            }
            percent = Math.max(0, Math.min(100, Math.round(percent)));
            $status.removeClass('is-success is-error');
            $wrap.addClass('is-uploading');
            showUploadStatus($status);
            $status.find('.sms-upload-progress-bar').css('width', percent + '%');
            $status.find('.sms-upload-text').text(message || ('上傳中 ' + percent + '%'));
        }

        function setUploadStatus($wrap, state, message, percent) {
            var $status = $wrap.find('.sms-upload-status').first();
            if (!$status.length) {
                return;
            }
            $status.removeClass('is-success is-error');
            if (state === 'uploading') {
                setUploadProgress($wrap, typeof percent === 'number' ? percent : 0, message);
                return;
            }
            $wrap.removeClass('is-uploading');
            if (state === 'success') {
                $status.addClass('is-success');
                showUploadStatus($status);
                $status.find('.sms-upload-progress-bar').css('width', '100%');
                $status.find('.sms-upload-text').text(message || '上傳完成 100%');
                window.setTimeout(function () {
                    hideUploadStatus($status);
                }, 1800);
                return;
            }
            if (state === 'error') {
                $status.addClass('is-error');
                showUploadStatus($status);
                $status.find('.sms-upload-progress-bar').css('width', '100%');
                $status.find('.sms-upload-text').text(message || '上傳失敗');
                return;
            }
            hideUploadStatus($status);
        }

        $('.sms-upload-status').each(function () {
            hideUploadStatus($(this));
        });

        window.addEventListener('pageshow', function (event) {
            if (event.persisted) {
                $('.sms-upload-status').each(function () {
                    hideUploadStatus($(this));
                });
            }
        });

        function updateSubmitButtons() {
            var disabled = pendingUploads > 0;
            $('#publish, #save-post').prop('disabled', disabled).toggleClass('disabled', disabled);
        }

        function setImageFieldValue($field, url) {
            url = url || '';
            $field.find('.sms-image-value').val(url);
            $field.find('.sms-image-url').val(url);
            setImagePreview($field, url);
        }

        function uploadImageFile(file, $wrap, $urlInput, onPreview) {
            pendingUploads++;
            updateSubmitButtons();
            setUploadProgress($wrap, 0, '上傳中 0%');

            var formData = new FormData();
            formData.append('action', 'smasmall_series_upload_image');
            formData.append('nonce', smasmallSeriesUpload.nonce);
            formData.append('file', file);

            return $.ajax({
                url: smasmallSeriesUpload.ajaxUrl,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                xhr: function () {
                    var xhr = $.ajaxSettings.xhr();
                    if (xhr.upload) {
                        xhr.upload.addEventListener('progress', function (event) {
                            if (!event.lengthComputable) {
                                return;
                            }
                            var percent = Math.round((event.loaded / event.total) * 100);
                            if (percent >= 100) {
                                setUploadProgress($wrap, 100, '伺服器處理中…');
                                return;
                            }
                            setUploadProgress($wrap, percent);
                        });
                    }
                    return xhr;
                }
            }).done(function (response) {
                if (response && response.success && response.data && response.data.url) {
                    var $field = $urlInput.closest('.sms-image-field');
                    if ($field.length) {
                        setImageFieldValue($field, response.data.url);
                    } else {
                        $urlInput.val(response.data.url);
                    }
                    if (typeof onPreview === 'function') {
                        onPreview(response.data.url);
                    }
                    setUploadStatus($wrap, 'success', '上傳完成 100%');
                } else {
                    var msg = response && response.data && response.data.message
                        ? response.data.message
                        : '上傳失敗';
                    setUploadStatus($wrap, 'error', msg);
                }
            }).fail(function (xhr) {
                var msg = '上傳失敗，請稍後再試';
                if (xhr.responseJSON && xhr.responseJSON.data && xhr.responseJSON.data.message) {
                    msg = xhr.responseJSON.data.message;
                }
                setUploadStatus($wrap, 'error', msg);
            }).always(function () {
                pendingUploads = Math.max(0, pendingUploads - 1);
                updateSubmitButtons();
            });
        }

        function getBlockIndex($el) {
            var $block = $el.closest('.sms-fixed-block');
            if (!$block.length) {
                return 0;
            }
            var idx = parseInt($block.attr('data-index'), 10);
            return isNaN(idx) ? 0 : idx;
        }

        $('#post').on('submit', function (e) {
            if (pendingUploads > 0) {
                e.preventDefault();
                window.alert('圖片仍在上傳中，請等待進度條到 100% 後再按更新。');
                return false;
            }
            syncFeaturedJson();
            $('.sms-upload-status').each(function () {
                hideUploadStatus($(this));
            });
        });

        $(document).on('click', '.sms-image-tab, .sms-featured-tab', function () {
            var tab = $(this).data('tab');
            var $wrap = $(this).closest('.sms-image-field, .sms-featured-box');
            $wrap.find('.sms-image-tab, .sms-featured-tab').removeClass('is-active');
            $(this).addClass('is-active');
            $wrap.find('.sms-image-panel, .sms-featured-panel').removeClass('is-active');
            $wrap.find('.sms-image-panel[data-panel="' + tab + '"], .sms-featured-panel[data-panel="' + tab + '"]').addClass('is-active');
        });

        $(document).on('change', '.sms-image-file', function () {
            var file = this.files && this.files[0];
            var $field = $(this).closest('.sms-image-field');
            var $urlInput = $field.find('.sms-image-url');
            if (!file) {
                return;
            }
            var reader = new FileReader();
            reader.onload = function (event) {
                setImagePreview($field, event.target.result);
            };
            reader.readAsDataURL(file);
            uploadImageFile(file, $field, $urlInput, function (url) {
                setImagePreview($field, url);
            }).always(function () {
                $field.find('.sms-image-file').val('');
            });
        });

        $(document).on('change', '.sms-featured-file', function () {
            var file = this.files && this.files[0];
            var $box = $(this).closest('.sms-featured-box');
            if (!file) {
                return;
            }
            uploadImageFile(file, $box, $('<input>'), function (url) {
                addFeaturedUrl(url);
            }).always(function () {
                $box.find('.sms-featured-file').val('');
            });
        });

        $('#sms-featured-add-url').on('click', function (e) {
            e.preventDefault();
            var url = ($('#sms-featured-url-input').val() || '').trim();
            if (!url) {
                window.alert('請先貼上圖片網址。');
                return;
            }
            if (!addFeaturedUrl(url)) {
                window.alert('此圖片已在列表中。');
                return;
            }
            $('#sms-featured-url-input').val('');
        });

        $(document).on('click', '.sms-featured-remove', function (e) {
            e.preventDefault();
            var index = parseInt($(this).closest('.sms-featured-item').attr('data-index'), 10);
            if (isNaN(index)) {
                return;
            }
            featuredUrls.splice(index, 1);
            syncFeaturedJson();
        });

        $(document).on('input', '.sms-image-url', function () {
            setImageFieldValue($(this).closest('.sms-image-field'), ($(this).val() || '').trim());
        });

        $(document).on('click', '.sms-image-clear', function (e) {
            e.preventDefault();
            var $field = $(this).closest('.sms-image-field');
            setImageFieldValue($field, '');
            $field.find('.sms-image-file').val('');
            setUploadStatus($field, 'idle');
        });

        function checkShowcaseBoxPositions($featuresWrap) {
            var $wrap = $($featuresWrap);
            var seen = {};
            var hasDup = false;
            $wrap.find('.sms-box-position').each(function () {
                var val = $(this).val() || 'top_left';
                if (seen[val]) {
                    hasDup = true;
                }
                seen[val] = true;
            });
            $wrap.find('.sms-box-dup-warn').toggle(hasDup);
            return !hasDup;
        }

        function checkAllShowcaseBoxPositions() {
            $('.sms-showcase-features').each(function () {
                checkShowcaseBoxPositions(this);
            });
        }

        $(document).on('change', '.sms-box-position', function () {
            checkShowcaseBoxPositions($(this).closest('.sms-showcase-features'));
        });

        $(document).on('click', '.sms-remove-sub', function (e) {
            e.preventDefault();
            var $features = $(this).closest('.sms-showcase-features');
            $(this).closest('.sms-sub-row').remove();
            if ($features.length) {
                checkShowcaseBoxPositions($features);
            }
        });

        $(document).on('click', '.sms-add-showcase', function (e) {
            e.preventDefault();
            var idx = getBlockIndex($(this));
            var $wrap = $(this).closest('.sms-showcase-items');
            var pidx = $wrap.find('.sms-showcase-row').length;
            var html = $('#tmpl-sms-showcase-row').html().replace(/__INDEX__/g, String(idx)).replace(/__PIDX__/g, String(pidx));
            $(this).parent().before(html.trim());
        });

        $(document).on('click', '.sms-add-showcase-feature', function (e) {
            e.preventDefault();
            var idx = getBlockIndex($(this));
            var pidx = $(this).data('product-index');
            var $wrap = $(this).closest('.sms-showcase-features');
            var fidx = $wrap.find('.sms-feature-row').length;
            // 自動帶入尚未使用的角落，減少重疊機率
            var used = {};
            $wrap.find('.sms-box-position').each(function () {
                used[$(this).val() || 'top_left'] = true;
            });
            var slots = ['top_left', 'top_right', 'bottom_left', 'bottom_right'];
            var nextPos = slots.find(function (s) { return !used[s]; }) || 'top_left';
            var html = $('#tmpl-sms-showcase-feature').html()
                .replace(/__INDEX__/g, String(idx))
                .replace(/__PIDX__/g, String(pidx))
                .replace(/__FIDX__/g, String(fidx));
            var $row = $(html.trim());
            $row.find('.sms-box-position').val(nextPos);
            $(this).parent().before($row);
            checkShowcaseBoxPositions($wrap);
        });

        checkAllShowcaseBoxPositions();

        $(document).on('click', '.sms-add-timeline', function (e) {
            e.preventDefault();
            var idx = getBlockIndex($(this));
            var $wrap = $(this).closest('.sms-timeline-items');
            var iidx = $wrap.find('.sms-sub-row').length;
            var html = $('#tmpl-sms-timeline-row').html().replace(/__INDEX__/g, String(idx)).replace(/__IIDX__/g, String(iidx));
            $(this).parent().before(html.trim());
        });

        if ($.fn.wpColorPicker) {
            $('.sms-color-picker').wpColorPicker({
                defaultColor: '#ea580c',
                change: function (_event, ui) {
                    $(this).val(ui.color.toString());
                },
                clear: function () {
                    $(this).val('#ea580c');
                }
            });
        }
    });
    </script>
    <?php
});

/** ---------- REST API ---------- */
add_action('rest_api_init', function () {
    register_rest_route('smasmall/v1', '/series', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function () {
            $items = smasmall_series_get_all_published(false);
            $nav = array_map(static function ($item) {
                $image = '';
                if (!empty($item['featuredImage'])) {
                    $image = (string) $item['featuredImage'];
                } elseif (!empty($item['ogImage'])) {
                    $image = (string) $item['ogImage'];
                }

                $row = [
                    'label' => $item['title'],
                    'slug'  => $item['slug'],
                    'href'  => '/series/' . rawurlencode($item['slug']),
                ];
                if ($image !== '') {
                    $row['image'] = $image;
                }
                if (!empty($item['seoDescription'])) {
                    $row['description'] = (string) $item['seoDescription'];
                }
                return $row;
            }, $items);

            return rest_ensure_response(['items' => $nav, 'series' => $items]);
        },
    ]);

    register_rest_route('smasmall/v1', '/series/(?P<slug>[^/]+)', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function (WP_REST_Request $request) {
            $slug = rawurldecode((string) $request->get_param('slug'));
            $item = smasmall_series_find_by_slug($slug);
            if (!$item) {
                return new WP_Error('not_found', '找不到系列產品', ['status' => 404]);
            }
            return rest_ensure_response($item);
        },
    ]);
});
