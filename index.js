import data from "./data.js";
import options from "./options.js";
import colorScheme from "./colors.js";

const selectTemplate = document.getElementById("select-template");

const update = () => {
  const filters = [];
  Array.from(document.getElementsByClassName("filter")).forEach((elem) => {
    const acceptedOptions = [];
    const filterId = elem.id.substr(7);

    const filterCategory = document.getElementById(
      `filter-category-${filterId}`
    ).value;
    Array.from(
      document.getElementsByClassName(`filter-checkbox-${filterId}`)
    ).forEach((checkbox) => {
      if (checkbox.checked) {
        acceptedOptions.push(checkbox.name);
      }
    });
    filters.push([filterCategory, acceptedOptions]);
  });

  const relevantData = data.filter((item) => {
    let ok = true;
    for (const [category, acceptedOptions] of filters) {
      if (!acceptedOptions.includes(`${item[category]}`)) ok = false;
    }
    return ok;
  });

  const result = document.getElementById("result");
  Array.from(result.children).forEach((elem) => elem.remove());

  const legend = document.getElementById("legend");
  Array.from(legend.children).forEach((elem) => elem.remove());

  if (relevantData.length === 0) {
    const disclaimer = document.createElement("div");
    disclaimer.innerText = "Žiadne výsledky";
    disclaimer.classList.add("no-results");
    result.appendChild(disclaimer);
    return;
  }

  const filterCategory = document.getElementById("categories").value;
  const filterCompare = document.getElementById("compare").value;

  const categorized = {};
  for (const item of relevantData) {
    const category = item[filterCategory];
    const compare = item[filterCompare];
    categorized[category] ||= {};
    categorized[category][compare] = (categorized[category][compare] || 0) + 1;
    categorized[category]._total = (categorized[category]._total || 0) + 1;
  }

  const colors = {};
  let nUsedColors = 0;
  for (const compareOption in options[filterCompare]) {
    colors[compareOption] = colorScheme(
      nUsedColors++,
      Object.entries(options[filterCompare]).length
    );
    const legendItem = document.createElement("div");
    const legendItemColor = document.createElement("div");
    legendItemColor.classList.add("color");
    legendItemColor.style.backgroundColor = colors[compareOption];
    legendItem.appendChild(legendItemColor);
    const legendItemDescription = document.createElement("span");
    legendItemDescription.innerText = options[filterCompare][compareOption];
    legendItem.appendChild(legendItemDescription);
    legend.appendChild(legendItem);
  }

  for (const category in categorized) {
    const chartRow = document.createElement("div");
    chartRow.classList.add("chart-row");
    for (const option in options[filterCompare]) {
      const value = categorized[category][option] || 0;
      const chartBar = document.createElement("div");
      chartBar.classList.add("chartBar");
      chartBar.style.flexGrow = value;
      chartBar.style.backgroundColor = colors[option];
      chartRow.appendChild(chartBar);
    }
    const label = document.createElement("span");
    label.innerText = options[filterCategory][category];
    result.appendChild(label);
    result.appendChild(chartRow);
  }
};

const updateFilter = (filterId) => {
  const filterCategory = document.getElementById(`filter-category-${filterId}`);
  const filterOptions = document.getElementById(`filter-options-${filterId}`);
  Array.from(filterOptions.children).forEach((elem) => elem.remove());

  for (const property in options[filterCategory.value]) {
    const child = document.createElement("div");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.name = property;
    checkbox.classList.add(`filter-checkbox-${filterId}`);
    checkbox.addEventListener("input", update);
    const label = document.createElement("label");
    label.innerText = options[filterCategory.value][property];
    child.appendChild(checkbox);
    child.appendChild(label);
    filterOptions.appendChild(child);
  }
};

const addFilter = () => {
  const filterId = Math.floor(Math.random() * 100000);
  const newFilter = document.createElement("div");
  newFilter.classList.add("filter");
  newFilter.id = `filter-${filterId}`;

  const filterCategory = selectTemplate.cloneNode(true);
  filterCategory.id = `filter-category-${filterId}`;

  const filterOptions = document.createElement("div");
  filterOptions.id = `filter-options-${filterId}`;

  const filterRemoveButton = document.createElement("button");
  filterRemoveButton.innerText = "Zmazať filter";
  filterRemoveButton.addEventListener("click", (event) => newFilter.remove());

  newFilter.appendChild(filterCategory);
  newFilter.appendChild(filterOptions);
  newFilter.appendChild(filterRemoveButton);
  document.getElementById("block-filter").appendChild(newFilter);

  filterCategory.addEventListener("input", () => updateFilter(filterId));
  updateFilter(filterId);
};

Array.from(document.getElementsByClassName("update")).forEach((elem) =>
  elem.addEventListener("input", update)
);

document.getElementById("btn-add-filter").addEventListener("click", addFilter);

update();
