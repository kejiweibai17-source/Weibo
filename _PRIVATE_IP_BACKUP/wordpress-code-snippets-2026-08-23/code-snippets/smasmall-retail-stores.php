<?php
/**
 * SMASMALL — 全台門市據點（Code Snippets）
 *
 * 後台：左側選單「全台門市據點」→ 新增／編輯門市卡片（拖曳排序、啟用）
 * 公開 REST：GET /wp-json/smasmall/v1/retail-stores
 *
 * 貼到 WordPress「Code Snippets」→ Run everywhere → 啟用
 */

if (!defined('ABSPATH')) {
    exit;
}

if (defined('SMASMALL_RETAIL_STORES_LOADED')) {
    return;
}
define('SMASMALL_RETAIL_STORES_LOADED', true);

const SMASMALL_RETAIL_STORES_OPTION = 'smasmall_retail_stores';

const SMASMALL_RETAIL_REGIONS = ['北部', '中部', '南部', '東部', '離島'];

function smasmall_retail_stores_json_encode($data): string
{
    return wp_json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

function smasmall_retail_stores_default_items(): array
{
    return [
        [
            'id'      => 'weiz-chiayi',
            'name'    => 'WEiZ 嘉義秀泰店',
            'brand'   => 'WEiZ 精品3C',
            'region'  => '中部',
            'city'    => '嘉義市',
            'address' => '嘉義市西區文化路299號1樓（嘉義秀泰生活）',
            'phone'   => '05-3208040',
            'hours'   => '每日 11:00 – 22:00',
            'note'    => '威柏科技旗下選物店，可體驗昔馬刮鬍刀系列',
            'mapsUrl' => 'https://maps.app.goo.gl/pAuMevHryYvVAh4E7',
            'enabled' => true,
            'order'   => 0,
        ],
        [
            'id'      => 'weiz-taichung',
            'name'    => 'WEiZ 台中文心秀泰店',
            'brand'   => 'WEiZ 精品3C',
            'region'  => '中部',
            'city'    => '台中市',
            'address' => '台中市南屯區文心南路289號1樓（文心秀泰生活）',
            'phone'   => '04-37048488',
            'hours'   => '平日 11:00 – 22:00｜假日 10:30 – 22:00',
            'note'    => '威柏科技旗下選物店，可體驗昔馬刮鬍刀系列',
            'mapsUrl' => 'https://maps.app.goo.gl/W7Bg4iXpCRWBQ2Ke6',
            'enabled' => true,
            'order'   => 1,
        ],
        [
            'id'      => 'jc-taichung',
            'name'    => 'JC科技 台中公益店',
            'brand'   => 'JC科技官方旗艦店',
            'region'  => '中部',
            'city'    => '台中市',
            'address' => '台中市西區公益路188-1號',
            'phone'   => '04-2326-5611',
            'hours'   => '每日 12:00 – 22:00',
            'note'    => '昔馬 SMASMALL 授權經銷，建議前往前致電確認庫存',
            'mapsUrl' => '',
            'enabled' => true,
            'order'   => 2,
        ],
        [
            'id'      => 'weiz-kaohsiung',
            'name'    => 'WEiZ 高雄岡山樂購店',
            'brand'   => 'WEiZ 精品3C',
            'region'  => '南部',
            'city'    => '高雄市',
            'address' => '高雄市岡山區捷安路1巷2號1樓（岡山樂購廣場）',
            'phone'   => '07-9715557',
            'hours'   => '每日 11:00 – 22:00',
            'note'    => '威柏科技旗下選物店，可體驗昔馬刮鬍刀系列',
            'mapsUrl' => 'https://maps.app.goo.gl/DkKuRovqTmFEJRvb9',
            'enabled' => true,
            'order'   => 3,
        ],
    ];
}

function smasmall_retail_stores_get_items(): array
{
    $items = get_option(SMASMALL_RETAIL_STORES_OPTION, null);
    if ($items === null) {
        $defaults = smasmall_retail_stores_default_items();
        update_option(SMASMALL_RETAIL_STORES_OPTION, $defaults, false);
        return $defaults;
    }
    return is_array($items) ? $items : [];
}

function smasmall_retail_stores_sanitize_region(string $region): string
{
    $region = sanitize_text_field($region);
    if (in_array($region, SMASMALL_RETAIL_REGIONS, true)) {
        return $region;
    }
    return '中部';
}

function smasmall_retail_stores_sanitize_items($input): array
{
    if (!is_array($input)) {
        return [];
    }

    $out = [];
    foreach ($input as $row) {
        if (!is_array($row)) {
            continue;
        }

        $name = isset($row['name']) ? sanitize_text_field((string) $row['name']) : '';
        $brand = isset($row['brand']) ? sanitize_text_field((string) $row['brand']) : '';
        $city = isset($row['city']) ? sanitize_text_field((string) $row['city']) : '';
        $address = isset($row['address']) ? sanitize_textarea_field((string) $row['address']) : '';
        $phone = isset($row['phone']) ? sanitize_text_field((string) $row['phone']) : '';
        $hours = isset($row['hours']) ? sanitize_text_field((string) $row['hours']) : '';

        if ($name === '' || $brand === '' || $city === '' || $address === '' || $phone === '' || $hours === '') {
            continue;
        }

        $id = sanitize_key((string) ($row['id'] ?? uniqid('store_', true)));
        if ($id === '') {
            $id = uniqid('store_', true);
        }

        $mapsUrl = isset($row['mapsUrl']) ? esc_url_raw(trim((string) $row['mapsUrl'])) : '';
        $note = isset($row['note']) ? sanitize_textarea_field((string) $row['note']) : '';

        $out[] = [
            'id'      => $id,
            'name'    => $name,
            'brand'   => $brand,
            'region'  => smasmall_retail_stores_sanitize_region((string) ($row['region'] ?? '中部')),
            'city'    => $city,
            'address' => $address,
            'phone'   => $phone,
            'hours'   => $hours,
            'note'    => $note,
            'mapsUrl' => $mapsUrl,
            'enabled' => !empty($row['enabled']),
            'order'   => isset($row['order']) ? (int) $row['order'] : count($out),
        ];
    }

    usort($out, static function ($a, $b) {
        return ($a['order'] ?? 0) <=> ($b['order'] ?? 0);
    });

    return $out;
}

/** ---------- Admin menu ---------- */
add_action('admin_menu', function () {
    add_menu_page(
        '全台門市據點',
        '全台門市據點',
        'read',
        'smasmall-retail-stores',
        'smasmall_retail_stores_render_page',
        'dashicons-store',
        58
    );
});

add_action('admin_init', function () {
    register_setting(
        'smasmall_retail_stores_group',
        SMASMALL_RETAIL_STORES_OPTION,
        [
            'type'              => 'array',
            'sanitize_callback' => 'smasmall_retail_stores_sanitize_items',
            'default'           => smasmall_retail_stores_default_items(),
        ]
    );
});

add_action('admin_post_smasmall_save_retail_stores', function () {
    if (!current_user_can('read')) {
        wp_die('Forbidden');
    }
    check_admin_referer('smasmall_retail_stores_save', 'smasmall_retail_stores_nonce');

    $raw = isset($_POST['stores']) && is_array($_POST['stores']) ? wp_unslash($_POST['stores']) : [];
    $stores = smasmall_retail_stores_sanitize_items($raw);
    update_option(SMASMALL_RETAIL_STORES_OPTION, $stores);

    wp_safe_redirect(add_query_arg(['page' => 'smasmall-retail-stores', 'updated' => '1'], admin_url('admin.php')));
    exit;
});

add_action('admin_post_smasmall_import_retail_stores_defaults', function () {
    if (!current_user_can('read')) {
        wp_die('Forbidden');
    }
    check_admin_referer('smasmall_retail_stores_import', 'smasmall_retail_stores_import_nonce');

    update_option(SMASMALL_RETAIL_STORES_OPTION, smasmall_retail_stores_default_items());

    wp_safe_redirect(add_query_arg(['page' => 'smasmall-retail-stores', 'imported' => '1'], admin_url('admin.php')));
    exit;
});

function smasmall_retail_stores_render_store_row(array $store, $index): void
{
    $id = $store['id'] ?? uniqid('store_', true);
    $enabled = !isset($store['enabled']) || !empty($store['enabled']);
    $region = $store['region'] ?? '中部';
    ?>
    <li class="smrs-store-card" data-index="<?php echo esc_attr((string) $index); ?>">
        <div class="smrs-card-top">
            <span class="smrs-drag dashicons dashicons-move" title="拖曳排序"></span>
            <span class="smrs-badge">門市 <?php echo esc_html(str_pad((string) ((int) $index + 1), 2, '0', STR_PAD_LEFT)); ?></span>
            <label class="smrs-enabled">
                <input type="checkbox" name="stores[<?php echo esc_attr((string) $index); ?>][enabled]" value="1" <?php checked($enabled); ?> />
                前台顯示
            </label>
        </div>

        <div class="smrs-card-body">
            <input type="hidden" name="stores[<?php echo esc_attr((string) $index); ?>][id]" value="<?php echo esc_attr($id); ?>" class="smrs-id" />
            <input type="hidden" name="stores[<?php echo esc_attr((string) $index); ?>][order]" value="<?php echo esc_attr((string) ($store['order'] ?? $index)); ?>" class="smrs-order" />

            <div class="smrs-grid">
                <div class="smrs-field smrs-field-full">
                    <label class="smrs-label">門市名稱 <span class="required">*</span></label>
                    <input type="text" class="large-text" name="stores[<?php echo esc_attr((string) $index); ?>][name]" value="<?php echo esc_attr($store['name'] ?? ''); ?>" placeholder="例：WEiZ 高雄岡山樂購店" />
                </div>

                <div class="smrs-field">
                    <label class="smrs-label">品牌標籤 <span class="required">*</span></label>
                    <input type="text" class="large-text" name="stores[<?php echo esc_attr((string) $index); ?>][brand]" value="<?php echo esc_attr($store['brand'] ?? ''); ?>" placeholder="例：WEiZ 精品3C" />
                </div>

                <div class="smrs-field">
                    <label class="smrs-label">區域 <span class="required">*</span></label>
                    <select name="stores[<?php echo esc_attr((string) $index); ?>][region]" class="regular-text">
                        <?php foreach (SMASMALL_RETAIL_REGIONS as $regionOption) : ?>
                            <option value="<?php echo esc_attr($regionOption); ?>" <?php selected($region, $regionOption); ?>>
                                <?php echo esc_html($regionOption); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="smrs-field">
                    <label class="smrs-label">縣市 <span class="required">*</span></label>
                    <input type="text" class="large-text" name="stores[<?php echo esc_attr((string) $index); ?>][city]" value="<?php echo esc_attr($store['city'] ?? ''); ?>" placeholder="例：高雄市" />
                </div>

                <div class="smrs-field smrs-field-full">
                    <label class="smrs-label">地址 <span class="required">*</span></label>
                    <textarea class="large-text" name="stores[<?php echo esc_attr((string) $index); ?>][address]" rows="2" placeholder="完整地址"><?php echo esc_textarea($store['address'] ?? ''); ?></textarea>
                </div>

                <div class="smrs-field">
                    <label class="smrs-label">電話 <span class="required">*</span></label>
                    <input type="text" class="large-text" name="stores[<?php echo esc_attr((string) $index); ?>][phone]" value="<?php echo esc_attr($store['phone'] ?? ''); ?>" placeholder="例：07-9715557" />
                </div>

                <div class="smrs-field">
                    <label class="smrs-label">營業時間 <span class="required">*</span></label>
                    <input type="text" class="large-text" name="stores[<?php echo esc_attr((string) $index); ?>][hours]" value="<?php echo esc_attr($store['hours'] ?? ''); ?>" placeholder="例：每日 11:00 – 22:00" />
                </div>

                <div class="smrs-field smrs-field-full">
                    <label class="smrs-label">Google Maps 連結</label>
                    <input type="url" class="large-text" name="stores[<?php echo esc_attr((string) $index); ?>][mapsUrl]" value="<?php echo esc_attr($store['mapsUrl'] ?? ''); ?>" placeholder="https://maps.app.goo.gl/..." />
                    <p class="description">留空時，前台會以地址自動產生 Google 地圖搜尋連結。</p>
                </div>

                <div class="smrs-field smrs-field-full">
                    <label class="smrs-label">備註說明</label>
                    <textarea class="large-text" name="stores[<?php echo esc_attr((string) $index); ?>][note]" rows="2" placeholder="例：威柏科技旗下選物店，可體驗昔馬刮鬍刀系列"><?php echo esc_textarea($store['note'] ?? ''); ?></textarea>
                </div>
            </div>
        </div>

        <div class="smrs-card-footer">
            <button type="button" class="button-link-delete smrs-remove">移除此門市</button>
        </div>
    </li>
    <?php
}

function smasmall_retail_stores_render_page(): void
{
    if (!current_user_can('read')) {
        return;
    }

    $stores = smasmall_retail_stores_get_items();
    $updated = isset($_GET['updated']);
    $imported = isset($_GET['imported']);
    ?>
    <div class="wrap smasmall-retail-stores-admin">
        <header class="smrs-page-header">
            <div>
                <h1>全台門市據點</h1>
                <p class="description">管理官網「全台門市」頁面的門市卡片。儲存後約 1 分鐘同步至 Next.js 前台（REST API）。</p>
            </div>
            <div class="smrs-header-meta">
                <span class="smrs-pill">REST: <code>/wp-json/smasmall/v1/retail-stores</code></span>
            </div>
        </header>

        <?php if ($updated) : ?>
            <div class="notice notice-success is-dismissible"><p>已儲存門市設定。</p></div>
        <?php endif; ?>
        <?php if ($imported) : ?>
            <div class="notice notice-success is-dismissible"><p>已匯入預設門市資料。</p></div>
        <?php endif; ?>

        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" id="smasmall-retail-stores-form">
            <input type="hidden" name="action" value="smasmall_save_retail_stores" />
            <?php wp_nonce_field('smasmall_retail_stores_save', 'smasmall_retail_stores_nonce'); ?>

            <div class="smrs-toolbar">
                <button type="button" class="button button-primary button-hero" id="smrs-add-store">
                    <span class="dashicons dashicons-plus-alt2"></span> 新增門市
                </button>
                <span class="smrs-count">共 <strong id="smrs-store-count"><?php echo count($stores); ?></strong> 間</span>
            </div>

            <ul id="smrs-stores-list" class="smrs-stores-list">
                <?php foreach ($stores as $i => $store) :
                    smasmall_retail_stores_render_store_row($store, $i);
                endforeach; ?>
            </ul>

            <p class="smrs-empty-hint" <?php echo $stores ? 'style="display:none"' : ''; ?> id="smrs-empty-hint">
                尚無門市，請點「新增門市」或使用下方「匯入預設門市」。
            </p>

            <div class="smrs-form-footer">
                <?php submit_button('儲存門市設定', 'primary large', 'submit', false); ?>
            </div>
        </form>

        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="smrs-import-form" onsubmit="return confirm('將覆寫目前所有門市資料，確定匯入預設門市？');">
            <input type="hidden" name="action" value="smasmall_import_retail_stores_defaults" />
            <?php wp_nonce_field('smasmall_retail_stores_import', 'smasmall_retail_stores_import_nonce'); ?>
            <?php submit_button('匯入預設門市（4 間）', 'secondary', 'submit', false); ?>
        </form>
    </div>

    <div id="tmpl-smrs-store-row" class="hidden" style="display:none" aria-hidden="true">
        <?php smasmall_retail_stores_render_store_row([
            'id'      => '__SMRS_ID__',
            'name'    => '',
            'brand'   => '',
            'region'  => '中部',
            'city'    => '',
            'address' => '',
            'phone'   => '',
            'hours'   => '',
            'note'    => '',
            'mapsUrl' => '',
            'enabled' => true,
            'order'   => 0,
        ], '__SMRS_INDEX__'); ?>
    </div>

    <?php smasmall_retail_stores_admin_styles(); ?>
    <?php
}

function smasmall_retail_stores_admin_styles(): void
{
    ?>
    <style>
        .smasmall-retail-stores-admin { max-width: 960px; }
        .smrs-page-header {
            display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start;
            gap: 16px; margin-bottom: 20px; padding: 24px 28px;
            background: linear-gradient(135deg, #111827 0%, #1f2937 55%, #0891b2 120%);
            border-radius: 12px; color: #f8fafc; box-shadow: 0 12px 40px rgba(15,23,42,.18);
        }
        .smrs-page-header h1 { color: #fff; margin: 0 0 8px; font-size: 1.6rem; }
        .smrs-page-header .description { color: rgba(248,250,252,.85); margin: 0; max-width: 560px; }
        .smrs-pill {
            display: inline-block; padding: 6px 12px; background: rgba(255,255,255,.12);
            border-radius: 999px; font-size: 12px;
        }
        .smrs-pill code { background: transparent; color: #e0f2fe; }
        .smrs-toolbar { display: flex; align-items: center; gap: 16px; margin: 24px 0 16px; }
        .smrs-toolbar .button-hero .dashicons { margin-top: 8px; margin-right: 4px; }
        .smrs-count { color: #64748b; font-size: 14px; }
        .smrs-stores-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 16px; }
        .smrs-store-card {
            background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
            box-shadow: 0 1px 3px rgba(15,23,42,.06); overflow: hidden;
        }
        .smrs-store-card.ui-sortable-helper { box-shadow: 0 16px 40px rgba(15,23,42,.15); }
        .smrs-card-top {
            display: flex; align-items: center; gap: 12px; padding: 12px 16px;
            background: #f8fafc; border-bottom: 1px solid #e2e8f0;
        }
        .smrs-drag { cursor: grab; color: #94a3b8; }
        .smrs-badge {
            font-size: 11px; font-weight: 700; letter-spacing: .06em;
            color: #0e7490; background: #cffafe; padding: 4px 10px; border-radius: 999px;
        }
        .smrs-enabled { margin-left: auto; display: flex; align-items: center; gap: 6px; font-weight: 500; font-size: 13px; }
        .smrs-card-body { padding: 20px; }
        .smrs-grid {
            display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 20px;
        }
        .smrs-field-full { grid-column: 1 / -1; }
        @media (max-width: 782px) { .smrs-grid { grid-template-columns: 1fr; } }
        .smrs-label { display: block; font-weight: 600; margin: 0 0 6px; font-size: 12px; color: #334155; }
        .smrs-label .required { color: #dc2626; }
        .smrs-field .large-text, .smrs-field .regular-text { width: 100%; border-radius: 6px; }
        .smrs-field .description { margin: 6px 0 0; color: #64748b; font-size: 12px; }
        .smrs-card-footer { padding: 0 20px 16px; text-align: right; }
        .smrs-empty-hint {
            padding: 32px; text-align: center; color: #64748b; background: #f8fafc;
            border: 2px dashed #e2e8f0; border-radius: 12px;
        }
        .smrs-form-footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
        .smrs-import-form { margin-top: 16px; }
    </style>
    <?php
}

function smasmall_retail_stores_admin_footer_script(): void
{
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || $screen->id !== 'toplevel_page_smasmall-retail-stores') {
        return;
    }
    ?>
    <script>
    jQuery(function ($) {
        var $list = $('#smrs-stores-list');
        var $tmpl = $('#tmpl-smrs-store-row');
        var $hint = $('#smrs-empty-hint');
        var $count = $('#smrs-store-count');

        function reindexStores() {
            $list.find('.smrs-store-card').each(function (idx) {
                var $card = $(this);
                $card.attr('data-index', idx);
                $card.find('.smrs-badge').text('門市 ' + String(idx + 1).padStart(2, '0'));
                $card.find('.smrs-order').val(idx);
                $card.find('[name^="stores["]').each(function () {
                    var name = $(this).attr('name');
                    if (!name) return;
                    $(this).attr('name', name.replace(/stores\[\d+\]/, 'stores[' + idx + ']'));
                });
            });
            $count.text($list.find('.smrs-store-card').length);
            $hint.toggle($list.find('.smrs-store-card').length === 0);
        }

        function bindCard($card) {
            $card.find('.smrs-remove').on('click', function (e) {
                e.preventDefault();
                if (!confirm('確定移除此門市？')) return;
                $card.remove();
                reindexStores();
            });
        }

        if ($list.length && $.fn.sortable) {
            $list.sortable({
                handle: '.smrs-drag',
                axis: 'y',
                update: reindexStores,
            });
        }

        $('#smrs-add-store').on('click', function (e) {
            e.preventDefault();
            var id = 'store_' + Date.now();
            var index = $list.find('.smrs-store-card').length;
            var html = $tmpl.html().replace(/__SMRS_ID__/g, id).replace(/__SMRS_INDEX__/g, String(index));
            var $card = $(html.trim());
            $list.append($card);
            bindCard($card);
            reindexStores();
        });

        $list.find('.smrs-store-card').each(function () { bindCard($(this)); });
        $('#smasmall-retail-stores-form').on('submit', reindexStores);
    });
    </script>
    <?php
}

/** ---------- REST API ---------- */
add_action('rest_api_init', function () {
    register_rest_route('smasmall/v1', '/retail-stores', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function () {
            $stores = smasmall_retail_stores_get_items();
            $out = [];

            foreach ($stores as $store) {
                if (empty($store['enabled'])) {
                    continue;
                }
                if (empty($store['name']) || empty($store['address'])) {
                    continue;
                }

                $item = [
                    'id'      => sanitize_key($store['id'] ?? uniqid('store_', true)),
                    'name'    => sanitize_text_field($store['name'] ?? ''),
                    'brand'   => sanitize_text_field($store['brand'] ?? ''),
                    'region'  => smasmall_retail_stores_sanitize_region((string) ($store['region'] ?? '中部')),
                    'city'    => sanitize_text_field($store['city'] ?? ''),
                    'address' => sanitize_textarea_field($store['address'] ?? ''),
                    'phone'   => sanitize_text_field($store['phone'] ?? ''),
                    'hours'   => sanitize_text_field($store['hours'] ?? ''),
                    'note'    => sanitize_textarea_field($store['note'] ?? ''),
                    'mapsUrl' => esc_url_raw($store['mapsUrl'] ?? ''),
                    'order'   => (int) ($store['order'] ?? 0),
                ];

                if ($item['mapsUrl'] === '') {
                    unset($item['mapsUrl']);
                }
                if ($item['note'] === '') {
                    unset($item['note']);
                }

                $out[] = $item;
            }

            usort($out, static function ($a, $b) {
                return ($a['order'] ?? 0) <=> ($b['order'] ?? 0);
            });

            $out = array_map(static function ($item) {
                unset($item['order']);
                return $item;
            }, $out);

            return rest_ensure_response(['stores' => $out]);
        },
    ]);
});

add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook !== 'toplevel_page_smasmall-retail-stores') {
        return;
    }
    wp_enqueue_script('jquery-ui-sortable');
});

add_action('admin_footer', 'smasmall_retail_stores_admin_footer_script');
