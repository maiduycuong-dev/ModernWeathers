const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const errorMsg = document.getElementById('errorMsg');
const loadingMsg = document.getElementById('loadingMsg');

const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const themeBtns = document.querySelectorAll('.theme-btn');
const styleBtns = document.querySelectorAll('.style-btn');
const fontBtns = document.querySelectorAll('.font-btn');
const unitBtns = document.querySelectorAll('.unit-btn');
const langBtns = document.querySelectorAll('.lang-btn');
const glassSlider = document.getElementById('glassSlider');
const sizeSlider = document.getElementById('sizeSlider');
const weatherCard = document.getElementById('weatherCard');

const historyModalBtn = document.getElementById('historyModalBtn');
const historyModal = document.getElementById('historyModal');
const closeHistoryBtn = document.getElementById('closeHistoryBtn');
const calGrid = document.getElementById('calGrid');
const calMonthYear = document.getElementById('calMonthYear');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const calTodayBtn = document.getElementById('calTodayBtn');
const calWeekdaysContainer = document.getElementById('calWeekdaysContainer');

const hourSelectorBox = document.getElementById('hourSelectorBox');
const hourGrid = document.getElementById('hourGrid');
const selectedHourDisplay = document.getElementById('selectedHourDisplay');
const labelHourSelect = document.getElementById('labelHourSelect');

const cardTitle = document.getElementById('cardTitle');
const labelTheme = document.getElementById('labelTheme');
const labelStyle = document.getElementById('labelStyle');
const labelGlass = document.getElementById('labelGlass');
const labelCardSize = document.getElementById('labelCardSize');
const labelFont = document.getElementById('labelFont');
const labelUnit = document.getElementById('labelUnit');
const labelLang = document.getElementById('labelLang');
const labelHistoryTitle = document.getElementById('labelHistoryTitle');
const labelHumidity = document.getElementById('labelHumidity');
const labelWind = document.getElementById('labelWind');
const labelUV = document.getElementById('labelUV');

const cityName = document.getElementById('cityName');
const localTime = document.getElementById('localTime');
const temp = document.getElementById('temp');
const unitSymbol = document.getElementById('unitSymbol');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const uvIndex = document.getElementById('uvIndex');

let currentCityTimezone = null;
let clockInterval = null;
let currentTempC = null;
let currentUnit = 'C';
let currentLang = 'en';
let lastWeatherCode = null;
let selectedArchiveDate = localISODate();
let selectedHourValue = new Date().getHours();

let viewYear = new Date().getFullYear();
let viewMonth = new Date().getMonth();

let currentLat = null;
let currentLon = null;
let currentWeatherData = null;
let isArchiveMode = false;

