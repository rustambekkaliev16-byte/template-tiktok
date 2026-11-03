// =====================================================================
//  НАСТРОЙКИ РОЛИКА. Всё, что нужно менять, находится в этом файле.
// =====================================================================
//
//  КАК ВСТАВИТЬ СВОЁ ВИДЕО:
//  1. Положите файл в папку public/clips/ (например public/clips/01-hook.mp4).
//  2. Найдите нужную сцену ниже и впишите имя файла в поле clip:
//       clip: "clips/01-hook.mp4",
//  3. Пока clip пустой (null), на месте видео показывается заглушка
//     (или нарисованная анимация, если у сцены есть motion).
//
//  Видео лучше вертикальное 9:16. Горизонтальное тоже можно: оно
//  обрежется по центру, чтобы заполнить кадр.

export const FPS = 30;

export const BRAND = {
  agencyName: "Ваше агентство",
  // Путь к логотипу в public/ (PNG с прозрачным фоном), или null,
  // тогда вместо логотипа выводится agencyName.
  logo: null as string | null,
  accent: "#14B8A6", // бирюзовый акцент
  accentSoft: "#5EEAD4",
  dark: "#0B1220",
  light: "#F8FAFC",
  danger: "#EF4444",
  // Музыка: положите трек в public/ и впишите путь, например "music.mp3".
  music: null as string | null,
  // Озвучка: файл в public/, например "voiceover.mp3".
  voiceover: null as string | null,
};

export type MotionKind =
  | "chartDown"
  | "turn"
  | "brand"
  | "adsUp"
  | "grid"
  | "calendar"
  | "connect"
  | "cta";

export type Scene = {
  id: string;
  from: number; // секунда начала
  to: number; // секунда конца
  /** Тёмная часть (боль) или светлая (после поворота) */
  tone: "dark" | "light";
  /** Титр на экране. Слово в *звёздочках* подсвечивается акцентом. */
  title: string;
  /** Ваше видео из public/, например "clips/01-hook.mp4" */
  clip: string | null;
  /** Нарисованная анимация, которая показывается, если clip не задан */
  motion?: MotionKind;
  /** Что снять или найти для этой сцены (видно на заглушке) */
  needs: string;
  /** Накладывать всплывающие уведомления «Новая заявка» поверх видео */
  notifications?: boolean;
};

export const SCENES: Scene[] = [
  {
    id: "01-hook",
    from: 0,
    to: 3,
    tone: "dark",
    title: "Маркетинг стоматологии *на автопилоте*",
    clip: null,
    needs: "Макро: врач надевает перчатку, включается лампа над креслом",
  },
  {
    id: "02-pain-content",
    from: 3,
    to: 5,
    tone: "dark",
    title: "Контент *раз в месяц?*",
    clip: null,
    needs: "Администратор смотрит на молчащий телефон",
  },
  {
    id: "03-pain-ads",
    from: 5,
    to: 7,
    tone: "dark",
    title: "Реклама *сливает бюджет?*",
    clip: null,
    motion: "chartDown",
    needs: "Скрин рекламного кабинета, график падает",
  },
  {
    id: "04-pain-chairs",
    from: 7,
    to: 9,
    tone: "dark",
    title: "Пустые *кресла?*",
    clip: null,
    needs: "Пустое стоматологическое кресло в полумраке",
  },
  {
    id: "05-turn",
    from: 9,
    to: 12,
    tone: "light",
    title: "Теперь это *автоматизируется*",
    clip: null,
    motion: "turn",
    needs: "Нейросеть собирает интерфейс, частицы в логотип",
  },
  {
    id: "06-shoot-day",
    from: 12,
    to: 15,
    tone: "light",
    title: "1 съёмка → *контент на месяцы*",
    clip: null,
    needs: "Съёмочный день: стабилизатор, софтбоксы, врач улыбается",
  },
  {
    id: "07-brand",
    from: 15,
    to: 18,
    tone: "light",
    title: "*Фирменный* стиль",
    clip: null,
    motion: "brand",
    needs: "Логотип, палитра, шаблоны постов веером",
  },
  {
    id: "08-ads",
    from: 18,
    to: 22,
    tone: "light",
    title: "AI-таргетолог *24/7*",
    clip: null,
    motion: "adsUp",
    notifications: true,
    needs: "Скринкаст рекламного кабинета: графики растут",
  },
  {
    id: "09-reels",
    from: 22,
    to: 25,
    tone: "light",
    title: "Ролики под *каждую задачу*",
    clip: null,
    motion: "grid",
    needs: "Сетка Instagram заполняется роликами",
  },
  {
    id: "10-autopost",
    from: 25,
    to: 28,
    tone: "light",
    title: "Автопостинг *по таймеру*",
    clip: null,
    motion: "calendar",
    needs: "Скринкаст планировщика публикаций",
  },
  {
    id: "11-connect",
    from: 28,
    to: 31,
    tone: "dark",
    title: "Всё связано в *одну систему*",
    clip: null,
    motion: "connect",
    needs: "CRM, мессенджеры, Instagram, сайт соединяются",
  },
  {
    id: "12-result",
    from: 31,
    to: 36,
    tone: "light",
    title: "Вы лечите — *система продаёт*",
    clip: null,
    notifications: true,
    needs: "Админ принимает звонок, пациент в кресле, врач «ок»",
  },
  {
    id: "13-cta",
    from: 36,
    to: 41,
    tone: "light",
    title: "Напишите *СТАРТ* в директ",
    clip: null,
    motion: "cta",
    needs: "Финальный экран с логотипом",
  },
];

export const TOTAL_SECONDS = SCENES[SCENES.length - 1].to;
