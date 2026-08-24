<?php
/**
 * Genacct：CLS 乾淨測試 + 最小 Header 預留
 *
 * 【已改正式方案】桌機 Navbar CLS 請改用 genacct-desktop-navbar-cls.php，
 * 並停用本檔與舊 #navbar-cls-fix，勿三套並存。
 *
 * 為何一直「修不好」：
 * 1) PageSpeed Lab CLS≈0.002（綠）≠ Search Console / CrUX Field CLS≈0.37（紅）
 *    Lab 幾乎不模擬真實滾動；Field 含 sticky header、字型、晚載入元件的整段 session。
 * 2) 舊 navbar-cls-fix 與 logo 尺寸打架：
 *    HTML 宣告 width=200 height=93，CSS 強迫 170×79，header min-height 卻只有 72
 *    → 首屏預留錯、載入後縮回，Field CLS 會爆。
 * 3) PSI 點名的「公司會計報稅服務 0.001」只是 Lab 雜訊，不是 GSC 0.38 的主因。
 *
 * 用法（WPCode：PHP / Run Everywhere）：
 * A) 正常瀏覽：套用下方「最小預留」CSS（與舊 navbar 並存時，用更高優先覆蓋尺寸）
 * B) 乾淨 A/B：網址加 ?genacct_cls=off  → 停用舊 #navbar-cls-fix 全部規則，只留本檔預留
 * C) 量測：網址加 ?genacct_cls=debug → console 印出每次 layout-shift 的來源節點
 *
 * 測試後請清 WP Rocket。Field 分數要 28 天 CrUX 才會明顯掉，不要用 Lab 判斷修好沒。
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * 讀 query：off | debug |（空=只套最小預留）
 */
function genacct_cls_mode() {
	if ( empty( $_GET['genacct_cls'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		return 'on';
	}
	$mode = sanitize_key( wp_unslash( $_GET['genacct_cls'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	return in_array( $mode, array( 'on', 'off', 'debug' ), true ) ? $mode : 'on';
}

add_action( 'wp_head', static function () {
	if ( is_admin() ) {
		return;
	}
	$mode = genacct_cls_mode();
	?>
<style id="genacct-cls-clean">
<?php if ( $mode === 'off' ) : ?>
/* ===== A/B：暫時廢掉舊 navbar-cls-fix，避免兩套規則互打 ===== */
#navbar-cls-fix { display: none !important; }
<?php endif; ?>

/* ===== 最小預留：logo / header 尺寸必須一致（治本） ===== */
#masthead .elementor-element-6aa70dde,
#masthead .elementor-element-6aa70dde a {
	display: block;
	width: 170px;
	height: 79px;
	line-height: 0;
}
#masthead .elementor-element-6aa70dde img {
	width: 170px !important;
	height: 79px !important;
	max-width: 170px !important;
	object-fit: contain;
	display: block;
	aspect-ratio: 170 / 79;
}

/* header 高度 = logo，不要小於 logo（舊 snippet min-height:72 會擠壓） */
#masthead .elementor-element-213c6d93,
#masthead .elementor-element-213c6d93 > .elementor-container {
	min-height: 79px;
	box-sizing: border-box;
}

/* sticky spacer 必須佔位；不要 visibility 亂搞到高度計算 */
#masthead .elementor-sticky__spacer {
	visibility: hidden !important;
	pointer-events: none !important;
	display: block !important;
}

/* 導覽列固定字級，減少字型 swap 擠動（不鎖死單一 menu item 寬度） */
@media (min-width: 1025px) {
	#menu-1-63060d95 > .menu-item > a.elementor-item {
		font-family: "PingFang TC", "Hiragino Sans CNS", "Noto Sans TC", "Microsoft JhengHei", sans-serif !important;
		font-size: 16px !important;
		font-weight: 500 !important;
		line-height: 52px !important;
		height: 52px;
		padding-top: 0 !important;
		padding-bottom: 0 !important;
		box-sizing: border-box;
		white-space: nowrap;
	}
}
</style>
	<?php
}, 100 );

/**
 * debug：把真實 CLS 來源打到 console（Field 級除錯用）
 */
add_action( 'wp_footer', static function () {
	if ( is_admin() || genacct_cls_mode() !== 'debug' ) {
		return;
	}
	?>
<script id="genacct-cls-debug">
(function () {
	var total = 0;
	var count = 0;

	function nodeName(n) {
		if (!n || !n.tagName) return '(unknown)';
		return n.tagName.toLowerCase()
			+ (n.id ? '#' + n.id : '')
			+ (n.className && typeof n.className === 'string'
				? '.' + n.className.trim().split(/\s+/).slice(0, 3).join('.')
				: '');
	}

	function paintBadge() {
		var el = document.getElementById('genacct-cls-badge');
		if (!el) {
			el = document.createElement('div');
			el.id = 'genacct-cls-badge';
			el.style.cssText = 'position:fixed;z-index:2147483647;left:12px;bottom:12px;background:#111;color:#fff;font:12px/1.4 monospace;padding:10px 12px;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.35);max-width:90vw;';
			document.body.appendChild(el);
		}
		el.textContent = '[genacct-cls] shifts=' + count + '  CLS=' + total.toFixed(4)
			+ (total >= 0.25 ? '  POOR' : total >= 0.1 ? '  NI' : '  OK');
	}

	function handleEntry(entry) {
		if (entry.hadRecentInput) return;
		total += entry.value;
		count += 1;
		var nodes = (entry.sources || []).map(function (s) { return nodeName(s.node); });
		console.log('[genacct-cls] shift', entry.value.toFixed(4), 'total', total.toFixed(4), nodes);
		paintBadge();
	}

	function dumpBuffered(label) {
		var list = performance.getEntriesByType
			? performance.getEntriesByType('layout-shift')
			: [];
		console.log('[genacct-cls] dump (' + label + ') raw entries=', list.length);
		list.forEach(handleEntry);
		if (!list.length) {
			console.log('[genacct-cls] 目前 0 次位移（這次瀏覽很穩）。Field 0.37 是很多人平均，單次可能測不到。');
		}
		paintBadge();
	}

	paintBadge();
	console.log('[genacct-cls] debug on — 請關掉手機預覽，用一般視窗，硬重新整理後從頂慢慢捲');

	if ('PerformanceObserver' in window) {
		try {
			var po = new PerformanceObserver(function (list) {
				list.getEntries().forEach(handleEntry);
			});
			po.observe({ type: 'layout-shift', buffered: true });
		} catch (e) {
			console.warn('[genacct-cls] observe failed', e);
		}
	}

	// 載入後 / 捲動後再掃一次 buffered
	setTimeout(function () { dumpBuffered('1s'); }, 1000);
	setTimeout(function () { dumpBuffered('3s'); }, 3000);
	setTimeout(function () { dumpBuffered('8s'); }, 8000);
	window.addEventListener('scroll', function () {
		clearTimeout(window.__genacctClsScrollT);
		window.__genacctClsScrollT = setTimeout(function () {
			dumpBuffered('after-scroll');
		}, 400);
	}, { passive: true });
})();
</script>
	<?php
}, 5 );
