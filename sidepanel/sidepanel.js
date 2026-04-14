// sidepanel/sidepanel.js — Side Panel logic

const STATUS_ICONS = {
  pending: '',
  running: '',
  completed: '\u2713',  // ✓
  skipped: '\u00BB',    // »
  failed: '\u2717',     // ✗
  stopped: '\u25A0',    // ■
};
const WORKFLOW_STEPS = [1, 2, 3, 4, 5, 6, 7];
const TOTAL_STEPS = WORKFLOW_STEPS.length;

const logArea = document.getElementById('log-area');
const displayOauthUrl = document.getElementById('display-oauth-url');
const displayLocalhostUrl = document.getElementById('display-localhost-url');
const displayStatus = document.getElementById('display-status');
const statusBar = document.getElementById('status-bar');
const appTitle = document.getElementById('app-title');
const btnVersion = document.getElementById('btn-version');
const displayVersion = document.getElementById('display-version');
const displayElapsed = document.getElementById('display-elapsed');
const displayAverageDuration = document.getElementById('display-average-duration');
const displaySuccessRate = document.getElementById('display-success-rate');
const checkboxDeleteBlockedAccount = document.getElementById('checkbox-delete-blocked-account');
const rowMailProvider = document.getElementById('row-mail-provider');
const inputEmail = document.getElementById('input-email');
const inputPassword = document.getElementById('input-password');
const btnFetchEmail = document.getElementById('btn-fetch-email');
const btnCopyEmail = document.getElementById('btn-copy-email');
const btnTogglePassword = document.getElementById('btn-toggle-password');
const btnCopyPassword = document.getElementById('btn-copy-password');
const btnStop = document.getElementById('btn-stop');
const btnReset = document.getElementById('btn-reset');
const btnLanguage = document.getElementById('btn-language');
const displayLanguageToggle = document.getElementById('display-language-toggle');
const btnAutoRunLabel = document.getElementById('btn-auto-run-label');
const stepsProgress = document.getElementById('steps-progress');
const runWindowOverlay = document.getElementById('run-window-overlay');
const runWindowBackdrop = document.getElementById('run-window-backdrop');
const btnWindowStop = document.getElementById('btn-window-stop');
const runWindowStepsProgress = document.getElementById('run-window-steps-progress');
const runWindowStepsList = document.getElementById('run-window-steps-list');
const runWindowLogArea = document.getElementById('run-window-log-area');
const runWindowToastContainer = document.getElementById('run-window-toast-container');
const quickstartKicker = document.getElementById('quickstart-kicker');
const quickstartTitle = document.getElementById('quickstart-title');
const quickstartHint = document.getElementById('quickstart-hint');
const quickstartOauthState = document.getElementById('quickstart-oauth-state');
const quickstartOauthNote = document.getElementById('quickstart-oauth-note');
const quickstartVerifyState = document.getElementById('quickstart-verify-state');
const quickstartVerifyNote = document.getElementById('quickstart-verify-note');
const quickstartIdentityState = document.getElementById('quickstart-identity-state');
const quickstartIdentityNote = document.getElementById('quickstart-identity-note');
const assistSection = document.getElementById('assist-section');
const assistKicker = document.getElementById('assist-kicker');
const assistTitle = document.getElementById('assist-title');
const assistMessage = document.getElementById('assist-message');
const btnAssistPrimary = document.getElementById('btn-assist-primary');
const btnAssistSecondary = document.getElementById('btn-assist-secondary');
const btnAssistDismiss = document.getElementById('btn-assist-dismiss');
const btnAutoRun = document.getElementById('btn-auto-run');
const btnAutoContinue = document.getElementById('btn-auto-continue');
const autoContinueBar = document.getElementById('auto-continue-bar');
const btnClearLog = document.getElementById('btn-clear-log');
const btnExpand = document.getElementById('btn-expand');
const btnFooterHelp = document.getElementById('btn-footer-help');
const docsWindowOverlay = document.getElementById('docs-window-overlay');
const docsWindowBackdrop = document.getElementById('docs-window-backdrop');
const btnDocsClose = document.getElementById('btn-docs-close');
const selectOauthProvider = document.getElementById('select-oauth-provider');
const rowCpaAuthUrl = document.getElementById('row-cpa-auth-url');
const inputVpsUrl = document.getElementById('input-vps-url');
const btnPasteVpsUrl = document.getElementById('btn-paste-vps-url');
const rowCpaAuthKey = document.getElementById('row-cpa-auth-key');
const inputCpaManagementKey = document.getElementById('input-cpa-management-key');
const rowSub2apiBaseUrl = document.getElementById('row-sub2api-base-url');
const inputSub2apiBaseUrl = document.getElementById('input-sub2api-base-url');
const rowSub2apiApiKey = document.getElementById('row-sub2api-api-key');
const inputSub2apiApiKey = document.getElementById('input-sub2api-api-key');
const messageCpaAuthUrl = document.getElementById('message-cpa-auth-url');
const messageSub2apiBaseUrl = document.getElementById('message-sub2api-base-url');
const btnTestOauth = document.getElementById('btn-test-oauth');
const oauthTestResult = document.getElementById('oauth-test-result');
const selectMailProvider = document.getElementById('select-mail-provider');
const rowMicrosoftManagerUrl = document.getElementById('row-microsoft-manager-url');
const inputMicrosoftManagerUrl = document.getElementById('input-microsoft-manager-url');
const rowMicrosoftManagerToken = document.getElementById('row-microsoft-manager-token');
const inputMicrosoftManagerToken = document.getElementById('input-microsoft-manager-token');
const rowMicrosoftManagerMode = document.getElementById('row-microsoft-manager-mode');
const selectMicrosoftManagerMode = document.getElementById('select-microsoft-manager-mode');
const rowMicrosoftManagerKeyword = document.getElementById('row-microsoft-manager-keyword');
const inputMicrosoftManagerKeyword = document.getElementById('input-microsoft-manager-keyword');
const rowMicrosoftManagerAliasToggle = document.getElementById('row-microsoft-manager-alias-toggle');
const checkboxMicrosoftManagerUseAliases = document.getElementById('checkbox-microsoft-manager-use-aliases');
const messageMicrosoftManagerUrl = document.getElementById('message-microsoft-manager-url');
const messageMicrosoftManagerToken = document.getElementById('message-microsoft-manager-token');
const messageMicrosoftManagerMode = document.getElementById('message-microsoft-manager-mode');
const btnTestVerify = document.getElementById('btn-test-verify');
const verifyTestResult = document.getElementById('verify-test-result');
const inputRunCount = document.getElementById('input-run-count');
const autoHint = document.getElementById('auto-hint');
const fieldHoverCard = document.getElementById('field-hover-card');
const fieldHoverCardTitle = document.getElementById('field-hover-card-title');
const fieldHoverCardDescription = document.getElementById('field-hover-card-description');
const fieldHoverCardReference = document.getElementById('field-hover-card-reference');
const fieldHoverCardReferenceLabel = document.getElementById('field-hover-card-reference-label');
const fieldHoverCardLink = document.getElementById('field-hover-card-link');
const pageParams = new URLSearchParams(window.location.search);
const isStandaloneView = pageParams.get('view') === 'standalone';
const LANGUAGE_STORAGE_KEY = 'extzarzoor-language';
const LEGACY_LANGUAGE_STORAGE_KEY = 'zarzoor-language';
const LEGACY_LANGUAGE_STORAGE_KEY_2 = 'multipage-language';
const THEME_STORAGE_KEY = 'extzarzoor-theme';
const LEGACY_THEME_STORAGE_KEY = 'zarzoor-theme';
const LEGACY_THEME_STORAGE_KEY_2 = 'multipage-theme';
const ONBOARDING_DISMISS_KEY = 'extzarzoor-onboarding-dismissed';
let currentLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  || localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY)
  || localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY_2)
  || 'zh-CN';
let lastKnownState = null;
let runMetricsTicker = null;
let activeRunStartMs = 0;
let activeRunKey = '';
const completedRunDurationsMs = [];
const finishedRunKeys = new Set();
const successfulRunKeys = new Set();
const manifestInfo = chrome.runtime.getManifest();
const releaseRepo = '';
const hasReleaseRepo = Boolean(releaseRepo);
const currentManifestVersion = normalizeVersionValue(manifestInfo.version || '0.0.0');
const currentManifestVersionLabel = formatVersionLabel(currentManifestVersion);
let latestReleaseVersion = '';
let latestReleaseUrl = hasReleaseRepo ? `https://github.com/${releaseRepo}/releases` : '';
let hasNewRelease = false;
let isVersionCheckFinished = false;
let versionCheckInFlight = false;
let hasShownNewReleaseToast = false;
let runWindowCloseTimer = null;
let assistBannerMode = 'setup';
let assistRecoveryMessage = '';
let fieldHoverCardOpenTimer = null;
let fieldHoverCardCloseTimer = null;
let activeFieldHoverKey = '';
let activeFieldHoverTrigger = null;

document.documentElement.dataset.view = isStandaloneView ? 'standalone' : 'panel';

const settingsGroupState = Object.create(null);
const settingsGroupRefs = Array.from(document.querySelectorAll('[data-settings-group]')).reduce((acc, groupEl) => {
  const groupId = groupEl.dataset.settingsGroup;
  if (!groupId) return acc;
  acc[groupId] = {
    element: groupEl,
    toggle: groupEl.querySelector(`[data-settings-group-toggle="${groupId}"]`),
    body: groupEl.querySelector(`[data-settings-group-body="${groupId}"]`),
    status: groupEl.querySelector(`[data-settings-group-status="${groupId}"]`),
  };
  return acc;
}, {});

function normalizeMailProviderValue(rawValue) {
  void rawValue;
  return 'microsoft-manager';
}

// ============================================================
// Toast Notifications
// ============================================================

const toastContainer = document.getElementById('toast-container');

const TOAST_ICONS = {
  error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  warn: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
};

