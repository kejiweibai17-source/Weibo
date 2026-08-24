<?php
/**
 * Genacct：單篇文章 H1 顯示（乾淨版）
 *
 * 根因：
 * Header Hide Title → :root { --page-title-display: none }
 * .elementor-page-title { display: var(--page-title-display) }
 * Theme Post Title 的「外層 wrapper」帶有 elementor-page-title
 * （注意：舊版用 render_content 過濾無效，因為 class 在 wrapper 不在內容）
 *
 * WPCode：PHP / Run Everywhere
 * 貼上後務必：WP Rocket → 清除全部快取（舊 HTML 仍帶 elementor-page-title）
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * 在 Elementor 渲染前拿掉 wrapper 的 elementor-page-title
 */
add_action( 'elementor/frontend/widget/before_render', static function ( $widget ) {
	if ( ! is_object( $widget ) || $widget->get_name() !== 'theme-post-title' ) {
		return;
	}
	// Elementor 把 page-title class 加在 _wrapper
	$widget->remove_render_attribute( '_wrapper', 'class', 'elementor-page-title' );
}, 5 );

/**
 * 保險：整頁 HTML 再清一次（含 WP Rocket 重建前的殘留）
 */
add_action( 'template_redirect', static function () {
	if ( is_admin() || ! is_singular( 'post' ) || is_feed() ) {
		return;
	}
	ob_start( static function ( $html ) {
		if ( ! is_string( $html ) || $html === '' ) {
			return $html;
		}
		// 只動 Theme Post Title wrapper，不動其他
		$html = preg_replace(
			'/(\bclass="[^"]*\belementor-widget-theme-post-title\b[^"]*)\s*\belementor-page-title\b/',
			'$1',
			$html
		);
		return $html;
	} );
}, 0 );

/**
 * CSS：只保證顯示，不強制改字級／行高／margin（避免二次 CLS）
 */
add_action( 'wp_head', static function () {
	if ( is_admin() || ! is_singular( 'post' ) ) {
		return;
	}
	?>
<style id="genacct-single-h1-fix">
/* Header Hide Title 會把 --page-title-display 設成 none；這裡只解鎖顯示 */
.elementor-location-single .elementor-widget-theme-post-title,
.elementor-location-single .elementor-widget-theme-post-title.elementor-page-title {
	display: block !important;
}
.elementor-location-single .elementor-widget-theme-post-title .elementor-heading-title,
.elementor-location-single .elementor-widget-theme-post-title h1 {
	display: block !important;
	visibility: visible !important;
	opacity: 1 !important;
}
</style>
	<?php
}, 99 );