const i18n = {
    en: {
        title: "Check the Weather",
        searchPlaceholder: "Enter city name...",
        searchBtn: "Search",
        loading: "Loading weather data...",
        error: "City not found or network error!",
        humidity: "Humidity",
        wind: "Wind",
        uv: "UV Index",
        theme: "Background Theme",
        style: "User Interface Style",
        glass: "Interface Level",
        cardSize: "Card Size",
        font: "Fonts Theme",
        unit: "Temperature Unit",
        lang: "Languages",
        historyTitle: "Select Date",
        today: "Today",
        selectHour: "Select Hour:",
        weekdays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    },
    zh: {
        title: "查看天气",
        searchPlaceholder: "输入城市名称...",
        searchBtn: "搜索",
        loading: "正在加载天气数据...",
        error: "未找到城市或网络错误！",
        humidity: "湿度",
        wind: "风速",
        uv: "紫外线指数",
        theme: "背景主题",
        style: "用户界面样式",
        glass: "界面级别",
        cardSize: "卡片尺寸",
        font: "字体主题",
        unit: "温度单位",
        lang: "语言",
        historyTitle: "选择日期",
        today: "今天",
        selectHour: "选择时间:",
        weekdays: ["一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
    },
    vi: {
        title: "Tra cứu thời tiết",
        searchPlaceholder: "Nhập tên thành phố...",
        searchBtn: "Tìm kiếm",
        loading: "Đang tải dữ liệu thời tiết...",
        error: "Không tìm thấy thành phố hoặc lỗi mạng!",
        humidity: "Độ ẩm",
        wind: "Gió",
        uv: "Tia UV",
        theme: "Chủ đề nền",
        style: "Kiểu giao diện người dùng",
        glass: "Mức độ giao diện",
        cardSize: "Kích thước bảng",
        font: "Phông chữ",
        unit: "Đơn vị nhiệt độ",
        lang: "Ngôn ngữ",
        historyTitle: "Chọn Ngày",
        today: "Hôm nay",
        selectHour: "Chọn giờ:",
        weekdays: ["Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy", "CN"],
        months: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"]
    },
    th: {
        title: "ตรวจสอบสภาพอากาศ",
        searchPlaceholder: "ป้อนชื่อเมือง...",
        searchBtn: "ค้นหา",
        loading: "กำลังโหลดข้อมูล...",
        error: "ไม่พบเมืองหรือข้อผิดพลาดเครือข่าย!",
        humidity: "ความชื้น",
        wind: "ลม",
        uv: "ดัชนี UV",
        theme: "ธีมพื้นหลัง",
        style: "รูปแบบอินเทอร์เฟซ",
        glass: "ระดับอินเทอร์เฟซ",
        cardSize: "ขนาดการ์ด",
        font: "ธีมฟอนต์",
        unit: "หน่วยอุณหภูมิ",
        lang: "ภาษา",
        historyTitle: "เลือกวันที่",
        today: "วันนี้",
        selectHour: "เลือกชั่วโมง:",
        weekdays: ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"],
        months: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]
    },
    lo: {
        title: "ກວດສອບສະພາບອາກາດ",
        searchPlaceholder: "ປ້ອນຊື່ເມືອງ...",
        searchBtn: "ຄົ້ນຫາ",
        loading: "ກຳລັງໂຫລດ...",
        error: "ບໍ່ພົບເມືອງ ຫຼື ເຄືອຂ່າຍຜິດພາດ!",
        humidity: "ຄວາມຊຸ່ມ",
        wind: "ລົມ",
        uv: "ດັດຊະນີ UV",
        theme: "ຮູບແບບພື້ນຫຼັງ",
        style: "ຮູບແບບອິນເຕີເຟດ",
        glass: "ລະດັບອິນເຕີເຟດ",
        cardSize: "ຂະໜາດບັດ",
        font: "ຮູບແບບຕົວອັກສອນ",
        unit: "ຫົວໜ່ວຍອຸນຫະພູມ",
        lang: "ພາສາ",
        historyTitle: "ເລືອກວັນທີ",
        today: "ມື້ນີ້",
        selectHour: "ເລືອກຊົ່ວໂມງ:",
        weekdays: ["ຈ", "ອ", "ພ", "ພະ", "ສຸກ", "ເສົາ", "ອາ"],
        months: ["ມັງກອນ", "ກຸມພາ", "ມີນາ", "ເມສາ", "ພຶດສະພາ", "ມິຖຸນາ", "ກໍລະກົດ", "ສິງຫາ", "ກັນຍາ", "ຕຸລາ", "ພະຈິກ", "ທັນວາ"]
    },
    hi: {
        title: "मौसम की जाँच करें",
        searchPlaceholder: "शहर का नाम दर्ज करें...",
        searchBtn: "खोज",
        loading: "डेटा लोड हो रहा है...",
        error: "शहर नहीं मिला या नेटवर्क त्रुटि!",
        humidity: "नमी",
        wind: "हवा",
        uv: "यूवी इंडेक्स",
        theme: "पृष्ठभूमि थीम",
        style: "इंटरफ़ेस शैली",
        glass: "इंटरफ़ेस स्तर",
        cardSize: "कार्ड का आकार",
        font: "फ़ॉन्ट थीम",
        unit: "तापमान इकाई",
        lang: "भाषाएं",
        historyTitle: "तारीख चुनें",
        today: "आज",
        selectHour: "घंटा चुनें:",
        weekdays: ["सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि", "रवि"],
        months: ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"]
    },
    id: {
        title: "Cek Cuaca",
        searchPlaceholder: "Masukkan nama kota...",
        searchBtn: "Cari",
        loading: "Memuat data cuaca...",
        error: "Kota tidak ditemukan atau kesalahan jaringan!",
        humidity: "Kelembaban",
        wind: "Angin",
        uv: "Indeks UV",
        theme: "Tema Latar Belakang",
        style: "Gaya Antarmuka",
        glass: "Tingkat Antarmuka",
        cardSize: "Ukuran Kartu",
        font: "Tema Font",
        unit: "Satuan Suhu",
        lang: "Bahasa",
        historyTitle: "Pilih Tanggal",
        today: "Hari Ini",
        selectHour: "Pilih Jam:",
        weekdays: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
        months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
    },
    ar: {
        title: "تحقق من الطقس",
        searchPlaceholder: "أدخل اسم المدينة...",
        searchBtn: "بحث",
        loading: "جارٍ تحميل بيانات الطقس...",
        error: "المدينة غير موجودة أو خطأ في الشبكة!",
        humidity: "الرطوبة",
        wind: "الرياح",
        uv: "مؤشر الأشعة فوق البنفسجية",
        theme: "خلفية السمة",
        style: "نمط الواجهة",
        glass: "مستوى الواجهة",
        cardSize: "حجم البطاقة",
        font: "سمة الخط",
        unit: "وحدة الحرارة",
        lang: "اللغات",
        historyTitle: "اختر التاريخ",
        today: "اليوم",
        selectHour: "اختر الساعة:",
        weekdays: ["اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت", "أحد"],
        months: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
    },
    es: {
        title: "Consultar el Clima",
        searchPlaceholder: "Ingrese el nombre de la ciudad...",
        searchBtn: "Buscar",
        loading: "Cargando datos...",
        error: "¡Ciudad no encontrada o error de red!",
        humidity: "Humedad",
        wind: "Viento",
        uv: "Índice UV",
        theme: "Tema de Fondo",
        style: "Estilo de Interfaz",
        glass: "Nivel de Interfaz",
        cardSize: "Tamaño de Tarjeta",
        font: "Tema de Fuente",
        unit: "Unidad de Temperatura",
        lang: "Idiomas",
        historyTitle: "Seleccionar Fecha",
        today: "Hoy",
        selectHour: "Seleccionar Hora:",
        weekdays: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"],
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    },
    pt: {
        title: "Verificar o Clima",
        searchPlaceholder: "Insira o nome da cidade...",
        searchBtn: "Pesquisar",
        loading: "A carregar dados...",
        error: "Cidade não encontrada ou erro de rede!",
        humidity: "Humidade",
        wind: "Vento",
        uv: "Índice UV",
        theme: "Tema de Fundo",
        style: "Estilo de Interface",
        glass: "Nível de Interface",
        cardSize: "Tamanho do Cartão",
        font: "Tema de Fonte",
        unit: "Unidade de Temperatura",
        lang: "Idiomas",
        historyTitle: "Selecionar Data",
        today: "Hoje",
        selectHour: "Selecionar Hora:",
        weekdays: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
        months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    },
    nl: {
        title: "Het Weer Bekijken",
        searchPlaceholder: "Voer stadnaam in...",
        searchBtn: "Zoeken",
        loading: "Gegevens laden...",
        error: "Stad niet gevonden of netwerkfout!",
        humidity: "Luchtvochtigheid",
        wind: "Wind",
        uv: "UV-index",
        theme: "Achtergrondthema",
        style: "Interface Stijl",
        glass: "Interface Niveau",
        cardSize: "Kaartgrootte",
        font: "Lettertype",
        unit: "Temperatuureenheid",
        lang: "Talen",
        historyTitle: "Selecteer Datum",
        today: "Vandaag",
        selectHour: "Selecteer Uur:",
        weekdays: ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"],
        months: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"]
    },
    da: {
        title: "Tjek Vejret",
        searchPlaceholder: "Indtast bynavn...",
        searchBtn: "Søg",
        loading: "Indlæser data...",
        error: "By ikke fundet eller netværksfejl!",
        humidity: "Fugtighed",
        wind: "Vind",
        uv: "UV-indeks",
        theme: "Baggrundstema",
        style: "Grænsefladestil",
        glass: "Grænsefladeniveau",
        cardSize: "Kortstørrelse",
        font: "Skrifttypetema",
        unit: "Temperaturenhed",
        lang: "Sprog",
        historyTitle: "Vælg Dato",
        today: "I dag",
        selectHour: "Vælg Time:",
        weekdays: ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"],
        months: ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"]
    },
    fr: {
        title: "Vérifier la météo",
        searchPlaceholder: "Entrez le nom de la ville...",
        searchBtn: "Chercher",
        loading: "Chargement des données...",
        error: "Ville introuvable ou erreur réseau !",
        humidity: "Humidité",
        wind: "Vent",
        uv: "Indice UV",
        theme: "Thème d'arrière-plan",
        style: "Style d'interface",
        glass: "Niveau d'interface",
        cardSize: "Taille de la carte",
        font: "Police",
        unit: "Unité de température",
        lang: "Langues",
        historyTitle: "Sélectionner la date",
        today: "Aujourd'hui",
        selectHour: "Sélectionner l'heure:",
        weekdays: ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
        months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
    },
    de: {
        title: "Wetter prüfen",
        searchPlaceholder: "Stadtnamen eingeben...",
        searchBtn: "Suchen",
        loading: "Lade Wetterdaten...",
        error: "Stadt nicht gefunden oder Netzwerkfehler!",
        humidity: "Luftfeuchtigkeit",
        wind: "Wind",
        uv: "UV-Index",
        theme: "Hintergrundthema",
        style: "Benutzeroberflächenstil",
        glass: "Schnittstellenebene",
        cardSize: "Kartengröße",
        font: "Schriftart",
        unit: "Temperatureinheit",
        lang: "Sprachen",
        historyTitle: "Datum auswählen",
        today: "Heute",
        selectHour: "Stunde wählen:",
        weekdays: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
        months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
    },
    ru: {
        title: "Проверить погоду",
        searchPlaceholder: "Введите название города...",
        searchBtn: "Поиск",
        loading: "Загрузка данных о погоде...",
        error: "Город не найден или ошибка сети!",
        humidity: "Влажность",
        wind: "Ветер",
        uv: "Индекс УФ",
        theme: "Тема фона",
        style: "Стиль интерфейса",
        glass: "Уровень интерфейса",
        cardSize: "Размер карточки",
        font: "Шрифт",
        unit: "Единица измерения",
        lang: "Языки",
        historyTitle: "Выбрать дату",
        today: "Сегодня",
        selectHour: "Выбрать час:",
        weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
        months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
    },
    ja: {
        title: "天気予報を確認",
        searchPlaceholder: "都市名を入力...",
        searchBtn: "検索",
        loading: "天気データを読み込み中...",
        error: "都市が見つからないか、ネットワークエラーです！",
        humidity: "湿度",
        wind: "風速",
        uv: "紫外線指数",
        theme: "背景テーマ",
        style: "UIスタイル",
        glass: "インターフェースレベル",
        cardSize: "カードサイズ",
        font: "フォントテーマ",
        unit: "温度単位",
        lang: "言語",
        historyTitle: "日付を選択",
        today: "今日",
        selectHour: "時間を選択:",
        weekdays: ["月", "火", "水", "木", "金", "土", "日"],
        months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
    },
    ko: {
        title: "날씨 확인하기",
        searchPlaceholder: "도시 이름 입력...",
        searchBtn: "검색",
        loading: "날씨 데이터를 불러오는 중...",
        error: "도시를 찾을 수 없거나 네트워크 오류입니다!",
        humidity: "습도",
        wind: "바람",
        uv: "자외선 지수",
        theme: "배경 테마",
        style: "사용자 인터페이스 스타일",
        glass: "인터페이스 레벨",
        cardSize: "카드 크기",
        font: "글꼴 테마",
        unit: "온도 단위",
        lang: "언어",
        historyTitle: "날짜 선택",
        today: "오늘",
        selectHour: "시간 선택:",
        weekdays: ["월", "화", "수", "목", "금", "토", "일"],
        months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
    }
};

