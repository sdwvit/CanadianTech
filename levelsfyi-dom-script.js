let levels = {};
const getFirstLine = (el) => el.innerText.split("\n")[0];
const getComp = (el) => {
  const [total, _, breakdown] = el.innerText.split("\n");
  const [base, stock, bonus] = breakdown.split(" | ");
  return { total, breakdown: { base, stock, bonus } };
};

async function getLevels() {
  const allDropdowns = document.querySelectorAll("svg.fa-angle-down");
  const allTableNodes = [...allDropdowns].map(
    (e) => e.parentElement.parentElement.parentElement,
  );
  const allRows = allTableNodes.filter((e) => e.nodeName === "TR");
  const allRowsWithCells = allRows.map((e) => [...e.childNodes]);
  const entryTds = allRowsWithCells.map(([name, level, tenure, comp]) => ({
    name: getFirstLine(name),
    level: getFirstLine(level),
    tenure: getFirstLine(tenure),
    comp: getComp(comp),
  }));

  return (levels = {
    ...levels,
    ...Object.fromEntries(
      await Promise.all(
        entryTds.slice(1).map(async ({ name, comp }, i) => [
          name,
          {
            salaryStr: `${comp.total}: ${comp.breakdown.base} - ${comp.breakdown.stock} - ${comp.breakdown.bonus}`,
            link: await new Promise((resolve) =>
              setTimeout(resolve, (Math.random() + 4) * 1000 * i),
            )
              .then(() =>
                fetch(
                  `http://localhost:8080/customsearch/v1?key=&q=${name}+careers`,
                  {
                    headers: { Accept: "application/json" },
                  },
                ),
              )
              .then((r) => r.json())
              .then((t) => {
                return t.items[0].link;
              })
              .catch(() => "couldn't fetch"),
          },
        ]),
      ),
    ),
  });
}
let getLevelsStr = async () =>
  Object.entries(await getLevels())
    .map(
      (e) =>
        "| " + [`[${e[0]}](${e[1].link})`, e[1].salaryStr].join(" | ") + " |",
    )
    .join("\n");

getLevelsStr().then((str) => console.log(str));
