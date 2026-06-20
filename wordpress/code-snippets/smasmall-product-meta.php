<?php
/**
 * SMASMALL — WooCommerce 商品擴充欄位（Code Snippets）
 *
 * 商品編輯頁 meta box：
 * - SMASMALL 社群連結（YouTube / Instagram / Facebook）
 * - 情境圖（批次上傳，顯示於 Next.js 商品頁右側）
 * - 前往購買連結（官網「前往購買」按鈕）
 * - 商品頁 Accordion 固定三區（產品規格 / 產品特色 / 售後服務）
 *
 * 左側輪播請使用 WooCommerce 預設「商品圖片 + 商品圖庫」。
 *
 * 內建「強制不壓縮」：關閉 -scaled、JPEG 100%、停用常見優化外掛自動壓圖。
 *
 * 貼到 WordPress「Code Snippets」→ Run everywhere → 啟用
 * 若已有舊版「社群連結」snippet，請停用後改用此檔。
 */

if (!defined('ABSPATH')) {
    exit;
}

/** 防止 Code Snippets 重複載入造成 meta box 出現兩次 */
if (defined('SMASMALL_PRODUCT_META_LOADED')) {
    return;
}
define('SMASMALL_PRODUCT_META_LOADED', true);

const SMASMALL_META_YOUTUBE   = 'smasmall_youtube_urls';
const SMASMALL_META_FACEBOOK  = 'smasmall_facebook_urls';
const SMASMALL_META_INSTAGRAM = 'smasmall_instagram_urls';
const SMASMALL_META_SCENARIO  = 'smasmall_scenario_images';
const SMASMALL_META_PURCHASE   = 'smasmall_purchase_url';
const SMASMALL_META_ACCORDION  = 'smasmall_accordion_items';
const SMASMALL_META_SPECS      = 'smasmall_product_specs';
const SMASMALL_META_HIGHLIGHTS = 'smasmall_product_highlights';
const SMASMALL_META_AFTER_SALES = 'smasmall_after_sales';

/** ---------- 強制不壓縮（全站媒體上傳） ---------- */

/** 關閉長邊 >2560px 自動產生 -scaled 縮圖 */
add_filter('big_image_size_threshold', '__return_false');

/** WordPress 6.x：上傳時不要自動轉 WebP */
add_filter('wp_upload_image_mime_transforms', static function () {
    return [];
});

/** 產生縮圖／編輯器輸出用最高品質 */
add_filter('jpeg_quality', static function () {
    return 100;
});
add_filter('wp_editor_set_quality', static function () {
    return 100;
}, 10, 2);

/** 若主機有 WP_Image_Editor 縮圖，盡量不縮小原圖 */
add_filter('wp_image_maybe_scale_down', static function ($scale_down) {
    return false;
}, 10, 1);

/** 常見圖片優化外掛：略過自動壓縮（有安裝才生效） */
add_filter('smush_skip_image', '__return_true');
add_filter('wp_smush_should_skip_image', '__return_true');
add_filter('shortpixel_skip_auto_processing', '__return_true');
add_filter('shortpixel_skip_image', '__return_true');
add_filter('ewww_image_optimizer_skip_image', '__return_true');
add_filter('ewww_image_optimizer_bypass', '__return_true');
add_filter('imagify_skip_optimization', '__return_true');
add_filter('imagify_auto_optimize_uploaded_images', '__return_false');
add_filter('optimole_skip_image_optimization', '__return_true');

/**
 * 儲存商品時，把情境圖 meta 全部改寫成原圖 URL（修復舊的 -scaled 連結）。
 */
add_action('save_post_product', function ($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    $raw = get_post_meta($post_id, SMASMALL_META_SCENARIO, true);
    if ($raw === '' || $raw === false) {
        return;
    }
    $items = smasmall_decode_scenario_images($raw);
    if (!$items) {
        return;
    }
    $fixed = smasmall_encode_scenario_images($items);
    if ($fixed !== $raw) {
        update_post_meta($post_id, SMASMALL_META_SCENARIO, $fixed);
    }
}, 25);

/**
 * 取得情境圖最佳 URL：優先未壓縮的 original，避免 -scaled 縮圖版。
 */
