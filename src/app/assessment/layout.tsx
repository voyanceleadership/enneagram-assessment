export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {children}
    </div>
  );
}