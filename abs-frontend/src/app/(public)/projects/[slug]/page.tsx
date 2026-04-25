import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicProjectBySlug } from "@/services/project.service";
import { getSiteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  if (!project) return { title: "Project" };
  const base = getSiteUrl();
  return {
    title: project.title,
    description: project.excerpt ?? project.description?.slice(0, 160),
    openGraph: {
      title: project.title,
      description: project.excerpt ?? undefined,
      url: `${base}/projects/${project.slug}`,
      images: project.image_url ? [{ url: project.image_url }] : undefined,
    },
  };
}

export default async function PublicProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  if (!project) notFound();

  const base = getSiteUrl();
  const structured = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.excerpt ?? project.description,
    image: project.image_url,
    url: `${base}/projects/${project.slug}`,
  };

  return (
    <>
      <JsonLd data={structured} />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-semibold text-stone-900">
          {project.title}
        </h1>
        {project.location ? (
          <p className="mt-2 text-sm text-stone-500">{project.location}</p>
        ) : null}
        {project.image_url ? (
          <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-xl bg-stone-200">
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 720px"
              priority
            />
          </div>
        ) : null}
        {project.description ? (
          <div className="mt-8 max-w-none whitespace-pre-wrap leading-relaxed text-stone-700">
            {project.description}
          </div>
        ) : (
          <p className="mt-8 text-stone-600">
            Details for this project will appear here from your CMS.
          </p>
        )}
      </article>
    </>
  );
}
