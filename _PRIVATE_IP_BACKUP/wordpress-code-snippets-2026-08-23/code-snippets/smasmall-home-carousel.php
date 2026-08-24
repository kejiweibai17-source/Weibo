<?php
/**
 * SMASMALL — 首頁底部圖片輪播（Code Snippets）
 * - 左側選單：首頁底部圖片輪播
 * - 媒體庫上傳、拖曳排序、啟用開關
 * - 公開 REST：GET /wp-json/smasmall/v1/home-carousel
 *
 * 貼到 WordPress「Code Snippets」→ Run everywhere → 啟用
 */

if (!defined('ABSPATH')) {
    exit;
}

const SMASMALL_HOME_CAROUSEL_OPTION = 'smasmall_home_carousel_slides';

/** 接收後台依原圖比例裁切的圖片並存入媒體庫。 */
add_action('wp_ajax_smasmall_smhc_carousel_crop_upload', function () {
    check_ajax_referer('smasmall_smhc_carousel_crop', 'nonce');

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

/** ---------- Admin menu ---------- */
add_action('admin_menu', function () {
    add_menu_page(
        '首頁底部圖片輪播',
        '首頁底部圖片輪播',
        'read',
        'smasmall-home-carousel',
        'smasmall_home_carousel_render_page',
        'dashicons-images-alt2',
        58
    );
});

function smasmall_home_carousel_get_slides(): array
{
    $slides = get_option(SMASMALL_HOME_CAROUSEL_OPTION, []);
    return is_array($slides) ? $slides : [];
}

function smasmall_home_carousel_sanitize_slides($input): array
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
        if ($image === '') {
            continue;
        }
        $out[] = [
            'id'      => sanitize_key($row['id'] ?? uniqid('slide_', true)),
            'image'   => $image,
            'title'   => sanitize_text_field($row['title'] ?? ''),
            'enabled' => !empty($row['enabled']),
            'order'   => isset($row['order']) ? (int) $row['order'] : count($out),
        ];
    }

    usort($out, function ($a, $b) {
        return ($a['order'] ?? 0) <=> ($b['order'] ?? 0);
    });

    return $out;
}

add_action('admin_init', function () {
    register_setting(
        'smasmall_home_carousel_group',
        SMASMALL_HOME_CAROUSEL_OPTION,
        [
            'type'              => 'array',
            'sanitize_callback' => 'smasmall_home_carousel_sanitize_slides',
            'default'           => [],
        ]
    );
});

add_action('admin_post_smasmall_save_home_carousel', function () {
    if (!current_user_can('read')) {
        wp_die('Forbidden');
    }
    check_admin_referer('smasmall_home_carousel_save', 'smasmall_home_carousel_nonce');

    $raw = isset($_POST['slides']) && is_array($_POST['slides']) ? wp_unslash($_POST['slides']) : [];
    $slides = smasmall_home_carousel_sanitize_slides($raw);
    update_option(SMASMALL_HOME_CAROUSEL_OPTION, $slides);

    wp_safe_redirect(add_query_arg(['page' => 'smasmall-home-carousel', 'updated' => '1'], admin_url('admin.php')));
    exit;
});

function smasmall_home_carousel_render_page(): void
{
    if (!current_user_can('read')) {
        return;
    }

    $slides = smasmall_home_carousel_get_slides();
    $updated = isset($_GET['updated']);
    ?>
    <div class="wrap smasmall-home-carousel-admin">
        <h1>首頁底部圖片輪播</h1>
        <p class="description">管理官網首頁底部 Embla 輪播圖。圖片選取後會使用與原圖相同的比例裁切，輸出沿用原圖裁切範圍解析度。儲存後約 1 分鐘內同步至前台（Next.js 快取）。</p>

        <?php if ($updated) : ?>
            <div class="notice notice-success is-dismissible"><p>已儲存輪播設定。</p></div>
        <?php endif; ?>

        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" id="smasmall-home-carousel-form">
            <input type="hidden" name="action" value="smasmall_save_home_carousel" />
            <?php wp_nonce_field('smasmall_home_carousel_save', 'smasmall_home_carousel_nonce'); ?>

            <div class="smhc-toolbar">
                <button type="button" class="button button-primary button-hero" id="smhc-add-slide">
                    <span class="dashicons dashicons-plus-alt2"></span> 新增輪播圖
                </button>
                <span class="smhc-count">共 <strong id="smhc-slide-count"><?php echo count($slides); ?></strong> 張</span>
            </div>

            <ul id="smhc-slides-list" class="smhc-slides-list">
                <?php foreach ($slides as $i => $slide) :
                    smasmall_home_carousel_render_slide_row($slide, $i);
                endforeach; ?>
            </ul>

            <p class="smhc-empty-hint" <?php echo $slides ? 'style="display:none"' : ''; ?> id="smhc-empty-hint">
                尚無輪播圖，請點「新增輪播圖」從媒體庫選擇圖片。
            </p>

            <?php submit_button('儲存輪播', 'primary large', 'submit', false); ?>
        </form>
    </div>

    <div id="tmpl-smhc-slide-row" class="hidden" style="display:none" aria-hidden="true">
        <?php smasmall_home_carousel_render_slide_row([
            'id' => '__SMHC_ID__',
            'image' => '',
            'title' => '',
            'enabled' => true,
            'order' => 0,
        ], '__SMHC_INDEX__'); ?>
    </div>

    <?php smasmall_home_carousel_admin_styles(); ?>
    <?php
}

