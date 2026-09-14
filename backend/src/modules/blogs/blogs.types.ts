import { z } from "zod";

export const blogStatusValidator = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const blogPostValidator = z.object({
  title: z.string().trim().default(""),
  category: z.string().trim().default(""),
  bannerImage: z.string().trim().default(""),
  paragraph: z.string().trim().default(""),
  extraParagraph: z.string().trim().optional(),
  listTitle: z.string().trim().optional(),
  listItems: z.array(z.string().trim()).default([]),
  status: blogStatusValidator.default("PUBLISHED")
});

export const blogStatusUpdateValidator = z.object({
  status: blogStatusValidator
});

export type BlogPostRequest = z.infer<typeof blogPostValidator>;
export type BlogStatusUpdateRequest = z.infer<typeof blogStatusUpdateValidator>;

export type BlogPostResponse = {
  id: string;
  slug: string;
  title: string;
  category: string;
  bannerImage: string;
  paragraph: string;
  extraParagraph: string | null;
  listTitle: string | null;
  listItems: string[];
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: Date;
  updatedAt: Date;
};

export type BlogPostsResponse = {
  blogs: BlogPostResponse[];
};

export type BlogPostDetailResponse = {
  blog: BlogPostResponse;
};