const I18N = {
  'zh-CN': {
    titleRunCount: '运行次数',
    titleAutoRun: '自动执行全部步骤',
    titleFetchEmail: '自动获取 Microsoft 账号',
    titleFetchEmailMicrosoftManager: '自动获取 Microsoft 账号',
    titleStop: '停止当前流程',
    titleReset: '重置全部步骤',
    titleTheme: '切换主题',
    titleExpand: '在新标签页打开全屏视图',
    titleVersionBadge: '点击查看版本更新',
    titleSkipStep: '跳过这一步',
    titleClearLog: '清空日志',
    brandSubtitle: 'OAuth 自动化工作台',
    footerTagline: '用于 Microsoft OAuth 自动化的操作台',
    labelCpaAuth: 'CPA Auth',
    labelOauthTarget: 'OAuth',
    labelLanguage: '语言',
    labelBlockedAccountPolicy: '封号处理',
    labelVerify: '验证',
    labelMicrosoftManager: 'MS 管理',
    labelToken: '令牌',
    labelMode: '模式',
    labelKeyword: '筛选',
    labelAliasPool: '别名池',
    labelCpaManagementKey: 'CPA Key',
    labelSub2api: 'Sub2API',
    labelSub2apiApiKey: 'API Key',
    labelEmail: '邮箱',
    labelPassword: '密码',
    labelOauth: 'OAuth',
    labelCallback: '回调',
    labelElapsed: '计时',
    labelAverageDuration: '平均用时',
    labelSuccessRate: '成功率',
    microsoftManagerEmailName: 'Microsoft 账号',
    blockedAccountPolicy: '邮箱被封 (AADSTS70000) 时删除账号；未勾选则跳过并换号',
    microsoftManagerUseAliases: '勾选后自动取号使用“主邮箱+别名邮箱”；不勾选仅使用主邮箱',
    mailProviderMicrosoftManager: 'Microsoft Account Manager API',
    microsoftManagerModeGraph: 'Graph',
    microsoftManagerModeImap: 'IMAP',
    oauthProviderCpaAuth: 'CPA Auth',
    oauthProviderSub2api: 'Sub2API',
    placeholderCpaAuth: 'http://ip:port 或 /management.html#/oauth',
    placeholderCpaManagementKey: '填写明文 Management Key（不要填 $2... 加密串）',
    placeholderSub2apiBaseUrl: 'https://你的-sub2api域名',
    placeholderSub2apiApiKey: '可留空；或填写 x-api-key / Bearer token',
    placeholderMicrosoftManagerUrl: 'https://你的-manager域名',
    placeholderMicrosoftManagerToken: '填写 MAIL_API_TOKEN',
    placeholderMicrosoftManagerKeyword: '可选关键词，用于筛选账号',
    placeholderEmailMicrosoftManager: '使用 Auto 获取 Microsoft 账号，或手动粘贴',
    placeholderPassword: '留空则自动生成',
    waiting: '等待中...',
    btnAuto: '自动',
    btnStop: '停止',
    btnContinue: '继续',
    btnCopy: '复制',
    btnPaste: '粘贴',
    btnClear: '清空',
    btnSkip: '跳过',
    btnShow: '显示',
    btnHide: '隐藏',
    sectionWorkflow: '流程',
    sectionConsole: '控制台',
    step1: '获取 OAuth 链接',
    step2: '打开注册页',
    step3: '填写邮箱 / 密码',
    step4: '获取注册验证码',
    step5: '填写姓名 / 生日',
    step6: 'OAuth 自动确认',
    step7: '回调验证 / 导入',
    statusRunning: ({ step }) => `第 ${step} 步执行中...`,
    statusFailed: ({ step }) => `第 ${step} 步失败`,
    statusStopped: ({ step }) => `第 ${step} 步已停止`,
    statusAllFinished: '全部步骤已完成',
    statusSkipped: ({ step }) => `第 ${step} 步已跳过`,
    statusDone: ({ step }) => `第 ${step} 步完成`,
    statusReady: '就绪',
    autoHintEmailMicrosoftManager: '使用 Auto 获取 Microsoft 账号邮箱，或手动粘贴后继续',
    autoHintError: '自动运行被错误中断。修复问题或跳过失败步骤后继续',
    fetchedEmail: ({ email }) => `已获取 ${email}`,
    autoFetchFailed: ({ message }) => `自动获取失败：${message}`,
    pleaseEnterEmailFirst: '请先粘贴邮箱地址或点击 Auto',
    skipFailed: ({ message }) => `跳过失败：${message}`,
    stepSkippedToast: ({ step }) => `第 ${step} 步已跳过`,
    stoppingFlow: '正在停止当前流程...',
    continueNeedEmail: '请先获取或粘贴邮箱地址',
    continueFailed: ({ message }) => `继续失败：${message}`,
    confirmReset: '要重置全部步骤和数据吗？',
    copiedValue: ({ label }) => `已复制${label}`,
    copiedValueFallback: ({ label }) => `已复制 ${label}`,
    copyFailed: ({ label, message }) => `${label}复制失败：${message}`,
    nothingToCopy: ({ label }) => `${label}为空，无法复制`,
    pastedCpaAuth: '已从剪贴板粘贴 CPA Auth 地址',
    pasteFailed: ({ message }) => `粘贴失败：${message}`,
    clipboardEmpty: '剪贴板为空',
    clipboardNoUsefulText: '剪贴板中没有可用内容',
    autoRunRunning: ({ runLabel }) => `运行中${runLabel}`,
    autoRunPaused: ({ runLabel }) => `已暂停${runLabel}`,
    autoRunInterrupted: ({ runLabel }) => `已中断${runLabel}`,
    versionChecking: '版本检查中...',
    versionTooltipLatest: ({ version }) => `当前已是最新版本 ${version}`,
    versionTooltipUpdateAvailable: ({ current, latest }) => `发现新版本 ${latest}（当前 ${current}），点击查看`,
    versionTooltipCheckFailed: '版本检查失败，点击查看 Releases',
    newVersionFound: ({ latest }) => `发现新版本 ${latest}，点击标题旁版本号查看`,
    languageToggleLabel: 'EN',
    languageToggleNextName: 'English',
    standaloneTitle: '全屏视图',
  },
  'en-US': {
    titleRunCount: 'Number of runs',
    titleAutoRun: 'Run all steps automatically',
    titleFetchEmail: 'Fetch a Microsoft account automatically',
    titleFetchEmailMicrosoftManager: 'Fetch a Microsoft account automatically',
    titleStop: 'Stop current flow',
    titleReset: 'Reset all steps',
    titleTheme: 'Toggle theme',
    titleExpand: 'Open full page view',
    titleVersionBadge: 'Click to view version updates',
    titleSkipStep: 'Skip this step',
    titleClearLog: 'Clear log',
    brandSubtitle: 'OAuth operator workspace',
    footerTagline: 'Operator workspace for Microsoft OAuth automation',
    labelCpaAuth: 'CPA Auth',
    labelOauthTarget: 'OAuth',
    labelLanguage: 'Language',
    labelBlockedAccountPolicy: 'Blocked Handling',
    labelVerify: 'Verify',
    labelMicrosoftManager: 'MSMgr',
    labelToken: 'Token',
    labelMode: 'Mode',
    labelKeyword: 'Filter',
    labelAliasPool: 'Alias Pool',
    labelCpaManagementKey: 'CPA Key',
    labelSub2api: 'Sub2API',
    labelSub2apiApiKey: 'API Key',
    labelEmail: 'Email',
    labelPassword: 'Password',
    labelOauth: 'OAuth',
    labelCallback: 'Callback',
    labelElapsed: 'Elapsed',
    labelAverageDuration: 'Avg Time',
    labelSuccessRate: 'Success Rate',
    microsoftManagerEmailName: 'Microsoft account',
    blockedAccountPolicy: 'On AADSTS70000: checked=delete account, unchecked=skip and switch to next',
    microsoftManagerUseAliases: 'Use primary + alias addresses when fetching emails automatically; if unchecked, only primary addresses are used',
    mailProviderMicrosoftManager: 'Microsoft Account Manager API',
    microsoftManagerModeGraph: 'Graph',
    microsoftManagerModeImap: 'IMAP',
    oauthProviderCpaAuth: 'CPA Auth',
    oauthProviderSub2api: 'Sub2API',
    placeholderCpaAuth: 'http://ip:port or /management.html#/oauth',
    placeholderCpaManagementKey: 'Plaintext management key (not $2... hash)',
    placeholderSub2apiBaseUrl: 'https://your-sub2api-host',
    placeholderSub2apiApiKey: 'Optional; use x-api-key or Bearer token',
    placeholderMicrosoftManagerUrl: 'https://your-manager-domain',
    placeholderMicrosoftManagerToken: 'Use MAIL_API_TOKEN',
    placeholderMicrosoftManagerKeyword: 'Optional keyword for account filter',
    placeholderEmailMicrosoftManager: 'Use Auto to fetch a Microsoft account, or paste manually',
    placeholderPassword: 'Leave blank to auto-generate',
    waiting: 'Waiting...',
    btnAuto: 'Auto',
    btnStop: 'Stop',
    btnContinue: 'Continue',
    btnCopy: 'Copy',
    btnPaste: 'Paste',
    btnClear: 'Clear',
    btnSkip: 'Skip',
    btnShow: 'Show',
    btnHide: 'Hide',
    sectionWorkflow: 'Workflow',
    sectionConsole: 'Console',
    step1: 'Get OAuth Link',
    step2: 'Open Signup',
    step3: 'Fill Email / Password',
    step4: 'Get Signup Code',
    step5: 'Fill Name / Birthday',
    step6: 'OAuth Auto Confirm',
    step7: 'Callback Verify / Import',
    statusRunning: ({ step }) => `Step ${step} running...`,
    statusFailed: ({ step }) => `Step ${step} failed`,
    statusStopped: ({ step }) => `Step ${step} stopped`,
    statusAllFinished: 'All steps finished',
    statusSkipped: ({ step }) => `Step ${step} skipped`,
    statusDone: ({ step }) => `Step ${step} done`,
    statusReady: 'Ready',
    autoHintEmailMicrosoftManager: 'Use Auto to fetch a Microsoft account email, or paste manually, then continue',
    autoHintError: 'Auto run was interrupted by an error. Fix it or skip the failed step, then continue',
    fetchedEmail: ({ email }) => `Fetched ${email}`,
    autoFetchFailed: ({ message }) => `Auto fetch failed: ${message}`,
    pleaseEnterEmailFirst: 'Please paste email address or use Auto first',
    skipFailed: ({ message }) => `Skip failed: ${message}`,
    stepSkippedToast: ({ step }) => `Step ${step} skipped`,
    stoppingFlow: 'Stopping current flow...',
    continueNeedEmail: 'Please fetch or paste an email address first!',
    continueFailed: ({ message }) => `Continue failed: ${message}`,
    confirmReset: 'Reset all steps and data?',
    copiedValue: ({ label }) => `Copied ${label}`,
    copiedValueFallback: ({ label }) => `${label} copied`,
    copyFailed: ({ label, message }) => `Failed to copy ${label}: ${message}`,
    nothingToCopy: ({ label }) => `${label} is empty`,
    pastedCpaAuth: 'Pasted CPA Auth URL from clipboard',
    pasteFailed: ({ message }) => `Paste failed: ${message}`,
    clipboardEmpty: 'Clipboard is empty',
    clipboardNoUsefulText: 'Clipboard does not contain usable text',
    autoRunRunning: ({ runLabel }) => `Running${runLabel}`,
    autoRunPaused: ({ runLabel }) => `Paused${runLabel}`,
    autoRunInterrupted: ({ runLabel }) => `Interrupted${runLabel}`,
    versionChecking: 'Checking version...',
    versionTooltipLatest: ({ version }) => `You are on the latest version ${version}`,
    versionTooltipUpdateAvailable: ({ current, latest }) => `New version ${latest} available (current ${current}), click to view`,
    versionTooltipCheckFailed: 'Version check failed, click to view releases',
    newVersionFound: ({ latest }) => `New version ${latest} found. Click the header version badge to view`,
    languageToggleLabel: '中文',
    languageToggleNextName: 'Chinese',
    standaloneTitle: 'Full Page',
  },
};

const SETTINGS_GROUP_TEXT = {
  'zh-CN': {
    groupOauthTitle: 'OAuth 配置',
    groupOauthDescription: '选择导入目标并填写对应的入口地址。',
    groupVerifyTitle: '验证源配置',
    groupVerifyDescription: '连接用于验证码和账号轮换的 Microsoft 管理源。',
    groupIdentityTitle: '账号输入',
    groupIdentityDescription: '自动获取或手动填写邮箱，可选覆盖密码。',
    groupRuntimeTitle: '运行链接',
    groupRuntimeDescription: '流程开始后在这里查看 OAuth 和回调地址。',
    groupStatusAttention: '待填写',
    groupStatusReady: '已就绪',
    groupStatusManual: '手动',
    groupStatusWaiting: '等待中',
  },
  'en-US': {
    groupOauthTitle: 'OAuth Setup',
    groupOauthDescription: 'Choose the import target and fill the required endpoint.',
    groupVerifyTitle: 'Verification Setup',
    groupVerifyDescription: 'Connect the Microsoft manager source used for codes and account rotation.',
    groupIdentityTitle: 'Identity Input',
    groupIdentityDescription: 'Fetch or paste the email and optionally override the password.',
    groupRuntimeTitle: 'Runtime Links',
    groupRuntimeDescription: 'Review the OAuth and callback links after a run starts.',
    groupStatusAttention: 'Needs Attention',
    groupStatusReady: 'Ready',
    groupStatusManual: 'Manual',
    groupStatusWaiting: 'Waiting',
  },
};

const QUICKSTART_TEXT = {
  'zh-CN': {
    kicker: '快速开始',
    title: '先填 2 个地方，再开始',
    hintMissingOauth: '先完成 OAuth 配置。把来源选好，再填对应地址。',
    hintMissingVerify: 'OAuth 已经好了。现在去填验证源配置里的 MSMgr、Token、Mode。',
    hintReady: '基础配置已经好了。建议先把次数设为 1，然后点播放测试一次。',
    oauthReady: '已完成',
    oauthPending: '未完成',
    oauthNoteReady: '来源和地址已经填好',
    oauthNotePending: '请选择来源并填地址',
    verifyReady: '已完成',
    verifyPending: '未完成',
    verifyNoteReady: '收码配置已经填好',
    verifyNotePending: '请填 MSMgr、Token、Mode',
    identityReady: '已填写',
    identityManual: '可选',
    identityNoteReady: '邮箱已填，可以直接跑',
    identityNoteManual: '可点 Auto 自动取号',
  },
  'en-US': {
    kicker: 'Quick Start',
    title: 'Fill 2 things first, then run',
    hintMissingOauth: 'Start with OAuth Setup. Choose the provider, then fill the matching address.',
    hintMissingVerify: 'OAuth is ready. Now fill MS Manager URL, Token, and Mode in Verification Setup.',
    hintReady: 'Core setup is ready. Set the count to 1 and run a test first.',
    oauthReady: 'Ready',
    oauthPending: 'Missing',
    oauthNoteReady: 'Provider and address are set',
    oauthNotePending: 'Choose a provider and fill the address',
    verifyReady: 'Ready',
    verifyPending: 'Missing',
    verifyNoteReady: 'Verification source is configured',
    verifyNotePending: 'Fill MSMgr, Token, and Mode',
    identityReady: 'Ready',
    identityManual: 'Optional',
    identityNoteReady: 'Email is filled and ready',
    identityNoteManual: 'Use Auto to fetch an account',
  },
};

const ASSIST_TEXT = {
  'zh-CN': {
    setupKicker: '设置助手',
    setupTitle: '现在还不能开始',
    setupMessageOne: '先完成 OAuth 配置，再完成验证源配置。填好以后再点播放，成功率会高很多。',
    setupMessageTwo: 'OAuth 已经好了。现在请去填验证源配置里的 MSMgr、Token、Mode。',
    setupPrimaryOauth: '去填 OAuth',
    setupPrimaryVerify: '去填验证源',
    setupSecondaryVerify: '再看验证源',
    setupDismiss: '知道了',
    onboardingKicker: '第一次使用？',
    onboardingTitle: '建议先这样跑',
    onboardingMessage: '先把次数设为 1，先跑通一次。不要一开始就连跑很多次。',
    onboardingPrimary: '定位到次数',
    onboardingDismiss: '不再提示',
    recoveryKicker: '错误恢复',
    recoveryTitle: '刚刚运行失败了',
    recoveryMessagePrefix: '先处理这个问题：',
    recoveryPrimaryOauth: '检查 OAuth',
    recoveryPrimaryVerify: '检查验证源',
    recoveryPrimaryIdentity: '检查邮箱',
    recoveryPrimaryGeneral: '查看设置',
    recoveryDismiss: '先关掉',
  },
  'en-US': {
    setupKicker: 'Setup Helper',
    setupTitle: 'You cannot run yet',
    setupMessageOne: 'Finish OAuth Setup first, then Verification Setup. Running after that will be much safer.',
    setupMessageTwo: 'OAuth is ready. Now fill MSMgr, Token, and Mode in Verification Setup.',
    setupPrimaryOauth: 'Open OAuth',
    setupPrimaryVerify: 'Open Verify',
    setupSecondaryVerify: 'Then Verify',
    setupDismiss: 'Got it',
    onboardingKicker: 'First time?',
    onboardingTitle: 'Use this safer flow first',
    onboardingMessage: 'Set the count to 1 and make one successful run before trying bigger batches.',
    onboardingPrimary: 'Jump to Count',
    onboardingDismiss: 'Hide Tips',
    recoveryKicker: 'Recovery',
    recoveryTitle: 'The last run failed',
    recoveryMessagePrefix: 'Fix this first:',
    recoveryPrimaryOauth: 'Check OAuth',
    recoveryPrimaryVerify: 'Check Verify',
    recoveryPrimaryIdentity: 'Check Email',
    recoveryPrimaryGeneral: 'Check Settings',
    recoveryDismiss: 'Dismiss',
  },
};

