<?php
/**
 * Genacct：Elementor Slides hero CLS（服務頁）
 *
 * 問題：頂部 Slides 高度只寫在 post-XXXX.css / widget-slides（WP Rocket async），
 * 首屏高度 ≈ 0 → CSS 晚到後突然變高 → 下方 section 被推（PSI 常點名下方區塊，
 * 分數可到 0.5–0.6）。例：/company-secretary/、/auditing/、/taxation/…
 *
 * 作法：wp_head 極早輸出與 Elementor 相同的固定高度，不依賴 async CSS。
 * 對齊 Elementor 產出：桌機 521px、≤1024 400px、≤767 386px。
 *
 * 範圍：所有含 .elementor-widget-slides 的頁（服務頁常見）。
 * 不含：文章 Single Post sticky header 那群（/etax/ Field 群）——那是另一個問題。
 *
 * WPCode：PHP / Run Everywhere / 標題建議 genacct-slides-hero-cls
 * 啟用後清 WP Rocket。可與 genacct-desktop-navbar-cls 並存。
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
<style id="genacct-slides-hero-cls">
/**
 * 在 async Elementor CSS 到達前預留 Slides 高度，避免下方內容 CLS。
 * display:none 的 RWD 隱藏 slides（elementor-hidden-*）不會佔位。
 */
.elementor-widget-slides .elementor-slides-wrapper,
.elementor-widget-slides .elementor-main-swiper,
.elementor-widget-slides .swiper,
.elementor-widget-slides .swiper-wrapper,
.elementor-widget-slides .swiper-slide {
	min-height: 521px;
	height: 521px;
	box-sizing: border-box;
}

.elementor-widget-slides .swiper-slide-bg {
	min-height: 521px;
	height: 100%;
}

@media (max-width: 1024px) {
	.elementor-widget-slides .elementor-slides-wrapper,
	.elementor-widget-slides .elementor-main-swiper,
	.elementor-widget-slides .swiper,
	.elementor-widget-slides .swiper-wrapper,
	.elementor-widget-slides .swiper-slide {
		min-height: 400px;
		height: 400px;
	}
	.elementor-widget-slides .swiper-slide-bg {
		min-height: 400px;
	}
}

@media (max-width: 767px) {
	.elementor-widget-slides .elementor-slides-wrapper,
	.elementor-widget-slides .elementor-main-swiper,
	.elementor-widget-slides .swiper,
	.elementor-widget-slides .swiper-wrapper,
	.elementor-widget-slides .swiper-slide {
		min-height: 386px;
		height: 386px;
	}
	.elementor-widget-slides .swiper-slide-bg {
		min-height: 386px;
	}
}
</style>
		<?php
	},
	1
);
