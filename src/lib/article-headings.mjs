// Astro adds heading IDs later in the Markdown pipeline. Set anchor hrefs
// after IDs exist by supplying IDs here, using the same GitHub slug convention.
import GithubSlugger from "github-slugger";

function textOf(node) {
  return node.type === "text"
    ? node.value
    : (node.children ?? []).map(textOf).join("");
}

export default function articleHeadings() {
  return (tree, file) => {
    const slugger = new GithubSlugger();
    const persian = file.data.astro?.frontmatter?.lang === "fa";
    const visit = (node) => {
      if (node.type === "element") {
        const classes = node.properties.className ?? [];
        if (
          ["pre", "code", "math"].includes(node.tagName) ||
          classes.includes("katex") ||
          (node.tagName === "a" && /^(https?:\/\/|www\.)/.test(textOf(node)))
        ) {
          node.properties.dir = "ltr";
        }
        if (persian && node.properties.id === "footnote-label") {
          node.children = [{ type: "text", value: "پانویس‌ها" }];
        }
        if (persian && node.properties.dataFootnoteBackref != null) {
          node.properties.ariaLabel = "بازگشت به ارجاع در متن";
        }
      }
      if (
        node.type === "element" &&
        /^h[2-6]$/.test(node.tagName) &&
        node.properties?.id !== "footnote-label"
      ) {
        const title = textOf(node);
        const slug = slugger.slug(title);
        const id = node.properties.id ?? slug;
        node.properties.id = id;
        node.children.push({
          type: "element",
          tagName: "a",
          properties: {
            href: "#" + id,
            className: ["heading-anchor"],
            ariaLabel: (persian ? "پیوند به " : "Link to ") + title,
          },
          children: [],
        });
        return;
      }
      if (node.type === "element" && node.tagName === "table") {
        for (const child of node.children) visit(child);
        const table = { ...node };
        node.tagName = "div";
        node.properties = {
          className: ["table-scroll"],
          tabIndex: 0,
          role: "region",
          ariaLabel: persian ? "جدول" : "Data table",
        };
        node.children = [table];
        return;
      }
      for (const child of node.children ?? []) visit(child);
    };
    visit(tree);
  };
}
