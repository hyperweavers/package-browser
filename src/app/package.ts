export class Package {
  name: string;
  version: string;
  desc: string;
  authorName: string;
  authorEmail: string;
  keywords: string[];
  homepage: string;
  repoType: string;
  repoUrl: string;
  npmUrl: string;
  publishDate: string;
  prettyPublishDate: string;
  lastModifiedTime?: string;
  prettyLastModifiedTime?: string;
  authorWebsite?: string;
  downloadUrl?: string;
  license?: string;
  readme?: string;
  dependencies?: string[];
  rating?: number;
  stars?: string[];
}
