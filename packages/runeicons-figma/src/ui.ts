import { type BrandEntry, brandGroups, buildBrandSvg, searchBrands } from "./brands";
import { availableTypes, buildSvg, type IconEntry, type IconType, searchIcons } from "./icons";

type Mode = "icons" | "brands";

const PAGE_SIZE = 120;

const input = document.getElementById("search") as HTMLInputElement;
const typeSelect = document.getElementById("type") as HTMLSelectElement;
const groupSelect = document.getElementById("group") as HTMLSelectElement;
const notice = document.getElementById("notice")!;
const more = document.getElementById("more") as HTMLButtonElement;
const results = document.getElementById("results")!;
const modeButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(".mode"));

let mode: Mode = "icons";
let shown = PAGE_SIZE;

groupSelect.replaceChildren(
  new Option("All groups", ""),
  ...brandGroups().map((group) => new Option(group, group)),
);

function pickType(icon: IconEntry): IconType {
  const types = availableTypes(icon);
  const wanted = typeSelect.value as IconType;
  return types.includes(wanted) ? wanted : types[0];
}

function iconCard(icon: IconEntry): HTMLElement {
  const card = document.createElement("button");
  card.className = "icon";
  const type = pickType(icon);
  card.innerHTML = `${buildSvg(icon, type)}<span>${icon.name}</span>`;
  card.title = `${icon.id} (${type})`;
  card.onclick = () => {
    const svg = buildSvg(icon, type);
    if (svg) {
      parent.postMessage(
        { pluginMessage: { type: "insert", name: `${icon.name} ${type}`, svg } },
        "*",
      );
    }
  };
  return card;
}

function brandCard(brand: BrandEntry): HTMLElement {
  const card = document.createElement("button");
  card.className = brand.tone === "dark" ? "icon brand dark" : "icon brand";
  card.innerHTML = buildBrandSvg(brand, 40);
  const label = document.createElement("span");
  label.textContent = brand.name;
  const tier = document.createElement("em");
  tier.className = "tier";
  tier.textContent = brand.tier;
  card.append(label, tier);
  card.title = `${brand.name} (${brand.license})`;
  card.onclick = () => {
    parent.postMessage(
      { pluginMessage: { type: "insert", name: brand.name, svg: buildBrandSvg(brand) } },
      "*",
    );
  };
  return card;
}

function render(): void {
  const brands = mode === "brands";
  for (const button of modeButtons) {
    button.classList.toggle("active", button.dataset.mode === mode);
  }
  notice.hidden = !brands;
  groupSelect.hidden = !brands;
  typeSelect.hidden = brands;
  input.placeholder = brands ? "Search brands" : "Search icons";

  if (!brands) {
    results.replaceChildren(...searchIcons(input.value, 60).map(iconCard));
    more.hidden = true;
    return;
  }
  const matches = searchBrands(input.value, groupSelect.value);
  results.replaceChildren(...matches.slice(0, shown).map(brandCard));
  more.hidden = matches.length <= shown;
}

function reset(): void {
  shown = PAGE_SIZE;
  render();
}

for (const button of modeButtons) {
  button.addEventListener("click", () => {
    mode = button.dataset.mode as Mode;
    reset();
  });
}

input.addEventListener("input", reset);
typeSelect.addEventListener("change", reset);
groupSelect.addEventListener("change", reset);
more.addEventListener("click", () => {
  shown += PAGE_SIZE;
  render();
});
render();
