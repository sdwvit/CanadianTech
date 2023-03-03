let levels = {};
async function getLevels() {
    return levels = {
        ...levels,
        ...Object.fromEntries(
            await Promise.all(
                [...document.querySelectorAll('svg[data-icon="angle-down"]')]
                    .map((e) => e.parentElement.parentElement.parentElement)
                    .map((e) => [
                        [...e.childNodes][0].querySelector("span").innerText.split("\n")[0],
                        e, // tr
                    ])
                    .map(async ([c, tr]) => [
                        c,
                        {
                            salaryStr: [...tr.childNodes]
                                .slice(-1)[0]
                                .querySelector(".css-0")
                                .innerText.replaceAll("|", "-")
                                .replaceAll("\n\n", " : ")
                                .replaceAll(" ", " "),
                            link: await new Promise((resolve) =>
                                setTimeout(resolve, Math.random() * 5000)
                            )
                                .then(() =>
                                    fetch(
                                        `http://localhost:8080/cse.google.com/cse/element/v1?gss=.com&cselibv=c23214b953e32f29&cx=c132c85eea46f4011&q=${c.replaceAll(
                                            " ",
                                            "%20"
                                        )}+careers&safe=active&cse_tok=ALwrddGnRvYLuOz4BgTBvWo7LvjP:1677875338364&sort=&exp=csqr,cc&oq=${c.replaceAll(
                                            " ",
                                            "%20"
                                        )}+careers&gs_l=partner-web.3.0.0i512i433i131j0i512l9.13722.14782.1.15597.6.6.0.0.0.0.96.473.6.6.0.csems%2Cnrl%3D10...0....1.34.partner-web..0.21.1552.Rm8KBT8JV2s&cseclient=hosted-page-client&callback=google.search.cse.api5686`,
                                        {
                                            headers: { Accept: "application/json" },
                                        }
                                    )
                                )
                                .then((r) => r.text())
                                .then((t) =>
                                    t
                                        .replaceAll("/*O_o*/\n" + "google.search.cse.api5686(", "")
                                        .replaceAll(");", "")
                                )
                                .then((json) => JSON.parse(json).results[0].url)
                                .catch(() => "couldn't fetch"),
                        },
                    ])
            )
        ),
    };
}
let getLevelsStr = async () =>
    Object.entries(await getLevels())
        .map(
            (e) =>
                "| " + [`[${e[0]}](${e[1].link})`, e[1].salaryStr].join(" | ") + " |"
        )
        .join("\n");

getLevelsStr().then((str) => console.log(str));
