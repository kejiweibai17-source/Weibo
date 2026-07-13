/**
 * SMASMALL — 首頁產品介紹區塊（Code Snippets）
 *
 * - 左側選單：首頁產品介紹
 * - 管理背景圖、副標、標題、描述、產品規格、熱點特色（小圖＋標題＋說明）
 * - 公開 REST：GET /wp-json/smasmall/v1/home-product-intro
 *
 * 貼到 WordPress「Code Snippets」→ Run everywhere → 啟用
 */

if (!defined('ABSPATH')) {
    exit;
}

const SMASMALL_HOME_PRODUCT_INTRO_OPTION = 'smasmall_home_product_intro';

function smasmall_home_product_intro_defaults(): array
{
    return [
        'enabled'         => true,
        'backgroundImage' => '',
        'subtitle'        => '上蓋特寫',
        'title'           => '磁吸防塵保護蓋',
        'description'     => '磁吸式上蓋一貼即合，隔絕灰塵、守護刀頭，收納潔淨衛生。',
        'specs'           => [
            ['label' => '適用機型', 'value' => 'S3 旗艦版刮鬍刀'],
            ['label' => '核心功能', 'value' => '磁吸防塵保護蓋'],
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
    $saved = get_option(SMASMALL_HOME_PRODUCT_INTRO_OPTION, []);
    if (!is_array($saved)) {
        $saved = [];
    }

    $defaults = smasmall_home_product_intro_defaults();
    $merged = array_merge($defaults, $saved);

    if (!is_array($merged['specs'] ?? null)) {
        $merged['specs'] = $defaults['specs'];
    }
    if (!is_array($merged['features'] ?? null) || empty($merged['features'])) {
        $merged['features'] = $defaults['features'];
    }

    return $merged;
}

function smasmall_home_product_intro_sanitize_specs($input): array
{
    if (!is_array($input)) {
        return smasmall_home_product_intro_defaults()['specs'];
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

    return $out ?: smasmall_home_product_intro_defaults()['specs'];
}

function smasmall_home_product_intro_sanitize_features($input): array
{
    if (!is_array($input)) {
        return smasmall_home_product_intro_defaults()['features'];
    }

    $defaults = smasmall_home_product_intro_defaults()['features'];
    $out = [];

    foreach ($input as $index => $row) {
        if (!is_array($row)) {
            continue;
        }

        $title = sanitize_text_field($row['title'] ?? '');
        $description = sanitize_textarea_field($row['description'] ?? '');
        $image = esc_url_raw(trim((string) ($row['image'] ?? '')));
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

    return $out ?: $defaults;
}

function smasmall_home_product_intro_sanitize($input): array
{
    if (!is_array($input)) {
        return smasmall_home_product_intro_defaults();
    }

    $defaults = smasmall_home_product_intro_defaults();

    return [
        'enabled'         => !empty($input['enabled']),
        'backgroundImage' => esc_url_raw(trim((string) ($input['backgroundImage'] ?? ''))),
        'subtitle'        => sanitize_text_field($input['subtitle'] ?? $defaults['subtitle']),
        'title'           => sanitize_text_field($input['title'] ?? $defaults['title']),
        'description'     => sanitize_textarea_field($input['description'] ?? $defaults['description']),
        'specs'           => smasmall_home_product_intro_sanitize_specs($input['specs'] ?? []),
        'features'        => smasmall_home_product_intro_sanitize_features($input['features'] ?? []),
    ];
}

function smasmall_home_product_intro_format_for_api(array $data): ?array
{
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

    if (empty($specs)) {
        return null;
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
            'image'       => esc_url_raw((string) ($row['image'] ?? '')),
            'top'         => sanitize_text_field((string) ($row['top'] ?? '50%')),
            'left'        => sanitize_text_field((string) ($row['left'] ?? '50%')),
            'bgScale'     => (float) ($row['bgScale'] ?? 2.4),
        ];
    }

    return [
        'backgroundImage' => esc_url_raw($data['backgroundImage'] ?? ''),
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
        <p class="description">第一項會以較大字顯示在產品資訊卡片上方。</p>
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
                <button type="button" class="button shpi-pick-feature-image">選擇特色小圖</button>
                <button type="button" class="button-link-delete shpi-clear-feature-image">清除</button>
            </p>
            <p class="description">點擊熱點後右下角卡片會顯示此圖。</p>
        </div>

        <div class="shpi-feature-fields">
            <p>
                <label>標題</label><br />
                <input type="text" class="large-text" name="product_intro[features][<?php echo esc_attr($index_key); ?>][title]"
                    value="<?php echo esc_attr($feature['title'] ?? ''); ?>" placeholder="例如：專利防水推式開關" />
            </p>
            <p>
                <label>說明</label><br />
                <textarea class="large-text" rows="3" name="product_intro[features][<?php echo esc_attr($index_key); ?>][description]"
                    placeholder="例如：獨家防水推動設計，有效防止誤觸，操作更安心。"><?php echo esc_textarea($feature['description'] ?? ''); ?></textarea>
            </p>
            <div class="shpi-feature-pos">
                <p>
                    <label>熱點 Top（%）</label><br />
                    <input type="text" class="small-text" name="product_intro[features][<?php echo esc_attr($index_key); ?>][top]"
                        value="<?php echo esc_attr($feature['top'] ?? '50%'); ?>" placeholder="48%" />
                </p>
                <p>
                    <label>熱點 Left（%）</label><br />
                    <input type="text" class="small-text" name="product_intro[features][<?php echo esc_attr($index_key); ?>][left]"
                        value="<?php echo esc_attr($feature['left'] ?? '50%'); ?>" placeholder="50%" />
                </p>
                <p>
                    <label>放大倍率</label><br />
                    <input type="number" class="small-text" step="0.1" min="1" max="5"
                        name="product_intro[features][<?php echo esc_attr($index_key); ?>][bgScale]"
                        value="<?php echo esc_attr((string) ($feature['bgScale'] ?? 2.4)); ?>" />
                </p>
            </div>
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
    <p class="description">管理官網首頁 3D 產品特寫區：左下產品資訊、點擊熱點後的右下特色卡片（小圖＋標題＋說明）。儲存後約 1 分鐘內同步至前台。</p>

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
                <th scope="row">背景圖</th>
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
                        <p class="description">建議使用深色、高質感背景圖；熱點與 3D／產品圖會疊加在背景上方。</p>
                    </div>
                </td>
            </tr>
            <tr>
                <th scope="row"><label for="shpi-subtitle">副標（小字）</label></th>
                <td><input type="text" class="regular-text" id="shpi-subtitle" name="product_intro[subtitle]"
                        value="<?php echo esc_attr($data['subtitle'] ?? ''); ?>" placeholder="上蓋特寫" /></td>
            </tr>
            <tr>
                <th scope="row"><label for="shpi-title">標題</label></th>
                <td><input type="text" class="large-text" id="shpi-title" name="product_intro[title]"
                        value="<?php echo esc_attr($data['title'] ?? ''); ?>" /></td>
            </tr>
            <tr>
                <th scope="row"><label for="shpi-description">描述</label></th>
                <td><textarea class="large-text" rows="3" id="shpi-description"
                        name="product_intro[description]"><?php echo esc_textarea($data['description'] ?? ''); ?></textarea>
                </td>
            </tr>
        </table>

        <h2>產品資訊卡片（最多 4 項）</h2>
        <p class="description">對應前台左下角「產品資訊」區塊。</p>
        <table class="form-table" role="presentation">
            <?php foreach (array_slice($specs, 0, 4) as $i => $spec) :
                smasmall_home_product_intro_render_spec_row(is_array($spec) ? $spec : [], $i);
            endforeach; ?>
        </table>

        <h2>熱點特色卡片（小圖＋標題＋說明）</h2>
        <p class="description">對應前台閃爍熱點；點擊後右下角顯示特色小圖、標題與說明。可調整熱點位置（Top / Left %）與背景放大倍率。</p>
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
});

add_action('admin_footer', function () {
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || $screen->id !== 'toplevel_page_smasmall-home-product-intro') {
        return;
    }
    ?>
<script>
jQuery(function($) {
    var $list = $('#shpi-features-list');
    var $tmpl = $('#tmpl-shpi-feature');

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
            title: '選擇背景圖',
            button: { text: '使用這張圖' },
            multiple: false,
            library: { type: 'image' }
        });
        frame.on('select', function() {
            var attachment = frame.state().get('selection').first().toJSON();
            setBg(attachment.url || '');
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
                title: '選擇特色小圖',
                button: { text: '使用這張圖' },
                multiple: false,
                library: { type: 'image' }
            });
            frame.on('select', function() {
                var attachment = frame.state().get('selection').first().toJSON();
                setFeatureImage($card, attachment.url || '');
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
