import Button from './Button';

export default function Navigation() {
  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-foreground">Verif360</a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/questions" className="text-muted-foreground hover:text-foreground transition-colors">Problems</a>
            {/* <a href="/explore" className="text-muted-foreground hover:text-foreground transition-colors">Explore</a> */}
            <a href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blogs</a>
            <Button>Sign In</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}