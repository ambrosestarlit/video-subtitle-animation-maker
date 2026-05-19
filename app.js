(() => {
  "use strict";

  const CANVAS_WIDTH = 1920;
  const CANVAS_HEIGHT = 1080;
  const CACHE_DB_NAME = "video-subtitle-animation-maker";
  const CACHE_STORE_NAME = "projects";
  const CACHE_KEY = "autosave";
  const PRESET_STORAGE_KEY = "video-subtitle-animation-maker-presets";
  const DEFAULT_UI_LANGUAGE = ((navigator.language || "ja").toLowerCase().startsWith("ja") ? "ja" : "en");

  const FONT_OPTIONS = [
    { label: "システムゴシック", labelEn: "System Gothic", value: "\"Yu Gothic UI\", \"Yu Gothic\", \"Hiragino Sans\", \"Meiryo\", sans-serif" },
    { label: "Noto Sans JP", value: "\"Noto Sans JP\", sans-serif" },
    { label: "Zen Kaku Gothic New", value: "\"Zen Kaku Gothic New\", sans-serif" },
    { label: "BIZ UDPGothic", value: "\"BIZ UDPGothic\", sans-serif" },
    { label: "BIZ UDGothic", value: "\"BIZ UDGothic\", sans-serif" },
    { label: "M PLUS 1p", value: "\"M PLUS 1p\", sans-serif" },
    { label: "M PLUS 1", value: "\"M PLUS 1\", sans-serif" },
    { label: "M PLUS 2", value: "\"M PLUS 2\", sans-serif" },
    { label: "IBM Plex Sans JP", value: "\"IBM Plex Sans JP\", sans-serif" },
    { label: "Sawarabi Gothic", value: "\"Sawarabi Gothic\", sans-serif" },
    { label: "Kosugi", value: "\"Kosugi\", sans-serif" },
    { label: "M PLUS Rounded 1c", value: "\"M PLUS Rounded 1c\", sans-serif" },
    { label: "Zen Maru Gothic", value: "\"Zen Maru Gothic\", sans-serif" },
    { label: "Kiwi Maru", value: "\"Kiwi Maru\", serif" },
    { label: "Kosugi Maru", value: "\"Kosugi Maru\", sans-serif" },
    { label: "Noto Serif JP", value: "\"Noto Serif JP\", serif" },
    { label: "Shippori Mincho", value: "\"Shippori Mincho\", serif" },
    { label: "Zen Old Mincho", value: "\"Zen Old Mincho\", serif" },
    { label: "Sawarabi Mincho", value: "\"Sawarabi Mincho\", serif" },
    { label: "Hina Mincho", value: "\"Hina Mincho\", serif" },
    { label: "BIZ UDMincho", value: "\"BIZ UDMincho\", serif" },
    { label: "BIZ UDPMincho", value: "\"BIZ UDPMincho\", serif" },
    { label: "Klee One", value: "\"Klee One\", cursive" },
    { label: "Yomogi", value: "\"Yomogi\", cursive" },
    { label: "Yuji Syuku", value: "\"Yuji Syuku\", serif" },
    { label: "Yuji Mai", value: "\"Yuji Mai\", serif" },
    { label: "Yuji Boku", value: "\"Yuji Boku\", serif" },
    { label: "DotGothic16", value: "\"DotGothic16\", sans-serif" },
    { label: "Dela Gothic One", value: "\"Dela Gothic One\", sans-serif" },
    { label: "Rampart One", value: "\"Rampart One\", sans-serif" },
    { label: "Reggae One", value: "\"Reggae One\", sans-serif" },
    { label: "Stick", value: "\"Stick\", sans-serif" }
  ];

  const $ = (selector) => document.querySelector(selector);

  const canvas = $("#previewCanvas");
  const ctx = canvas.getContext("2d", { alpha: true });
  const uiLanguageSelect = $("#uiLanguageSelect");
  const openManualBtn = $("#openManualBtn");
  const manualModal = $("#manualModal");
  const manualModalTitle = $("#manualModalTitle");
  const manualModalBody = $("#manualModalBody");
  const closeManualBtn = $("#closeManualBtn");
  const closeManualFooterBtn = $("#closeManualFooterBtn");

  const audioInput = $("#audioInput");
  const audioChooseLabel = $("#audioChooseLabel");
  const audioChosenLabel = $("#audioChosenLabel");
  const audioPlayer = $("#audioPlayer");
  const audioFileInfo = $("#audioFileInfo");
  const clearAudioBtn = $("#clearAudioBtn");
  const lyricsInput = $("#lyricsInput");
  const lyricsChooseLabel = $("#lyricsChooseLabel");
  const lyricsChosenLabel = $("#lyricsChosenLabel");
  const previewBgColorInput = $("#previewBgColorInput");
  const previewBgFitSelect = $("#previewBgFitSelect");
  const previewBgScaleInput = $("#previewBgScaleInput");
  const previewBgScaleOutput = $("#previewBgScaleOutput");
  const previewBgOffsetXInput = $("#previewBgOffsetXInput");
  const previewBgOffsetXOutput = $("#previewBgOffsetXOutput");
  const previewBgOffsetYInput = $("#previewBgOffsetYInput");
  const previewBgOffsetYOutput = $("#previewBgOffsetYOutput");
  const previewBgImageInput = $("#previewBgImageInput");
  const previewBgChooseLabel = $("#previewBgChooseLabel");
  const previewBgChosenLabel = $("#previewBgChosenLabel");
  const clearPreviewBgImageBtn = $("#clearPreviewBgImageBtn");

  const defaultFontFamilyInput = $("#defaultFontFamilyInput");
  const defaultFontSizeInput = $("#defaultFontSizeInput");
  const defaultFontSizeOutput = $("#defaultFontSizeOutput");
  const defaultDurationInput = $("#defaultDurationInput");
  const defaultAnimationInput = $("#defaultAnimationInput");
  const defaultAlignInput = $("#defaultAlignInput");
  const autoChainSelect = $("#autoChainSelect");
  const applyDefaultToSelectedBtn = $("#applyDefaultToSelectedBtn");

  const lyricsCountInfo = $("#lyricsCountInfo");
  const clearSubtitlesBtn = $("#clearSubtitlesBtn");
  const lyricsButtonList = $("#lyricsButtonList");
  const cueList = $("#cueList");

  const activeCueInfo = $("#activeCueInfo");
  const setPreviewFromAudioBtn = $("#setPreviewFromAudioBtn");
  const previewTimeInput = $("#previewTimeInput");
  const previewTimeRange = $("#previewTimeRange");
  const renderPreviewBtn = $("#renderPreviewBtn");

  const selectedEmptyMessage = $("#selectedEmptyMessage");
  const cueEditor = $("#cueEditor");
  const presetNameInput = $("#presetNameInput");
  const presetSelect = $("#presetSelect");
  const savePresetBtn = $("#savePresetBtn");
  const applyPresetBtn = $("#applyPresetBtn");
  const deletePresetBtn = $("#deletePresetBtn");
  const cueTextInput = $("#cueTextInput");
  const cueStartInput = $("#cueStartInput");
  const cueEndInput = $("#cueEndInput");
  const cueAnimationInput = $("#cueAnimationInput");
  const cueAlignInput = $("#cueAlignInput");
  const cueXInput = $("#cueXInput");
  const cueXOutput = $("#cueXOutput");
  const cueYInput = $("#cueYInput");
  const cueYOutput = $("#cueYOutput");
  const cueMaxWidthInput = $("#cueMaxWidthInput");
  const cueMaxWidthOutput = $("#cueMaxWidthOutput");
  const cueFontFamilyInput = $("#cueFontFamilyInput");
  const cueFontSizeInput = $("#cueFontSizeInput");
  const cueFontSizeOutput = $("#cueFontSizeOutput");
  const cueColorInput = $("#cueColorInput");
  const cueLineHeightInput = $("#cueLineHeightInput");
  const cueLetterSpacingInput = $("#cueLetterSpacingInput");
  const cueLetterSpacingOutput = $("#cueLetterSpacingOutput");
  const cueLetterSpacingPanInput = $("#cueLetterSpacingPanInput");
  const cueLetterSpacingPanOutput = $("#cueLetterSpacingPanOutput");
  const cuePanXInput = $("#cuePanXInput");
  const cuePanXOutput = $("#cuePanXOutput");
  const cuePanYInput = $("#cuePanYInput");
  const cuePanYOutput = $("#cuePanYOutput");
  const cueScaleInput = $("#cueScaleInput");
  const cueScaleOutput = $("#cueScaleOutput");
  const cueScalePanInput = $("#cueScalePanInput");
  const cueScalePanOutput = $("#cueScalePanOutput");
  const cueRotationInput = $("#cueRotationInput");
  const cueRotationOutput = $("#cueRotationOutput");
  const cueRotationPanInput = $("#cueRotationPanInput");
  const cueRotationPanOutput = $("#cueRotationPanOutput");
  const cueCpsInput = $("#cueCpsInput");
  const cueCpsOutput = $("#cueCpsOutput");
  const cueScaleRevealMinInput = $("#cueScaleRevealMinInput");
  const cueScaleRevealMinOutput = $("#cueScaleRevealMinOutput");
  const cueScaleRevealSpeedInput = $("#cueScaleRevealSpeedInput");
  const cueScaleRevealSpeedOutput = $("#cueScaleRevealSpeedOutput");
  const cueJumpSizeInput = $("#cueJumpSizeInput");
  const cueJumpSizeOutput = $("#cueJumpSizeOutput");
  const cueJumpSpeedInput = $("#cueJumpSpeedInput");
  const cueJumpSpeedOutput = $("#cueJumpSpeedOutput");
  const cueFadeInInput = $("#cueFadeInInput");
  const cueFadeOutInput = $("#cueFadeOutInput");
  const cueStrokeEnabledInput = $("#cueStrokeEnabledInput");
  const cueShadowEnabledInput = $("#cueShadowEnabledInput");
  const cueFadeInDurationInput = $("#cueFadeInDurationInput");
  const cueFadeOutDurationInput = $("#cueFadeOutDurationInput");
  const cueStrokeColorInput = $("#cueStrokeColorInput");
  const cueStrokeWidthInput = $("#cueStrokeWidthInput");
  const cueStrokeWidthOutput = $("#cueStrokeWidthOutput");
  const cueShadowColorInput = $("#cueShadowColorInput");
  const cueShadowBlurInput = $("#cueShadowBlurInput");
  const cueShadowBlurOutput = $("#cueShadowBlurOutput");
  const cueShadowOffsetXInput = $("#cueShadowOffsetXInput");
  const cueShadowOffsetYInput = $("#cueShadowOffsetYInput");
  const duplicateCueBtn = $("#duplicateCueBtn");
  const deleteCueBtn = $("#deleteCueBtn");

  const exportFpsInput = $("#exportFpsInput");
  const exportPrefixInput = $("#exportPrefixInput");
  const exportStartInput = $("#exportStartInput");
  const exportEndInput = $("#exportEndInput");
  const setExportEndFromAudioBtn = $("#setExportEndFromAudioBtn");
  const exportSrtBtn = $("#exportSrtBtn");
  const exportZipBtn = $("#exportZipBtn");
  const exportProgress = $("#exportProgress");

  const saveJsonBtn = $("#saveJsonBtn");
  const loadJsonInput = $("#loadJsonInput");
  const saveCacheBtn = $("#saveCacheBtn");
  const loadCacheBtn = $("#loadCacheBtn");

  const defaultStyle = () => ({
    x: 960,
    y: 540,
    maxWidth: 1580,
    align: "center",
    fontFamily: FONT_OPTIONS[1].value,
    fontSize: 86,
    lineHeight: 1.25,
    color: "#ffffff",
    letterSpacing: 0,
    letterSpacingPan: 0,
    panX: 0,
    panY: 0,
    scale: 100,
    scalePan: 0,
    rotation: 0,
    rotationPan: 0,
    animation: "typewriter",
    cps: 24,
    scaleRevealMin: 18,
    scaleRevealSpeed: 24,
    jumpSize: 17,
    jumpSpeed: 1,
    fadeIn: true,
    fadeOut: true,
    fadeInDuration: 0.3,
    fadeOutDuration: 0.35,
    stroke: {
      enabled: true,
      color: "#111827",
      width: 8
    },
    shadow: {
      enabled: true,
      color: "#000000",
      blur: 14,
      offsetX: 0,
      offsetY: 8
    }
  });

  const initialState = () => ({
    audioDataUrl: null,
    audioFileName: "",
    audioMimeType: "",
    uiLanguage: DEFAULT_UI_LANGUAGE,
    previewBackgroundColor: "#f6fbff",
    previewBackgroundFit: "cover",
    previewBackgroundScale: 100,
    previewBackgroundOffsetX: 0,
    previewBackgroundOffsetY: 0,
    previewBackgroundImageDataUrl: null,
    previewBackgroundImage: null,
    lyrics: [],
    cues: [],
    selectedCueId: null,
    lastCreatedCueId: null,
    presets: readStoredPresets(),
    defaults: {
      fontFamily: FONT_OPTIONS[1].value,
      fontSize: 86,
      duration: 3,
      animation: "typewriter",
      align: "center",
      autoChain: true
    }
  });

  let state = initialState();
  let renderLoopRunning = false;
  let suppressEditorEvents = false;


  const I18N = {
    ja: {
      appTitle: "Video Subtitle Animation Maker",
      appSubtitle: "音声に合わせて字幕を打ち込み、透過PNG連番を書き出す動画字幕作成支援ツール",
      language: "Language / 言語",
      manual: "取扱説明", manualTitle: "取扱説明", close: "閉じる", chooseFile: "ファイルを選択", noFileSelected: "選択されていません", selectedFile: "選択中: {name}",
      saveJson: "JSON保存", loadJson: "JSON読込", saveCache: "キャッシュ保存", loadCache: "キャッシュ復元",
      secAssets: "素材読み込み", secDefaults: "基本設定", secSubtitlesList: "字幕ボタン一覧", secEntered: "入力済み字幕", secSelected: "選択中字幕設定", secExport: "書き出し",
      audioFile: "音声ファイル", audioNotLoaded: "音声未読込", audioLoaded: "音声読込済み", loadedFile: "読込済み: {name}", clear: "解除",
      lyricsTxt: "字幕TXT", lyricsHint: "TXTの1行を1つの字幕ボタンにします。空行は自動除外します。",
      previewBgColor: "プレビュー背景色", bgFit: "背景画像の表示", fitCover: "画面いっぱい", fitContain: "全体表示", fitStretch: "引き伸ばし", previewBgImage: "プレビュー背景画像", bgScale: "背景画像サイズ", bgOffsetX: "背景画像移動X", bgOffsetY: "背景画像移動Y", clearBgImage: "背景画像を解除", bgHint: "背景色・背景画像はプレビュー確認用です。透過PNG書き出しには含まれません。",
      defaultFont: "基本フォント", defaultSize: "基本サイズ", defaultDuration: "初期表示秒数", autoChain: "前字幕終了を自動調整", yes: "する", no: "しない", defaultAnimation: "初期アニメーション", defaultAlign: "初期文字揃え", applyDefaults: "選択中の字幕へ基本設定を反映",
      animNormal: "通常表示", animTypewriter: "タイプライター表示", animScaleReveal: "拡大しながら表示", animJumpTypewriter: "ジャンプしながらタイプライター表示", animJumpReveal: "ジャンプしながら表示", animJumpInOut: "登場時と退場時だけジャンプ",
      alignLeft: "左寄せ", alignCenter: "中央寄せ", alignRight: "右寄せ",
      lyricsNotLoaded: "字幕未読込", clearList: "一覧クリア", lyricsButtonEmpty: "字幕TXTを読み込むと、ここに1行ずつボタンが追加されます。", enteredEmpty: "入力済み字幕はまだありません。音声再生中に字幕ボタンを押してください。",
      inputAtCurrent: "クリックで現在時刻に入力", enteredAt: "入力済み {time} / 再クリックでキャンセル", linesCount: "{count}行",
      previewCanvas: "Preview Canvas", previewCanvasSub: "1920 × 1080 / export transparent", noActiveSubtitles: "表示中の字幕なし", previewAtCurrentTime: "現在時刻でプレビュー", previewSeconds: "プレビュー秒", update: "更新", transportHint: "音声再生中に左の字幕ボタンを押すと、その時刻に字幕キューを作成します。",
      selectedEmpty: "入力済み字幕を選択してください。", presetTitle: "字幕設定プリセット", presetName: "プリセット名", presetPlaceholder: "例：中央ジャンプ", registeredPresets: "登録済みプリセット", selectPreset: "プリセットを選択", noPreset: "プリセット未登録", saveCurrentAsPreset: "現在設定を登録", applySelectedPreset: "選択プリセットを適用", delete: "削除", presetHint: "字幕本文・開始秒・終了秒は含めず、見た目とアニメーション設定だけを保存します。",
      lyricText: "字幕テキスト", startSec: "開始秒", endSec: "終了秒", animation: "アニメーション", textAlign: "文字揃え", positionX: "位置X", positionY: "位置Y", wrapWidth: "折り返し幅", font: "フォント", fontSize: "フォントサイズ", textColor: "文字色", lineHeight: "行間", letterSpacing: "字間", letterSpacingPan: "字間移動", textPanX: "文字PAN移動X", textPanY: "文字PAN移動Y", textScale: "文字サイズ倍率", scalePan: "サイズ移動", textRotation: "文字回転", rotationPan: "回転移動", typewriterSpeed: "タイプライター速度", scaleRevealMin: "拡大表示の最小サイズ", scaleRevealSpeed: "拡大表示の速度", jumpSize: "ジャンプの大きさ", jumpSpeed: "ジャンプの速さ", fadeIn: "フェードイン", fadeOut: "フェードアウト", stroke: "縁取り", dropShadow: "ドロップシャドウ", fadeInSec: "フェードイン秒", fadeOutSec: "フェードアウト秒", strokeColor: "フチ色", strokeWidth: "フチ太さ", shadowColor: "影色", shadowBlur: "影ぼかし", shadowX: "影X", shadowY: "影Y", duplicate: "複製",
      export: "書き出し", fps: "FPS", prefix: "接頭辞", setEndFromAudio: "音声の長さを終了秒へ", exportZip: "透過PNG連番ZIPを書き出し", exportSrt: "SRT字幕を書き出し",
      preparing: "書き出し準備中... {done} / {total}", pngGenerating: "PNG生成中... {done} / {total}", zipGenerating: "ZIP生成中... {percent}%", exportComplete: "完了: {count}枚を書き出しました。", exportFailed: "書き出しに失敗しました。", srtComplete: "完了: SRT字幕を{count}件を書き出しました。", srtEmpty: "書き出せる入力済み字幕がありません。",
      failedReadJson: "JSONを読み込めませんでした。", cacheSaved: "キャッシュへ保存しました。", cacheSaveFailed: "キャッシュ保存に失敗しました。ブラウザの保存容量を確認してください。", cacheLoadFailed: "キャッシュ復元に失敗しました。", cacheMissing: "保存済みキャッシュがありません。", jszipMissing: "JSZipを読み込めませんでした。インターネット接続、またはCDNの読み込みを確認してください。", pngFailed: "PNG生成に失敗しました。", exportFailedRetry: "書き出しに失敗しました。枚数を減らして再試行してください。",
      presetAutoName: "プリセット{count}", loadedSubtitles: "表示中の字幕なし"
    },
    en: {
      appTitle: "Video Subtitle Animation Maker",
      appSubtitle: "A browser tool for placing subtitles by button-click timing and exporting transparent PNG sequences.",
      language: "Language / 言語",
      manual: "Manual", manualTitle: "Manual", close: "Close", chooseFile: "Choose File", noFileSelected: "No file selected", selectedFile: "Selected: {name}",
      saveJson: "Save JSON", loadJson: "Load JSON", saveCache: "Save Cache", loadCache: "Restore Cache",
      secAssets: "Assets", secDefaults: "Defaults", secSubtitlesList: "Subtitle Buttons", secEntered: "Placed Subtitles", secSelected: "Selected Subtitle Settings", secExport: "Export",
      audioFile: "Audio File", audioNotLoaded: "No audio loaded", audioLoaded: "Audio loaded", loadedFile: "Loaded: {name}", clear: "Clear",
      lyricsTxt: "Subtitle TXT", lyricsHint: "Each line in the TXT file becomes one subtitle button. Blank lines are ignored.",
      previewBgColor: "Preview Background Color", bgFit: "Background Image Fit", fitCover: "Fill Screen", fitContain: "Contain", fitStretch: "Stretch", previewBgImage: "Preview Background Image", bgScale: "Background Image Scale", bgOffsetX: "Background Image Offset X", bgOffsetY: "Background Image Offset Y", clearBgImage: "Clear Background Image", bgHint: "Background color and image are for preview only and are not included in transparent PNG export.",
      defaultFont: "Default Font", defaultSize: "Default Size", defaultDuration: "Default Duration", autoChain: "Auto-adjust previous phrase end", yes: "On", no: "Off", defaultAnimation: "Default Animation", defaultAlign: "Default Alignment", applyDefaults: "Apply defaults to selected phrase",
      animNormal: "Normal", animTypewriter: "Typewriter", animScaleReveal: "Scale Reveal", animJumpTypewriter: "Jump + Typewriter", animJumpReveal: "Jump Reveal", animJumpInOut: "Jump on In/Out",
      alignLeft: "Left", alignCenter: "Center", alignRight: "Right",
      lyricsNotLoaded: "No subtitles loaded", clearList: "Clear List", lyricsButtonEmpty: "Load a subtitle TXT file to create one button per line here.", enteredEmpty: "No subtitles placed yet. Press a subtitle button while audio is playing.",
      inputAtCurrent: "Click to place at current time", enteredAt: "Placed {time} / click again to cancel", linesCount: "{count} lines",
      previewCanvas: "Preview Canvas", previewCanvasSub: "1920 × 1080 / transparent export", noActiveSubtitles: "No active subtitle", previewAtCurrentTime: "Preview at Current Time", previewSeconds: "Preview Time", update: "Update", transportHint: "While audio is playing, press a subtitle button on the left to create a subtitle cue at that time.",
      selectedEmpty: "Select a placed subtitle.", presetTitle: "Subtitle Setting Presets", presetName: "Preset Name", presetPlaceholder: "e.g. Chorus Center Jump", registeredPresets: "Saved Presets", selectPreset: "Select a preset", noPreset: "No presets", saveCurrentAsPreset: "Save Current Settings", applySelectedPreset: "Apply Selected Preset", delete: "Delete", presetHint: "Only appearance and animation settings are saved. Subtitle text and timing are not included.",
      lyricText: "Subtitle Text", startSec: "Start (sec)", endSec: "End (sec)", animation: "Animation", textAlign: "Alignment", positionX: "Position X", positionY: "Position Y", wrapWidth: "Wrap Width", font: "Font", fontSize: "Font Size", textColor: "Text Color", lineHeight: "Line Height", letterSpacing: "Letter Spacing", letterSpacingPan: "Letter Spacing Pan", textPanX: "Text Pan X", textPanY: "Text Pan Y", textScale: "Text Scale", scalePan: "Scale Pan", textRotation: "Text Rotation", rotationPan: "Rotation Pan", typewriterSpeed: "Typewriter Speed", scaleRevealMin: "Scale Reveal Min Size", scaleRevealSpeed: "Scale Reveal Speed", jumpSize: "Jump Height", jumpSpeed: "Jump Speed", fadeIn: "Fade In", fadeOut: "Fade Out", stroke: "Stroke", dropShadow: "Drop Shadow", fadeInSec: "Fade In (sec)", fadeOutSec: "Fade Out (sec)", strokeColor: "Stroke Color", strokeWidth: "Stroke Width", shadowColor: "Shadow Color", shadowBlur: "Shadow Blur", shadowX: "Shadow X", shadowY: "Shadow Y", duplicate: "Duplicate",
      export: "Export", fps: "FPS", prefix: "Prefix", setEndFromAudio: "Use Audio Length as End Time", exportZip: "Export Transparent PNG ZIP", exportSrt: "Export SRT Subtitles",
      preparing: "Preparing export... {done} / {total}", pngGenerating: "Generating PNG... {done} / {total}", zipGenerating: "Creating ZIP... {percent}%", exportComplete: "Done: exported {count} frames.", exportFailed: "Export failed.", srtComplete: "Done: exported {count} SRT subtitles.", srtEmpty: "There are no placed subtitles to export.",
      failedReadJson: "Could not load the JSON file.", cacheSaved: "Saved to cache.", cacheSaveFailed: "Could not save cache. Please check browser storage limits.", cacheLoadFailed: "Could not restore cache.", cacheMissing: "No saved cache was found.", jszipMissing: "JSZip could not be loaded. Please check your internet connection or the CDN.", pngFailed: "Failed to generate PNG.", exportFailedRetry: "Export failed. Try reducing the number of frames and run again.",
      presetAutoName: "Preset {count}", loadedSubtitles: "No active subtitle"
    }
  };

  function currentLang() {
    return state.uiLanguage === "en" ? "en" : "ja";
  }

  function t(key, vars = {}) {
    const table = I18N[currentLang()] || I18N.ja;
    let text = table[key] ?? I18N.ja[key] ?? key;
    Object.entries(vars).forEach(([name, value]) => {
      text = text.replaceAll(`{${name}}`, String(value));
    });
    return text;
  }

  function setText(selector, key, vars = {}) {
    const node = typeof selector === "string" ? document.querySelector(selector) : selector;
    if (node) node.textContent = t(key, vars);
  }

  function setTextNodeLabel(container, key) {
    if (!container) return;
    const textNode = Array.from(container.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    if (textNode) textNode.textContent = ` ${t(key)}`;
  }

  function setFieldLabel(input, key) {
    const span = input?.closest(".field")?.querySelector("span");
    if (span) span.textContent = t(key);
  }

  function setRangeLabel(input, key) {
    const span = input?.closest(".range-field")?.querySelector(".range-head span");
    if (span) span.textContent = t(key);
  }

  function setSelectOptions(select, items) {
    if (!select) return;
    Array.from(select.options).forEach((option) => {
      if (items[option.value]) option.textContent = items[option.value];
    });
  }

  function updateStaticText() {
    document.documentElement.lang = currentLang();
    document.title = t("appTitle");
    if (uiLanguageSelect) uiLanguageSelect.value = currentLang();

    updateManualContent();
    setText(openManualBtn, "manual");
    setText(".app-header h1", "appTitle");
    setText(".app-header p", "appSubtitle");
    setText("#langLabel", "language");
    setText(saveJsonBtn, "saveJson");
    setTextNodeLabel(loadJsonInput?.parentNode, "loadJson");
    setText(saveCacheBtn, "saveCache");
    setText(loadCacheBtn, "loadCache");

    const leftSummaries = document.querySelectorAll(".left-panel details > summary");
    if (leftSummaries[0]) leftSummaries[0].textContent = t("secAssets");
    if (leftSummaries[1]) leftSummaries[1].textContent = t("secDefaults");
    if (leftSummaries[2]) leftSummaries[2].textContent = t("secSubtitlesList");
    if (leftSummaries[3]) leftSummaries[3].textContent = t("secEntered");
    const rightSummaries = document.querySelectorAll(".right-panel details > summary");
    if (rightSummaries[0]) rightSummaries[0].textContent = t("secSelected");
    if (rightSummaries[1]) rightSummaries[1].textContent = t("secExport");

    setFieldLabel(audioInput, "audioFile");
    setText(audioChooseLabel, "chooseFile");
    updateFileChoiceStatus(audioChosenLabel, state.audioFileName || audioChosenLabel?.dataset.filename || "");
    audioFileInfo.textContent = state.audioDataUrl ? (state.audioFileName ? t("loadedFile", { name: state.audioFileName }) : t("audioLoaded")) : t("audioNotLoaded");
    setText(clearAudioBtn, "clear");
    setFieldLabel(lyricsInput, "lyricsTxt");
    setText(lyricsChooseLabel, "chooseFile");
    updateFileChoiceStatus(lyricsChosenLabel, lyricsChosenLabel?.dataset.filename || "");
    setText(lyricsInput.closest('.field')?.nextElementSibling, "lyricsHint");
    setFieldLabel(previewBgColorInput, "previewBgColor");
    setFieldLabel(previewBgFitSelect, "bgFit");
    setSelectOptions(previewBgFitSelect, { cover: t("fitCover"), contain: t("fitContain"), stretch: t("fitStretch") });
    setFieldLabel(previewBgImageInput, "previewBgImage");
    setText(previewBgChooseLabel, "chooseFile");
    updateFileChoiceStatus(previewBgChosenLabel, previewBgChosenLabel?.dataset.filename || "");
    setRangeLabel(previewBgScaleInput, "bgScale");
    setRangeLabel(previewBgOffsetXInput, "bgOffsetX");
    setRangeLabel(previewBgOffsetYInput, "bgOffsetY");
    setText(clearPreviewBgImageBtn, "clearBgImage");
    setText(clearPreviewBgImageBtn.closest('.button-row')?.nextElementSibling, "bgHint");

    setFieldLabel(defaultFontFamilyInput, "defaultFont");
    setRangeLabel(defaultFontSizeInput, "defaultSize");
    setFieldLabel(defaultDurationInput, "defaultDuration");
    setFieldLabel(autoChainSelect, "autoChain");
    setSelectOptions(autoChainSelect, { "1": t("yes"), "0": t("no") });
    setFieldLabel(defaultAnimationInput, "defaultAnimation");
    setSelectOptions(defaultAnimationInput, { normal: t("animNormal"), typewriter: t("animTypewriter"), scaleReveal: t("animScaleReveal"), jumpTypewriter: t("animJumpTypewriter"), jumpReveal: t("animJumpReveal"), jumpInOut: t("animJumpInOut") });
    setFieldLabel(defaultAlignInput, "defaultAlign");
    setSelectOptions(defaultAlignInput, { left: t("alignLeft"), center: t("alignCenter"), right: t("alignRight") });
    setText(applyDefaultToSelectedBtn, "applyDefaults");

    setText(clearSubtitlesBtn, "clearList");
    setText(".preview-toolbar strong", "previewCanvas");
    setText(document.querySelector('.preview-toolbar strong')?.nextElementSibling, "previewCanvasSub");
    setText(setPreviewFromAudioBtn, "previewAtCurrentTime");
    setFieldLabel(previewTimeInput, "previewSeconds");
    setText(renderPreviewBtn, "update");
    setText(renderPreviewBtn.parentNode?.nextElementSibling, "transportHint");

    setText(selectedEmptyMessage, "selectedEmpty");
    setText(document.querySelector('.preset-title'), "presetTitle");
    setFieldLabel(presetNameInput, "presetName");
    presetNameInput.placeholder = t("presetPlaceholder");
    setFieldLabel(presetSelect, "registeredPresets");
    setText(savePresetBtn, "saveCurrentAsPreset");
    setText(applyPresetBtn, "applySelectedPreset");
    setText(deletePresetBtn, "delete");
    setText(deletePresetBtn.closest('.button-row')?.nextElementSibling, "presetHint");
    setFieldLabel(cueTextInput, "lyricText");
    setFieldLabel(cueStartInput, "startSec");
    setFieldLabel(cueEndInput, "endSec");
    setFieldLabel(cueAnimationInput, "animation");
    setSelectOptions(cueAnimationInput, { normal: t("animNormal"), typewriter: t("animTypewriter"), scaleReveal: t("animScaleReveal"), jumpTypewriter: t("animJumpTypewriter"), jumpReveal: t("animJumpReveal"), jumpInOut: t("animJumpInOut") });
    setFieldLabel(cueAlignInput, "textAlign");
    setSelectOptions(cueAlignInput, { left: t("alignLeft"), center: t("alignCenter"), right: t("alignRight") });
    setRangeLabel(cueXInput, "positionX"); setRangeLabel(cueYInput, "positionY"); setRangeLabel(cueMaxWidthInput, "wrapWidth");
    setFieldLabel(cueFontFamilyInput, "font"); setRangeLabel(cueFontSizeInput, "fontSize"); setFieldLabel(cueColorInput, "textColor"); setFieldLabel(cueLineHeightInput, "lineHeight");
    setRangeLabel(cueLetterSpacingInput, "letterSpacing"); setRangeLabel(cueLetterSpacingPanInput, "letterSpacingPan"); setRangeLabel(cuePanXInput, "textPanX"); setRangeLabel(cuePanYInput, "textPanY"); setRangeLabel(cueScaleInput, "textScale"); setRangeLabel(cueScalePanInput, "scalePan"); setRangeLabel(cueRotationInput, "textRotation"); setRangeLabel(cueRotationPanInput, "rotationPan"); setRangeLabel(cueCpsInput, "typewriterSpeed"); setRangeLabel(cueScaleRevealMinInput, "scaleRevealMin"); setRangeLabel(cueScaleRevealSpeedInput, "scaleRevealSpeed"); setRangeLabel(cueJumpSizeInput, "jumpSize"); setRangeLabel(cueJumpSpeedInput, "jumpSpeed");
    setTextNodeLabel(cueFadeInInput.closest('label'), "fadeIn"); setTextNodeLabel(cueFadeOutInput.closest('label'), "fadeOut"); setTextNodeLabel(cueStrokeEnabledInput.closest('label'), "stroke"); setTextNodeLabel(cueShadowEnabledInput.closest('label'), "dropShadow");
    setFieldLabel(cueFadeInDurationInput, "fadeInSec"); setFieldLabel(cueFadeOutDurationInput, "fadeOutSec"); setFieldLabel(cueStrokeColorInput, "strokeColor"); setRangeLabel(cueStrokeWidthInput, "strokeWidth"); setFieldLabel(cueShadowColorInput, "shadowColor"); setRangeLabel(cueShadowBlurInput, "shadowBlur"); setFieldLabel(cueShadowOffsetXInput, "shadowX"); setFieldLabel(cueShadowOffsetYInput, "shadowY");
    setText(duplicateCueBtn, "duplicate"); setText(deleteCueBtn, "delete");

    setFieldLabel(exportFpsInput, "fps"); setFieldLabel(exportPrefixInput, "prefix"); setFieldLabel(exportStartInput, "startSec"); setFieldLabel(exportEndInput, "endSec"); setText(setExportEndFromAudioBtn, "setEndFromAudio"); setText(exportSrtBtn, "exportSrt"); setText(exportZipBtn, "exportZip");
  }


  function manualHtmlJa() {
    return `
      <h3>このツールについて</h3>
      <p>音声に合わせて字幕を配置し、文字アニメーション付きの透過PNG連番を書き出すための動画字幕制作支援ツールです。背景色・背景画像は確認用で、書き出しには含まれません。</p>

      <h3>1. 素材を読み込む</h3>
      <ol>
        <li><strong>音声ファイル</strong>から楽曲や仮音源を読み込みます。</li>
        <li><strong>字幕TXT</strong>を読み込みます。TXTの1行が1つの字幕ボタンになります。</li>
        <li>プレビュー確認用に背景色や背景画像を設定できます。背景画像はサイズ、X位置、Y位置を調整できます。</li>
      </ol>

      <h3>2. 字幕をタイミング入力する</h3>
      <ol>
        <li>音声を再生します。</li>
        <li>任意のタイミングで左側の字幕ボタンをクリックすると、その時刻に字幕が配置されます。</li>
        <li>配置済みの字幕ボタンはグレー表示になります。もう一度クリックすると配置をキャンセルできます。</li>
        <li>入力済み字幕一覧から字幕を選択すると、右側で細かい設定を編集できます。</li>
      </ol>

      <h3>3. 基本設定</h3>
      <p>基本フォント、基本サイズ、初期表示秒数、初期アニメーション、文字揃えを設定できます。新しく配置する字幕には、基本設定または直前の字幕設定が反映されます。</p>

      <h3>4. 字幕ごとの編集</h3>
      <ul>
        <li>開始秒・終了秒、字幕テキストを編集できます。</li>
        <li>位置X/Y、折り返し幅、フォント、フォントサイズ、文字色、行間、字間を調整できます。</li>
        <li>文字PAN移動、サイズ移動、文字回転、回転移動、字間移動を使って、時間経過に合わせた動きを付けられます。</li>
        <li>フェードイン、フェードアウト、縁取り、ドロップシャドウを設定できます。</li>
      </ul>

      <h3>5. アニメーション種類</h3>
      <ul>
        <li><strong>通常表示</strong>：字幕全体をそのまま表示します。</li>
        <li><strong>タイプライター表示</strong>：文字が順番に表示されます。</li>
        <li><strong>拡大しながら表示</strong>：登場時に1文字ずつ小さいサイズから設定サイズへ拡大しながら表示します。最小サイズと出現速度をスライダーで調整できます。</li>
        <li><strong>ジャンプしながらタイプライター表示</strong>：文字が順番に表示され、1文字ずつ波打つようにジャンプします。</li>
        <li><strong>ジャンプしながら表示</strong>：表示済みの文字全体に、1文字ずつ波打つジャンプを付けます。</li>
        <li><strong>登場時と退場時だけジャンプ</strong>：字幕の出始めと消え際だけジャンプします。</li>
      </ul>

      <h3>6. プリセット</h3>
      <p>選択中字幕の見た目やアニメーション設定をプリセット登録できます。字幕本文、開始秒、終了秒はプリセットに含まれません。別字幕へ同じ演出を使い回したい時に便利です。</p>

      <h3>7. 保存と復元</h3>
      <ul>
        <li><strong>JSON保存</strong>：現在のプロジェクトをJSONとして保存します。</li>
        <li><strong>JSON読込</strong>：保存したJSONを読み込みます。</li>
        <li><strong>キャッシュ保存</strong>：ブラウザ内に作業状態を保存します。</li>
        <li><strong>キャッシュ復元</strong>：保存済みキャッシュから復元します。</li>
      </ul>

      <h3>8. 書き出し</h3>
      <ol>
        <li>FPS、接頭辞、開始秒、終了秒を設定します。</li>
        <li><strong>透過PNG連番ZIPを書き出し</strong>を押すと、字幕だけの透過PNG連番がZIPで保存されます。</li>
        <li><strong>SRT字幕を書き出し</strong>を押すと、入力済み字幕の開始秒・終了秒・字幕本文をもとに.srt字幕ファイルを保存できます。</li>
        <li>背景色・背景画像は書き出しには含まれません。動画編集ソフト側で背景や映像素材と合成してください。</li>
      </ol>

      <h3>注意</h3>
      <p class="manual-note">長時間・高FPSで書き出すとPNG枚数が多くなり、ブラウザのメモリ使用量が増えます。エラーが出る場合は、書き出し範囲を短くするか、FPSを下げてください。</p>
    `;
  }

  function manualHtmlEn() {
    return `
      <p class="manual-note">※英訳にはAI翻訳を使用しております。一部、おかしな表現があるかもしれませんがご了承ください。<br>AI translation was used for the English manual. Some expressions may sound unnatural.</p>

      <h3>About this tool</h3>
      <p>This is a browser-based video subtitle production support tool for placing subtitle phrases in sync with audio and exporting animated transparent PNG sequences. Preview background color and images are only for checking the layout and are not included in the export.</p>

      <h3>1. Load assets</h3>
      <ol>
        <li>Load a song or temporary audio file from <strong>Audio File</strong>.</li>
        <li>Load a <strong>Subtitle TXT</strong> file. Each line in the TXT file becomes one subtitle button.</li>
        <li>You can set a preview background color or image. The background image scale, X offset, and Y offset can be adjusted.</li>
      </ol>

      <h3>2. Place subtitles to timing</h3>
      <ol>
        <li>Play the audio.</li>
        <li>Click a subtitle button on the left at the timing where you want the subtitle to appear.</li>
        <li>Placed subtitle buttons turn gray. Click again to cancel that placement.</li>
        <li>Select a placed subtitle from the list to edit detailed settings on the right.</li>
      </ol>

      <h3>3. Default settings</h3>
      <p>You can set the default font, size, duration, animation, and alignment. New subtitles use the default settings or inherit the previous subtitle settings.</p>

      <h3>4. Edit each subtitle</h3>
      <ul>
        <li>Edit start time, end time, and subtitle text.</li>
        <li>Adjust position X/Y, wrap width, font, font size, text color, line height, and letter spacing.</li>
        <li>Add motion over time with text pan, scale pan, rotation, rotation pan, and letter spacing pan.</li>
        <li>Enable fade in, fade out, stroke, and drop shadow.</li>
      </ul>

      <h3>5. Animation types</h3>
      <ul>
        <li><strong>Normal</strong>: Shows the whole subtitle normally.</li>
        <li><strong>Typewriter</strong>: Reveals characters one by one.</li>
        <li><strong>Scale Reveal</strong>: Reveals characters one by one while scaling them up. You can adjust the starting size and reveal speed with sliders.</li>
        <li><strong>Jump + Typewriter</strong>: Reveals characters one by one while each character jumps in a wave.</li>
        <li><strong>Jump Reveal</strong>: Applies wave-like jumping to the displayed characters.</li>
        <li><strong>Jump on In/Out</strong>: Adds jumping only when the subtitle appears and disappears.</li>
      </ul>

      <h3>6. Presets</h3>
      <p>You can save the selected subtitle’s appearance and animation settings as a preset. Subtitle text, start time, and end time are not included. This is useful for reusing the same effect on other subtitles.</p>

      <h3>7. Save and restore</h3>
      <ul>
        <li><strong>Save JSON</strong>: Saves the current project as a JSON file.</li>
        <li><strong>Load JSON</strong>: Loads a saved JSON file.</li>
        <li><strong>Save Cache</strong>: Saves the work state inside the browser.</li>
        <li><strong>Restore Cache</strong>: Restores from the saved browser cache.</li>
      </ul>

      <h3>8. Export</h3>
      <ol>
        <li>Set FPS, prefix, start time, and end time.</li>
        <li>Press <strong>Export Transparent PNG ZIP</strong> to save the subtitle-only transparent PNG sequence as a ZIP file.</li>
        <li>Background color and preview background images are not included in the export. Please composite them with video or background materials in your video editing software.</li>
              <li>Press <strong>Export SRT Subtitles</strong> to save a .srt subtitle file based on the placed subtitles’ start time, end time, and subtitle text.</li>
      </ol>

      <h3>Note</h3>
      <p class="manual-note">Long exports and high FPS create many PNG files and may increase browser memory usage. If an error occurs, shorten the export range or lower the FPS.</p>
    `;
  }

  function updateManualContent() {
    if (!manualModalBody || !manualModalTitle) return;
    manualModalTitle.textContent = t("manualTitle");
    closeManualFooterBtn.textContent = t("close");
    manualModalBody.innerHTML = currentLang() === "en" ? manualHtmlEn() : manualHtmlJa();
  }

  function openManual() {
    updateManualContent();
    manualModal?.classList.remove("hidden");
  }

  function closeManual() {
    manualModal?.classList.add("hidden");
  }

  function updateFileChoiceStatus(target, fileName = "") {
    if (!target) return;
    if (fileName) {
      target.dataset.filename = fileName;
      target.textContent = t("selectedFile", { name: fileName });
    } else {
      target.dataset.filename = "";
      target.textContent = t("noFileSelected");
    }
  }

  function applyLanguage(lang) {
    state.uiLanguage = lang === "en" ? "en" : "ja";
    const defaultFont = defaultFontFamilyInput.value;
    const cueFont = cueFontFamilyInput.value;
    populateFontSelect(defaultFontFamilyInput);
    populateFontSelect(cueFontFamilyInput);
    defaultFontFamilyInput.value = defaultFont || state.defaults.fontFamily;
    cueFontFamilyInput.value = cueFont || (selectedCue()?.settings?.fontFamily || state.defaults.fontFamily);
    updateStaticText();
    renderAll();
  }

  function uniqueId(prefix) {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return `${prefix}_${window.crypto.randomUUID()}`;
    }
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.min(max, Math.max(min, n));
  }

  function easeOutCubic(value) {
    const t = clamp(value, 0, 1);
    return 1 - Math.pow(1 - t, 3);
  }

  function round(value, digits = 2) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    const f = 10 ** digits;
    return Math.round(n * f) / f;
  }

  function formatTime(value) {
    const n = Math.max(0, Number(value) || 0);
    const minutes = Math.floor(n / 60);
    const seconds = n - minutes * 60;
    return `${String(minutes).padStart(2, "0")}:${seconds.toFixed(2).padStart(5, "0")}`;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function safeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function normalizePreset(preset) {
    if (!preset || typeof preset !== "object") return null;
    const name = String(preset.name || "").trim();
    const settings = preset.settings && typeof preset.settings === "object" ? preset.settings : null;
    if (!name || !settings) return null;

    const base = defaultStyle();
    return {
      id: preset.id || uniqueId("preset"),
      name,
      createdAt: Number(preset.createdAt) || Date.now(),
      updatedAt: Number(preset.updatedAt) || Date.now(),
      settings: {
        ...base,
        ...clone(settings),
        stroke: { ...base.stroke, ...(settings.stroke || {}) },
        shadow: { ...base.shadow, ...(settings.shadow || {}) }
      }
    };
  }

  function mergePresets(...presetLists) {
    const map = new Map();
    presetLists.flatMap((list) => safeArray(list)).forEach((preset) => {
      const normalized = normalizePreset(preset);
      if (!normalized) return;
      const key = normalized.id || normalized.name;
      const current = map.get(key);
      if (!current || normalized.updatedAt >= current.updatedAt) {
        map.set(key, normalized);
      }
    });
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "ja"));
  }

  function readStoredPresets() {
    try {
      return mergePresets(JSON.parse(localStorage.getItem(PRESET_STORAGE_KEY) || "[]"));
    } catch (_) {
      return [];
    }
  }

  function saveStoredPresets() {
    try {
      localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(state.presets || []));
    } catch (_) {
      // ローカル保存できない環境でも、プロジェクト内のプリセットは維持する
    }
  }

  function applyStyleToCue(cue, style) {
    if (!cue || !style) return;
    const base = defaultStyle();
    cue.settings = {
      ...base,
      ...clone(style),
      stroke: { ...base.stroke, ...(style.stroke || {}) },
      shadow: { ...base.shadow, ...(style.shadow || {}) }
    };
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error || new Error("ファイルを読み込めませんでした"));
      reader.readAsDataURL(file);
    });
  }

  function fileToText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error || new Error("テキストを読み込めませんでした"));
      reader.readAsText(file, "utf-8");
    });
  }

  function loadImage(dataUrl) {
    return new Promise((resolve, reject) => {
      if (!dataUrl) {
        resolve(null);
        return;
      }
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("画像を読み込めませんでした"));
      image.src = dataUrl;
    });
  }

  function populateFontSelect(select) {
    const selected = select.value;
    select.innerHTML = "";
    FONT_OPTIONS.forEach((font) => {
      const option = document.createElement("option");
      option.value = font.value;
      option.textContent = currentLang() === "en" ? (font.labelEn || font.label) : font.label;
      select.append(option);
    });
    if (selected) select.value = selected;
  }

  function createCueStyle(templateCue = null) {
    const base = defaultStyle();
    base.fontFamily = state.defaults.fontFamily || base.fontFamily;
    base.fontSize = clamp(state.defaults.fontSize, 10, 300);
    base.animation = state.defaults.animation || base.animation;
    base.align = state.defaults.align || base.align;

    if (!templateCue?.settings) return base;

    const template = clone(templateCue.settings);
    const next = { ...base, ...template };
    next.stroke = { ...base.stroke, ...(template.stroke || {}) };
    next.shadow = { ...base.shadow, ...(template.shadow || {}) };
    return next;
  }

  function getCueTemplateSource() {
    const selected = selectedCue();
    if (selected?.settings) return selected;

    if (state.lastCreatedCueId) {
      const lastCreated = getCueById(state.lastCreatedCueId);
      if (lastCreated?.settings) return lastCreated;
    }

    return state.cues
      .slice()
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0) || b.start - a.start)[0] || null;
  }

  function selectedCue() {
    return state.cues.find((cue) => cue.id === state.selectedCueId) || null;
  }

  function getCueById(id) {
    return state.cues.find((cue) => cue.id === id) || null;
  }

  function getSubtitleByCueId(cueId) {
    return state.lyrics.find((lyric) => lyric.cueId === cueId) || null;
  }

  function sortCues() {
    state.cues.sort((a, b) => a.start - b.start || a.end - b.end);
  }

  function syncDefaultControls() {
    defaultFontFamilyInput.value = state.defaults.fontFamily;
    defaultFontSizeInput.value = String(state.defaults.fontSize);
    defaultFontSizeOutput.textContent = `${defaultFontSizeInput.value}px`;
    defaultDurationInput.value = String(state.defaults.duration);
    defaultAnimationInput.value = state.defaults.animation;
    defaultAlignInput.value = state.defaults.align;
    autoChainSelect.value = state.defaults.autoChain ? "1" : "0";
  }

  function syncPreviewBackgroundControls() {
    previewBgColorInput.value = state.previewBackgroundColor || "#f6fbff";
    previewBgFitSelect.value = state.previewBackgroundFit || "cover";
    previewBgScaleInput.value = String(clamp(state.previewBackgroundScale ?? 100, 1, 100));
    previewBgScaleOutput.textContent = `${previewBgScaleInput.value}%`;
    previewBgOffsetXInput.value = String(clamp(state.previewBackgroundOffsetX ?? 0, -1920, 1920));
    previewBgOffsetXOutput.textContent = `${previewBgOffsetXInput.value}px`;
    previewBgOffsetYInput.value = String(clamp(state.previewBackgroundOffsetY ?? 0, -1080, 1080));
    previewBgOffsetYOutput.textContent = `${previewBgOffsetYInput.value}px`;
  }

  function renderPresetControls() {
    if (!presetSelect) return;
    const currentValue = presetSelect.value;
    presetSelect.innerHTML = "";

    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = state.presets?.length ? t("selectPreset") : t("noPreset");
    presetSelect.append(emptyOption);

    (state.presets || []).forEach((preset) => {
      const option = document.createElement("option");
      option.value = preset.id;
      option.textContent = preset.name;
      presetSelect.append(option);
    });

    if (currentValue && (state.presets || []).some((preset) => preset.id === currentValue)) {
      presetSelect.value = currentValue;
    }

    const hasPreset = Boolean(presetSelect.value);
    applyPresetBtn.disabled = !hasPreset || !selectedCue();
    deletePresetBtn.disabled = !hasPreset;
  }

  function updateDefaultStateFromControls() {
    state.defaults.fontFamily = defaultFontFamilyInput.value;
    state.defaults.fontSize = Math.round(clamp(defaultFontSizeInput.value, 10, 300));
    state.defaults.duration = round(clamp(defaultDurationInput.value, 0.1, 60), 2);
    state.defaults.animation = defaultAnimationInput.value;
    state.defaults.align = defaultAlignInput.value;
    state.defaults.autoChain = autoChainSelect.value === "1";
    syncDefaultControls();
  }

  function parseSubtitlesText(text) {
    return text
      .replace(/^\uFEFF/, "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => ({
        id: uniqueId("lyric"),
        index,
        text: line,
        cueId: null
      }));
  }

  function assignSubtitleAtCurrentTime(lyric) {
    const currentTime = Number.isFinite(audioPlayer.currentTime) ? audioPlayer.currentTime : Number(previewTimeInput.value) || 0;
    const start = round(Math.max(0, currentTime), 2);
    const duration = round(clamp(state.defaults.duration, 0.1, 60), 2);
    const templateCue = getCueTemplateSource();
    const cue = {
      id: uniqueId("cue"),
      lyricId: lyric.id,
      text: lyric.text,
      start,
      end: round(start + duration, 2),
      createdAt: Date.now(),
      settings: createCueStyle(templateCue)
    };

    if (state.defaults.autoChain) {
      const previous = state.cues
        .filter((item) => item.start < start)
        .sort((a, b) => b.start - a.start)[0];
      if (previous && previous.end > start) {
        previous.end = round(Math.max(previous.start + 0.05, start), 2);
      }
    }

    lyric.cueId = cue.id;
    state.cues.push(cue);
    sortCues();
    state.selectedCueId = cue.id;
    state.lastCreatedCueId = cue.id;
    updatePreviewTime(start, true);
    renderAll();
  }

  function unassignSubtitle(lyric) {
    if (!lyric.cueId) return;
    const removingId = lyric.cueId;
    state.cues = state.cues.filter((cue) => cue.id !== removingId);
    lyric.cueId = null;
    if (state.selectedCueId === removingId) {
      state.selectedCueId = state.cues[0]?.id || null;
    }
    if (state.lastCreatedCueId === removingId) {
      state.lastCreatedCueId = state.cues
        .slice()
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0) || b.start - a.start)[0]?.id || null;
    }
    renderAll();
  }

  function renderSubtitleButtons() {
    lyricsButtonList.innerHTML = "";
    lyricsCountInfo.textContent = state.lyrics.length ? t("linesCount", { count: state.lyrics.length }) : t("lyricsNotLoaded");

    if (!state.lyrics.length) {
      const empty = document.createElement("div");
      empty.className = "empty-message";
      empty.textContent = t("lyricsButtonEmpty");
      lyricsButtonList.append(empty);
      return;
    }

    state.lyrics.forEach((lyric, index) => {
      const cue = lyric.cueId ? getCueById(lyric.cueId) : null;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "lyric-button";
      if (cue) button.classList.add("used");
      if (cue && cue.id === state.selectedCueId) button.classList.add("selected");
      button.innerHTML = `
        <span class="lyric-number">${String(index + 1).padStart(3, "0")}</span>
        <span class="lyric-text"></span>
        <span class="lyric-status">${cue ? t("enteredAt", { time: formatTime(cue.start) }) : t("inputAtCurrent")}</span>
      `;
      button.querySelector(".lyric-text").textContent = lyric.text;
      button.addEventListener("click", () => {
        if (lyric.cueId) {
          unassignSubtitle(lyric);
        } else {
          assignSubtitleAtCurrentTime(lyric);
        }
      });
      lyricsButtonList.append(button);
    });
  }

  function renderCueList() {
    cueList.innerHTML = "";
    if (!state.cues.length) {
      const empty = document.createElement("div");
      empty.className = "empty-message";
      empty.textContent = t("enteredEmpty");
      cueList.append(empty);
      return;
    }

    sortCues();
    state.cues.forEach((cue, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "cue-item";
      if (cue.id === state.selectedCueId) button.classList.add("selected");
      button.innerHTML = `
        <span class="cue-time">${String(index + 1).padStart(3, "0")} / ${formatTime(cue.start)} - ${formatTime(cue.end)}</span>
        <span class="cue-text"></span>
      `;
      button.querySelector(".cue-text").textContent = cue.text;
      button.addEventListener("click", () => {
        state.selectedCueId = cue.id;
        updatePreviewTime(cue.start, true);
        renderAll();
      });
      cueList.append(button);
    });
  }

  function syncCueEditor() {
    const cue = selectedCue();
    suppressEditorEvents = true;

    if (!cue) {
      selectedEmptyMessage.classList.remove("hidden");
      cueEditor.classList.add("hidden");
      renderPresetControls();
      suppressEditorEvents = false;
      return;
    }

    selectedEmptyMessage.classList.add("hidden");
    cueEditor.classList.remove("hidden");

    const s = cue.settings || createCueStyle();
    cue.settings = s;

    cueTextInput.value = cue.text || "";
    cueStartInput.value = String(round(cue.start, 2));
    cueEndInput.value = String(round(cue.end, 2));
    cueAnimationInput.value = s.animation || "normal";
    cueAlignInput.value = s.align || "center";
    cueXInput.value = String(clamp(s.x, 0, CANVAS_WIDTH));
    cueYInput.value = String(clamp(s.y, 0, CANVAS_HEIGHT));
    cueMaxWidthInput.value = String(clamp(s.maxWidth, 100, CANVAS_WIDTH));
    cueFontFamilyInput.value = s.fontFamily || FONT_OPTIONS[1].value;
    cueFontSizeInput.value = String(clamp(s.fontSize, 10, 300));
    cueColorInput.value = s.color || "#ffffff";
    cueLineHeightInput.value = String(clamp(s.lineHeight, 0.5, 3));
    cueLetterSpacingInput.value = String(clamp(s.letterSpacing ?? 0, -20, 120));
    cueLetterSpacingPanInput.value = String(clamp(s.letterSpacingPan ?? 0, -120, 120));
    cuePanXInput.value = String(clamp(s.panX ?? 0, -1920, 1920));
    cuePanYInput.value = String(clamp(s.panY ?? 0, -1080, 1080));
    cueScaleInput.value = String(clamp(s.scale ?? 100, 10, 400));
    cueScalePanInput.value = String(clamp(s.scalePan ?? 0, -300, 300));
    cueRotationInput.value = String(clamp(s.rotation ?? 0, -360, 360));
    cueRotationPanInput.value = String(clamp(s.rotationPan ?? 0, -720, 720));
    cueCpsInput.value = String(clamp(s.cps, 1, 120));
    cueScaleRevealMinInput.value = String(clamp(s.scaleRevealMin ?? 18, 1, 100));
    cueScaleRevealSpeedInput.value = String(clamp(s.scaleRevealSpeed ?? s.cps ?? 24, 1, 120));
    cueJumpSizeInput.value = String(clamp(s.jumpSize, 0, 160));
    cueJumpSpeedInput.value = String(clamp(s.jumpSpeed, 1, 20));
    cueFadeInInput.checked = Boolean(s.fadeIn);
    cueFadeOutInput.checked = Boolean(s.fadeOut);
    cueFadeInDurationInput.value = String(clamp(s.fadeInDuration, 0.01, 5));
    cueFadeOutDurationInput.value = String(clamp(s.fadeOutDuration, 0.01, 5));
    cueStrokeEnabledInput.checked = Boolean(s.stroke?.enabled);
    cueStrokeColorInput.value = s.stroke?.color || "#111827";
    cueStrokeWidthInput.value = String(clamp(s.stroke?.width ?? 0, 0, 80));
    cueShadowEnabledInput.checked = Boolean(s.shadow?.enabled);
    cueShadowColorInput.value = s.shadow?.color || "#000000";
    cueShadowBlurInput.value = String(clamp(s.shadow?.blur ?? 0, 0, 120));
    cueShadowOffsetXInput.value = String(clamp(s.shadow?.offsetX ?? 0, -120, 120));
    cueShadowOffsetYInput.value = String(clamp(s.shadow?.offsetY ?? 0, -120, 120));

    updateRangeOutputs();
    renderPresetControls();
    suppressEditorEvents = false;
  }

  function updateRangeOutputs() {
    cueXOutput.textContent = `${cueXInput.value}px`;
    cueYOutput.textContent = `${cueYInput.value}px`;
    cueMaxWidthOutput.textContent = `${cueMaxWidthInput.value}px`;
    cueFontSizeOutput.textContent = `${cueFontSizeInput.value}px`;
    cueLetterSpacingOutput.textContent = `${cueLetterSpacingInput.value}px`;
    cueLetterSpacingPanOutput.textContent = `${cueLetterSpacingPanInput.value}px`;
    cuePanXOutput.textContent = `${cuePanXInput.value}px`;
    cuePanYOutput.textContent = `${cuePanYInput.value}px`;
    cueScaleOutput.textContent = `${cueScaleInput.value}%`;
    cueScalePanOutput.textContent = `${cueScalePanInput.value}%`;
    cueRotationOutput.textContent = `${cueRotationInput.value}°`;
    cueRotationPanOutput.textContent = `${cueRotationPanInput.value}°`;
    cueCpsOutput.textContent = `${cueCpsInput.value} cps`;
    cueScaleRevealMinOutput.textContent = `${cueScaleRevealMinInput.value}%`;
    cueScaleRevealSpeedOutput.textContent = `${cueScaleRevealSpeedInput.value} cps`;
    cueJumpSizeOutput.textContent = `${cueJumpSizeInput.value}px`;
    cueJumpSpeedOutput.textContent = `${cueJumpSpeedInput.value}`;
    cueShadowBlurOutput.textContent = `${cueShadowBlurInput.value}px`;
    cueStrokeWidthOutput.textContent = `${cueStrokeWidthInput.value}px`;
  }

  function updateCueFromEditor() {
    if (suppressEditorEvents) return;
    const cue = selectedCue();
    if (!cue) return;

    cue.text = cueTextInput.value;
    cue.start = round(clamp(cueStartInput.value, 0, 99999), 2);
    cue.end = round(clamp(cueEndInput.value, cue.start + 0.05, 99999), 2);

    const s = cue.settings || createCueStyle();
    s.animation = cueAnimationInput.value;
    s.align = cueAlignInput.value;
    s.x = Math.round(clamp(cueXInput.value, 0, CANVAS_WIDTH));
    s.y = Math.round(clamp(cueYInput.value, 0, CANVAS_HEIGHT));
    s.maxWidth = Math.round(clamp(cueMaxWidthInput.value, 100, CANVAS_WIDTH));
    s.fontFamily = cueFontFamilyInput.value;
    s.fontSize = Math.round(clamp(cueFontSizeInput.value, 10, 300));
    s.color = cueColorInput.value;
    s.lineHeight = round(clamp(cueLineHeightInput.value, 0.5, 3), 2);
    s.letterSpacing = Math.round(clamp(cueLetterSpacingInput.value, -20, 120));
    s.letterSpacingPan = Math.round(clamp(cueLetterSpacingPanInput.value, -120, 120));
    s.panX = Math.round(clamp(cuePanXInput.value, -1920, 1920));
    s.panY = Math.round(clamp(cuePanYInput.value, -1080, 1080));
    s.scale = Math.round(clamp(cueScaleInput.value, 10, 400));
    s.scalePan = Math.round(clamp(cueScalePanInput.value, -300, 300));
    s.rotation = Math.round(clamp(cueRotationInput.value, -360, 360));
    s.rotationPan = Math.round(clamp(cueRotationPanInput.value, -720, 720));
    s.cps = Math.round(clamp(cueCpsInput.value, 1, 120));
    s.scaleRevealMin = Math.round(clamp(cueScaleRevealMinInput.value, 1, 100));
    s.scaleRevealSpeed = Math.round(clamp(cueScaleRevealSpeedInput.value, 1, 120));
    s.jumpSize = Math.round(clamp(cueJumpSizeInput.value, 0, 160));
    s.jumpSpeed = round(clamp(cueJumpSpeedInput.value, 1, 20), 1);
    s.fadeIn = cueFadeInInput.checked;
    s.fadeOut = cueFadeOutInput.checked;
    s.fadeInDuration = round(clamp(cueFadeInDurationInput.value, 0.01, 5), 2);
    s.fadeOutDuration = round(clamp(cueFadeOutDurationInput.value, 0.01, 5), 2);
    s.stroke = {
      enabled: cueStrokeEnabledInput.checked,
      color: cueStrokeColorInput.value,
      width: Math.round(clamp(cueStrokeWidthInput.value, 0, 80))
    };
    s.shadow = {
      enabled: cueShadowEnabledInput.checked,
      color: cueShadowColorInput.value,
      blur: Math.round(clamp(cueShadowBlurInput.value, 0, 120)),
      offsetX: Math.round(clamp(cueShadowOffsetXInput.value, -120, 120)),
      offsetY: Math.round(clamp(cueShadowOffsetYInput.value, -120, 120))
    };
    cue.settings = s;

    const linkedSubtitle = state.lyrics.find((lyric) => lyric.id === cue.lyricId);
    if (linkedSubtitle) linkedSubtitle.text = cue.text;

    sortCues();
    updateRangeOutputs();
    renderSubtitleButtons();
    renderCueList();
    renderCurrentPreview();
  }

  function getNextPresetName() {
    const count = (state.presets || []).length + 1;
    return t("presetAutoName", { count: String(count).padStart(2, "0") });
  }

  function saveSelectedCueAsPreset() {
    const cue = selectedCue();
    if (!cue) return;

    const selectedPreset = (state.presets || []).find((preset) => preset.id === presetSelect.value) || null;
    const name = (presetNameInput.value || selectedPreset?.name || getNextPresetName()).trim();
    if (!name) return;

    const now = Date.now();
    const settings = clone(cue.settings || createCueStyle());
    const existing = selectedPreset || (state.presets || []).find((preset) => preset.name === name) || null;

    if (existing) {
      existing.name = name;
      existing.settings = settings;
      existing.updatedAt = now;
      if (!existing.createdAt) existing.createdAt = now;
      presetSelect.value = existing.id;
    } else {
      const preset = {
        id: uniqueId("preset"),
        name,
        settings,
        createdAt: now,
        updatedAt: now
      };
      state.presets.push(preset);
      presetSelect.value = preset.id;
    }

    state.presets = mergePresets(state.presets);
    const saved = state.presets.find((preset) => preset.name === name);
    if (saved) presetSelect.value = saved.id;
    saveStoredPresets();
    renderPresetControls();
    presetNameInput.value = name;
  }

  function applySelectedPresetToCue() {
    const cue = selectedCue();
    const preset = (state.presets || []).find((item) => item.id === presetSelect.value);
    if (!cue || !preset) return;

    applyStyleToCue(cue, preset.settings);
    presetNameInput.value = preset.name;
    syncCueEditor();
    renderCueList();
    renderCurrentPreview();
  }

  function deleteSelectedPreset() {
    const presetId = presetSelect.value;
    if (!presetId) return;
    state.presets = (state.presets || []).filter((preset) => preset.id !== presetId);
    presetSelect.value = "";
    saveStoredPresets();
    renderPresetControls();
  }

  function applyDefaultsToSelected() {
    const cue = selectedCue();
    if (!cue) return;
    const old = cue.settings || createCueStyle();
    const next = createCueStyle();
    next.x = old.x;
    next.y = old.y;
    next.maxWidth = old.maxWidth;
    next.color = old.color;
    next.stroke = clone(old.stroke || next.stroke);
    next.shadow = clone(old.shadow || next.shadow);
    cue.settings = next;
    syncCueEditor();
    renderCurrentPreview();
  }

  function duplicateSelectedCue() {
    const cue = selectedCue();
    if (!cue) return;
    const duplicated = clone(cue);
    duplicated.id = uniqueId("cue");
    duplicated.lyricId = null;
    duplicated.start = round(cue.start + 0.1, 2);
    duplicated.end = round(cue.end + 0.1, 2);
    state.cues.push(duplicated);
    sortCues();
    state.selectedCueId = duplicated.id;
    renderAll();
  }

  function deleteCue(cueId) {
    const id = cueId || state.selectedCueId;
    if (!id) return;
    state.cues = state.cues.filter((cue) => cue.id !== id);
    state.lyrics.forEach((lyric) => {
      if (lyric.cueId === id) lyric.cueId = null;
    });
    if (state.selectedCueId === id) {
      state.selectedCueId = state.cues[0]?.id || null;
    }
    if (state.lastCreatedCueId === id) {
      state.lastCreatedCueId = state.cues
        .slice()
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0) || b.start - a.start)[0]?.id || null;
    }
    renderAll();
  }

  function drawImageFit(context, image, fit, width, height, scalePercent = 100, offsetX = 0, offsetY = 0) {
    if (!image) return;

    // 背景画像サイズは「100% = 画像の原寸」として扱う。
    // プレビュー用背景は書き出しに含めないため、見た目確認を優先して自然サイズ基準で描画する。
    const scale = clamp(Number(scalePercent) || 100, 1, 100) / 100;
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;

    context.drawImage(
      image,
      (width - drawWidth) / 2 + (Number(offsetX) || 0),
      (height - drawHeight) / 2 + (Number(offsetY) || 0),
      drawWidth,
      drawHeight
    );
  }

  function splitChars(text) {
    return Array.from(String(text || ""));
  }

  function visibleTextByCount(text, count) {
    const chars = splitChars(text);
    return chars.slice(0, Math.max(0, count)).join("");
  }

  function measureTextWidth(context, text, letterSpacing = 0) {
    const chars = splitChars(text);
    if (!chars.length) return 0;
    return chars.reduce((sum, char) => sum + context.measureText(char).width, 0) + Math.max(0, chars.length - 1) * letterSpacing;
  }

  function wrapTextLines(context, text, maxWidth, letterSpacing = 0) {
    const sourceLines = String(text || "").split(/\n/);
    const lines = [];

    sourceLines.forEach((sourceLine) => {
      const chars = splitChars(sourceLine);
      let line = "";

      chars.forEach((char) => {
        const testLine = line + char;
        if (line && measureTextWidth(context, testLine, letterSpacing) > maxWidth) {
          lines.push(line);
          line = char;
        } else {
          line = testLine;
        }
      });

      lines.push(line);
    });

    return lines.length ? lines : [""];
  }

  function getCueAlpha(cue, time) {
    const s = cue.settings;
    let alpha = 1;
    if (s.fadeIn) {
      alpha *= clamp((time - cue.start) / Math.max(0.01, s.fadeInDuration || 0.3), 0, 1);
    }
    if (s.fadeOut) {
      alpha *= clamp((cue.end - time) / Math.max(0.01, s.fadeOutDuration || 0.35), 0, 1);
    }
    return alpha;
  }

  function drawStyledText(context, text, x, y, settings, letterSpacing = 0) {
    if (!text) return;

    context.save();
    context.textAlign = "left";
    if (settings.shadow?.enabled) {
      context.shadowColor = settings.shadow.color || "#000000";
      context.shadowBlur = settings.shadow.blur || 0;
      context.shadowOffsetX = settings.shadow.offsetX || 0;
      context.shadowOffsetY = settings.shadow.offsetY || 0;
    } else {
      context.shadowColor = "transparent";
      context.shadowBlur = 0;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
    }

    context.lineJoin = "round";
    context.miterLimit = 2;
    context.strokeStyle = settings.stroke?.color || "#111827";
    context.lineWidth = Number(settings.stroke?.width) || 0;
    context.fillStyle = settings.color || "#ffffff";

    const drawOne = (value, drawX) => {
      if (settings.stroke?.enabled && Number(settings.stroke.width) > 0) {
        context.strokeText(value, drawX, y);
      }
      context.fillText(value, drawX, y);
    };

    if (Number(letterSpacing) === 0) {
      drawOne(text, x);
    } else {
      let cursorX = x;
      splitChars(text).forEach((char) => {
        drawOne(char, cursorX);
        cursorX += context.measureText(char).width + Number(letterSpacing || 0);
      });
    }

    context.restore();
  }

  function drawCue(context, cue, time) {
    if (time < cue.start || time > cue.end) return;
    const settings = { ...defaultStyle(), ...(cue.settings || {}), stroke: { ...defaultStyle().stroke, ...(cue.settings?.stroke || {}) }, shadow: { ...defaultStyle().shadow, ...(cue.settings?.shadow || {}) } };
    const alpha = getCueAlpha(cue, time);
    if (alpha <= 0) return;

    const elapsed = Math.max(0, time - cue.start);
    const progress = clamp((time - cue.start) / Math.max(0.01, cue.end - cue.start), 0, 1);
    const allText = String(cue.text || "");
    let text = allText;
    if (settings.animation === "typewriter" || settings.animation === "jumpTypewriter") {
      const visibleCount = Math.floor(elapsed * Math.max(1, settings.cps || 24));
      text = visibleTextByCount(allText, visibleCount);
    }

    const x = (settings.x ?? 960) + (settings.panX || 0) * progress;
    const y = (settings.y ?? 540) + (settings.panY || 0) * progress;
    const scale = clamp((settings.scale ?? 100) + (settings.scalePan || 0) * progress, 1, 400) / 100;
    const rotation = ((settings.rotation || 0) + (settings.rotationPan || 0) * progress) * Math.PI / 180;
    const letterSpacing = clamp((settings.letterSpacing || 0) + (settings.letterSpacingPan || 0) * progress, -100, 240);

    context.save();
    context.globalAlpha *= alpha;
    context.translate(x, y);
    context.rotate(rotation);
    context.scale(scale, scale);
    context.font = `700 ${Math.max(1, settings.fontSize || 86)}px ${settings.fontFamily || FONT_OPTIONS[1].value}`;
    context.textBaseline = "alphabetic";

    const maxWidth = Math.max(100, settings.maxWidth || 1580);
    const lines = wrapTextLines(context, text, maxWidth, letterSpacing);
    const lineHeight = Math.max(1, (settings.fontSize || 86) * (settings.lineHeight || 1.25));
    const totalHeight = lineHeight * Math.max(1, lines.length);
    const startY = -totalHeight / 2 + lineHeight * 0.85;

    const totalVisibleChars = lines.reduce((sum, line) => sum + splitChars(line).length, 0);
    const jumpInOutPowerForChar = (charIndex) => {
      const duration = Math.max(0.01, cue.end - cue.start);
      const speedFactor = clamp(settings.jumpSpeed || 8, 1, 20) / 8;
      const charJumpDuration = clamp(0.34 / speedFactor, 0.12, 0.7);
      const charDelay = clamp(0.045 / speedFactor, 0.012, 0.08);
      const edgeDuration = Math.min(duration / 2, charJumpDuration + charDelay * Math.max(0, totalVisibleChars - 1));

      const introLocal = (elapsed - charIndex * charDelay) / charJumpDuration;
      const introPower = introLocal >= 0 && introLocal <= 1 ? Math.sin(Math.PI * introLocal) : 0;

      const outroElapsed = time - (cue.end - edgeDuration);
      const outroLocal = (outroElapsed - charIndex * charDelay) / charJumpDuration;
      const outroPower = outroLocal >= 0 && outroLocal <= 1 ? Math.sin(Math.PI * outroLocal) : 0;

      return Math.max(introPower, outroPower);
    };

    let globalCharIndex = 0;
    lines.forEach((line, lineIndex) => {
      const yLine = startY + lineIndex * lineHeight;
      const lineWidth = measureTextWidth(context, line, letterSpacing);
      let xLine = 0;
      if (settings.align === "center") xLine -= lineWidth / 2;
      if (settings.align === "right") xLine -= lineWidth;

      const shouldDrawChars = ["jumpTypewriter", "jumpReveal", "jumpInOut", "scaleReveal"].includes(settings.animation);

      if (shouldDrawChars) {
        let cursorX = xLine;
        let hasJumpInOutMotion = false;
        const chars = splitChars(line);

        chars.forEach((char) => {
          const charWidth = context.measureText(char).width;
          let wavePower = 0;

          if (settings.animation === "scaleReveal") {
            const revealSpeed = Math.max(1, settings.scaleRevealSpeed ?? settings.cps ?? 24);
            const minScale = clamp(settings.scaleRevealMin ?? 18, 1, 100) / 100;
            const localProgress = elapsed * revealSpeed - globalCharIndex;
            if (localProgress >= 0) {
              const revealProgress = easeOutCubic(clamp(localProgress, 0, 1));
              const charScale = minScale + (1 - minScale) * revealProgress;
              const prevAlpha = context.globalAlpha;
              context.globalAlpha *= revealProgress;
              context.save();
              context.translate(cursorX + charWidth / 2, yLine);
              context.scale(charScale, charScale);
              drawStyledText(context, char, -charWidth / 2, 0, settings, 0);
              context.restore();
              context.globalAlpha = prevAlpha;
            }
          } else {
            if (settings.animation === "jumpInOut") {
              wavePower = jumpInOutPowerForChar(globalCharIndex);
              hasJumpInOutMotion = hasJumpInOutMotion || wavePower > 0.001;
            } else {
              wavePower = Math.abs(Math.sin(elapsed * (settings.jumpSpeed || 8) + globalCharIndex * 0.65));
            }

            const jumpY = yLine - wavePower * (settings.jumpSize || 0);
            drawStyledText(context, char, cursorX, jumpY, settings, 0);
          }
          cursorX += charWidth + letterSpacing;
          globalCharIndex += 1;
        });

        if (settings.animation === "jumpInOut" && !hasJumpInOutMotion) {
          // Keep the same per-character drawing path even while still,
          // so this animation never falls back to whole-line jumping.
        }
      } else {
        drawStyledText(context, line, xLine, yLine, settings, letterSpacing);
        globalCharIndex += splitChars(line).length;
      }
    });

    context.restore();
  }

  function renderFrame(time, options = {}) {
    const includePreviewBackground = options.includePreviewBackground !== false;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (includePreviewBackground) {
      ctx.save();
      ctx.fillStyle = state.previewBackgroundColor || "#f6fbff";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      if (state.previewBackgroundImage) {
        drawImageFit(
          ctx,
          state.previewBackgroundImage,
          state.previewBackgroundFit || "cover",
          CANVAS_WIDTH,
          CANVAS_HEIGHT,
          state.previewBackgroundScale ?? 100,
          state.previewBackgroundOffsetX ?? 0,
          state.previewBackgroundOffsetY ?? 0
        );
      }
      ctx.restore();
    }

    const active = state.cues
      .filter((cue) => time >= cue.start && time <= cue.end)
      .sort((a, b) => a.start - b.start);
    active.forEach((cue) => drawCue(ctx, cue, time));

    if (includePreviewBackground) {
      if (active.length) {
        activeCueInfo.textContent = active.map((cue) => cue.text).join(" / ");
      } else {
        activeCueInfo.textContent = t("noActiveSubtitles");
      }
    }
  }

  function renderCurrentPreview() {
    renderFrame(Number(previewTimeInput.value) || 0, { includePreviewBackground: true });
  }

  function renderAll() {
    renderSubtitleButtons();
    renderCueList();
    syncCueEditor();
    renderCurrentPreview();
  }

  function updatePreviewTime(value, render = true) {
    const max = Number(previewTimeRange.max) || Math.max(30, value);
    const time = round(clamp(value, 0, max), 2);
    previewTimeInput.value = String(time);
    previewTimeRange.value = String(time);
    if (render) renderFrame(time, { includePreviewBackground: true });
  }

  function updatePreviewRangeMax() {
    const duration = Number.isFinite(audioPlayer.duration) ? audioPlayer.duration : 0;
    const cueEnd = Math.max(0, ...state.cues.map((cue) => cue.end || 0));
    const max = Math.max(30, Math.ceil(duration || cueEnd || 30));
    previewTimeRange.max = String(max);
    if (duration && Number(exportEndInput.value) <= 3) {
      exportEndInput.value = String(round(duration, 2));
    }
  }

  function startRenderLoop() {
    if (renderLoopRunning) return;
    renderLoopRunning = true;

    const tick = () => {
      updatePreviewTime(audioPlayer.currentTime || 0, false);
      renderFrame(audioPlayer.currentTime || 0, { includePreviewBackground: true });
      if (!audioPlayer.paused && !audioPlayer.ended) {
        requestAnimationFrame(tick);
      } else {
        renderLoopRunning = false;
      }
    };

    requestAnimationFrame(tick);
  }

  async function hydrateAssets() {
    if (state.previewBackgroundImageDataUrl) {
      try {
        state.previewBackgroundImage = await loadImage(state.previewBackgroundImageDataUrl);
      } catch (_) {
        state.previewBackgroundImage = null;
      }
    } else {
      state.previewBackgroundImage = null;
    }

    if (state.audioDataUrl) {
      audioPlayer.src = state.audioDataUrl;
      audioFileInfo.textContent = state.audioFileName ? t("loadedFile", { name: state.audioFileName }) : t("audioLoaded");
    } else {
      audioPlayer.removeAttribute("src");
      audioPlayer.load();
      audioFileInfo.textContent = t("audioNotLoaded");
    }
  }

  function serializeProject() {
    const data = clone(state);
    delete data.previewBackgroundImage;
    return data;
  }

  async function loadProject(project) {
    const next = initialState();
    state = {
      ...next,
      ...project,
      uiLanguage: project.uiLanguage === "en" ? "en" : (project.uiLanguage === "ja" ? "ja" : next.uiLanguage),
      previewBackgroundScale: clamp(project.previewBackgroundScale ?? next.previewBackgroundScale, 1, 100),
      previewBackgroundOffsetX: clamp(project.previewBackgroundOffsetX ?? next.previewBackgroundOffsetX, -1920, 1920),
      previewBackgroundOffsetY: clamp(project.previewBackgroundOffsetY ?? next.previewBackgroundOffsetY, -1080, 1080),
      defaults: { ...next.defaults, ...(project.defaults || {}) },
      presets: mergePresets(next.presets, project.presets),
      lyrics: Array.isArray(project.lyrics) ? project.lyrics : [],
      cues: Array.isArray(project.cues) ? project.cues : []
    };

    state.cues = state.cues.map((cue) => ({
      id: cue.id || uniqueId("cue"),
      lyricId: cue.lyricId || null,
      text: cue.text || "",
      start: Number(cue.start) || 0,
      end: Number(cue.end) || (Number(cue.start) || 0) + 3,
      createdAt: Number(cue.createdAt) || 0,
      settings: {
        ...defaultStyle(),
        ...(cue.settings || {}),
        stroke: { ...defaultStyle().stroke, ...(cue.settings?.stroke || {}) },
        shadow: { ...defaultStyle().shadow, ...(cue.settings?.shadow || {}) }
      }
    }));

    state.lyrics = state.lyrics.map((lyric, index) => ({
      id: lyric.id || uniqueId("lyric"),
      index,
      text: lyric.text || "",
      cueId: lyric.cueId || null
    }));

    state.presets = mergePresets(state.presets);
    saveStoredPresets();

    if (state.selectedCueId && !state.cues.some((cue) => cue.id === state.selectedCueId)) {
      state.selectedCueId = state.cues[0]?.id || null;
    }

    if (state.lastCreatedCueId && !state.cues.some((cue) => cue.id === state.lastCreatedCueId)) {
      state.lastCreatedCueId = state.cues
        .slice()
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0) || b.start - a.start)[0]?.id || null;
    }

    sortCues();
    await hydrateAssets();
    if (!state.previewBackgroundImageDataUrl) updateFileChoiceStatus(previewBgChosenLabel, "");
    if (!state.lyrics?.length) updateFileChoiceStatus(lyricsChosenLabel, "");
    syncPreviewBackgroundControls();
    syncDefaultControls();
    renderPresetControls();
    updatePreviewRangeMax();
    updateStaticText();
    renderAll();
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function downloadJson() {
    const json = JSON.stringify(serializeProject(), null, 2);
    const blob = new Blob([json], { type: "application/json" });
    downloadBlob(blob, "video-subtitle-project.json");
  }

  function openCacheDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(CACHE_DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(CACHE_STORE_NAME)) {
          db.createObjectStore(CACHE_STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("IndexedDBを開けませんでした"));
    });
  }

  async function saveCache() {
    const db = await openCacheDb();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(CACHE_STORE_NAME, "readwrite");
      transaction.objectStore(CACHE_STORE_NAME).put(serializeProject(), CACHE_KEY);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error("キャッシュ保存に失敗しました"));
    });
    db.close();
  }

  async function loadCache() {
    const db = await openCacheDb();
    const project = await new Promise((resolve, reject) => {
      const transaction = db.transaction(CACHE_STORE_NAME, "readonly");
      const request = transaction.objectStore(CACHE_STORE_NAME).get(CACHE_KEY);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error("キャッシュ復元に失敗しました"));
    });
    db.close();
    if (project) {
      await loadProject(project);
    } else {
      alert(t("cacheMissing"));
    }
  }


  function formatSrtTimestamp(seconds) {
    const totalMs = Math.max(0, Math.round((Number(seconds) || 0) * 1000));
    const ms = totalMs % 1000;
    const totalSeconds = Math.floor(totalMs / 1000);
    const sec = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const min = totalMinutes % 60;
    const hour = Math.floor(totalMinutes / 60);
    return `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
  }

  function cleanSrtText(text) {
    return String(text || "")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .split("\n")
      .map((line) => line.trim())
      .join("\n")
      .trim();
  }

  function exportSrtFile() {
    const prefix = (exportPrefixInput.value || "subtitles").replace(/[\\/:*?"<>|]/g, "_");
    const cues = state.cues
      .filter((cue) => cleanSrtText(cue.text) && Number(cue.end) > Number(cue.start))
      .slice()
      .sort((a, b) => a.start - b.start || a.end - b.end);

    if (!cues.length) {
      alert(t("srtEmpty"));
      return;
    }

    const body = cues.map((cue, index) => [
      String(index + 1),
      `${formatSrtTimestamp(cue.start)} --> ${formatSrtTimestamp(cue.end)}`,
      cleanSrtText(cue.text)
    ].join("\r\n")).join("\r\n\r\n") + "\r\n";

    const blob = new Blob(["\uFEFF", body], { type: "text/plain;charset=utf-8" });
    downloadBlob(blob, `${prefix}.srt`);
    exportProgress.textContent = t("srtComplete", { count: cues.length });
  }

  async function exportTransparentPngZip() {
    if (!window.JSZip) {
      alert(t("jszipMissing"));
      return;
    }

    const fps = Math.round(clamp(exportFpsInput.value, 1, 60));
    const start = round(clamp(exportStartInput.value, 0, 99999), 2);
    const end = round(clamp(exportEndInput.value, start + 0.01, 99999), 2);
    const prefix = (exportPrefixInput.value || "subtitles").replace(/[\\/:*?"<>|]/g, "_");
    const frameCount = Math.floor((end - start) * fps) + 1;

    exportZipBtn.disabled = true;
    exportProgress.textContent = t("preparing", { done: 0, total: frameCount });

    try {
      const zip = new JSZip();
      for (let i = 0; i < frameCount; i += 1) {
        const time = start + i / fps;
        renderFrame(time, { includePreviewBackground: false });
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
        if (!blob) throw new Error(t("pngFailed"));
        zip.file(`${prefix}_${String(i).padStart(5, "0")}.png`, blob);

        if (i % 5 === 0 || i === frameCount - 1) {
          exportProgress.textContent = t("pngGenerating", { done: i + 1, total: frameCount });
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }

      const blob = await zip.generateAsync({ type: "blob" }, (metadata) => {
        exportProgress.textContent = t("zipGenerating", { percent: Math.round(metadata.percent) });
      });
      downloadBlob(blob, `${prefix}_png_sequence.zip`);
      exportProgress.textContent = t("exportComplete", { count: frameCount });
    } catch (error) {
      console.error(error);
      exportProgress.textContent = t("exportFailed");
      alert(error?.message || t("exportFailedRetry"));
    } finally {
      exportZipBtn.disabled = false;
      renderCurrentPreview();
    }
  }

  function bindEvents() {
    openManualBtn?.addEventListener("click", openManual);
    closeManualBtn?.addEventListener("click", closeManual);
    closeManualFooterBtn?.addEventListener("click", closeManual);
    manualModal?.addEventListener("click", (event) => {
      if (event.target === manualModal) closeManual();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeManual();
    });

    uiLanguageSelect?.addEventListener("change", () => {
      applyLanguage(uiLanguageSelect.value);
    });

    audioInput.addEventListener("change", async () => {
      const file = audioInput.files?.[0];
      if (!file) return;
      state.audioDataUrl = await fileToDataUrl(file);
      state.audioFileName = file.name;
      state.audioMimeType = file.type;
      updateFileChoiceStatus(audioChosenLabel, file.name);
      await hydrateAssets();
      audioPlayer.addEventListener("loadedmetadata", updatePreviewRangeMax, { once: true });
    });

    clearAudioBtn.addEventListener("click", async () => {
      state.audioDataUrl = null;
      state.audioFileName = "";
      state.audioMimeType = "";
      audioInput.value = "";
      updateFileChoiceStatus(audioChosenLabel, "");
      await hydrateAssets();
      renderCurrentPreview();
    });

    lyricsInput.addEventListener("change", async () => {
      const file = lyricsInput.files?.[0];
      if (!file) return;
      const text = await fileToText(file);
      updateFileChoiceStatus(lyricsChosenLabel, file.name);
      state.lyrics = parseSubtitlesText(text);
      state.cues = [];
      state.selectedCueId = null;
      state.lastCreatedCueId = null;
      renderAll();
    });

    clearSubtitlesBtn.addEventListener("click", () => {
      state.lyrics = [];
      state.cues = [];
      state.selectedCueId = null;
      state.lastCreatedCueId = null;
      lyricsInput.value = "";
      updateFileChoiceStatus(lyricsChosenLabel, "");
      renderAll();
    });

    previewBgColorInput.addEventListener("input", () => {
      state.previewBackgroundColor = previewBgColorInput.value;
      renderCurrentPreview();
    });

    previewBgFitSelect.addEventListener("change", () => {
      state.previewBackgroundFit = previewBgFitSelect.value;
      renderCurrentPreview();
    });

    previewBgScaleInput.addEventListener("input", () => {
      state.previewBackgroundScale = Math.round(clamp(previewBgScaleInput.value, 1, 100));
      previewBgScaleOutput.textContent = `${state.previewBackgroundScale}%`;
      renderCurrentPreview();
    });

    previewBgOffsetXInput.addEventListener("input", () => {
      state.previewBackgroundOffsetX = Math.round(clamp(previewBgOffsetXInput.value, -1920, 1920));
      previewBgOffsetXOutput.textContent = `${state.previewBackgroundOffsetX}px`;
      renderCurrentPreview();
    });

    previewBgOffsetYInput.addEventListener("input", () => {
      state.previewBackgroundOffsetY = Math.round(clamp(previewBgOffsetYInput.value, -1080, 1080));
      previewBgOffsetYOutput.textContent = `${state.previewBackgroundOffsetY}px`;
      renderCurrentPreview();
    });

    previewBgImageInput.addEventListener("change", async () => {
      const file = previewBgImageInput.files?.[0];
      if (!file) return;
      state.previewBackgroundImageDataUrl = await fileToDataUrl(file);
      state.previewBackgroundImage = await loadImage(state.previewBackgroundImageDataUrl);
      updateFileChoiceStatus(previewBgChosenLabel, file.name);
      renderCurrentPreview();
    });

    clearPreviewBgImageBtn.addEventListener("click", () => {
      state.previewBackgroundImageDataUrl = null;
      state.previewBackgroundImage = null;
      previewBgImageInput.value = "";
      updateFileChoiceStatus(previewBgChosenLabel, "");
      renderCurrentPreview();
    });

    [defaultFontFamilyInput, defaultFontSizeInput, defaultDurationInput, defaultAnimationInput, defaultAlignInput, autoChainSelect]
      .forEach((input) => input.addEventListener("input", updateDefaultStateFromControls));

    applyDefaultToSelectedBtn.addEventListener("click", applyDefaultsToSelected);

    audioPlayer.addEventListener("loadedmetadata", updatePreviewRangeMax);
    audioPlayer.addEventListener("play", startRenderLoop);
    audioPlayer.addEventListener("pause", () => updatePreviewTime(audioPlayer.currentTime || 0, true));
    audioPlayer.addEventListener("seeked", () => updatePreviewTime(audioPlayer.currentTime || 0, true));

    setPreviewFromAudioBtn.addEventListener("click", () => {
      updatePreviewTime(audioPlayer.currentTime || 0, true);
    });

    previewTimeRange.addEventListener("input", () => updatePreviewTime(previewTimeRange.value, true));
    previewTimeInput.addEventListener("input", () => updatePreviewTime(previewTimeInput.value, true));
    renderPreviewBtn.addEventListener("click", renderCurrentPreview);

    const editorInputs = [
      cueTextInput,
      cueStartInput,
      cueEndInput,
      cueAnimationInput,
      cueAlignInput,
      cueXInput,
      cueYInput,
      cueMaxWidthInput,
      cueFontFamilyInput,
      cueFontSizeInput,
      cueColorInput,
      cueLineHeightInput,
      cueLetterSpacingInput,
      cueLetterSpacingPanInput,
      cuePanXInput,
      cuePanYInput,
      cueScaleInput,
      cueScalePanInput,
      cueRotationInput,
      cueRotationPanInput,
      cueCpsInput,
      cueScaleRevealMinInput,
      cueScaleRevealSpeedInput,
      cueJumpSizeInput,
      cueJumpSpeedInput,
      cueFadeInInput,
      cueFadeOutInput,
      cueStrokeEnabledInput,
      cueShadowEnabledInput,
      cueFadeInDurationInput,
      cueFadeOutDurationInput,
      cueStrokeColorInput,
      cueStrokeWidthInput,
      cueShadowColorInput,
      cueShadowBlurInput,
      cueShadowOffsetXInput,
      cueShadowOffsetYInput
    ];
    editorInputs.forEach((input) => input.addEventListener("input", updateCueFromEditor));
    editorInputs.forEach((input) => input.addEventListener("change", updateCueFromEditor));

    duplicateCueBtn.addEventListener("click", duplicateSelectedCue);
    deleteCueBtn.addEventListener("click", () => deleteCue());
    savePresetBtn.addEventListener("click", saveSelectedCueAsPreset);
    applyPresetBtn.addEventListener("click", applySelectedPresetToCue);
    deletePresetBtn.addEventListener("click", deleteSelectedPreset);
    presetSelect.addEventListener("change", () => {
      const preset = (state.presets || []).find((item) => item.id === presetSelect.value);
      presetNameInput.value = preset?.name || "";
      renderPresetControls();
    });

    setExportEndFromAudioBtn.addEventListener("click", () => {
      if (Number.isFinite(audioPlayer.duration) && audioPlayer.duration > 0) {
        exportEndInput.value = String(round(audioPlayer.duration, 2));
      }
    });
    exportSrtBtn?.addEventListener("click", exportSrtFile);
    exportZipBtn.addEventListener("click", exportTransparentPngZip);

    saveJsonBtn.addEventListener("click", downloadJson);
    loadJsonInput.addEventListener("change", async () => {
      const file = loadJsonInput.files?.[0];
      if (!file) return;
      try {
        const text = await fileToText(file);
        await loadProject(JSON.parse(text));
      } catch (error) {
        console.error(error);
        alert(t("failedReadJson"));
      } finally {
        loadJsonInput.value = "";
      }
    });

    saveCacheBtn.addEventListener("click", async () => {
      try {
        await saveCache();
        alert(t("cacheSaved"));
      } catch (error) {
        console.error(error);
        alert(t("cacheSaveFailed"));
      }
    });

    loadCacheBtn.addEventListener("click", async () => {
      try {
        await loadCache();
      } catch (error) {
        console.error(error);
        alert(t("cacheLoadFailed"));
      }
    });
  }

  function init() {
    populateFontSelect(defaultFontFamilyInput);
    populateFontSelect(cueFontFamilyInput);
    syncDefaultControls();
    syncPreviewBackgroundControls();
    bindEvents();
    applyLanguage(state.uiLanguage);
  }

  init();
})();
