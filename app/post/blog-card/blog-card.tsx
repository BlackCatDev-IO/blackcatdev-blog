import { BlogPostData } from '../types/blog';
import Image from 'next/image';
import styles from './blog-card.module.css';

export function BlogCard({ blog: blog }: { blog: BlogPostData }) {
  const imageAttributes = blog.attributes.image.data[0].attributes;
  const baseUrl = process.env.baseUrl;
  const imageUrl = `${baseUrl}${imageAttributes.url}`;

  return (
    <div className={styles.blogCard}>
      <Image
        src={imageUrl}
        key={imageAttributes.name}
        alt={blog.attributes.title}
        width={100}
        height={100}
      />
      <h2>{blog.attributes.title}</h2>
    </div>
  );
}
