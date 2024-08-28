import Image from 'next/image';
import Link from 'next/link';
import { getBlogPosts } from './api/fetch-blogs';
import { BlogPostData } from './post/types/blog';

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

function BlogCard({ blog: blog }: { blog: BlogPostData }) {
  const imageAttributes = blog.attributes.image.data[0].attributes;
  const baseUrl = process.env.baseUrl;
  const imageUrl = `${baseUrl}${imageAttributes.url}`;

  return (
    <div>
      <h2>{blog.attributes.title}</h2>
      <p>{blog.attributes.subTitle}</p>
      <Image
        src={imageUrl}
        key={imageAttributes.name}
        alt={blog.attributes.title}
        width={100}
        height={100}
      />
    </div>
  );
}
