import Image from 'next/image';

interface ContentChild {
  text?: string;
  type?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  url?: string;
  children?: ContentChild[];
}

interface ContentBlock {
  type: string;
  level?: number;
  format?: string;
  children: ContentChild[];
  image?: ImageDetails;
}

interface ImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

interface ImageDetails {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  size: number;
  width: number;
  height: number;
  caption: string | null;
  formats: {
    large: ImageFormat;
    small: ImageFormat;
    medium: ImageFormat;
    thumbnail: ImageFormat;
  };
  provider: string;
  createdAt: string;
  updatedAt: string;
  previewUrl: string | null;
  alternativeText: string | null;
  provider_metadata: string | null;
}

interface MainImage {
  id: number;
  attributes: {
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
      large: ImageFormat;
      small: ImageFormat;
      medium: ImageFormat;
      thumbnail: ImageFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

interface BlogPostAttributes {
  title: string;
  subTitle: string;
  dateCreated: string;
  content: ContentBlock[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  image: {
    data: MainImage[];
  };
}

interface BlogPostData {
  id: number;
  attributes: BlogPostAttributes;
}

interface BlogPostResponse {
  data: BlogPostData;
}

interface Meta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

interface ApiResponse {
  data: BlogPostResponse;
  meta: Meta;
}

const baseUrl = process.env.baseUrl;

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
                    <a key={idx} href={child.url}>
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
                <li key={idx}>{item.children?.[0]?.text}</li>
              ))}
            </ul>
          );
        }

      case 'image':
        const image = block.image;

        return (
          <Image
            key={index}
            src={image?.url || ''}
            alt={image?.alternativeText || ''}
            width={image?.width}
            height={image?.height}
          />
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

const Page: React.FC<{ data: BlogPostData }> = ({ data }) => {
  const { title, subTitle, content, image } = data.attributes;

  console.log(data.attributes);

  const attributes = image.data[0].attributes;
  const imageUrl = `${baseUrl}${attributes.url}`;

  return (
    <div>
      <h1>{title}</h1>
      <h2>{subTitle}</h2>

      <Image
        key={attributes.name}
        src={imageUrl}
        alt={attributes.alternativeText || ''}
        width={attributes.width}
        height={attributes.height}
      ></Image>
      <RenderContent content={content} />
    </div>
  );
};

export default async function BlogPost() {
  const url = `${baseUrl}/api/blog-posts/3?populate=image`;

  const headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'Insomnia/2021.4.1',
  });

  try {
    const res = await fetch(url, {
      headers: headers,
      cache: 'no-cache',
    });

    if (!res.ok) {
      return <div>Error</div>;
    }

    const response = await res.json();

    return <Page data={response.data} />;
  } catch (error) {
    console.error(error);
    return <div>Error</div>;
  }
}
