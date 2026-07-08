<?php
/**
 * SMASMALL — 首頁產品介紹區塊（Code Snippets）
 *
 * - 左側選單：首頁產品介紹
 * - 管理背景圖、副標、標題、描述、產品規格
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

    return [
        'backgroundImage' => esc_url_raw($data['backgroundImage'] ?? ''),
        'subtitle'        => sanitize_text_field($data['subtitle'] ?? ''),
        'title'           => sanitize_text_field($data['title'] ?? ''),
        'description'     => sanitize_textarea_field($data['description'] ?? ''),
        'specs'           => $specs,
    ];
}

add_action('admin_menu', function () {
    add_menu_page(
        '首頁產品介紹',
        '首頁產品介紹',
        'manage_options',
        'smasmall-home-product-intro',
        'smasmall_home_product_intro_render_page',
        'dashicons-products',
        61
    );
});

add_action('admin_post_smasmall_save_home_product_intro', function () {
    if (!current_user_can('manage_options')) {
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

function smasmall_home_product_intro_render_page(): void
{
    if (!current_user_can('manage_options')) {
        return;
    }

    $data = smasmall_home_product_intro_get();
    $specs = is_array($data['specs'] ?? null) ? $data['specs'] : [];
    while (count($specs) < 4) {
        $specs[] = ['label' => '', 'value' => ''];
    }
    $bg = $data['backgroundImage'] ?? '';
    $updated = isset($_GET['updated']);
    ?>
<div class="wrap shpi-admin">
    <h1>首頁產品介紹</h1>
    <p class="description">管理官網首頁 3D 產品特寫區（左下產品資訊、右下說明文字）。儲存後約 1 分鐘內同步至前台。</p>

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
                        <p class="description">建議使用深色、高質感背景圖；3D 模型會疊加在背景上方。</p>
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
        <table class="form-table" role="presentation">
            <?php foreach (array_slice($specs, 0, 4) as $i => $spec) :
                    smasmall_home_product_intro_render_spec_row(is_array($spec) ? $spec : [], $i);
                endforeach; ?>
        </table>

        <?php submit_button('儲存設定', 'primary large'); ?>
    </form>
</div>

<style>
.shpi-admin {
    max-width: 860px;
}

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
            button: {
                text: '使用這張圖'
            },
            multiple: false,
            library: {
                type: 'image'
            }
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