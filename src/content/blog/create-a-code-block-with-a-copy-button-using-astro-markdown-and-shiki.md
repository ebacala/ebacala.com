---
title: Create a code block with a copy button using Astro, Markdown and Shiki
description: Learn how to implement a code block with a copy button feature with Astro, Markdown and Shiki custom transformers.
author: Evann
date: 2024-09-13
---

This personal website has been built using Astro and I use Markdown for my blog posts. For my [previous article](/blog/how-i-adapted-pokemon-emerald-to-my-needs/) I needed to create a code block that one could copy the content to the clipboard.
Here I will explain how I implemented it to go from this Markdown code:

````plaintext
```dockerfile title=Dockerfile copy=true
FROM debian:12-slim

RUN apt update && apt install -y build-essential binutils-arm-none-eabi git libpng-dev gdebi-core wget
RUN wget https://apt.devkitpro.org/install-devkitpro-pacman && chmod +x ./install-devkitpro-pacman && echo "Y" | ./install-devkitpro-pacman
RUN git clone https://github.com/pret/agbcc

WORKDIR /agbcc

RUN chmod +x build.sh install.sh // [!code ++]‎ 
RUN ./build.sh // [!code --]‎ 
RUN ./install.sh /pokeemerald
```
````

To this code block:

```dockerfile title=Dockerfile copy=true
FROM debian:12-slim

RUN apt update && apt install -y build-essential binutils-arm-none-eabi git libpng-dev gdebi-core wget
RUN wget https://apt.devkitpro.org/install-devkitpro-pacman && chmod +x ./install-devkitpro-pacman && echo "Y" | ./install-devkitpro-pacman
RUN git clone https://github.com/pret/agbcc

WORKDIR /agbcc

RUN chmod +x build.sh install.sh // [!code ++]
RUN ./build.sh // [!code --]
RUN ./install.sh /pokeemerald
```

## Theme and code highlighting

Like stated in their documentation, Astro uses [Shiki](https://shiki.style) under the hood to do code highlighting. Shiki supports a wide range of languages and has multiple available [themes](https://shiki.style/themes). The first thing to do is to decide which one you're gonna use. I chose the _Dracula_ theme. To use it in Astro, you need to add some configuration to the `astro.config.mjs` file:

```js title=astro.config.mjs copy=true
export default defineConfig({
    ...,
    markdown: { // [!code ++]
        shikiConfig: { // [!code ++]
            theme: "dracula", // [!code ++]
            wrap: false, // [!code ++]
        }, // [!code ++]
    }, // [!code ++]
    ...
}
```

The `wrap` option is used to enable line wrapping in the code blocks. I chose to disable it because I find it easier to read code like this.

In Markdown we create code blocks by delimiting them with three backticks ` (```) `. We can append a programming language to the first line of the code block to get syntax highlighting. So now we can make a code block look like this:

```dockerfile
FROM debian:12-slim

RUN apt update && apt install -y build-essential binutils-arm-none-eabi git libpng-dev gdebi-core wget
RUN wget https://apt.devkitpro.org/install-devkitpro-pacman && chmod +x ./install-devkitpro-pacman && echo "Y" | ./install-devkitpro-pacman
RUN git clone https://github.com/pret/agbcc

WORKDIR /agbcc

RUN chmod +x build.sh install.sh
RUN ./build.sh
RUN ./install.sh /pokeemerald
```

Note that the styling of the code will depend of the theme you choose and the language you're using.

## How are Markdown code block transformed?

To process Markdown content and generate the HTML that will represent the code blocks, Shiki uses [hast](https://github.com/syntax-tree/hast), a syntax-tree format for HTML. Once generated, the code blocks are wrapped in a `<code>` element, child of a `<pre>` element. Each line of code will be a `<span class="line">` element. These elements will contain others styled `<span>` elements to display highlighted code.

A basic HTML structure for a code block looks like this:

```html
<pre
  class="astro-code dracula"
  style="..."
  tabindex="0"
  data-language="dockerfile"
>
    <code>
        <span class="line">
            <span style="color:#FF79C6">FROM</span>
            <span style="color:#F8F8F2"> debian:12-slim</span>
        </span>
        <span class="line"></span>
        <span class="line">
            <span style="color:#FF79C6">RUN</span>
            <span style="color:#F8F8F2"> apt update &amp;&amp; apt install -y build-essential binutils-arm-none-eabi git libpng-dev gdebi-core wget</span>
        </span>
    </code>
