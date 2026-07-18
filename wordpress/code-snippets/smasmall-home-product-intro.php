/**
 * SMASMALL — 首頁產品介紹區塊（Code Snippets）
 *
 * 對應前台：src/components/S3GroomingPrecision.jsx
 *
 * - 左側選單：首頁產品介紹
 * - 管理：左下規格、熱點特色（資訊卡縮圖／熱點位置／放大倍率）、副標
 * - 前台行為：
 *   · 規格（specs）→ 左下「產品資訊」卡片（無上一個／下一個）
 *   · 特色（features）→ 固定單張背景；所有白點一開始全部顯示並閃爍；點擊白點依 bgScale 放大，右下彈出資訊卡（縮圖用該特色 image）
 * - 公開 REST：GET /wp-json/smasmall/v1/home-product-intro
 *
 * 貼到 WordPress「Code Snippets」→ Run everywhere → 啟用
 */

if (!defined('ABSPATH')) {
    exit;
}

const SMASMALL_HOME_PRODUCT_INTRO_OPTION = 'smasmall_home_product_intro';

function smasmall_home_product_intro_sanitize_image_url($url): string
{
    $url = trim((string) $url);
    if ($url === '') {
        return '';
    }
    // 允許站內相對路徑（例如 /images/...）
    if (isset($url[0]) && $url[0] === '/') {
        return sanitize_text_field($url);
    }
    return esc_url_raw($url);
}

/**
 * 接收後台裁切彈窗（Cropper.js）依原圖解析度輸出的 16:9 圖片，
 * 存進媒體庫並回傳 URL；不強制縮放像素尺寸。
 */
add_action('wp_ajax_smasmall_shpi_crop_upload', function () {
    check_ajax_referer('smasmall_shpi_crop', 'nonce');

    if (!current_user_can('upload_files')) {
        wp_send_json_error(['message' => '沒有上傳權限。'], 403);
    }
    if (empty($_FILES['image']) || !is_array($_FILES['image'])) {
        wp_send_json_error(['message' => '未收到圖片。'], 400);
    }

    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';
    require_once ABSPATH . 'wp-admin/includes/media.php';

    $attachment_id = media_handle_upload('image', 0);
    if (is_wp_error($attachment_id)) {
        wp_send_json_error(['message' => $attachment_id->get_error_message()], 500);
    }

    $url = wp_get_attachment_url($attachment_id);
    if (!$url) {
        wp_send_json_error(['message' => '無法取得圖片網址。'], 500);
    }

    wp_send_json_success(['url' => esc_url_raw($url), 'id' => (int) $attachment_id]);
});

function smasmall_home_product_intro_defaults(): array
{
    return [
        'enabled'         => true,
        'backgroundImage' => '',
        'subtitle'        => '產品特寫',
        'title'           => '磁吸防塵保護蓋',
        'description'     => '磁吸式上蓋一貼即合，隔絕灰塵、守護刀頭，收納潔淨衛生。',
        'specs'           => [
            ['label' => '適用機型', 'value' => 'S3 旗艦版刮鬍刀'],
            ['label' => '核心功能', 'value' => '9200 rpm 強勁靜音電機'],
            ['label' => '磁吸結構', 'value' => '一貼即合'],
            ['label' => '機身材質', 'value' => '鋅合金壓鑄'],
        ],
        'features'        => [
            [
                'id'          => 'lid',
                'title'       => '磁吸防塵保護蓋',
                'description' => '磁吸式上蓋一貼即合，隔絕灰塵、守護刀頭，收納潔淨衛生。',
                'image'       => '',
                'top'         => '34%',
                'left'        => '52%',
                'bgScale'     => 2.4,
            ],
            [
                'id'          => 'battery',
                'title'       => '450mAh 高能鋰電池',
                'description' => '大容量鋰電池，60 分鐘即可快速充滿，長效續航一次到位。',
                'image'       => '',
                'top'         => '62%',
                'left'        => '48%',
                'bgScale'     => 2.2,
            ],
            [
                'id'          => 'switch',
                'title'       => '專利防水推式開關',
                'description' => '獨家防水推動設計，有效防止誤觸，操作更安心。',
                'image'       => '',
                'top'         => '48%',
                'left'        => '50%',
                'bgScale'     => 2.6,
            ],
            [
                'id'          => 'motor',
                'title'       => '9200 rpm 強勁靜音電機',
                'description' => '每分鐘 9200 轉高速運轉，動力強勁、噪音低沉，刮鬍俐落不擾人。',
                'image'       => '',
                'top'         => '42%',
                'left'        => '51%',
                'bgScale'     => 2.3,
            ],
            [
                'id'          => 'blade',
                'title'       => '開放式雙環刀網',
                'description' => '開放式雙環結構精準導入鬍鬚，捕鬚更全面、刮除更高效。',
                'image'       => '',
                'top'         => '28%',
                'left'        => '53%',
                'bgScale'     => 2.5,
            ],
        ],
    ];
}