const FORM_TEXT = {
  'zh-CN': {
    btnTestOauth: '测试 OAuth 配置',
    btnTestVerify: '测试验证源',
    testing: '测试中...',
    ok: '连接正常',
    cpaAuthRequired: '这里必须填 CPA Auth 地址。',
    sub2apiRequired: '这里必须填 Sub2API 根地址。',
    managerUrlRequired: '这里必须填 MSMgr 地址。',
    managerTokenRequired: '这里必须填 Token。',
    managerModeRequired: '这里必须选择 Mode。',
    oauthTestSuccess: (message) => `OAuth 配置可用：${message}`,
    oauthTestFailure: (message) => `OAuth 配置测试失败：${message}`,
    verifyTestSuccess: (message) => `验证源可用：${message}`,
    verifyTestFailure: (message) => `验证源测试失败：${message}`,
    verifyListSuccess: 'Manager API 可访问，Token 看起来可用',
    oauthReachable: (status) => `地址可访问（HTTP ${status}）`,
  },
  'en-US': {
    btnTestOauth: 'Test OAuth',
    btnTestVerify: 'Test Verify',
    testing: 'Testing...',
    ok: 'Connection OK',
    cpaAuthRequired: 'CPA Auth URL is required here.',
    sub2apiRequired: 'Sub2API base URL is required here.',
    managerUrlRequired: 'MSMgr URL is required.',
    managerTokenRequired: 'Token is required.',
    managerModeRequired: 'Mode is required.',
    oauthTestSuccess: (message) => `OAuth config is reachable: ${message}`,
    oauthTestFailure: (message) => `OAuth config test failed: ${message}`,
    verifyTestSuccess: (message) => `Verify source is working: ${message}`,
    verifyTestFailure: (message) => `Verify source test failed: ${message}`,
    verifyListSuccess: 'Manager API responded and the token looks valid',
    oauthReachable: (status) => `Endpoint responded (HTTP ${status})`,
  },
};

const FIELD_HELP_TEXT = {
  oauthProvider: {
    url: 'https://your-cpa-host/management.html#/oauth',
    'zh-CN': {
      title: 'OAuth 目标',
      description: '选择 OAuth 回调最终导入到哪里。CPA Auth 使用管理面板地址，Sub2API 使用站点根域名。',
      referenceLabel: '示例入口',
    },
    'en-US': {
      title: 'OAuth Target',
      description: 'Choose where the OAuth callback will be imported. CPA Auth uses the management page, while Sub2API expects the site root domain.',
      referenceLabel: 'Example entry',
    },
  },
  cpaAuthUrl: {
    url: 'https://your-cpa-host/management.html#/oauth',
    'zh-CN': {
      title: 'CPA Auth 地址',
      description: '填写 CPA Auth 管理页的 OAuth 路径，格式通常是 management.html#/oauth。',
      referenceLabel: '示例地址',
    },
    'en-US': {
      title: 'CPA Auth URL',
      description: 'Paste the CPA Auth management page OAuth route, usually the management.html#/oauth page.',
      referenceLabel: 'Example URL',
    },
  },
  cpaManagementKey: {
    url: 'https://your-cpa-host/management.html#/oauth',
    'zh-CN': {
      title: 'CPA Management Key',
      description: '输入明文的 Management Key，不要填加密后的哈希串。',
      referenceLabel: '管理面板参考',
    },
    'en-US': {
      title: 'CPA Management Key',
      description: 'Enter the plaintext Management Key used by CPA Auth. Do not paste a hashed value.',
      referenceLabel: 'Panel reference',
    },
  },
  sub2apiBaseUrl: {
    url: 'https://your-sub2api-host',
    'zh-CN': {
      title: 'Sub2API 根地址',
      description: '只填写 Sub2API 的根域名，扩展会自动拼接管理员 API 路径。',
      referenceLabel: '示例根域名',
    },
    'en-US': {
      title: 'Sub2API Base URL',
      description: 'Enter only the Sub2API root domain. The extension appends the admin API path automatically.',
      referenceLabel: 'Example root domain',
    },
  },
  sub2apiApiKey: {
    url: 'https://your-sub2api-host/admin/acc',
    'zh-CN': {
      title: 'Sub2API API Key',
      description: '如果你的 Sub2API 后台启用了鉴权，这里填写 x-api-key 或 Bearer token。',
      referenceLabel: '后台入口',
    },
    'en-US': {
      title: 'Sub2API API Key',
      description: 'If your Sub2API admin API is protected, enter the x-api-key or Bearer token here.',
      referenceLabel: 'Admin entry',
    },
  },
  blockedAccountPolicy: {
    url: 'https://github.com/Msg-Lbo/microsoft-account-manager',
    'zh-CN': {
      title: '封号处理',
      description: '控制命中 AADSTS70000 时是删除账号还是仅跳过并切换到下一个账号。',
      referenceLabel: '管理源说明',
    },
    'en-US': {
      title: 'Blocked Handling',
      description: 'Choose whether AADSTS70000 should delete the account or just skip it and move to the next one.',
      referenceLabel: 'Manager reference',
    },
  },
  verifyProvider: {
    url: 'https://github.com/Msg-Lbo/microsoft-account-manager',
    'zh-CN': {
      title: '验证源',
      description: '当前构建固定使用 Microsoft Account Manager API 作为验证码来源。',
      referenceLabel: '项目参考',
    },
    'en-US': {
      title: 'Verify Provider',
      description: 'This build uses Microsoft Account Manager API as the verification source.',
      referenceLabel: 'Project reference',
    },
  },
  microsoftManagerUrl: {
    url: 'https://your-manager-domain',
    'zh-CN': {
      title: 'MSMgr 地址',
      description: '填写你部署好的 Microsoft Account Manager 根地址。',
      referenceLabel: '示例地址',
    },
    'en-US': {
      title: 'MS Manager URL',
      description: 'Enter the base URL of your deployed Microsoft Account Manager.',
      referenceLabel: 'Example URL',
    },
  },
  microsoftManagerToken: {
    url: 'https://github.com/Msg-Lbo/microsoft-account-manager',
    'zh-CN': {
      title: 'MAIL_API_TOKEN',
      description: '填写 Microsoft Account Manager 服务端配置的 MAIL_API_TOKEN。',
      referenceLabel: '配置参考',
    },
    'en-US': {
      title: 'MAIL_API_TOKEN',
      description: 'Paste the MAIL_API_TOKEN configured on your Microsoft Account Manager service.',
      referenceLabel: 'Config reference',
    },
  },
  microsoftManagerMode: {
    url: 'https://github.com/Msg-Lbo/microsoft-account-manager',
    'zh-CN': {
      title: '获取模式',
      description: '这里的模式需要与你的管理服务端配置一致，通常是 graph 或 imap。',
      referenceLabel: '模式说明',
    },
    'en-US': {
      title: 'Mode',
      description: 'Match this mode with your manager backend configuration, typically graph or imap.',
      referenceLabel: 'Mode reference',
    },
  },
  microsoftManagerKeyword: {
    url: 'https://your-manager-domain/api/open/accounts',
    'zh-CN': {
      title: '账号筛选',
      description: '可选关键词，会传给账号查询接口，用于缩小自动取号范围。',
      referenceLabel: '接口参考',
    },
    'en-US': {
      title: 'Account Filter',
      description: 'Optional keyword passed to the account query API to narrow the auto-fetch pool.',
      referenceLabel: 'API reference',
    },
  },
  microsoftManagerAliases: {
    url: 'https://your-manager-domain/api/open/aliases',
    'zh-CN': {
      title: '别名池',
      description: '启用后，自动取号会同时从主邮箱和别名邮箱里挑选可用账号。',
      referenceLabel: '别名接口',
    },
    'en-US': {
      title: 'Alias Pool',
      description: 'When enabled, auto-fetch can use both primary and alias addresses from the manager.',
      referenceLabel: 'Alias API',
    },
  },
  email: {
    url: 'https://your-manager-domain/api/open/accounts',
    'zh-CN': {
      title: 'Email',
      description: '可以点击 Auto 从账号池取号，或者手动粘贴一个准备好的 Microsoft 账号。',
      referenceLabel: '账号来源',
    },
    'en-US': {
      title: 'Email',
      description: 'Use Auto to pull the next available Microsoft account, or paste a prepared account manually.',
      referenceLabel: 'Account source',
    },
  },
  password: {
    url: 'https://account.microsoft.com',
    'zh-CN': {
      title: 'Password',
      description: '留空时扩展会自动生成强密码；如果你已有固定密码，也可以手动填入。',
      referenceLabel: '账号参考',
    },
    'en-US': {
      title: 'Password',
      description: 'Leave this empty to auto-generate a strong password, or enter your own fixed password.',
      referenceLabel: 'Account reference',
    },
  },
  oauthRuntime: {
    url: 'https://auth.openai.com',
    'zh-CN': {
      title: 'OAuth 链接',
      description: 'Step 1 成功后这里会显示当前运行生成的授权链接。',
      referenceLabel: '授权入口',
    },
    'en-US': {
      title: 'OAuth Link',
      description: 'After step 1 succeeds, this field shows the authorization URL generated for the current run.',
      referenceLabel: 'Auth entry',
    },
  },
  callbackRuntime: {
    url: 'https://auth.openai.com',
    'zh-CN': {
      title: 'Callback',
      description: '完成授权后，这里会显示捕获到的回调地址，供导入步骤继续使用。',
      referenceLabel: '回调来源',
    },
    'en-US': {
      title: 'Callback',
      description: 'After authorization completes, this field shows the captured callback URL for the import step.',
      referenceLabel: 'Callback source',
    },
  },
  footerTrust: {
    url: '',
    'zh-CN': {
      title: '',
      description: '（老外做的，用放心呗）',
      referenceLabel: '',
    },
    'en-US': {
      title: '',
      description: '（老外做的，用放心呗）',
      referenceLabel: '',
    },
  },
};

function t(key, vars = {}) {
  const pack = I18N[currentLanguage] || I18N['zh-CN'];
  const fallbackPack = I18N['zh-CN'];
  const value = pack[key] ?? fallbackPack[key] ?? key;
  if (typeof value === 'function') return value(vars);
  return String(value).replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ''));
}

function tg(key) {
  const pack = SETTINGS_GROUP_TEXT[currentLanguage] || SETTINGS_GROUP_TEXT['zh-CN'];
  const fallbackPack = SETTINGS_GROUP_TEXT['zh-CN'];
  return String(pack[key] ?? fallbackPack[key] ?? key);
}

function qt(key) {
  const pack = QUICKSTART_TEXT[currentLanguage] || QUICKSTART_TEXT['zh-CN'];
  const fallbackPack = QUICKSTART_TEXT['zh-CN'];
  return String(pack[key] ?? fallbackPack[key] ?? key);
}

function at(key) {
  const pack = ASSIST_TEXT[currentLanguage] || ASSIST_TEXT['zh-CN'];
  const fallbackPack = ASSIST_TEXT['zh-CN'];
  return String(pack[key] ?? fallbackPack[key] ?? key);
}

function ft(key, vars = {}) {
  const pack = FORM_TEXT[currentLanguage] || FORM_TEXT['zh-CN'];
  const fallbackPack = FORM_TEXT['zh-CN'];
  const value = pack[key] ?? fallbackPack[key] ?? key;
  if (typeof value === 'function') return value(vars.message ?? vars.status ?? '');
  return String(value);
}

function getFieldHelpEntry(helpKey) {
  const entry = FIELD_HELP_TEXT[helpKey];
  if (!entry) return null;

  const localized = entry[currentLanguage] || entry['zh-CN'] || {};
  return {
    title: localized.title || '',
    description: localized.description || '',
    referenceLabel: localized.referenceLabel || '',
    url: entry.url || '',
  };
}

function setAutoRunButton(label) {
  if (btnAutoRunLabel) {
    btnAutoRunLabel.textContent = label;
  }
  btnAutoRun.title = label;
  btnAutoRun.setAttribute('aria-label', label);
}

