import Image from 'next/image';
import styles from './page.module.css';
import BlogPost from './blog-post/blog-post';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <BlogPost />
      </div>
    </main>
  );
}