</pre>
```

## Creating some metadata

Adding a title to code blocks is not something Shiki does. However, to achieve this we're gonna use one of its features: [transformers](https://shiki.style/packages/transformers). The way we'll do this is by adding some metadata to the Markdown code block. You can see on the first picture of this article that I'm using the `title` metadata: ` (```dockerfile title=Dockerfile) `.

During the Markdown parsing process, we can hook up transformers to manipulate the tree and by doing so, influence the generated HTML. Shiki already provides some transformers, but we're gonna write our own.

Here's the transformer I wrote:

```js copy=true
const transformerMeta = () => ({
  name: "transformer-meta",
  pre() {
    // This method means that we will modifiy the <pre> element that will be generated
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
```

`this.options.meta?.__raw` is our way to access the metadata we added to the code block. We will then parse the strings into a JSON object and store it in `this.meta`. That way the next transformers will be able to access the metadata.

## Adding a header to the code blocks

Now that we have our metadata, let's add a header to our code blocks. This header will contain the title and the copy button and will be placed before the `<code>` element. Let's create another transformer for this. I used the `hastscript` library the simplify the creation of new nodes. You can install it with the the package manager of your choice.

```js copy=true
import { h } from "hastscript";

const transformerCreateCodeBlockHeader = () => ({
  name: "transformer-create-code-block-header",
  pre(node) {
    const preHeaderDiv = h("div", {
      class: "pre-header",
    });

    node.children.unshift(preHeaderDiv);
  },
});
```

## Adding the title to the header

Once again we will create a transformer. This one will check if the title metadata (`this.meta.title`) is present and add a `<div class="pre-title">` containing the title to the header.

```js copy=true
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
```

## Adding the copy button to the header

For the copy button, we will yet again create a transformer. This one will check if the `copy` metadata is present and add a `<div class="wrapper-copy-code">` containing the button to the header.

```js copy=true
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
```

## Adding the notation diff and hook up all the transformers

No more transformers to write! This time Shiki provides a transformer to add the notation diff to the code blocks. We just need to import it and hook it up along with all the transformers we wrote to the Astro configuration (make sure to add the `transformerMeta()` first as the other transformers we wrote need to access the metadata):

```js title=astro.config.mjs copy=true
import { transformerNotationDiff } from "@shikijs/transformers";

export default defineConfig({
  ...,
  markdown: {
    shikiConfig: {
      theme: "dracula",
      transformers: [ // [!code ++]
        transformerMeta(), // [!code ++]
        transformerCreateCodeBlockHeader(), // [!code ++]
        transformerAddTitleToCodeBlocksHeaders(), // [!code ++]
        transformerCopyButton(), // [!code ++]
        transformerNotationDiff(), // [!code ++]
      ],
      wrap: false,
    },
  },
});
```

To show the diff just add `// [!code +]` or `// [!code -]` in the Markdown at the end of the line you want to show as added or removed.

## Styling the code blocks

Let's add some CSS to style our code blocks (feel free to adjust the spacing, font-size, colors, etc. to your liking):

```css copy=true
article pre {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  border-radius: 0.375rem;
}

.pre-header {
  position: sticky;
  top: 0px;
  left: 0px;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.pre-title {
  width: 100%;
  border-radius: 0.375rem;
  background-color: #374151;
  padding: 0.25rem 1rem;
  text-align: center;
  font-size: 0.75rem;
  line-height: 1rem;
}

@media (min-width: 768px) {
  .pre-title {
    font-size: 0.875rem;
    line-height: 1rem;
  }
}

@media (min-width: 1024px) {
  .pre-title {
    font-size: 1rem;
    line-height: 1.5rem;
  }
}

.wrapper-copy-code {
  display: flex;
  width: 100%;
  flex-direction: row-reverse;
}

.copy-code {
  margin: 0.25rem;
  border-radius: 0.375rem;
  padding: 0.25rem 1rem;
  font-size: 0.75rem;
  line-height: 1rem;

  &:hover {
    background-color: #6b7280;
  }
}

@media (min-width: 768px) {
  .copy-code {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .copy-code {
    font-size: 1rem;
    line-height: 1.5rem;
  }
}

article pre code {
  display: block;
  width: 100%;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  text-indent: 0px;
  font-size: 0.75rem;
  line-height: 1rem;
}

@media (min-width: 768px) {
  article pre code {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
}

@media (min-width: 1024px) {
  article pre code {
    font-size: 1rem;
    line-height: 1.5rem;
  }
}

.line {
  display: inline-block;
  width: auto;
  min-width: 100%;
}

.diff.add {
  position: relative;
  background-color: #166534;

  &:before {
    content: "+";
    position: absolute;
    left: -1rem;
    color: #22c55e;
  }
}

.diff.remove {
  position: relative;
  background-color: #991b1b;
  opacity: 0.8;

  &:before {
    content: "-";
    position: absolute;
    left: -1rem;
    color: #ef4444;
  }
}
```

## Final touch

You might notice that some of the lines highlighted with the notation diff are not highlighted till the end of the code container. This is because of the HTML structure of the generated syntax highlighted code. A simple script can fix this. You can add it to your Astro layout file (client-side):

(<u>**Note**</u>: you don't need this script if you enabled code wrapping in your Shiki configuration.)

```js copy=true
<script>
    document.addEventListener('DOMContentLoaded', () => {
      const article = document.querySelector('article');
      if (article) {
        const preCodes = article.querySelectorAll('pre code');
        preCodes.forEach((preCode) => {
          const lines = preCode.querySelectorAll('.line');

          let maxWidth = 0;

          lines.forEach(line => {
            const width = line.getBoundingClientRect().width;
            if (width > maxWidth) {
              maxWidth = width;
            }
          });
          lines.forEach(line => {
            (line as HTMLElement).style.width = `${maxWidth}px`;
          });
        });
      }
    });
  </script>
```

## Conclusion

Voilà! Here's your final code block with a title and a copy button:

```dockerfile title=Dockerfile copy=true
FROM debian:12-slim

RUN apt update && apt install -y build-essential binutils-arm-none-eabi git libpng-dev gdebi-core wget
RUN wget https://apt.devkitpro.org/install-devkitpro-pacman && chmod +x ./install-devkitpro-pacman && echo "Y" | ./install-devkitpro-pacman
RUN git clone https://github.com/pret/agbcc

WORKDIR /agbcc

RUN chmod +x build.sh install.sh // [!code ++]
RUN ./build.sh // [!code --]
RUN ./install.sh /pokeemerald
```

You don't don't necessarily need to create this much transformers, a single one with all the logic can do the job. I chose to create multiple ones so that each one has a single responsibility. 

The useful thing about this approach is that you can show/hide the title and copy button at will by just removing/adding the metadata.

I hope this article was useful, this was a fun thing for me to work on.

See you in the next one!