function smasmall_home_product_intro_get(): array
{
    $saved = get_option(SMASMALL_HOME_PRODUCT_INTRO_OPTION, false);
    // 尚未儲存過：後台表單顯示預設值，但 API 不輸出（見 format_for_api）
    if ($saved === false || !is_array($saved)) {
        return smasmall_home_product_intro_defaults();
    }

    $defaults = smasmall_home_product_intro_defaults();
    $merged = array_merge($defaults, $saved);

    if (!is_array($merged['specs'] ?? null)) {
        $merged['specs'] = [];
    }
    if (!is_array($merged['features'] ?? null)) {
        $merged['features'] = [];
    }

    return $merged;
}

function smasmall_home_product_intro_sanitize_specs($input): array
{
    if (!is_array($input)) {
        return [];
    }

    $out = [];
    foreach ($input as $row) {
        if (!is_array($row)) {
            continue;
        }
        $label = sanitize_text_field($row['label'] ?? '');
        $value = sanitize_text_field($row['value'] ?? '');
        if ($label === '' && $value === '') {
            continue;
        }
        $out[] = [
            'label' => $label !== '' ? $label : '規格',
            'value' => $value,
        ];
        if (count($out) >= 4) {
            break;
        }
    }

    return $out;
}

function smasmall_home_product_intro_sanitize_features($input): array
{
    if (!is_array($input)) {
        return [];
    }

    $defaults = smasmall_home_product_intro_defaults()['features'];
    $out = [];

    foreach ($input as $index => $row) {
        if (!is_array($row)) {
            continue;
        }

        $title = sanitize_text_field($row['title'] ?? '');
        $description = sanitize_textarea_field($row['description'] ?? '');
        $image = smasmall_home_product_intro_sanitize_image_url($row['image'] ?? '');
        if ($title === '' && $description === '' && $image === '') {
            continue;
        }

        $fallback = $defaults[$index] ?? $defaults[0] ?? [];
        $id = sanitize_key((string) ($row['id'] ?? ''));
        if ($id === '') {
            $id = sanitize_key((string) ($fallback['id'] ?? ('feature-' . (count($out) + 1))));
        }

        $top = sanitize_text_field((string) ($row['top'] ?? ($fallback['top'] ?? '50%')));
        $left = sanitize_text_field((string) ($row['left'] ?? ($fallback['left'] ?? '50%')));
        if ($top !== '' && strpos($top, '%') === false) {
            $top .= '%';
        }
        if ($left !== '' && strpos($left, '%') === false) {
            $left .= '%';
        }

        $bg_scale = isset($row['bgScale']) ? (float) $row['bgScale'] : (float) ($fallback['bgScale'] ?? 2.4);
        if ($bg_scale < 1) {
            $bg_scale = 1;
        }
        if ($bg_scale > 5) {
            $bg_scale = 5;
        }

        $out[] = [
            'id'          => $id,
            'title'       => $title !== '' ? $title : (string) ($fallback['title'] ?? '特色'),
            'description' => $description,
            'image'       => $image,
            'top'         => $top !== '' ? $top : '50%',
            'left'        => $left !== '' ? $left : '50%',
            'bgScale'     => round($bg_scale, 2),
        ];

        if (count($out) >= 8) {
            break;
        }
    }

    return $out;
}

function smasmall_home_product_intro_sanitize($input): array
{
    if (!is_array($input)) {
        return smasmall_home_product_intro_defaults();
    }

    $defaults = smasmall_home_product_intro_defaults();

    return [
        'enabled'         => !empty($input['enabled']),
        'backgroundImage' => smasmall_home_product_intro_sanitize_image_url($input['backgroundImage'] ?? ''),
        'subtitle'        => sanitize_text_field($input['subtitle'] ?? $defaults['subtitle']),
        'title'           => sanitize_text_field($input['title'] ?? $defaults['title']),
        'description'     => sanitize_textarea_field($input['description'] ?? $defaults['description']),
        'specs'           => smasmall_home_product_intro_sanitize_specs($input['specs'] ?? []),
        'features'        => smasmall_home_product_intro_sanitize_features($input['features'] ?? []),
    ];
}

