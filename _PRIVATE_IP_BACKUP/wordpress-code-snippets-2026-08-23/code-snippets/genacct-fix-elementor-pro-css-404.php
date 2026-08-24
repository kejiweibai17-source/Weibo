<?php
/**
 * Genacct：修正 Elementor Pro 導覽 CSS 404（HFE 指錯路徑）
 *
 * 現象：
 * Console 出現
 *   /wp-content/plugins/elementor-pro/assets/css/widget-mega-menu.min.css → 404
 *   /wp-content/plugins/elementor-pro/assets/css/widget-nav-menu.min.css → 404
 *
 * 原因：
 * 網站實際安裝的是 Pro Elements（pro-elements），不是 elementor-pro。
 * Header Footer Elementor (HFE) 仍 enqueue 舊的 elementor-pro 路徑。
 * 正確檔案在：
 *   /wp-content/plugins/pro-elements/assets/css/widget-mega-menu.min.css  (200)
 *   /wp-content/plugins/pro-elements/assets/css/widget-nav-menu.min.css   (200)
 *
 * 與 CLS：
 * 導覽 CSS 載不到 → 選單先以無樣式／錯誤樣式排版，樣式晚到或失敗後再重排
 * → 容易造成 Field CLS（Lab 不一定重現）。
 *
 * WPCode：PHP / Run Everywhere
 * 貼上後請清 WP Rocket 全部快取，硬重新整理確認 Console 不再 404。
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * 把錯誤的 elementor-pro CSS src 改成 pro-elements
 */
function genacct_fix_elementor_pro_css_src( $src ) {
	if ( ! is_string( $src ) || $src === '' ) {
		return $src;
	}

	$map = array(
		'/wp-content/plugins/elementor-pro/assets/css/widget-nav-menu.min.css'  => '/wp-content/plugins/pro-elements/assets/css/widget-nav-menu.min.css',
		'/wp-content/plugins/elementor-pro/assets/css/widget-mega-menu.min.css' => '/wp-content/plugins/pro-elements/assets/css/widget-mega-menu.min.css',
	);

	foreach ( $map as $bad => $good ) {
		if ( strpos( $src, $bad ) !== false ) {
			return str_replace( $bad, $good, $src );
		}
	}

	return $src;
}

add_filter( 'style_loader_src', static function ( $src, $handle ) {
	return genacct_fix_elementor_pro_css_src( $src );
}, 20, 2 );

/**
 * 保險：整頁 HTML（含 WP Rocket preload）一併改寫路徑
 */
add_action( 'template_redirect', static function () {
	if ( is_admin() || wp_doing_ajax() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
		return;
	}

	ob_start( static function ( $html ) {
		if ( ! is_string( $html ) || $html === '' ) {
			return $html;
		}

		$replacements = array(
			'/wp-content/plugins/elementor-pro/assets/css/widget-nav-menu.min.css'  => '/wp-content/plugins/pro-elements/assets/css/widget-nav-menu.min.css',
			'/wp-content/plugins/elementor-pro/assets/css/widget-mega-menu.min.css' => '/wp-content/plugins/pro-elements/assets/css/widget-mega-menu.min.css',
		);

		return str_replace( array_keys( $replacements ), array_values( $replacements ), $html );
	} );
}, 0 );
