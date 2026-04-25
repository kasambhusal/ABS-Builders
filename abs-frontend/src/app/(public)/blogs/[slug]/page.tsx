import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicBlogBySlug } from "@/services/blog.service";
import { getSiteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { formatDate } from "@/utils/format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getPublicBlogBySlug(slug);
  if (!blog) return { title: "Blog post" };
  const base = getSiteUrl();
  return {
    title: blog.title,
    description: blog.excerpt ?? blog.content?.slice(0, 160),
    openGraph: {
      title: blog.title,
      url: `${base}/blogs/${blog.slug}`,
      images: blog.image_url ? [{ url: blog.image_url }] : undefined,
    },
  };
}

export default async function PublicBlogPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getPublicBlogBySlug(slug);
  if (!blog) notFound();

  const base = getSiteUrl();
  const structured = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    datePublished: blog.created_at,
    image: blog.image_url,
    url: `${base}/blogs/${blog.slug}`,
  };

  return (
    <>
      <JsonLd data={structured} />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-semibold text-stone-900">{blog.title}</h1>
        <p className="mt-2 text-sm text-stone-500">
          {formatDate(blog.created_at)}
        </p>
        {blog.image_url ? (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl bg-stone-200">
            <Image
              src={blog.image_url}
              alt={blog.title}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 720px"
              priority
            />
          </div>
        ) : null}
        <div className="mt-8 max-w-none whitespace-pre-wrap leading-relaxed text-stone-700">
          {blog.content ?? blog.excerpt ?? "Content coming soon."}
        </div>
      </article>
    </>
  );
}