function smasmall_scenario_image_url(int $attachment_id = 0, string $url = ''): string
{
    if ($attachment_id > 0) {
        if (function_exists('wp_get_original_image_url')) {
            $original = wp_get_original_image_url($attachment_id);
            if (is_string($original) && $original !== '') {
                return esc_url_raw($original);
            }
        }

        $meta = wp_get_attachment_metadata($attachment_id);
        if (!empty($meta['original_image'])) {
            $attached = get_attached_file($attachment_id);
            if ($attached) {
                $original_path = path_join(dirname($attached), $meta['original_image']);
                $uploads = wp_upload_dir();
                if (strpos($original_path, $uploads['basedir']) === 0) {
                    $relative = substr($original_path, strlen($uploads['basedir']));
                    return esc_url_raw($uploads['baseurl'] . str_replace('\\', '/', $relative));
                }
            }
        }

        $full = wp_get_attachment_image_src($attachment_id, 'full');
        if ($full && !empty($full[0])) {
            return esc_url_raw((string) $full[0]);
        }

        $fallback = wp_get_attachment_url($attachment_id);
        if ($fallback) {
            return esc_url_raw((string) $fallback);
        }
    }

    if ($url !== '') {
        $url = preg_replace('/-scaled(\.[^.]+)$/i', '$1', $url);
        return esc_url_raw(trim($url));
    }

    return '';
}

/** ---------- Register meta for REST / WC API ---------- */
add_action('init', function () {
    foreach (
        [
            SMASMALL_META_YOUTUBE  => 'SMASMALL YouTube URLs',
            SMASMALL_META_FACEBOOK => 'SMASMALL Facebook URLs',
            SMASMALL_META_INSTAGRAM => 'SMASMALL Instagram URLs',
            SMASMALL_META_SCENARIO => 'SMASMALL scenario images',
            SMASMALL_META_ACCORDION => 'SMASMALL accordion items',
            SMASMALL_META_SPECS => 'SMASMALL product specs',
            SMASMALL_META_HIGHLIGHTS => 'SMASMALL product highlights',
            SMASMALL_META_AFTER_SALES => 'SMASMALL after-sales service',
        ] as $key => $label
    ) {
        register_post_meta(
            'product',
            $key,
            [
                'type'              => 'string',
                'single'            => true,
                'show_in_rest'      => true,
                'description'       => $label,
                'sanitize_callback' => in_array($key, [SMASMALL_META_YOUTUBE, SMASMALL_META_FACEBOOK, SMASMALL_META_INSTAGRAM], true)
                    ? 'smasmall_sanitize_url_list_meta'
                    : ($key === SMASMALL_META_SPECS || $key === SMASMALL_META_HIGHLIGHTS || $key === SMASMALL_META_AFTER_SALES
                        ? 'smasmall_sanitize_textarea_meta'
                        : 'smasmall_sanitize_json_string_meta'),
                'auth_callback'     => function () {
                    return current_user_can('edit_products');
                },
            ]
        );
    }

    register_post_meta(
        'product',
        SMASMALL_META_PURCHASE,
        [
            'type'              => 'string',
            'single'            => true,
            'show_in_rest'      => true,
            'description'       => 'SMASMALL purchase button URL',
            'sanitize_callback' => 'esc_url_raw',
            'auth_callback'     => function () {
                return current_user_can('edit_products');
            },
        ]
    );
});

function smasmall_json_encode($data): string
{
    return wp_json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

/**
 * 安全將 meta 值轉成陣列（避免 json_decode 收到 array 在 PHP 8 報錯）
 *
 * @param mixed $raw
 * @return array
 */
function smasmall_json_decode_array($raw): array
{
    if (is_array($raw)) {
        return $raw;
    }
    if ($raw instanceof \stdClass) {
        return (array) $raw;
    }
    if (!is_string($raw)) {
        return [];
    }
    $trim = trim($raw);
    if ($trim === '') {
        return [];
    }
    $decoded = json_decode($trim, true);
    if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
        return [];
    }
    return $decoded;
}

/**
 * 修復 JSON 儲存時反斜線被 strip 造成的 u7522u54c1… 亂碼。
 */
function smasmall_repair_unicode_text(string $text): string
{
    if ($text === '' || !preg_match('/(?:\\\\u|u)[0-9a-fA-F]{4}/', $text)) {
        return $text;
    }

    $repaired = preg_replace_callback(
        '/\\\\u([0-9a-fA-F]{4})|u([0-9a-fA-F]{4})/',
        static function ($matches) {
            $hex = $matches[1] !== '' ? $matches[1] : $matches[2];
            $char = mb_chr((int) hexdec($hex), 'UTF-8');
            return ($char !== false && $char !== '') ? $char : $matches[0];
        },
        $text
    );

    return is_string($repaired) ? $repaired : $text;
}

