export default function HomeLayout({
  children,
  category,
  favorites,
  testimonials,
  community,
}: {
  children: React.ReactNode;
  category: React.ReactNode;
  favorites: React.ReactNode;
  testimonials: React.ReactNode;
  community: React.ReactNode;
}) {
  return (
    <>
      {children}
      {category}
      {favorites}
      {testimonials}
      {community}
    </>
  );
}
