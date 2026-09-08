"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Eye,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Upload,
  X,
} from "lucide-react";

type BlogStatus = "Published" | "Draft" | "Archived";

type Blog = {
  id: number;
  image: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  status: BlogStatus;
};

const initialBlogs: Blog[] = [
  {
    id: 1,
    image: "/images/blog-1.png",
    title: "How To Choose The Right Wedding Venue",
    excerpt: "A practical guide for comparing guest capacity, location, and service options.",
    category: "Planning",
    date: "03 Sep 2026",
    status: "Published",
  },
  {
    id: 2,
    image: "/images/blog-2.png",
    title: "Catering Questions Every Couple Should Ask",
    excerpt: "Key menu, serving, and timing questions before finalizing a caterer.",
    category: "Catering",
    date: "28 Aug 2026",
    status: "Draft",
  },
  {
    id: 3,
    image: "/images/blog-3.png",
    title: "Photography Timeline For Wedding Day",
    excerpt: "A timeline that keeps portraits, ceremony, and reception coverage organized.",
    category: "Photography",
    date: "18 Aug 2026",
    status: "Archived",
  },
];

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [query, setQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [deleteBlog, setDeleteBlog] = useState<Blog | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newBlogImage, setNewBlogImage] = useState("/images/blog-1.png");

  const filteredBlogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return blogs.filter((blog) => {
      const matchesQuery = [blog.title, blog.excerpt, blog.category, blog.date, blog.status]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesFilter =
        filterBy === "all" || blog.status.toLowerCase() === filterBy;

      return matchesQuery && matchesFilter;
    });
  }, [blogs, filterBy, query]);

  const removeBlog = () => {
    if (!deleteBlog) {
      return;
    }

    setBlogs((current) => current.filter((blog) => blog.id !== deleteBlog.id));
    setDeleteBlog(null);
  };

  const updateNewBlogImage = (file: File | undefined) => {
    if (!file) {
      return;
    }

    setNewBlogImage(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="[font-family:var(--font-playfair)] text-[40px] font-normal leading-tight text-[#16231f]">
              Blogs
            </h2>
            <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
              Manage blog posts, categories, publish dates, and content status.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-[#01241D] px-5 font-inter text-[14px] font-semibold text-white transition-colors hover:bg-[#C07C22]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Blog
          </button>
        </div>
      </section>

      <section className="rounded-[16px] bg-white p-5 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex min-h-12 w-full max-w-[820px] items-center gap-3 rounded-[10px] border border-[#0D5B46] px-4">
            <Search className="h-5 w-5 text-[#0D5B46]" aria-hidden="true" />
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search blogs" className="w-full bg-transparent font-inter text-sm text-[#16231f] outline-none placeholder:text-[#68746e]" />
          </label>
          <label className="flex min-h-12 items-center gap-3 rounded-[10px] border border-[#0D5B46] px-4">
            <SlidersHorizontal className="h-5 w-5 text-[#0D5B46]" aria-hidden="true" />
            <select value={filterBy} onChange={(event) => setFilterBy(event.target.value)} className="bg-transparent font-inter text-sm font-medium text-[#0D5B46] outline-none">
              <option value="all">Filter</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1020px] border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-[#f5f7f4]">
                {["Image", "Title", "Category", "Date", "Status", "Action"].map((heading) => (
                  <TableHead key={heading}>{heading}</TableHead>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <span className="relative block h-14 w-20 overflow-hidden rounded-[10px] bg-[#f5f7f4]">
                      <Image src={blog.image} alt={blog.title} fill sizes="80px" className="object-cover" />
                    </span>
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <p className="whitespace-nowrap font-inter text-[14px] font-semibold text-[#16231f]">{blog.title}</p>
                    <p className="mt-1 max-w-[420px] truncate font-inter text-[12px] font-medium text-gray-700/50">{blog.excerpt}</p>
                  </td>
                  <TableCell>{blog.category}</TableCell>
                  <TableCell>{blog.date}</TableCell>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <StatusBadge status={blog.status} />
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ViewButton onClick={() => setSelectedBlog(blog)} />
                      <button
                        type="button"
                        onClick={() => setDeleteBlog(blog)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#b42318] text-white transition-colors hover:bg-[#8f1d14]"
                        aria-label={`Delete ${blog.title}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedBlog ? (
        <Modal title="Blog Details" onClose={() => setSelectedBlog(null)}>
          <div className="rounded-[12px] border border-[#dfe7e2] p-4">
            <div className="flex items-center gap-4">
              <span className="relative h-16 w-24 flex-none overflow-hidden rounded-[12px] bg-[#f5f7f4]">
                <Image src={selectedBlog.image} alt={selectedBlog.title} fill sizes="96px" className="object-cover" />
              </span>
              <div>
                <h3 className="mt-1 font-inter text-[18px] font-semibold text-[#16231f]">{selectedBlog.title}</h3>
                <p className="font-inter text-[13px] font-semibold text-gray-700/80">{selectedBlog.excerpt}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <DetailItem label="Category" value={selectedBlog.category} />
            <DetailItem label="Date" value={selectedBlog.date} />
            <DetailItem label="Status" value={selectedBlog.status} />
          </div>
          <ModalClose onClick={() => setSelectedBlog(null)} />
        </Modal>
      ) : null}

      {deleteBlog ? (
        <Modal title="Delete Blog" onClose={() => setDeleteBlog(null)}>
          <p className="font-inter text-[15px] leading-7 text-[#68746e]">
            Delete <span className="font-semibold text-[#16231f]">{deleteBlog.title}</span> from the blog list?
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setDeleteBlog(null)} className="rounded-md border border-[#dfe7e2] px-5 py-2.5 font-inter text-sm font-medium text-[#16231f] hover:bg-[#f5f7f4]">Cancel</button>
            <button type="button" onClick={removeBlog} className="rounded-md bg-[#b42318] px-5 py-2.5 font-inter text-sm font-medium text-white hover:bg-[#8f1d14]">Delete</button>
          </div>
        </Modal>
      ) : null}

      {isAddOpen ? (
        <Modal title="Add Blog" onClose={() => setIsAddOpen(false)}>
          <div className="mb-5 rounded-[12px] border border-dashed border-[#0D5B46] bg-[#f5f7f4] p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <span className="relative h-20 w-28 flex-none overflow-hidden rounded-[12px] bg-white">
                <Image
                  src={newBlogImage}
                  alt="New blog image preview"
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </span>
              <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-white px-4 font-inter text-[14px] font-semibold text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white">
                <Upload className="h-4 w-4" aria-hidden="true" />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => updateNewBlogImage(event.target.files?.[0])}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {["Title", "Sub Paragraph", "Category", "Date"].map((label) => (
              <label key={label} className={label === "Sub Paragraph" ? "block sm:col-span-2" : "block"}>
                <span className="font-inter text-[13px] font-semibold text-[#16231f]">{label}</span>
                <input className="mt-2 h-11 w-full rounded-[10px] border border-[#dfe7e2] bg-[#fbfcfa] px-4 font-inter text-[14px] text-[#16231f] outline-none focus:border-[#0D5B46]" />
              </label>
            ))}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddOpen(false)} className="rounded-md border border-[#dfe7e2] px-5 py-2.5 font-inter text-sm font-medium text-[#16231f] hover:bg-[#f5f7f4]">Cancel</button>
            <button type="button" onClick={() => setIsAddOpen(false)} className="rounded-md bg-[#01241D] px-5 py-2.5 font-inter text-sm font-medium text-white hover:bg-[#C07C22]">Add Blog</button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

function TableHead({ children }: { children: ReactNode }) {
  return <th className="whitespace-nowrap px-4 py-3 font-inter text-[13px] font-semibold capitalize text-black">{children}</th>;
}

function TableCell({ children }: { children: ReactNode }) {
  return <td className="whitespace-nowrap border-b border-[#edf1ee] px-4 py-3 font-inter text-[13px] font-medium text-[#16231f]">{children}</td>;
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-[#dfe7e2] p-4">
      <p className="font-inter text-[14px] font-medium capitalize tracking-[0.14em] text-black">{label}</p>
      <p className="mt-1 font-inter text-[14px] font-medium text-gray-700/50">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: BlogStatus }) {
  const className =
    status === "Published"
      ? "bg-emerald-50 text-emerald-700"
      : status === "Draft"
        ? "bg-amber-50 text-amber-700"
        : "bg-gray-100 text-gray-500";

  return <span className={`whitespace-nowrap rounded-full px-2.5 py-1 font-inter text-[11px] font-semibold ${className}`}>{status}</span>;
}

function ViewButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex min-h-9 items-center gap-2 rounded-[10px] border border-[#01241D] px-3 font-inter text-[13px] font-semibold text-[#01241D] transition-colors hover:bg-[#01241D]/10">
      <Eye className="h-4 w-4" aria-hidden="true" />
      View
    </button>
  );
}

function ModalClose({ onClick }: { onClick: () => void }) {
  return (
    <div className="mt-6 flex justify-end">
      <button type="button" onClick={onClick} className="rounded-md bg-[#01241D] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#C07C22]">Close</button>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-5 py-8">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[16px] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 className="font-inter text-[22px] font-semibold text-[#16231f]">{title}</h2>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7f4] text-[#0D5B46]" aria-label={`Close ${title}`}>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
