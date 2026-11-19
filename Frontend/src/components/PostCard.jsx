import { Link } from "react-router-dom"

const PostCard = ({ post }) => {
   console.log(post);

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      {post.image && (
        < img
          src={post.coverImage}
          alt={post.title}
          className="h-52 w-full object-cover"
        />
      )}

      {/* Post details */}
      <div className="p-5">

       {post.category?.name && (
          <span className="text-sm font-medium text-purple-600">
            {post.category.name}
          </span>
        )}

        <h3 className="mt-2 text-xl font-semibold text-gray-900">
          {post.title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          {post.excerpt ?? post.content?.slice(0, 120)}
        </p>

        <div className="mt-5 flex items-center justify-between text-sm text-gray-500">
          <span>{post.author?.name}</span>
          <span>{formattedDate}</span>
        </div>

        <Link
          to={`/post/${post.slug}`}
          className="mt-4 inline-block font-medium text-purple-600 hover:text-purple-800"
        >
          Read more →
        </Link>

      </div>




    </article>
  )
}

export default PostCard
