<?php
/**
 * Genacct：Navbar RWD + 外觀（正式用）
 *
 * - Logo 110×51、去陰影改淺灰底線、桌機選單穩定
 * - Sticky 勿寫死 px 寬；視窗 <1280 提早漢堡，避免選單被裁
 * - 不要對桌機做「首屏 CSS fixed + spacer 歸零」：
 *   會跟 Elementor sticky 插 spacer 互搶，PSI 桌機常變 ~0.14
 *   （歸因到文章首段如 data-id=ac8e5b7，其實是整塊被推兩次）
 *   桌機原先 Lab ≈ 0.001，維持交給 Elementor sticky 即可
 *
 * WPCode：停用舊 #navbar-cls-fix、停用 genacct-cls-clean-test
 * 可保留：genacct-fix-elementor-pro-css-404.php
 * 啟用後清 WP Rocket。
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'wp_head',
	static function () {
		if ( is_admin() ) {
			return;
		}
		?>
<style id="genacct-desktop-navbar-cls">
/**
 * 外觀：拿掉 box-shadow，改底邊淺灰
 */
#masthead .elementor-element-213c6d93 {
	background-color: #ffffff !important;
	border-style: solid !important;
	border-width: 0 0 1px 0 !important;
	border-color: #F6F6F6 !important;
	box-shadow: none !important;
	outline: none !important;
}
#masthead .elementor-element-213c6d93.elementor-sticky--active,
#masthead .elementor-element-213c6d93.elementor-sticky--effects {
	background-color: #ffffff !important;
	border-color: #F6F6F6 !important;
	box-shadow: none !important;
}

/**
 * RWD：蓋過 sticky inline width:1233px
 * 勿對 #masthead 用 overflow-x:clip（會直接裁掉選單字）
 */
html {
	overflow-x: clip;
}
body {
	overflow-x: clip;
	max-width: 100%;
}
#masthead,
.ehf-header #masthead {
	width: 100% !important;
	max-width: 100% !important;
}
#masthead .elementor-element-213c6d93,
#masthead .elementor-element-213c6d93.elementor-sticky--active,
#masthead .elementor-element-213c6d93.elementor-sticky--effects,
#masthead .elementor-element-213c6d93.elementor-sticky {
	width: 100% !important;
	max-width: 100% !important;
	left: 0 !important;
	right: auto !important;
	box-sizing: border-box !important;
}
#masthead .elementor-element-213c6d93 > .elementor-container {
	width: 100% !important;
	max-width: 1280px !important;
	margin-left: auto !important;
	margin-right: auto !important;
	padding-left: 16px !important;
	padding-right: 16px !important;
	box-sizing: border-box !important;
}

/**
 * Logo：全裝置 110×51
 */
#masthead .elementor-element-6aa70dde,
#masthead .elementor-element-6aa70dde a {
	display: block;
	width: 110px;
	height: 51px;
	line-height: 0;
	overflow: visible;
}
#masthead .elementor-element-6aa70dde img {
	width: 110px !important;
	height: 51px !important;
	max-width: 110px !important;
	object-fit: contain;
	display: block;
	aspect-ratio: 170 / 79;
}

/**
 * 桌機橫向選單（夠寬才用）
 */
@media (min-width: 1280px) {
	.elementor-element-63060d95,
	.elementor-element-63060d95 .elementor-nav-menu--main,
	.elementor-element-63060d95 .elementor-widget-container {
		min-height: 52px;
	}

	#menu-1-63060d95.elementor-nav-menu {
		display: flex !important;
		align-items: center;
		flex-wrap: nowrap;
		min-height: 52px;
		margin: 0 !important;
		padding: 0 !important;
	}

	#menu-1-63060d95 > .menu-item {
		display: flex;
		align-items: center;
		height: 52px;
		flex: 0 0 auto;
	}

	#menu-1-63060d95 > .menu-item > a.elementor-item {
		display: inline-flex;
		align-items: center;
		white-space: nowrap;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC",
			"Hiragino Sans CNS", "Microsoft JhengHei", "Noto Sans TC", sans-serif !important;
		font-size: 16px !important;
		font-weight: 500 !important;
		line-height: 52px !important;
		height: 52px;
		padding-top: 0 !important;
		padding-bottom: 0 !important;
		padding-left: 14px !important;
		padding-right: 14px !important;
		box-sizing: border-box;
	}

	#menu-1-63060d95 > .menu-item-has-children > a.elementor-item {
		padding-right: 28px !important;
	}

	#menu-1-63060d95 .elementor-item .sub-arrow,
	#menu-1-63060d95 .elementor-item svg {
		width: 10px;
		height: 10px;
		flex: 0 0 10px;
	}

	#menu-1-63060d95 .sub-menu {
		position: absolute !important;
		top: 100% !important;
		left: 0;
		z-index: 999;
		margin: 0;
	}
}

/**
 * <1280：提早漢堡（Elementor 預設要到 tablet≈1024 才切，中間寬度會爆）
 */
@media (max-width: 1279px) {
	#masthead .elementor-element-63060d95 .elementor-nav-menu--main {
		display: none !important;
	}
	#masthead .elementor-element-63060d95 .elementor-menu-toggle {
		display: inline-flex !important;
		align-items: center;
		justify-content: center;
		order: 1;
	}
	/* 未展開時隱藏下拉層，避免佔位 */
	#masthead .elementor-element-63060d95 .elementor-nav-menu--dropdown {
		display: none;
	}
	#masthead .elementor-element-63060d95 .elementor-menu-toggle.elementor-active + .elementor-nav-menu--dropdown,
	#masthead .elementor-element-63060d95.elementor-active .elementor-nav-menu--dropdown {
		display: block;
	}
}
</style>
		<?php
	},
	100
);