function smasmall_sanitize_json_string_meta($value): string
{
    if (is_array($value)) {
        return smasmall_json_encode($value);
    }
    if ($value instanceof \stdClass) {
        return smasmall_json_encode((array) $value);
    }
    if (!is_string($value)) {
        return '[]';
    }
    return smasmall_json_encode(smasmall_json_decode_array($value));
}

function smasmall_sanitize_textarea_meta($value): string
{
    return smasmall_normalize_accordion_text(
        smasmall_repair_unicode_text(
            sanitize_textarea_field(is_string($value) ? wp_unslash($value) : '')
        )
    );
}

function smasmall_render_accordion_textarea(string $label, string $name, string $value, string $placeholder = ''): void
{
    ?>
    <div class="smasmall-accordion-fixed-field">
        <label class="smasmall-accordion-label"><strong><?php echo esc_html($label); ?></strong></label>
        <p class="description">每行一項，或使用「•」開頭。官網會以條列式顯示。</p>
        <textarea
            class="widefat smasmall-accordion-fixed-textarea"
            name="<?php echo esc_attr($name); ?>"
            rows="6"
            placeholder="<?php echo esc_attr($placeholder); ?>"
        ><?php echo esc_textarea($value); ?></textarea>
    </div>
    <?php
}

/**
 * 正規化並驗證社群影片／貼文 URL（支援 YouTube 一般影片／Shorts、Instagram Reels、Facebook）
 */
function smasmall_sanitize_social_url(string $url): string
{
    $url = trim($url);
    if ($url === '') {
        return '';
    }

    // 補上缺少的 scheme
    if (!preg_match('#^https?://#i', $url)) {
        $url = 'https://' . ltrim($url, '/');
    }

    // youtube.com → www.youtube.com（esc_url_raw 對無 www 有時會過濾）
    $url = preg_replace('#^https://youtube\.com#i', 'https://www.youtube.com', $url);
    $url = preg_replace('#^http://youtube\.com#i', 'https://www.youtube.com', $url);

    $clean = esc_url_raw($url);
    if ($clean !== '') {
        return $clean;
    }

    // esc_url_raw 失敗時，對已知 YouTube / Instagram / Facebook 格式做 fallback
    if (preg_match('#^https://(?:www\.)?youtube\.com/(?:watch\?v=|embed/|shorts/|live/)[^\s"\']+#i', $url)) {
        return $url;
    }
    if (preg_match('#^https://youtu\.be/[A-Za-z0-9_-]{11}[^\s"\']*#i', $url)) {
        return $url;
    }
    if (preg_match('#^https://(?:www\.)?instagram\.com/(?:p|reel|tv)/[A-Za-z0-9_-]+[^\s"\']*#i', $url)) {
        return $url;
    }
    if (preg_match('#^https://(?:www\.)?facebook\.com/[^\s"\']+#i', $url)) {
        return $url;
    }

    return '';
}

function smasmall_sanitize_url_array(array $list): array
{
    $out = [];
    foreach ($list as $item) {
        $url = smasmall_sanitize_social_url(is_string($item) ? $item : '');
        if ($url !== '') {
            $out[] = $url;
        }
    }
    return array_values(array_unique($out));
}

/** REST / WC API 儲存 YouTube、Instagram、Facebook URL 列表用 */
function smasmall_sanitize_url_list_meta($value): string
{
    if (is_array($value)) {
        return smasmall_json_encode(smasmall_sanitize_url_array($value));
    }
    if ($value instanceof \stdClass) {
        return smasmall_json_encode(smasmall_sanitize_url_array((array) $value));
    }
    if (!is_string($value)) {
        return '[]';
    }
    $trim = trim($value);
    if ($trim === '') {
        return '[]';
    }

    $decoded = smasmall_json_decode_array($trim);
    if ($decoded !== []) {
        return smasmall_json_encode(smasmall_sanitize_url_array($decoded));
    }

    // 單一 URL 字串（舊格式相容）
    $one = smasmall_sanitize_social_url($trim);
    return $one !== '' ? smasmall_json_encode([$one]) : '[]';
}

function smasmall_is_youtube_shorts_url(string $url): bool
{
    return (bool) preg_match('#youtube\.com/shorts/#i', $url);
}

function smasmall_decode_url_list($raw): array
{
    if (is_array($raw)) {
        $list = $raw;
    } elseif (is_string($raw) && $raw !== '') {
        $decoded = smasmall_json_decode_array($raw);
        $list = $decoded !== [] ? $decoded : preg_split('/\r\n|\r|\n/', $raw);
    } else {
        $list = [];
    }

    $out = [];
    foreach ($list as $item) {
        if (is_array($item) && isset($item['url'])) {
            $item = $item['url'];
        }
        $url = is_string($item) ? trim($item) : '';
        if ($url === '') {
            continue;
        }
        $clean = smasmall_sanitize_social_url($url);
        if ($clean !== '') {
            $out[] = $clean;
        }
    }

    return array_values(array_unique($out));
}

