
import PostCard from './PostCard'

const posts = [
  {
    id: 1,
    title: 'Getting Started with Web Development',
    category: 'Programming',
    excerpt: 'Learn the fundamentals of building modern websites.',
    author: 'Sarah Ahmed',
    date: 'Oct 25, 2026',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
  },
  {
    id: 2,
    title: 'How AI Is Changing Our Daily Lives',
    category: 'Technology',
    excerpt: 'Explore how artificial intelligence is changing the way we work.',
    author: 'Ali Hassan',
    date: 'Oct 24, 2026',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
  },
  {
    id: 3,
    title: 'Building Better Habits Every Day',
    category: 'Lifestyle',
    excerpt: 'Small daily habits can help you grow and become more productive.',
    author: 'Ayesha Khan',
    date: 'Oct 23, 2026',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
  },
]

const LatestPosts = () => {
  return (
    <section className="py-16">

      {/* Section heading */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">
            Latest Stories
          </h2>

          <p className="mt-2 text-gray-600">
            Discover the latest stories from our community.
          </p>
        </div>

        <a
          href="/blogs"
          className="shrink-0 font-medium text-purple-600 hover:text-purple-800"
        >
          View all →
        </a>
      </div>

      {/* Post cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

    </section>
  )
}

export default LatestPosts
