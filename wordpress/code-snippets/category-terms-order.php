<?php
/**
 * 文章分類拖曳排序（Code Snippets）
 *
 * - 直接在「文章 → 分類」列表：僅父分類可 ☰ 拖曳，子分類自動跟隨
 * - 也可使用「文章 → 分類排序」階層頁（同樣僅父層可拖）
 * - 寫入 wp_terms.term_order（WPML / Polylang 各語系 term 獨立）
 * - 後台列表與前台 get_terms / REST categories 預設依此順序
 *
 * 貼到 WordPress「Code Snippets」→ Run everywhere → 啟用
 * （若已有舊版，請整段覆蓋後再啟用）
 */

if (!defined('ABSPATH')) {
    exit;
}

if (defined('CATEGORY_TERMS_ORDER_LOADED')) {
    return;
}
define('CATEGORY_TERMS_ORDER_LOADED', true);

const CATEGORY_TERMS_ORDER_DB_VERSION = 1;
const CATEGORY_TERMS_ORDER_TAXONOMY   = 'category';

/** ---------- DB：確保 term_order 欄位存在 ---------- */

function category_terms_order_maybe_install(): void
{
    if ((int) get_option('category_terms_order_db_version', 0) >= CATEGORY_TERMS_ORDER_DB_VERSION) {
        return;
    }

    global $wpdb;

    $column = $wpdb->get_results(
        $wpdb->prepare("SHOW COLUMNS FROM `{$wpdb->terms}` LIKE %s", 'term_order')
    );

    if (empty($column)) {
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.SchemaChange
        $wpdb->query("ALTER TABLE `{$wpdb->terms}` ADD `term_order` INT(4) NOT NULL DEFAULT 0");
    }

    update_option('category_terms_order_db_version', CATEGORY_TERMS_ORDER_DB_VERSION, false);
}

add_action('admin_init', 'category_terms_order_maybe_install');

/** ---------- 後台選單（備用階層排序頁） ---------- */

add_action('admin_menu', static function () {
    add_submenu_page(
        'edit.php',
        '分類排序',
        '分類排序',
        'manage_categories',
        'category-terms-order',
        'category_terms_order_render_page'
    );
});

function category_terms_order_get_terms_tree(int $parent = 0): array
{
    $terms = get_terms([
        'taxonomy'   => CATEGORY_TERMS_ORDER_TAXONOMY,
        'hide_empty' => false,
        'parent'     => $parent,
        'orderby'    => 'term_order',
        'order'      => 'ASC',
    ]);

    if (is_wp_error($terms) || empty($terms)) {
        return [];
    }

    $tree = [];
    foreach ($terms as $term) {
        $tree[] = [
            'term'     => $term,
            'children' => category_terms_order_get_terms_tree((int) $term->term_id),
        ];
    }

    return $tree;
}

function category_terms_order_render_tree(array $tree): void
{
    if (!$tree) {
        return;
    }

    echo '<ol class="cto-sortable">';
    foreach ($tree as $node) {
        /** @var WP_Term $term */
        $term = $node['term'];
        printf(
            '<li class="cto-item" id="cto-item-%1$d" data-term-id="%1$d"><div class="cto-handle"><span class="cto-grip" aria-hidden="true">☰</span><strong>%2$s</strong><span class="cto-slug">%3$s</span></div>',
            (int) $term->term_id,
            esc_html($term->name),
            esc_html($term->slug)
        );

        if (!empty($node['children'])) {
            category_terms_order_render_tree($node['children']);
        }

        echo '</li>';
    }
    echo '</ol>';
}