function smasmall_decode_scenario_images($raw): array
{
    $list = smasmall_json_decode_array($raw);

    $out = [];
    foreach ($list as $item) {
        if (is_string($item)) {
            $url = esc_url_raw(trim($item));
            if ($url !== '') {
                $out[] = ['id' => 0, 'url' => $url];
            }
            continue;
        }
        if (!is_array($item)) {
            continue;
        }
        $id  = isset($item['id']) ? (int) $item['id'] : 0;
        $url = isset($item['url']) ? trim((string) $item['url']) : '';
        $url = smasmall_scenario_image_url($id, $url);
        if ($url === '') {
            continue;
        }
        $out[] = ['id' => $id, 'url' => $url];
    }

    return $out;
}

function smasmall_encode_scenario_images(array $images): string
{
    $out = [];
    foreach ($images as $row) {
        if (!is_array($row)) {
            continue;
        }
        $id  = isset($row['id']) ? (int) $row['id'] : 0;
        $url = isset($row['url']) ? trim((string) $row['url']) : '';
        $url = smasmall_scenario_image_url($id, $url);
        if ($url === '') {
            continue;
        }
        $out[] = [
            'id'  => $id,
            'url' => $url,
        ];
    }
    return smasmall_json_encode($out);
}

function smasmall_decode_accordion_items($raw): array
{
    $list = smasmall_json_decode_array($raw);

    $out = [];
    foreach ($list as $item) {
        if (!is_array($item)) {
            continue;
        }
        $title = smasmall_repair_unicode_text(
            sanitize_text_field((string) ($item['title'] ?? ''))
        );
        $content = smasmall_repair_unicode_text(
            sanitize_textarea_field((string) ($item['content'] ?? ''))
        );
        if ($title === '' || $content === '') {
            continue;
        }
        $out[] = [
            'title'   => $title,
            'content' => $content,
        ];
    }

    return $out;
}

function smasmall_encode_accordion_items($items): string
{
    return smasmall_json_encode(smasmall_decode_accordion_items($items));
}

/** 修復舊版 Accordion 內容中遺失的換行（n• → 換行 + •） */
function smasmall_normalize_accordion_text(string $text): string
{
    $text = str_replace('\\n', "\n", $text);
    $text = preg_replace('/([^\n])n(?=•)/u', "$1\n", $text);
    $text = preg_replace('/n(\s{2,})/u', "\n$1", $text);
    return trim($text);
}

function smasmall_find_legacy_accordion_content(array $accordion, array $keywords): string
{
    foreach ($accordion as $item) {
        foreach ($keywords as $keyword) {
            if ($keyword !== '' && mb_strpos($item['title'], $keyword) !== false) {
                return smasmall_normalize_accordion_text($item['content']);
            }
        }
    }
    return '';
}

/** 固定三區：優先讀新欄位，空白時從舊版 Accordion 依標題關鍵字帶入 */
function smasmall_resolve_fixed_accordion_field(string $stored, array $legacy, array $keywords): string
{
    $stored = trim($stored);
    if ($stored !== '') {
        return smasmall_normalize_accordion_text($stored);
    }
    return smasmall_find_legacy_accordion_content($legacy, $keywords);
}

/** ---------- Meta box（僅註冊一次） ---------- */
add_action('add_meta_boxes', function () {
    add_meta_box(
        'smasmall-product-meta-v2',
        'SMASMALL 商品擴充',
        'smasmall_render_product_meta_box',
        'product',
        'normal',
        'high'
    );
}, 10);

