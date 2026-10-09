export default function ProjectImport() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">New Analysis</h1>
      <div className="p-12 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-center bg-surface/50">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <span className="text-primary text-2xl">↑</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Upload Project Archive</h3>
        <p className="text-text-muted max-w-md mb-6">
          Upload a ZIP file containing your package.json, package-lock.json, requirements.txt, or pom.xml for dependency and vulnerability analysis.
        </p>
        <button className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-md font-medium transition-colors">
          Select ZIP File
        </button>
        <div className="mt-8 pt-6 border-t border-border w-full max-w-md">
          <p className="text-sm text-text-muted mb-4">Or try with sample data</p>
          <button className="w-full bg-surface-hover hover:bg-border text-text px-4 py-2 rounded-md transition-colors border border-border">
            Load Demo Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
