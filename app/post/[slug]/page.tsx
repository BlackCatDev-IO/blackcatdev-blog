import {
  getBlogPosts,
  getBlogPostsById as getBlogPostById,
} from '../../api/fetch-blogs';
import { ContentBlock } from '../types/blog';
import Image from 'next/image';
import styles from './blog-post.module.css';
import formatDate from '../../utils/date-formatter';

export async function generateStaticParams() {
  const posts = await getBlogPosts();

  return posts.map((post) => ({
    slug: post.attributes.slug,
  }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  console.log('slug');
  console.log(params.slug);

  const blog = await getBlogPostById({ slug: params.slug });
  const attributes = blog.attributes;
  console.log(blog.attributes.title);
  const image = attributes.image.data[0].attributes;
  const baseUrl = process.env.baseUrl;
  const imageUrl = `${baseUrl}${image.url}`;
  console.log('imageURl');
  console.log(imageUrl);
  const formattedDate = formatDate(attributes.dateCreated);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{attributes.title}</h1>
      <p className={styles.subTitle}>{attributes.subTitle}</p>
      <p className={styles.publishedDate}>{formattedDate}</p>
      <Image
        className={styles.mainImage}
        src={imageUrl}
        alt={image.name}
        width={image.width}
        height={image.height}
      />
      <p className={styles.titleImageCaption}>{image.caption} </p>
      <RenderContent content={attributes.content} />
    </div>
  );
}

const RenderContent: React.FC<{ content: ContentBlock[] }> = ({ content }) => {
  return content.map((block, index) => {
    switch (block.type) {
      case 'heading':
        const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
        return <HeadingTag key={index}>{block.children[0].text}</HeadingTag>;

      case 'paragraph':
        return (
          <p key={index}>
            {block.children.map((child, idx) => {
              switch (true) {
                case !!child.bold:
                  return <strong key={idx}>{child.text}</strong>;
                case !!child.italic:
                  return <em key={idx}>{child.text}</em>;
                case !!child.underline:
                  return <u key={idx}>{child.text}</u>;
                case !!child.strikethrough:
                  return <del key={idx}>{child.text}</del>;
                case child.type === 'link':
                  return (
                    <a
                      key={idx}
                      href={child.url}
                      className={styles.link}
                      target="_blank"
                    >
                      {child.children ? child.children[0].text : child.text}
                    </a>
                  );
                default:
                  return child.text;
              }
            })}
          </p>
        );

      case 'list':
        if (block.format === 'ordered') {
          return (
            <ol key={index}>
              {block.children.map((item, idx) => (
                <li key={idx}>{item.children?.[0]?.text ?? ''}</li>
              ))}
            </ol>
          );
        } else {
          return (
            <ul key={index}>
              {block.children.map((item, idx) => (
                <li className={styles.bulletList} key={idx}>
                  {item.children?.[0]?.text}
                </li>
              ))}
            </ul>
          );
        }

      case 'image':
        const image = block.image;
        const caption = image?.caption;

        return (
          <div key={index} className={styles.imageContainer}>
            <Image
              className={styles.blogImage}
              key={index}
              src={image?.url || ''}
              alt={image?.alternativeText || ''}
              width={image?.width}
              height={image?.height}
            />
            {caption && <p className={styles.imageCaption}>{caption}</p>}
          </div>
        );

      case 'quote':
        return <blockquote key={index}>{block.children[0].text}</blockquote>;

      case 'code':
        return (
          <pre key={index}>
            <code>{block.children[0].text}</code>
          </pre>
        );

      default:
        return null;
    }
  });
};