function smasmall_render_product_meta_box(\WP_Post $post): void
{
    wp_nonce_field('smasmall_product_meta_save', 'smasmall_product_meta_nonce');

    $youtube      = smasmall_decode_url_list(get_post_meta($post->ID, SMASMALL_META_YOUTUBE, true));
    $facebook     = smasmall_decode_url_list(get_post_meta($post->ID, SMASMALL_META_FACEBOOK, true));
    $instagram    = smasmall_decode_url_list(get_post_meta($post->ID, SMASMALL_META_INSTAGRAM, true));
    $scenario     = smasmall_decode_scenario_images(get_post_meta($post->ID, SMASMALL_META_SCENARIO, true));
    $purchase_url = esc_url((string) get_post_meta($post->ID, SMASMALL_META_PURCHASE, true));
    $legacy_accordion = smasmall_decode_accordion_items(get_post_meta($post->ID, SMASMALL_META_ACCORDION, true));
    $product_specs = smasmall_resolve_fixed_accordion_field(
        (string) get_post_meta($post->ID, SMASMALL_META_SPECS, true),
        $legacy_accordion,
        ['規格']
    );
    $product_highlights = smasmall_resolve_fixed_accordion_field(
        (string) get_post_meta($post->ID, SMASMALL_META_HIGHLIGHTS, true),
        $legacy_accordion,
        ['特色']
    );
    $after_sales = smasmall_resolve_fixed_accordion_field(
        (string) get_post_meta($post->ID, SMASMALL_META_AFTER_SALES, true),
        $legacy_accordion,
        ['售後', '服務']
    );
    ?>
    <div class="smasmall-product-meta">
        <input type="hidden" name="smasmall_social_sync" value="1" />
        <p class="description" style="margin-top:0;">
            左側商品輪播請使用右側欄 WooCommerce「商品圖片 / 商品圖庫」。下方「情境圖」會顯示在官網商品頁右側。
        </p>

        <div class="smasmall-meta-section">
            <h4 class="smasmall-meta-heading">YouTube</h4>
            <p class="description">貼上一般影片（watch?v=）或 Shorts 連結，可新增多筆。官網會自動區分橫式影片與直式 Shorts。</p>
            <div class="smasmall-url-add-row">
                <input type="url" class="widefat smasmall-url-input" data-platform="youtube" placeholder="https://www.youtube.com/watch?v=... 或 https://youtube.com/shorts/..." />
                <button type="button" class="button smasmall-add-url" data-platform="youtube">新增連結</button>
            </div>
            <ul class="smasmall-url-list" id="smasmall-youtube-list" data-platform="youtube">
                <?php foreach ($youtube as $i => $url) : ?>
                    <li class="smasmall-url-item">
                        <input type="hidden" name="smasmall_youtube_urls[]" value="<?php echo esc_attr($url); ?>" />
                        <a href="<?php echo esc_url($url); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html($url); ?></a>
                        <button type="button" class="button-link-delete smasmall-remove-url">移除</button>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>

        <div class="smasmall-meta-section">
            <h4 class="smasmall-meta-heading">Instagram</h4>
            <p class="description">貼上 Instagram Reels 或貼文連結，可新增多筆。官網會以直式 Reels 或橫式貼文嵌入顯示。</p>
            <div class="smasmall-url-add-row">
                <input type="url" class="widefat smasmall-url-input" data-platform="instagram" placeholder="https://www.instagram.com/reel/... 或 https://www.instagram.com/p/..." />
                <button type="button" class="button smasmall-add-url" data-platform="instagram">新增連結</button>
            </div>
            <ul class="smasmall-url-list" id="smasmall-instagram-list" data-platform="instagram">
                <?php foreach ($instagram as $i => $url) : ?>
                    <li class="smasmall-url-item">
                        <input type="hidden" name="smasmall_instagram_urls[]" value="<?php echo esc_attr($url); ?>" />
                        <a href="<?php echo esc_url($url); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html($url); ?></a>
                        <button type="button" class="button-link-delete smasmall-remove-url">移除</button>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>

        <div class="smasmall-meta-section">
            <h4 class="smasmall-meta-heading">Facebook</h4>
            <p class="description">貼上 Facebook 貼文或 Reels 連結，可新增多筆。</p>
            <div class="smasmall-url-add-row">
                <input type="url" class="widefat smasmall-url-input" data-platform="facebook" placeholder="https://www.facebook.com/..." />
                <button type="button" class="button smasmall-add-url" data-platform="facebook">新增連結</button>
            </div>
            <ul class="smasmall-url-list" id="smasmall-facebook-list" data-platform="facebook">
                <?php foreach ($facebook as $i => $url) : ?>
                    <li class="smasmall-url-item">
                        <input type="hidden" name="smasmall_facebook_urls[]" value="<?php echo esc_attr($url); ?>" />
                        <a href="<?php echo esc_url($url); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html($url); ?></a>
                        <button type="button" class="button-link-delete smasmall-remove-url">移除</button>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>

        <div class="smasmall-meta-section smasmall-accordion-fixed-section">
            <h4 class="smasmall-meta-heading">商品頁 Accordion（固定三區）</h4>
            <p class="description">官網商品頁右側依序顯示：產品規格 → 產品特色 → 售後服務。每行一項或使用「•」開頭，官網會自動條列式渲染。</p>
            <?php
            smasmall_render_accordion_textarea(
                '產品規格',
                'smasmall_product_specs',
                $product_specs,
                "•刮鬍刀型號：S1-SHAVER\n•顏色：銀\n•防水功能：IPX7"
            );
            smasmall_render_accordion_textarea(
                '產品特色',
                'smasmall_product_highlights',
                $product_highlights,
                "•精緻小巧的黃金比例，外型時尚\n•全機採用貴金屬鋅合金材質"
            );
            smasmall_render_accordion_textarea(
                '售後服務',
                'smasmall_after_sales',
                $after_sales,
                "•保固：12個月（主機）\n•全館消費滿 NT$1,500 即享免運"
            );
            ?>
        </div>

        <div class="smasmall-meta-section smasmall-scenario-section">
            <h4 class="smasmall-meta-heading">情境圖</h4>
            <p class="description">批次上傳生活情境圖。本站已<strong>強制不壓縮</strong>（關閉 -scaled、JPEG 100%、略過 Smush 等優化外掛）。請選原圖檔名（勿選 *-scaled.jpg）。</p>
            <input type="hidden" id="smasmall-scenario-json" name="smasmall_scenario_images" value="<?php echo esc_attr(smasmall_encode_scenario_images($scenario)); ?>" />
            <p>
                <button type="button" class="button button-secondary" id="smasmall-add-scenario-images">
                    <span class="dashicons dashicons-images-alt2" style="margin-top:3px;"></span>
                    批次新增情境圖
                </button>
            </p>
            <ul class="smasmall-scenario-list" id="smasmall-scenario-list">
                <?php foreach ($scenario as $row) : ?>
                    <li class="smasmall-scenario-item" data-id="<?php echo esc_attr((string) $row['id']); ?>" data-url="<?php echo esc_attr($row['url']); ?>">
                        <span class="smasmall-scenario-drag dashicons dashicons-move"></span>
                        <img src="<?php echo esc_url($row['url']); ?>" alt="" />
                        <button type="button" class="button-link-delete smasmall-remove-scenario">移除</button>
                    </li>
                <?php endforeach; ?>
            </ul>
            <p class="description smasmall-scenario-empty" <?php echo $scenario ? 'style="display:none;"' : ''; ?>>尚未上傳情境圖。</p>
        </div>

        <div class="smasmall-meta-section">
            <h4 class="smasmall-meta-heading">前往購買連結</h4>
            <p class="description">官網商品頁「前往購買」按鈕連結，可填 PChome、蝦皮或 WooCommerce 結帳頁等外部網址。</p>
            <input
                type="url"
                class="widefat"
                name="smasmall_purchase_url"
                value="<?php echo esc_attr($purchase_url); ?>"
                placeholder="https://24h.pchome.com.tw/prod/..."
            />
        </div>
    </div>
    <?php
}