function category_terms_order_render_page(): void
{
    if (!current_user_can('manage_categories')) {
        wp_die(esc_html__('抱歉，您不能存取此頁面。', 'default'));
    }

    category_terms_order_maybe_install();

    $tree = category_terms_order_get_terms_tree(0);
    ?>
    <div class="wrap cto-wrap">
        <h1>分類排序</h1>
        <p>僅父分類可拖曳排序；子分類會跟著父分類一起移動。階層（誰是子分類）請回「分類」頁面用 Parent 設定。</p>
        <p class="description">WPML / Polylang：請先切換語言再排序——各語系分類是不同 term，順序彼此獨立。</p>

        <?php if (!$tree) : ?>
            <p>目前沒有可排序的分類。</p>
        <?php else : ?>
            <div id="cto-tree" class="cto-tree">
                <?php category_terms_order_render_tree($tree); ?>
            </div>
            <p class="cto-status"><span id="cto-status-text">拖曳即可排序</span></p>
        <?php endif; ?>
    </div>
    <?php
}

/** ---------- 共用：儲存順序 ---------- */

function category_terms_order_save_ids(array $order): int
{
    category_terms_order_maybe_install();

    $order = array_values(array_filter(array_map('intval', $order)));
    if (!$order) {
        return 0;
    }

    global $wpdb;
    $position = 0;

    foreach ($order as $term_id) {
        $term = get_term($term_id, CATEGORY_TERMS_ORDER_TAXONOMY);
        if (!$term || is_wp_error($term)) {
            continue;
        }

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
        $wpdb->update(
            $wpdb->terms,
            ['term_order' => $position],
            ['term_id' => $term_id],
            ['%d'],
            ['%d']
        );
        $position++;
    }

    clean_term_cache($order, CATEGORY_TERMS_ORDER_TAXONOMY);

    return $position;
}

/** ---------- Assets：分類列表可拖 + 專用排序頁 ---------- */

function category_terms_order_is_category_list_screen($hook = ''): bool
{
    if ($hook === 'edit-tags.php' || $hook === 'term.php') {
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        $tax = isset($_GET['taxonomy']) ? sanitize_key(wp_unslash($_GET['taxonomy'])) : '';
        return $tax === CATEGORY_TERMS_ORDER_TAXONOMY;
    }

    // 某些環境 hook 會是不同字串，再用畫面判斷
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    return $screen
        && isset($screen->taxonomy)
        && $screen->taxonomy === CATEGORY_TERMS_ORDER_TAXONOMY
        && in_array($screen->base, ['edit-tags', 'term'], true);
}

