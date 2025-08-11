import f from"puppeteer";import d from"fs";import u from"path";async function h(l){let{title:i,tag:o,author:a,picturePath:e}=l;if(!o)throw new Error("Tag is required");if(!i)throw new Error("Title is required");if(!a)throw new Error("Author is required");if(!e)throw new Error("Picture path is required");if(!d.existsSync(e))throw new Error(`Picture file does not exist: ${e}`);let r=u.extname(e).toLowerCase(),n=[".png",".jpg",".jpeg",".gif",".bmp",".webp",".svg"];if(!n.includes(r))throw new Error(`Invalid image file format. Supported formats: ${n.join(", ")}`);let c=d.readFileSync(e).toString("base64"),p=`data:${`image/${r.slice(1)==="jpg"?"jpeg":r.slice(1)}`};base64,${c}`,s=await f.launch(),t=await s.newPage();await t.setViewport({width:1200,height:630,deviceScaleFactor:1});let g=`
    <!DOCTYPE html>
<html>
  <head>
    <style>
      * {
        box-sizing: border-box;
      }

      [debug] {
        * {
          outline: 1px solid red;
        }
      }

      :root {
        --color-foreground: hsl(0, 0%, 10%);
      }

      html {
        background-color: white;
        font-size: 16px;
        margin: 0;
        padding: 0;
      }

      body {
        background: linear-gradient(to top right, #dadbd4, #f7f7f3);
        color: var(--color-foreground);
        display: flex;
        flex-direction: column;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        height: 630px;
        margin: 0;
        padding: 4rem;
        width: 1200px;
        box-sizing: border-box;
      }

      .tag {
        align-self: flex-start;
        background: transparent;
        border: 1px solid var(--color-foreground);
        border-radius: 20px;
        font-size: 1rem;
        margin-top: 8rem;
        padding: 8px 16px;
      }

      .title {
        align-items: center;
        display: flex;
        flex: 1;
        font-size: 3.5rem;
        line-height: 1.2;
        margin-bottom: 4rem;
      }

      .author {
        align-items: center;
        display: flex;
        gap: 1rem;
      }

      .profile-pic {
        background: url(${p})
          center center;
        background-size: cover;
        border: 1px solid white;
        border-radius: 50%;
        height: 6rem;
        width: 6rem;
      }

      .author-name {
        font-size: 2rem;
      }
    </style>
  </head>
  <body>
    <div class="tag">${o}</div>
    <div class="title">${i}</div>
    <div class="author">
      <div class="profile-pic"></div>
      <div class="author-name">${a}</div>
    </div>
  </body>
</html>
  `;await t.setContent(g);let m=await t.screenshot({type:"png"});return await s.close(),m}var E=h;export{E as default,h as generateOgImage};
