<?php
/**
 * SMASMALL — 首頁 Hero 滾動 Slider（Code Snippets）
 *
 * - 左側選單：首頁 Hero 滾動區
 * - 每張：圖片、標題、說明文字、啟用、拖曳排序
 * - 公開 REST：GET /wp-json/smasmall/v1/hero-slider
 *
 * 貼到 WordPress「Code Snippets」→ Run everywhere → 啟用
 */

if (!defined('ABSPATH')) {
    exit;
}

const SMASMALL_HERO_SLIDER_OPTION = 'smasmall_hero_slider_slides';

add_filter('big_image_size_threshold', '__return_false');

function smasmall_hero_json_encode($data): string
{
    return wp_json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

/** ---------- Admin menu ---------- */
add_action('admin_menu', function () {
    add_menu_page(
        '首頁 Hero 滾動區',
        '首頁 Hero 滾動區',
        'read',
        'smasmall-hero-slider',
        'smasmall_hero_slider_render_page',
        'dashicons-slides',
        57
    );
});

function smasmall_hero_slider_get_slides(): array
{
    $slides = get_option(SMASMALL_HERO_SLIDER_OPTION, []);
    return is_array($slides) ? $slides : [];
}

function smasmall_hero_slider_sanitize_slides($input): array
{
    if (!is_array($input)) {
        return [];
    }

    $out = [];
    foreach ($input as $row) {
        if (!is_array($row)) {
            continue;
        }
        $image = isset($row['image']) ? esc_url_raw(trim((string) $row['image'])) : '';
        $image = preg_replace('/-scaled(\.[^.]+)$/i', '$1', $image);
        $title = isset($row['title']) ? sanitize_text_field((string) $row['title']) : '';
        $description = isset($row['description']) ? sanitize_textarea_field((string) $row['description']) : '';

        if ($image === '' || $title === '') {
            continue;
        }

        $out[] = [
            'id'          => sanitize_key($row['id'] ?? uniqid('hero_', true)),
            'image'       => $image,
            'title'       => $title,
            'description' => $description,
            'enabled'     => !empty($row['enabled']),
            'order'       => isset($row['order']) ? (int) $row['order'] : count($out),
        ];
    }

    usort($out, static function ($a, $b) {
        return ($a['order'] ?? 0) <=> ($b['order'] ?? 0);
    });

    return $out;
}

add_action('admin_init', function () {
    register_setting(
        'smasmall_hero_slider_group',
        SMASMALL_HERO_SLIDER_OPTION,
        [
            'type'              => 'array',
            'sanitize_callback' => 'smasmall_hero_slider_sanitize_slides',
            'default'           => [],
        ]
    );
});

add_action('admin_post_smasmall_save_hero_slider', function () {
    if (!current_user_can('read')) {
        wp_die('Forbidden');
    }
    check_admin_referer('smasmall_hero_slider_save', 'smasmall_hero_slider_nonce');

    $raw = isset($_POST['slides']) && is_array($_POST['slides']) ? wp_unslash($_POST['slides']) : [];
    $slides = smasmall_hero_slider_sanitize_slides($raw);
    update_option(SMASMALL_HERO_SLIDER_OPTION, $slides);

    wp_safe_redirect(add_query_arg(['page' => 'smasmall-hero-slider', 'updated' => '1'], admin_url('admin.php')));
    exit;
});

function smasmall_hero_slider_render_slide_row(array $slide, $index): void
{
    $id = $slide['id'] ?? uniqid('hero_', true);
    $image = $slide['image'] ?? '';
    $title = $slide['title'] ?? '';
    $description = $slide['description'] ?? '';
    $enabled = !isset($slide['enabled']) || !empty($slide['enabled']);
    ?>
    <li class="smhs-slide-card" data-index="<?php echo esc_attr((string) $index); ?>">
        <div class="smhs-card-top">
            <span class="smhs-drag dashicons dashicons-move" title="拖曳排序"></span>
            <span class="smhs-badge">Slide <?php echo esc_html(str_pad((string) ((int) $index + 1), 2, '0', STR_PAD_LEFT)); ?></span>
            <label class="smhs-enabled">
                <input type="checkbox" name="slides[<?php echo esc_attr((string) $index); ?>][enabled]" value="1" <?php checked($enabled); ?> />
                前台顯示
            </label>
        </div>
        <div class="smhs-card-body">
            <div class="smhs-preview">
                <?php if ($image) : ?>
                    <img src="<?php echo esc_url($image); ?>" alt="" />
                <?php else : ?>
                    <div class="smhs-preview-empty">
                        <span class="dashicons dashicons-format-image"></span>
                        <span>尚未選擇圖片</span>
                    </div>
                <?php endif; ?>
                <button type="button" class="button button-secondary smhs-pick-image"><?php echo $image ? '更換圖片' : '從媒體庫選擇'; ?></button>
            </div>
            <div class="smhs-fields">
                <input type="hidden" name="slides[<?php echo esc_attr((string) $index); ?>][id]" value="<?php echo esc_attr($id); ?>" class="smhs-id" />
                <input type="hidden" name="slides[<?php echo esc_attr((string) $index); ?>][image]" value="<?php echo esc_attr($image); ?>" class="smhs-image-url" />
                <input type="hidden" name="slides[<?php echo esc_attr((string) $index); ?>][order]" value="<?php echo esc_attr((string) ($slide['order'] ?? $index)); ?>" class="smhs-order" />
                <label class="smhs-label">標題 <span class="required">*</span></label>
                <input type="text" class="large-text smhs-title" name="slides[<?php echo esc_attr((string) $index); ?>][title]" value="<?php echo esc_attr($title); ?>" placeholder="例：獨創全合金壓鑄機身" />
                <label class="smhs-label">說明文字</label>
                <textarea class="large-text smhs-description" name="slides[<?php echo esc_attr((string) $index); ?>][description]" rows="4" placeholder="左側文字區塊的段落說明"><?php echo esc_textarea($description); ?></textarea>
            </div>
        </div>
        <div class="smhs-card-footer">
            <button type="button" class="button-link-delete smhs-remove">移除此 Slide</button>
        </div>
    </li>
    <?php
}

function smasmall_hero_slider_render_page(): void
{
    if (!current_user_can('read')) {
        return;
    }

    $slides = smasmall_hero_slider_get_slides();
    $updated = isset($_GET['updated']);
    ?>
    <div class="wrap smasmall-hero-slider-admin">
        <header class="smhs-page-header">
            <div>
                <h1>首頁 Hero 滾動區</h1>
                <p class="description">管理官網首頁 GSAP 全螢幕滾動 Slider（圖片 + 標題 + 說明）。建議橫圖 1920×1080，儲存後約 1 分鐘同步至前台。</p>
            </div>
            <div class="smhs-header-meta">
                <span class="smhs-pill">REST: <code>/wp-json/smasmall/v1/hero-slider</code></span>
            </div>
        </header>

        <?php if ($updated) : ?>
            <div class="notice notice-success is-dismissible"><p>已儲存 Hero Slider 設定。</p></div>
        <?php endif; ?>

        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" id="smasmall-hero-slider-form">
            <input type="hidden" name="action" value="smasmall_save_hero_slider" />
            <?php wp_nonce_field('smasmall_hero_slider_save', 'smasmall_hero_slider_nonce'); ?>

            <div class="smhs-toolbar">
                <button type="button" class="button button-primary button-hero" id="smhs-add-slide">
                    <span class="dashicons dashicons-plus-alt2"></span> 新增 Slide
                </button>
                <span class="smhs-count">共 <strong id="smhs-slide-count"><?php echo count($slides); ?></strong> 張</span>
            </div>

            <ul id="smhs-slides-list" class="smhs-slides-list">
                <?php foreach ($slides as $i => $slide) :
                    smasmall_hero_slider_render_slide_row($slide, $i);
                endforeach; ?>
            </ul>

            <p class="smhs-empty-hint" <?php echo $slides ? 'style="display:none"' : ''; ?> id="smhs-empty-hint">
                尚無 Slide，請點「新增 Slide」開始設定。
            </p>

            <div class="smhs-form-footer">
                <?php submit_button('儲存 Hero Slider', 'primary large', 'submit', false); ?>
            </div>
        </form>
    </div>

    <div id="tmpl-smhs-slide-row" class="hidden" style="display:none" aria-hidden="true">
        <?php smasmall_hero_slider_render_slide_row([
            'id' => '__SMHS_ID__',
            'image' => '',
            'title' => '',
            'description' => '',
            'enabled' => true,
            'order' => 0,
        ], '__SMHS_INDEX__'); ?>
    </div>

    <?php smasmall_hero_slider_admin_styles(); ?>
    <?php
}

function smasmall_hero_slider_admin_styles(): void
{
    ?>
    <style>
        .smasmall-hero-slider-admin { max-width: 1100px; }
        .smhs-page-header {
            display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start;
            gap: 16px; margin-bottom: 20px; padding: 24px 28px;
            background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #0ea5e9 120%);
            border-radius: 12px; color: #f8fafc; box-shadow: 0 12px 40px rgba(15,23,42,.18);
        }
        .smhs-page-header h1 { color: #fff; margin: 0 0 8px; font-size: 1.6rem; }
        .smhs-page-header .description { color: rgba(248,250,252,.85); margin: 0; max-width: 560px; }
        .smhs-pill {
            display: inline-block; padding: 6px 12px; background: rgba(255,255,255,.12);
            border-radius: 999px; font-size: 12px;
        }
        .smhs-pill code { background: transparent; color: #e0f2fe; }
        .smhs-toolbar { display: flex; align-items: center; gap: 16px; margin: 24px 0 16px; }
        .smhs-toolbar .button-hero .dashicons { margin-top: 8px; margin-right: 4px; }
        .smhs-count { color: #64748b; font-size: 14px; }
        .smhs-slides-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 16px; }
        .smhs-slide-card {
            background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
            box-shadow: 0 1px 3px rgba(15,23,42,.06); overflow: hidden;
        }
        .smhs-slide-card.ui-sortable-helper { box-shadow: 0 16px 40px rgba(15,23,42,.15); }
        .smhs-card-top {
            display: flex; align-items: center; gap: 12px; padding: 12px 16px;
            background: #f8fafc; border-bottom: 1px solid #e2e8f0;
        }
        .smhs-drag { cursor: grab; color: #94a3b8; }
        .smhs-badge {
            font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
            color: #0369a1; background: #e0f2fe; padding: 4px 10px; border-radius: 999px;
        }
        .smhs-enabled { margin-left: auto; display: flex; align-items: center; gap: 6px; font-weight: 500; font-size: 13px; }
        .smhs-card-body {
            display: grid; grid-template-columns: 220px 1fr; gap: 20px; padding: 20px;
        }
        @media (max-width: 782px) { .smhs-card-body { grid-template-columns: 1fr; } }
        .smhs-preview img {
            width: 100%; height: 124px; object-fit: cover; border-radius: 8px; background: #0f172a;
        }
        .smhs-preview-empty {
            height: 124px; border-radius: 8px; background: #f1f5f9; border: 2px dashed #cbd5e1;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            gap: 6px; color: #94a3b8; font-size: 12px;
        }
        .smhs-preview .button { margin-top: 10px; width: 100%; justify-content: center; }
        .smhs-label { display: block; font-weight: 600; margin: 0 0 6px; font-size: 12px; color: #334155; }
        .smhs-label .required { color: #dc2626; }
        .smhs-fields .large-text { margin-bottom: 14px; border-radius: 6px; }
        .smhs-card-footer { padding: 0 20px 16px; text-align: right; }
        .smhs-empty-hint {
            padding: 32px; text-align: center; color: #64748b; background: #f8fafc;
            border: 2px dashed #e2e8f0; border-radius: 12px;
        }
        .smhs-form-footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
    </style>
    <?php
}

function smasmall_hero_slider_admin_footer_script(): void
{
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || $screen->id !== 'toplevel_page_smasmall-hero-slider') {
        return;
    }
    ?>
    <script>
    jQuery(function ($) {
        var $list = $('#smhs-slides-list');
        var $tmpl = $('#tmpl-smhs-slide-row');

        function reindexSlides() {
            $list.find('.smhs-slide-card').each(function (i) {
                var $card = $(this);
                $card.attr('data-index', i);
                $card.find('.smhs-order').val(i);
                $card.find('.smhs-badge').text('Slide ' + String(i + 1).padStart(2, '0'));
                $card.find('[name^="slides["]').each(function () {
                    var name = $(this).attr('name');
                    if (!name) return;
                    $(this).attr('name', name.replace(/slides\[[^\]]+\]/, 'slides[' + i + ']'));
                });
            });
            $('#smhs-slide-count').text($list.find('.smhs-slide-card').length);
            $('#smhs-empty-hint').toggle($list.find('.smhs-slide-card').length === 0);
        }

        function bindCard($card) {
            $card.find('.smhs-pick-image').off('click.smhs').on('click.smhs', function (e) {
                e.preventDefault();
                if (typeof wp === 'undefined' || !wp.media) {
                    alert('媒體庫尚未載入，請重新整理後再試。');
                    return;
                }
                var frame = wp.media({
                    title: '選擇 Hero 背景圖',
                    button: { text: '使用這張圖片' },
                    multiple: false,
                    library: { type: 'image' }
                });
                frame.on('select', function () {
                    var data = frame.state().get('selection').first().toJSON();
                    var url = data.originalImageURL || data.originalUrl || '';
                    if (!url && data.sizes && data.sizes.full) url = data.sizes.full.url;
                    if (!url) url = data.url || '';
                    url = url.replace(/-scaled(\.(jpe?g|png|gif|webp))/i, '$1');
                    $card.find('.smhs-image-url').val(url);
                    $card.find('.smhs-preview').html(
                        $('<img>', { src: url, alt: '' }).add(
                            $('<button>', { type: 'button', class: 'button button-secondary smhs-pick-image', text: '更換圖片' })
                        )
                    );
                    bindCard($card);
                });
                frame.open();
            });
            $card.find('.smhs-remove').off('click.smhs').on('click.smhs', function (e) {
                e.preventDefault();
                if (confirm('確定移除此 Slide？')) {
                    $card.remove();
                    reindexSlides();
                }
            });
        }

        if ($.fn.sortable) {
            $list.sortable({ handle: '.smhs-drag', axis: 'y', update: reindexSlides });
        }

        $('#smhs-add-slide').on('click', function (e) {
            e.preventDefault();
            var id = 'hero_' + Date.now();
            var index = $list.find('.smhs-slide-card').length;
            var html = $tmpl.html().replace(/__SMHS_ID__/g, id).replace(/__SMHS_INDEX__/g, String(index));
            var $card = $(html.trim());
            $list.append($card);
            bindCard($card);
            reindexSlides();
        });

        $list.find('.smhs-slide-card').each(function () { bindCard($(this)); });
        $('#smasmall-hero-slider-form').on('submit', reindexSlides);
    });
    </script>
    <?php
}

/** ---------- REST API ---------- */
add_action('rest_api_init', function () {
    register_rest_route('smasmall/v1', '/hero-slider', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function () {
            $slides = smasmall_hero_slider_get_slides();
            $out = [];

            foreach ($slides as $slide) {
                if (empty($slide['image']) || empty($slide['title'])) {
                    continue;
                }
                if (isset($slide['enabled']) && !$slide['enabled']) {
                    continue;
                }
                $image = preg_replace('/-scaled(\.[^.]+)$/i', '$1', (string) $slide['image']);
                $out[] = [
                    'image'       => esc_url_raw($image),
                    'title'       => sanitize_text_field($slide['title'] ?? ''),
                    'description' => sanitize_textarea_field($slide['description'] ?? ''),
                    'order'       => (int) ($slide['order'] ?? 0),
                ];
            }

            usort($out, static function ($a, $b) {
                return ($a['order'] ?? 0) <=> ($b['order'] ?? 0);
            });

            $out = array_map(static function ($item) {
                unset($item['order']);
                return $item;
            }, $out);

            return rest_ensure_response(['slides' => $out]);
        },
    ]);
});

add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook !== 'toplevel_page_smasmall-hero-slider') {
        return;
    }
    wp_enqueue_media();
    wp_enqueue_script('jquery-ui-sortable');
});

add_action('admin_footer', 'smasmall_hero_slider_admin_footer_script');
