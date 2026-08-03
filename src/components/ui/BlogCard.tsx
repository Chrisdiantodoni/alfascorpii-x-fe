import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { Blog } from "#/types";
import { formatDate } from "#/utils/fn";
import { Image } from "./Image";
import { MaterialIcon } from "./MaterialIcon";

interface BlogCardProps {
	post: Blog;
}

export function BlogCard({ post }: BlogCardProps) {
	const imageUrl = post.files?.find((f) => f.role === "thumbnail")?.url;

	return (
		<Link
			to="/blog/$slug"
			params={{ slug: post.slug }}
			className="blog-item group block"
		>
			<motion.div
				layoutId={`blog-card-${post.slug}`}
				className="aspect-[16/9] bg-paper-dim overflow-hidden mb-5"
			>
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt={post.title}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

			<span className="text-[10px] tracking-widest font-semibold text-blue-bright">
				{post.blogCategory.name.toUpperCase()}
			</span>

			<h3 className="font-head font-bold text-lg leading-snug my-2 group-hover:text-blue transition-colors">
				{post.title}
			</h3>

			<p className="text-[13px] text-ash mb-3">{post.excerpt}</p>
			<p className="text-[11px] text-ash/70">{formatDate(post.publishedAt)}</p>
		</Link>
	);
}