add_action('admin_enqueue_scripts', static function ($hook) {
    $is_order_page = ($hook === 'posts_page_category-terms-order');
    $is_list_page  = category_terms_order_is_category_list_screen($hook);

    if (!$is_order_page && !$is_list_page) {
        return;
    }

    if (!current_user_can('manage_categories')) {
        return;
    }

    wp_enqueue_script('jquery-ui-sortable');

    $nonce = wp_create_nonce('category_terms_order_save');

    $css = '
    .cto-wrap .cto-tree { max-width: 720px; margin-top: 16px; }
    .cto-sortable { margin: 0; padding-left: 0; list-style: none; }
    .cto-sortable .cto-sortable { margin: 6px 0 6px 22px; padding-left: 12px; border-left: 2px solid #dcdcde; }
    .cto-item { margin: 0 0 6px; }
    .cto-handle {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; background: #fff; border: 1px solid #c3c4c7;
      border-radius: 4px; cursor: grab; user-select: none;
    }
    .cto-handle:active { cursor: grabbing; }
    .cto-grip { color: #787c82; font-size: 14px; line-height: 1; }
    .cto-slug { color: #787c82; font-size: 12px; margin-left: auto; }
    .cto-placeholder {
      border: 1px dashed #2271b1; background: #f0f6fc;
      height: 42px; margin-bottom: 6px; border-radius: 4px;
    }
    .cto-status { color: #646970; }
    .cto-status.is-saving { color: #996800; }
    .cto-status.is-saved { color: #007017; }
    .cto-status.is-error { color: #b32d2e; }

    /* 分類列表頁拖曳 */
    .cto-list-handle {
      display: inline-flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; margin-right: 6px; vertical-align: middle;
      color: #787c82; cursor: grab; border-radius: 3px; user-select: none;
      font-size: 16px; line-height: 1;
    }
    .cto-list-handle:hover { color: #1d2327; background: #f0f0f1; }
    .cto-list-handle:active { cursor: grabbing; }
    .wp-list-table #the-list tr.cto-dragging { background: #f0f6fc; }
    .wp-list-table #the-list tr.ui-sortable-helper { background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,.12); }
    .wp-list-table #the-list tr.cto-row-placeholder td {
      border: 1px dashed #2271b1 !important; background: #f0f6fc !important;
      height: 48px;
    }
    .cto-list-banner {
      margin: 12px 0 8px; padding: 10px 14px;
      background: #fff; border-left: 4px solid #2271b1; box-shadow: 0 1px 1px rgba(0,0,0,.04);
    }
    .cto-list-banner strong { margin-right: 6px; }
    .cto-list-banner .cto-list-save-status { margin-left: 10px; color: #646970; }
    .cto-list-banner .cto-list-save-status.is-saving { color: #996800; }
    .cto-list-banner .cto-list-save-status.is-saved { color: #007017; }
    .cto-list-banner .cto-list-save-status.is-error { color: #b32d2e; }
    /* 子分類列不可拖 */
    .wp-list-table #the-list tr[class*="level-"]:not(.level-0) { opacity: 0.92; }
    .cto-tree > .cto-sortable > .cto-item > .cto-sortable .cto-handle {
      cursor: default; background: #f6f7f7; opacity: 0.85;
    }
    .cto-tree > .cto-sortable > .cto-item > .cto-sortable .cto-grip { visibility: hidden; }
    ';

    wp_register_style('category-terms-order', false, [], '1.2.0');
    wp_enqueue_style('category-terms-order');
    wp_add_inline_style('category-terms-order', $css);

    if ($is_order_page) {
        $js_page = '
        (function ($) {
          function collectOrder($list) {
            var order = [];
            $list.children("li.cto-item").each(function () {
              var $li = $(this);
              var id = parseInt($li.data("term-id"), 10);
              if (!id) return;
              order.push(id);
              var $child = $li.children("ol.cto-sortable");
              if ($child.length) {
                order = order.concat(collectOrder($child));
              }
            });
            return order;
          }
          function setStatus(text, cls) {
            var $s = $("#cto-status-text").closest(".cto-status");
            $s.removeClass("is-saving is-saved is-error");
            if (cls) $s.addClass(cls);
            $("#cto-status-text").text(text);
          }
          function saveOrder() {
            var order = collectOrder($("#cto-tree > ol.cto-sortable"));
            setStatus("儲存中…", "is-saving");
            $.post(ajaxurl, {
              action: "category_terms_order_save",
              nonce: ' . wp_json_encode($nonce) . ',
              order: order
            }).done(function (res) {
              if (res && res.success) setStatus("已儲存", "is-saved");
              else setStatus((res && res.data && res.data.message) ? res.data.message : "儲存失敗", "is-error");
            }).fail(function () {
              setStatus("儲存失敗，請再試一次", "is-error");
            });
          }
          $(function () {
            // 僅最上層父分類可拖；巢狀子分類只顯示、不可排序
            $("#cto-tree > ol.cto-sortable").sortable({
              handle: ".cto-handle",
              items: "> li.cto-item",
              connectWith: false,
              placeholder: "cto-placeholder",
              tolerance: "pointer",
              opacity: 0.85,
              update: saveOrder
            });
          });
        })(jQuery);
        ';
        wp_add_inline_script('jquery-ui-sortable', $js_page);
    }

    if ($is_list_page) {
        $js_list = '
        (function ($) {
          var NONCE = ' . wp_json_encode($nonce) . ';

          function rowLevel($tr) {
            var cls = ($tr.attr("class") || "").match(/level-(\\d+)/);
            return cls ? parseInt(cls[1], 10) : 0;
          }

          function isParentRow($tr) {
            return rowLevel($tr) === 0;
          }

          function termIdFromRow($tr) {
            var id = $tr.attr("id") || "";
            var m = id.match(/^tag-(\\d+)$/);
            return m ? parseInt(m[1], 10) : 0;
          }

          function setListStatus(text, cls) {
            var $s = $(".cto-list-save-status");
            $s.removeClass("is-saving is-saved is-error");
            if (cls) $s.addClass(cls);
            $s.text(text);
          }

          function saveOrder() {
            var order = [];
            $("#the-list > tr[id^=tag-]").each(function () {
              var id = termIdFromRow($(this));
              if (id) order.push(id);
            });
            if (!order.length) return;

            setListStatus("儲存中…", "is-saving");
            $.post(ajaxurl, {
              action: "category_terms_order_save",
              nonce: NONCE,
              order: order
            }).done(function (res) {
              if (res && res.success) setListStatus("已儲存", "is-saved");
              else setListStatus((res && res.data && res.data.message) ? res.data.message : "儲存失敗", "is-error");
            }).fail(function () {
              setListStatus("儲存失敗，請再試一次", "is-error");
            });
          }

          function injectHandles() {
            $("#the-list > tr[id^=tag-]").each(function () {
              var $tr = $(this);
              $tr.find(".cto-list-handle").remove();
              if (!isParentRow($tr)) return;
              var $name = $tr.find("td.name, td.column-name").first();
              if (!$name.length) return;
              $name.prepend(\'<span class="cto-list-handle" title="拖曳父分類（子分類會跟隨）" aria-label="拖曳父分類">☰</span>\');
            });
          }

          function injectBanner() {
            if ($(".cto-list-banner").length) return;
            var html = \'<div class="cto-list-banner"><strong>拖曳排序：</strong>僅父分類名稱左側有 ☰，拖曳時子分類會自動跟隨。<span class="cto-list-save-status">放開後自動儲存</span></div>\';
            $(".wrap > h1").first().after(html);
          }

          $(function () {
            if (!$("#the-list").length) return;

            injectBanner();
            injectHandles();

            var childrenByParent = {};

            function detachAllChildren() {
              childrenByParent = {};
              $("#the-list > tr.level-0[id^=tag-]").each(function () {
                var $parent = $(this);
                var pid = termIdFromRow($parent);
                var $kids = $parent.nextUntil("tr.level-0", "tr[id^=tag-]");
                childrenByParent[pid] = $kids;
                $kids.detach();
              });
            }

            function reattachAllChildren() {
              $("#the-list > tr.level-0[id^=tag-]").each(function () {
                var $parent = $(this);
                var pid = termIdFromRow($parent);
                var $kids = childrenByParent[pid];
                if ($kids && $kids.length) {
                  $parent.after($kids);
                }
              });
              childrenByParent = {};
            }

            $("#the-list").sortable({
              items: "> tr.level-0[id^=tag-]",
              handle: ".cto-list-handle",
              axis: "y",
              cursor: "grabbing",
              cancel: "a, button, input, select, textarea, .inline-edit-row",
              placeholder: "cto-row-placeholder",
              helper: function (e, $tr) {
                var $cells = $tr.children();
                var $helper = $tr.clone();
                $helper.children().each(function (i) {
                  $(this).width($cells.eq(i).outerWidth());
                });
                return $helper;
              },
              start: function (e, ui) {
                // 拖曳期間先拿掉全部子分類，只留父分類互排
                detachAllChildren();
                ui.item.addClass("cto-dragging");
                ui.placeholder.html(\'<td colspan="\' + ui.item.children("td").length + \'">&nbsp;</td>\');
              },
              stop: function (e, ui) {
                ui.item.removeClass("cto-dragging");
                // 依新父分類順序，把各自的子分類掛回（子分類本身順序不變）
                reattachAllChildren();
                saveOrder();
              }
            });
          });
        })(jQuery);
        ';
        wp_add_inline_script('jquery-ui-sortable', $js_list);
    }
});

/** ---------- AJAX 儲存 ---------- */

add_action('wp_ajax_category_terms_order_save', static function () {
    if (!current_user_can('manage_categories')) {
        wp_send_json_error(['message' => '權限不足'], 403);
    }

    check_ajax_referer('category_terms_order_save', 'nonce');

    $order = isset($_POST['order']) ? (array) wp_unslash($_POST['order']) : [];
    $saved = category_terms_order_save_ids($order);

    if (!$saved) {
        wp_send_json_error(['message' => '沒有可儲存的順序'], 400);
    }

    wp_send_json_success(['saved' => $saved]);
});

/** ---------- 查詢排序：後台列表 + 前台 get_terms / REST ---------- */

/**
 * 強制 category 依 term_order 排序。
 * 後台點欄位標題（name / count…）或程式明確指定非 name 的 orderby 時則不干預。
 *
 * @param array    $clauses    SQL clauses
 * @param string[] $taxonomies
 * @param array    $args
 */
add_filter('terms_clauses', static function ($clauses, $taxonomies, $args) {
    if (!is_array($taxonomies) || !in_array(CATEGORY_TERMS_ORDER_TAXONOMY, $taxonomies, true)) {
        return $clauses;
    }

    // 後台分類表手動點「名稱 / 數量」排序時尊重使用者
    if (
        is_admin()
        && isset($_GET['taxonomy'], $_GET['orderby']) // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        && $_GET['taxonomy'] === CATEGORY_TERMS_ORDER_TAXONOMY // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        && $_GET['orderby'] !== '' // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        && $_GET['orderby'] !== 'term_order' // phpcs:ignore WordPress.Security.NonceVerification.Recommended
    ) {
        return $clauses;
    }

    $orderby = isset($args['orderby']) ? (string) $args['orderby'] : 'name';
    $leave_alone = ['slug', 'term_group', 'term_id', 'id', 'description', 'parent', 'count', 'include', 'meta_value', 'meta_value_num'];
    if (in_array($orderby, $leave_alone, true)) {
        return $clauses;
    }

    $clauses['orderby'] = 'ORDER BY t.term_order';
    $clauses['order']   = 'ASC';

    return $clauses;
}, 10, 3);

add_filter('get_terms_orderby', static function ($orderby, $args, $taxonomies = null) {
    $taxes = $taxonomies;
    if (is_string($taxes)) {
        $taxes = [$taxes];
    }
    if (!is_array($taxes)) {
        $taxes = isset($args['taxonomy']) ? (array) $args['taxonomy'] : [];
    }

    if (!in_array(CATEGORY_TERMS_ORDER_TAXONOMY, $taxes, true)) {
        return $orderby;
    }

    if (isset($args['orderby']) && $args['orderby'] === 'term_order') {
        return 't.term_order';
    }

    return $orderby;
}, 10, 3);

add_filter('rest_category_collection_params', static function ($params) {
    if (isset($params['orderby']['enum']) && is_array($params['orderby']['enum'])) {
        if (!in_array('term_order', $params['orderby']['enum'], true)) {
            $params['orderby']['enum'][] = 'term_order';
        }
        $params['orderby']['default'] = 'term_order';
    }
    if (isset($params['order']['default'])) {
        $params['order']['default'] = 'asc';
    }
    return $params;
});

add_filter('rest_category_query', static function ($args, $request) {
    $orderby = $request->get_param('orderby');
    if ($orderby === null || $orderby === '' || $orderby === 'term_order') {
        $args['orderby'] = 'term_order';
        $args['order']   = $request->get_param('order') ?: 'asc';
    }
    return $args;
}, 10, 2);

/** 新分類預設排到最後 */
add_action('created_category', static function ($term_id) {
    category_terms_order_maybe_install();

    global $wpdb;
    // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
    $max = (int) $wpdb->get_var("SELECT MAX(term_order) FROM `{$wpdb->terms}`");
    // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
    $wpdb->update(
        $wpdb->terms,
        ['term_order' => $max + 1],
        ['term_id' => (int) $term_id],
        ['%d'],
        ['%d']
    );
});