/* ============================================================
   Helpers
   ============================================================ */
function pad2(n) {
    return String(n).padStart(2, '0');
}

// Ngày theo GIỜ ĐỊA PHƯƠNG (toISOString() trả về ngày UTC nên sai từ 0h-7h ở Việt Nam)
function localISODate(d = new Date()) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// localStorage có thể bị chặn (chế độ riêng tư...) nên luôn bọc try/catch
const store = {
    get(key, fallback) {
        try {
            const v = localStorage.getItem(key);
            return v === null ? fallback : v;
        } catch (e) { return fallback; }
    },
    set(key, value) {
        try { localStorage.setItem(key, value); } catch (e) { /* bỏ qua */ }
    }
};

const THEMES = ['default', 'blue', 'sunset', 'emerald', 'crimson', 'purple', 'sunny', 'silver', 'dark'];
const STYLES = ['glass', 'mica', 'material'];
const UNITS = ['C', 'F', 'K', 'R'];
const RTL_LANGS = ['ar'];
const RECENT_DAYS = 7; // ngày gần đây: archive (ERA5) chưa có dữ liệu nên dùng forecast API + past_days
const HOURLY_VARS = 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code';

let requestId = 0; // chống phản hồi cũ ghi đè phản hồi mới

const FONTS = {
    segoe: { family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
    inter: { family: "'Inter', sans-serif", google: 'Inter:wght@400;500;600' },
    roboto: { family: "'Roboto', sans-serif", google: 'Roboto:wght@400;500;700' },
    aptos: { family: "'Aptos', 'Segoe UI', sans-serif" },
    lato: { family: "'Lato', sans-serif", google: 'Lato:wght@400;700' },
    outfit: { family: "'Outfit', sans-serif", google: 'Outfit:wght@400;500;600' },
    quicksand: { family: "'Quicksand', sans-serif", google: 'Quicksand:wght@400;500;700' },
    montserrat: { family: "'Montserrat', sans-serif", google: 'Montserrat:wght@400;500;600' },
    poppins: { family: "'Poppins', sans-serif", google: 'Poppins:wght@400;500;600' },
    nunito: { family: "'Nunito', sans-serif", google: 'Nunito:wght@400;600;700' },
    oswald: { family: "'Oswald', sans-serif", google: 'Oswald:wght@400;500;700' },
    pacifico: { family: "'Pacifico', cursive", google: 'Pacifico' },
    greatvibes: { family: "'Great Vibes', cursive", google: 'Great+Vibes' },
    dancingscript: { family: "'Dancing Script', cursive", google: 'Dancing+Script:wght@400;700' },
    caveat: { family: "'Caveat', cursive", google: 'Caveat:wght@400;700' },
    satisfy: { family: "'Satisfy', cursive", google: 'Satisfy' },
    sacramento: { family: "'Sacramento', cursive", google: 'Sacramento' },
    helvetica: { family: "'Helvetica Neue', Helvetica, Arial, sans-serif" }
};
const loadedFonts = new Set();

const DESC_MAP = {
    en: { clear: "Clear Skies", cloudy: "Cloudy", foggy: "Foggy", rain: "Light Rain", snow: "Snowing", storm: "Thunderstorms", normal: "Normal Weather" },
    zh: { clear: "晴朗", cloudy: "多云", foggy: "有雾", rain: "小雨", snow: "下雪", storm: "雷阵雨", normal: "正常天气" },
    vi: { clear: "Trời quang", cloudy: "Có mây", foggy: "Sương mù", rain: "Mưa nhẹ", snow: "Tuyết rơi", storm: "Dông bão", normal: "Thời tiết bình thường" },
    th: { clear: "ท้องฟ้าแจ่มใส", cloudy: "มีเมฆมาก", foggy: "มีหมอก", rain: "ฝนตกเบาๆ", snow: "หิมะตก", storm: "พายุฝนฟ้าคะนอง", normal: "อากาศปกติ" },
    lo: { clear: "ທ້ອງຟ້າແຈ້ງ", cloudy: "ມີເມກບາງສ່ວນ", foggy: "ມີໝອກ", rain: "ຝົນຕົກອ່ອນໆ", snow: "ຫິມະຕົກ", storm: "ພາຍຸຝົນຟ້າຄະນອງ", normal: "ອາກາດປົກກະຕິ" },
    hi: { clear: "साफ आसमान", cloudy: "बादल छाए हैं", foggy: "कोहरा", rain: "हल्की बारिश", snow: "बर्फबारी", storm: "तूफान", normal: "सामान्य मौसम" },
    id: { clear: "Langit Cerah", cloudy: "Berawan", foggy: "Berkabut", rain: "Hujan Ringan", snow: "Bersalju", storm: "Badai Petir", normal: "Cuaca Normal" },
    ar: { clear: "سماء صافية", cloudy: "غائم", foggy: "ضبابي", rain: "مطر خفيف", snow: "تساقط الثلوج", storm: "عواصف رعدية", normal: "طقس عادي" },
    es: { clear: "Cielo Despejado", cloudy: "Nublado", foggy: "Neblina", rain: "Lluvia Ligera", snow: "Nevando", storm: "Tormentas", normal: "Clima Normal" },
    pt: { clear: "Céu Limpo", cloudy: "Nublado", foggy: "Nevoeiro", rain: "Chuva Leve", snow: "Neve", storm: "Tempestade", normal: "Clima Normal" },
    nl: { clear: "Heldere Hemel", cloudy: "Bewolkt", foggy: "Mistig", rain: "Lichte Regen", snow: "Sneeuw", storm: "Onweer", normal: "Normaal Weer" },
    da: { clear: "Klart vejr", cloudy: "Overskyet", foggy: "Tåget", rain: "Let regn", snow: "Sne", storm: "Tordenvejr", normal: "Normalt vejr" },
    fr: { clear: "Ciel dégagé", cloudy: "Nuageux", foggy: "Brumeux", rain: "Pluie légère", snow: "Neige", storm: "Orages", normal: "Temps normal" },
    de: { clear: "Klarer Himmel", cloudy: "Wolkig", foggy: "Nebelig", rain: "Leichter Regen", snow: "Schnee", storm: "Gewitter", normal: "Normales Wetter" },
    ru: { clear: "Ясно", cloudy: "Облачно", foggy: "Туманно", rain: "Дождь", snow: "Снег", storm: "Гроза", normal: "Обычная погода" },
    ja: { clear: "快晴", cloudy: "曇り", foggy: "霧", rain: "小雨", snow: "雪", storm: "雷雨", normal: "通常の天気" },
    ko: { clear: "맑음", cloudy: "구름 많음", foggy: "안개", rain: "비", snow: "눈", storm: "뇌우", normal: "일반 날씨" }
};

// Cho phần tử không phải <button> hoạt động được bằng bàn phím
function makeActivatable(el, handler) {
    el.setAttribute('role', 'button');
    el.tabIndex = 0;
    el.addEventListener('click', handler);
    el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handler();
        }
    });
}

