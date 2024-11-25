export type ContentManagementDto = {
  id: number;
  name: string;
  type: string;
  slug: string;
  ownerId: number;
  publishedDate: Date;
  config?: any;
};
