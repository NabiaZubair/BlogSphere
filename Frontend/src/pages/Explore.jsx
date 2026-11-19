import React from 'react'
import api from "../api/axios"
import PostCard from '../components/PostCard'
import { useState } from 'react'
import { useEffect } from 'react'


const Explore = () => {
    const [posts, setPost] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError("");
                const { data } = await api.get(`/posts?page=${page}&limit=9`)
                setPost((prev) => (page === 1 ? data.posts : [...prev, ...data.posts]));
                setHasMore(page < data.totalPages);
            } catch (err) {
                setError("could not load posts.please try again.");
            } finally {
                setLoading(false)
            };
        };
        fetchPosts();

    }, [page]);






    return (
        <main>
            <h1>All Articles</h1>
            {error && <p>{error}</p>}
            <div>
                {posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                ))}
            </div>

            {!loading && posts.length === 0 && !error && <p>No posts Yet.</p>}
            {loading && <p>Loading...</p>}
            {hasMore && !loading && (
                <button onClick={() => setPage((p) => p + 1)}>Load More</button>
            )}
        </main>
    )
}

export default Explore
