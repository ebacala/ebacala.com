#!/usr/bin/env node

import generateOgImage from "./generate-og-image.js";
import fs from "fs";
import path from "path";

async function generateAllOGImages() {
  console.log("🎨 Starting OG image generation for all blog posts...");

  // Find all blog markdown files
  const blogDir = path.join(process.cwd(), "blog");
  if (!fs.existsSync(blogDir)) {
    console.log("Blog directory not found");
    return;
  }

  const blogPosts = [];

  // Recursively find all markdown files in blog directory
  function findMarkdownFiles(dirPath) {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        findMarkdownFiles(fullPath);
      } else if (item.endsWith(".md")) {
        blogPosts.push(fullPath);
      }
    }
  }

  findMarkdownFiles(blogDir);

  console.log(`Found ${blogPosts.length} blog posts to process`);

  // Process each blog post
  for (const postPath of blogPosts) {
    try {
      await processBlogPost(postPath);
    } catch (error) {
      console.error(`Error processing ${postPath}:`, error);
    }
  }

  console.log("✅ All OG images generated!");
}

async function processBlogPost(postPath) {
  // Read the markdown file
  const content = fs.readFileSync(postPath, "utf-8");

  // Extract frontmatter (simple YAML-like parsing)
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    throw new Error(`No frontmatter found in ${postPath}`);
  }

  const frontmatter = parseFrontmatter(frontmatterMatch[1]);

  // Extract required data
  const title = frontmatter.title;
  const author = frontmatter.author;
  const tag = frontmatter.tag || "Blog";

  let picturePath = "src/assets/img/profile-picture.png";
  if (picturePath && picturePath.startsWith("./")) {
    // Convert relative path to absolute path
    picturePath = path.join(path.dirname(postPath), picturePath);
  }

  if (!title) {
    console.log(`No title found in ${postPath}`);
    return;
  }

  const postDir = path.dirname(postPath);
  const ogImagePath = path.join(postDir, "og_image.png");

  // Generate the OG image
  console.log(`Generating OG image for ${path.basename(postPath)}...`);

  try {
    const screenshot = await generateOgImage({
      title,
      author,
      tag,
      picturePath,
    });

    fs.writeFileSync(ogImagePath, screenshot);
    console.log(`✅ OG image generated for ${path.basename(postPath)}`);
  } catch (error) {
    throw error;
  }
}

function parseFrontmatter(frontmatterText) {
  const frontmatter = {};
  const lines = frontmatterText.split("\n");

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      // Remove quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      frontmatter[key] = value;
    }
  }

  return frontmatter;
}

// Run the script
generateAllOGImages().catch(console.error);
