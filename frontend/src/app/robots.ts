import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/portal/'],
        },
        sitemap: 'https://stratis.com/sitemap.xml',
    };
}
