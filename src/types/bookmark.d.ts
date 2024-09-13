export default interface BookMark {
  id: string;
  ogCard: string;
  title: string;
  description: string;
  url: string;
  tags?: { id: string; name: string }[];
}
