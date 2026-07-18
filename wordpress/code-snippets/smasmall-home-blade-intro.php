<?php
/**
 * SMASMALL — 首頁刀頭介紹（Code Snippets）
 *
 * - 左側選單：首頁刀頭介紹
 * - 管理開場文案、背景圖、手風琴刀頭項目（每項可加多張圓形小圖）
 * - 公開 REST：GET /wp-json/smasmall/v1/home-blade-intro
 *   每個 item 含 images: string[]（圓形小圖 URL）
 *
 * 貼到 WordPress「Code Snippets」→ Run everywhere → 啟用
 */

if (!defined('ABSPATH')) {
    exit;
}

const SMASMALL_HOME_BLADE_INTRO_OPTION = 'smasmall_home_blade_intro';

/**
 * 接收後台裁切彈窗（Cropper.js）輸出的圖片，
 * 存進媒體庫並回傳 URL；輸出沿用裁切範圍的原始解析度。
 */
add_action('wp_ajax_smasmall_shbi_crop_upload', function () {
    check_ajax_referer('smasmall_shbi_crop', 'nonce');

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

function smasmall_home_blade_intro_defaults(): array
{
    return [
        'enabled' => true,
        'intro'   => [
            'label'           => 'Original Craftsmanship',
            'title'           => '獨創全合金壓鑄機身',
            'description'     => '拋棄傳統塑膠材質，汲取重機與航空機身靈感，打造扎實且耐用的全合金機身。握感沉穩、冰冷俐落，完美展現復古未來主義的獨特品味。',
            'backgroundImage' => '',
        ],
        'accordion' => [
            'eyebrow' => 'Blade System',
            'title'   => '刀頭介紹',
            'items'   => [
                [
                    'id'          => 'blade-2',
                    'label'       => 'Constellation Series',
                    'title'       => '刀頭 2.0（星座系列）',
                    'description' => '標配雙環開放式 2.0 圓刀頭，採德國進口鋼材與日本精密加工，近 40 道成型工藝打造。外環開放式圓刀搭配獨立浮動刀網，貼合臉部輪廓、順滑捕捉各方向鬍鬚。磁吸式快拆設計，一秒拆卸可直接水洗，建議每 6–12 個月更換，維持最佳鋒利度。適用星座系列 CQ1 等磁吸式機身。',
                    'images'      => [],
                    'enabled'     => true,
                    'order'       => 0,
                ],
                [
                    'id'          => 'blade-3',
                    'label'       => 'Dark Knight Series',
                    'title'       => '刀頭 3.0（黑夜系列）',
                    'description' => '雙環外開放式 3.0 版圓刀頭，外環採開放式結構，進鬚量再升級，刮剃效率更俐落。德國進口頂級鋼材，經 SGS 檢驗對金黃色葡萄球菌、大腸桿菌抗菌率高達 96%。同樣支援磁吸快拆與全機水洗，建議每 6–12 個月更換。為黑夜騎士等進階機型與升級替換首選。',
                    'images'      => [],
                    'enabled'     => true,
                    'order'       => 1,
                ],
            ],
        ],
    ];
}

function smasmall_home_blade_intro_sanitize_images($input): array
{
    if (!is_array($input)) {
        if (is_string($input) && trim($input) !== '') {
            $input = preg_split('/\r\n|\r|\n/', $input) ?: [];
        } else {
            return [];
        }
    }

    $out = [];
    foreach ($input as $url) {
        if (!is_string($url)) {
            continue;
        }
        $clean = esc_url_raw(trim($url));
        if ($clean !== '') {
            $out[] = $clean;
        }
    }

    return array_values(array_unique($out));
}

function smasmall_home_blade_intro_get(): array
{
    $saved = get_option(SMASMALL_HOME_BLADE_INTRO_OPTION, []);
    if (!is_array($saved)) {
        $saved = [];
    }

    $defaults = smasmall_home_blade_intro_defaults();
    $intro = array_merge($defaults['intro'], is_array($saved['intro'] ?? null) ? $saved['intro'] : []);
    $accordion = array_merge($defaults['accordion'], is_array($saved['accordion'] ?? null) ? $saved['accordion'] : []);
    if (!is_array($accordion['items'] ?? null)) {
        $accordion['items'] = $defaults['accordion']['items'];
    } else {
        // 舊資料沒有 images 時補空陣列
        $accordion['items'] = array_map(static function ($item) {
            if (!is_array($item)) {
                return $item;
            }
            if (!isset($item['images']) || !is_array($item['images'])) {
                $item['images'] = [];
            }
            return $item;
        }, $accordion['items']);
    }

    return [
        'enabled'   => array_key_exists('enabled', $saved) ? !empty($saved['enabled']) : $defaults['enabled'],
        'intro'     => $intro,
        'accordion' => $accordion,
    ];
}

function smasmall_home_blade_intro_sanitize_items($input): array
{
    if (!is_array($input)) {
        return [];
    }

    $out = [];
    foreach ($input as $row) {
        if (!is_array($row)) {
            continue;
        }
        $title = sanitize_text_field($row['title'] ?? '');
        $description = sanitize_textarea_field($row['description'] ?? '');
        $images = smasmall_home_blade_intro_sanitize_images($row['images'] ?? []);
        if ($title === '' && $description === '' && empty($images)) {
            continue;
        }
        $id = sanitize_key($row['id'] ?? '');
        if ($id === '') {
            $id = 'blade-' . wp_generate_password(6, false, false);
        }
        $out[] = [
            'id'          => $id,
            'label'       => sanitize_text_field($row['label'] ?? ''),
            'title'       => $title,
            'description' => $description,
            'images'      => $images,
            'enabled'     => !empty($row['enabled']),
            'order'       => isset($row['order']) ? (int) $row['order'] : count($out),
        ];
    }

    usort($out, static function ($a, $b) {
        return ($a['order'] ?? 0) <=> ($b['order'] ?? 0);
    });

    return $out;
}

function smasmall_home_blade_intro_sanitize($input): array
{
    if (!is_array($input)) {
        return smasmall_home_blade_intro_defaults();
    }

    $defaults = smasmall_home_blade_intro_defaults();
    $intro_raw = is_array($input['intro'] ?? null) ? $input['intro'] : [];
    $accordion_raw = is_array($input['accordion'] ?? null) ? $input['accordion'] : [];
    $items = smasmall_home_blade_intro_sanitize_items($accordion_raw['items'] ?? []);

    return [
        'enabled'   => !empty($input['enabled']),
        'intro'     => [
            'label'           => sanitize_text_field($intro_raw['label'] ?? $defaults['intro']['label']),
            'title'           => sanitize_text_field($intro_raw['title'] ?? $defaults['intro']['title']),
            'description'     => sanitize_textarea_field($intro_raw['description'] ?? $defaults['intro']['description']),
            'backgroundImage' => esc_url_raw(trim((string) ($intro_raw['backgroundImage'] ?? ''))),
        ],
        'accordion' => [
            'eyebrow' => sanitize_text_field($accordion_raw['eyebrow'] ?? $defaults['accordion']['eyebrow']),
            'title'   => sanitize_text_field($accordion_raw['title'] ?? $defaults['accordion']['title']),
            'items'   => $items ?: $defaults['accordion']['items'],
        ],
    ];
}

function smasmall_home_blade_intro_format_for_api(array $data): ?array
{
    if (empty($data['enabled'])) {
        return null;
    }

    $intro = $data['intro'] ?? [];
    $accordion = $data['accordion'] ?? [];
    $items = [];

    foreach (($accordion['items'] ?? []) as $item) {
        if (!is_array($item)) {
            continue;
        }
        if (isset($item['enabled']) && !$item['enabled']) {
            continue;
        }
        $title = sanitize_text_field($item['title'] ?? '');
        if ($title === '') {
            continue;
        }
        $images = smasmall_home_blade_intro_sanitize_images($item['images'] ?? []);
        $row = [
            'id'          => sanitize_key($item['id'] ?? uniqid('blade_', true)),
            'label'       => sanitize_text_field($item['label'] ?? ''),
            'title'       => $title,
            'description' => sanitize_textarea_field($item['description'] ?? ''),
        ];
        if (!empty($images)) {
            $row['images'] = $images;
        }
        $items[] = $row;
    }

    if (empty($items)) {
        return null;
    }

    return [
        'intro' => [
            'label'           => sanitize_text_field($intro['label'] ?? ''),
            'title'           => sanitize_text_field($intro['title'] ?? ''),
            'description'     => sanitize_textarea_field($intro['description'] ?? ''),
            'backgroundImage' => esc_url_raw($intro['backgroundImage'] ?? ''),
        ],
        'accordion' => [
            'eyebrow' => sanitize_text_field($accordion['eyebrow'] ?? 'Blade System'),
            'title'   => sanitize_text_field($accordion['title'] ?? '刀頭介紹'),
            'items'   => $items,
        ],
    ];
}

add_action('admin_menu', function () {
    add_menu_page(
        '首頁刀頭介紹',
        '首頁刀頭介紹',
        'read',
        'smasmall-home-blade-intro',
        'smasmall_home_blade_intro_render_page',
        'dashicons-admin-tools',
        60
    );
});

add_action('admin_init', function () {
    register_setting(
        'smasmall_home_blade_intro_group',
        SMASMALL_HOME_BLADE_INTRO_OPTION,
        [
            'type'              => 'array',
            'sanitize_callback' => 'smasmall_home_blade_intro_sanitize',
            'default'           => smasmall_home_blade_intro_defaults(),
        ]
    );
});

add_action('admin_post_smasmall_save_home_blade_intro', function () {
    if (!current_user_can('read')) {
        wp_die(esc_html__('您沒有權限執行此操作。', 'smasmall'), esc_html__('權限不足', 'smasmall'), ['response' => 403]);
    }
    check_admin_referer('smasmall_home_blade_intro_save', 'smasmall_home_blade_intro_nonce');

    $raw = isset($_POST['blade_intro']) && is_array($_POST['blade_intro']) ? wp_unslash($_POST['blade_intro']) : [];
    update_option(SMASMALL_HOME_BLADE_INTRO_OPTION, smasmall_home_blade_intro_sanitize($raw));

    wp_safe_redirect(add_query_arg(['page' => 'smasmall-home-blade-intro', 'updated' => '1'], admin_url('admin.php')));
    exit;
});

function smasmall_home_blade_intro_render_item_row(array $item, $index): void
{
    $index_key = (string) $index;
    $order = isset($item['order']) ? (int) $item['order'] : (is_numeric($index) ? (int) $index : 0);
    $id = $item['id'] ?? uniqid('blade_', true);
    $enabled = !isset($item['enabled']) || !empty($item['enabled']);
    $images = is_array($item['images'] ?? null) ? $item['images'] : [];
    ?>
    <li class="shbi-item-card" data-index="<?php echo esc_attr($index_key); ?>">
        <span class="shbi-drag dashicons dashicons-move" title="拖曳排序"></span>
        <div class="shbi-fields">
            <input type="hidden" name="blade_intro[accordion][items][<?php echo esc_attr($index_key); ?>][id]" value="<?php echo esc_attr($id); ?>" class="shbi-id" />
            <input type="hidden" name="blade_intro[accordion][items][<?php echo esc_attr($index_key); ?>][order]" value="<?php echo esc_attr((string) $order); ?>" class="shbi-order" />
            <p><label>系列標籤（英文小標）</label><br />
                <input type="text" class="regular-text" name="blade_intro[accordion][items][<?php echo esc_attr($index_key); ?>][label]" value="<?php echo esc_attr($item['label'] ?? ''); ?>" placeholder="Constellation Series" /></p>
            <p><label>標題 <span class="required">*</span></label><br />
                <input type="text" class="large-text" name="blade_intro[accordion][items][<?php echo esc_attr($index_key); ?>][title]" value="<?php echo esc_attr($item['title'] ?? ''); ?>" /></p>
            <p><label>說明</label><br />
                <textarea class="large-text" rows="4" name="blade_intro[accordion][items][<?php echo esc_attr($index_key); ?>][description]"><?php echo esc_textarea($item['description'] ?? ''); ?></textarea></p>

            <div class="shbi-images-block">
                <label>圓形小圖（可多張，拖曳排序）</label>
                <p class="description" style="margin:4px 0 8px;">前台手風琴展開後會以圓形小圖列顯示。選圖後會開啟裁切視窗（固定 1:1 正方形），輸出沿用原圖解析度。</p>
                <ul class="shbi-images-list">
                    <?php foreach ($images as $img_url) :
                        if (!is_string($img_url) || trim($img_url) === '') {
                            continue;
                        }
                        ?>
                        <li class="shbi-image-item">
                            <span class="shbi-image-drag dashicons dashicons-move" title="拖曳排序"></span>
                            <img src="<?php echo esc_url($img_url); ?>" alt="" />
                            <input type="hidden" name="blade_intro[accordion][items][<?php echo esc_attr($index_key); ?>][images][]" value="<?php echo esc_attr($img_url); ?>" />
                            <button type="button" class="button-link-delete shbi-remove-image">移除</button>
                        </li>
                    <?php endforeach; ?>
                </ul>
                <p>
                    <button type="button" class="button shbi-add-images">+ 新增圓形小圖</button>
                </p>
            </div>

            <p><button type="button" class="button-link-delete shbi-remove">移除此項目</button></p>
        </div>
        <label class="shbi-enabled">
            <input type="checkbox" name="blade_intro[accordion][items][<?php echo esc_attr($index_key); ?>][enabled]" value="1" <?php checked($enabled); ?> />
            顯示
        </label>
    </li>
    <?php
}

function smasmall_home_blade_intro_render_page(): void
{
    if (!current_user_can('read')) {
        return;
    }

    $data = smasmall_home_blade_intro_get();
    $intro = $data['intro'];
    $accordion = $data['accordion'];
    $items = is_array($accordion['items'] ?? null) ? $accordion['items'] : [];
    $bg = $intro['backgroundImage'] ?? '';
    $updated = isset($_GET['updated']);
    ?>
    <div class="wrap shbi-admin">
        <h1>首頁刀頭介紹</h1>
        <p class="description">管理官網首頁「全合金機身＋刀頭介紹手風琴」滾動區。每個刀頭可上傳多張圓形小圖。儲存後約 1 分鐘內同步至前台。</p>

        <?php if ($updated) : ?>
            <div class="notice notice-success is-dismissible"><p>已儲存設定。</p></div>
        <?php endif; ?>

        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" id="shbi-form">
            <input type="hidden" name="action" value="smasmall_save_home_blade_intro" />
            <?php wp_nonce_field('smasmall_home_blade_intro_save', 'smasmall_home_blade_intro_nonce'); ?>

            <h2>一般設定</h2>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row">顯示此區塊</th>
                    <td><label><input type="checkbox" name="blade_intro[enabled]" value="1" <?php checked(!empty($data['enabled'])); ?> /> 在前台顯示</label></td>
                </tr>
            </table>

            <h2>開場區（Original Craftsmanship）</h2>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="shbi-intro-label">英文小標</label></th>
                    <td><input type="text" class="regular-text" id="shbi-intro-label" name="blade_intro[intro][label]" value="<?php echo esc_attr($intro['label'] ?? ''); ?>" /></td>
                </tr>
                <tr>
                    <th scope="row"><label for="shbi-intro-title">主標題</label></th>
                    <td><input type="text" class="large-text" id="shbi-intro-title" name="blade_intro[intro][title]" value="<?php echo esc_attr($intro['title'] ?? ''); ?>" /></td>
                </tr>
                <tr>
                    <th scope="row"><label for="shbi-intro-desc">描述</label></th>
                    <td><textarea class="large-text" rows="4" id="shbi-intro-desc" name="blade_intro[intro][description]"><?php echo esc_textarea($intro['description'] ?? ''); ?></textarea></td>
                </tr>
                <tr>
                    <th scope="row">背景圖</th>
                    <td>
                        <div class="shbi-image-box">
                            <div class="shbi-thumb">
                                <?php if ($bg) : ?>
                                    <img src="<?php echo esc_url($bg); ?>" alt="" id="shbi-bg-preview" />
                                <?php else : ?>
                                    <div class="shbi-thumb-placeholder" id="shbi-bg-placeholder"><span class="dashicons dashicons-format-image"></span></div>
                                    <img src="" alt="" id="shbi-bg-preview" style="display:none" />
                                <?php endif; ?>
                            </div>
                            <input type="hidden" name="blade_intro[intro][backgroundImage]" id="shbi-bg-url" value="<?php echo esc_attr($bg); ?>" />
                            <p>
                                <button type="button" class="button" id="shbi-pick-bg">選擇背景圖</button>
                                <button type="button" class="button-link-delete" id="shbi-clear-bg">清除</button>
                            </p>
                            <p class="description">選圖後會開啟裁切視窗，可自行拖曳選取範圍（固定 16:9）；輸出沿用裁切範圍的原始解析度，不放大、不縮小，原圖保留。</p>
                        </div>
                    </td>
                </tr>
            </table>

            <h2>刀頭介紹手風琴</h2>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="shbi-acc-eyebrow">區塊小標</label></th>
                    <td><input type="text" class="regular-text" id="shbi-acc-eyebrow" name="blade_intro[accordion][eyebrow]" value="<?php echo esc_attr($accordion['eyebrow'] ?? ''); ?>" placeholder="Blade System" /></td>
                </tr>
                <tr>
                    <th scope="row"><label for="shbi-acc-title">區塊標題</label></th>
                    <td><input type="text" class="regular-text" id="shbi-acc-title" name="blade_intro[accordion][title]" value="<?php echo esc_attr($accordion['title'] ?? ''); ?>" placeholder="刀頭介紹" /></td>
                </tr>
            </table>

            <div class="shbi-toolbar">
                <button type="button" class="button button-primary" id="shbi-add-item">+ 新增刀頭項目</button>
                <span>共 <strong id="shbi-item-count"><?php echo count($items); ?></strong> 項</span>
            </div>

            <ul id="shbi-items-list" class="shbi-items-list">
                <?php foreach ($items as $i => $item) :
                    smasmall_home_blade_intro_render_item_row(is_array($item) ? $item : [], (int) $i);
                endforeach; ?>
            </ul>

            <?php submit_button('儲存設定', 'primary large'); ?>
        </form>
    </div>

    <div id="tmpl-shbi-item" style="display:none" aria-hidden="true">
        <?php smasmall_home_blade_intro_render_item_row([
            'id' => '__SHBI_ID__',
            'label' => '',
            'title' => '',
            'description' => '',
            'images' => [],
            'enabled' => true,
            'order' => 0,
        ], '__SHBI_INDEX__'); ?>
    </div>

    <style>
        .shbi-admin { max-width: 960px; }
        .shbi-image-box .shbi-thumb img, .shbi-thumb-placeholder { max-width: 420px; width: 100%; border-radius: 8px; background: #f0f0f1; }
        .shbi-thumb-placeholder { min-height: 140px; display: flex; align-items: center; justify-content: center; }
        .shbi-toolbar { display: flex; align-items: center; gap: 16px; margin: 16px 0; }
        .shbi-items-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
        .shbi-item-card {
            display: grid; grid-template-columns: 28px 1fr auto; gap: 16px; align-items: start;
            background: #fff; border: 1px solid #dcdcde; border-radius: 8px; padding: 16px;
        }
        .shbi-drag { cursor: grab; color: #787c82; margin-top: 8px; }
        .shbi-enabled { display: flex; align-items: center; gap: 6px; white-space: nowrap; font-weight: 500; margin-top: 8px; }
        .shbi-images-block { margin: 12px 0 8px; padding: 12px; background: #f6f7f7; border: 1px solid #e2e4e7; border-radius: 6px; }
        .shbi-images-list { list-style: none; margin: 0 0 10px; padding: 0; display: flex; flex-wrap: wrap; gap: 10px; min-height: 8px; }
        .shbi-image-item {
            display: flex; flex-direction: column; align-items: center; gap: 6px;
            width: 110px; padding: 8px; background: #fff; border: 1px solid #dcdcde; border-radius: 6px;
        }
        .shbi-image-item img { width: 90px; height: 90px; object-fit: cover; border-radius: 4px; background: #f0f0f1; }
        .shbi-image-drag { cursor: grab; color: #787c82; font-size: 16px; width: 16px; height: 16px; }
        .shbi-image-item .shbi-remove-image { font-size: 12px; }
    </style>
    <?php
}

add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook !== 'toplevel_page_smasmall-home-blade-intro') {
        return;
    }
    wp_enqueue_media();
    wp_enqueue_script('jquery-ui-sortable', false, ['jquery', 'jquery-ui-core', 'jquery-ui-mouse', 'jquery-ui-widget'], false, true);
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
    if (!$screen || $screen->id !== 'toplevel_page_smasmall-home-blade-intro') {
        return;
    }
    ?>
    <div id="shbi-crop-overlay" class="shbi-crop-overlay" style="display:none">
        <div class="shbi-crop-modal">
            <div class="shbi-crop-head">
                <strong id="shbi-crop-title">裁切圖片</strong>
                <button type="button" class="button-link" id="shbi-crop-cancel-x" aria-label="關閉">✕</button>
            </div>
            <div class="shbi-crop-body">
                <img id="shbi-crop-image" src="" alt="" />
            </div>
            <div class="shbi-crop-foot">
                <span class="description" id="shbi-crop-hint">拖曳／縮放選取範圍；依原圖解析度輸出。</span>
                <span class="shbi-crop-actions">
                    <button type="button" class="button button-primary" id="shbi-crop-confirm">裁切並使用</button>
                </span>
            </div>
        </div>
    </div>

    <style>
        .shbi-crop-overlay {
            position: fixed;
            inset: 0;
            z-index: 200000;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.72);
        }
        .shbi-crop-modal {
            display: flex;
            flex-direction: column;
            width: min(960px, 94vw);
            max-height: 92vh;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        }
        .shbi-crop-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            border-bottom: 1px solid #dcdcde;
        }
        .shbi-crop-head .button-link { font-size: 16px; text-decoration: none; }
        .shbi-crop-body {
            flex: 1;
            min-height: 320px;
            max-height: calc(92vh - 130px);
            background: #1d2327;
        }
        .shbi-crop-body img { display: block; max-width: 100%; }
        .shbi-crop-foot {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 12px 16px;
            border-top: 1px solid #dcdcde;
        }
        .shbi-crop-actions { display: flex; gap: 8px; }
        .shbi-crop-loading .shbi-crop-actions .button { pointer-events: none; opacity: 0.6; }
    </style>

    <script>
    jQuery(function ($) {
        var $list = $('#shbi-items-list');
        var $tmpl = $('#tmpl-shbi-item');

        /* ============ 互動式裁切彈窗 ============ */
        var CROP_NONCE = '<?php echo esc_js(wp_create_nonce('smasmall_shbi_crop')); ?>';
        var cropper = null;
        var cropSourceUrl = '';
        var cropMime = 'image/jpeg';
        var cropCallback = null;
        var $overlay = $('#shbi-crop-overlay');
        var $cropImg = $('#shbi-crop-image');

        /**
         * @param {string} url 原圖網址
         * @param {Function} cb 完成回呼（傳入結果 URL；取消時不呼叫）
         * @param {string} mime 原圖 MIME
         * @param {number} aspect 裁切比例（16/9 或 1）
         * @param {string} title 彈窗標題
         */
        function openCropModal(url, cb, mime, aspect, title) {
            cropSourceUrl = url;
            cropMime = ['image/jpeg', 'image/png', 'image/webp'].indexOf(mime) !== -1
                ? mime
                : 'image/jpeg';
            cropCallback = cb;
            $('#shbi-crop-title').text(title || '裁切圖片');
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
                aspectRatio: aspect || 16 / 9,
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
            $overlay.hide().removeClass('shbi-crop-loading');
            $cropImg.attr('src', '');
            var cb = cropCallback;
            cropCallback = null;
            if (cb && typeof resultUrl === 'string') {
                cb(resultUrl);
            }
        }

        $('#shbi-crop-cancel-x').on('click', function (e) {
            e.preventDefault();
            closeCropModal(null); // 取消：不套用
        });

        $('#shbi-crop-confirm').on('click', function (e) {
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
            $overlay.addClass('shbi-crop-loading');
            canvas.toBlob(function (blob) {
                if (!blob) {
                    $overlay.removeClass('shbi-crop-loading');
                    alert('裁切輸出失敗，請重試。');
                    return;
                }
                var fd = new FormData();
                var extension = cropMime === 'image/png'
                    ? 'png'
                    : (cropMime === 'image/webp' ? 'webp' : 'jpg');
                fd.append('action', 'smasmall_shbi_crop_upload');
                fd.append('nonce', CROP_NONCE);
                fd.append('image', blob, 'smasmall-crop-' + Date.now() + '.' + extension);

                $.ajax({
                    url: ajaxurl,
                    method: 'POST',
                    data: fd,
                    processData: false,
                    contentType: false
                }).done(function (res) {
                    if (res && res.success && res.data && res.data.url) {
                        closeCropModal(res.data.url);
                    } else {
                        $overlay.removeClass('shbi-crop-loading');
                        alert((res && res.data && res.data.message) || '上傳裁切圖失敗。');
                    }
                }).fail(function () {
                    $overlay.removeClass('shbi-crop-loading');
                    alert('上傳裁切圖失敗，請重試。');
                });
            }, cropMime, 1);
        });

        /** 多張圖逐張裁切（圓形小圖 1:1） */
        function cropQueue(entries, onEach) {
            if (!entries.length) return;
            var rest = entries.slice(1);
            var first = entries[0];
            openCropModal(first.url, function (resultUrl) {
                onEach(resultUrl);
                if (rest.length) {
                    cropQueue(rest, onEach);
                }
            }, first.mime, 1, '裁切圓形小圖（1:1）');
        }
        /* ============ /互動式裁切彈窗 ============ */

        function setBg(url) {
            url = url || '';
            $('#shbi-bg-url').val(url);
            if (url) {
                $('#shbi-bg-preview').attr('src', url).show();
                $('#shbi-bg-placeholder').hide();
            } else {
                $('#shbi-bg-preview').attr('src', '').hide();
                $('#shbi-bg-placeholder').show();
            }
        }

        $('#shbi-pick-bg').on('click', function (e) {
            e.preventDefault();
            if (typeof wp === 'undefined' || !wp.media) {
                alert('媒體庫尚未載入，請重新整理頁面後再試。');
                return;
            }
            var frame = wp.media({
                title: '選擇背景圖',
                button: { text: '使用這張圖' },
                multiple: false,
                library: { type: 'image' }
            });
            frame.on('select', function () {
                var attachment = frame.state().get('selection').first().toJSON();
                if (attachment.url) {
                    openCropModal(attachment.url, setBg, attachment.mime, 16 / 9, '裁切背景圖（16:9）');
                }
            });
            frame.open();
        });

        $('#shbi-clear-bg').on('click', function (e) {
            e.preventDefault();
            setBg('');
        });

        function reindexItems() {
            $list.find('.shbi-item-card').each(function (index) {
                var $card = $(this);
                $card.attr('data-index', index);
                $card.find('[name^="blade_intro[accordion][items]["]').each(function () {
                    this.name = this.name.replace(
                        /blade_intro\[accordion\]\[items\]\[[^\]]+\]/,
                        'blade_intro[accordion][items][' + index + ']'
                    );
                });
                $card.find('.shbi-order').val(index);
            });
            $('#shbi-item-count').text($list.find('.shbi-item-card').length);
        }

        function makeImageItem(url, itemIndex) {
            var $li = $('<li class="shbi-image-item"></li>');
            $li.append('<span class="shbi-image-drag dashicons dashicons-move" title="拖曳排序"></span>');
            $li.append($('<img>', { src: url, alt: '' }));
            $li.append($('<input>', {
                type: 'hidden',
                name: 'blade_intro[accordion][items][' + itemIndex + '][images][]',
                value: url
            }));
            $li.append($('<button>', {
                type: 'button',
                class: 'button-link-delete shbi-remove-image',
                text: '移除'
            }));
            return $li;
        }

        function initImagesSortable($card) {
            var $images = $card.find('.shbi-images-list');
            if (!$images.length || !$.fn.sortable) return;
            if ($images.hasClass('ui-sortable')) {
                $images.sortable('destroy');
            }
            $images.sortable({
                handle: '.shbi-image-drag',
                update: reindexItems
            });
        }

        function bindCard($card) {
            $card.find('.shbi-remove').off('click.shbi').on('click.shbi', function (e) {
                e.preventDefault();
                $card.remove();
                reindexItems();
            });

            $card.find('.shbi-add-images').off('click.shbi').on('click.shbi', function (e) {
                e.preventDefault();
                if (typeof wp === 'undefined' || !wp.media) {
                    alert('媒體庫尚未載入，請重新整理頁面後再試。');
                    return;
                }
                var itemIndex = $card.attr('data-index') || '0';
                var frame = wp.media({
                    title: '新增刀頭圓形小圖',
                    button: { text: '加入小圖' },
                    multiple: true,
                    library: { type: 'image' }
                });
                frame.on('select', function () {
                    var $imagesList = $card.find('.shbi-images-list');
                    var entries = [];
                    frame.state().get('selection').each(function (attachment) {
                        var data = attachment.toJSON();
                        if (data.url) {
                            entries.push({ url: data.url, mime: data.mime });
                        }
                    });
                    if (!entries.length) return;
                    // 每張圖各裁切一次（固定 1:1），裁完即加入列表
                    cropQueue(entries, function (resultUrl) {
                        $imagesList.append(makeImageItem(resultUrl, itemIndex));
                        reindexItems();
                        initImagesSortable($card);
                    });
                });
                frame.open();
            });

            $card.off('click.shbiRemoveImg', '.shbi-remove-image').on('click.shbiRemoveImg', '.shbi-remove-image', function (e) {
                e.preventDefault();
                $(this).closest('.shbi-image-item').remove();
                reindexItems();
            });

            initImagesSortable($card);
        }

        $('#shbi-add-item').on('click', function (e) {
            e.preventDefault();
            if (!$tmpl.length) {
                alert('找不到刀頭項目範本，請重新整理頁面。');
                return;
            }
            var id = 'blade_' + Date.now();
            var index = $list.find('.shbi-item-card').length;
            var html = $tmpl.html()
                .replace(/__SHBI_ID__/g, id)
                .replace(/__SHBI_INDEX__/g, String(index));
            var $card = $(html.trim());
            if (!$card.length) {
                alert('無法建立刀頭項目，請重新整理頁面。');
                return;
            }
            $list.append($card);
            bindCard($card);
            reindexItems();
        });

        if ($.fn.sortable) {
            $list.sortable({ handle: '.shbi-drag', axis: 'y', update: reindexItems });
        }

        $list.find('.shbi-item-card').each(function () {
            bindCard($(this));
        });
        $('#shbi-form').on('submit', reindexItems);
    });
    </script>
    <?php
});

add_action('rest_api_init', function () {
    register_rest_route('smasmall/v1', '/home-blade-intro', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function () {
            $section = smasmall_home_blade_intro_format_for_api(smasmall_home_blade_intro_get());
            if ($section === null) {
                return rest_ensure_response(['section' => null]);
            }
            return rest_ensure_response(['section' => $section]);
        },
    ]);
});