function smasmall_home_product_intro_format_for_api(array $data): ?array
{
    // 從未儲存過後台 → 前台不顯示預設假資料
    $raw = get_option(SMASMALL_HOME_PRODUCT_INTRO_OPTION, false);
    if ($raw === false || !is_array($raw)) {
        return null;
    }

    if (empty($data['enabled'])) {
        return null;
    }

    if (trim((string) ($data['title'] ?? '')) === '') {
        return null;
    }

    $specs = [];
    foreach (($data['specs'] ?? []) as $row) {
        if (!is_array($row)) {
            continue;
        }
        $label = sanitize_text_field($row['label'] ?? '');
        $value = sanitize_text_field($row['value'] ?? '');
        if ($value === '') {
            continue;
        }
        $specs[] = [
            'label' => $label !== '' ? $label : '規格',
            'value' => $value,
        ];
    }

    $features = [];
    foreach (($data['features'] ?? []) as $row) {
        if (!is_array($row)) {
            continue;
        }
        $title = sanitize_text_field($row['title'] ?? '');
        if ($title === '') {
            continue;
        }
        $features[] = [
            'id'          => sanitize_key((string) ($row['id'] ?? uniqid('feature_', false))),
            'title'       => $title,
            'description' => sanitize_textarea_field($row['description'] ?? ''),
            'image'       => smasmall_home_product_intro_sanitize_image_url($row['image'] ?? ''),
            'top'         => sanitize_text_field((string) ($row['top'] ?? '50%')),
            'left'        => sanitize_text_field((string) ($row['left'] ?? '50%')),
            'bgScale'     => (float) ($row['bgScale'] ?? 2.4),
        ];
    }

    // 規格與特色都沒填 → 前台不顯示
    if (empty($specs) && empty($features)) {
        return null;
    }

    return [
        'backgroundImage' => smasmall_home_product_intro_sanitize_image_url($data['backgroundImage'] ?? ''),
        'subtitle'        => sanitize_text_field($data['subtitle'] ?? ''),
        'title'           => sanitize_text_field($data['title'] ?? ''),
        'description'     => sanitize_textarea_field($data['description'] ?? ''),
        'specs'           => $specs,
        'features'        => $features,
    ];
}

add_action('admin_menu', function () {
    add_menu_page(
        '首頁產品介紹',
        '首頁產品介紹',
        'read',
        'smasmall-home-product-intro',
        'smasmall_home_product_intro_render_page',
        'dashicons-products',
        61
    );
});

add_action('admin_post_smasmall_save_home_product_intro', function () {
    if (!current_user_can('read')) {
        wp_die(esc_html__('您沒有權限執行此操作。', 'smasmall'), esc_html__('權限不足', 'smasmall'), ['response' => 403]);
    }
    check_admin_referer('smasmall_home_product_intro_save', 'smasmall_home_product_intro_nonce');

    $raw = isset($_POST['product_intro']) && is_array($_POST['product_intro']) ? wp_unslash($_POST['product_intro']) : [];
    update_option(SMASMALL_HOME_PRODUCT_INTRO_OPTION, smasmall_home_product_intro_sanitize($raw));

    wp_safe_redirect(add_query_arg(['page' => 'smasmall-home-product-intro', 'updated' => '1'], admin_url('admin.php')));
    exit;
});

function smasmall_home_product_intro_render_spec_row(array $spec, $index): void
{
    $index_key = (string) $index;
    ?>
<tr class="shpi-spec-row">
    <th scope="row"><label>規格 <?php echo esc_html((string) ((int) $index + 1)); ?></label></th>
    <td>
        <input type="text" class="regular-text shpi-spec-label"
            name="product_intro[specs][<?php echo esc_attr($index_key); ?>][label]"
            value="<?php echo esc_attr($spec['label'] ?? ''); ?>" placeholder="例如：適用機型" />
        <input type="text" class="regular-text shpi-spec-value"
            name="product_intro[specs][<?php echo esc_attr($index_key); ?>][value]"
            value="<?php echo esc_attr($spec['value'] ?? ''); ?>" placeholder="例如：S3 旗艦版刮鬍刀" style="margin-top:8px" />
        <?php if ((int) $index === 0) : ?>
        <p class="description">第一項顯示在左下卡片上方（較大字）。其餘規格以兩欄顯示。</p>
        <?php endif; ?>
    </td>
</tr>
<?php
}

