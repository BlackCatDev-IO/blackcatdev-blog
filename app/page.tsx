import Link from 'next/link';
import { getBlogPosts } from './api/fetch-blogs';
import { BlogCard } from './post/blog-card/blog-card';

export default async function Home() {
  const blogs = await getBlogPosts();
  const sortedBlogs = [...blogs].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return (
    <main>
      <h1>Blog</h1>
      <div>
        <ul>
          {sortedBlogs.map((blog, index) => (
            <li key={index}>
              <Link href={`/post/${blog.slug}`} key={blog.slug}>
                <BlogCard blog={blog} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
