let levels = {};
const getFirstLine = (el) => el.innerText.split("\n")[0];
const DECENCY_THRESHOLD = 150; //K
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
  const worthwhileTds = entryTds.filter(
    (e) => parseInt(e.comp.total.replaceAll(",", "").replace('$', '')) >= DECENCY_THRESHOLD,
  );

  return (levels = {
    ...levels,
    ...Object.fromEntries(
      await Promise.all(
        worthwhileTds.map(async ({ name, comp }, i) => [
          name,
          {
            salaryStr: `${comp.total}: ${comp.breakdown.base} - ${comp.breakdown.stock} - ${comp.breakdown.bonus}`,
            link: "use chat gpt to find links",
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
