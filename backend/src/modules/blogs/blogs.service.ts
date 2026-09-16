import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../middleware/error.js";
import type {
  BlogPostDetailResponse,
  BlogPostRequest,
  BlogPostResponse,
  BlogPostsResponse,
  BlogStatusUpdateRequest
} from "./blogs.types.js";

const blogPostSelect = {
  id: true,
  slug: true,
  title: true,
  bannerImage: true,
  sections: true,
  status: true,
  createdAt: true,
  updatedAt: true
} as const;

export function listPublicBlogs(): Promise<BlogPostsResponse> {
  return prisma.blogPost
    .findMany({
      where: { status: "PUBLISHED" },
      select: blogPostSelect,
      orderBy: { createdAt: "desc" }
    })
    .then((blogs) => ({ blogs: blogs.map(normalizeBlogPost) }));
}

export async function getPublicBlogBySlug(slug: string): Promise<BlogPostDetailResponse> {
  const blog = await prisma.blogPost.findFirst({
    where: {
      slug,
      status: "PUBLISHED"
    },
    select: blogPostSelect
  });

  if (!blog) {
    throw new AppError("Blog post not found", 404);
  }

  return { blog: normalizeBlogPost(blog) };
}

export function listAdminBlogs(): Promise<BlogPostsResponse> {
  return prisma.blogPost
    .findMany({
      select: blogPostSelect,
      orderBy: { createdAt: "desc" }
    })
    .then((blogs) => ({ blogs: blogs.map(normalizeBlogPost) }));
}

export async function createAdminBlog(input: BlogPostRequest): Promise<BlogPostDetailResponse> {
  const slug = await createUniqueSlug(input.title);
  const blog = await prisma.blogPost.create({
    data: {
      slug,
      title: input.title,
      bannerImage: input.bannerImage,
      sections: input.sections,
      status: "PUBLISHED"
    },
    select: blogPostSelect
  });

  return { blog: normalizeBlogPost(blog) };
}

export async function deleteAdminBlog(blogId: string) {
  const blog = await prisma.blogPost.findUnique({
    where: { id: blogId },
    select: { id: true }
  });

  if (!blog) {
    throw new AppError("Blog post not found", 404);
  }

  await prisma.blogPost.delete({ where: { id: blogId } });

  return { id: blogId };
}

export async function updateAdminBlogStatus(
  blogId: string,
  input: BlogStatusUpdateRequest
): Promise<BlogPostDetailResponse> {
  const blog = await prisma.blogPost.findUnique({
    where: { id: blogId },
    select: { id: true }
  });

  if (!blog) {
    throw new AppError("Blog post not found", 404);
  }

  const updatedBlog = await prisma.blogPost.update({
    where: { id: blogId },
    data: { status: input.status },
    select: blogPostSelect
  });

  return { blog: normalizeBlogPost(updatedBlog) };
}

type BlogPostRecord = {
  id: string;
  slug: string;
  title: string;
  bannerImage: string;
  sections: unknown;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: Date;
  updatedAt: Date;
};

function normalizeBlogPost(blog: BlogPostRecord): BlogPostResponse {
  return {
    ...blog,
    sections: normalizeSections(blog.sections)
  };
}

function normalizeSections(value: unknown): BlogPostResponse["sections"] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((section) => {
      if (!section || typeof section !== "object") {
        return null;
      }

      const record = section as Record<string, unknown>;
      const title = typeof record.title === "string" ? record.title : "";
      const paragraph = typeof record.paragraph === "string" ? record.paragraph : "";

      if (!title.trim() && !paragraph.trim()) {
        return null;
      }

      return {
        title,
        paragraph
      };
    })
    .filter((section): section is BlogPostResponse["sections"][number] => Boolean(section));
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "blog-post";
}

async function createUniqueSlug(title: string) {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let suffix = 1;

  while (await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  return slug;
}

export type { BlogPostResponse };