function smasmall_home_carousel_render_slide_row(array $slide, $index): void
{
    $id = $slide['id'] ?? uniqid('slide_', true);
    $image = $slide['image'] ?? '';
    $title = $slide['title'] ?? '';
    $enabled = !isset($slide['enabled']) || !empty($slide['enabled']);
    ?>
    <li class="smhc-slide-card" data-index="<?php echo esc_attr((string) $index); ?>">
        <span class="smhc-drag dashicons dashicons-move" title="拖曳排序"></span>
        <div class="smhc-thumb">
            <?php if ($image) : ?>
                <img src="<?php echo esc_url($image); ?>" alt="" />
            <?php else : ?>
                <div class="smhc-thumb-placeholder"><span class="dashicons dashicons-format-image"></span></div>
            <?php endif; ?>
        </div>
        <div class="smhc-fields">
            <input type="hidden" name="slides[<?php echo esc_attr((string) $index); ?>][id]" value="<?php echo esc_attr($id); ?>" class="smhc-id" />
            <input type="hidden" name="slides[<?php echo esc_attr((string) $index); ?>][image]" value="<?php echo esc_attr($image); ?>" class="smhc-image-url" />
            <input type="hidden" name="slides[<?php echo esc_attr((string) $index); ?>][order]" value="<?php echo esc_attr((string) ($slide['order'] ?? $index)); ?>" class="smhc-order" />
            <label class="smhc-label">圖片說明（選填，供後台辨識）</label>
            <input type="text" class="regular-text smhc-title" name="slides[<?php echo esc_attr((string) $index); ?>][title]" value="<?php echo esc_attr($title); ?>" placeholder="例：捍衛者情境圖" />
            <div class="smhc-actions">
                <button type="button" class="button smhc-pick-image"><?php echo $image ? '更換圖片' : '選擇圖片'; ?></button>
                <button type="button" class="button-link-delete smhc-remove">移除</button>
            </div>
        </div>
        <label class="smhc-enabled">
            <input type="checkbox" name="slides[<?php echo esc_attr((string) $index); ?>][enabled]" value="1" <?php checked($enabled); ?> />
            顯示
        </label>
    </li>
    <?php
}

