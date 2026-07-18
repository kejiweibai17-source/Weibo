<?php
/**
 * SMASMALL — 首頁星座系列區塊（Code Snippets）
 *
 * - 左側選單：首頁星座系列區
 * - 管理小標、主標、描述、按鈕、主圖
 * - 公開 REST：GET /wp-json/smasmall/v1/home-constellation
 *
 * 貼到 WordPress「Code Snippets」→ Run everywhere → 啟用
 */

if (!defined('ABSPATH')) {
    exit;
}

const SMASMALL_HOME_CONSTELLATION_OPTION = 'smasmall_home_constellation_section';

/**
 * 接收後台裁切彈窗輸出的圖片並存進媒體庫。
 * 圖片沿用原圖裁切範圍的解析度，不強制放大或縮小。
 */
add_action('wp_ajax_smasmall_smhc_crop_upload', function () {
    check_ajax_referer('smasmall_smhc_crop', 'nonce');

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

function smasmall_home_constellation_defaults(): array
{
    return [
        'enabled'     => true,
        'eyebrow'     => '昔馬 SMASMALL 星座系列',
        'title'       => '你的星座，你的圖騰',
        'description' => "火、土、風、水四象主題專屬圖騰與主題禮盒。\n獻給懂品味的你。",
        'ctaLabel'    => '星座系列禮盒',
        'ctaHref'     => '/series/constellation',
        'image'       => '',
        'imageAlt'    => '昔馬 SMASMALL 星座系列電動刮鬍刀禮盒 四象配色展示 威柏科技-昔馬電動刮鬍刀總代理',
    ];
}

function smasmall_home_constellation_get_section(): array
{
    $saved = get_option(SMASMALL_HOME_CONSTELLATION_OPTION, []);
    if (!is_array($saved)) {
        $saved = [];
    }

    return array_merge(smasmall_home_constellation_defaults(), $saved);
}

function smasmall_home_constellation_sanitize_section($input): array
{
    if (!is_array($input)) {
        return smasmall_home_constellation_defaults();
    }

    $defaults = smasmall_home_constellation_defaults();
    $href = trim((string) ($input['ctaHref'] ?? $defaults['ctaHref']));
    if ($href !== '' && $href[0] !== '/') {
        $href = '/' . ltrim($href, '/');
    }

    return [
        'enabled'     => !empty($input['enabled']),
        'eyebrow'     => sanitize_text_field($input['eyebrow'] ?? $defaults['eyebrow']),
        'title'       => sanitize_text_field($input['title'] ?? $defaults['title']),
        'description' => sanitize_textarea_field($input['description'] ?? $defaults['description']),
        'ctaLabel'    => sanitize_text_field($input['ctaLabel'] ?? $defaults['ctaLabel']),
        'ctaHref'     => sanitize_text_field($href !== '' ? $href : $defaults['ctaHref']),
        'image'       => esc_url_raw(trim((string) ($input['image'] ?? ''))),
        'imageAlt'    => sanitize_text_field($input['imageAlt'] ?? $defaults['imageAlt']),
    ];
}

function smasmall_home_constellation_format_for_api(array $section): ?array
{
    if (empty($section['enabled'])) {
        return null;
    }

    if (trim((string) ($section['title'] ?? '')) === '') {
        return null;
    }

    return [
        'eyebrow'     => sanitize_text_field($section['eyebrow'] ?? ''),
        'title'       => sanitize_text_field($section['title'] ?? ''),
        'description' => sanitize_textarea_field($section['description'] ?? ''),
        'ctaLabel'    => sanitize_text_field($section['ctaLabel'] ?? ''),
        'ctaHref'     => sanitize_text_field($section['ctaHref'] ?? '/series/constellation'),
        'image'       => esc_url_raw($section['image'] ?? ''),
        'imageAlt'    => sanitize_text_field($section['imageAlt'] ?? ''),
    ];
}

add_action('admin_menu', function () {
    add_menu_page(
        '首頁星座系列區',
        '首頁星座系列區',
        'read',
        'smasmall-home-constellation',
        'smasmall_home_constellation_render_page',
        'dashicons-star-filled',
        59
    );
});

add_action('admin_init', function () {
    register_setting(
        'smasmall_home_constellation_group',
        SMASMALL_HOME_CONSTELLATION_OPTION,
        [
            'type'              => 'array',
            'sanitize_callback' => 'smasmall_home_constellation_sanitize_section',
            'default'           => smasmall_home_constellation_defaults(),
        ]
    );
});

add_action('admin_post_smasmall_save_home_constellation', function () {
    if (!current_user_can('read')) {
        wp_die('Forbidden');
    }
    check_admin_referer('smasmall_home_constellation_save', 'smasmall_home_constellation_nonce');

    $raw = isset($_POST['section']) && is_array($_POST['section']) ? wp_unslash($_POST['section']) : [];
    $section = smasmall_home_constellation_sanitize_section($raw);
    update_option(SMASMALL_HOME_CONSTELLATION_OPTION, $section);

    wp_safe_redirect(add_query_arg(['page' => 'smasmall-home-constellation', 'updated' => '1'], admin_url('admin.php')));
    exit;
});

function smasmall_home_constellation_render_page(): void
{
    if (!current_user_can('read')) {
        return;
    }

    $section = smasmall_home_constellation_get_section();
    $updated = isset($_GET['updated']);
    $image = $section['image'] ?? '';
    ?>
    <div class="wrap smhc-admin">
        <h1>首頁星座系列區</h1>
        <p class="description">管理官網首頁「星座系列」全屏區塊（約一個視窗高度）。儲存後約 1 分鐘內同步至前台。</p>

        <?php if ($updated) : ?>
            <div class="notice notice-success is-dismissible"><p>已儲存設定。</p></div>
        <?php endif; ?>

        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" id="smhc-form">
            <input type="hidden" name="action" value="smasmall_save_home_constellation" />
            <?php wp_nonce_field('smasmall_home_constellation_save', 'smasmall_home_constellation_nonce'); ?>

            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row">顯示此區塊</th>
                    <td>
                        <label>
                            <input type="checkbox" name="section[enabled]" value="1" <?php checked(!empty($section['enabled'])); ?> />
                            在前台顯示
                        </label>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="smhc-eyebrow">小標</label></th>
                    <td>
                        <input type="text" class="regular-text" id="smhc-eyebrow" name="section[eyebrow]"
                               value="<?php echo esc_attr($section['eyebrow'] ?? ''); ?>" />
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="smhc-title">主標題 <span class="required">*</span></label></th>
                    <td>
                        <input type="text" class="large-text" id="smhc-title" name="section[title]"
                               value="<?php echo esc_attr($section['title'] ?? ''); ?>" required />
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="smhc-description">描述</label></th>
                    <td>
                        <textarea class="large-text" rows="4" id="smhc-description" name="section[description]"><?php echo esc_textarea($section['description'] ?? ''); ?></textarea>
                        <p class="description">可換行；前台會保留換行。</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="smhc-cta-label">按鈕文字</label></th>
                    <td>
                        <input type="text" class="regular-text" id="smhc-cta-label" name="section[ctaLabel]"
                               value="<?php echo esc_attr($section['ctaLabel'] ?? ''); ?>" />
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="smhc-cta-href">按鈕連結</label></th>
                    <td>
                        <input type="text" class="regular-text" id="smhc-cta-href" name="section[ctaHref]"
                               value="<?php echo esc_attr($section['ctaHref'] ?? ''); ?>" placeholder="/series/constellation" />
                        <p class="description">請填站內路徑，例如 <code>/series/constellation</code></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">主圖</th>
                    <td>
                        <div class="smhc-image-box">
                            <div class="smhc-thumb">
                                <?php if ($image) : ?>
                                    <img src="<?php echo esc_url($image); ?>" alt="" id="smhc-preview" />
                                <?php else : ?>
                                    <div class="smhc-thumb-placeholder" id="smhc-preview-placeholder">
                                        <span class="dashicons dashicons-format-image"></span>
                                    </div>
                                    <img src="" alt="" id="smhc-preview" style="display:none" />
                                <?php endif; ?>
                            </div>
                            <input type="hidden" name="section[image]" id="smhc-image-url" value="<?php echo esc_attr($image); ?>" />
                            <p>
                                <button type="button" class="button button-secondary" id="smhc-pick-image">選擇圖片</button>
                                <button type="button" class="button-link-delete" id="smhc-clear-image">清除</button>
                            </p>
                            <p class="description">選圖後會開啟裁切視窗，比例固定 16:9。輸出沿用裁切範圍的原始解析度，不放大、不縮小；原圖保留。</p>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="smhc-image-alt">主圖 Alt</label></th>
                    <td>
                        <input type="text" class="large-text" id="smhc-image-alt" name="section[imageAlt]"
                               value="<?php echo esc_attr($section['imageAlt'] ?? ''); ?>" />
                    </td>
                </tr>
            </table>

            <?php submit_button('儲存設定', 'primary large'); ?>
        </form>
    </div>

    <style>
        .smhc-admin { max-width: 860px; }
        .smhc-image-box { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
        .smhc-thumb img, .smhc-thumb-placeholder {
            max-width: 480px; width: 100%; height: auto; border-radius: 8px; background: #f0f0f1;
        }
        .smhc-thumb-placeholder {
            min-height: 160px; display: flex; align-items: center; justify-content: center;
        }
        .smhc-thumb-placeholder .dashicons { font-size: 48px; width: 48px; height: 48px; color: #a7aaad; }
    </style>
    <?php
}

add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook !== 'toplevel_page_smasmall-home-constellation') {
        return;
    }
    wp_enqueue_media();
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
    if (!$screen || $screen->id !== 'toplevel_page_smasmall-home-constellation') {
        return;
    }
    ?>
    <div id="smhc-crop-overlay" class="smhc-crop-overlay" style="display:none">
        <div class="smhc-crop-modal">
            <div class="smhc-crop-head">
                <strong>裁切星座系列主圖（16:9）</strong>
                <button type="button" class="button-link" id="smhc-crop-cancel" aria-label="關閉">✕</button>
            </div>
            <div class="smhc-crop-body">
                <img id="smhc-crop-image" src="" alt="" />
            </div>
            <div class="smhc-crop-foot">
                <span class="description">拖曳／縮放選取範圍；依原圖裁切範圍的解析度輸出。</span>
                <button type="button" class="button button-primary" id="smhc-crop-confirm">裁切並使用</button>
            </div>
        </div>
    </div>

    <style>
        .smhc-crop-overlay {
            position: fixed; inset: 0; z-index: 200000; display: flex;
            align-items: center; justify-content: center; background: rgba(0, 0, 0, .72);
        }
        .smhc-crop-modal {
            display: flex; flex-direction: column; width: min(960px, 94vw); max-height: 92vh;
            overflow: hidden; border-radius: 8px; background: #fff;
            box-shadow: 0 10px 40px rgba(0, 0, 0, .4);
        }
        .smhc-crop-head, .smhc-crop-foot {
            display: flex; align-items: center; justify-content: space-between;
            gap: 12px; padding: 12px 16px; border-color: #dcdcde;
        }
        .smhc-crop-head { border-bottom: 1px solid #dcdcde; }
        .smhc-crop-foot { border-top: 1px solid #dcdcde; }
        .smhc-crop-head .button-link { font-size: 16px; text-decoration: none; }
        .smhc-crop-body {
            flex: 1; min-height: 320px; max-height: calc(92vh - 130px); background: #1d2327;
        }
        .smhc-crop-body img { display: block; max-width: 100%; }
        .smhc-crop-loading #smhc-crop-confirm { pointer-events: none; opacity: .6; }
    </style>

    <script>
    jQuery(function ($) {
        var frame;
        var cropper = null;
        var cropMime = 'image/jpeg';
        var $overlay = $('#smhc-crop-overlay');
        var $cropImage = $('#smhc-crop-image');
        var CROP_NONCE = '<?php echo esc_js(wp_create_nonce('smasmall_smhc_crop')); ?>';

        function setImage(url) {
            url = url || '';
            $('#smhc-image-url').val(url);
            if (url) {
                $('#smhc-preview').attr('src', url).show();
                $('#smhc-preview-placeholder').hide();
            } else {
                $('#smhc-preview').attr('src', '').hide();
                $('#smhc-preview-placeholder').show();
            }
        }

        function closeCropModal() {
            if (cropper) {
                cropper.destroy();
                cropper = null;
            }
            $overlay.hide().removeClass('smhc-crop-loading');
            $cropImage.attr('src', '');
        }

        function openCropModal(url, mime) {
            cropMime = ['image/jpeg', 'image/png', 'image/webp'].indexOf(mime) !== -1
                ? mime
                : 'image/jpeg';
            $overlay.show();
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
                aspectRatio: 16 / 9,
                viewMode: 1,
                autoCropArea: 1,
                background: false,
                responsive: true
            });
        }

        $('#smhc-crop-cancel').on('click', function (e) {
            e.preventDefault();
            closeCropModal();
        });

        $('#smhc-crop-confirm').on('click', function (e) {
            e.preventDefault();
            if (!cropper) return;

            // 不指定 width／height，維持原圖裁切區域的像素尺寸
            var canvas = cropper.getCroppedCanvas();
            if (!canvas) {
                alert('裁切失敗，請重試。');
                return;
            }

            $overlay.addClass('smhc-crop-loading');
            canvas.toBlob(function (blob) {
                if (!blob) {
                    $overlay.removeClass('smhc-crop-loading');
                    alert('裁切輸出失敗，請重試。');
                    return;
                }

                var extension = cropMime === 'image/png'
                    ? 'png'
                    : (cropMime === 'image/webp' ? 'webp' : 'jpg');
                var fd = new FormData();
                fd.append('action', 'smasmall_smhc_crop_upload');
                fd.append('nonce', CROP_NONCE);
                fd.append('image', blob, 'smasmall-constellation-crop-' + Date.now() + '.' + extension);

                $.ajax({
                    url: ajaxurl,
                    method: 'POST',
                    data: fd,
                    processData: false,
                    contentType: false
                }).done(function (res) {
                    if (res && res.success && res.data && res.data.url) {
                        setImage(res.data.url);
                        closeCropModal();
                    } else {
                        $overlay.removeClass('smhc-crop-loading');
                        alert((res && res.data && res.data.message) || '上傳裁切圖失敗。');
                    }
                }).fail(function () {
                    $overlay.removeClass('smhc-crop-loading');
                    alert('上傳裁切圖失敗，請重試。');
                });
            }, cropMime, 1);
        });

        $('#smhc-pick-image').on('click', function (e) {
            e.preventDefault();
            if (!frame) {
                frame = wp.media({
                    title: '選擇主圖',
                    button: { text: '進入裁切' },
                    multiple: false,
                    library: { type: 'image' }
                });
                frame.on('select', function () {
                    var attachment = frame.state().get('selection').first().toJSON();
                    if (attachment.url) {
                        openCropModal(attachment.url, attachment.mime);
                    }
                });
            }
            frame.open();
        });

        $('#smhc-clear-image').on('click', function (e) {
            e.preventDefault();
            setImage('');
        });
    });
    </script>
    <?php
});

add_action('rest_api_init', function () {
    register_rest_route('smasmall/v1', '/home-constellation', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function () {
            $section = smasmall_home_constellation_format_for_api(smasmall_home_constellation_get_section());
            if ($section === null) {
                return rest_ensure_response(['section' => null]);
            }

            return rest_ensure_response(['section' => $section]);
        },
    ]);
});