const num = v => (typeof v === 'number' && isFinite(v)) ? v : null;
const show = v => (v === null || v === undefined) ? '--' : v;

/* ============================================================
   Hour grid & calendar
   ============================================================ */
function initHourGrid() {
    hourGrid.innerHTML = '';
    for (let i = 0; i < 24; i++) {
        const cell = document.createElement('div');
        const hourStr = pad2(i) + ':00';
        cell.classList.add('hour-cell');
        cell.innerText = hourStr;
        cell.setAttribute('data-hour', i);
        if (i === selectedHourValue) cell.classList.add('active');

        makeActivatable(cell, () => {
            selectedHourValue = i;
            selectedHourDisplay.innerText = hourStr;
            document.querySelectorAll('.hour-cell').forEach(c => c.classList.remove('active'));
            cell.classList.add('active');
            if (isArchiveMode) refreshWeather();
        });

        hourGrid.appendChild(cell);
    }
    selectedHourDisplay.innerText = pad2(selectedHourValue) + ':00';
}

function updateHistoryBtn() {
    historyModalBtn.innerText = selectedArchiveDate;
}

function initCalendar() {
    const today = new Date();
    viewYear = today.getFullYear();
    viewMonth = today.getMonth();
    selectedArchiveDate = localISODate(today);
    updateHistoryBtn();
    renderCalendar();
}