function normalizeVersionValue(rawValue) {
  return String(rawValue || '')
    .trim()
    .replace(/^refs\/tags\//i, '')
    .replace(/^v/i, '');
}

function formatVersionLabel(versionValue) {
  const normalized = normalizeVersionValue(versionValue);
  return normalized ? `v${normalized}` : 'v0.0.0';
}

function parseVersionParts(versionValue) {
  const normalized = normalizeVersionValue(versionValue);
  if (!normalized) return [];

  return normalized
    .split('.')
    .map(part => {
      const matched = String(part || '').match(/\d+/);
      return matched ? Number(matched[0]) : 0;
    });
}

function compareVersionValues(leftVersion, rightVersion) {
  const left = parseVersionParts(leftVersion);
  const right = parseVersionParts(rightVersion);
  const length = Math.max(left.length, right.length);

  for (let index = 0; index < length; index++) {
    const leftPart = Number(left[index] || 0);
    const rightPart = Number(right[index] || 0);
    if (leftPart > rightPart) return 1;
    if (leftPart < rightPart) return -1;
  }

  return 0;
}

function getVersionBadgeTitle() {
  if (!isVersionCheckFinished) {
    return t('versionChecking');
  }

  if (hasNewRelease) {
    return t('versionTooltipUpdateAvailable', {
      current: currentManifestVersionLabel,
      latest: formatVersionLabel(latestReleaseVersion),
    });
  }

  if (latestReleaseVersion) {
    return t('versionTooltipLatest', {
      version: formatVersionLabel(latestReleaseVersion),
    });
  }

  return t('versionTooltipCheckFailed');
}

function isOauthGroupReady() {
  return isSub2apiOauthProviderSelected()
    ? Boolean(inputSub2apiBaseUrl.value.trim())
    : Boolean(inputVpsUrl.value.trim());
}

function isVerifyGroupReady() {
  return Boolean(inputMicrosoftManagerUrl.value.trim())
    && Boolean(inputMicrosoftManagerToken.value.trim())
    && Boolean(selectMicrosoftManagerMode.value);
}

function setQuickStartItemState(itemId, state, stateText, noteText) {
  const item = document.querySelector(`[data-quickstart-item="${itemId}"]`);
  const stateNode = document.getElementById(`quickstart-${itemId}-state`);
  const noteNode = document.getElementById(`quickstart-${itemId}-note`);
  if (!item || !stateNode || !noteNode) return;
  item.dataset.state = state;
  stateNode.textContent = stateText;
  noteNode.textContent = noteText;
}

function renderQuickStartSummary() {
  if (!quickstartTitle || !quickstartHint || !quickstartKicker) return;

  const oauthReady = isOauthGroupReady();
  const verifyReady = isVerifyGroupReady();
  const emailReady = Boolean(inputEmail.value.trim());

  quickstartKicker.textContent = qt('kicker');
  quickstartTitle.textContent = qt('title');

  setQuickStartItemState(
    'oauth',
    oauthReady ? 'ready' : 'attention',
    oauthReady ? qt('oauthReady') : qt('oauthPending'),
    oauthReady ? qt('oauthNoteReady') : qt('oauthNotePending')
  );

  setQuickStartItemState(
    'verify',
    verifyReady ? 'ready' : 'attention',
    verifyReady ? qt('verifyReady') : qt('verifyPending'),
    verifyReady ? qt('verifyNoteReady') : qt('verifyNotePending')
  );

  setQuickStartItemState(
    'identity',
    emailReady ? 'ready' : 'manual',
    emailReady ? qt('identityReady') : qt('identityManual'),
    emailReady ? qt('identityNoteReady') : qt('identityNoteManual')
  );

  if (!oauthReady) {
    quickstartHint.textContent = qt('hintMissingOauth');
  } else if (!verifyReady) {
    quickstartHint.textContent = qt('hintMissingVerify');
  } else {
    quickstartHint.textContent = qt('hintReady');
  }
}

function getMissingSetupIssues() {
  const issues = [];
  if (!isOauthGroupReady()) {
    issues.push({ group: 'oauth' });
  }
  if (!isVerifyGroupReady()) {
    issues.push({ group: 'verify' });
  }
  return issues;
}

function normalizeBaseUrl(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  const candidate = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    return new URL(candidate).toString();
  } catch {
    return '';
  }
}

async function fetchWithTimeout(url, init = {}, timeoutMs = 6000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      cache: 'no-store',
      redirect: 'follow',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

function setFieldValidation(row, control, messageNode, message = '') {
  const invalid = Boolean(message);
  row?.classList.toggle('is-invalid', invalid);
  if (control) {
    control.setAttribute('aria-invalid', invalid ? 'true' : 'false');
  }
  if (messageNode) {
    messageNode.hidden = !invalid;
    messageNode.textContent = message;
  }
}

function setActionResult(node, state, message = '') {
  if (!node) return;
  node.hidden = !message;
  node.dataset.state = state || '';
  node.textContent = message;
}

function refreshFieldValidation() {
  const usingSub2api = isSub2apiOauthProviderSelected();

  setFieldValidation(
    rowCpaAuthUrl,
    inputVpsUrl,
    messageCpaAuthUrl,
    !usingSub2api && !inputVpsUrl.value.trim() ? ft('cpaAuthRequired') : ''
  );

  setFieldValidation(
    rowSub2apiBaseUrl,
    inputSub2apiBaseUrl,
    messageSub2apiBaseUrl,
    usingSub2api && !inputSub2apiBaseUrl.value.trim() ? ft('sub2apiRequired') : ''
  );

  setFieldValidation(
    rowMicrosoftManagerUrl,
    inputMicrosoftManagerUrl,
    messageMicrosoftManagerUrl,
    !inputMicrosoftManagerUrl.value.trim() ? ft('managerUrlRequired') : ''
  );

  setFieldValidation(
    rowMicrosoftManagerToken,
    inputMicrosoftManagerToken,
    messageMicrosoftManagerToken,
    !inputMicrosoftManagerToken.value.trim() ? ft('managerTokenRequired') : ''
  );

  setFieldValidation(
    rowMicrosoftManagerMode,
    selectMicrosoftManagerMode,
    messageMicrosoftManagerMode,
    !selectMicrosoftManagerMode.value ? ft('managerModeRequired') : ''
  );
}

function focusSettingsGroup(groupId) {
  const refs = settingsGroupRefs[groupId];
  if (!refs?.element) return;
  settingsGroupState[groupId] = true;
  syncSettingsGroups();
  refs.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function focusRunCountInput() {
  inputRunCount?.focus();
  inputRunCount?.select?.();
}

function inferRecoveryGroupFromMessage(message) {
  const text = String(message || '').toLowerCase();
  if (!text) return 'oauth';
  if (text.includes('mail_api_token') || text.includes('token') || text.includes('msmgr') || text.includes('graph') || text.includes('imap') || text.includes('manager')) {
    return 'verify';
  }
  if (text.includes('email')) {
    return 'identity';
  }
  if (text.includes('oauth') || text.includes('sub2api') || text.includes('cpa') || text.includes('management') || text.includes('callback')) {
    return 'oauth';
  }
  return 'oauth';
}

function configureAssistButton(button, { hidden = false, label = '', handler = null } = {}) {
  if (!button) return;
  button.hidden = hidden;
  if (hidden) {
    button.onclick = null;
    return;
  }
  button.textContent = label;
  button.onclick = handler;
}

function hideAssistBanner() {
  if (assistSection) {
    assistSection.hidden = true;
  }
}

function renderAssistBanner() {
  if (!assistSection || !assistKicker || !assistTitle || !assistMessage) return;

  const missingIssues = getMissingSetupIssues();
  const onboardingDismissed = localStorage.getItem(ONBOARDING_DISMISS_KEY) === '1';

  if (assistRecoveryMessage) {
    const recoveryGroup = inferRecoveryGroupFromMessage(assistRecoveryMessage);
    assistSection.hidden = false;
    assistBannerMode = 'recovery';
    assistKicker.textContent = at('recoveryKicker');
    assistTitle.textContent = at('recoveryTitle');
    assistMessage.textContent = `${at('recoveryMessagePrefix')} ${assistRecoveryMessage}`;
    configureAssistButton(btnAssistPrimary, {
      label: recoveryGroup === 'verify'
        ? at('recoveryPrimaryVerify')
        : recoveryGroup === 'identity'
          ? at('recoveryPrimaryIdentity')
          : at('recoveryPrimaryOauth'),
      handler: () => focusSettingsGroup(recoveryGroup),
    });
    configureAssistButton(btnAssistSecondary, { hidden: true });
    configureAssistButton(btnAssistDismiss, {
      hidden: false,
      label: at('recoveryDismiss'),
      handler: () => {
        assistRecoveryMessage = '';
        renderAssistBanner();
      },
    });
    return;
  }

  if (missingIssues.length > 0) {
    assistSection.hidden = false;
    assistBannerMode = 'setup';
    assistKicker.textContent = at('setupKicker');
    assistTitle.textContent = at('setupTitle');
    assistMessage.textContent = missingIssues.length > 1 ? at('setupMessageOne') : at('setupMessageTwo');

    const firstIssue = missingIssues[0];
    configureAssistButton(btnAssistPrimary, {
      label: firstIssue.group === 'oauth' ? at('setupPrimaryOauth') : at('setupPrimaryVerify'),
      handler: () => focusSettingsGroup(firstIssue.group),
    });

    const secondIssue = missingIssues[1];
    configureAssistButton(btnAssistSecondary, secondIssue ? {
      hidden: false,
      label: secondIssue.group === 'verify' ? at('setupSecondaryVerify') : at('setupPrimaryOauth'),
      handler: () => focusSettingsGroup(secondIssue.group),
    } : { hidden: true });

    configureAssistButton(btnAssistDismiss, {
      hidden: false,
      label: at('setupDismiss'),
      handler: hideAssistBanner,
    });
    return;
  }

  if (!onboardingDismissed) {
    assistSection.hidden = false;
    assistBannerMode = 'onboarding';
    assistKicker.textContent = at('onboardingKicker');
    assistTitle.textContent = at('onboardingTitle');
    assistMessage.textContent = at('onboardingMessage');
    configureAssistButton(btnAssistPrimary, {
      label: at('onboardingPrimary'),
      handler: focusRunCountInput,
    });
    configureAssistButton(btnAssistSecondary, { hidden: true });
    configureAssistButton(btnAssistDismiss, {
      hidden: false,
      label: at('onboardingDismiss'),
      handler: () => {
        localStorage.setItem(ONBOARDING_DISMISS_KEY, '1');
        renderAssistBanner();
      },
    });
    return;
  }

  hideAssistBanner();
}

function validateRunPreflight() {
  const issues = getMissingSetupIssues();
  if (!issues.length) return true;

  assistRecoveryMessage = '';
  renderAssistBanner();
  focusSettingsGroup(issues[0].group);
  showToast(
    currentLanguage === 'zh-CN'
      ? '还不能开始，请先把待填写的配置补齐。'
      : 'You cannot run yet. Finish the required setup first.',
    'warn',
    5200
  );
  return false;
}

async function testOAuthConfig() {
  refreshFieldValidation();
  setActionResult(oauthTestResult, '', '');

  const usingSub2api = isSub2apiOauthProviderSelected();
  const targetValue = usingSub2api ? inputSub2apiBaseUrl.value.trim() : inputVpsUrl.value.trim();

  if (!targetValue) {
    focusSettingsGroup('oauth');
    return;
  }

  const url = normalizeBaseUrl(targetValue);
  if (!url) {
    setActionResult(oauthTestResult, 'error', ft('oauthTestFailure', { message: 'URL 无效' }));
    return;
  }

  const originalLabel = btnTestOauth?.textContent || '';
  if (btnTestOauth) {
    btnTestOauth.disabled = true;
    btnTestOauth.textContent = ft('testing');
  }

  try {
    const response = await fetchWithTimeout(url, { method: 'GET' }, 6000);
    const reachable = response.ok || response.status === 401 || response.status === 403;
    if (!reachable) {
      throw new Error(`HTTP ${response.status}`);
    }
    const message = ft('oauthReachable', { status: response.status || 200 });
    setActionResult(oauthTestResult, 'success', message);
    showToast(ft('oauthTestSuccess', { message }), 'success', 2600);
  } catch (err) {
    const message = err?.name === 'AbortError' ? '请求超时' : (err?.message || '请求失败');
    setActionResult(oauthTestResult, 'error', message);
    showToast(ft('oauthTestFailure', { message }), 'error');
  } finally {
    if (btnTestOauth) {
      btnTestOauth.disabled = false;
      btnTestOauth.textContent = originalLabel || ft('btnTestOauth');
    }
  }
}

async function testVerifyConfig() {
  refreshFieldValidation();
  setActionResult(verifyTestResult, '', '');

  if (!isVerifyGroupReady()) {
    focusSettingsGroup('verify');
    return;
  }

  const baseUrl = normalizeBaseUrl(inputMicrosoftManagerUrl.value.trim());
  if (!baseUrl) {
    setActionResult(verifyTestResult, 'error', 'MSMgr 地址无效');
    return;
  }

  const testUrl = new URL('/api/open/accounts', baseUrl);
  testUrl.searchParams.set('keyword', '');

  const originalLabel = btnTestVerify?.textContent || '';
  if (btnTestVerify) {
    btnTestVerify.disabled = true;
    btnTestVerify.textContent = ft('testing');
  }

  try {
    const response = await fetchWithTimeout(testUrl.toString(), {
      method: 'GET',
      headers: {
        'x-mail-api-token': inputMicrosoftManagerToken.value.trim(),
      },
    }, 7000);

    let payload = {};
    try {
      payload = await response.json();
    } catch {
      payload = {};
    }

    if (!response.ok) {
      const message = String(payload?.message || payload?.error || `HTTP ${response.status}`).trim();
      throw new Error(message);
    }

    const message = ft('verifyListSuccess');
    setActionResult(verifyTestResult, 'success', message);
    showToast(ft('verifyTestSuccess', { message }), 'success', 2600);
  } catch (err) {
    const message = err?.name === 'AbortError' ? '请求超时' : (err?.message || '请求失败');
    setActionResult(verifyTestResult, 'error', message);
    showToast(ft('verifyTestFailure', { message }), 'error');
  } finally {
    if (btnTestVerify) {
      btnTestVerify.disabled = false;
      btnTestVerify.textContent = originalLabel || ft('btnTestVerify');
    }
  }
}

function getSettingsGroupSummary(groupId) {
  switch (groupId) {
    case 'oauth':
      return {
        isAttention: !isOauthGroupReady(),
        statusKey: isOauthGroupReady() ? 'groupStatusReady' : 'groupStatusAttention',
      };
    case 'verify':
      return {
        isAttention: !isVerifyGroupReady(),
        statusKey: isVerifyGroupReady() ? 'groupStatusReady' : 'groupStatusAttention',
      };
    case 'identity':
      return {
        isAttention: false,
        statusKey: inputEmail.value.trim() ? 'groupStatusReady' : 'groupStatusManual',
      };
    case 'runtime':
      return {
        isAttention: false,
        statusKey: displayOauthUrl.classList.contains('has-value') || displayLocalhostUrl.classList.contains('has-value')
          ? 'groupStatusReady'
          : 'groupStatusWaiting',
      };
    default:
      return {
        isAttention: false,
        statusKey: 'groupStatusWaiting',
      };
  }
}

function renderSettingsGroupCopy() {
  document.querySelectorAll('[data-settings-group-copy]').forEach((node) => {
    const key = node.dataset.settingsGroupCopy;
    node.textContent = tg(key);
  });
}

function syncSettingsGroups() {
  refreshFieldValidation();
  Object.entries(settingsGroupRefs).forEach(([groupId, refs]) => {
    if (!refs?.element || !refs?.toggle || !refs?.body || !refs?.status) return;

    const summary = getSettingsGroupSummary(groupId);
    const expanded = summary.isAttention ? true : Boolean(settingsGroupState[groupId]);

    refs.element.classList.toggle('is-expanded', expanded);
    refs.element.classList.toggle('is-attention', summary.isAttention);
    refs.element.classList.toggle('is-ready', !summary.isAttention && summary.statusKey === 'groupStatusReady');
    refs.element.classList.toggle('is-manual', summary.statusKey === 'groupStatusManual');
    refs.body.hidden = !expanded;
    refs.toggle.setAttribute('aria-expanded', String(expanded));
    refs.status.textContent = tg(summary.statusKey);
    refs.status.dataset.state = summary.statusKey.replace('groupStatus', '').toLowerCase();
  });
  renderQuickStartSummary();
  renderAssistBanner();
}

function initSettingsGroups() {
  Object.entries(settingsGroupRefs).forEach(([groupId, refs]) => {
    if (!refs?.toggle) return;
    settingsGroupState[groupId] = false;
    refs.toggle.addEventListener('click', () => {
      const summary = getSettingsGroupSummary(groupId);
      if (summary.isAttention) {
        syncSettingsGroups();
        return;
      }
      settingsGroupState[groupId] = refs.body.hidden;
      syncSettingsGroups();
    });
  });
  syncSettingsGroups();
}

function clearFieldHoverCardTimers() {
  if (fieldHoverCardOpenTimer !== null) {
    clearTimeout(fieldHoverCardOpenTimer);
    fieldHoverCardOpenTimer = null;
  }
  if (fieldHoverCardCloseTimer !== null) {
    clearTimeout(fieldHoverCardCloseTimer);
    fieldHoverCardCloseTimer = null;
  }
}

function positionFieldHoverCard(trigger) {
  if (!fieldHoverCard || !trigger) return;

  const triggerRect = trigger.getBoundingClientRect();
  const cardWidth = fieldHoverCard.offsetWidth;
  const cardHeight = fieldHoverCard.offsetHeight;
  const gap = 12;
  const viewportPadding = 12;

  let left = triggerRect.right + gap;
  let top = triggerRect.top + (triggerRect.height / 2) - (cardHeight / 2);

  if (left + cardWidth > window.innerWidth - viewportPadding) {
    left = Math.min(
      Math.max(viewportPadding, triggerRect.left),
      window.innerWidth - cardWidth - viewportPadding
    );
    top = triggerRect.bottom + gap;
  }

  if (top + cardHeight > window.innerHeight - viewportPadding) {
    top = Math.max(
      viewportPadding,
      Math.min(triggerRect.top - cardHeight - gap, window.innerHeight - cardHeight - viewportPadding)
    );
  }

  if (top < viewportPadding) {
    top = viewportPadding;
  }

  fieldHoverCard.style.left = `${Math.max(viewportPadding, left)}px`;
  fieldHoverCard.style.top = `${top}px`;
}

function renderFieldHoverCard(trigger, helpKey) {
  const entry = getFieldHelpEntry(helpKey);
  if (!fieldHoverCard || !fieldHoverCardTitle || !fieldHoverCardDescription || !fieldHoverCardReference || !fieldHoverCardReferenceLabel || !fieldHoverCardLink || !entry) {
    return;
  }

  fieldHoverCardTitle.textContent = entry.title;
  fieldHoverCardTitle.hidden = !entry.title;
  fieldHoverCardDescription.textContent = entry.description;
  const hasReference = Boolean(entry.url);
  fieldHoverCardReference.hidden = !hasReference;
  if (hasReference) {
    fieldHoverCardReferenceLabel.textContent = entry.referenceLabel || 'Reference';
    fieldHoverCardLink.href = entry.url;
    fieldHoverCardLink.textContent = entry.url;
    fieldHoverCardLink.title = entry.url;
  } else {
    fieldHoverCardLink.removeAttribute('href');
    fieldHoverCardLink.textContent = '';
    fieldHoverCardLink.title = '';
  }

  fieldHoverCard.hidden = false;
  fieldHoverCard.classList.remove('is-visible');
  fieldHoverCard.classList.add('is-measuring');
  positionFieldHoverCard(trigger);
  fieldHoverCard.classList.remove('is-measuring');
  fieldHoverCard.classList.add('is-visible');
}

function hideFieldHoverCard(options = {}) {
  const { immediate = false } = options;
  clearFieldHoverCardTimers();

  const doHide = () => {
    if (!fieldHoverCard) return;
    fieldHoverCard.classList.remove('is-visible');
    fieldHoverCard.hidden = true;
    activeFieldHoverKey = '';
    activeFieldHoverTrigger = null;
  };

  if (immediate) {
    doHide();
    return;
  }

  fieldHoverCardCloseTimer = window.setTimeout(doHide, 180);
}

function scheduleFieldHoverCard(trigger, helpKey) {
  clearFieldHoverCardTimers();
  fieldHoverCardOpenTimer = window.setTimeout(() => {
    activeFieldHoverTrigger = trigger;
    activeFieldHoverKey = helpKey;
    renderFieldHoverCard(trigger, helpKey);
  }, 120);
}

function initFieldHoverCard() {
  const triggers = document.querySelectorAll('[data-help-key]');

  triggers.forEach((trigger) => {
    const variant = trigger.dataset.helpVariant || (trigger.classList.contains('data-label') ? 'label' : 'icon');
    if (variant === 'label') {
      trigger.classList.add('field-help-trigger');
      trigger.tabIndex = 0;
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-haspopup', 'dialog');
    }

    const helpKey = trigger.dataset.helpKey;
    if (!helpKey) return;

    trigger.addEventListener('mouseenter', () => scheduleFieldHoverCard(trigger, helpKey));
    trigger.addEventListener('mouseleave', () => hideFieldHoverCard());
    trigger.addEventListener('focus', () => scheduleFieldHoverCard(trigger, helpKey));
    trigger.addEventListener('blur', () => hideFieldHoverCard());
    trigger.addEventListener('click', () => {
      if (activeFieldHoverKey === helpKey && !fieldHoverCard?.hidden) {
        hideFieldHoverCard({ immediate: true });
        return;
      }
      scheduleFieldHoverCard(trigger, helpKey);
    });
    trigger.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      if (activeFieldHoverKey === helpKey && !fieldHoverCard?.hidden) {
        hideFieldHoverCard({ immediate: true });
        return;
      }
      scheduleFieldHoverCard(trigger, helpKey);
    });
  });

  fieldHoverCard?.addEventListener('mouseenter', () => {
    clearFieldHoverCardTimers();
  });
  fieldHoverCard?.addEventListener('mouseleave', () => {
    hideFieldHoverCard();
  });

  window.addEventListener('resize', () => {
    if (activeFieldHoverTrigger && activeFieldHoverKey && !fieldHoverCard?.hidden) {
      renderFieldHoverCard(activeFieldHoverTrigger, activeFieldHoverKey);
    }
  });
  window.addEventListener('scroll', () => {
    if (activeFieldHoverKey) {
      hideFieldHoverCard({ immediate: true });
    }
  }, true);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hideFieldHoverCard({ immediate: true });
    }
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (fieldHoverCard?.contains(target)) return;
    const trigger = target instanceof Element ? target.closest('.field-help-trigger') : null;
    if (trigger) return;
    hideFieldHoverCard({ immediate: true });
  });
}

