<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from "vue";
import {
  ArrowUpRight,
  ArrowRight,
  Search,
  Sparkles,
  Check,
  Menu,
  X,
  MessageCircle,
  SlidersHorizontal,
  ScanSearch,
  MoveRight,
} from "lucide-vue-next";
import BrandMark from "./components/BrandMark.vue";
import HeaderGlass from "./components/HeaderGlass.vue";
import ProductArt from "./components/ProductArt.vue";
import RepositoryLinks from "./components/RepositoryLinks.vue";
import { findScenario, scenarios } from "./data/scenarios";
import { useScrollReveal } from "./composables/useScrollReveal";

useScrollReveal();

const menuOpen = ref(false);
const menuToggle = ref<HTMLButtonElement>();
function dismissMenu() {
  menuOpen.value = false;
  menuToggle.value?.focus();
}
const query = ref(scenarios[0]!.query);
const selected = ref(scenarios[0]!);
const searching = ref(false);
const message = ref("");
const completed = ref(false);
const openFaq = ref<number | null>(0);
const input = ref<HTMLTextAreaElement>();
let timer: ReturnType<typeof setTimeout> | undefined;
const status = computed(() =>
  searching.value
    ? "Разбираем пример запроса…"
    : completed.value
    ? "Пример готов: 3 варианта с объяснениями"
    : "Подготовленный пример результатов"
);
function search() {
  clearTimeout(timer);
  message.value = "";
  completed.value = false;
  const match = findScenario(query.value);
  if (!match) {
    searching.value = false;
    message.value = query.value.trim()
      ? "Это демо на готовых данных. Выберите один из трёх примеров ниже — полноценный поиск пока в разработке."
      : "Добавьте описание или выберите пример ниже.";
    input.value?.focus();
    return;
  }
  searching.value = true;
  timer = setTimeout(() => {
    selected.value = match;
    searching.value = false;
    completed.value = true;
  }, 700);
}
function choose(index: number) {
  query.value = scenarios[index]!.query;
  search();
}
async function goDemo(index?: number) {
  menuOpen.value = false;
  if (index !== undefined) choose(index);
  await nextTick();
  document.getElementById("demo")?.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
    block: "start",
  });
}
onBeforeUnmount(() => clearTimeout(timer));
const faqs = [
  {
    q: "Что такое поиск по смыслу?",
    a: "Это интеллектуальный поиск, который учитывает, что вам нужно и для какой задачи. Идея SmartSearch — выделять характеристики из обычной фразы и сопоставлять их с описаниями товаров, даже если формулировки отличаются. Без настройки сотен тегов и фильтров, без долгого скролла ленты товаров!",
  },
  {
    q: "Можно уже искать реальные товары?",
    a: "Пока на этой странице доступно интерактивное демо с тремя подготовленными запросами. Карточки иллюстрируют будущий опыт: это не актуальные предложения магазинов, купить товары здесь нельзя.",
  },
  //{ q: 'Какие маркетплейсы будут доступны?', a: 'Список площадок и источников каталога пока не объявлен. Мы уточним его перед запуском полноценного поиска.' },
  {
    q: "Нужно ли знать точное название товара?",
    a: "По замыслу SmartSearch — нет. Вы сможете описать искомый товар, важные свойства и пожелания своими словами. Сейчас эту идею можно изучить на готовых примерах.",
  },
  {
    q: "Нужна ли регистрация и сколько это стоит?",
    a: "Демо открыто бесплатно и без регистрации. Условия доступа и стоимость полноценного продукта будут объявлены отдельно.",
  },
];
</script>

