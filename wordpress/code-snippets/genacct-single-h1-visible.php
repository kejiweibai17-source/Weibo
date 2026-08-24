<?php
/**
 * Genacct：強制顯示單篇文章 H1
 *
 * 根因：
 * Header（Elementor 26121 / 26133）Page Settings → Hide Title
 * 會輸出 :root { --page-title-display: none }
 * Elementor 前端 CSS：.elementor-page-title { display: var(--page-title-display) }
 * Single Post 的 Theme Post Title widget 帶有 class="elementor-page-title"
 * → H1 在 HTML 裡，但畫面被 display:none 藏掉。
 *
 * WPCode：PHP snippet / Run Everywhere
 * 貼上後請清 WP Rocket（至少清該篇文章 URL）
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * CSS：只在單篇 Theme Builder 位置強制顯示文章標題
 */
add_action( 'wp_head', static function () {
	if ( is_admin() || ! is_singular( 'post' ) ) {
		return;
	}
	?>
<style id="genacct-single-h1-fix">
.elementor-location-single .elementor-widget-theme-post-title,
.elementor-location-single .elementor-widget-theme-post-title.elementor-page-title,
.elementor-location-single h1.elementor-heading-title {
	display: block !important;
	visibility: visible !important;
	opacity: 1 !important;
	height: auto !important;
	max-height: none !important;
	overflow: visible !important;
	position: static !important;
	clip: auto !important;
	color: #195562 !important;
	font-family: "Noto Sans TC", sans-serif !important;
	font-weight: 600 !important;
	font-size: 28px !important;
	line-height: 1.4 !important;
	margin: 16px 0 12px !important;
}
@media (max-width: 767px) {
	.elementor-location-single h1.elementor-heading-title {
		font-size: 22px !important;
	}
}
</style>
	<?php
}, 99 );

/**
 * 拿掉 Theme Post Title 的 elementor-page-title class
 * 即使 Header 再輸出 --page-title-display:none 也不會打到文章 H1
 */
add_filter( 'elementor/widget/render_content', static function ( $content, $widget ) {
	if ( ! is_object( $widget ) || $widget->get_name() !== 'theme-post-title' ) {
		return $content;
	}
	return str_replace( ' elementor-page-title', '', $content );
}, 20, 2 );