function calendarLimits() {
    const today = new Date();
    const past = new Date();
    past.setDate(past.getDate() - 365);
    return { today, todayStr: localISODate(today), past, limitStr: localISODate(past) };
}

function renderCalendar() {
    const t = i18n[currentLang] || i18n.en;
    const { todayStr, limitStr } = calendarLimits();

    calGrid.innerHTML = '';
    calMonthYear.innerText = `${t.months[viewMonth]} ${viewYear}`;

    calWeekdaysContainer.innerHTML = '';
    t.weekdays.forEach(day => {
        const span = document.createElement('span');
        span.innerText = day;
        calWeekdaysContainer.appendChild(span);
    });

    const firstDayIndex = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // tuần bắt đầu thứ Hai
    const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevTotalDays = new Date(viewYear, viewMonth, 0).getDate();

    for (let i = firstDayIndex; i > 0; i--) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('cal-day', 'inactive');
        dayCell.innerText = prevTotalDays - i + 1;
        calGrid.appendChild(dayCell);
    }

    for (let d = 1; d <= totalDays; d++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('cal-day');
        dayCell.innerText = d;

        const cellStr = `${viewYear}-${pad2(viewMonth + 1)}-${pad2(d)}`;

        if (cellStr > todayStr || cellStr < limitStr) {
            dayCell.classList.add('disabled');
            dayCell.setAttribute('aria-disabled', 'true');
        } else {
            if (cellStr === selectedArchiveDate) dayCell.classList.add('selected');
            if (cellStr === todayStr) dayCell.classList.add('today');

            makeActivatable(dayCell, () => {
                selectedArchiveDate = cellStr;
                updateHistoryBtn();
                renderCalendar();
                closeHistoryModal();
                refreshWeather();
            });
        }
        calGrid.appendChild(dayCell);
    }

    const totalRendered = firstDayIndex + totalDays;
    const nextDaysCount = totalRendered <= 35 ? (35 - totalRendered) : (42 - totalRendered);
    for (let i = 1; i <= nextDaysCount; i++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('cal-day', 'inactive');
        dayCell.innerText = i;
        calGrid.appendChild(dayCell);
    }
}

