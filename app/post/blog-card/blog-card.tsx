import { BlogPostData } from '../types/blog';
import Image from 'next/image';
import styles from './blog-card.module.css';

export function BlogCard({ blog: blog }: { blog: BlogPostData }) {
  const imageAttributes = blog.heroImage;
  const baseUrl = process.env.baseUrl;
  const imageUrl = imageAttributes.url.startsWith('http')
    ? imageAttributes.url
    : `${baseUrl}${imageAttributes.url}`;

  return (
    <div className={styles.blogCard}>
      <Image
        src={imageUrl}
        key={imageAttributes.filename}
        alt={blog.title}
        width={100}
        height={100}
      />
      <h2>{blog.title}</h2>
    </div>
  );
}