function smasmall_home_product_intro_render_feature_card(array $feature, $index): void
{
    $index_key = (string) $index;
    $image = (string) ($feature['image'] ?? '');
    $id = (string) ($feature['id'] ?? ('feature-' . ((int) $index + 1)));
    ?>
<li class="shpi-feature-card" data-index="<?php echo esc_attr($index_key); ?>">
    <div class="shpi-feature-head">
        <strong>特色 <?php echo esc_html((string) ((int) $index + 1)); ?></strong>
        <button type="button" class="button-link-delete shpi-remove-feature">移除此特色</button>
    </div>

    <input type="hidden" name="product_intro[features][<?php echo esc_attr($index_key); ?>][id]" value="<?php echo esc_attr($id); ?>" class="shpi-feature-id" />

    <div class="shpi-feature-grid">
        <div class="shpi-feature-image-box">
            <div class="shpi-feature-thumb">
                <?php if ($image !== '') : ?>
                <img src="<?php echo esc_url($image); ?>" alt="" class="shpi-feature-preview" />
                <?php else : ?>
                <div class="shpi-feature-placeholder"><span class="dashicons dashicons-format-image"></span></div>
                <img src="" alt="" class="shpi-feature-preview" style="display:none" />
                <?php endif; ?>
            </div>
            <input type="hidden" name="product_intro[features][<?php echo esc_attr($index_key); ?>][image]" value="<?php echo esc_attr($image); ?>" class="shpi-feature-image-url" />
            <p>
                <button type="button" class="button shpi-pick-feature-image">選擇特色背景圖</button>
                <button type="button" class="button-link-delete shpi-clear-feature-image">清除</button>
            </p>
            <p class="description">點擊此白點後，背景會換成這張圖並顯示於資訊卡（選填）。<br />選圖後會開啟裁切視窗，可自行拖曳選取範圍（固定 16:9）；輸出沿用裁切範圍的原始解析度，不放大、不縮小，原圖保留。</p>
        </div>

        <div class="shpi-feature-fields">
            <p>
                <label>標題（點擊白點後右下資訊卡大標）</label><br />
                <input type="text" class="large-text" name="product_intro[features][<?php echo esc_attr($index_key); ?>][title]"
                    value="<?php echo esc_attr($feature['title'] ?? ''); ?>" placeholder="例如：專利防水推式開關" />
            </p>
            <p>
                <label>說明（點擊白點後，右下資訊卡內文）</label><br />
                <textarea class="large-text" rows="3" name="product_intro[features][<?php echo esc_attr($index_key); ?>][description]"
                    placeholder="例如：獨家防水推動設計，有效防止誤觸，操作更安心。"><?php echo esc_textarea($feature['description'] ?? ''); ?></textarea>
            </p>
            <div class="shpi-feature-pos">
                <p>
                    <label>白點 Top（%）</label><br />
                    <input type="text" class="small-text" name="product_intro[features][<?php echo esc_attr($index_key); ?>][top]"
                        value="<?php echo esc_attr($feature['top'] ?? '50%'); ?>" placeholder="48%" />
                </p>
                <p>
                    <label>白點 Left（%）</label><br />
                    <input type="text" class="small-text" name="product_intro[features][<?php echo esc_attr($index_key); ?>][left]"
                        value="<?php echo esc_attr($feature['left'] ?? '50%'); ?>" placeholder="50%" />
                </p>
                <p>
                    <label>點擊後放大倍率</label><br />
                    <input type="number" class="small-text" step="0.1" min="1" max="5"
                        name="product_intro[features][<?php echo esc_attr($index_key); ?>][bgScale]"
                        value="<?php echo esc_attr((string) ($feature['bgScale'] ?? 2.4)); ?>" />
                </p>
            </div>
            <p class="description">Top／Left 決定白點位置與放大中心（例：48%、50%）。倍率建議 2.0～2.6。</p>
        </div>
    </div>
</li>
<?php
}

