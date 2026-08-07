import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Image } from "#/components/ui/Image";
import { MarkdownPreview } from "#/components/ui/MarkdownPreview";
import { MaterialIcon } from "#/components/ui/MaterialIcon";
import { getBlogDetail } from "#/server/cms";
import { formatDate } from "#/utils/fn";
import { BlogCard } from "#/components/ui/BlogCard";

export const Route = createFileRoute("/_public/blog/$slug/")({
  component: BlogDetail,
  loader: async ({ params }) => {
    const { blogDetail, related } = await getBlogDetail({
      data: { slug: params.slug },
    });

    return {
      post: blogDetail,
      related,
    };
  },
});

function BlogDetail() {
  const navigate = useNavigate();
  const { post, related } = Route.useLoaderData();
  const imageUrl = post?.files?.find((f) => f.role === "thumbnail")?.url;

  if (!post) {
    return (
      <div className="pt-32 text-center">
        <p className="text-ash">Artikel tidak ditemukan.</p>
        <Link
          resetScroll={false}

          to="/blog"
          className="text-blue hover:underline mt-4 inline-block"
        >
          Kembali ke Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="pt-32 pb-12 max-w-3xl mx-auto w-full">
        <button
          type="button"
          onClick={() => navigate({ to: "/blog" })}
          className="inline-flex items-center gap-2 text-[11px] tracking-widest text-ash hover:text-blue transition-colors mb-10 group"
        >
          <MaterialIcon
            name="arrow_back"
            className="!text-[16px] group-hover:-translate-x-1 transition-transform"
          />
          KEMBALI KE BLOG
        </button>

        {/* Category Label */}
        {post.blogCategory?.name && (
          <span className="text-[12px] tracking-widest text-blue-bright font-semibold uppercase block">
            {post.blogCategory.name}
          </span>
        )}

        {/* Judul */}
        <h1 className="font-head font-black text-3xl md:text-5xl leading-tight tracking-tight mt-4 mb-6">
          {post.title}
        </h1>

        <p className="text-[13px] text-ash mb-10">
          {formatDate(post.publishedAt)}
        </p>

        {/* Container Gambar dengan layoutId yang sama seperti di BlogCard */}
        <motion.div
          layoutId={`blog-card-${post.slug}`}
          transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
          className="aspect-[16/9] bg-paper-dim overflow-hidden mb-5"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MaterialIcon
                name="article"
                className="!text-[40px] text-blue/30"
              />
            </div>
          )}
        </motion.div>

        <MarkdownPreview content={post.content} />
      </section>

      {Array.isArray(related) && related?.length > 0 && (
        <section className="max-w-3xl mx-auto w-full pb-24 border-t border-line pt-12">
          <h3 className="font-head font-bold text-lg mb-6">Artikel Lainnya</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
            {related.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