<template>
  <a class="skip-link" href="#main">Перейти к содержимому</a>
  <header class="site-header">
    <HeaderGlass />
    <div class="container header-inner">
      <a class="wordmark" href="#" aria-label="SmartSearch — на главную"
        ><BrandMark intro /><span
          >SmartSearch<span class="wordmark-dot">.</span></span
        ></a
      >
      <nav class="desktop-nav" aria-label="Основная навигация">
        <a href="#how">Как это работает</a
        ><a href="#possibilities">Возможности</a><a href="#faq">Вопросы</a>
      </nav>
      <a class="button button-small header-cta" href="#demo"
        >Попробовать демо <ArrowUpRight :size="17"
      /></a>
      <button
        class="mobile-toggle"
        ref="menuToggle"
        @keydown.esc.prevent="dismissMenu"
        :aria-expanded="menuOpen"
        aria-controls="mobile-nav"
        :aria-label="menuOpen ? 'Закрыть меню' : 'Открыть меню'"
        @click="menuOpen = !menuOpen"
      >
        <X v-if="menuOpen" /><Menu v-else />
      </button>
    </div>
    <Transition name="mobile-menu">
    <nav
      v-if="menuOpen"
      id="mobile-nav"
      class="mobile-nav"
      aria-label="Мобильная навигация"
      :aria-hidden="!menuOpen"
      :inert="!menuOpen"
      @keydown.esc.prevent="dismissMenu"
    >
      <HeaderGlass panel />
      <a href="#how" @click="menuOpen = false">Как это работает</a
      ><a href="#possibilities" @click="menuOpen = false">Возможности</a
      ><a href="#faq" @click="menuOpen = false">Вопросы</a
      ><a href="#demo" @click="menuOpen = false">Попробовать демо</a>
    </nav>
    </Transition>
  </header>
  <main id="main">
    <section class="hero container">
      <div class="hero-copy">
        <div class="eyebrow">
          <span class="status-dot"></span> ПОИСК НА БАЗЕ AI
        </div>
        <h1>
          Опиши словами.<br /><span
            >Найди по<br class="desktop-break" />
            смыслу.</span
          >
        </h1>
        <p class="hero-description">
          Нужная вещь — без подбора ключевых слов.<br class="wide-only" />
          Расскажите, что ищете, как рассказали бы другу.
        </p>
        <div class="hero-actions">
          <a class="button" href="#demo"
            >Попробовать демо <ArrowUpRight :size="20" /></a
          ><a class="text-link" href="#how"
            >Как это работает <ArrowRight :size="18"
          /></a>
        </div>
        <p class="microcopy">
          <span class="tiny-check"><Check :size="12" /></span> Без регистрации
        </p>
      </div>
      <div
        class="hero-visual"
        aria-label="Иллюстрация: запрос и товары пересекаются по смыслу"
      >
        <div class="orbit orbit-one"></div>
        <div class="orbit orbit-two"></div>
        <span class="visual-coordinate coordinate-top"
          >ВВОДИТЕ ПРОИЗВОЛЬНЫЙ ЗАПРОС</span
        >
        <div class="query-bubble">
          <MessageCircle :size="19" /><span
            >«Рюкзак, чтобы ноутбук<br />
            не промок под дождём»</span
          >
        </div>
        <div class="hero-mark"><BrandMark intro /></div>
        <div class="meaning-label">
          <Sparkles :size="15" /> Есть совпадение по смыслу
        </div>
        <div class="mini-product">
          <div class="mini-product-image"><ProductArt kind="backpack" /></div>
          <div>
            <span class="mini-label">ВОТ ЧТО ВЫ ИСКАЛИ</span
            ><strong>Городской рюкзак</strong
            ><span class="mini-match"
              ><Check :size="13" /> Ноутбук + защита от дождя</span
            >
          </div>
          <ArrowUpRight class="mini-arrow" :size="18" />
        </div>
        <span class="visual-coordinate coordinate-bottom"
          >ПОЛУЧАЕТЕ ПОДХОДЯЩИЕ ТОВАРЫ</span
        >
        <div class="visual-star">✳</div>
      </div>
    </section>
    <div class="principle-strip">
      <div class="container principle-inner">
        <span>ГОВОРИШЬ КАК ЕСТЬ. НАХОДИШЬ ЧТО НУЖНО</span>
        <p>
          Ваши слова <MoveRight /><strong>Понимание запроса</strong
          ><MoveRight /> Нужная вещь <span class="strip-spark">✳</span>
        </p>
      </div>
    </div>

    <section id="demo" class="section container demo-section">
      <div class="section-heading">
        <div>
          <div class="eyebrow">ПОПРОБУЙТЕ САМИ</div>
          <h2>
            Вы знаете, что нужно.<br /><span class="muted"
              >Просто опишите это.</span
            >
          </h2>
        </div>
        <p>
          Не нужно переводить свои желания<br class="wide-only" />
          на язык фильтров и категорий.
        </p>
      </div>
      <div class="demo-shell">
        <div class="demo-topline">
          <span><Sparkles :size="17" /> Поиск по смыслу</span
          ><span class="demo-badge">ИНТЕРАКТИВНОЕ ДЕМО</span>
        </div>
        <form class="search-form" @submit.prevent="search">
          <label class="sr-only" for="search-query">Опишите нужный товар</label
          ><Search class="search-icon" :size="23" />
          <textarea
            id="search-query"
            ref="input"
            v-model="query"
            rows="2"
            maxlength="300"
            aria-describedby="demo-note search-message"
            placeholder="Расскажите, какую вещь вы ищете…"
            @keydown.enter.exact.prevent="search"
          ></textarea>
          <button
            class="button search-button"
            :disabled="searching"
            type="submit"
          >
            <span>{{ searching ? "Ищем…" : "Найти" }}</span
            ><ArrowRight :size="20" />
          </button>
        </form>
        <div class="sample-queries">
          <span>Например:</span
          ><button
            v-for="(scenario, index) in scenarios"
            :key="scenario.id"
            :class="{ active: query === scenario.query }"
            :aria-pressed="query === scenario.query"
            @click="choose(index)"
          >
            {{ scenario.label }} <ArrowUpRight :size="13" />
          </button>
        </div>
        <p id="search-message" class="search-message" role="status">
          {{ message }}
        </p>
        <div
          class="demo-results"
          :class="{ 'is-searching': searching }"
          :aria-busy="searching"
        >
          <div class="understood">
            <span class="understood-label"
              ><ScanSearch :size="17" /> В этом примере важно:</span
            >
            <div class="trait-list">
              <span v-for="trait in selected.traits" :key="trait"
                ><Check :size="12" /> {{ trait }}</span
              >
            </div>
          </div>
          <div class="results-title">
            <h3>{{ selected.category }}</h3>
            <span>3 примера товаров</span>
          </div>
          <div class="product-grid">
            <article
              v-for="(product, index) in selected.products"
              :key="selected.id + index"
              class="product-card"
            >
              <div class="product-picture" :class="product.color">
                <span class="picture-label">{{
                  index === 0 ? "Всё сошлось" : "Подходит по смыслу"
                }}</span
                ><ProductArt :kind="selected.id" :variant="index" />
              </div>
              <div class="product-info">
                <h4>{{ product.name }}</h4>
                <p>{{ product.detail }}</p>
                <ul>
                  <li v-for="reason in product.reasons" :key="reason">
                    <Check :size="14" />{{ reason }}
                  </li>
                </ul>
              </div>
            </article>
          </div>
        </div>
        <p class="sr-only" role="status">{{ status }}</p>
        <p id="demo-note" class="demo-note">
          Демонстрация на подготовленных данных. Товары условные, поиск по
          каталогам пока не подключён.
        </p>
      </div>
    </section>

    <section id="how" class="section container how-section">
      <div class="section-heading">
        <div>
          <div class="eyebrow">ОТ СЛОВ К НАХОДКЕ</div>
          <h2>Всё начинается<br />с обычной фразы.</h2>
        </div>
        <p>
          Вы описываете желание.<br />SmartSearch помогает найти совпадение.
        </p>
      </div>
      <div class="steps-grid">
        <article>
          <div class="step-top">
            <span>Шаг 1</span><MessageCircle :size="25" />
          </div>
          <h3>Расскажите, что ищете</h3>
          <p>
            Для чего нужна вещь, какой она должна быть и что для вас важно.
            Своими словами.
          </p>
          <div class="step-example">
            «Что-нибудь для чтения<br />вечером, с тёплым светом»
          </div>
        </article>
        <article>
          <div class="step-top">
            <span>Шаг 2</span><ScanSearch :size="27" />
          </div>
          <h3>Смысл становится яснее</h3>
          <p>
            Идея поиска — выделить характеристики и связать ваши пожелания с
            описаниями товаров.
          </p>
          <div class="step-tags">
            <span>Для чтения</span><span>Тёплый свет</span
            ><span>Мягкое освещение</span>
          </div>
        </article>
        <article>
          <div class="step-top"><span>Шаг 3</span><Check :size="27" /></div>
          <h3>Остаётся выбрать</h3>
          <p>
            Сравните подходящие варианты и посмотрите, какие свойства отвечают
            вашему запросу.
          </p>
          <div class="step-match">
            <span><Check :size="16" /></span> Нашлось то самое
          </div>
        </article>
      </div>
    </section>

    <section id="possibilities" class="section container possibilities">
      <div class="feature-panel">
        <div class="feature-copy">
          <div class="eyebrow">В ЭТОМ ВЕСЬ СМЫСЛ</div>
          <h2>Между «хочу»<br />и «нашёл» —<br /><span>понимание.</span></h2>
          <p>
            Вы думаете о желаемом товаре, а не о точном названии или категории.
            Мы строим поиск вокруг этого.
          </p>
          <a href="#demo" class="text-link"
            >Посмотреть на примере <ArrowUpRight :size="19"
          /></a>
        </div>
        <div class="feature-list">
          <article>
            <MessageCircle />
            <div>
              <h3>Естественный язык</h3>
              <p>
                «Чтобы не промокал» — такое же важное пожелание, как
                «водоотталкивающий».
              </p>
            </div>
          </article>
          <article>
            <SlidersHorizontal />
            <div>
              <h3>Несколько пожеланий сразу</h3>
              <p>
                Назначение, материал, особенности — в одной фразе вместо набора
                отдельных фильтров.
              </p>
            </div>
          </article>
          <article>
            <ScanSearch />
            <div>
              <h3>Понятные совпадения</h3>
              <p>
                В демо показываем, почему вещь подходит. Вы видите связь между
                запросом и результатом.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section container use-cases">
      <div class="section-heading">
        <div>
          <div class="eyebrow">ДЛЯ ВАШЕЙ ПОВСЕДНЕВНОСТИ</div>
          <h2>Что ищем сегодня?</h2>
        </div>
        <p>У каждой хорошей находки — своя история.</p>
      </div>
      <div class="use-grid">
        <button
          v-for="(scenario, index) in scenarios"
          :key="scenario.id"
          @click="goDemo(index)"
        >
          <span class="use-index">
            {{ ["В ГОРОД", "ДЛЯ СЕБЯ", "ДЛЯ ДОМА"][index] }}</span
          ><span class="use-query">«{{ scenario.query }}»</span
          ><span class="use-link"
            >Разобрать пример <ArrowUpRight :size="21"
          /></span>
        </button>
      </div>
    </section>

    <section id="faq" class="section container faq-section">
      <div>
        <div class="eyebrow">ЕСТЬ ВОПРОСЫ?</div>
        <h2>Давайте<br />разберёмся.</h2>
        <p class="faq-aside">
          Честно о продукте<br />и о том, что доступно сейчас.
        </p>
      </div>
      <div class="faq-list">
        <article
          v-for="(faq, index) in faqs"
          :key="faq.q"
          :class="{ 'faq-open': openFaq === index }"
        >
          <h3>
            <button
              :aria-expanded="openFaq === index"
              :aria-controls="`faq-answer-${index}`"
              @click="openFaq = openFaq === index ? null : index"
            >
              {{ faq.q }}<span class="faq-toggle" aria-hidden="true"></span>
            </button>
          </h3>
          <div
            class="faq-answer"
            :aria-hidden="openFaq !== index"
            :inert="openFaq !== index"
            :id="`faq-answer-${index}`"
          >
            <div class="faq-answer-inner">
              <p>{{ faq.a }}</p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="container final-section">
      <div class="final-cta">
        <div class="final-decoration" aria-hidden="true"></div>
        <div class="eyebrow">ПОНЯТЬ. НАЙТИ. ВЫБРАТЬ.</div>
        <h2>Нужная вещь начинается<br />с ваших слов.</h2>
        <p>Посмотрите, как желание превращается в понятный запрос.</p>
        <a class="button button-white" href="#demo"
          >Попробовать SmartSearch <ArrowUpRight :size="20" /></a
        ><span class="final-note">Открытое демо · Без регистрации</span>
      </div>
    </section>
    <RepositoryLinks />
  </main>
  <footer class="container footer">
    <a class="wordmark" href="#" aria-label="SmartSearch — наверх"
      ><BrandMark /><span
        >SmartSearch<span class="wordmark-dot">.</span></span
      ></a
    ><span>Опиши словами. Найди по смыслу.</span
    ><span>© {{ new Date().getFullYear() }} SmartSearch</span>
  </footer>
</template>