function openHistoryModal() {
    historyModal.classList.remove('hidden');
    renderCalendar();
    closeHistoryBtn.focus();
}

function closeHistoryModal() {
    historyModal.classList.add('hidden');
    historyModalBtn.focus();
}

prevMonthBtn.addEventListener('click', () => {
    const { past } = calendarLimits();
    if (viewYear * 12 + viewMonth <= past.getFullYear() * 12 + past.getMonth()) return;
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    const { today } = calendarLimits();
    if (viewYear * 12 + viewMonth >= today.getFullYear() * 12 + today.getMonth()) return;
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
});

calTodayBtn.addEventListener('click', () => {
    const today = new Date();
    viewYear = today.getFullYear();
    viewMonth = today.getMonth();
    selectedArchiveDate = localISODate(today);
    updateHistoryBtn();
    renderCalendar();
    closeHistoryModal();
    refreshWeather();
});

settingsBtn.addEventListener('click', () => {
    const nowHidden = settingsPanel.classList.toggle('hidden');
    settingsBtn.setAttribute('aria-expanded', String(!nowHidden));
});
historyModalBtn.addEventListener('click', openHistoryModal);
closeHistoryBtn.addEventListener('click', closeHistoryModal);
window.addEventListener('click', (e) => { if (e.target === historyModal) closeHistoryModal(); });
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !historyModal.classList.contains('hidden')) closeHistoryModal();
});

/* ============================================================
   Settings (theme, style, size, font, unit, language)
   ============================================================ */
function applyTheme(theme) {
    Array.from(document.body.classList)
        .filter(c => c.startsWith('theme-'))
        .forEach(c => document.body.classList.remove(c));
    if (theme !== 'default') document.body.classList.add(`theme-${theme}`);
}

function applyUIStyle(styleName) {
    weatherCard.classList.remove('style-mica', 'style-material', 'style-neumorph');
    if (styleName === 'mica') weatherCard.classList.add('style-mica');
    else if (styleName === 'material') weatherCard.classList.add('style-material');
}

function updateInterfaceFactor(val) {
    const factor = (val / 100).toFixed(2);
    document.documentElement.style.setProperty('--interface-factor', factor);
}

function applyCardSize(val) {
    weatherCard.style.maxWidth = `${val}px`;
}