function renderRunWindowStepShell() {
  if (!runWindowStepsList) return;

  const rows = WORKFLOW_STEPS.map((step) => `
    <div class="step-row" data-step="${step}">
      <div class="step-indicator" data-step="${step}"><span class="step-num">${step}</span></div>
      <button class="step-btn" data-step="${step}" type="button" disabled aria-hidden="true">${escapeHtml(t(`step${step}`))}</button>
      <button class="step-skip-btn btn btn-ghost btn-xs" data-step="${step}" type="button" disabled aria-hidden="true">${escapeHtml(t('btnSkip'))}</button>
      <span class="step-status" data-step="${step}"></span>
    </div>
  `).join('');

  runWindowStepsList.innerHTML = rows;
  syncRunWindowMirrors();
}

function syncRunWindowWorkflowFromMain() {
  if (!runWindowStepsList || !runWindowStepsProgress) return;

  const mainRows = Array.from(document.querySelectorAll('#steps-section .step-row'));
  const windowRows = Array.from(runWindowStepsList.querySelectorAll('.step-row'));

  windowRows.forEach((row, index) => {
    const mainRow = mainRows[index];
    if (!mainRow) return;

    const rowClasses = Array.from(mainRow.classList).filter((name) => name !== 'step-row');
    row.className = `step-row ${rowClasses.join(' ')}`.trim();

    const mainStatus = mainRow.querySelector('.step-status');
    const mirrorStatus = row.querySelector('.step-status');
    if (mainStatus && mirrorStatus) {
      mirrorStatus.textContent = mainStatus.textContent;
    }
  });

  runWindowStepsProgress.textContent = stepsProgress.textContent;
}

function syncRunWindowLogFromMain() {
  if (!runWindowLogArea) return;
  runWindowLogArea.innerHTML = logArea.innerHTML;
  if (runWindowOverlay && !runWindowOverlay.hidden) {
    runWindowLogArea.scrollTop = runWindowLogArea.scrollHeight;
  }
}

function syncRunWindowMirrors() {
  syncRunWindowWorkflowFromMain();
  syncRunWindowLogFromMain();
}

function openRunWindow() {
  if (!runWindowOverlay) return;
  if (runWindowCloseTimer !== null) {
    clearTimeout(runWindowCloseTimer);
    runWindowCloseTimer = null;
  }

  syncRunWindowMirrors();
  runWindowOverlay.hidden = false;
  runWindowOverlay.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => {
    runWindowOverlay.classList.add('is-visible');
  });
}

function closeRunWindow() {
  if (!runWindowOverlay || runWindowOverlay.hidden) return;
  runWindowOverlay.classList.remove('is-visible');
  runWindowOverlay.setAttribute('aria-hidden', 'true');
  runWindowCloseTimer = window.setTimeout(() => {
    runWindowOverlay.hidden = true;
  }, 280);
}

function initRunWindow() {
  renderRunWindowStepShell();

  btnWindowStop?.addEventListener('click', async () => {
    await requestStopFlow();
  });

  runWindowBackdrop?.addEventListener('click', () => {
    closeRunWindow();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && runWindowOverlay && !runWindowOverlay.hidden) {
      closeRunWindow();
    }
  });
}

function openDocsWindow() {
  if (!docsWindowOverlay) return;
  docsWindowOverlay.hidden = false;
  docsWindowOverlay.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => {
    docsWindowOverlay.classList.add('is-visible');
  });
}

function closeDocsWindow() {
  if (!docsWindowOverlay || docsWindowOverlay.hidden) return;
  docsWindowOverlay.classList.remove('is-visible');
  docsWindowOverlay.setAttribute('aria-hidden', 'true');
  window.setTimeout(() => {
    docsWindowOverlay.hidden = true;
  }, 220);
}

function initDocsWindow() {
  btnFooterHelp?.addEventListener('click', () => {
    openDocsWindow();
  });

  btnDocsClose?.addEventListener('click', () => {
    closeDocsWindow();
  });

  docsWindowBackdrop?.addEventListener('click', () => {
    closeDocsWindow();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && docsWindowOverlay && !docsWindowOverlay.hidden) {
      closeDocsWindow();
    }
  });
}

function getStandaloneTitle() {
  if (!isStandaloneView) {
    return String(manifestInfo.name || 'EXtZerzor');
  }
  return `${String(manifestInfo.name || 'extzarzoor')} · ${t('standaloneTitle')}`;
}

function renderLanguageToggle() {
  if (!btnLanguage || !displayLanguageToggle) return;

  displayLanguageToggle.textContent = t('languageToggleLabel');
  const title = currentLanguage === 'zh-CN'
    ? `切换到 ${t('languageToggleNextName')}`
    : `Switch to ${t('languageToggleNextName')}`;
  btnLanguage.title = title;
  btnLanguage.setAttribute('aria-label', title);
}

