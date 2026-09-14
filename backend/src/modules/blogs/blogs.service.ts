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
  category: true,
  bannerImage: true,
  paragraph: true,
  extraParagraph: true,
  listTitle: true,
  listItems: true,
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
    .then((blogs) => ({ blogs }));
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

  return { blog };
}

export function listAdminBlogs(): Promise<BlogPostsResponse> {
  return prisma.blogPost
    .findMany({
      select: blogPostSelect,
      orderBy: { createdAt: "desc" }
    })
    .then((blogs) => ({ blogs }));
}

export async function createAdminBlog(input: BlogPostRequest): Promise<BlogPostDetailResponse> {
  const slug = await createUniqueSlug(input.title);
  const blog = await prisma.blogPost.create({
    data: {
      slug,
      title: input.title,
      category: input.category,
      bannerImage: input.bannerImage,
      paragraph: input.paragraph,
      extraParagraph: input.extraParagraph?.trim() || null,
      listTitle: input.listTitle?.trim() || null,
      listItems: input.listItems,
      status: input.status
    },
    select: blogPostSelect
  });

  return { blog };
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

  return { blog: updatedBlog };
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