function smasmall_home_carousel_admin_styles(): void
{
    ?>
    <style>
        .smasmall-home-carousel-admin { max-width: 920px; }
        .smhc-toolbar { display: flex; align-items: center; gap: 16px; margin: 20px 0; }
        .smhc-toolbar .button-hero .dashicons { margin-top: 8px; margin-right: 4px; }
        .smhc-count { color: #646970; }
        .smhc-slides-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
        .smhc-slide-card {
            display: grid;
            grid-template-columns: 28px 120px 1fr auto;
            gap: 16px;
            align-items: center;
            background: #fff;
            border: 1px solid #dcdcde;
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 1px 2px rgba(0,0,0,.04);
        }
        .smhc-drag { cursor: grab; color: #787c82; }
        .smhc-thumb img, .smhc-thumb-placeholder {
            width: 120px; height: 80px; object-fit: cover; border-radius: 6px; background: #f0f0f1;
        }
        .smhc-thumb-placeholder { display: flex; align-items: center; justify-content: center; }
        .smhc-thumb-placeholder .dashicons { font-size: 32px; width: 32px; height: 32px; color: #a7aaad; }
        .smhc-label { display: block; font-weight: 600; margin-bottom: 6px; }
        .smhc-actions { margin-top: 10px; display: flex; gap: 12px; align-items: center; }
        .smhc-enabled { display: flex; align-items: center; gap: 6px; white-space: nowrap; font-weight: 500; }
        .smhc-empty-hint { padding: 24px; text-align: center; color: #646970; background: #f6f7f7; border-radius: 8px; }
        .smhc-slide-card.ui-sortable-helper { box-shadow: 0 8px 24px rgba(0,0,0,.12); }
    </style>
    <?php
}

function smasmall_home_carousel_admin_footer_script(): void
{
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || $screen->id !== 'toplevel_page_smasmall-home-carousel') {
        return;
    }
    ?>
    <div id="smhc-carousel-crop-overlay" class="smhc-carousel-crop-overlay" style="display:none">
        <div class="smhc-carousel-crop-modal">
            <div class="smhc-carousel-crop-head">
                <strong>裁切輪播圖片（維持原圖比例）</strong>
                <button type="button" class="button-link" id="smhc-carousel-crop-cancel" aria-label="關閉">✕</button>
            </div>
            <div class="smhc-carousel-crop-body">
                <img id="smhc-carousel-crop-image" src="" alt="" />
            </div>
            <div class="smhc-carousel-crop-foot">
                <span class="description">裁切框會鎖定原圖比例；拖曳／縮放後依原始解析度輸出。</span>
                <button type="button" class="button button-primary" id="smhc-carousel-crop-confirm">裁切並使用</button>
            </div>
        </div>
    </div>

    <style>
        .smhc-carousel-crop-overlay {
            position: fixed; inset: 0; z-index: 200000; display: flex;
            align-items: center; justify-content: center; background: rgba(0, 0, 0, .72);
        }
        .smhc-carousel-crop-modal {
            display: flex; flex-direction: column; width: min(960px, 94vw); max-height: 92vh;
            overflow: hidden; border-radius: 8px; background: #fff;
            box-shadow: 0 10px 40px rgba(0, 0, 0, .4);
        }
        .smhc-carousel-crop-head, .smhc-carousel-crop-foot {
            display: flex; align-items: center; justify-content: space-between;
            gap: 12px; padding: 12px 16px;
        }
        .smhc-carousel-crop-head { border-bottom: 1px solid #dcdcde; }
        .smhc-carousel-crop-foot { border-top: 1px solid #dcdcde; }
        .smhc-carousel-crop-head .button-link { font-size: 16px; text-decoration: none; }
        .smhc-carousel-crop-body {
            flex: 1; min-height: 320px; max-height: calc(92vh - 130px); background: #1d2327;
        }
        .smhc-carousel-crop-body img { display: block; max-width: 100%; }
        .smhc-carousel-crop-loading #smhc-carousel-crop-confirm { pointer-events: none; opacity: .6; }
    </style>

    <script>
    jQuery(function ($) {
        var $list = $('#smhc-slides-list');
        var $tmpl = $('#tmpl-smhc-slide-row');
        var cropper = null;
        var cropMime = 'image/jpeg';
        var cropTargetCard = null;
        var $cropOverlay = $('#smhc-carousel-crop-overlay');
        var $cropImage = $('#smhc-carousel-crop-image');
        var CROP_NONCE = '<?php echo esc_js(wp_create_nonce('smasmall_smhc_carousel_crop')); ?>';

        function closeCropModal() {
            if (cropper) {
                cropper.destroy();
                cropper = null;
            }
            cropTargetCard = null;
            $cropOverlay.hide().removeClass('smhc-carousel-crop-loading');
            $cropImage.attr('src', '');
        }

        function openCropModal(url, mime, $card) {
            cropMime = ['image/jpeg', 'image/png', 'image/webp'].indexOf(mime) !== -1
                ? mime
                : 'image/jpeg';
            cropTargetCard = $card;
            $cropOverlay.show();
            $cropImage.attr('src', url);

            if (cropper) {
                cropper.destroy();
                cropper = null;
            }
            if (typeof Cropper === 'undefined') {
                alert('裁切工具載入失敗，請重新整理頁面後再試。');
                closeCropModal();
                return;
            }

            cropper = new Cropper($cropImage[0], {
                aspectRatio: NaN,
                viewMode: 1,
                autoCropArea: 1,
                background: false,
                responsive: true,
                ready: function () {
                    var data = cropper.getImageData();
                    if (data.naturalWidth > 0 && data.naturalHeight > 0) {
                        cropper.setAspectRatio(data.naturalWidth / data.naturalHeight);
                    }
                }
            });
        }

        $('#smhc-carousel-crop-cancel').on('click', function (e) {
            e.preventDefault();
            closeCropModal();
        });

        $('#smhc-carousel-crop-confirm').on('click', function (e) {
            e.preventDefault();
            if (!cropper || !cropTargetCard) return;

            var canvas = cropper.getCroppedCanvas();
            if (!canvas) {
                alert('裁切失敗，請重試。');
                return;
            }

            $cropOverlay.addClass('smhc-carousel-crop-loading');
            canvas.toBlob(function (blob) {
                if (!blob) {
                    $cropOverlay.removeClass('smhc-carousel-crop-loading');
                    alert('裁切輸出失敗，請重試。');
                    return;
                }

                var extension = cropMime === 'image/png'
                    ? 'png'
                    : (cropMime === 'image/webp' ? 'webp' : 'jpg');
                var fd = new FormData();
                fd.append('action', 'smasmall_smhc_carousel_crop_upload');
                fd.append('nonce', CROP_NONCE);
                fd.append('image', blob, 'smasmall-carousel-crop-' + Date.now() + '.' + extension);

                $.ajax({
                    url: ajaxurl,
                    method: 'POST',
                    data: fd,
                    processData: false,
                    contentType: false
                }).done(function (res) {
                    if (res && res.success && res.data && res.data.url) {
                        var $card = cropTargetCard;
                        $card.find('.smhc-image-url').val(res.data.url);
                        $card.find('.smhc-thumb').html($('<img>', { src: res.data.url, alt: '' }));
                        $card.find('.smhc-pick-image').text('更換圖片');
                        closeCropModal();
                    } else {
                        $cropOverlay.removeClass('smhc-carousel-crop-loading');
                        alert((res && res.data && res.data.message) || '上傳裁切圖失敗。');
                    }
                }).fail(function () {
                    $cropOverlay.removeClass('smhc-carousel-crop-loading');
                    alert('上傳裁切圖失敗，請重試。');
                });
            }, cropMime, 1);
        });

        function reindexSlides() {
            $list.find('.smhc-slide-card').each(function (i) {
                var $card = $(this);
                $card.attr('data-index', i);
                $card.find('.smhc-order').val(i);
                $card.find('[name^="slides["]').each(function () {
                    var name = $(this).attr('name');
                    if (!name) return;
                    $(this).attr('name', name.replace(/slides\[[^\]]+\]/, 'slides[' + i + ']'));
                });
            });
            $('#smhc-slide-count').text($list.find('.smhc-slide-card').length);
            $('#smhc-empty-hint').toggle($list.find('.smhc-slide-card').length === 0);
        }

        function bindCard($card) {
            $card.find('.smhc-pick-image').off('click.smhc').on('click.smhc', function (e) {
                e.preventDefault();
                if (typeof wp === 'undefined' || !wp.media) {
                    alert('媒體庫尚未載入，請重新整理頁面後再試。');
                    return;
                }
                var frame = wp.media({
                    title: '選擇輪播圖',
                    button: { text: '進入裁切' },
                    multiple: false,
                    library: { type: 'image' }
                });
                frame.on('select', function () {
                    var attachment = frame.state().get('selection').first().toJSON();
                    if (attachment.url) {
                        openCropModal(attachment.url, attachment.mime, $card);
                    }
                });
                frame.open();
            });
            $card.find('.smhc-remove').off('click.smhc').on('click.smhc', function (e) {
                e.preventDefault();
                $card.remove();
                reindexSlides();
            });
        }

        if ($.fn.sortable) {
            $list.sortable({
                handle: '.smhc-drag',
                axis: 'y',
                update: reindexSlides
            });
        }

        $('#smhc-add-slide').on('click', function (e) {
            e.preventDefault();
            if (!$tmpl.length) {
                alert('找不到輪播範本，請重新整理頁面。');
                return;
            }
            var id = 'slide_' + Date.now();
            var index = $list.find('.smhc-slide-card').length;
            var html = $tmpl.html()
                .replace(/__SMHC_ID__/g, id)
                .replace(/__SMHC_INDEX__/g, String(index));
            var $card = $(html.trim());
            if (!$card.length) {
                alert('無法建立輪播列，請重新整理頁面。');
                return;
            }
            $list.append($card);
            bindCard($card);
            reindexSlides();
        });

        $list.find('.smhc-slide-card').each(function () {
            bindCard($(this));
        });

        $('#smasmall-home-carousel-form').on('submit', function () {
            reindexSlides();
        });
    });
    </script>
    <?php
}

/** ---------- REST API ---------- */
add_action('rest_api_init', function () {
    register_rest_route('smasmall/v1', '/home-carousel', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function () {
            $slides = smasmall_home_carousel_get_slides();
            $out = [];

            foreach ($slides as $slide) {
                if (empty($slide['image'])) {
                    continue;
                }
                if (isset($slide['enabled']) && !$slide['enabled']) {
                    continue;
                }
                $out[] = [
                    'image' => esc_url_raw($slide['image']),
                    'title' => sanitize_text_field($slide['title'] ?? ''),
                    'order' => (int) ($slide['order'] ?? 0),
                ];
            }

            usort($out, function ($a, $b) {
                return ($a['order'] ?? 0) <=> ($b['order'] ?? 0);
            });

            $out = array_map(function ($item) {
                unset($item['order']);
                return $item;
            }, $out);

            return rest_ensure_response(['slides' => $out]);
        },
    ]);
});

add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook !== 'toplevel_page_smasmall-home-carousel') {
        return;
    }
    wp_enqueue_media();
    wp_enqueue_script('jquery-ui-sortable', false, ['jquery', 'jquery-ui-core', 'jquery-ui-mouse', 'jquery-ui-widget'], false, true);
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

add_action('admin_footer', 'smasmall_home_carousel_admin_footer_script');
