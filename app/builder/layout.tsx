import './style.css'; // זה טוען את ה-CSS רק למסלול /builder

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // לא עוטפים בשום div כדי לא לשבור את ה-HTML הקיים
  return <>{children}</>;
}
