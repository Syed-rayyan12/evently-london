import { z } from "zod";

export const blogStatusValidator = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const blogSectionValidator = z.object({
  title: z.string().trim().min(1, "Section title is required"),
  paragraph: z.string().trim().min(1, "Section paragraph is required")
});

export const blogPostValidator = z.object({
  title: z.string().trim().min(1, "Blog title is required"),
  sections: z.array(blogSectionValidator).min(1, "Add at least one section")
});

export const blogStatusUpdateValidator = z.object({
  status: blogStatusValidator
});

export type BlogPostRequest = z.infer<typeof blogPostValidator>;
export type BlogSection = z.infer<typeof blogSectionValidator>;
export type BlogStatusUpdateRequest = z.infer<typeof blogStatusUpdateValidator>;

export type BlogPostResponse = {
  id: string;
  slug: string;
  title: string;
  sections: BlogSection[];
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
