<script setup lang="ts">
import { Github, ArrowUpRight } from "lucide-vue-next";

const repositories = [
  {
    title: "Основной продукт",
    name: "vot-blin / Start",
    description: "Исходный код SmartSearch.",
    url: "https://github.com/vot-blin/Start",
  },
  {
    title: "Лендинг SmartSearch",
    name: "Luostra / SmartSearchLanding",
    description: "Код и оформление этой страницы.",
    url: "https://github.com/Luostra/SmartSearchLanding",
  },
];
</script>

<template>
  <section class="container repositories" aria-labelledby="repositories-title">
    <div class="repositories-heading">
      <div>
        <div class="eyebrow">ИСХОДНЫЙ КОД</div>
        <h2 id="repositories-title">Проект на GitHub</h2>
      </div>
      <p>Загляните под капот SmartSearch.</p>
    </div>
    <div class="repositories-grid">
      <a
        v-for="repository in repositories"
        :key="repository.url"
        :href="repository.url"
        target="_blank"
        rel="noopener noreferrer"
        class="repository-link"
      >
        <Github :size="25" aria-hidden="true" />
        <div class="repository-copy">
          <h3>{{ repository.title }}</h3>
          <p>{{ repository.description }}</p>
          <span class="repository-name">{{ repository.name }}</span>
        </div>
        <ArrowUpRight class="repository-arrow" :size="20" aria-hidden="true" />
        <span class="sr-only"> — откроется в новой вкладке</span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.repositories {
  padding-bottom: 64px;
}
.repositories-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  margin-bottom: 26px;
}
.repositories-heading .eyebrow {
  margin-bottom: 14px;
}
.repositories-heading h2 {
  font-size: 30px;
}
.repositories-heading > p {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.8;
}
.repositories-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.repository-link {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  padding: 26px;
  border: 1px solid var(--line);
  border-radius: 15px;
  background: var(--surface);
  transition: border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease;
}
.repository-link:hover {
  border-color: #c5b2ee;
  box-shadow: 0 8px 24px rgb(109 61 245 / 6%);
  transform: translateY(-3px);
}
.repository-link > svg {
  color: var(--purple);
}
.repository-copy {
  min-width: 0;
}
.repository-copy h3 {
  font-size: 16px;
  font-weight: 650;
}
.repository-copy p {
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.7;
  color: var(--muted);
}
.repository-name {
  display: block;
  margin-top: 15px;
  color: var(--purple);
  font-size: 11px;
  overflow-wrap: anywhere;
}
.repository-arrow {
  margin-left: auto;
}
@media (max-width: 600px) {
  .repositories { padding-bottom: 35px; }
  .repositories-heading { display: block; }
  .repositories-heading h2 { font-size: 27px; }
  .repositories-heading > p { margin-top: 12px; }
  .repositories-grid { grid-template-columns: 1fr; gap: 12px; }
  .repository-link { padding: 20px 16px; gap: 12px; }
  .repository-copy h3 { font-size: 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .repository-link:hover { transform: none; }
}
</style>
