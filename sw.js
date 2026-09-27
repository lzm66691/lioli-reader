/* PWA Service Worker — 莉萝阅读器 画笔图层z-index提到最高（真机被页面层压住修复）（2026-09-27）
   外壳缓存 reader-p2-dg-v35（含 pdf.js 全套）；PDF 缓存 reader-pdf-v1（按需 cache-first）
   升级纪律：改外壳/pdf.js → 同时改缓存名 */
var CACHE_SHELL = "reader-p2-dg-v35";
var CACHE_PDF   = "reader-pdf-v1";

/* PWA 离线预缓存：公开 6 本 PDF（共约 4MB），安装后全部本地可用 */
var PDF_URLS = [
  "./papers/c-ch4.pdf",
  "./papers/c-ch4-ex.pdf",
  "./papers/c-ch10.pdf",
  "./papers/c-ch10-ex.pdf",
  "./papers/c-ch12.pdf",
  "./papers/c-ch12-ex.pdf"
];

var SHELL_URLS = [
  "./",
  "./阅读器.html",
  "./阅读器注入.css",
  "./manifest.json",
  "./vendor/pdfjs/LICENSE",
  "./vendor/pdfjs/build/pdf.mjs",
  "./vendor/pdfjs/build/pdf.worker.mjs",
  "./vendor/pdfjs/web/viewer.html",
  "./vendor/pdfjs/web/viewer.mjs",
  "./vendor/pdfjs/web/viewer.css",
  "./vendor/pdfjs/web/locale/zh-CN/viewer.ftl",
  "./vendor/pdfjs/web/locale/en-US/viewer.ftl",
  /* images 82 */
  "./vendor/pdfjs/web/images/altText_add.svg",
  "./vendor/pdfjs/web/images/altText_disclaimer.svg",
  "./vendor/pdfjs/web/images/altText_done.svg",
  "./vendor/pdfjs/web/images/altText_spinner.svg",
  "./vendor/pdfjs/web/images/altText_warning.svg",
  "./vendor/pdfjs/web/images/annotation-check.svg",
  "./vendor/pdfjs/web/images/annotation-comment.svg",
  "./vendor/pdfjs/web/images/annotation-help.svg",
  "./vendor/pdfjs/web/images/annotation-insert.svg",
  "./vendor/pdfjs/web/images/annotation-key.svg",
  "./vendor/pdfjs/web/images/annotation-newparagraph.svg",
  "./vendor/pdfjs/web/images/annotation-noicon.svg",
  "./vendor/pdfjs/web/images/annotation-note.svg",
  "./vendor/pdfjs/web/images/annotation-paperclip.svg",
  "./vendor/pdfjs/web/images/annotation-paragraph.svg",
  "./vendor/pdfjs/web/images/annotation-pushpin.svg",
  "./vendor/pdfjs/web/images/checkmark.svg",
  "./vendor/pdfjs/web/images/comment-actionsButton.svg",
  "./vendor/pdfjs/web/images/comment-closeButton.svg",
  "./vendor/pdfjs/web/images/comment-editButton.svg",
  "./vendor/pdfjs/web/images/comment-popup-editButton.svg",
  "./vendor/pdfjs/web/images/cursor-editorFreeHighlight.svg",
  "./vendor/pdfjs/web/images/cursor-editorFreeText.svg",
  "./vendor/pdfjs/web/images/cursor-editorInk.svg",
  "./vendor/pdfjs/web/images/cursor-editorTextHighlight.svg",
  "./vendor/pdfjs/web/images/editor-toolbar-delete.svg",
  "./vendor/pdfjs/web/images/editor-toolbar-edit.svg",
  "./vendor/pdfjs/web/images/findbarButton-next.svg",
  "./vendor/pdfjs/web/images/findbarButton-previous.svg",
  "./vendor/pdfjs/web/images/gv-toolbarButton-download.svg",
  "./vendor/pdfjs/web/images/loading.svg",
  "./vendor/pdfjs/web/images/loading-icon.gif",
  "./vendor/pdfjs/web/images/messageBar_closingButton.svg",
  "./vendor/pdfjs/web/images/messageBar_info.svg",
  "./vendor/pdfjs/web/images/messageBar_warning.svg",
  "./vendor/pdfjs/web/images/pages_closeButton.svg",
  "./vendor/pdfjs/web/images/pages_selected.svg",
  "./vendor/pdfjs/web/images/pages_viewArrow.svg",
  "./vendor/pdfjs/web/images/pages_viewButton.svg",
  "./vendor/pdfjs/web/images/secondaryToolbarButton-documentProperties.svg",
  "./vendor/pdfjs/web/images/secondaryToolbarButton-firstPage.svg",
  "./vendor/pdfjs/web/images/secondaryToolbarButton-handTool.svg",
  "./vendor/pdfjs/web/images/secondaryToolbarButton-lastPage.svg",
  "./vendor/pdfjs/web/images/secondaryToolbarButton-rotateCcw.svg",
  "./vendor/pdfjs/web/images/secondaryToolbarButton-rotateCw.svg",
  "./vendor/pdfjs/web/images/secondaryToolbarButton-scrollHorizontal.svg",
  "./vendor/pdfjs/web/images/secondaryToolbarButton-scrollPage.svg",
  "./vendor/pdfjs/web/images/secondaryToolbarButton-scrollVertical.svg",
  "./vendor/pdfjs/web/images/secondaryToolbarButton-scrollWrapped.svg",
  "./vendor/pdfjs/web/images/secondaryToolbarButton-selectTool.svg",
  "./vendor/pdfjs/web/images/secondaryToolbarButton-spreadEven.svg",
  "./vendor/pdfjs/web/images/secondaryToolbarButton-spreadNone.svg",
  "./vendor/pdfjs/web/images/secondaryToolbarButton-spreadOdd.svg",
  "./vendor/pdfjs/web/images/signature-properties-row-check.svg",
  "./vendor/pdfjs/web/images/toolbarButton-bookmark.svg",
  "./vendor/pdfjs/web/images/toolbarButton-currentOutlineItem.svg",
  "./vendor/pdfjs/web/images/toolbarButton-download.svg",
  "./vendor/pdfjs/web/images/toolbarButton-editorFreeText.svg",
  "./vendor/pdfjs/web/images/toolbarButton-editorHighlight.svg",
  "./vendor/pdfjs/web/images/toolbarButton-editorInk.svg",
  "./vendor/pdfjs/web/images/toolbarButton-editorSignature.svg",
  "./vendor/pdfjs/web/images/toolbarButton-editorStamp.svg",
  "./vendor/pdfjs/web/images/toolbarButton-menuArrow.svg",
  "./vendor/pdfjs/web/images/toolbarButton-menuArrowNova.svg",
  "./vendor/pdfjs/web/images/toolbarButton-openFile.svg",
  "./vendor/pdfjs/web/images/toolbarButton-pageDown.svg",
  "./vendor/pdfjs/web/images/toolbarButton-pageUp.svg",
  "./vendor/pdfjs/web/images/toolbarButton-presentationMode.svg",
  "./vendor/pdfjs/web/images/toolbarButton-print.svg",
  "./vendor/pdfjs/web/images/toolbarButton-search.svg",
  "./vendor/pdfjs/web/images/toolbarButton-secondaryToolbarToggle.svg",
  "./vendor/pdfjs/web/images/toolbarButton-signaturePropertiesError.svg",
  "./vendor/pdfjs/web/images/toolbarButton-signaturePropertiesVerified.svg",
  "./vendor/pdfjs/web/images/toolbarButton-viewAttachments.svg",
  "./vendor/pdfjs/web/images/toolbarButton-viewLayers.svg",
  "./vendor/pdfjs/web/images/toolbarButton-viewOutline.svg",
  "./vendor/pdfjs/web/images/toolbarButton-viewsManagerToggle.svg",
  "./vendor/pdfjs/web/images/toolbarButton-viewThumbnail.svg",
  "./vendor/pdfjs/web/images/toolbarButton-zoomIn.svg",
  "./vendor/pdfjs/web/images/toolbarButton-zoomOut.svg",
  "./vendor/pdfjs/web/images/treeitem-collapsed.svg",
  "./vendor/pdfjs/web/images/treeitem-expanded.svg",
  /* wasm 13 */
  "./vendor/pdfjs/web/wasm/jbig2.wasm",
  "./vendor/pdfjs/web/wasm/jbig2_nowasm_fallback.js",
  "./vendor/pdfjs/web/wasm/LICENSE_JBIG2",
  "./vendor/pdfjs/web/wasm/LICENSE_OPENJPEG",
  "./vendor/pdfjs/web/wasm/LICENSE_PDFJS_JBIG2",
  "./vendor/pdfjs/web/wasm/LICENSE_PDFJS_OPENJPEG",
  "./vendor/pdfjs/web/wasm/LICENSE_PDFJS_QCMS",
  "./vendor/pdfjs/web/wasm/LICENSE_QCMS",
  "./vendor/pdfjs/web/wasm/openjpeg.wasm",
  "./vendor/pdfjs/web/wasm/openjpeg_nowasm_fallback.js",
  "./vendor/pdfjs/web/wasm/qcms_bg.wasm",
  "./vendor/pdfjs/web/wasm/quickjs-eval.js",
  "./vendor/pdfjs/web/wasm/quickjs-eval.wasm",
  /* iccs 2 */
  "./vendor/pdfjs/web/iccs/CGATS001Compat-v2-micro.icc",
  "./vendor/pdfjs/web/iccs/LICENSE"
];