// Chỉ tải Google Font khi người dùng thực sự chọn (trước đây tải cả 15 họ font)
function loadGoogleFont(spec) {
    if (!spec || loadedFonts.has(spec)) return;
    loadedFonts.add(spec);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${spec}&display=swap`;
    document.head.appendChild(link);
}

function applyFont(fontName) {
    const font = FONTS[fontName] || FONTS.segoe;
    loadGoogleFont(font.google);
    document.documentElement.style.setProperty('--current-font', font.family);
    document.body.style.fontFamily = font.family;
}

function setActive(buttons, attr, value) {
    buttons.forEach(b => b.classList.toggle('active', b.getAttribute(attr) === value));
}

function updateLanguageUI() {
    const t = i18n[currentLang] || i18n.en;
    document.documentElement.lang = currentLang;
    document.documentElement.dir = RTL_LANGS.includes(currentLang) ? 'rtl' : 'ltr';

    cardTitle.innerText = t.title;
    cityInput.placeholder = t.searchPlaceholder;
    cityInput.setAttribute('aria-label', t.searchPlaceholder);
    searchBtn.innerText = t.searchBtn;
    loadingMsg.innerText = t.loading;
    errorMsg.innerText = t.error;
    labelTheme.innerText = t.theme;
    labelStyle.innerText = t.style;
    labelGlass.innerText = t.glass;
    labelCardSize.innerText = t.cardSize;
    labelFont.innerText = t.font;
    labelUnit.innerText = t.unit;
    labelLang.innerText = t.lang;
    labelHistoryTitle.innerText = t.historyTitle;
    labelHumidity.innerText = t.humidity;
    labelWind.innerText = t.wind;
    labelUV.innerText = t.uv;
    calTodayBtn.innerText = t.today;
    labelHourSelect.innerText = t.selectHour;
}

themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme');
        applyTheme(theme);
        setActive(themeBtns, 'data-theme', theme);
        store.set('selectedTheme', theme);
    });
});

styleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const styleName = btn.getAttribute('data-style');
        applyUIStyle(styleName);
        setActive(styleBtns, 'data-style', styleName);
        store.set('selectedStyle', styleName);
    });
});

glassSlider.addEventListener('input', (e) => {
    updateInterfaceFactor(e.target.value);
    store.set('glassValue', e.target.value);
});

sizeSlider.addEventListener('input', (e) => {
    applyCardSize(e.target.value);
    store.set('cardSizeValue', e.target.value);
});

fontBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const fontName = btn.getAttribute('data-font');
        applyFont(fontName);
        setActive(fontBtns, 'data-font', fontName);
        store.set('selectedFont', fontName);
    });
});

unitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        currentUnit = btn.getAttribute('data-unit');
        setActive(unitBtns, 'data-unit', currentUnit);
        store.set('selectedUnit', currentUnit);
        updateTemperatureDisplay();
    });
});

langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        currentLang = btn.getAttribute('data-lang');
        setActive(langBtns, 'data-lang', currentLang);
        store.set('selectedLang', currentLang);
        updateLanguageUI();
        renderCalendar();
        description.innerText = getWeatherDescription(lastWeatherCode);
    });
});

window.addEventListener('DOMContentLoaded', () => {
    initCalendar();
    initHourGrid();

    const savedTheme = store.get('selectedTheme', 'default');
    const theme = THEMES.includes(savedTheme) ? savedTheme : 'default';
    applyTheme(theme);
    setActive(themeBtns, 'data-theme', theme);

    const savedStyle = store.get('selectedStyle', 'glass');
    const styleName = STYLES.includes(savedStyle) ? savedStyle : 'glass'; // 'neumorph' cũ -> glass
    applyUIStyle(styleName);
    setActive(styleBtns, 'data-style', styleName);

    const savedGlass = Number(store.get('glassValue', '30'));
    const glass = (savedGlass >= 0 && savedGlass <= 100) ? savedGlass : 30;
    glassSlider.value = glass;
    updateInterfaceFactor(glass);

    const savedSize = Number(store.get('cardSizeValue', '460'));
    const size = (savedSize >= 320 && savedSize <= 640) ? savedSize : 460;
    sizeSlider.value = size;
    applyCardSize(size);

    const savedFont = store.get('selectedFont', 'segoe');
    const font = FONTS[savedFont] ? savedFont : 'segoe';
    applyFont(font);
    setActive(fontBtns, 'data-font', font);

    const savedUnit = store.get('selectedUnit', 'C');
    currentUnit = UNITS.includes(savedUnit) ? savedUnit : 'C';
    setActive(unitBtns, 'data-unit', currentUnit);

    const savedLang = store.get('selectedLang', 'en');
    const langOk = i18n[savedLang] && Array.from(langBtns).some(b => b.getAttribute('data-lang') === savedLang);
    currentLang = langOk ? savedLang : 'en';
    setActive(langBtns, 'data-lang', currentLang);

    updateLanguageUI();
});

/* ============================================================
   Search
   ============================================================ */
function refreshWeather() {
    isArchiveMode = selectedArchiveDate !== localISODate();
    hourSelectorBox.classList.toggle('hidden', !isArchiveMode);

    const city = cityInput.value.trim();
    if (city === '') return;
    getWeather(city, selectedArchiveDate, selectedHourValue);
}

searchBtn.addEventListener('click', refreshWeather);

// keydown + isComposing: không tìm kiếm khi Enter chỉ để xác nhận bộ gõ (Telex/VNI, CJK...)
cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.isComposing) {
        e.preventDefault();
        refreshWeather();
    }
});

async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

function daysAgo(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const now = new Date();
    const a = new Date(y, m - 1, d);
    const b = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((b - a) / 86400000);
}

function buildWeatherPlan(lat, lon, targetDate) {
    const base = `latitude=${lat}&longitude=${lon}&timezone=auto`;

    if (!targetDate || targetDate === localISODate()) {
        return {
            kind: 'current',
            url: `https://api.open-meteo.com/v1/forecast?${base}&current=${HOURLY_VARS},uv_index`
        };
    }
    if (daysAgo(targetDate) <= RECENT_DAYS) {
        return {
            kind: 'hourly',
            url: `https://api.open-meteo.com/v1/forecast?${base}&hourly=${HOURLY_VARS},uv_index&past_days=${RECENT_DAYS}&forecast_days=1`
        };
    }
    // Archive không yêu cầu uv_index (không chắc được hỗ trợ) -> UV hiển thị '--'
    return {
        kind: 'hourly',
        url: `https://archive-api.open-meteo.com/v1/archive?${base}&start_date=${targetDate}&end_date=${targetDate}&hourly=${HOURLY_VARS}`
    };
}

