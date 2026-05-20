(() => {
  "use strict";

  let CANVAS_WIDTH = 1920;
  let CANVAS_HEIGHT = 1080;
  const CACHE_DB_NAME = "video-subtitle-animation-maker";
  const CACHE_STORE_NAME = "projects";
  const CACHE_KEY = "autosave";
  const PRESET_STORAGE_KEY = "video-subtitle-animation-maker-presets";
  const browserLanguage = (navigator.language || "ja").toLowerCase();
  const DEFAULT_UI_LANGUAGE = browserLanguage.startsWith("ko") ? "ko" : (browserLanguage.startsWith("ja") ? "ja" : "en");

  const FONT_OPTIONS = [
    { label: "システムゴシック", labelEn: "System Gothic", labelKo: "System Gothic", value: "\"Yu Gothic UI\", \"Yu Gothic\", \"Hiragino Sans\", \"Meiryo\", sans-serif" },
    { label: "Noto Sans KR", labelEn: "Noto Sans KR", labelKo: "Noto Sans KR", value: "\"Noto Sans KR\", \"Apple SD Gothic Neo\", \"Malgun Gothic\", sans-serif" },
    { label: "Noto Sans JP", labelEn: "Noto Sans JP", labelKo: "Noto Sans JP", value: "\"Noto Sans JP\", sans-serif" },
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
  const canvasShell = $(".canvas-shell");
  const previewPanel = $(".preview-panel");
  const previewToolbar = $(".preview-toolbar");
  const ctx = canvas.getContext("2d", { alpha: true });
  const uiLanguageSelect = $("#uiLanguageSelect");
  const canvasAspectSelect = $("#canvasAspectSelect");
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
  const customFontInput = $("#customFontInput");
  const customFontChooseLabel = $("#customFontChooseLabel");
  const customFontChosenLabel = $("#customFontChosenLabel");
  const customFontSelect = $("#customFontSelect");
  const deleteCustomFontBtn = $("#deleteCustomFontBtn");
  const applyDefaultToSelectedBtn = $("#applyDefaultToSelectedBtn");

  const lyricsCountInfo = $("#lyricsCountInfo");
  const clearLyricsBtn = $("#clearLyricsBtn");
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
  const inlineStyleTitle = $("#inlineStyleTitle");
  const inlineStyleList = $("#inlineStyleList");
  const addInlineStyleBtn = $("#addInlineStyleBtn");
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
    x: Math.round(CANVAS_WIDTH / 2),
    y: Math.round(CANVAS_HEIGHT / 2),
    maxWidth: Math.round(CANVAS_WIDTH * 0.82),
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
    canvasAspect: "16:9",
    customFonts: [],
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
  const initialSize = canvasSizeForAspect(state.canvasAspect);
  CANVAS_WIDTH = initialSize.width;
  CANVAS_HEIGHT = initialSize.height;
  let renderLoopRunning = false;
  let suppressEditorEvents = false;


  const I18N = {
    ja: {
      appTitle: "Video Subtitle Animation Maker",
      appSubtitle: "音声に合わせて字幕をボタンクリックで配置し、透過PNG連番/SRTを書き出す動画字幕作成ツール",
      language: "Language / 言語",
      manual: "取扱説明", manualTitle: "取扱説明", close: "閉じる", chooseFile: "ファイルを選択", noFileSelected: "選択されていません", selectedFile: "選択中: {name}",
      saveJson: "JSON保存", loadJson: "JSON読込", saveCache: "キャッシュ保存", loadCache: "キャッシュ復元",
      secAssets: "素材読み込み", secDefaults: "基本設定", secLyricsList: "字幕ボタン一覧", secEntered: "入力済みフレーズ", secSelected: "選択中フレーズ設定", secExport: "書き出し",
      audioFile: "音声ファイル", audioNotLoaded: "音声未読込", audioLoaded: "音声読込済み", loadedFile: "読込済み: {name}", clear: "解除",
      lyricsTxt: "字幕TXT", lyricsHint: "TXTの1行を1フレーズとして字幕ボタンにします。空行は自動除外します。",
      previewBgColor: "プレビュー背景色", bgFit: "背景画像の表示", fitCover: "画面いっぱい", fitContain: "全体表示", fitStretch: "引き伸ばし", previewBgImage: "プレビュー背景画像", bgScale: "背景画像サイズ", bgOffsetX: "背景画像移動X", bgOffsetY: "背景画像移動Y", clearBgImage: "背景画像を解除", bgHint: "背景色・背景画像はプレビュー確認用です。透過PNG書き出しには含まれません。",
      canvasAspect: "キャンバス比率", aspectLandscape: "16:9 横長", aspectPortrait: "9:16 縦長", transparentExport: "透過書き出し", customFont: "任意フォント追加", customFontList: "追加済みフォント", deleteCustomFont: "選択フォントを削除", customFontHint: "アップロードしたフォントはこのブラウザ内で利用できます。JSON/キャッシュ保存にも含まれます。", customFontLoaded: "フォントを追加しました: {name}", customFontLoadFailed: "フォントを読み込めませんでした。対応形式は ttf / otf / woff / woff2 です。", noCustomFonts: "追加フォントなし", selectFont: "フォントを選択",
      defaultFont: "基本フォント", defaultSize: "基本サイズ", defaultDuration: "初期表示秒数", autoChain: "前フレーズ終了を自動調整", yes: "する", no: "しない", defaultAnimation: "初期アニメーション", defaultAlign: "初期文字揃え", applyDefaults: "全フレーズへ基本設定を反映",
      animNormal: "通常表示", animTypewriter: "タイプライター表示", animScaleReveal: "拡大しながら表示", animJumpTypewriter: "ジャンプしながらタイプライター表示", animJumpReveal: "ジャンプしながら表示", animJumpInOut: "登場時と退場時だけジャンプ",
      alignLeft: "左寄せ", alignCenter: "中央寄せ", alignRight: "右寄せ",
      lyricsNotLoaded: "字幕未読込", clearList: "一覧クリア", lyricsButtonEmpty: "字幕TXTを読み込むと、ここに1行ずつボタンが追加されます。", enteredEmpty: "入力済みフレーズはまだありません。音声再生中に字幕ボタンを押してください。",
      inputAtCurrent: "クリックで現在時刻に入力", enteredAt: "入力済み {time} / 再クリックでキャンセル", linesCount: "{count}行",
      previewCanvas: "Preview Canvas", previewCanvasSub: "1920 × 1080 / export transparent", noActiveLyrics: "表示中の字幕なし", previewAtCurrentTime: "現在時刻でプレビュー", previewSeconds: "プレビュー秒", update: "更新", transportHint: "音声再生中に左の字幕ボタンを押すと、その時刻に字幕キューを作成します。",
      selectedEmpty: "入力済みフレーズを選択してください。", presetTitle: "フレーズ設定プリセット", presetName: "プリセット名", presetPlaceholder: "例：中央ジャンプ字幕", registeredPresets: "登録済みプリセット", selectPreset: "プリセットを選択", noPreset: "プリセット未登録", saveCurrentAsPreset: "現在設定を登録", applySelectedPreset: "選択プリセットを適用", delete: "削除", presetHint: "字幕本文・開始秒・終了秒は含めず、見た目とアニメーション設定だけを保存します。",
      lyricText: "字幕テキスト", startSec: "開始秒", endSec: "終了秒", animation: "アニメーション", textAlign: "文字揃え", positionX: "位置X", positionY: "位置Y", wrapWidth: "折り返し幅", font: "フォント", fontSize: "フォントサイズ", textColor: "文字色", lineHeight: "行間", letterSpacing: "字間", letterSpacingPan: "字間移動", textPanX: "文字PAN移動X", textPanY: "文字PAN移動Y", textScale: "文字サイズ倍率", scalePan: "サイズ移動", textRotation: "文字回転", rotationPan: "回転移動", typewriterSpeed: "タイプライター速度", scaleRevealMin: "拡大表示の最小サイズ", scaleRevealSpeed: "拡大表示の速度", jumpSize: "ジャンプの大きさ", jumpSpeed: "ジャンプの速さ", fadeIn: "フェードイン", fadeOut: "フェードアウト", stroke: "縁取り", dropShadow: "ドロップシャドウ", fadeInSec: "フェードイン秒", fadeOutSec: "フェードアウト秒", strokeColor: "フチ色", strokeWidth: "フチ太さ", shadowColor: "影色", shadowBlur: "影ぼかし", shadowX: "影X", shadowY: "影Y", inlineStyleTitle: "フォントの指定", inlineStyleHint: "指定した文字列だけ、フォント・色・サイズ・フチ・影を変更できます。複数指定はコンマで区切ってください。", inlineStyleEmpty: "指定フォントはまだありません。+ボタンで追加できます。", inlineStyleItem: "指定 {number}", inlineStyleTargets: "指定したい文字列", inlineStyleTargetsPlaceholder: "例：赤い, 海", inlineStyleFont: "指定したいフォント", inlineStyleColor: "色の選択", inlineStyleSize: "サイズ", inlineStyleStrokeColor: "フチ色", inlineStyleStrokeWidth: "フチ太さ", inlineStyleShadowColor: "影色", inlineStyleShadowBlur: "影ぼかし", addInlineStyle: "+ 追加", duplicate: "複製",
      export: "書き出し", fps: "FPS", prefix: "接頭辞", setEndFromAudio: "音声の長さを終了秒へ", exportZip: "透過PNG連番ZIPを書き出し", exportSrt: "SRT字幕を書き出し",
      preparing: "書き出し準備中... {done} / {total}", pngGenerating: "PNG生成中... {done} / {total}", zipGenerating: "ZIP生成中... {percent}%", exportComplete: "完了: {count}枚を書き出しました。", exportFailed: "書き出しに失敗しました。", srtComplete: "完了: SRT字幕を{count}件を書き出しました。", srtEmpty: "書き出せる入力済みフレーズがありません。",
      failedReadJson: "JSONを読み込めませんでした。", cacheSaved: "キャッシュへ保存しました。", cacheSaveFailed: "キャッシュ保存に失敗しました。ブラウザの保存容量を確認してください。", cacheLoadFailed: "キャッシュ復元に失敗しました。", cacheMissing: "保存済みキャッシュがありません。", jszipMissing: "JSZipを読み込めませんでした。インターネット接続、またはCDNの読み込みを確認してください。", pngFailed: "PNG生成に失敗しました。", exportFailedRetry: "書き出しに失敗しました。枚数を減らして再試行してください。",
      presetAutoName: "プリセット{count}", loadedLyrics: "表示中の字幕なし"
    },
    en: {
      appTitle: "Video Subtitle Animation Maker",
      appSubtitle: "A browser tool for placing subtitles with button clicks and exporting transparent PNG sequences or SRT subtitle files.",
      language: "Language / 言語",
      manual: "Manual", manualTitle: "Manual", close: "Close", chooseFile: "Choose File", noFileSelected: "No file selected", selectedFile: "Selected: {name}",
      saveJson: "Save JSON", loadJson: "Load JSON", saveCache: "Save Cache", loadCache: "Restore Cache",
      secAssets: "Assets", secDefaults: "Defaults", secLyricsList: "Subtitle Buttons", secEntered: "Placed Phrases", secSelected: "Selected Phrase Settings", secExport: "Export",
      audioFile: "Audio File", audioNotLoaded: "No audio loaded", audioLoaded: "Audio loaded", loadedFile: "Loaded: {name}", clear: "Clear",
      lyricsTxt: "Subtitle TXT", lyricsHint: "Each line in the TXT file becomes one subtitle button. Blank lines are ignored.",
      previewBgColor: "Preview Background Color", bgFit: "Background Image Fit", fitCover: "Fill Screen", fitContain: "Contain", fitStretch: "Stretch", previewBgImage: "Preview Background Image", bgScale: "Background Image Scale", bgOffsetX: "Background Image Offset X", bgOffsetY: "Background Image Offset Y", clearBgImage: "Clear Background Image", bgHint: "Background color and image are for preview only and are not included in transparent PNG export.",
      canvasAspect: "Canvas Aspect", aspectLandscape: "16:9 Landscape", aspectPortrait: "9:16 Portrait", transparentExport: "transparent export", customFont: "Add Custom Font", customFontList: "Custom Fonts", deleteCustomFont: "Delete Selected Font", customFontHint: "Uploaded fonts can be used in this browser and are included in JSON/cache saves.", customFontLoaded: "Font added: {name}", customFontLoadFailed: "Could not load the font. Supported formats: ttf / otf / woff / woff2.", noCustomFonts: "No custom fonts", selectFont: "Select a font",
      defaultFont: "Default Font", defaultSize: "Default Size", defaultDuration: "Default Duration", autoChain: "Auto-adjust previous phrase end", yes: "On", no: "Off", defaultAnimation: "Default Animation", defaultAlign: "Default Alignment", applyDefaults: "Apply defaults to all phrases",
      animNormal: "Normal", animTypewriter: "Typewriter", animScaleReveal: "Scale Reveal", animJumpTypewriter: "Jump + Typewriter", animJumpReveal: "Jump Reveal", animJumpInOut: "Jump on In/Out",
      alignLeft: "Left", alignCenter: "Center", alignRight: "Right",
      lyricsNotLoaded: "No subtitles loaded", clearList: "Clear List", lyricsButtonEmpty: "Load a subtitle TXT file to create one button per line here.", enteredEmpty: "No phrases placed yet. Press a subtitle button while audio is playing.",
      inputAtCurrent: "Click to place at current time", enteredAt: "Placed {time} / click again to cancel", linesCount: "{count} lines",
      previewCanvas: "Preview Canvas", previewCanvasSub: "1920 × 1080 / transparent export", noActiveLyrics: "No active subtitles", previewAtCurrentTime: "Preview at Current Time", previewSeconds: "Preview Time", update: "Update", transportHint: "While audio is playing, press a subtitle button on the left to create a subtitle cue at that time.",
      selectedEmpty: "Select a placed phrase.", presetTitle: "Phrase Setting Presets", presetName: "Preset Name", presetPlaceholder: "e.g. Center Jump Subtitle", registeredPresets: "Saved Presets", selectPreset: "Select a preset", noPreset: "No presets", saveCurrentAsPreset: "Save Current Settings", applySelectedPreset: "Apply Selected Preset", delete: "Delete", presetHint: "Only appearance and animation settings are saved. Subtitle text and timing are not included.",
      lyricText: "Subtitle Text", startSec: "Start (sec)", endSec: "End (sec)", animation: "Animation", textAlign: "Alignment", positionX: "Position X", positionY: "Position Y", wrapWidth: "Wrap Width", font: "Font", fontSize: "Font Size", textColor: "Text Color", lineHeight: "Line Height", letterSpacing: "Letter Spacing", letterSpacingPan: "Letter Spacing Pan", textPanX: "Text Pan X", textPanY: "Text Pan Y", textScale: "Text Scale", scalePan: "Scale Pan", textRotation: "Text Rotation", rotationPan: "Rotation Pan", typewriterSpeed: "Typewriter Speed", scaleRevealMin: "Scale Reveal Min Size", scaleRevealSpeed: "Scale Reveal Speed", jumpSize: "Jump Height", jumpSpeed: "Jump Speed", fadeIn: "Fade In", fadeOut: "Fade Out", stroke: "Stroke", dropShadow: "Drop Shadow", fadeInSec: "Fade In (sec)", fadeOutSec: "Fade Out (sec)", strokeColor: "Stroke Color", strokeWidth: "Stroke Width", shadowColor: "Shadow Color", shadowBlur: "Shadow Blur", shadowX: "Shadow X", shadowY: "Shadow Y", inlineStyleTitle: "Font Assignment", inlineStyleHint: "Change the font, color, size, stroke, and shadow only for specified text. Separate multiple strings with commas.", inlineStyleEmpty: "No font assignments yet. Use the + button to add one.", inlineStyleItem: "Assignment {number}", inlineStyleTargets: "Target Text", inlineStyleTargetsPlaceholder: "e.g. red, sea", inlineStyleFont: "Assigned Font", inlineStyleColor: "Color", inlineStyleSize: "Size", inlineStyleStrokeColor: "Stroke Color", inlineStyleStrokeWidth: "Stroke Width", inlineStyleShadowColor: "Shadow Color", inlineStyleShadowBlur: "Shadow Blur", addInlineStyle: "+ Add", duplicate: "Duplicate",
      export: "Export", fps: "FPS", prefix: "Prefix", setEndFromAudio: "Use Audio Length as End Time", exportZip: "Export Transparent PNG ZIP", exportSrt: "Export SRT Subtitles",
      preparing: "Preparing export... {done} / {total}", pngGenerating: "Generating PNG... {done} / {total}", zipGenerating: "Creating ZIP... {percent}%", exportComplete: "Done: exported {count} frames.", exportFailed: "Export failed.", srtComplete: "Done: exported {count} SRT subtitles.", srtEmpty: "There are no placed phrases to export.",
      failedReadJson: "Could not load the JSON file.", cacheSaved: "Saved to cache.", cacheSaveFailed: "Could not save cache. Please check browser storage limits.", cacheLoadFailed: "Could not restore cache.", cacheMissing: "No saved cache was found.", jszipMissing: "JSZip could not be loaded. Please check your internet connection or the CDN.", pngFailed: "Failed to generate PNG.", exportFailedRetry: "Export failed. Try reducing the number of frames and run again.",
      presetAutoName: "Preset {count}", loadedLyrics: "No active subtitles"

    },
    ko: {
      appTitle: "Video Subtitle Animation Maker",
      appSubtitle: "오디오에 맞춰 자막을 버튼 클릭으로 배치하고 투명 PNG 시퀀스/SRT 자막을 내보내는 영상 자막 제작 도구입니다.",
      language: "Language / 언어",
      manual: "사용 설명서", manualTitle: "사용 설명서", close: "닫기", chooseFile: "파일 선택", noFileSelected: "선택된 파일 없음", selectedFile: "선택 중: {name}",
      saveJson: "JSON 저장", loadJson: "JSON 불러오기", saveCache: "캐시 저장", loadCache: "캐시 복원",
      secAssets: "소재 불러오기", secDefaults: "기본 설정", secLyricsList: "자막 버튼 목록", secEntered: "입력된 프레이즈", secSelected: "선택 중인 프레이즈 설정", secExport: "내보내기",
      audioFile: "오디오 파일", audioNotLoaded: "오디오 미불러옴", audioLoaded: "오디오 불러옴", loadedFile: "불러옴: {name}", clear: "해제",
      lyricsTxt: "자막 TXT", lyricsHint: "TXT의 한 줄을 하나의 프레이즈 버튼으로 만듭니다. 빈 줄은 자동으로 제외됩니다.",
      previewBgColor: "미리보기 배경색", bgFit: "배경 이미지 표시", fitCover: "화면 채우기", fitContain: "전체 표시", fitStretch: "늘이기", previewBgImage: "미리보기 배경 이미지", bgScale: "배경 이미지 크기", bgOffsetX: "배경 이미지 이동 X", bgOffsetY: "배경 이미지 이동 Y", clearBgImage: "배경 이미지 해제", bgHint: "배경색과 배경 이미지는 미리보기 확인용입니다. 투명 PNG 내보내기에는 포함되지 않습니다.",
      canvasAspect: "캔버스 비율", aspectLandscape: "16:9 가로형", aspectPortrait: "9:16 세로형", transparentExport: "투명 내보내기", customFont: "사용자 폰트 추가", customFontList: "추가된 폰트", deleteCustomFont: "선택한 폰트 삭제", customFontHint: "업로드한 폰트는 이 브라우저에서 사용할 수 있으며 JSON/캐시 저장에도 포함됩니다.", customFontLoaded: "폰트를 추가했습니다: {name}", customFontLoadFailed: "폰트를 불러올 수 없습니다. 지원 형식은 ttf / otf / woff / woff2입니다.", noCustomFonts: "추가 폰트 없음", selectFont: "폰트 선택",
      defaultFont: "기본 폰트", defaultSize: "기본 크기", defaultDuration: "초기 표시 시간", autoChain: "이전 프레이즈 종료 자동 조정", yes: "켜기", no: "끄기", defaultAnimation: "초기 애니메이션", defaultAlign: "초기 정렬", applyDefaults: "모든 프레이즈에 기본 설정 적용",
      animNormal: "일반 표시", animTypewriter: "타자기 표시", animScaleReveal: "확대하며 표시", animJumpTypewriter: "점프하며 타자기 표시", animJumpReveal: "점프하며 표시", animJumpInOut: "등장/퇴장 시에만 점프",
      alignLeft: "왼쪽 정렬", alignCenter: "가운데 정렬", alignRight: "오른쪽 정렬",
      lyricsNotLoaded: "자막 미불러옴", clearList: "목록 지우기", lyricsButtonEmpty: "자막 TXT를 불러오면 여기에 한 줄씩 버튼이 추가됩니다.", enteredEmpty: "아직 입력된 프레이즈가 없습니다. 오디오 재생 중에 자막 버튼을 눌러 주세요.",
      inputAtCurrent: "클릭하면 현재 시간에 입력", enteredAt: "입력됨 {time} / 다시 클릭하면 취소", linesCount: "{count}줄",
      previewCanvas: "Preview Canvas", previewCanvasSub: "1920 × 1080 / transparent export", noActiveLyrics: "표시 중인 자막 없음", previewAtCurrentTime: "현재 시간으로 미리보기", previewSeconds: "미리보기 초", update: "갱신", transportHint: "오디오 재생 중 왼쪽의 자막 버튼을 누르면 해당 시각에 자막 큐가 생성됩니다.",
      selectedEmpty: "입력된 프레이즈를 선택해 주세요.", presetTitle: "프레이즈 설정 프리셋", presetName: "프리셋 이름", presetPlaceholder: "예: 중앙 점프 자막", registeredPresets: "등록된 프리셋", selectPreset: "프리셋 선택", noPreset: "등록된 프리셋 없음", saveCurrentAsPreset: "현재 설정 등록", applySelectedPreset: "선택한 프리셋 적용", delete: "삭제", presetHint: "자막 본문, 시작 시간, 종료 시간은 포함하지 않고 외형과 애니메이션 설정만 저장합니다.",
      lyricText: "자막 텍스트", startSec: "시작 초", endSec: "종료 초", animation: "애니메이션", textAlign: "문자 정렬", positionX: "위치 X", positionY: "위치 Y", wrapWidth: "줄바꿈 폭", font: "폰트", fontSize: "폰트 크기", textColor: "문자색", lineHeight: "줄 간격", letterSpacing: "자간", letterSpacingPan: "자간 이동", textPanX: "문자 PAN 이동 X", textPanY: "문자 PAN 이동 Y", textScale: "문자 크기 배율", scalePan: "크기 이동", textRotation: "문자 회전", rotationPan: "회전 이동", typewriterSpeed: "타자기 속도", scaleRevealMin: "확대 표시 최소 크기", scaleRevealSpeed: "확대 표시 속도", jumpSize: "점프 크기", jumpSpeed: "점프 속도", fadeIn: "페이드 인", fadeOut: "페이드 아웃", stroke: "외곽선", dropShadow: "드롭 섀도", fadeInSec: "페이드 인 초", fadeOutSec: "페이드 아웃 초", strokeColor: "외곽선 색", strokeWidth: "외곽선 두께", shadowColor: "그림자 색", shadowBlur: "그림자 흐림", shadowX: "그림자 X", shadowY: "그림자 Y", inlineStyleTitle: "폰트 지정", inlineStyleHint: "지정한 문자열에만 폰트, 색상, 크기, 외곽선, 그림자를 변경할 수 있습니다. 여러 항목은 쉼표로 구분하세요.", inlineStyleEmpty: "아직 폰트 지정이 없습니다. + 버튼으로 추가할 수 있습니다.", inlineStyleItem: "지정 {number}", inlineStyleTargets: "지정할 문자열", inlineStyleTargetsPlaceholder: "예: 빨간, 바다", inlineStyleFont: "지정할 폰트", inlineStyleColor: "색상 선택", inlineStyleSize: "크기", inlineStyleStrokeColor: "외곽선 색", inlineStyleStrokeWidth: "외곽선 두께", inlineStyleShadowColor: "그림자 색", inlineStyleShadowBlur: "그림자 흐림", addInlineStyle: "+ 추가", duplicate: "복제",
      export: "내보내기", fps: "FPS", prefix: "접두사", setEndFromAudio: "오디오 길이를 종료 초로 설정", exportZip: "투명 PNG 시퀀스 ZIP 내보내기", exportSrt: "SRT 자막 내보내기",
      preparing: "내보내기 준비 중... {done} / {total}", pngGenerating: "PNG 생성 중... {done} / {total}", zipGenerating: "ZIP 생성 중... {percent}%", exportComplete: "완료: {count}장을 내보냈습니다.", exportFailed: "내보내기에 실패했습니다.", srtComplete: "완료: SRT 자막 {count}개를 내보냈습니다.", srtEmpty: "내보낼 수 있는 입력된 프레이즈가 없습니다.",
      failedReadJson: "JSON을 불러올 수 없습니다.", cacheSaved: "캐시에 저장했습니다.", cacheSaveFailed: "캐시 저장에 실패했습니다. 브라우저 저장 용량을 확인해 주세요.", cacheLoadFailed: "캐시 복원에 실패했습니다.", cacheMissing: "저장된 캐시가 없습니다.", jszipMissing: "JSZip을 불러올 수 없습니다. 인터넷 연결 또는 CDN 로딩을 확인해 주세요.", pngFailed: "PNG 생성에 실패했습니다.", exportFailedRetry: "내보내기에 실패했습니다. 프레임 수를 줄인 뒤 다시 시도해 주세요.",
      presetAutoName: "프리셋 {count}", loadedLyrics: "표시 중인 자막 없음"
    }
  };

  function currentLang() {
    if (state.uiLanguage === "ko") return "ko";
    if (state.uiLanguage === "en") return "en";
    return "ja";
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
    if (leftSummaries[2]) leftSummaries[2].textContent = t("secLyricsList");
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

    setFieldLabel(canvasAspectSelect, "canvasAspect");
    setSelectOptions(canvasAspectSelect, { "16:9": t("aspectLandscape"), "9:16": t("aspectPortrait") });
    setFieldLabel(defaultFontFamilyInput, "defaultFont");
    setRangeLabel(defaultFontSizeInput, "defaultSize");
    setFieldLabel(defaultDurationInput, "defaultDuration");
    setFieldLabel(autoChainSelect, "autoChain");
    setSelectOptions(autoChainSelect, { "1": t("yes"), "0": t("no") });
    setFieldLabel(defaultAnimationInput, "defaultAnimation");
    setSelectOptions(defaultAnimationInput, { normal: t("animNormal"), typewriter: t("animTypewriter"), scaleReveal: t("animScaleReveal"), jumpTypewriter: t("animJumpTypewriter"), jumpReveal: t("animJumpReveal"), jumpInOut: t("animJumpInOut") });
    setFieldLabel(defaultAlignInput, "defaultAlign");
    setSelectOptions(defaultAlignInput, { left: t("alignLeft"), center: t("alignCenter"), right: t("alignRight") });
    setFieldLabel(customFontInput, "customFont");
    setText(customFontChooseLabel, "chooseFile");
    updateFileChoiceStatus(customFontChosenLabel, customFontChosenLabel?.dataset.filename || "");
    setFieldLabel(customFontSelect, "customFontList");
    setText(deleteCustomFontBtn, "deleteCustomFont");
    setText(document.querySelector(".custom-font-hint"), "customFontHint");
    renderCustomFontControls();
    setText(applyDefaultToSelectedBtn, "applyDefaults");

    setText(clearLyricsBtn, "clearList");
    setText(".preview-toolbar strong", "previewCanvas");
    updatePreviewCanvasInfo();
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
    setText(inlineStyleTitle, "inlineStyleTitle"); setText(addInlineStyleBtn, "addInlineStyle"); setText(document.querySelector(".inline-style-hint"), "inlineStyleHint");
    setRangeLabel(cueLetterSpacingInput, "letterSpacing"); setRangeLabel(cueLetterSpacingPanInput, "letterSpacingPan"); setRangeLabel(cuePanXInput, "textPanX"); setRangeLabel(cuePanYInput, "textPanY"); setRangeLabel(cueScaleInput, "textScale"); setRangeLabel(cueScalePanInput, "scalePan"); setRangeLabel(cueRotationInput, "textRotation"); setRangeLabel(cueRotationPanInput, "rotationPan"); setRangeLabel(cueCpsInput, "typewriterSpeed"); setRangeLabel(cueScaleRevealMinInput, "scaleRevealMin"); setRangeLabel(cueScaleRevealSpeedInput, "scaleRevealSpeed"); setRangeLabel(cueJumpSizeInput, "jumpSize"); setRangeLabel(cueJumpSpeedInput, "jumpSpeed");
    setTextNodeLabel(cueFadeInInput.closest('label'), "fadeIn"); setTextNodeLabel(cueFadeOutInput.closest('label'), "fadeOut"); setTextNodeLabel(cueStrokeEnabledInput.closest('label'), "stroke"); setTextNodeLabel(cueShadowEnabledInput.closest('label'), "dropShadow");
    setFieldLabel(cueFadeInDurationInput, "fadeInSec"); setFieldLabel(cueFadeOutDurationInput, "fadeOutSec"); setFieldLabel(cueStrokeColorInput, "strokeColor"); setRangeLabel(cueStrokeWidthInput, "strokeWidth"); setFieldLabel(cueShadowColorInput, "shadowColor"); setRangeLabel(cueShadowBlurInput, "shadowBlur"); setFieldLabel(cueShadowOffsetXInput, "shadowX"); setFieldLabel(cueShadowOffsetYInput, "shadowY");
    setText(duplicateCueBtn, "duplicate"); setText(deleteCueBtn, "delete");

    setFieldLabel(exportFpsInput, "fps"); setFieldLabel(exportPrefixInput, "prefix"); setFieldLabel(exportStartInput, "startSec"); setFieldLabel(exportEndInput, "endSec"); setText(setExportEndFromAudioBtn, "setEndFromAudio"); setText(exportSrtBtn, "exportSrt"); setText(exportZipBtn, "exportZip");
  }


  function manualHtmlJa() {
    return `
      <h3>このツールについて</h3>
      <p>音声に合わせて字幕フレーズをボタンクリックで配置し、文字アニメーション付きの透過PNG連番やSRT字幕を書き出すための動画字幕作成ツールです。背景色・背景画像は確認用で、書き出しには含まれません。</p>

      <h3>1. 素材を読み込む</h3>
      <ol>
        <li><strong>音声ファイル</strong>から楽曲や仮音源を読み込みます。</li>
        <li><strong>字幕TXT</strong>を読み込みます。TXTの1行が1つの字幕ボタンになります。</li>
        <li>プレビュー確認用に背景色や背景画像を設定できます。背景画像はサイズ、X位置、Y位置を調整できます。</li>
      </ol>

      <h3>2. 字幕をタイミング入力する</h3>
      <ol>
        <li>音声を再生します。</li>
        <li>任意のタイミングで左側の字幕ボタンをクリックすると、その時刻にフレーズが配置されます。</li>
        <li>配置済みの字幕ボタンはグレー表示になります。もう一度クリックすると配置をキャンセルできます。</li>
        <li>入力済みフレーズ一覧からフレーズを選択すると、右側で細かい設定を編集できます。</li>
      </ol>

      <h3>3. 基本設定</h3>
      <p>基本フォント、基本サイズ、初期表示秒数、初期アニメーション、文字揃えを設定できます。新しく配置するフレーズには、基本設定または直前のフレーズ設定が反映されます。</p>

      <h3>4. フレーズごとの編集</h3>
      <ul>
        <li>開始秒・終了秒、字幕テキストを編集できます。</li>
        <li>位置X/Y、折り返し幅、フォント、フォントサイズ、文字色、行間、字間を調整できます。</li>
        <li><strong>フォントの指定</strong>では、1フレーズ中の指定文字列だけフォント・色・サイズ・フチ・影を変更できます。複数の文字列はコンマで区切れます。</li>
        <li>文字PAN移動、サイズ移動、文字回転、回転移動、字間移動を使って、時間経過に合わせた動きを付けられます。</li>
        <li>フェードイン、フェードアウト、縁取り、ドロップシャドウを設定できます。</li>
      </ul>

      <h3>5. アニメーション種類</h3>
      <ul>
        <li><strong>通常表示</strong>：フレーズ全体をそのまま表示します。</li>
        <li><strong>タイプライター表示</strong>：文字が順番に表示されます。</li>
        <li><strong>拡大しながら表示</strong>：登場時に1文字ずつ小さいサイズから設定サイズへ拡大しながら表示します。最小サイズと出現速度をスライダーで調整できます。</li>
        <li><strong>ジャンプしながらタイプライター表示</strong>：文字が順番に表示され、1文字ずつ波打つようにジャンプします。</li>
        <li><strong>ジャンプしながら表示</strong>：表示済みの文字全体に、1文字ずつ波打つジャンプを付けます。</li>
        <li><strong>登場時と退場時だけジャンプ</strong>：フレーズの出始めと消え際だけジャンプします。</li>
      </ul>

      <h3>6. プリセット</h3>
      <p>選択中フレーズの見た目やアニメーション設定をプリセット登録できます。字幕本文、開始秒、終了秒はプリセットに含まれません。別フレーズへ同じ演出を使い回したい時に便利です。</p>

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
        <li><strong>SRT字幕を書き出し</strong>を押すと、入力済みフレーズの開始秒・終了秒・字幕本文をもとに.srt字幕ファイルを保存できます。</li>
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
      <p>This is a browser-based video subtitle creation tool for placing subtitle phrases in sync with audio by clicking buttons and exporting animated transparent PNG sequences or SRT subtitle files. Preview background color and images are only for checking the layout and are not included in the export.</p>

      <h3>1. Load assets</h3>
      <ol>
        <li>Load a song or temporary audio file from <strong>Audio File</strong>.</li>
        <li>Load a <strong>Subtitle TXT</strong> file. Each line in the TXT file becomes one subtitle button.</li>
        <li>You can set a preview background color or image. The background image scale, X offset, and Y offset can be adjusted.</li>
      </ol>

      <h3>2. Place subtitles to timing</h3>
      <ol>
        <li>Play the audio.</li>
        <li>Click a subtitle button on the left at the timing where you want the phrase to appear.</li>
        <li>Placed subtitle buttons turn gray. Click again to cancel that placement.</li>
        <li>Select a placed phrase from the list to edit detailed settings on the right.</li>
      </ol>

      <h3>3. Default settings</h3>
      <p>You can set the default font, size, duration, animation, and alignment. New phrases use the default settings or inherit the previous phrase settings.</p>

      <h3>4. Edit each phrase</h3>
      <ul>
        <li>Edit start time, end time, and subtitle text.</li>
        <li>Adjust position X/Y, wrap width, font, font size, text color, line height, and letter spacing.</li>
        <li>Use <strong>Font Assignment</strong> to change only specific text strings inside one phrase. You can assign font, color, and size, and separate multiple target strings with commas.</li>
        <li>Add motion over time with text pan, scale pan, rotation, rotation pan, and letter spacing pan.</li>
        <li>Enable fade in, fade out, stroke, and drop shadow.</li>
      </ul>

      <h3>5. Animation types</h3>
      <ul>
        <li><strong>Normal</strong>: Shows the whole phrase normally.</li>
        <li><strong>Typewriter</strong>: Reveals characters one by one.</li>
        <li><strong>Scale Reveal</strong>: Reveals characters one by one while scaling them up. You can adjust the starting size and reveal speed with sliders.</li>
        <li><strong>Jump + Typewriter</strong>: Reveals characters one by one while each character jumps in a wave.</li>
        <li><strong>Jump Reveal</strong>: Applies wave-like jumping to the displayed characters.</li>
        <li><strong>Jump on In/Out</strong>: Adds jumping only when the phrase appears and disappears.</li>
      </ul>

      <h3>6. Presets</h3>
      <p>You can save the selected phrase’s appearance and animation settings as a preset. Subtitle text, start time, and end time are not included. This is useful for reusing the same effect on other phrases.</p>

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
      </ol>

      <h3>Note</h3>
      <p class="manual-note">Long exports and high FPS create many PNG files and may increase browser memory usage. If an error occurs, shorten the export range or lower the FPS.</p>
    `;
  }


  function manualHtmlKo() {
    return `
      <p class="manual-note">※한국어 번역에는 AI 번역을 사용했습니다. 일부 어색한 표현이 있을 수 있으니 양해 부탁드립니다.</p>

      <h3>이 도구에 대하여</h3>
      <p>오디오에 맞춰 자막 프레이즈를 버튼 클릭으로 배치하고, 문자 애니메이션이 적용된 투명 PNG 시퀀스나 SRT 자막 파일을 내보내기 위한 영상 자막 제작 도구입니다. 배경색과 배경 이미지는 확인용이며, 내보내기에는 포함되지 않습니다.</p>

      <h3>1. 소재 불러오기</h3>
      <ol>
        <li><strong>오디오 파일</strong>에서 음악이나 임시 음원을 불러옵니다.</li>
        <li><strong>자막 TXT</strong>를 불러옵니다. TXT의 한 줄이 하나의 자막 버튼이 됩니다.</li>
        <li>미리보기 확인용으로 배경색이나 배경 이미지를 설정할 수 있습니다. 배경 이미지는 크기, X 위치, Y 위치를 조정할 수 있습니다.</li>
      </ol>

      <h3>2. 자막 타이밍 입력</h3>
      <ol>
        <li>오디오를 재생합니다.</li>
        <li>원하는 타이밍에 왼쪽의 자막 버튼을 클릭하면 그 시각에 프레이즈가 배치됩니다.</li>
        <li>배치된 자막 버튼은 회색으로 표시됩니다. 다시 클릭하면 배치를 취소할 수 있습니다.</li>
        <li>입력된 프레이즈 목록에서 프레이즈를 선택하면 오른쪽에서 세부 설정을 편집할 수 있습니다.</li>
      </ol>

      <h3>3. 프레이즈 설정</h3>
      <p>선택 중인 프레이즈마다 다음 항목을 설정할 수 있습니다.</p>
      <ul>
        <li>시작 초 / 종료 초 / 자막 텍스트</li>
        <li>폰트, 폰트 크기, 문자색, 줄 간격, 자간</li>
        <li><strong>폰트 지정</strong>에서 한 프레이즈 안의 특정 문자열만 폰트, 색상, 크기를 변경할 수 있습니다. 여러 문자열은 쉼표로 구분할 수 있습니다.</li>
        <li>위치 X/Y, 문자 PAN 이동 X/Y, 크기 이동, 회전 이동</li>
        <li>일반 표시, 타자기 표시, 확대하며 표시, 점프 계열 애니메이션</li>
        <li>확대 표시의 최소 크기와 속도</li>
        <li>페이드 인 / 페이드 아웃</li>
        <li>외곽선, 드롭 섀도</li>
      </ul>

      <h3>4. 프리셋</h3>
      <p><strong>현재 설정 등록</strong>으로 선택 중인 프레이즈의 외형과 애니메이션 설정을 저장할 수 있습니다. 자막 본문과 타이밍은 저장하지 않으므로 여러 프레이즈에 같은 연출을 적용하기 쉽습니다.</p>

      <h3>5. 내보내기</h3>
      <ol>
        <li>FPS, 접두사, 시작 초, 종료 초를 설정합니다.</li>
        <li><strong>투명 PNG 시퀀스 ZIP 내보내기</strong>를 누르면 자막 레이어만 투명 PNG 시퀀스로 저장됩니다.</li>
        <li><strong>SRT 자막 내보내기</strong>를 누르면 입력된 프레이즈의 시작 초, 종료 초, 자막 본문을 바탕으로 .srt 자막 파일을 저장합니다.</li>
      </ol>

      <p class="manual-note">긴 시간이나 높은 FPS로 내보내면 PNG 수가 많아져 브라우저 메모리 사용량이 증가합니다. 오류가 발생하면 내보내기 범위를 짧게 하거나 FPS를 낮춰 주세요.</p>
    `;
  }

  function updateManualContent() {
    if (!manualModalBody || !manualModalTitle) return;
    manualModalTitle.textContent = t("manualTitle");
    closeManualFooterBtn.textContent = t("close");
    if (currentLang() === "ko") {
      manualModalBody.innerHTML = manualHtmlKo();
    } else {
      manualModalBody.innerHTML = currentLang() === "en" ? manualHtmlEn() : manualHtmlJa();
    }
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

  function canvasSizeForAspect(aspect) {
    return aspect === "9:16" ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 };
  }

  function updatePreviewCanvasInfo() {
    const node = document.querySelector('.preview-toolbar strong')?.nextElementSibling;
    if (node) node.textContent = `${CANVAS_WIDTH} × ${CANVAS_HEIGHT} / ${t("transparentExport")}`;
  }

  function resizePreviewViewport() {
    if (!canvasShell || !previewPanel) return;
    const aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
    const panelWidth = Math.max(1, previewPanel.clientWidth);
    const toolbarHeight = previewToolbar ? previewToolbar.offsetHeight : 0;
    const panelStyle = getComputedStyle(previewPanel);
    const padTop = parseFloat(panelStyle.paddingTop) || 0;
    const padBottom = parseFloat(panelStyle.paddingBottom) || 0;
    const padLeft = parseFloat(panelStyle.paddingLeft) || 0;
    const padRight = parseFloat(panelStyle.paddingRight) || 0;
    const availableWidth = Math.max(1, panelWidth - padLeft - padRight);
    const availableHeight = Math.max(1, previewPanel.clientHeight - toolbarHeight - padTop - padBottom);

    let displayWidth = availableWidth;
    let displayHeight = displayWidth / aspect;
    if (displayHeight > availableHeight) {
      displayHeight = availableHeight;
      displayWidth = displayHeight * aspect;
    }

    canvasShell.style.aspectRatio = `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`;
    canvasShell.style.width = `${Math.max(1, Math.floor(displayWidth))}px`;
    canvasShell.style.height = `${Math.max(1, Math.floor(displayHeight))}px`;
  }

  function updateCanvasControlRanges() {
    if (canvas) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      canvas.style.aspectRatio = `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.maxWidth = "none";
      canvas.style.maxHeight = "none";
    }
    resizePreviewViewport();
    if (canvasAspectSelect) canvasAspectSelect.value = state.canvasAspect || "16:9";

    if (cueXInput) cueXInput.max = String(CANVAS_WIDTH);
    if (cueYInput) cueYInput.max = String(CANVAS_HEIGHT);
    if (cueMaxWidthInput) cueMaxWidthInput.max = String(CANVAS_WIDTH);
    if (previewBgOffsetXInput) {
      previewBgOffsetXInput.min = String(-CANVAS_WIDTH);
      previewBgOffsetXInput.max = String(CANVAS_WIDTH);
    }
    if (previewBgOffsetYInput) {
      previewBgOffsetYInput.min = String(-CANVAS_HEIGHT);
      previewBgOffsetYInput.max = String(CANVAS_HEIGHT);
    }
    if (cuePanXInput) {
      cuePanXInput.min = String(-CANVAS_WIDTH);
      cuePanXInput.max = String(CANVAS_WIDTH);
    }
    if (cuePanYInput) {
      cuePanYInput.min = String(-CANVAS_HEIGHT);
      cuePanYInput.max = String(CANVAS_HEIGHT);
    }
    updatePreviewCanvasInfo();
  }

  function applyCanvasAspect(aspect, { scaleExisting = false } = {}) {
    const nextAspect = aspect === "9:16" ? "9:16" : "16:9";
    const oldWidth = CANVAS_WIDTH;
    const oldHeight = CANVAS_HEIGHT;
    const nextSize = canvasSizeForAspect(nextAspect);
    state.canvasAspect = nextAspect;
    CANVAS_WIDTH = nextSize.width;
    CANVAS_HEIGHT = nextSize.height;

    if (scaleExisting && oldWidth && oldHeight && (oldWidth !== CANVAS_WIDTH || oldHeight !== CANVAS_HEIGHT)) {
      const ratioX = CANVAS_WIDTH / oldWidth;
      const ratioY = CANVAS_HEIGHT / oldHeight;
      state.cues.forEach((cue) => {
        if (!cue.settings) return;
        cue.settings.x = Math.round(clamp((cue.settings.x ?? oldWidth / 2) * ratioX, 0, CANVAS_WIDTH));
        cue.settings.y = Math.round(clamp((cue.settings.y ?? oldHeight / 2) * ratioY, 0, CANVAS_HEIGHT));
        cue.settings.maxWidth = Math.round(clamp((cue.settings.maxWidth ?? oldWidth * 0.82) * ratioX, 100, CANVAS_WIDTH));
        cue.settings.panX = Math.round(clamp((cue.settings.panX ?? 0) * ratioX, -CANVAS_WIDTH, CANVAS_WIDTH));
        cue.settings.panY = Math.round(clamp((cue.settings.panY ?? 0) * ratioY, -CANVAS_HEIGHT, CANVAS_HEIGHT));
      });
      state.previewBackgroundOffsetX = Math.round(clamp((state.previewBackgroundOffsetX ?? 0) * ratioX, -CANVAS_WIDTH, CANVAS_WIDTH));
      state.previewBackgroundOffsetY = Math.round(clamp((state.previewBackgroundOffsetY ?? 0) * ratioY, -CANVAS_HEIGHT, CANVAS_HEIGHT));
    }

    updateCanvasControlRanges();
    syncPreviewBackgroundControls();
    syncCueEditor();
    renderCurrentPreview();
  }

  function fontOptions() {
    const custom = safeArray(state.customFonts).map((font) => ({
      label: `${font.name || font.familyName} *`,
      labelEn: `${font.name || font.familyName} *`,
      labelKo: `${font.name || font.familyName} *`,
      value: `"${font.familyName}", sans-serif`,
      custom: true,
      customId: font.id
    }));
    return [...FONT_OPTIONS, ...custom];
  }

  function sanitizeFontFamilyName(name) {
    const base = String(name || "Custom Font").replace(/\.[^.]+$/, "").replace(/[\\"']/g, "").trim() || "Custom Font";
    return `Subtitle_Custom_${base.replace(/[^\w\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af-]+/g, "_")}_${Date.now().toString(36)}`;
  }

  async function registerCustomFont(font) {
    if (!font?.dataUrl || !font?.familyName || typeof FontFace !== "function") return false;
    const fontFace = new FontFace(font.familyName, `url(${font.dataUrl})`);
    await fontFace.load();
    document.fonts.add(fontFace);
    font.loaded = true;
    return true;
  }

  async function registerAllCustomFonts() {
    for (const font of safeArray(state.customFonts)) {
      try {
        await registerCustomFont(font);
      } catch (error) {
        console.warn("Custom font load failed", font?.name, error);
      }
    }
    if (document.fonts?.ready) await document.fonts.ready;
  }

  function renderCustomFontControls() {
    if (!customFontSelect) return;
    const current = customFontSelect.value;
    customFontSelect.innerHTML = "";
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = safeArray(state.customFonts).length ? t("selectFont") : t("noCustomFonts");
    customFontSelect.append(empty);
    safeArray(state.customFonts).forEach((font) => {
      const option = document.createElement("option");
      option.value = font.id;
      option.textContent = font.name || font.familyName;
      customFontSelect.append(option);
    });
    if (current && safeArray(state.customFonts).some((font) => font.id === current)) customFontSelect.value = current;
    deleteCustomFontBtn.disabled = !customFontSelect.value;
  }

  function applyLanguage(lang) {
    state.uiLanguage = ["ja", "en", "ko"].includes(lang) ? lang : "ja";
    const defaultFont = defaultFontFamilyInput.value;
    const cueFont = cueFontFamilyInput.value;
    populateFontSelect(defaultFontFamilyInput);
    populateFontSelect(cueFontFamilyInput);
    defaultFontFamilyInput.value = defaultFont || state.defaults.fontFamily;
    cueFontFamilyInput.value = cueFont || (selectedCue()?.settings?.fontFamily || state.defaults.fontFamily);
    updateStaticText();
    renderInlineStyleEditor();
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


  function normalizeInlineStyle(style) {
    if (!style || typeof style !== "object") return null;
    return {
      id: style.id || uniqueId("inline_style"),
      targets: String(style.targets || ""),
      fontFamily: style.fontFamily || FONT_OPTIONS[1].value,
      color: style.color || "#ffffff",
      fontSize: Math.round(clamp(style.fontSize ?? 86, 10, 300)),
      strokeColor: style.strokeColor || "#111827",
      strokeWidth: Math.round(clamp(style.strokeWidth ?? 0, 0, 40)),
      shadowColor: style.shadowColor || "#000000",
      shadowBlur: Math.round(clamp(style.shadowBlur ?? 0, 0, 120))
    };
  }

  function ensureCueInlineStyles(cue) {
    if (!cue) return [];
    cue.settings = cue.settings || createCueStyle();
    cue.settings.inlineStyles = safeArray(cue.settings.inlineStyles).map(normalizeInlineStyle).filter(Boolean);
    return cue.settings.inlineStyles;
  }

  function splitInlineTargets(value) {
    return String(value || "")
      .split(/[,、，]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function fontStringForSettings(settings) {
    return `700 ${Math.max(1, settings.fontSize || 86)}px ${settings.fontFamily || FONT_OPTIONS[1].value}`;
  }

  function mergeInlineSettings(settings, inlineStyle) {
    if (!inlineStyle) return settings;
    return {
      ...settings,
      fontFamily: inlineStyle.fontFamily || settings.fontFamily,
      color: inlineStyle.color || settings.color,
      fontSize: Math.round(clamp(inlineStyle.fontSize ?? settings.fontSize ?? 86, 10, 300)),
      stroke: {
        ...(settings.stroke || {}),
        enabled: Number(inlineStyle.strokeWidth ?? settings.stroke?.width ?? 0) > 0,
        color: inlineStyle.strokeColor || settings.stroke?.color || "#111827",
        width: Math.round(clamp(inlineStyle.strokeWidth ?? settings.stroke?.width ?? 0, 0, 40))
      },
      shadow: {
        ...(settings.shadow || {}),
        enabled: Number(inlineStyle.shadowBlur ?? settings.shadow?.blur ?? 0) > 0,
        color: inlineStyle.shadowColor || settings.shadow?.color || "#000000",
        blur: Math.round(clamp(inlineStyle.shadowBlur ?? settings.shadow?.blur ?? 0, 0, 120)),
        offsetX: settings.shadow?.offsetX || 0,
        offsetY: settings.shadow?.offsetY || 0
      }
    };
  }

  function inlineStyleMapForText(text, settings) {
    const chars = splitChars(text);
    const map = Array(chars.length).fill(null);
    const inlineStyles = safeArray(settings?.inlineStyles).map(normalizeInlineStyle).filter(Boolean);
    if (!chars.length || !inlineStyles.length) return map;

    inlineStyles.forEach((style) => {
      splitInlineTargets(style.targets).forEach((target) => {
        const targetChars = splitChars(target);
        if (!targetChars.length || targetChars.length > chars.length) return;
        for (let i = 0; i <= chars.length - targetChars.length; i += 1) {
          let matched = true;
          for (let j = 0; j < targetChars.length; j += 1) {
            if (chars[i + j] !== targetChars[j]) {
              matched = false;
              break;
            }
          }
          if (matched) {
            for (let j = 0; j < targetChars.length; j += 1) {
              map[i + j] = style;
            }
          }
        }
      });
    });
    return map;
  }

  function renderInlineStyleEditor() {
    if (!inlineStyleList) return;
    const cue = selectedCue();
    inlineStyleList.innerHTML = "";
    if (!cue) return;
    const inlineStyles = ensureCueInlineStyles(cue);
    if (!inlineStyles.length) {
      const empty = document.createElement("div");
      empty.className = "inline-style-empty";
      empty.textContent = t("inlineStyleEmpty");
      inlineStyleList.append(empty);
      return;
    }

    inlineStyles.forEach((style, index) => {
      const item = document.createElement("div");
      item.className = "inline-style-item";
      item.dataset.id = style.id;
      item.innerHTML = `
        <div class="inline-style-item-head">
          <span class="inline-style-item-title">${t("inlineStyleItem", { number: index + 1 })}</span>
          <button type="button" class="danger mini-button inline-style-delete">${t("delete")}</button>
        </div>
        <label class="field">
          <span>${t("inlineStyleTargets")}</span>
          <input class="inline-style-targets" type="text" value="" placeholder="${t("inlineStyleTargetsPlaceholder")}" />
        </label>
        <div class="grid-2">
          <label class="field">
            <span>${t("inlineStyleFont")}</span>
            <select class="inline-style-font"></select>
          </label>
          <label class="field">
            <span>${t("inlineStyleColor")}</span>
            <input class="inline-style-color" type="color" value="${style.color || "#ffffff"}" />
          </label>
        </div>
        <div class="range-field">
          <div class="range-head"><span>${t("inlineStyleSize")}</span><output class="inline-style-size-output">${Math.round(style.fontSize || 86)}px</output></div>
          <input class="inline-style-size" type="range" min="10" max="300" step="1" value="${Math.round(clamp(style.fontSize || 86, 10, 300))}" />
        </div>
        <div class="grid-2">
          <label class="field">
            <span>${t("inlineStyleStrokeColor")}</span>
            <input class="inline-style-stroke-color" type="color" value="${style.strokeColor || "#111827"}" />
          </label>
          <div class="range-field compact-range-field">
            <div class="range-head"><span>${t("inlineStyleStrokeWidth")}</span><output class="inline-style-stroke-width-output">${Math.round(style.strokeWidth || 0)}px</output></div>
            <input class="inline-style-stroke-width" type="range" min="0" max="40" step="1" value="${Math.round(clamp(style.strokeWidth || 0, 0, 40))}" />
          </div>
        </div>
        <div class="grid-2">
          <label class="field">
            <span>${t("inlineStyleShadowColor")}</span>
            <input class="inline-style-shadow-color" type="color" value="${style.shadowColor || "#000000"}" />
          </label>
          <div class="range-field compact-range-field">
            <div class="range-head"><span>${t("inlineStyleShadowBlur")}</span><output class="inline-style-shadow-blur-output">${Math.round(style.shadowBlur || 0)}px</output></div>
            <input class="inline-style-shadow-blur" type="range" min="0" max="120" step="1" value="${Math.round(clamp(style.shadowBlur || 0, 0, 120))}" />
          </div>
        </div>
      `;
      const targetsInput = item.querySelector(".inline-style-targets");
      targetsInput.value = style.targets || "";
      const fontSelect = item.querySelector(".inline-style-font");
      populateFontSelect(fontSelect);
      fontSelect.value = style.fontFamily || cue.settings.fontFamily || state.defaults.fontFamily;
      const colorInput = item.querySelector(".inline-style-color");
      const sizeInput = item.querySelector(".inline-style-size");
      const sizeOutput = item.querySelector(".inline-style-size-output");
      const strokeColorInput = item.querySelector(".inline-style-stroke-color");
      const strokeWidthInput = item.querySelector(".inline-style-stroke-width");
      const strokeWidthOutput = item.querySelector(".inline-style-stroke-width-output");
      const shadowColorInput = item.querySelector(".inline-style-shadow-color");
      const shadowBlurInput = item.querySelector(".inline-style-shadow-blur");
      const shadowBlurOutput = item.querySelector(".inline-style-shadow-blur-output");
      const updateStyle = () => {
        const targetStyle = ensureCueInlineStyles(cue).find((entry) => entry.id === style.id);
        if (!targetStyle) return;
        targetStyle.targets = targetsInput.value;
        targetStyle.fontFamily = fontSelect.value || cue.settings.fontFamily || state.defaults.fontFamily;
        targetStyle.color = colorInput.value || "#ffffff";
        targetStyle.fontSize = Math.round(clamp(sizeInput.value, 10, 300));
        targetStyle.strokeColor = strokeColorInput.value || "#111827";
        targetStyle.strokeWidth = Math.round(clamp(strokeWidthInput.value, 0, 40));
        targetStyle.shadowColor = shadowColorInput.value || "#000000";
        targetStyle.shadowBlur = Math.round(clamp(shadowBlurInput.value, 0, 120));
        sizeOutput.textContent = `${targetStyle.fontSize}px`;
        strokeWidthOutput.textContent = `${targetStyle.strokeWidth}px`;
        shadowBlurOutput.textContent = `${targetStyle.shadowBlur}px`;
        renderCurrentPreview();
      };
      targetsInput.addEventListener("input", updateStyle);
      fontSelect.addEventListener("input", updateStyle);
      colorInput.addEventListener("input", updateStyle);
      sizeInput.addEventListener("input", updateStyle);
      strokeColorInput.addEventListener("input", updateStyle);
      strokeWidthInput.addEventListener("input", updateStyle);
      shadowColorInput.addEventListener("input", updateStyle);
      shadowBlurInput.addEventListener("input", updateStyle);
      item.querySelector(".inline-style-delete").addEventListener("click", () => {
        cue.settings.inlineStyles = ensureCueInlineStyles(cue).filter((entry) => entry.id !== style.id);
        renderInlineStyleEditor();
        renderCurrentPreview();
      });
      inlineStyleList.append(item);
    });
  }

  function addInlineStyleToSelectedCue() {
    const cue = selectedCue();
    if (!cue) return;
    const inlineStyles = ensureCueInlineStyles(cue);
    const settings = cue.settings || createCueStyle();
    inlineStyles.push(normalizeInlineStyle({
      id: uniqueId("inline_style"),
      targets: "",
      fontFamily: settings.fontFamily || state.defaults.fontFamily,
      color: settings.color || "#ffffff",
      fontSize: settings.fontSize || state.defaults.fontSize,
      strokeColor: settings.stroke?.color || "#111827",
      strokeWidth: settings.stroke?.width || 0,
      shadowColor: settings.shadow?.color || "#000000",
      shadowBlur: settings.shadow?.blur || 0
    }));
    cue.settings.inlineStyles = inlineStyles;
    renderInlineStyleEditor();
    renderCurrentPreview();
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
        inlineStyles: safeArray(settings.inlineStyles).map(normalizeInlineStyle).filter(Boolean),
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
      inlineStyles: safeArray(style.inlineStyles).map(normalizeInlineStyle).filter(Boolean),
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
    fontOptions().forEach((font) => {
      const option = document.createElement("option");
      option.value = font.value;
      option.textContent = currentLang() === "ko" ? (font.labelKo || font.labelEn || font.label) : (currentLang() === "en" ? (font.labelEn || font.label) : font.label);
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
    next.inlineStyles = safeArray(template.inlineStyles).map(normalizeInlineStyle).filter(Boolean);
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

  function getLyricByCueId(cueId) {
    return state.lyrics.find((lyric) => lyric.cueId === cueId) || null;
  }

  function sortCues() {
    state.cues.sort((a, b) => a.start - b.start || a.end - b.end);
  }

  function syncDefaultControls() {
    if (canvasAspectSelect) canvasAspectSelect.value = state.canvasAspect || "16:9";
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
    previewBgOffsetXInput.value = String(clamp(state.previewBackgroundOffsetX ?? 0, -CANVAS_WIDTH, CANVAS_WIDTH));
    previewBgOffsetXOutput.textContent = `${previewBgOffsetXInput.value}px`;
    previewBgOffsetYInput.value = String(clamp(state.previewBackgroundOffsetY ?? 0, -CANVAS_HEIGHT, CANVAS_HEIGHT));
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

  function parseLyricsText(text) {
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

  function assignLyricAtCurrentTime(lyric) {
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

  function unassignLyric(lyric) {
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

  function renderLyricButtons() {
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
          unassignLyric(lyric);
        } else {
          assignLyricAtCurrentTime(lyric);
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
      if (inlineStyleList) inlineStyleList.innerHTML = "";
      suppressEditorEvents = false;
      return;
    }

    selectedEmptyMessage.classList.add("hidden");
    cueEditor.classList.remove("hidden");

    const s = cue.settings || createCueStyle();
    cue.settings = s;
    s.inlineStyles = safeArray(s.inlineStyles).map(normalizeInlineStyle).filter(Boolean);

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
    cuePanXInput.value = String(clamp(s.panX ?? 0, -CANVAS_WIDTH, CANVAS_WIDTH));
    cuePanYInput.value = String(clamp(s.panY ?? 0, -CANVAS_HEIGHT, CANVAS_HEIGHT));
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
    renderInlineStyleEditor();
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
    s.inlineStyles = safeArray(s.inlineStyles).map(normalizeInlineStyle).filter(Boolean);
    s.letterSpacing = Math.round(clamp(cueLetterSpacingInput.value, -20, 120));
    s.letterSpacingPan = Math.round(clamp(cueLetterSpacingPanInput.value, -120, 120));
    s.panX = Math.round(clamp(cuePanXInput.value, -CANVAS_WIDTH, CANVAS_WIDTH));
    s.panY = Math.round(clamp(cuePanYInput.value, -CANVAS_HEIGHT, CANVAS_HEIGHT));
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

    const linkedLyric = state.lyrics.find((lyric) => lyric.id === cue.lyricId);
    if (linkedLyric) linkedLyric.text = cue.text;

    sortCues();
    updateRangeOutputs();
    renderLyricButtons();
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
    if (!state.cues.length) return;

    state.cues.forEach((cue) => {
      const old = cue.settings || createCueStyle();
      cue.settings = {
        ...old,
        fontFamily: state.defaults.fontFamily || old.fontFamily,
        fontSize: clamp(state.defaults.fontSize, 10, 300),
        animation: state.defaults.animation || old.animation,
        align: state.defaults.align || old.align,
        stroke: clone(old.stroke || defaultStyle().stroke),
        shadow: clone(old.shadow || defaultStyle().shadow)
      };
    });

    syncCueEditor();
    renderCueList();
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
    const value = String(text || "");
    if (window.Intl && typeof Intl.Segmenter === "function") {
      const locale = currentLang() === "ko" ? "ko" : (currentLang() === "en" ? "en" : "ja");
      const segmenter = new Intl.Segmenter(locale, { granularity: "grapheme" });
      return Array.from(segmenter.segment(value), (item) => item.segment);
    }
    return Array.from(value);
  }

  function visibleTextByCount(text, count) {
    const chars = splitChars(text);
    return chars.slice(0, Math.max(0, count)).join("");
  }

  function measureTextWidth(context, text, letterSpacing = 0, settings = null) {
    const chars = splitChars(text);
    if (!chars.length) return 0;
    if (!settings || !safeArray(settings.inlineStyles).length) {
      return chars.reduce((sum, char) => sum + context.measureText(char).width, 0) + Math.max(0, chars.length - 1) * letterSpacing;
    }

    const previousFont = context.font;
    const inlineMap = inlineStyleMapForText(text, settings);
    let width = 0;
    chars.forEach((char, index) => {
      const charSettings = mergeInlineSettings(settings, inlineMap[index]);
      context.font = fontStringForSettings(charSettings);
      width += context.measureText(char).width;
      if (index < chars.length - 1) width += Number(letterSpacing || 0);
    });
    context.font = previousFont;
    return width;
  }

  function wrapTextLines(context, text, maxWidth, letterSpacing = 0, settings = null) {
    const sourceLines = String(text || "").split(/\n/);
    const lines = [];

    sourceLines.forEach((sourceLine) => {
      const chars = splitChars(sourceLine);
      let line = "";

      chars.forEach((char) => {
        const testLine = line + char;
        if (line && measureTextWidth(context, testLine, letterSpacing, settings) > maxWidth) {
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

  function applyTextPaint(context, settings) {
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
    context.font = fontStringForSettings(settings);
  }

  function clearTextShadow(context) {
    context.shadowColor = "transparent";
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
  }

  function hasVisibleShadow(settings) {
    const shadow = settings?.shadow || {};
    return Boolean(shadow.enabled) && (
      Number(shadow.blur || 0) > 0 ||
      Number(shadow.offsetX || 0) !== 0 ||
      Number(shadow.offsetY || 0) !== 0
    );
  }

  function drawStyledTextLayer(context, text, x, y, settings, letterSpacing = 0, layer = "fill") {
    if (!text) return;

    context.save();
    context.textAlign = "left";
    context.lineJoin = "round";
    context.miterLimit = 2;

    const chars = splitChars(text);
    const inlineMap = inlineStyleMapForText(text, settings);
    let cursorX = x;

    chars.forEach((char, index) => {
      const charSettings = mergeInlineSettings(settings, inlineMap[index]);
      context.font = fontStringForSettings(charSettings);
      const charWidth = context.measureText(char).width;

      if (layer === "shadow") {
        if (hasVisibleShadow(charSettings)) {
          const shadow = charSettings.shadow || {};
          context.shadowColor = shadow.color || "#000000";
          context.shadowBlur = Number(shadow.blur || 0);
          context.shadowOffsetX = Number(shadow.offsetX || 0);
          context.shadowOffsetY = Number(shadow.offsetY || 0);
          context.fillStyle = shadow.color || "#000000";
          context.fillText(char, cursorX, y);
        }
      } else if (layer === "stroke") {
        clearTextShadow(context);
        if (charSettings.stroke?.enabled && Number(charSettings.stroke.width) > 0) {
          context.strokeStyle = charSettings.stroke.color || "#111827";
          context.lineWidth = Number(charSettings.stroke.width) || 0;
          context.strokeText(char, cursorX, y);
        }
      } else {
        clearTextShadow(context);
        context.fillStyle = charSettings.color || "#ffffff";
        context.fillText(char, cursorX, y);
      }

      cursorX += charWidth + Number(letterSpacing || 0);
    });

    context.restore();
  }


  function drawSingleCharLayer(context, char, x, y, settings, layer = "fill") {
    if (!char) return;
    context.save();
    context.textAlign = "left";
    context.textBaseline = "alphabetic";
    context.lineJoin = "round";
    context.miterLimit = 2;
    context.font = fontStringForSettings(settings);

    if (layer === "shadow") {
      if (hasVisibleShadow(settings)) {
        const shadow = settings.shadow || {};
        context.shadowColor = shadow.color || "#000000";
        context.shadowBlur = Number(shadow.blur || 0);
        context.shadowOffsetX = Number(shadow.offsetX || 0);
        context.shadowOffsetY = Number(shadow.offsetY || 0);
        context.fillStyle = shadow.color || "#000000";
        context.fillText(char, x, y);
      }
    } else if (layer === "stroke") {
      clearTextShadow(context);
      if (settings.stroke?.enabled && Number(settings.stroke.width) > 0) {
        context.strokeStyle = settings.stroke.color || "#111827";
        context.lineWidth = Number(settings.stroke.width) || 0;
        context.strokeText(char, x, y);
      }
    } else {
      clearTextShadow(context);
      context.fillStyle = settings.color || "#ffffff";
      context.fillText(char, x, y);
    }

    context.restore();
  }



  function paintSingleGlyphLayer(context, char, x, y, settings, layer = "fill") {
    context.textAlign = "left";
    context.textBaseline = "alphabetic";
    context.lineJoin = "round";
    context.miterLimit = 2;
    context.font = fontStringForSettings(settings);

    if (layer === "shadow") {
      if (!hasVisibleShadow(settings)) return;
      const shadow = settings.shadow || {};
      context.shadowColor = shadow.color || "#000000";
      context.shadowBlur = Number(shadow.blur || 0);
      context.shadowOffsetX = Number(shadow.offsetX || 0);
      context.shadowOffsetY = Number(shadow.offsetY || 0);
      context.fillStyle = shadow.color || "#000000";
      context.fillText(char, x, y);
      return;
    }

    clearTextShadow(context);
    if (layer === "stroke") {
      if (settings.stroke?.enabled && Number(settings.stroke.width) > 0) {
        context.strokeStyle = settings.stroke.color || "#111827";
        context.lineWidth = Number(settings.stroke.width) || 0;
        context.strokeText(char, x, y);
      }
      return;
    }

    context.fillStyle = settings.color || "#ffffff";
    context.fillText(char, x, y);
  }

  function drawScaleRevealGlyphLayer(context, plan, layer) {
    const alpha = clamp(plan.alpha ?? 1, 0, 1);
    if (alpha <= 0) return;

    const previousAlpha = context.globalAlpha;
    context.save();
    context.globalAlpha = previousAlpha * alpha;
    context.translate(plan.centerX, plan.baselineY);
    context.scale(plan.scale, plan.scale);
    paintSingleGlyphLayer(context, plan.char, -plan.width / 2, 0, plan.settings, layer);
    context.restore();
    context.globalAlpha = previousAlpha;
  }

  function drawStyledText(context, text, x, y, settings, letterSpacing = 0) {
    // Shadow is always rendered first as the bottom-most layer.
    // This prevents a later character's shadow from covering another character's stroke/fill.
    drawStyledTextLayer(context, text, x, y, settings, letterSpacing, "shadow");
    drawStyledTextLayer(context, text, x, y, settings, letterSpacing, "stroke");
    drawStyledTextLayer(context, text, x, y, settings, letterSpacing, "fill");
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
    context.font = fontStringForSettings(settings);
    context.textBaseline = "alphabetic";

    const maxWidth = Math.max(100, settings.maxWidth || 1580);
    const lines = wrapTextLines(context, text, maxWidth, letterSpacing, settings);
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
      const lineWidth = measureTextWidth(context, line, letterSpacing, settings);
      let xLine = 0;
      if (settings.align === "center") xLine -= lineWidth / 2;
      if (settings.align === "right") xLine -= lineWidth;

      const shouldDrawChars = ["jumpTypewriter", "jumpReveal", "jumpInOut", "scaleReveal"].includes(settings.animation);

      if (shouldDrawChars) {
        const chars = splitChars(line);
        const inlineMap = inlineStyleMapForText(line, settings);

        if (settings.animation === "scaleReveal") {
          const revealSpeed = Math.max(1, settings.scaleRevealSpeed ?? settings.cps ?? 24);
          const minScale = clamp(settings.scaleRevealMin ?? 18, 1, 100) / 100;
          let cursorX = xLine;
          const plans = [];

          chars.forEach((char, charIndexInLine) => {
            const charSettings = mergeInlineSettings(settings, inlineMap[charIndexInLine]);
            context.font = fontStringForSettings(charSettings);
            const charWidth = context.measureText(char).width;
            const localProgress = elapsed * revealSpeed - globalCharIndex;

            if (localProgress >= 0) {
              const revealProgress = easeOutCubic(clamp(localProgress, 0, 1));
              plans.push({
                char,
                settings: charSettings,
                width: charWidth,
                centerX: cursorX + charWidth / 2,
                baselineY: yLine,
                scale: minScale + (1 - minScale) * revealProgress,
                alpha: revealProgress
              });
            }

            cursorX += charWidth + letterSpacing;
            globalCharIndex += 1;
          });

          // Rebuild this animation from scratch:
          // 1) decide every glyph's final position first
          // 2) render all shadows at the bottom
          // 3) render all strokes
          // 4) render all fills
          // This prevents shadows from covering other glyphs and prevents glyphs from collapsing into one point.
          ["shadow", "stroke", "fill"].forEach((layer) => {
            plans.forEach((plan) => drawScaleRevealGlyphLayer(context, plan, layer));
          });
        } else {
          let cursorX = xLine;
          let hasJumpInOutMotion = false;
          const charDraws = [];

          chars.forEach((char, charIndexInLine) => {
            const charSettings = mergeInlineSettings(settings, inlineMap[charIndexInLine]);
            context.font = fontStringForSettings(charSettings);
            const charWidth = context.measureText(char).width;
            let wavePower = 0;

            if (settings.animation === "jumpInOut") {
              wavePower = jumpInOutPowerForChar(globalCharIndex);
              hasJumpInOutMotion = hasJumpInOutMotion || wavePower > 0.001;
            } else {
              wavePower = Math.abs(Math.sin(elapsed * (settings.jumpSpeed || 8) + globalCharIndex * 0.65));
            }

            charDraws.push({
              char,
              settings: charSettings,
              x: cursorX,
              y: yLine - wavePower * (settings.jumpSize || 0),
              alpha: 1
            });

            cursorX += charWidth + letterSpacing;
            globalCharIndex += 1;
          });

          const drawCharLayer = (entry, layer) => {
            const prevAlpha = context.globalAlpha;
            context.save();
            context.globalAlpha = prevAlpha * clamp(entry.alpha ?? 1, 0, 1);
            paintSingleGlyphLayer(context, entry.char, entry.x, entry.y, entry.settings, layer);
            context.restore();
            context.globalAlpha = prevAlpha;
          };

          ["shadow", "stroke", "fill"].forEach((layer) => {
            charDraws.forEach((entry) => drawCharLayer(entry, layer));
          });

          if (settings.animation === "jumpInOut" && !hasJumpInOutMotion) {
            // Keep the same per-character drawing path even while still,
            // so this animation never falls back to whole-line jumping.
          }
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
        activeCueInfo.textContent = t("noActiveLyrics");
      }
    }
  }

  function renderCurrentPreview() {
    renderFrame(Number(previewTimeInput.value) || 0, { includePreviewBackground: true });
  }

  function renderAll() {
    renderLyricButtons();
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
    await registerAllCustomFonts();
    populateFontSelect(defaultFontFamilyInput);
    populateFontSelect(cueFontFamilyInput);
    renderCustomFontControls();
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
      uiLanguage: ["ja", "en", "ko"].includes(project.uiLanguage) ? project.uiLanguage : next.uiLanguage,
      canvasAspect: project.canvasAspect === "9:16" ? "9:16" : "16:9",
      customFonts: Array.isArray(project.customFonts) ? project.customFonts : [],
      previewBackgroundScale: clamp(project.previewBackgroundScale ?? next.previewBackgroundScale, 1, 100),
      previewBackgroundOffsetX: project.previewBackgroundOffsetX ?? next.previewBackgroundOffsetX,
      previewBackgroundOffsetY: project.previewBackgroundOffsetY ?? next.previewBackgroundOffsetY,
      defaults: { ...next.defaults, ...(project.defaults || {}) },
      presets: mergePresets(next.presets, project.presets),
      lyrics: Array.isArray(project.lyrics) ? project.lyrics : [],
      cues: Array.isArray(project.cues) ? project.cues : []
    };

    const projectSize = canvasSizeForAspect(state.canvasAspect);
    CANVAS_WIDTH = projectSize.width;
    CANVAS_HEIGHT = projectSize.height;
    updateCanvasControlRanges();
    state.previewBackgroundOffsetX = Math.round(clamp(state.previewBackgroundOffsetX ?? 0, -CANVAS_WIDTH, CANVAS_WIDTH));
    state.previewBackgroundOffsetY = Math.round(clamp(state.previewBackgroundOffsetY ?? 0, -CANVAS_HEIGHT, CANVAS_HEIGHT));

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
    renderInlineStyleEditor();
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
    if (document.fonts?.ready) await document.fonts.ready;

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
      state.lyrics = parseLyricsText(text);
      state.cues = [];
      state.selectedCueId = null;
      state.lastCreatedCueId = null;
      renderAll();
    });

    clearLyricsBtn.addEventListener("click", () => {
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
      state.previewBackgroundOffsetX = Math.round(clamp(previewBgOffsetXInput.value, -CANVAS_WIDTH, CANVAS_WIDTH));
      previewBgOffsetXOutput.textContent = `${state.previewBackgroundOffsetX}px`;
      renderCurrentPreview();
    });

    previewBgOffsetYInput.addEventListener("input", () => {
      state.previewBackgroundOffsetY = Math.round(clamp(previewBgOffsetYInput.value, -CANVAS_HEIGHT, CANVAS_HEIGHT));
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

    canvasAspectSelect?.addEventListener("change", () => {
      applyCanvasAspect(canvasAspectSelect.value, { scaleExisting: true });
    });

    customFontInput?.addEventListener("change", async () => {
      const file = customFontInput.files?.[0];
      if (!file) return;
      const ok = /\.(ttf|otf|woff2?|TTF|OTF|WOFF2?)$/.test(file.name) || /^font\//.test(file.type || "");
      if (!ok) {
        alert(t("customFontLoadFailed"));
        customFontInput.value = "";
        return;
      }
      try {
        const dataUrl = await fileToDataUrl(file);
        const font = {
          id: uniqueId("font"),
          name: file.name.replace(/\.[^.]+$/, ""),
          familyName: sanitizeFontFamilyName(file.name),
          dataUrl,
          mimeType: file.type || "font/unknown",
          createdAt: Date.now()
        };
        await registerCustomFont(font);
        state.customFonts.push(font);
        updateFileChoiceStatus(customFontChosenLabel, file.name);
        populateFontSelect(defaultFontFamilyInput);
        populateFontSelect(cueFontFamilyInput);
        renderCustomFontControls();
        renderInlineStyleEditor();
        alert(t("customFontLoaded", { name: font.name }));
      } catch (error) {
        console.error(error);
        alert(t("customFontLoadFailed"));
      } finally {
        customFontInput.value = "";
      }
    });

    customFontSelect?.addEventListener("change", renderCustomFontControls);

    deleteCustomFontBtn?.addEventListener("click", () => {
      const id = customFontSelect.value;
      if (!id) return;
      const target = state.customFonts.find((font) => font.id === id);
      state.customFonts = state.customFonts.filter((font) => font.id !== id);
      const targetValue = target ? `"${target.familyName}", sans-serif` : "";
      if (state.defaults.fontFamily === targetValue) state.defaults.fontFamily = FONT_OPTIONS[1].value;
      state.cues.forEach((cue) => {
        if (cue.settings?.fontFamily === targetValue) cue.settings.fontFamily = FONT_OPTIONS[1].value;
        safeArray(cue.settings?.inlineStyles).forEach((style) => {
          if (style.fontFamily === targetValue) style.fontFamily = FONT_OPTIONS[1].value;
        });
      });
      populateFontSelect(defaultFontFamilyInput);
      populateFontSelect(cueFontFamilyInput);
      syncDefaultControls();
      syncCueEditor();
      renderCustomFontControls();
      renderCurrentPreview();
    });

    [defaultFontFamilyInput, defaultFontSizeInput, defaultDurationInput, defaultAnimationInput, defaultAlignInput, autoChainSelect]
      .forEach((input) => input.addEventListener("input", updateDefaultStateFromControls));

    applyDefaultToSelectedBtn.addEventListener("click", applyDefaultsToSelected);
    addInlineStyleBtn?.addEventListener("click", addInlineStyleToSelectedCue);

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
    updateCanvasControlRanges();
    populateFontSelect(defaultFontFamilyInput);
    populateFontSelect(cueFontFamilyInput);
    renderCustomFontControls();
    syncDefaultControls();
    syncPreviewBackgroundControls();
    bindEvents();
    applyLanguage(state.uiLanguage);
    requestAnimationFrame(resizePreviewViewport);
  }

  init();
})();