function renderVersionBadge() {
  if (appTitle) {
    appTitle.textContent = String(manifestInfo.name || 'extzarzoor');
  }

  document.title = getStandaloneTitle();

  if (displayVersion) {
    displayVersion.textContent = currentManifestVersionLabel;
  }

  if (!btnVersion) return;

  btnVersion.classList.toggle('has-update', hasNewRelease);
  const title = getVersionBadgeTitle();
  btnVersion.title = title;
  btnVersion.setAttribute('aria-label', title);
}

async function checkLatestReleaseVersion() {
  if (versionCheckInFlight) return;

  if (!hasReleaseRepo) {
    latestReleaseVersion = currentManifestVersion;
    latestReleaseUrl = '';
    hasNewRelease = false;
    isVersionCheckFinished = true;
    renderVersionBadge();
    return;
  }

  versionCheckInFlight = true;
  isVersionCheckFinished = false;
  renderVersionBadge();

  try {
    const response = await fetch(`https://api.github.com/repos/${releaseRepo}/releases/latest`, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = await response.json();
    const latestTag = normalizeVersionValue(payload?.tag_name || '');
    const latestUrl = String(payload?.html_url || '').trim();

    latestReleaseVersion = latestTag;
    if (latestUrl) {
      latestReleaseUrl = latestUrl;
    }

    hasNewRelease = latestTag
      ? compareVersionValues(latestTag, currentManifestVersion) > 0
      : false;

    isVersionCheckFinished = true;
    renderVersionBadge();

    if (hasNewRelease && !hasShownNewReleaseToast) {
      hasShownNewReleaseToast = true;
      showToast(t('newVersionFound', { latest: formatVersionLabel(latestTag) }), 'warn', 4200);
    }
  } catch (err) {
    latestReleaseVersion = '';
    hasNewRelease = false;
    isVersionCheckFinished = true;
    renderVersionBadge();
    console.warn('Version check failed:', err);
  } finally {
    versionCheckInFlight = false;
  }
}

function getVersionOpenUrl() {
  if (!hasReleaseRepo) {
    return '';
  }
  const currentReleaseUrl = `https://github.com/${releaseRepo}/releases/tag/${currentManifestVersion}`;
  if (hasNewRelease && latestReleaseUrl) {
    return latestReleaseUrl;
  }
  if (latestReleaseVersion) {
    return currentReleaseUrl;
  }
  return latestReleaseUrl || currentReleaseUrl;
}

async function openVersionPage() {
  const url = getVersionOpenUrl();
  if (!url) {
    showToast(getVersionBadgeTitle(), 'info', 2200);
    return;
  }
  try {
    await chrome.tabs.create({ url, active: true });
  } catch {
    window.open(url, '_blank', 'noopener');
  }
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(Number(ms || 0) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function calculateAverageRunDurationMs() {
  if (!completedRunDurationsMs.length) return 0;
  const total = completedRunDurationsMs.reduce((sum, duration) => sum + duration, 0);
  return Math.round(total / completedRunDurationsMs.length);
}

function renderRunMetrics() {
  if (displayElapsed) {
    displayElapsed.textContent = activeRunStartMs
      ? formatDuration(Date.now() - activeRunStartMs)
      : '--:--';
  }

  if (displayAverageDuration) {
    const averageMs = calculateAverageRunDurationMs();
    displayAverageDuration.textContent = averageMs > 0 ? formatDuration(averageMs) : '--:--';
  }

  if (displaySuccessRate) {
    const attempts = finishedRunKeys.size;
    const successes = successfulRunKeys.size;
    displaySuccessRate.textContent = attempts > 0
      ? `${((successes / attempts) * 100).toFixed(1)}%`
      : '--';
  }
}

function startRunMetricsTicker() {
  if (runMetricsTicker !== null) return;
  runMetricsTicker = setInterval(() => {
    renderRunMetrics();
  }, 1000);
}

function stopRunMetricsTickerIfIdle() {
  if (activeRunStartMs) return;
  if (runMetricsTicker === null) return;
  clearInterval(runMetricsTicker);
  runMetricsTicker = null;
}

function beginRunMetrics(flowStartTimeMs) {
  const normalizedStartMs = Number(flowStartTimeMs || 0);
  if (!Number.isFinite(normalizedStartMs) || normalizedStartMs <= 0) {
    return;
  }

  const newRunKey = String(Math.trunc(normalizedStartMs));

  if (activeRunStartMs && activeRunKey && activeRunKey !== newRunKey) {
    finishActiveRunMetrics(false, Number(activeRunKey));
  }

  activeRunStartMs = normalizedStartMs;
  activeRunKey = newRunKey;
  startRunMetricsTicker();
  renderRunMetrics();
}

function finishActiveRunMetrics(success, flowStartTimeMs = 0) {
  if (!activeRunStartMs) return;

  const durationMs = Math.max(0, Date.now() - activeRunStartMs);
  const resolvedKey = String(Math.trunc(Number(flowStartTimeMs || activeRunKey || activeRunStartMs) || 0));

  if (resolvedKey && !finishedRunKeys.has(resolvedKey)) {
    finishedRunKeys.add(resolvedKey);
    if (success) {
      successfulRunKeys.add(resolvedKey);
      completedRunDurationsMs.push(durationMs);
    }
  }

  activeRunStartMs = 0;
  activeRunKey = '';
  stopRunMetricsTickerIfIdle();
  renderRunMetrics();
}

function syncRunMetricsFromState(state) {
  if (!state || !state.stepStatuses) return;

  const flowStartTimeMs = Number(state.flowStartTime || 0);
  const stepStatuses = Object.values(state.stepStatuses || {});
  const hasRunning = stepStatuses.includes('running');
  const hasFailedOrStopped = stepStatuses.some(status => status === 'failed' || status === 'stopped');
  const allProgressed = stepStatuses.length > 0
    && stepStatuses.every(status => status === 'completed' || status === 'skipped');

  if (flowStartTimeMs > 0) {
    beginRunMetrics(flowStartTimeMs);
  } else if (!hasRunning && activeRunStartMs) {
    finishActiveRunMetrics(false, 0);
  }

  if (!activeRunStartMs) {
    renderRunMetrics();
    return;
  }

  if (allProgressed) {
    finishActiveRunMetrics(true, flowStartTimeMs);
    return;
  }

  if (hasFailedOrStopped && !hasRunning) {
    finishActiveRunMetrics(false, flowStartTimeMs);
    return;
  }

  renderRunMetrics();
}

function resetRunMetrics() {
  activeRunStartMs = 0;
  activeRunKey = '';
  completedRunDurationsMs.length = 0;
  finishedRunKeys.clear();
  successfulRunKeys.clear();
  stopRunMetricsTickerIfIdle();
  renderRunMetrics();
}

function getCopyLabel(kind) {
  if (currentLanguage === 'zh-CN') {
    if (kind === 'email') return '邮箱';
    if (kind === 'password') return '密码';
    return '内容';
  }
  if (kind === 'email') return 'email';
  if (kind === 'password') return 'password';
  return 'value';
}

function getEmailSourceLabel() {
  return t('microsoftManagerEmailName');
}

function getFetchEmailTitle() {
  return t('titleFetchEmailMicrosoftManager');
}

function getEmailPlaceholderText() {
  return t('placeholderEmailMicrosoftManager');
}

function getAutoHintText() {
  return t('autoHintEmailMicrosoftManager');
}

function isSub2apiOauthProviderSelected() {
  return selectOauthProvider.value === 'sub2api';
}

function updateOauthProviderUI() {
  const useSub2api = isSub2apiOauthProviderSelected();
  rowCpaAuthUrl.style.display = useSub2api ? 'none' : '';
  rowCpaAuthKey.style.display = useSub2api ? 'none' : '';
  rowSub2apiBaseUrl.style.display = useSub2api ? '' : 'none';
  rowSub2apiApiKey.style.display = useSub2api ? '' : 'none';
  syncSettingsGroups();
}

function applyLanguage(language) {
  currentLanguage = I18N[language] ? language : 'zh-CN';
  localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
  document.documentElement.lang = currentLanguage;

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    node.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    node.placeholder = t(key);
  });
  document.querySelectorAll('[data-i18n-title]').forEach((node) => {
    const key = node.dataset.i18nTitle;
    const title = t(key);
    node.title = title;
    node.setAttribute('aria-label', title);
  });

  inputPassword.placeholder = t('placeholderPassword');
  if (!displayOauthUrl.classList.contains('has-value')) {
    displayOauthUrl.textContent = t('waiting');
  }
  if (!displayLocalhostUrl.classList.contains('has-value')) {
    displayLocalhostUrl.textContent = t('waiting');
  }
  updateOauthProviderUI();
  updateMailProviderUI();
  updateEmailSourceUI();
  renderRunWindowStepShell();
  syncPasswordToggleLabel();
  renderLanguageToggle();
  renderSettingsGroupCopy();
  if (btnTestOauth && !btnTestOauth.disabled) {
    btnTestOauth.textContent = ft('btnTestOauth');
  }
  if (btnTestVerify && !btnTestVerify.disabled) {
    btnTestVerify.textContent = ft('btnTestVerify');
  }
  if (activeFieldHoverTrigger && activeFieldHoverKey && !fieldHoverCard?.hidden) {
    renderFieldHoverCard(activeFieldHoverTrigger, activeFieldHoverKey);
  }
  updateProgressCounter();
  syncSettingsGroups();
  syncRunWindowMirrors();
  renderVersionBadge();
  if (lastKnownState) {
    updateStatusDisplay(lastKnownState);
  } else {
    displayStatus.textContent = t('statusReady');
  }
  renderRunMetrics();
}

async function saveVpsUrlValue(value) {
  const vpsUrl = String(value || '').trim();
  inputVpsUrl.value = vpsUrl;
  syncSettingsGroups();
  if (!vpsUrl) return;
  await chrome.runtime.sendMessage({
    type: 'SAVE_SETTING',
    source: 'sidepanel',
    payload: { vpsUrl },
  });
}

async function copyTextValue(value, kind) {
  const trimmed = String(value || '').trim();
  const label = getCopyLabel(kind);
  if (!trimmed) {
    showToast(t('nothingToCopy', { label }), 'warn');
    return;
  }

  try {
    await navigator.clipboard.writeText(trimmed);
    showToast(t('copiedValue', { label }), 'success', 2000);
  } catch (err) {
    showToast(t('copyFailed', { label, message: err.message || err }), 'error');
  }
}

async function pasteCpaAuthFromClipboard(options = {}) {
  const { silentIfFilled = false } = options;
  if (silentIfFilled && inputVpsUrl.value.trim()) return;

  try {
    const text = String(await navigator.clipboard.readText() || '').trim();
    if (!text) {
      showToast(t('clipboardEmpty'), 'warn');
      return;
    }
    await saveVpsUrlValue(text);
    showToast(t('pastedCpaAuth'), 'success', 2000);
  } catch (err) {
    showToast(t('pasteFailed', { message: err.message || err }), 'warn');
  }
}

function createToastElement(message, type) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `${TOAST_ICONS[type] || ''}<span class="toast-msg">${escapeHtml(message)}</span><button class="toast-close">&times;</button>`;
  toast.querySelector('.toast-close').addEventListener('click', (event) => {
    event.stopPropagation();
    dismissToast(toast);
  });
  toast.addEventListener('click', () => dismissToast(toast));
  return toast;
}

function showToast(message, type = 'error', duration) {
  const primaryToast = createToastElement(message, type);

  const resolvedDuration = typeof duration === 'number'
    ? duration
    : type === 'error'
      ? 9000
      : type === 'warn'
        ? 5000
        : 4000;

  toastContainer.appendChild(primaryToast);

  if (runWindowOverlay && !runWindowOverlay.hidden && runWindowToastContainer) {
    const windowToast = createToastElement(message, type);
    runWindowToastContainer.appendChild(windowToast);
    if (resolvedDuration > 0) {
      setTimeout(() => dismissToast(windowToast), resolvedDuration);
    }
  }

  if (resolvedDuration > 0) {
    setTimeout(() => dismissToast(primaryToast), resolvedDuration);
  }
}

function dismissToast(toast) {
  if (!toast.parentNode) return;
  toast.classList.add('toast-exit');
  toast.addEventListener('animationend', () => toast.remove());
}

// ============================================================
// State Restore on load
// ============================================================