add_action('save_post_product', function ($post_id) {
    if (!isset($_POST['smasmall_product_meta_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['smasmall_product_meta_nonce'])), 'smasmall_product_meta_save')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $youtube = [];
    if (isset($_POST['smasmall_youtube_urls']) && is_array($_POST['smasmall_youtube_urls'])) {
        foreach (wp_unslash($_POST['smasmall_youtube_urls']) as $url) {
            $clean = smasmall_sanitize_social_url((string) $url);
            if ($clean !== '') {
                $youtube[] = $clean;
            }
        }
    }

    $facebook = [];
    if (isset($_POST['smasmall_facebook_urls']) && is_array($_POST['smasmall_facebook_urls'])) {
        foreach (wp_unslash($_POST['smasmall_facebook_urls']) as $url) {
            $clean = smasmall_sanitize_social_url((string) $url);
            if ($clean !== '') {
                $facebook[] = $clean;
            }
        }
    }

    $instagram = [];
    if (isset($_POST['smasmall_instagram_urls']) && is_array($_POST['smasmall_instagram_urls'])) {
        foreach (wp_unslash($_POST['smasmall_instagram_urls']) as $url) {
            $clean = smasmall_sanitize_social_url((string) $url);
            if ($clean !== '') {
                $instagram[] = $clean;
            }
        }
    }

    $scenario_raw = isset($_POST['smasmall_scenario_images']) ? wp_unslash($_POST['smasmall_scenario_images']) : '[]';
    $scenario = smasmall_decode_scenario_images($scenario_raw);

    $specs = smasmall_sanitize_textarea_meta($_POST['smasmall_product_specs'] ?? '');
    $highlights = smasmall_sanitize_textarea_meta($_POST['smasmall_product_highlights'] ?? '');
    $after_sales = smasmall_sanitize_textarea_meta($_POST['smasmall_after_sales'] ?? '');

    update_post_meta($post_id, SMASMALL_META_YOUTUBE, smasmall_json_encode(array_values(array_unique($youtube))));
    update_post_meta($post_id, SMASMALL_META_FACEBOOK, smasmall_json_encode(array_values(array_unique($facebook))));
    update_post_meta($post_id, SMASMALL_META_INSTAGRAM, smasmall_json_encode(array_values(array_unique($instagram))));
    update_post_meta($post_id, SMASMALL_META_SCENARIO, smasmall_encode_scenario_images($scenario));
    update_post_meta($post_id, SMASMALL_META_SPECS, $specs);
    update_post_meta($post_id, SMASMALL_META_HIGHLIGHTS, $highlights);
    update_post_meta($post_id, SMASMALL_META_AFTER_SALES, $after_sales);
    // 舊版 Accordion 已整合至固定三區，儲存後清除避免重複
    update_post_meta($post_id, SMASMALL_META_ACCORDION, '[]');

    $purchase_url = isset($_POST['smasmall_purchase_url'])
        ? esc_url_raw(trim((string) wp_unslash($_POST['smasmall_purchase_url'])))
        : '';
    update_post_meta($post_id, SMASMALL_META_PURCHASE, $purchase_url);
}, 20);

/** ---------- Admin assets ---------- */
add_action('admin_enqueue_scripts', function ($hook) {
    if (!in_array($hook, ['post.php', 'post-new.php'], true)) {
        return;
    }
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || $screen->post_type !== 'product') {
        return;
    }
    wp_enqueue_media();
    wp_enqueue_script('jquery-ui-sortable');
});

add_action('admin_head', function () {
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || $screen->post_type !== 'product') {
        return;
    }
    ?>
    <style>
        .smasmall-product-meta .smasmall-meta-section { margin: 18px 0 0; padding-top: 18px; border-top: 1px solid #dcdcde; }
        .smasmall-product-meta .smasmall-meta-section:first-of-type { border-top: 0; padding-top: 0; }
        .smasmall-product-meta .smasmall-meta-heading { margin: 0 0 8px; font-size: 13px; }
        .smasmall-url-add-row { display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: center; margin-bottom: 8px; }
        .smasmall-url-list { margin: 0; padding: 0; list-style: none; }
        .smasmall-url-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f0f0f1; }
        .smasmall-url-item a { flex: 1; word-break: break-all; }
        .smasmall-scenario-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
            gap: 10px;
            margin: 12px 0 0;
            padding: 0;
            list-style: none;
        }
        .smasmall-scenario-item {
            position: relative;
            border: 1px solid #dcdcde;
            border-radius: 6px;
            background: #fff;
            padding: 6px;
        }
        .smasmall-scenario-item img { display: block; width: 100%; height: 72px; object-fit: cover; border-radius: 4px; }
        .smasmall-scenario-drag { cursor: grab; color: #787c82; margin-bottom: 4px; }
        .smasmall-remove-scenario { margin-top: 4px; }
        .smasmall-scenario-item.ui-sortable-helper { box-shadow: 0 8px 24px rgba(0,0,0,.12); }
        .smasmall-accordion-fixed-field { margin-bottom: 16px; }
        .smasmall-accordion-fixed-field:last-child { margin-bottom: 0; }
        .smasmall-accordion-fixed-textarea { font-family: inherit; min-height: 120px; }
        .smasmall-accordion-label { display: block; font-weight: 600; margin: 0 0 6px; font-size: 12px; }
    </style>
    <?php
});

add_action('admin_footer', function () {
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || $screen->post_type !== 'product') {
        return;
    }
    ?>
    <script>
    jQuery(function ($) {
        function smasmallPickScenarioUrl(data) {
            var id = data.id || 0;
            var url = data.originalImageURL || data.originalUrl || '';
            if (!url && data.sizes && data.sizes.full && data.sizes.full.url) {
                url = data.sizes.full.url;
            }
            if (!url) {
                url = data.url || '';
            }
            url = url.replace(/-scaled(\.(jpe?g|png|gif|webp))/i, '$1');
            return { id: id, url: url };
        }

        function syncScenarioJson() {
            var rows = [];
            $('#smasmall-scenario-list .smasmall-scenario-item').each(function () {
                rows.push({
                    id: parseInt($(this).attr('data-id') || '0', 10) || 0,
                    url: $(this).attr('data-url') || ''
                });
            });
            $('#smasmall-scenario-json').val(JSON.stringify(rows));
            $('.smasmall-scenario-empty').toggle(rows.length === 0);
        }

        function appendUrl(platform, url) {
            url = (url || '').trim();
            if (!url) return;
            var listMap = {
                youtube: { list: '#smasmall-youtube-list', name: 'smasmall_youtube_urls[]' },
                instagram: { list: '#smasmall-instagram-list', name: 'smasmall_instagram_urls[]' },
                facebook: { list: '#smasmall-facebook-list', name: 'smasmall_facebook_urls[]' }
            };
            var config = listMap[platform];
            if (!config) return;
            var $list = $(config.list);
            var name = config.name;
            var duplicate = false;
            $list.find('input[type=hidden]').each(function () {
                if ($(this).val() === url) duplicate = true;
            });
            if (duplicate) return;
            var $li = $('<li class="smasmall-url-item"></li>');
            $li.append($('<input>', { type: 'hidden', name: name, value: url }));
            $li.append($('<a>', { href: url, target: '_blank', rel: 'noopener noreferrer', text: url }));
            $li.append($('<button>', { type: 'button', class: 'button-link-delete smasmall-remove-url', text: '移除' }));
            $list.append($li);
        }

        /** 儲存前把輸入框中尚未按「新增連結」的 URL 一併寫入 hidden input */
        function flushPendingUrls() {
            $('.smasmall-url-input').each(function () {
                var platform = $(this).data('platform');
                var url = ($(this).val() || '').trim();
                if (!url) return;
                appendUrl(platform, url);
                $(this).val('');
            });
        }

        $('.smasmall-add-url').on('click', function () {
            var platform = $(this).data('platform');
            var $input = $('.smasmall-url-input[data-platform="' + platform + '"]');
            var url = ($input.val() || '').trim();
            if (!url) {
                alert('請先貼上連結。');
                return;
            }
            appendUrl(platform, url);
            $input.val('');
        });

        $(document).on('click', '.smasmall-remove-url', function (e) {
            e.preventDefault();
            $(this).closest('.smasmall-url-item').remove();
        });

        $('#post').on('submit', function () {
            flushPendingUrls();
            syncScenarioJson();
        });

        $('#smasmall-add-scenario-images').on('click', function (e) {
            e.preventDefault();
            if (typeof wp === 'undefined' || !wp.media) {
                alert('媒體庫尚未載入，請重新整理頁面後再試。');
                return;
            }
            var frame = wp.media({
                title: '批次新增情境圖',
                button: { text: '加入情境圖' },
                multiple: true,
                library: { type: 'image' }
            });
            frame.on('select', function () {
                frame.state().get('selection').each(function (attachment) {
                    var data = attachment.toJSON();
                    var picked = smasmallPickScenarioUrl(data);
                    var url = picked.url;
                    if (!url) return;
                    var id = picked.id || 0;
                    var $li = $('<li class="smasmall-scenario-item"></li>');
                    $li.attr('data-id', id);
                    $li.attr('data-url', url);
                    $li.append('<span class="smasmall-scenario-drag dashicons dashicons-move"></span>');
                    $li.append($('<img>', { src: url, alt: '' }));
                    $li.append($('<button>', { type: 'button', class: 'button-link-delete smasmall-remove-scenario', text: '移除' }));
                    $('#smasmall-scenario-list').append($li);
                });
                syncScenarioJson();
            });
            frame.open();
        });

        $(document).on('click', '.smasmall-remove-scenario', function (e) {
            e.preventDefault();
            $(this).closest('.smasmall-scenario-item').remove();
            syncScenarioJson();
        });

        if ($.fn.sortable) {
            $('#smasmall-scenario-list').sortable({
                handle: '.smasmall-scenario-drag',
                update: syncScenarioJson
            });
        }

        syncScenarioJson();
    });
    </script>
    <?php
});

/** ---------- WooCommerce REST：輸出 Yoast SEO 供 Next.js 商品頁 metadata ---------- */
add_filter('woocommerce_rest_prepare_product_object', function ($response, $product, $request) {
    if (!($product instanceof \WC_Product)) {
        return $response;
    }

    $post_id = $product->get_id();
    $data = $response->get_data();
    $data['yoast_seo'] = [
        'title'          => (string) get_post_meta($post_id, '_yoast_wpseo_title', true),
        'description'    => (string) get_post_meta($post_id, '_yoast_wpseo_metadesc', true),
        'focus_keyword'  => (string) get_post_meta($post_id, '_yoast_wpseo_focuskw', true),
    ];
    $response->set_data($data);

    return $response;
}, 10, 3);
