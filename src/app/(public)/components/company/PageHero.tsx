interface PageHeroProps {
  title: string;
  subtitle: string;
  description: string;
}

export default function PageHero({ title, subtitle, description }: PageHeroProps) {
  return (
    <section className="py-20 px-4" style={{ backgroundColor: "#07163b" }}>
      <div className="max-w-4xl mx-auto text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mb-3">
          {title}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          {subtitle}
        </h1>
        <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
}