async function restoreState() {
  try {
    const state = await chrome.runtime.sendMessage({ type: 'GET_STATE', source: 'sidepanel' });
    lastKnownState = state;
    applyLanguage(state.language || currentLanguage);

    if (state.oauthUrl) {
      displayOauthUrl.textContent = state.oauthUrl;
      displayOauthUrl.classList.add('has-value');
    }
    if (state.localhostUrl) {
      displayLocalhostUrl.textContent = state.localhostUrl;
      displayLocalhostUrl.classList.add('has-value');
    }
    if (state.email) {
      inputEmail.value = state.email;
    }
    syncPasswordField(state);
    if (state.vpsUrl) {
      inputVpsUrl.value = state.vpsUrl;
    }
    if (state.cpaManagementKey) {
      inputCpaManagementKey.value = state.cpaManagementKey;
    }
    if (state.oauthProvider) {
      selectOauthProvider.value = state.oauthProvider;
    }
    if (state.sub2apiBaseUrl) {
      inputSub2apiBaseUrl.value = state.sub2apiBaseUrl;
    }
    if (state.sub2apiAdminApiKey) {
      inputSub2apiApiKey.value = state.sub2apiAdminApiKey;
    }
    checkboxDeleteBlockedAccount.checked = Boolean(state.deleteAbusedMicrosoftAccount);
    if (state.mailProvider) {
      selectMailProvider.value = normalizeMailProviderValue(state.mailProvider);
    } else {
      selectMailProvider.value = 'microsoft-manager';
    }
    if (state.microsoftManagerUrl) {
      inputMicrosoftManagerUrl.value = state.microsoftManagerUrl;
    }
    if (state.microsoftManagerToken) {
      inputMicrosoftManagerToken.value = state.microsoftManagerToken;
    }
    if (state.microsoftManagerMode) {
      selectMicrosoftManagerMode.value = state.microsoftManagerMode;
    }
    if (state.microsoftManagerKeyword) {
      inputMicrosoftManagerKeyword.value = state.microsoftManagerKeyword;
    }
    checkboxMicrosoftManagerUseAliases.checked = Boolean(state.microsoftManagerUseAliases);

    if (state.stepStatuses) {
      for (const [step, status] of Object.entries(state.stepStatuses)) {
        updateStepUI(Number(step), status);
      }
    }

    if (state.logs) {
      for (const entry of state.logs) {
        appendLog(entry);
      }
    }

    updateStatusDisplay(state);
    updateProgressCounter();
    updateOauthProviderUI();
    updateMailProviderUI();
    updateEmailSourceUI();
    syncRunWindowMirrors();

    if (state.autoRunPausedPhase === 'waiting_email') {
      autoContinueBar.dataset.reason = 'waiting_email';
      autoHint.textContent = getAutoHintText();
      autoContinueBar.style.display = 'flex';
      btnAutoRun.disabled = false;
      inputRunCount.disabled = false;
    } else if (state.autoRunPausedPhase === 'error') {
      autoContinueBar.dataset.reason = 'error';
      autoHint.textContent = t('autoHintError');
      autoContinueBar.style.display = 'flex';
      btnAutoRun.disabled = false;
      inputRunCount.disabled = false;
    }
  } catch (err) {
    console.error('Failed to restore state:', err);
  }
}

function syncPasswordField(state) {
  inputPassword.value = state.customPassword || state.password || '';
}

function updateMailProviderUI() {
  selectMailProvider.value = normalizeMailProviderValue(selectMailProvider.value);
  const useMicrosoftManager = true;
  rowMailProvider.style.display = '';
  selectMailProvider.disabled = selectMailProvider.options.length <= 1;
  rowMicrosoftManagerUrl.style.display = useMicrosoftManager ? '' : 'none';
  rowMicrosoftManagerToken.style.display = useMicrosoftManager ? '' : 'none';
  rowMicrosoftManagerMode.style.display = useMicrosoftManager ? '' : 'none';
  rowMicrosoftManagerKeyword.style.display = useMicrosoftManager ? '' : 'none';
  rowMicrosoftManagerAliasToggle.style.display = useMicrosoftManager ? '' : 'none';
  syncSettingsGroups();
}

function updateEmailSourceUI() {
  inputEmail.placeholder = getEmailPlaceholderText();
  autoHint.textContent = getAutoHintText();
  btnFetchEmail.disabled = false;
  btnFetchEmail.title = getFetchEmailTitle();
  syncSettingsGroups();
}

async function syncRuntimeSettingsBeforeExecution() {
  await chrome.runtime.sendMessage({
    type: 'SAVE_SETTING',
    source: 'sidepanel',
    payload: {
      oauthProvider: selectOauthProvider.value,
      vpsUrl: inputVpsUrl.value.trim(),
      cpaManagementKey: inputCpaManagementKey.value.trim(),
      sub2apiBaseUrl: inputSub2apiBaseUrl.value.trim(),
      sub2apiAdminApiKey: inputSub2apiApiKey.value.trim(),
      deleteAbusedMicrosoftAccount: checkboxDeleteBlockedAccount.checked,
      customPassword: inputPassword.value,
      mailProvider: normalizeMailProviderValue(selectMailProvider.value),
      microsoftManagerUrl: inputMicrosoftManagerUrl.value.trim(),
      microsoftManagerToken: inputMicrosoftManagerToken.value.trim(),
      microsoftManagerMode: selectMicrosoftManagerMode.value,
      microsoftManagerKeyword: inputMicrosoftManagerKeyword.value.trim(),
      microsoftManagerUseAliases: checkboxMicrosoftManagerUseAliases.checked,
    },
  });
}

// ============================================================
// UI Updates
// ============================================================

function updateStepUI(step, status) {
  const statusEl = document.querySelector(`.step-status[data-step="${step}"]`);
  const row = document.querySelector(`.step-row[data-step="${step}"]`);

  if (statusEl) statusEl.textContent = STATUS_ICONS[status] || '';
  if (row) {
    row.className = `step-row ${status}`;
  }

  updateButtonStates();
  updateProgressCounter();
  syncRunWindowWorkflowFromMain();
}

function getVisibleStepEntries(stepStatuses = {}) {
  return WORKFLOW_STEPS.map((step) => [step, stepStatuses?.[step] || 'pending']);
}

function updateProgressCounter() {
  let completed = 0;
  document.querySelectorAll('#steps-section .step-row').forEach(row => {
    if (row.classList.contains('completed') || row.classList.contains('skipped')) completed++;
  });
  stepsProgress.textContent = `${completed} / ${TOTAL_STEPS}`;
  if (runWindowStepsProgress) {
    runWindowStepsProgress.textContent = stepsProgress.textContent;
  }
}

function updateButtonStates() {
  const statuses = {};
  document.querySelectorAll('#steps-section .step-row').forEach(row => {
    const step = Number(row.dataset.step);
    if (row.classList.contains('completed')) statuses[step] = 'completed';
    else if (row.classList.contains('skipped')) statuses[step] = 'skipped';
    else if (row.classList.contains('running')) statuses[step] = 'running';
    else if (row.classList.contains('failed')) statuses[step] = 'failed';
    else if (row.classList.contains('stopped')) statuses[step] = 'stopped';
    else statuses[step] = 'pending';
  });

  const anyRunning = Object.values(statuses).some(s => s === 'running');

  for (const step of WORKFLOW_STEPS) {
    const btn = document.querySelector(`#steps-section .step-btn[data-step="${step}"]`);
    const skipBtn = document.querySelector(`#steps-section .step-skip-btn[data-step="${step}"]`);
    if (!btn) continue;

    const currentStatus = statuses[step];
    const prevStep = step > 1 ? step - 1 : null;

    if (anyRunning) {
      btn.disabled = true;
      if (skipBtn) skipBtn.disabled = true;
    } else if (prevStep === null) {
      btn.disabled = false;
    } else {
      const prevStatus = statuses[prevStep];
      btn.disabled = !(
        prevStatus === 'completed'
        || prevStatus === 'skipped'
        || currentStatus === 'failed'
        || currentStatus === 'completed'
        || currentStatus === 'stopped'
        || currentStatus === 'skipped'
      );
    }

    if (skipBtn) {
      skipBtn.disabled = !(currentStatus === 'failed' || currentStatus === 'stopped');
    }
  }

  updateStopButtonState(anyRunning || autoContinueBar.style.display !== 'none');
}

function updateStopButtonState(active) {
  btnStop.disabled = !active;
  if (btnWindowStop) {
    btnWindowStop.disabled = !active;
  }
}

function updateStatusDisplay(state) {
  if (!state || !state.stepStatuses) return;
  lastKnownState = state;
  syncRunMetricsFromState(state);
  const visibleEntries = getVisibleStepEntries(state.stepStatuses);

  statusBar.className = 'status-bar';

  const running = visibleEntries.find(([, s]) => s === 'running');
  if (running) {
    displayStatus.textContent = t('statusRunning', { step: running[0] });
    statusBar.classList.add('running');
    return;
  }

  const failed = visibleEntries.find(([, s]) => s === 'failed');
  if (failed) {
    displayStatus.textContent = t('statusFailed', { step: failed[0] });
    statusBar.classList.add('failed');
    return;
  }

  const stopped = visibleEntries.find(([, s]) => s === 'stopped');
  if (stopped) {
    displayStatus.textContent = t('statusStopped', { step: stopped[0] });
    statusBar.classList.add('stopped');
    return;
  }

  const allProgressed = visibleEntries.every(([, s]) => s === 'completed' || s === 'skipped');
  if (allProgressed) {
    displayStatus.textContent = t('statusAllFinished');
    statusBar.classList.add('completed');
    return;
  }

  const lastProgressed = visibleEntries
    .filter(([, s]) => s === 'completed' || s === 'skipped')
    .map(([k]) => Number(k))
    .sort((a, b) => b - a)[0];

  if (lastProgressed) {
    displayStatus.textContent = state.stepStatuses[lastProgressed] === 'skipped'
      ? t('statusSkipped', { step: lastProgressed })
      : t('statusDone', { step: lastProgressed });
  } else {
    displayStatus.textContent = t('statusReady');
  }
}

function appendLog(entry) {
  const time = new Date(entry.timestamp).toLocaleTimeString('en-US', { hour12: false });
  const levelLabel = entry.level.toUpperCase();
  const line = document.createElement('div');
  line.className = `log-line log-${entry.level}`;
  const displayMessage = String(entry.message || '');

  const stepMatch = entry.message.match(/Step (\d+)/);
  const stepNum = stepMatch ? stepMatch[1] : null;

  let html = `<span class="log-time">${time}</span> `;
  html += `<span class="log-level log-level-${entry.level}">${levelLabel}</span> `;
  if (stepNum) {
    html += `<span class="log-step-tag step-${stepNum}">S${stepNum}</span>`;
  }
  html += `<span class="log-msg">${escapeHtml(displayMessage)}</span>`;

  line.innerHTML = html;
  logArea.appendChild(line);
  logArea.scrollTop = logArea.scrollHeight;
  syncRunWindowLogFromMain();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function fetchConfiguredEmail() {
  const defaultLabel = t('btnAuto');
  btnFetchEmail.disabled = true;
  btnFetchEmail.textContent = '...';

  try {
    const response = await chrome.runtime.sendMessage({
      type: 'FETCH_AUTO_EMAIL',
      source: 'sidepanel',
      payload: { generateNew: true },
    });

    if (response?.error) {
      throw new Error(response.error);
    }
    if (!response?.email) {
      throw new Error('Email was not returned.');
    }

    inputEmail.value = response.email;
    syncSettingsGroups();
    showToast(t('fetchedEmail', { email: response.email }), 'success', 2500);
    return response.email;
  } catch (err) {
    showToast(t('autoFetchFailed', { message: err.message }), 'error');
    throw err;
  } finally {
    btnFetchEmail.disabled = false;
    btnFetchEmail.textContent = defaultLabel;
  }
}

function syncPasswordToggleLabel() {
  btnTogglePassword.textContent = inputPassword.type === 'password' ? t('btnShow') : t('btnHide');
}

async function requestStopFlow() {
  btnStop.disabled = true;
  if (btnWindowStop) {
    btnWindowStop.disabled = true;
  }
  await chrome.runtime.sendMessage({ type: 'STOP_FLOW', source: 'sidepanel', payload: {} });
  showToast(t('stoppingFlow'), 'warn', 2000);
}

// ============================================================
// Button Handlers
// ============================================================

document.querySelectorAll('.step-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const step = Number(btn.dataset.step);
    await syncRuntimeSettingsBeforeExecution();
    if (step === 3) {
      const email = inputEmail.value.trim();
      if (!email) {
        showToast(t('pleaseEnterEmailFirst'), 'warn');
        return;
      }
      await chrome.runtime.sendMessage({ type: 'EXECUTE_STEP', source: 'sidepanel', payload: { step, email } });
    } else {
      await chrome.runtime.sendMessage({ type: 'EXECUTE_STEP', source: 'sidepanel', payload: { step } });
    }
  });
});

document.querySelectorAll('.step-skip-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const step = Number(btn.dataset.step);
    const response = await chrome.runtime.sendMessage({
      type: 'SKIP_STEP',
      source: 'sidepanel',
      payload: { step },
    });
    if (response?.error) {
      showToast(t('skipFailed', { message: response.error }), 'error');
      return;
    }
    showToast(t('stepSkippedToast', { step }), 'warn', 2000);
  });
});

btnFetchEmail.addEventListener('click', async () => {
  await fetchConfiguredEmail().catch(() => {});
});

btnCopyEmail.addEventListener('click', async () => {
  await copyTextValue(inputEmail.value, 'email');
});

btnCopyPassword.addEventListener('click', async () => {
  await copyTextValue(inputPassword.value, 'password');
});

btnPasteVpsUrl.addEventListener('click', async () => {
  await pasteCpaAuthFromClipboard();
});

btnTogglePassword.addEventListener('click', () => {
  inputPassword.type = inputPassword.type === 'password' ? 'text' : 'password';
  syncPasswordToggleLabel();
});

btnVersion.addEventListener('click', async () => {
  if (!isVersionCheckFinished && !versionCheckInFlight) {
    await checkLatestReleaseVersion();
  }
  await openVersionPage();
});

btnTestOauth?.addEventListener('click', async () => {
  await testOAuthConfig();
});

btnTestVerify?.addEventListener('click', async () => {
  await testVerifyConfig();
});

btnStop.addEventListener('click', async () => {
  await requestStopFlow();
});