function smasmall_home_product_intro_render_page(): void
{
    if (!current_user_can('read')) {
        return;
    }

    $data = smasmall_home_product_intro_get();
    $specs = is_array($data['specs'] ?? null) ? $data['specs'] : [];
    while (count($specs) < 4) {
        $specs[] = ['label' => '', 'value' => ''];
    }
    $features = is_array($data['features'] ?? null) ? $data['features'] : [];
    $bg = $data['backgroundImage'] ?? '';
    $updated = isset($_GET['updated']);
    ?>
<div class="wrap shpi-admin">
    <h1>首頁產品介紹</h1>
    <p class="description">對應前台 <code>S3GroomingPrecision</code>：固定背景＋左下規格卡、白點全部顯示並閃爍、點擊白點放大並於右下彈出資訊卡。儲存後約 1 分鐘同步前台。</p>

    <?php if ($updated) : ?>
    <div class="notice notice-success is-dismissible">
        <p>已儲存設定。</p>
    </div>
    <?php endif; ?>

    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" id="shpi-form">
        <input type="hidden" name="action" value="smasmall_save_home_product_intro" />
        <?php wp_nonce_field('smasmall_home_product_intro_save', 'smasmall_home_product_intro_nonce'); ?>

        <table class="form-table" role="presentation">
            <tr>
                <th scope="row">顯示此區塊</th>
                <td><label><input type="checkbox" name="product_intro[enabled]" value="1"
                            <?php checked(!empty($data['enabled'])); ?> /> 在前台顯示</label></td>
            </tr>
            <tr>
                <th scope="row">預設背景圖</th>
                <td>
                    <div class="shpi-image-box">
                        <div class="shpi-thumb">
                            <?php if ($bg) : ?>
                            <img src="<?php echo esc_url($bg); ?>" alt="" id="shpi-bg-preview" />
                            <?php else : ?>
                            <div class="shpi-thumb-placeholder" id="shpi-bg-placeholder"><span
                                    class="dashicons dashicons-format-image"></span></div>
                            <img src="" alt="" id="shpi-bg-preview" style="display:none" />
                            <?php endif; ?>
                        </div>
                        <input type="hidden" name="product_intro[backgroundImage]" id="shpi-bg-url"
                            value="<?php echo esc_attr($bg); ?>" />
                        <p>
                            <button type="button" class="button" id="shpi-pick-bg">選擇背景圖</button>
                            <button type="button" class="button-link-delete" id="shpi-clear-bg">清除</button>
                        </p>
                        <p class="description">全螢幕固定背景（不會隨熱點切換）。所有白點位置都以這張圖為準。<br />選圖後會開啟裁切視窗，可自行拖曳選取範圍（固定 16:9）；輸出沿用裁切範圍的原始解析度，不放大、不縮小，裁切圖會另存至媒體庫，原圖保留。</p>
                    </div>
                </td>
            </tr>
            <tr>
                <th scope="row"><label for="shpi-subtitle">副標（資訊卡編號旁小字）</label></th>
                <td>
                    <input type="text" class="regular-text" id="shpi-subtitle" name="product_intro[subtitle]"
                        value="<?php echo esc_attr($data['subtitle'] ?? ''); ?>" placeholder="產品特寫" />
                    <p class="description">點擊白點後，右下資訊卡標題上方的灰色小標（例：「2. 產品特寫」）。</p>
                </td>
            </tr>
            <tr>
                <th scope="row"><label for="shpi-title">區塊識別標題</label></th>
                <td>
                    <input type="text" class="large-text" id="shpi-title" name="product_intro[title]"
                        value="<?php echo esc_attr($data['title'] ?? ''); ?>" />
                    <p class="description">API／後台識別用；前台主要顯示的是下方「特色」標題。不可空白，否則區塊不會輸出。</p>
                </td>
            </tr>
            <tr>
                <th scope="row"><label for="shpi-description">區塊備註描述</label></th>
                <td>
                    <textarea class="large-text" rows="2" id="shpi-description"
                        name="product_intro[description]"><?php echo esc_textarea($data['description'] ?? ''); ?></textarea>
                    <p class="description">選填。前台內容以各特色的「說明」為主。</p>
                </td>
            </tr>
        </table>

        <h2>產品資訊卡片（最多 4 項）</h2>
        <p class="description">對應左下角半透明「產品資訊」卡片（適用機型、磁吸結構、機身材質等）。</p>
        <table class="form-table" role="presentation">
            <?php foreach (array_slice($specs, 0, 4) as $i => $spec) :
                smasmall_home_product_intro_render_spec_row(is_array($spec) ? $spec : [], $i);
            endforeach; ?>
        </table>

        <h2>熱點特色（白點全部顯示＋點擊彈出資訊卡）</h2>
        <p class="description">每一項 = 一個白點（位置＋放大倍率）＋資訊卡（縮圖／標題／說明）。所有白點會同時顯示並閃爍。前台最多約 8 項，可新增／刪除。</p>
        <div class="shpi-toolbar">
            <button type="button" class="button button-primary" id="shpi-add-feature">+ 新增特色</button>
            <span>共 <strong id="shpi-feature-count"><?php echo count($features); ?></strong> 項</span>
        </div>
        <ul id="shpi-features-list" class="shpi-features-list">
            <?php foreach ($features as $i => $feature) :
                smasmall_home_product_intro_render_feature_card(is_array($feature) ? $feature : [], (int) $i);
            endforeach; ?>
        </ul>

        <?php submit_button('儲存設定', 'primary large'); ?>
    </form>
</div>

<div id="tmpl-shpi-feature" style="display:none" aria-hidden="true">
    <?php
    smasmall_home_product_intro_render_feature_card([
        'id'          => '__SHPI_ID__',
        'title'       => '',
        'description' => '',
        'image'       => '',
        'top'         => '50%',
        'left'        => '50%',
        'bgScale'     => 2.4,
    ], '__SHPI_INDEX__');
    ?>
</div>

<style>
.shpi-admin { max-width: 960px; }
.shpi-image-box .shpi-thumb img,
.shpi-thumb-placeholder {
    max-width: 480px;
    width: 100%;
    border-radius: 8px;
    background: #1d2327;
}
.shpi-thumb-placeholder {
    min-height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.shpi-spec-label,
.shpi-spec-value {
    display: block;
    max-width: 420px;
}
.shpi-toolbar {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 12px 0 16px;
}
.shpi-features-list {
    list-style: none;
    margin: 0 0 24px;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
}
.shpi-feature-card {
    background: #fff;
    border: 1px solid #dcdcde;
    border-radius: 8px;
    padding: 16px;
}
.shpi-feature-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}
.shpi-feature-grid {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 20px;
}
.shpi-feature-thumb img,
.shpi-feature-placeholder {
    width: 160px;
    height: 120px;
    object-fit: cover;
    border-radius: 6px;
    background: #f0f0f1;
}
.shpi-feature-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
}
.shpi-feature-pos {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 20px;
}
@media (max-width: 782px) {
    .shpi-feature-grid { grid-template-columns: 1fr; }
}
</style>
<?php
}

