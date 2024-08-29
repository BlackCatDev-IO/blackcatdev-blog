import Link from 'next/link';
import { getBlogPosts } from './api/fetch-blogs';
import { BlogCard } from './post/blog-card/blog-card';

export default async function Home() {
  const blogs = await getBlogPosts();

  return (
    <main>
      <h1>Blog</h1>
      <div>
        <ul>
          {blogs.map((blog, index) => (
            <li key={index}>
              <Link href={`/post/${blog.id}`} key={blog.id}>
                <BlogCard blog={blog} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