function readCurrent(c) {
    return {
        temp: num(c.temperature_2m),
        humidity: num(c.relative_humidity_2m),
        wind: num(c.wind_speed_10m),
        uv: num(c.uv_index),
        code: num(c.weather_code)
    };
}

function readHourly(h, targetDate, hour) {
    if (!h || !Array.isArray(h.time)) throw new Error('No hourly data');
    const idx = h.time.indexOf(`${targetDate}T${pad2(hour)}:00`);
    if (idx === -1) throw new Error('Hour not available');
    const at = key => (Array.isArray(h[key]) ? num(h[key][idx]) : null);
    return {
        temp: at('temperature_2m'),
        humidity: at('relative_humidity_2m'),
        wind: at('wind_speed_10m'),
        uv: at('uv_index'),
        code: at('weather_code')
    };
}

function renderResult(reading, name) {
    currentTempC = reading.temp;
    lastWeatherCode = reading.code;
    cityName.innerText = name;
    humidity.innerText = show(reading.humidity);
    wind.innerText = show(reading.wind);
    uvIndex.innerText = show(reading.uv);
    updateTemperatureDisplay();
    description.innerText = getWeatherDescription(lastWeatherCode);
}

async function getWeather(city, targetDate, selectedHour) {
    const myId = ++requestId;
    stopClock();
    loadingMsg.classList.remove('hidden');
    weatherResult.classList.add('hidden');
    errorMsg.classList.add('hidden');

    try {
        const geoData = await fetchJSON(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=${encodeURIComponent(currentLang)}&format=json`
        );
        if (myId !== requestId) return;
        if (!geoData.results || geoData.results.length === 0) throw new Error('City not found');

        const location = geoData.results[0];
        currentLat = location.latitude;
        currentLon = location.longitude;
        currentCityTimezone = location.timezone || undefined;
        const displayName = [location.name, location.country].filter(Boolean).join(', ');

        const plan = buildWeatherPlan(currentLat, currentLon, targetDate);
        const data = await fetchJSON(plan.url);
        if (myId !== requestId) return;
        currentWeatherData = data;

        if (plan.kind === 'current') {
            if (!data.current) throw new Error('No current data');
            renderResult(readCurrent(data.current), displayName);
            startLocalClock(currentCityTimezone);
        } else {
            const hour = Number.isInteger(selectedHour) ? selectedHour : 12;
            renderResult(readHourly(data.hourly, targetDate, hour), displayName);
            localTime.innerText = `${targetDate} - ${pad2(hour)}:00`;
        }

        loadingMsg.classList.add('hidden');
        weatherResult.classList.remove('hidden');
    } catch (error) {
        if (myId !== requestId) return;
        console.error(error);
        stopClock();
        loadingMsg.classList.add('hidden');
        weatherResult.classList.add('hidden');
        errorMsg.classList.remove('hidden');
    }
}

/* ============================================================
   Display
   ============================================================ */
function updateTemperatureDisplay() {
    const c = currentTempC;
    if (c === null || c === undefined) {
        temp.innerText = '--';
    } else if (currentUnit === 'F') {
        temp.innerText = Math.round((c * 9 / 5) + 32);
    } else if (currentUnit === 'K') {
        temp.innerText = Math.round(c + 273.15);
    } else if (currentUnit === 'R') {
        temp.innerText = Math.round((c + 273.15) * 9 / 5);
    } else {
        temp.innerText = Math.round(c);
    }
    unitSymbol.innerText = ({ C: '°C', F: '°F', K: 'K', R: '°R' })[currentUnit] || '°C';
}

function stopClock() {
    if (clockInterval) {
        clearInterval(clockInterval);
        clockInterval = null;
    }
}

function startLocalClock(timezone) {
    stopClock(); // luôn dọn interval cũ để không bị rò rỉ
    function update() {
        try {
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit',
                day: '2-digit', month: '2-digit', year: 'numeric', hourCycle: 'h23'
            });
            const parts = {};
            formatter.formatToParts(new Date()).forEach(p => { parts[p.type] = p.value; });
            localTime.innerText = `${parts.hour}:${parts.minute}:${parts.second} - ${parts.month}/${parts.day}/${parts.year}`;
        } catch (e) {
            localTime.innerText = 'Time Error';
        }
    }
    update();
    clockInterval = setInterval(update, 1000);
}

function getWeatherDescription(code) {
    if (code === null || code === undefined) return '';
    const dict = DESC_MAP[currentLang] || DESC_MAP.en;
    if (code <= 1) return dict.clear;
    if (code <= 3) return dict.cloudy;
    if (code >= 45 && code <= 48) return dict.foggy;
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return dict.rain;
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return dict.snow;
    if (code >= 95) return dict.storm;
    return dict.normal;
}