add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook !== 'toplevel_page_smasmall-home-product-intro') {
        return;
    }
    wp_enqueue_media();
    // 後台互動式裁切（Cropper.js）
    wp_enqueue_style(
        'smasmall-cropperjs',
        'https://cdn.jsdelivr.net/npm/cropperjs@1.6.2/dist/cropper.min.css',
        [],
        '1.6.2'
    );
    wp_enqueue_script(
        'smasmall-cropperjs',
        'https://cdn.jsdelivr.net/npm/cropperjs@1.6.2/dist/cropper.min.js',
        [],
        '1.6.2',
        true
    );
});

add_action('admin_footer', function () {
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || $screen->id !== 'toplevel_page_smasmall-home-product-intro') {
        return;
    }
    ?>
<div id="shpi-crop-overlay" class="shpi-crop-overlay" style="display:none">
    <div class="shpi-crop-modal">
        <div class="shpi-crop-head">
            <strong>裁切圖片（比例固定 16:9）</strong>
            <button type="button" class="button-link" id="shpi-crop-cancel-x" aria-label="關閉">✕</button>
        </div>
        <div class="shpi-crop-body">
            <img id="shpi-crop-image" src="" alt="" />
        </div>
        <div class="shpi-crop-foot">
            <span class="description">拖曳／縮放選取範圍；依原圖裁切範圍的解析度輸出。</span>
            <span class="shpi-crop-actions">
                <button type="button" class="button button-primary" id="shpi-crop-confirm">裁切並使用</button>
            </span>
        </div>
    </div>
</div>

<style>
.shpi-crop-overlay {
    position: fixed;
    inset: 0;
    z-index: 200000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.72);
}
.shpi-crop-modal {
    display: flex;
    flex-direction: column;
    width: min(960px, 94vw);
    max-height: 92vh;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}
