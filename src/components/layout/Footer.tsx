export default function Footer() {
  return (
    <footer className="border-t border-border py-10 mt-16">
      <div className="max-w-4xl mx-auto px-4 lg:px-0 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <p>Copyright &copy; MaQAronesia {new Date().getFullYear()}</p>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-white transition-colors">Privacidad</a>
          <a href="#" className="hover:text-white transition-colors">Términos</a>
        </div>
      </div>
    </footer>
  )
}
