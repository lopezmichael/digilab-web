import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  return rss({
    title: 'DigiLab Blog',
    description: 'Player ratings, deck meta, and tournament history for competitive Digimon TCG players.',
    site: context.site,
    items: posts
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        author: post.data.author,
        link: `/blog/${post.slug}/`,
        categories: [post.data.category, ...(post.data.tags || [])],
      })),
    customData: `<language>en-us</language>`,
  });
}