.shpi-crop-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid #dcdcde;
}
.shpi-crop-head .button-link { font-size: 16px; text-decoration: none; }
.shpi-crop-body {
    flex: 1;
    min-height: 320px;
    max-height: calc(92vh - 130px);
    background: #1d2327;
}
.shpi-crop-body img {
    display: block;
    max-width: 100%;
}
.shpi-crop-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    border-top: 1px solid #dcdcde;
}
.shpi-crop-actions { display: flex; gap: 8px; }
.shpi-crop-loading .shpi-crop-actions .button { pointer-events: none; opacity: 0.6; }
</style>

<script>
jQuery(function($) {
    var $list = $('#shpi-features-list');
    var $tmpl = $('#tmpl-shpi-feature');

    /* ============ 互動式裁切彈窗 ============ */
    var CROP_NONCE = '<?php echo esc_js(wp_create_nonce('smasmall_shpi_crop')); ?>';
    var cropper = null;
    var cropSourceUrl = '';
    var cropMime = 'image/jpeg';
    var cropCallback = null;
    var $overlay = $('#shpi-crop-overlay');
    var $cropImg = $('#shpi-crop-image');

    function openCropModal(url, cb, mime) {
        cropSourceUrl = url;
        cropMime = ['image/jpeg', 'image/png', 'image/webp'].indexOf(mime) !== -1
            ? mime
            : 'image/jpeg';
        cropCallback = cb;
        $overlay.show();
        $cropImg.attr('src', url);

        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        if (typeof Cropper === 'undefined') {
            alert('裁切工具載入失敗，請重新整理頁面後再試。');
            closeCropModal(null);
            return;
        }

        cropper = new Cropper($cropImg[0], {
            aspectRatio: 16 / 9,
            viewMode: 1,
            autoCropArea: 1,
            background: false,
            responsive: true
        });
    }

    function closeCropModal(resultUrl) {
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        $overlay.hide().removeClass('shpi-crop-loading');
        $cropImg.attr('src', '');
        var cb = cropCallback;
        cropCallback = null;
        if (cb && typeof resultUrl === 'string') {
            cb(resultUrl);
        }
    }

    $('#shpi-crop-cancel-x').on('click', function(e) {
        e.preventDefault();
        closeCropModal(null); // 取消：不套用
    });

    $('#shpi-crop-confirm').on('click', function(e) {
        e.preventDefault();
        if (!cropper) {
            closeCropModal(null);
            return;
        }
        // 不指定 width／height：沿用原圖裁切區域的實際像素尺寸
        var canvas = cropper.getCroppedCanvas();
        if (!canvas) {
            alert('裁切失敗，請重試。');
            return;
        }
        $overlay.addClass('shpi-crop-loading');
        canvas.toBlob(function(blob) {
            if (!blob) {
                $overlay.removeClass('shpi-crop-loading');
                alert('裁切輸出失敗，請重試。');
                return;
            }
            var fd = new FormData();
            var extension = cropMime === 'image/png'
                ? 'png'
                : (cropMime === 'image/webp' ? 'webp' : 'jpg');
            fd.append('action', 'smasmall_shpi_crop_upload');
            fd.append('nonce', CROP_NONCE);
            fd.append('image', blob, 'smasmall-crop-' + Date.now() + '.' + extension);

            $.ajax({
                url: ajaxurl,
                method: 'POST',
                data: fd,
                processData: false,
                contentType: false
            }).done(function(res) {
                if (res && res.success && res.data && res.data.url) {
                    closeCropModal(res.data.url);
                } else {
                    $overlay.removeClass('shpi-crop-loading');
                    alert((res && res.data && res.data.message) || '上傳裁切圖失敗。');
                }
            }).fail(function() {
                $overlay.removeClass('shpi-crop-loading');
                alert('上傳裁切圖失敗，請重試。');
            });
        }, cropMime, 1);
    });
    /* ============ /互動式裁切彈窗 ============ */

    function setBg(url) {
        url = url || '';
        $('#shpi-bg-url').val(url);
        if (url) {
            $('#shpi-bg-preview').attr('src', url).show();
            $('#shpi-bg-placeholder').hide();
        } else {
            $('#shpi-bg-preview').attr('src', '').hide();
            $('#shpi-bg-placeholder').show();
        }
    }

    $('#shpi-pick-bg').on('click', function(e) {
        e.preventDefault();
        if (typeof wp === 'undefined' || !wp.media) {
            alert('媒體庫尚未載入，請重新整理頁面後再試。');
            return;
        }
        var frame = wp.media({
            title: '選擇預設背景圖',
            button: { text: '使用這張圖' },
            multiple: false,
            library: { type: 'image' }
        });
        frame.on('select', function() {
            var attachment = frame.state().get('selection').first().toJSON();
            if (attachment.url) {
                openCropModal(attachment.url, setBg, attachment.mime);
            }
        });
        frame.open();
    });

    $('#shpi-clear-bg').on('click', function(e) {
        e.preventDefault();
        setBg('');
    });

    function reindexFeatures() {
        $list.find('.shpi-feature-card').each(function(index) {
            var $card = $(this);
            $card.attr('data-index', index);
            $card.find('[name^="product_intro[features]["]').each(function() {
                this.name = this.name.replace(
                    /product_intro\[features\]\[[^\]]+\]/,
                    'product_intro[features][' + index + ']'
                );
            });
        });
        $('#shpi-feature-count').text($list.find('.shpi-feature-card').length);
    }

    function setFeatureImage($card, url) {
        url = url || '';
        $card.find('.shpi-feature-image-url').val(url);
        var $preview = $card.find('.shpi-feature-preview');
        var $placeholder = $card.find('.shpi-feature-placeholder');
        if (url) {
            $preview.attr('src', url).show();
            $placeholder.hide();
        } else {
            $preview.attr('src', '').hide();
            if ($placeholder.length) {
                $placeholder.show();
            } else {
                $card.find('.shpi-feature-thumb').prepend(
                    '<div class="shpi-feature-placeholder"><span class="dashicons dashicons-format-image"></span></div>'
                );
            }
        }
    }

    function bindFeatureCard($card) {
        $card.find('.shpi-remove-feature').off('click.shpi').on('click.shpi', function(e) {
            e.preventDefault();
            $card.remove();
            reindexFeatures();
        });

        $card.find('.shpi-pick-feature-image').off('click.shpi').on('click.shpi', function(e) {
            e.preventDefault();
            if (typeof wp === 'undefined' || !wp.media) {
                alert('媒體庫尚未載入，請重新整理頁面後再試。');
                return;
            }
            var frame = wp.media({
                title: '選擇特色背景圖',
                button: { text: '使用這張圖' },
                multiple: false,
                library: { type: 'image' }
            });
            frame.on('select', function() {
                var attachment = frame.state().get('selection').first().toJSON();
                if (attachment.url) {
                    openCropModal(attachment.url, function(url) {
                        setFeatureImage($card, url);
                    }, attachment.mime);
                }
            });
            frame.open();
        });

        $card.find('.shpi-clear-feature-image').off('click.shpi').on('click.shpi', function(e) {
            e.preventDefault();
            setFeatureImage($card, '');
        });
    }

    $('#shpi-add-feature').on('click', function(e) {
        e.preventDefault();
        if (!$tmpl.length) {
            alert('找不到特色範本，請重新整理頁面。');
            return;
        }
        if ($list.find('.shpi-feature-card').length >= 8) {
            alert('最多 8 個特色項目。');
            return;
        }
        var index = $list.find('.shpi-feature-card').length;
        var id = 'feature_' + Date.now();
        var html = $tmpl.html()
            .replace(/__SHPI_ID__/g, id)
            .replace(/__SHPI_INDEX__/g, String(index));
        var $card = $(html.trim());
        if (!$card.length) {
            alert('無法建立特色項目，請重新整理頁面。');
            return;
        }
        $list.append($card);
        bindFeatureCard($card);
        reindexFeatures();
    });

    $list.find('.shpi-feature-card').each(function() {
        bindFeatureCard($(this));
    });
    $('#shpi-form').on('submit', reindexFeatures);
});
</script>
<?php
});

add_action('rest_api_init', function () {
    register_rest_route('smasmall/v1', '/home-product-intro', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function () {
            $section = smasmall_home_product_intro_format_for_api(smasmall_home_product_intro_get());
            if ($section === null) {
                return rest_ensure_response(['section' => null]);
            }
            return rest_ensure_response(['section' => $section]);
        },
    ]);
});