// Auto Run
btnAutoRun.addEventListener('click', async () => {
  if (!validateRunPreflight()) {
    return;
  }

  assistRecoveryMessage = '';
  renderAssistBanner();
  const totalRuns = parseInt(inputRunCount.value) || 1;
  resetRunMetrics();
  btnAutoRun.disabled = true;
  inputRunCount.disabled = true;
  setAutoRunButton(t('autoRunRunning', { runLabel: '' }));
  openRunWindow();
  await syncRuntimeSettingsBeforeExecution();
  await chrome.runtime.sendMessage({ type: 'AUTO_RUN', source: 'sidepanel', payload: { totalRuns } });
});

btnAutoContinue.addEventListener('click', async () => {
  const reason = autoContinueBar.dataset.reason || 'waiting_email';
  const email = inputEmail.value.trim();
  if (reason === 'waiting_email' && !email) {
    showToast(t('continueNeedEmail'), 'warn');
    return;
  }
  const response = await chrome.runtime.sendMessage({
    type: 'CONTINUE_AUTO_RUN',
    source: 'sidepanel',
    payload: { email },
  });
  if (response?.error) {
    showToast(t('continueFailed', { message: response.error }), 'error');
    return;
  }
  autoContinueBar.style.display = 'none';
  autoContinueBar.dataset.reason = '';
});

// Reset
btnReset.addEventListener('click', async () => {
  if (confirm(t('confirmReset'))) {
    await chrome.runtime.sendMessage({ type: 'RESET', source: 'sidepanel' });
    displayOauthUrl.textContent = t('waiting');
    displayOauthUrl.classList.remove('has-value');
    displayLocalhostUrl.textContent = t('waiting');
    displayLocalhostUrl.classList.remove('has-value');
    inputEmail.value = '';
    displayStatus.textContent = t('statusReady');
    statusBar.className = 'status-bar';
    logArea.innerHTML = '';
    document.querySelectorAll('#steps-section .step-row').forEach(row => row.className = 'step-row');
    document.querySelectorAll('#steps-section .step-status').forEach(el => el.textContent = '');
    btnAutoRun.disabled = false;
    inputRunCount.disabled = false;
    setAutoRunButton(t('titleAutoRun'));
    autoContinueBar.style.display = 'none';
    updateStopButtonState(false);
    updateButtonStates();
    updateProgressCounter();
    resetRunMetrics();
    syncSettingsGroups();
    syncRunWindowMirrors();
  }
});

// Clear log
btnClearLog.addEventListener('click', () => {
  logArea.innerHTML = '';
  syncRunWindowLogFromMain();
});

// Save settings on change
inputEmail.addEventListener('change', async () => {
  const email = inputEmail.value.trim();
  syncSettingsGroups();
  if (email) {
    await chrome.runtime.sendMessage({ type: 'SAVE_EMAIL', source: 'sidepanel', payload: { email } });
  }
});

inputVpsUrl.addEventListener('change', async () => {
  const vpsUrl = inputVpsUrl.value.trim();
  syncSettingsGroups();
  if (vpsUrl) {
    await chrome.runtime.sendMessage({ type: 'SAVE_SETTING', source: 'sidepanel', payload: { vpsUrl } });
  }
});

inputVpsUrl.addEventListener('click', async () => {
  await pasteCpaAuthFromClipboard({ silentIfFilled: true });
});

inputCpaManagementKey.addEventListener('change', async () => {
  await chrome.runtime.sendMessage({
    type: 'SAVE_SETTING',
    source: 'sidepanel',
    payload: { cpaManagementKey: inputCpaManagementKey.value.trim() },
  });
});

selectOauthProvider.addEventListener('change', async () => {
  updateOauthProviderUI();
  await chrome.runtime.sendMessage({
    type: 'SAVE_SETTING',
    source: 'sidepanel',
    payload: { oauthProvider: selectOauthProvider.value },
  });
});

inputSub2apiBaseUrl.addEventListener('change', async () => {
  syncSettingsGroups();
  await chrome.runtime.sendMessage({
    type: 'SAVE_SETTING',
    source: 'sidepanel',
    payload: { sub2apiBaseUrl: inputSub2apiBaseUrl.value.trim() },
  });
});

inputSub2apiApiKey.addEventListener('change', async () => {
  await chrome.runtime.sendMessage({
    type: 'SAVE_SETTING',
    source: 'sidepanel',
    payload: { sub2apiAdminApiKey: inputSub2apiApiKey.value.trim() },
  });
});

inputPassword.addEventListener('change', async () => {
  await chrome.runtime.sendMessage({
    type: 'SAVE_SETTING',
    source: 'sidepanel',
    payload: { customPassword: inputPassword.value },
  });
});

checkboxDeleteBlockedAccount.addEventListener('change', async () => {
  await chrome.runtime.sendMessage({
    type: 'SAVE_SETTING',
    source: 'sidepanel',
    payload: { deleteAbusedMicrosoftAccount: checkboxDeleteBlockedAccount.checked },
  });
});

selectMailProvider.addEventListener('change', async () => {
  selectMailProvider.value = normalizeMailProviderValue(selectMailProvider.value);
  updateMailProviderUI();
  updateEmailSourceUI();
  await chrome.runtime.sendMessage({
    type: 'SAVE_SETTING', source: 'sidepanel',
    payload: { mailProvider: normalizeMailProviderValue(selectMailProvider.value) },
  });
});

if (btnLanguage) {
  btnLanguage.addEventListener('click', async () => {
    const nextLanguage = currentLanguage === 'zh-CN' ? 'en-US' : 'zh-CN';
    applyLanguage(nextLanguage);
    await chrome.runtime.sendMessage({
      type: 'SAVE_SETTING',
      source: 'sidepanel',
      payload: { language: currentLanguage },
    });
  });
}

if (btnExpand) {
  btnExpand.addEventListener('click', async () => {
    const url = `${chrome.runtime.getURL('sidepanel/sidepanel.html')}?view=standalone`;
    try {
      await chrome.tabs.create({ url, active: true });
    } catch (err) {
      window.open(url, '_blank', 'noopener');
      console.warn('Failed to open standalone view:', err);
    }
  });
}

[
  inputEmail,
  inputVpsUrl,
  inputSub2apiBaseUrl,
  inputMicrosoftManagerUrl,
  inputMicrosoftManagerToken,
].forEach((control) => {
  control?.addEventListener('input', () => {
    syncSettingsGroups();
  });
});

inputMicrosoftManagerUrl.addEventListener('change', async () => {
  syncSettingsGroups();
  await chrome.runtime.sendMessage({
    type: 'SAVE_SETTING',
    source: 'sidepanel',
    payload: { microsoftManagerUrl: inputMicrosoftManagerUrl.value.trim() },
  });
});

inputMicrosoftManagerToken.addEventListener('change', async () => {
  syncSettingsGroups();
  await chrome.runtime.sendMessage({
    type: 'SAVE_SETTING',
    source: 'sidepanel',
    payload: { microsoftManagerToken: inputMicrosoftManagerToken.value.trim() },
  });
});

selectMicrosoftManagerMode.addEventListener('change', async () => {
  syncSettingsGroups();
  await chrome.runtime.sendMessage({
    type: 'SAVE_SETTING',
    source: 'sidepanel',
    payload: { microsoftManagerMode: selectMicrosoftManagerMode.value },
  });
});

inputMicrosoftManagerKeyword.addEventListener('change', async () => {
  await chrome.runtime.sendMessage({
    type: 'SAVE_SETTING',
    source: 'sidepanel',
    payload: { microsoftManagerKeyword: inputMicrosoftManagerKeyword.value.trim() },
  });
});

checkboxMicrosoftManagerUseAliases.addEventListener('change', async () => {
  await chrome.runtime.sendMessage({
    type: 'SAVE_SETTING',
    source: 'sidepanel',
    payload: { microsoftManagerUseAliases: checkboxMicrosoftManagerUseAliases.checked },
  });
});

// ============================================================
// Listen for Background broadcasts
// ============================================================

chrome.runtime.onMessage.addListener((message) => {
  switch (message.type) {
    case 'LOG_ENTRY':
      appendLog(message.payload);
      if (message.payload.level === 'error') {
        assistRecoveryMessage = String(message.payload.message || '');
        renderAssistBanner();
        showToast(String(message.payload.message || ''), 'error');
      }
      break;

    case 'STEP_STATUS_CHANGED': {
      const { step, status } = message.payload;
      updateStepUI(step, status);
      chrome.runtime.sendMessage({ type: 'GET_STATE', source: 'sidepanel' }).then(updateStatusDisplay);
      if (status === 'completed') {
        chrome.runtime.sendMessage({ type: 'GET_STATE', source: 'sidepanel' }).then(state => {
          syncPasswordField(state);
          if (state.oauthUrl) {
            displayOauthUrl.textContent = state.oauthUrl;
            displayOauthUrl.classList.add('has-value');
          }
          if (state.localhostUrl) {
            displayLocalhostUrl.textContent = state.localhostUrl;
            displayLocalhostUrl.classList.add('has-value');
          }
          syncSettingsGroups();
        });
      }
      break;
    }

    case 'AUTO_RUN_RESET': {
      // Full UI reset for next run
      displayOauthUrl.textContent = t('waiting');
      displayOauthUrl.classList.remove('has-value');
      displayLocalhostUrl.textContent = t('waiting');
      displayLocalhostUrl.classList.remove('has-value');
      inputEmail.value = '';
      displayStatus.textContent = t('statusReady');
      statusBar.className = 'status-bar';
      logArea.innerHTML = '';
      document.querySelectorAll('#steps-section .step-row').forEach(row => row.className = 'step-row');
      document.querySelectorAll('#steps-section .step-status').forEach(el => el.textContent = '');
      updateStopButtonState(false);
      updateProgressCounter();
      renderRunMetrics();
      syncSettingsGroups();
      syncRunWindowMirrors();
      break;
    }

    case 'DATA_UPDATED': {
      if (message.payload.email) {
        inputEmail.value = message.payload.email;
        syncSettingsGroups();
      }
      if (message.payload.password !== undefined) {
        inputPassword.value = message.payload.password || '';
      }
      if (message.payload.oauthUrl) {
        displayOauthUrl.textContent = message.payload.oauthUrl;
        displayOauthUrl.classList.add('has-value');
        syncSettingsGroups();
      }
      if (message.payload.localhostUrl) {
        displayLocalhostUrl.textContent = message.payload.localhostUrl;
        displayLocalhostUrl.classList.add('has-value');
        syncSettingsGroups();
      }
      if (message.payload.flowStartTime) {
        chrome.runtime.sendMessage({ type: 'GET_STATE', source: 'sidepanel' })
          .then(updateStatusDisplay)
          .catch(() => {});
      }
      syncRunWindowMirrors();
      break;
    }

    case 'AUTO_RUN_STATUS': {
      const { phase, currentRun, totalRuns } = message.payload;
      const runLabel = totalRuns > 1 ? ` (${currentRun}/${totalRuns})` : '';
      switch (phase) {
        case 'waiting_email':
          autoContinueBar.dataset.reason = 'waiting_email';
          autoHint.textContent = getAutoHintText();
          autoContinueBar.style.display = 'flex';
          setAutoRunButton(t('autoRunPaused', { runLabel }));
          btnAutoRun.disabled = false;
          inputRunCount.disabled = false;
          updateStopButtonState(true);
          break;
        case 'error':
          autoContinueBar.dataset.reason = 'error';
          autoHint.textContent = t('autoHintError');
          autoContinueBar.style.display = 'flex';
          setAutoRunButton(t('autoRunInterrupted', { runLabel }));
          btnAutoRun.disabled = false;
          inputRunCount.disabled = false;
          updateStopButtonState(false);
          finishActiveRunMetrics(false, Number(lastKnownState?.flowStartTime || 0));
          assistRecoveryMessage = autoHint.textContent;
          renderAssistBanner();
          break;
        case 'running':
          autoContinueBar.dataset.reason = '';
          autoContinueBar.style.display = 'none';
          setAutoRunButton(t('autoRunRunning', { runLabel }));
          btnAutoRun.disabled = true;
          inputRunCount.disabled = true;
          updateStopButtonState(true);
          break;
        case 'complete':
          btnAutoRun.disabled = false;
          inputRunCount.disabled = false;
          setAutoRunButton(t('titleAutoRun'));
          autoContinueBar.style.display = 'none';
          autoContinueBar.dataset.reason = '';
          updateStopButtonState(false);
          assistRecoveryMessage = '';
          renderAssistBanner();
          break;
        case 'stopped':
          btnAutoRun.disabled = false;
          inputRunCount.disabled = false;
          setAutoRunButton(t('titleAutoRun'));
          autoContinueBar.style.display = 'none';
          autoContinueBar.dataset.reason = '';
          updateStopButtonState(false);
          finishActiveRunMetrics(false, Number(lastKnownState?.flowStartTime || 0));
          break;
      }
      chrome.runtime.sendMessage({ type: 'GET_STATE', source: 'sidepanel' })
        .then(updateStatusDisplay)
        .catch(() => {});
      break;
    }
  }
});

// ============================================================
// Theme Toggle
// ============================================================

const btnTheme = document.getElementById('btn-theme');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function initTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY)
    || localStorage.getItem(LEGACY_THEME_STORAGE_KEY)
    || localStorage.getItem(LEGACY_THEME_STORAGE_KEY_2);
  if (saved) {
    setTheme(saved);
  } else {
    setTheme('dark');
  }
}

btnTheme.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// ============================================================
// Init
// ============================================================

initTheme();
initSettingsGroups();
initFieldHoverCard();
initRunWindow();
initDocsWindow();
applyLanguage(currentLanguage);
renderVersionBadge();
restoreState().then(() => {
  syncPasswordToggleLabel();
  updateButtonStates();
  checkLatestReleaseVersion().catch(() => {});
});
