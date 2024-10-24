import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { subset } from '@namchee/astro-subfont'; // For font subsetting

import { h } from "hastscript";

import { transformerNotationDiff } from "@shikijs/transformers";

/**
 * This transformer is used to extract the meta information from the markdown file.
 * Example:
 *
 * &#96;&#96;&#96; lang title=test
 *
 * console.log('Hello, world!');
 *
 * &#96;&#96;&#96;
 *
 * Returns { title: 'test' }
 * @returns
 */
const transformerMeta = () => ({
  name: "transformer-meta",
  pre() {
    const metaRaw = this.options.meta?.__raw;
    let meta = {};
    if (metaRaw) {
      const parts = metaRaw.split(/\s+/);
      for (const part of parts) {
        const [key, value] = part.split("=");
        if (key && value) {
          meta[key] = value;
        }
      }
    }
    this.meta = meta;
  },
});

/**
 * This transformer is used to add a header to the code blocks.
 */
const transformerCreateCodeBlockHeader = () => ({
  name: "transformer-create-code-block-header",
  pre(node) {
    const preHeaderDiv = h("div", {
      class: "pre-header",
    });

    node.children.unshift(preHeaderDiv);
  },
});

/**
 * This transformer is used to add a title to the code blocks headers.
 */
const transformerAddTitleToCodeBlocksHeaders = () => ({
  name: "transformer-add-title-to-code-blocks-headers",
  pre(node) {
    if (this.meta.title) {
      const preHeaderDiv = node.children[0];

      const titleDiv = h(
        "div",
        {
          class: "pre-title",
        },
        this.meta.title
      );

      preHeaderDiv.children.push(titleDiv);
    }
  },
});

/**
 * This transformer is used to add a copy button to the code blocks.
 */
const transformerCopyButton = () => ({
  name: "transformer-color-lines",
  pre(node) {
    if (this.meta.copy) {
      const preHeaderDiv = node.children[0];

      const copyCodeButton = h(
        "div",
        {
          class: "wrapper-copy-code",
        },
        h(
          "button",
          {
            class: "copy-code",
            "data-code": this.source,
            onclick: `
              navigator.clipboard.writeText(this.dataset.code);
              this.textContent = 'Copied!';
              setTimeout(() => this.textContent = 'Copy', 1000)
            `,
          },
          "Copy"
        )
      );

      preHeaderDiv.children.push(copyCodeButton);
    }
  },
});

// https://astro.build/config
export default defineConfig({
  site: "https://ebacala.com",
  integrations: [sitemap(), tailwind({
    applyBaseStyles: false,
  }), subset()],
  trailingSlash: "always",
  markdown: {
    shikiConfig: {
      theme: "dracula",
      transformers: [
        transformerMeta(),
        transformerCreateCodeBlockHeader(),
        transformerAddTitleToCodeBlocksHeaders(),
        transformerCopyButton(),
        transformerNotationDiff(),
      ],
      wrap: false,
    },
  },
});