self.addEventListener("install", function(ev){
  ev.waitUntil((async function(){
    var cache = await caches.open(CACHE_SHELL);
    var failed = [];
    for (var i = 0; i < SHELL_URLS.length; i++) {
      try { await cache.add(SHELL_URLS[i]); }
      catch(e){ failed.push(SHELL_URLS[i]); }
    }
    if (failed.length) console.warn("[SW] 预缓存失败 " + failed.length + " 项:", failed);
    /* 预缓存 PDF（按需 cache-first 的 PDF 也在此提前全量缓存，PWA 离线可用） */
    try {
      var pc = await caches.open(CACHE_PDF);
      for (var p = 0; p < PDF_URLS.length; p++) {
        try { await pc.add(PDF_URLS[p]); } catch(e){}
      }
    } catch(e){}
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", function(ev){
  ev.waitUntil((async function(){
    var keys = await caches.keys();
    await Promise.all(keys.filter(function(k){ return k !== CACHE_SHELL && k !== CACHE_PDF; }).map(function(k){ return caches.delete(k); }));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", function(ev){
  var req = ev.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;
  /* PDF：单独缓存，cache-first + 回源入缓存（不混进外壳，更新外壳不清 PDF）*/
  if (url.pathname.indexOf("/papers/") >= 0) {
    ev.respondWith((async function(){
      var c = await caches.open(CACHE_PDF);
      var hit = await c.match(req);
      if (hit) return hit;
      var res = await fetch(req);
      if (res && res.ok) c.put(req, res.clone());
      return res;
    })());
    return;
  }
  /* 外壳：cache-first */
  ev.respondWith((async function(){
    var hit = await caches.match(req);
    if (hit) return hit;
    var res = await fetch(req);
    if (res && res.ok) {
      var c = await caches.open(CACHE_SHELL);
      c.put(req, res.clone());
    }
    return res;
  })());
});
